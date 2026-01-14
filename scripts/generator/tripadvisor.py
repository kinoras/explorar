import argparse
import json
import os
import glob
import re
import sys
import requests
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

TRIPADVISOR_API_KEY = os.getenv("TRIPADVISOR_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

LANGUAGE = "zh_TW"
CURRENCY = "HKD"

openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


def get_next_id(output_dir: str) -> int:
    """
    Finds the next available internal place ID
    by scanning existing JSON files in the output directory.

    :param output_dir: Directory to scan for existing place JSON files
    :type output_dir: str
    :return: Next available internal place ID
    :rtype: int
    """
    used_ids = set()
    # Match any file starting with place_{number}
    files = glob.glob(os.path.join(output_dir, "place_*.json"))
    for f in files:
        basename = os.path.basename(f)
        # Regex to capture the ID part at the start
        match = re.match(r"place_(\d+)", basename)
        if match:
            used_ids.add(int(match.group(1)))

    next_id = 1
    while next_id in used_ids:
        next_id += 1
    return next_id


def get_existing_taids(output_dir: str) -> set[int]:
    """
    Scans the output directory for existing Tripadvisor location IDs
    already processed and returns a set of those IDs as strings.

    :param output_dir: Directory to scan for existing place JSON files
    :type output_dir: str
    :return: Set of existing Tripadvisor location IDs
    :rtype: set[int]
    """
    existing_taids = set()
    files = glob.glob(os.path.join(output_dir, "*.json"))
    for f in files:
        try:
            with open(f, "r", encoding="utf-8") as file:
                data = json.load(file)
                conn = data.get("_connection", {})
                if conn.get("type") == "tripadvisor":
                    lid = conn.get("locationId")
                    if lid:
                        existing_taids.add(int(lid))
        except Exception as e:
            # Ignore files that aren't valid JSON or don't match schema
            pass
    return existing_taids


def fetch_details(taid: int) -> dict | None:
    """
    Fetches location details from the Tripadvisor API for a given location ID.

    :param taid: Tripadvisor location ID
    :type taid: int
    :return: Location details as a dictionary or None if not found/error
    :rtype: dict | None
    """
    url = f"https://api.content.tripadvisor.com/api/v1/location/{taid}/details"
    params = {"language": LANGUAGE, "currency": CURRENCY, "key": TRIPADVISOR_API_KEY}
    try:
        response = requests.get(url, params=params)
        if response.status_code == 404:
            print(f"Place {taid} not found on Tripadvisor.")
            return None
        if response.status_code != 200:
            print(
                f"Error fetching details for {taid}: {response.status_code} {response.text}"
            )
            return None
        return response.json()
    except Exception as e:
        print(f"Exception details for {taid}: {e}")
        return None


def fetch_photos(taid: int) -> list[str]:
    """
    Fetches photo URLs from the Tripadvisor API for a given location ID.

    :param taid: Tripadvisor location ID
    :type taid: int
    :return: List of photo URLs
    :rtype: list[str]
    """
    url = f"https://api.content.tripadvisor.com/api/v1/location/{taid}/photos"
    params = {"language": LANGUAGE, "key": TRIPADVISOR_API_KEY}
    try:
        response = requests.get(url, params=params)
        if response.status_code != 200:
            print(
                f"Error fetching photos for {taid}: {response.status_code} {response.text}"
            )
            return []

        data = response.json()
        images = []
        if "data" in data:
            for item in data["data"]:
                # Try to get the original or largest image
                if "images" in item:
                    imgs = item["images"]
                    if "original" in imgs:
                        images.append(imgs["original"]["url"])
                    elif "large" in imgs:
                        images.append(imgs["large"]["url"])
                    elif "medium" in imgs:
                        images.append(imgs["medium"]["url"])
        return images
    except Exception as e:
        print(f"Exception photos for {taid}: {e}")
        return []


def generate_description(name: str, region: str | None, length: int = 50) -> str | None:
    """
    Generates a description for a place using OpenAI.

    :param name: Name of the place
    :type name: str
    :param region: Region of the place (hong-kong or macau)
    :type region: str | None
    :param length: Desired length of the description in characters
    :type length: int
    :return: Generated description
    :rtype: str | None
    """
    if not openai_client:
        return None

    _region = ""
    if region == "hong-kong":
        _region = "香港的"
    elif region == "macau":
        _region = "澳門的"

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful travel assistant. You reply in Traditional Chinese.",
                },
                {
                    "role": "user",
                    "content": f"請用繁體中文為{_region}「{name}」寫一段旅遊介紹。內容要精簡，大約{length}字，重點介紹其吸引遊客之處。",
                },
            ],
            max_tokens=500,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating description for {name}: {e}")
        return None


def map_data(details: dict, photos: list[str], new_id: int) -> tuple[dict, dict]:
    """
    Maps Tripadvisor API data to the internal place schema.

    :param details: Tripadvisor location details
    :type details: dict
    :param photos: List of photo URLs
    :type photos: list[str]
    :param new_id: New internal place ID
    :type new_id: int
    :return: Tuple of mapped place data and flags
    :rtype: tuple[dict, dict]
    """
    flags = {"missing_description": False, "missing_region": False}

    name = details.get("name_local") or details.get("name", "")

    # Region
    # Check ancestors location_ids (HK: 294217, Macau: 664891)
    region = None
    ancestors = details.get("ancestors", [])
    for ancestor in ancestors:
        try:
            aid = str(ancestor.get("location_id", ""))
        except:
            continue
        if aid == "664891":
            region = "macau"
            break
        elif aid == "294217":
            region = "hong-kong"
            break

    if not region:
        flags["missing_region"] = True

    # Description
    description_content = details.get("description", "")
    if description_content is None:
        description_content = ""

    source = "tripadvisor"

    if not description_content or description_content.strip() == "":
        flags["missing_description"] = True
        if openai_client:
            print(f"Description missing for {name}. Attempting to generate...")
            gen_desc = generate_description(name, region)
            if gen_desc:
                description_content = gen_desc
                source = "ai"
                flags["missing_description"] = False
                print(f"Generated description for {name}")
            else:
                print(f"Failed to generate description for {name}")
        else:
            print(f"No OpenAI API key; cannot generate description for {name}.")

    description = {"content": description_content, "source": source}

    # Category
    # TA returns category: {name: "attraction", localized_name: ...}
    category = "attraction"  # default
    if "category" in details and isinstance(details["category"], dict):
        category = details["category"].get("name", "attraction").lower()

    # Hours
    hours_data = {"timezone": details.get("timezone", "Asia/Hong_Kong")}
    regular_hours = []

    if "hours" in details and details["hours"] and "periods" in details["hours"]:
        for period in details["hours"]["periods"]:
            # Tripadvisor API Day: 0=Sunday, 1=Monday, ..., 6=Saturday
            # Target: 1=Monday, ..., 7=Sunday
            if "open" in period and "close" in period:
                raw_day = period.get("open", {}).get("day")
                if raw_day is not None:
                    # Logic: if 0 (Sun) -> 7. Else raw_day (1=Mon..6=Sat) maps to 1..6
                    day = 7 if raw_day == 0 else raw_day

                    raw_open = period.get("open", {}).get("time", "")
                    raw_close = period.get("close", {}).get("time", "")

                    # Format HHMM -> HH:MM
                    open_time = raw_open
                    if len(raw_open) == 4:
                        open_time = f"{raw_open[:2]}:{raw_open[2:]}"

                    close_time = raw_close
                    if len(raw_close) == 4:
                        close_time = f"{raw_close[:2]}:{raw_close[2:]}"

                    regular_hours.append(
                        {"day": day, "open": open_time, "close": close_time}
                    )

    if regular_hours:
        hours_data["regular"] = regular_hours

    # Location
    address_str = details.get("address_obj", {}).get("address_string", "")
    lat = details.get("latitude")
    lng = details.get("longitude")
    try:
        lat = float(lat) if lat else None
        lng = float(lng) if lng else None
    except:
        lat = None
        lng = None

    location = {"address": address_str, "latitude": lat, "longitude": lng}

    place_data = {
        "id": new_id,
        "name": name,
        "description": description,
        "region": region,
        "category": category,
        "hours": hours_data,
        "location": location,
        "images": photos,
        "_connection": {
            "type": "tripadvisor",
            "locationId": int(details.get("location_id")),
        },
    }

    # Optional fields
    # Rating
    if "rating" in details and details["rating"]:
        try:
            place_data["rating"] = float(details["rating"])
        except:
            pass

    # Ranking
    """
    Main execution function.
    Parses arguments, ensures environment setup, iterates through requested TAIDs,
    fetches data, maps it, and saves it to JSON files.
    """
    ranking_data = details.get("ranking_data")
    if ranking_data and "ranking" in ranking_data and ranking_data["ranking"]:
        try:
            place_data["ranking"] = int(ranking_data["ranking"])
        except:
            pass

    # Phone
    if details.get("phone"):
        place_data["phone"] = details.get("phone")

    # Website
    if details.get("website"):
        place_data["website"] = details.get("website")

    return place_data, flags


def main():
    parser = argparse.ArgumentParser(
        description="Generate place JSONs from Tripadvisor IDs"
    )
    parser.add_argument("-o", "--output", required=True, help="Destination directory")
    parser.add_argument(
        "-p", "--places", nargs="+", required=True, help="List of Tripadvisor IDs"
    )

    args = parser.parse_args()

    if not TRIPADVISOR_API_KEY:
        print("Error: TRIPADVISOR_API_KEY not found in environment.")
        print("Please create a .env file with TRIPADVISOR_API_KEY=your_key")
        sys.exit(1)

    if not os.path.exists(args.output):
        try:
            os.makedirs(args.output)
            print(f"Created output directory: {args.output}")
        except Exception as e:
            print(f"Error creating output directory {args.output}: {e}")
            sys.exit(1)

    existing_taids = get_existing_taids(args.output)

    print(f"Found {len(existing_taids)} existing Tripadvisor places.")

    for taid in args.places:
        if int(taid) in existing_taids:
            print(f"Skipping {taid}: Already exists.")
            continue

        print(f"Processing {taid}...")
        details = fetch_details(taid)
        if not details:
            print(f"Skipping {taid}: Failed to fetch details.")
            continue

        photos = fetch_photos(taid)

        # Get next ID right before mapping/writing to ensure no conflicts if running concurrent?
        # (Though this script is single threaded)
        next_id = get_next_id(args.output)
        place_data, flags = map_data(details, photos, next_id)

        # Check description for filename suffix
        suffix = "*"
        if flags["missing_description"]:
            suffix += "#"
        if flags["missing_region"]:
            suffix += "%"

        filename = f"place_{next_id}{suffix}.json"
        filepath = os.path.join(args.output, filename)

        try:
            json_str = json.dumps(place_data, indent=2, ensure_ascii=False)

            # Compact regular hours to single line
            json_str = re.sub(
                r'\{\s*"day":\s*(\d+),\s*"open":\s*"([^"]*)",\s*"close":\s*"([^"]*)"\s*\}',
                r'{ "day": \1, "open": "\2", "close": "\3" }',
                json_str,
                flags=re.MULTILINE | re.DOTALL,
            )

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(json_str)

            print(f"Generated {filename}")

            # Update cache
            existing_taids.add(str(taid))
        except Exception as e:
            print(f"Error writing file {filename}: {e}")


if __name__ == "__main__":
    main()
