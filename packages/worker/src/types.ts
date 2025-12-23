export type Worker<TBindings = unknown> = {
    fetch(req: Request, bindings: TBindings): Promise<Response>;
};

export type Route<TBindings = unknown> = (req: Request, bindings?: TBindings) => Promise<Response>;
export type Routes<TBindings = unknown> = Record<string, Route<TBindings>>;

export type Coords = {
    readonly latitude: number;
    readonly longitude: number;
};
