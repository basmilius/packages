export default function <F extends ((...args: any[]) => any)>(fn: F, interval: number, $this?: object): Function {
    let resolvers = [], rejecters = [], timeout = null;

    return (...args: any[]) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            try {
                let result = fn.apply($this, args);
                resolvers.forEach(resolve => resolve(result));
            } catch (err) {
                rejecters.forEach(reject => reject(err));
            }

            resolvers = [];
            rejecters = [];
        }, interval);

        return new Promise((resolve, reject) => {
            resolvers.push(resolve);
            rejecters.push(reject);
        });
    };
}
