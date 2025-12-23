export type Worker = {
    fetch(req: Request): Promise<Response>;
};

export type Route = (req: Request) => Promise<Response>;
export type Routes = Record<string, Route>;

export type Coords = {
    readonly latitude: number;
    readonly longitude: number;
};
