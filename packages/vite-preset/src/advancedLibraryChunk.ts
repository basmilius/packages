type AdvancedChunk = {
    readonly name: string;
    readonly test: (moduleId: string) => boolean;
};

export default (name: string, moduleIds: string[]): AdvancedChunk => ({
    name: name,
    test: moduleId => !!moduleIds.find(module => moduleId.includes(`/node_modules/${module}/`))
});
