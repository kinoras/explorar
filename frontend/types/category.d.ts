/** Category key. */
export type CategoryKey = string

/** Category details. */
export type CategoryDetails = { name: string; image: string }

/** Category object combining key and details. */
export type Category = {
    key: CategoryKey
} & CategoryDetails
