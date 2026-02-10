/**
 * HttpClient is the central configuration object for making HTTP requests.
 * It manages the base URL, authentication token, and global settings.
 * 
 * @example
 * ```typescript
 * const client = new HttpClient(null, 'https://api.example.com', false);
 * HttpClient.register(client);
 * 
 * // Later, update the auth token
 * client.authToken = 'your-bearer-token';
 * ```
 */
export default class HttpClient {
    /**
     * Gets the current authentication token.
     * This token will be used in the Authorization header as a Bearer token.
     */
    get authToken(): string | null {
        return this.#authToken;
    }

    /**
     * Sets the authentication token.
     * Updates the global token used for all subsequent requests.
     */
    set authToken(value: string | null) {
        this.#authToken = value;
    }

    /**
     * Gets the base URL for all HTTP requests.
     * The base URL should not include a trailing slash.
     */
    get baseUrl(): string {
        return this.#baseUrl;
    }

    /**
     * Gets whether responses should automatically extract a 'data' field.
     * When true, responses with a 'data' property will unwrap that field.
     */
    get dataField(): boolean {
        return this.#dataField;
    }

    #authToken: string | null;
    readonly #baseUrl: string;
    readonly #dataField: boolean;

    /**
     * Creates a new HttpClient instance.
     * 
     * @param authToken - Optional Bearer token for authentication. Can be null and set later.
     * @param baseUrl - The base URL for all HTTP requests (e.g., 'https://api.example.com'). 
     *                  Trailing slashes will be removed automatically.
     * @param dataField - When true, automatically extract 'data' field from responses. Default is false.
     * @throws {Error} If baseUrl is empty or not a string.
     * 
     * @example
     * ```typescript
     * const client = new HttpClient('my-token', 'https://api.example.com', false);
     * ```
     */
    constructor(authToken: string | null, baseUrl: string, dataField: boolean = false) {
        // Validate baseUrl
        if (!baseUrl || typeof baseUrl !== 'string') {
            throw new Error('HttpClient: baseUrl must be a non-empty string');
        }

        // Ensure baseUrl doesn't end with a slash for consistency
        baseUrl = baseUrl.replace(/\/$/, '');

        this.#authToken = authToken;
        this.#baseUrl = baseUrl;
        this.#dataField = dataField;
    }

    /**
     * Gets the global singleton HttpClient instance.
     * 
     * @returns The registered HttpClient instance.
     * @throws {Error} If no instance has been registered via HttpClient.register().
     */
    static get instance(): HttpClient {
        if (HttpClient.#instance === null) {
            throw new Error('There is currently no HttpClient instance registered. Register one using the HttpClient.register() function.');
        }

        return HttpClient.#instance;
    }

    static #instance: HttpClient | null = null;

    /**
     * Registers a global singleton HttpClient instance.
     * This instance will be used by default for all RequestBuilder instances.
     * 
     * @param client - The HttpClient instance to register globally.
     * 
     * @example
     * ```typescript
     * const client = new HttpClient(null, 'https://api.example.com');
     * HttpClient.register(client);
     * ```
     */
    static register(client: HttpClient): void {
        HttpClient.#instance = client;
    }
}
