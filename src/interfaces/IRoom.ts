export interface IRoom{
    roomId: number;
    name: string;
    description: string;
    roomTypeName: string;
    maxSeatRow: number;
    maxSeatColumn: number;
    capacity: number;
    disabilityFriendly: boolean;
    comfortLevel: number;
    screeningsCount: number;
}