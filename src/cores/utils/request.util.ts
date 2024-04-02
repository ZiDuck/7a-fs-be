export function getIp(req: any): string {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

export function getUserAgent(req: any): string {
    return req.headers['user-agent'];
}

export function getPathAPI(req: any): string {
    return req.path;
}
