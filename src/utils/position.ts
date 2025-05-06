export type Position = {
    lat: number;
    lng: number;
};

export function positionToString(pos: Position): string {
    return `${pos.lat},${pos.lng}`;
}
