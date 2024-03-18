export interface UserGateway {
    deviceId: string;
    userId: string;
    userName: string;
    socketId?: string;
}

export interface RoomGateway {
    roomName: string;
    users: UserGateway[];
}
