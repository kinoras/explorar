from app.integrations.fares.data import MACAU_LRT_STATIONS, MACAU_LRT_DISTANCE_TABLE


def test_lrt_distance_table_format():
    station_count = len(MACAU_LRT_STATIONS)
    assert station_count > 0

    # Check dimensions
    assert len(MACAU_LRT_DISTANCE_TABLE) == station_count
    assert all(len(row) == station_count for row in MACAU_LRT_DISTANCE_TABLE)

    # Check symmetry
    assert all(
        MACAU_LRT_DISTANCE_TABLE[i][j] == MACAU_LRT_DISTANCE_TABLE[j][i]
        for i in range(station_count)
        for j in range(station_count)
    )
