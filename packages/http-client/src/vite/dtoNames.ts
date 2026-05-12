import type { Plugin } from 'vite';

const TRANSFORM_EXTENSIONS = /\.[mc]?[jt]sx?(?:\?.*)?$/;

export type Options = {
    readonly decorator?: string;
    readonly filter?: (id: string) => boolean;
};

export default function dtoNames(options: Options = {}): Plugin {
    const decorator = options.decorator ?? 'dto';
    const filter = options.filter ?? defaultFilter;
    const sourcePattern = buildSourcePattern(decorator);
    const builtPattern = buildBuiltPattern(decorator);
    const needle = `@${decorator}`;
    const builtNeedle = `__decorate`;

    return {
        name: '@basmilius/http-client:dto-names',
        enforce: 'pre',
        transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            const hasSource = code.includes(needle);
            const hasBuilt = code.includes(builtNeedle) && code.includes(decorator);

            if (!hasSource && !hasBuilt) {
                return null;
            }

            const transformed = transform(code, sourcePattern, builtPattern, decorator);

            if (transformed === null) {
                return null;
            }

            return {
                code: transformed,
                map: null
            };
        }
    };
}

function buildSourcePattern(decorator: string): RegExp {
    return new RegExp(
        `(@${decorator}\\b(?![\\(\\.])\\s+(?:export\\s+(?:default\\s+)?)?(?:abstract\\s+)?class\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\b[^{]*\\{)`,
        'g'
    );
}

function buildBuiltPattern(decorator: string): RegExp {
    return new RegExp(
        `\\b([A-Za-z_$][A-Za-z0-9_$]*)\\s*=\\s*__decorate\\(\\s*\\[\\s*(${decorator}(?:_default|\\$\\d+)?)\\s*\\]\\s*,\\s*\\1\\s*\\)`,
        'g'
    );
}

function defaultFilter(id: string): boolean {
    return TRANSFORM_EXTENSIONS.test(id);
}

function transform(code: string, sourcePattern: RegExp, builtPattern: RegExp, decorator: string): string | null {
    let next = code;
    let didChange = false;

    sourcePattern.lastIndex = 0;
    if (sourcePattern.test(next)) {
        sourcePattern.lastIndex = 0;
        next = next.replace(sourcePattern, (_match, head: string, name: string) => `${head} static { Object.defineProperty(this, 'name', { value: '${name}', configurable: true }); }`);
        didChange = true;
    }

    builtPattern.lastIndex = 0;
    if (builtPattern.test(next)) {
        builtPattern.lastIndex = 0;
        next = next.replace(builtPattern, (_match, name: string, ref: string) => `Object.defineProperty(${name}, 'name', { value: '${name}', configurable: true }), ${name} = __decorate([${ref}], ${name})`);
        didChange = true;
    }

    return didChange ? next : null;
}
