export interface AccessTokenPayload {
    id: string;
    iat: number;
    exp: number;
    aud: string;
    iss: string;
    sub: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
    tokenId: string;
}
