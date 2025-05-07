export type Position = {
    lat: number;
    lng: number;
};

export function positionToString(pos: Position): string {
    return `${pos.lng},${pos.lat}`;
}
