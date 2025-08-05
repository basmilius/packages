export const FrameType = {
    Unknown: 0,
    Noop: 1,

    PS_Start: 3,
    PS_Next: 4,
    PV_Start: 5,
    PV_Next: 6,

    U_OPACK: 7,
    E_OPACK: 8,
    P_OPACK: 9,

    PA_Request: 10,
    PA_Response: 11,

    SessionStartRequest: 16,
    SessionStartResponse: 17,
    SessionData: 18,

    FamilyIdentityRequest: 32,
    FamilyIdentityResponse: 33,
    FamilyIdentityUpdate: 34
} as const;

export const MessageType = {
    Event: 1,
    Request: 2,
    Response: 3
};

export const DecodeOPackFrameTypes: number[] = [
    FrameType.PS_Start,
    FrameType.PS_Next,
    FrameType.PV_Start,
    FrameType.PV_Next,

    FrameType.U_OPACK,
    FrameType.E_OPACK,
    FrameType.P_OPACK
];
