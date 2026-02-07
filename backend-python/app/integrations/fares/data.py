MACAU_GEOFENCE_POLYLINES = {
    # Areas
    "MACAU": "_kpfCqv}sTdCsCnJShCGpJUbUvDpKfBbMtBhd@lZxBaEnGjEzK`DnHX`DJ`YyF?q|BedAieCo|A?IzAeLOoKtBqDrEsRxh@iRls@ABgCnJl@xAm@|BKb@eEUB`@RlCf@dALl@Hj@@^?d@Ef@S|@LzBRPk@tB?|ACJAlEUx@EdD~B`EvJxDZHvBnABHvAn@MXEJLH`@\DLDJ?z@yBfP?hJB`AJx@Nt@Hp@l@zBpDhHfEcAPCzHiBfMgC",
    "TAIPA": "{x`fCmo`tTkNu}@}EiBSMIMCWVeRo@k@wAOoS_@ZmTIyCOGIUAW?SIk@KMMQEQMcASYYKKMYcA]i@Ga@Ea@YU[U{@_AWM]_@WQo@eAa@o@e@i@[SEGGOIm@PYL[Bc@MK@g@Eq@Ic@@c@\wFUmASMK[AYAM@k@Ak@M_@E[Dm@LYRC`@Oy@qBCGs@uA_BbAKFK@MEIImCcFMHE@K@WAMEKKs@_AkFyJgCmEoBwDW_ACu@@e@BWJc@CI@ISK?cHitD??tjIb}Aam@xhA_~@zlBhC",
    "COLOANE": "{x`fCmo`tTdjA~Ati@cGlGyP?abCohCohCavAxm@lJvPeH~FOb@RJAHBHKb@CVAd@Bt@V~@nBvDfClEjFxJr@~@JJLDV@JADALIlCbFHHLDJAJG~AcAr@tABFx@pBa@NSBMXEl@DZL^@j@Aj@@L@XJZRLTlA]vFAb@Hb@Dp@Af@LJCb@MZQXHl@FNDFZRd@h@`@n@n@dAVP\\^VLz@~@ZTXTD`@F`@\\h@XbAJLXJRXLbADPLPJLHj@?R@VHTNFHxC[lTnS^vANn@j@WdRBVHLRL|EhBjNt}@",
    "UM": "qmbfCme`tT@`@nAxh@l@n@dfAuBnBcAbQq[CqDA?Q?I?yAEiACyAEiACwCIsXq@Y?aKWwEKiGOqDKuBE_BAoCEgFEo@Cw@A@Z",
    # Ports
    "HZMB": "cinfCezdtT?g_Aql@??f_Apl@?",
    "TAIPAFERRY": "szgfCyvetTxF??}FyF??|F",
    "AIRPORT": "c~ffCcqetTbAVrA\rAt@dAhAr@~Af@SaA_CkCwBsDy@Kn@",
    "HENGQIN": "g`dfCqi_tTno@??o^oo@??n^",
}

MACAU_LRT_STATIONS = [
    # Taipa Line
    ("媽閣", "Barra", "Barra"),
    ("海洋", "Oceano", "Ocean"),
    ("馬會", "Jockey Clube", "Jockey Club"),
    ("運動場", "Estádio", "Stadium"),
    ("排角", "Pai Kok", "Pai Kok"),
    ("路氹西", "Cotai Oeste", "Cotai West"),
    ("蓮花", "Lótus", "Lotus"),
    ("協和醫院", "Hospital Union", "Union Hospital"),
    ("東亞運", "Jogos da Ásia Oriental", "East Asian Games"),
    ("路氹東", "Cotai Leste", "Cotai East"),
    ("科大", "UCTM", "MUST"),
    ("機場", "Aeroporto", "Airport"),
    ("氹仔碼頭", "Terminal Marítimo da Taipa", "Taipa Ferry Terminal"),
    # Seac Pai Van Line
    ("石排灣", "Seac Pai Van", "Seac Pai Van"),
    # Hengqin Line
    ("橫琴", "Hengqin", "Hengqin"),
]


MACAU_LRT_DISTANCE_TABLE = [
    [0, 2, 3, 4, 5, 6, 7, 8, 8, 9,10,11,12, 9, 9],
    [2, 0, 1, 2, 3, 4, 5, 6, 6, 7, 8, 9,10, 7, 7],
    [3, 1, 0, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 6, 6],
    [4, 2, 1, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 5, 5],
    [5, 3, 2, 1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 4, 4],
    [6, 4, 3, 2, 1, 0, 1, 2, 2, 3, 4, 5, 6, 3, 3],
    [7, 5, 4, 3, 2, 1, 0, 1, 1, 2, 3, 4, 5, 2, 2],
    [8, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 1, 3],
    [8, 6, 5, 4, 3, 2, 1, 1, 0, 1, 2, 3, 4, 2, 3],
    [9, 7, 6, 5, 4, 3, 2, 2, 1, 0, 1, 2, 3, 3, 4],
    [10,8, 7, 6, 5, 4, 3, 3, 2, 1, 0, 1, 2, 4, 5],
    [11,9, 8, 7, 6, 5, 4, 4, 3, 2, 1, 0, 1, 5, 6],
    [12,10,9, 8, 7, 6, 5, 5, 4, 3, 2, 1, 0, 6, 7],
    [9, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 0, 4],
    [9, 7, 6, 5, 4, 3, 2, 3, 3, 4, 5, 6, 7, 4, 0],
]  # fmt: skip
