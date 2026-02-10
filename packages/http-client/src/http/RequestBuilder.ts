import { DateTime } from 'luxon';
import { HttpAdapter } from '../adapter';
import { BlobResponse, Paginated, RequestError } from '../dto';
import type { HttpMethod, HttpStatusCode } from '../type';
import BaseResponse from './BaseResponse';
import HttpClient from './HttpClient';
import type QueryString from './QueryString';
import RequestAbortedError from './RequestAbortedError';

const abortControllers: Record<symbol, AbortController> = {};

export default class RequestBuilder {
    get client(): HttpClient {
        return this.#client;
    }

    get options(): RequestInit {
        return this.#options;
    }

    get path(): string {
        return this.#path;
    }

    set path(value: string) {
        this.#path = value;
    }

    get query(): QueryString | null {
        return this.#query;
    }

    set query(value: QueryString | null) {
        this.#query = value;
    }

    readonly #client: HttpClient;
    #autoCancelIdentifier: symbol | null = null;
    #path: string;
    #options: RequestInit = {};
    #query: QueryString | null = null;

    constructor(path: string, client?: HttpClient) {
        this.#client = client ?? HttpClient.instance;
        this.#options.cache = 'no-cache';
        this.#options.method = 'GET';
        this.#path = path;
    }

    /**
     * Enables automatic cancellation of previous requests with the same identifier.
     * When a new request is made with the same identifier, the previous one is aborted.
     * 
     * @param identifier - A unique symbol to identify this request group.
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * const searchSymbol = Symbol('search');
     * builder.autoCancel(searchSymbol).run();
     * ```
     */
    public autoCancel(identifier: symbol): RequestBuilder {
        this.#autoCancelIdentifier = identifier;

        return this;
    }

    /**
     * Sets the Bearer token for authentication.
     * If no token is provided, uses the token from the HttpClient instance.
     * 
     * @param token - Optional Bearer token. Accepts both undefined and null for flexibility:
     *                - undefined: Uses the HttpClient's authToken (default behavior)
     *                - null: Explicitly removes the Authorization header
     *                - string: Sets the provided token
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * // Use HttpClient's token
     * builder.bearerToken().run();
     * 
     * // Use custom token
     * builder.bearerToken('my-access-token').run();
     * 
     * // Explicitly remove authorization
     * builder.bearerToken(null).run();
     * ```
     */
    public bearerToken(token?: string | null): RequestBuilder {
        const actualToken = token ?? this.#client.authToken;

        if (actualToken) {
            return this.header('Authorization', `Bearer ${actualToken}`);
        }

        if (this.#options.headers && 'Authorization' in this.#options.headers) {
            delete (this.#options.headers as Record<string, string>)['Authorization'];
        }

        return this;
    }

    /**
     * Sets the request body. Automatically handles JSON serialization and FormData.
     * 
     * @param body - The request body. Can be BodyInit, FormData, or a plain object/array.
     * @param contentType - The Content-Type header. Default is 'application/octet-stream'.
     *                      Set to null to let the browser set it (useful for FormData).
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * // JSON body
     * builder.body({ name: 'John' }).run();
     * 
     * // FormData
     * const formData = new FormData();
     * formData.append('file', file);
     * builder.body(formData).run();
     * ```
     */
    public body(body: BodyInit | FormData | object | null, contentType: string | null = 'application/octet-stream'): RequestBuilder {
        if (body instanceof FormData) {
            // note: this allows browsers to set formdata with their custom boundary.
            contentType = null;
        } else if (Array.isArray(body) || typeof body === 'object') {
            body = JSON.stringify(body);
            contentType = 'application/json';
        }

        this.#options.body = body;

        if (contentType !== null) {
            return this.header('Content-Type', contentType);
        }

        return this;
    }

    /**
     * Sets a request header.
     * 
     * @param name - The header name (e.g., 'Content-Type', 'Authorization').
     * @param value - The header value.
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * builder.header('X-Custom-Header', 'value').run();
     * ```
     */
    public header(name: string, value: string): RequestBuilder {
        this.#options.headers = this.#options.headers || {};
        (this.#options.headers as Record<string, string>)[name] = value;

        return this;
    }

    /**
     * Sets the HTTP method.
     * 
     * @param method - The HTTP method (GET, POST, PUT, DELETE, etc.).
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * builder.method('POST').body({ data: 'test' }).run();
     * ```
     */
    public method(method: HttpMethod): RequestBuilder {
        this.#options.method = method.toUpperCase();

        return this;
    }

    /**
     * Sets the query string parameters.
     * 
     * @param queryString - A QueryString instance with the query parameters.
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * const qs = QueryString.builder()
     *   .append('page', 1)
     *   .append('limit', 10);
     * builder.queryString(qs).run();
     * ```
     */
    public queryString(queryString: QueryString): RequestBuilder {
        this.#query = queryString;

        return this;
    }

    /**
     * Sets an abort signal for the request.
     * 
     * @param signal - An AbortSignal to cancel the request, or null to remove.
     * @returns This RequestBuilder for method chaining.
     * 
     * @example
     * ```typescript
     * const controller = new AbortController();
     * builder.signal(controller.signal).run();
     * // Later: controller.abort();
     * ```
     */
    public signal(signal: AbortSignal | null = null): RequestBuilder {
        this.#options.signal = signal;

        return this;
    }

    public async fetch<TResult>(): Promise<TResult> {
        return this.#execute()
            .then(r => r.json());
    }

    public async fetchBlob(): Promise<BlobResponse> {
        let response = await this.#execute();

        if (response.status !== 200) {
            const data = await response.json();

            if ('code' in data && 'error' in data && 'error_description' in data) {
                throw new RequestError(data.code, data.error, data.error_description, response.status as HttpStatusCode);
            }

            throw new RequestError(-1, 'failed_without_info', 'Request failed without any information from the backend.', response.status as HttpStatusCode);
        }

        const contentDisposition = response.headers.get('content-disposition');
        let filename = contentDisposition
            ? HttpAdapter.parseFileNameFromContentDispositionHeader(contentDisposition)
            : `download-${DateTime.now().toFormat('yyyy-MM-dd HH-mm-ss')}`;

        return new BlobResponse(
            await response.blob(),
            filename
        );
    }

    public async run<TResult extends {}>(): Promise<BaseResponse<TResult>> {
        const {data, response} = await this.#executeSafe<TResult>();

        // In run(), we expect non-null data; throw if null
        if (data === null) {
            throw new RequestError(-1, 'no_data', 'Expected data in response but received null', response.status as HttpStatusCode);
        }

        return new BaseResponse(data, response);
    }

    public async runAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult>> {
        const {data, response} = await this.#executeSafe<object>();

        // In runAdapter(), we expect non-null data; throw if null
        if (data === null) {
            throw new RequestError(-1, 'no_data', 'Expected data in response but received null', response.status as HttpStatusCode);
        }

        return new BaseResponse(adapterMethod(data), response);
    }

    public async runArrayAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult[]>> {
        return this.runAdapter<TResult[]>((data: object) => {
            if (!Array.isArray(data)) {
                throw new Error('Expected array data for runArrayAdapter');
            }
            return data.map(adapterMethod);
        });
    }

    public async runEmpty(): Promise<BaseResponse<null>> {
        return await this.#executeSafe<null>();
    }

    public async runPaginatedAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<Paginated<TResult>>> {
        return this.runAdapter<Paginated<TResult>>(response => HttpAdapter.parsePaginatedAdapter(response, adapterMethod));
    }

    public async runData<TResult>(): Promise<BaseResponse<TResult | null>> {
        return await this.#executeSafe<TResult>();
    }

    public async runDataKey<TResult extends object, TKey extends keyof TResult = keyof TResult>(key: TKey): Promise<BaseResponse<TResult[TKey]>> {
        const {data, response} = await this.#executeSafe<TResult>();

        // In runDataKey(), we expect non-null data; throw if null
        if (data === null) {
            throw new RequestError(-1, 'no_data', 'Expected data in response but received null', response.status as HttpStatusCode);
        }

        return new BaseResponse(data[key] as TResult[TKey], response);
    }

    public async runStatusCode(): Promise<HttpStatusCode> {
        const response = await this.#executeSafe<never>();

        return response.statusCode;
    }

    async #execute(): Promise<Response> {
        if (this.#autoCancelIdentifier !== null) {
            if (this.#autoCancelIdentifier in abortControllers) {
                abortControllers[this.#autoCancelIdentifier].abort(new RequestAbortedError());
            }

            const controller = new AbortController();
            abortControllers[this.#autoCancelIdentifier] = controller;

            this.signal(controller.signal);
        }

        let path = this.path;

        if (this.query !== null) {
            path += `?${this.query.build()}`;
        }

        try {
            const response = await fetch(this.client.baseUrl + path, this.options);

            // Clean up abort controller after successful request
            if (this.#autoCancelIdentifier !== null && this.#autoCancelIdentifier in abortControllers) {
                delete abortControllers[this.#autoCancelIdentifier];
            }

            return response;
        } catch (error) {
            // Clean up abort controller on error
            if (this.#autoCancelIdentifier !== null && this.#autoCancelIdentifier in abortControllers) {
                delete abortControllers[this.#autoCancelIdentifier];
            }

            // Wrap network errors (timeout, DNS failure, etc.) in RequestError
            if (error instanceof RequestAbortedError) {
                throw error;
            }
            throw new RequestError(
                -1,
                'network_error',
                error instanceof Error ? error.message : 'Network request failed',
                0 as HttpStatusCode
            );
        }
    }

    async #executeSafe<TResult>(): Promise<BaseResponse<TResult | null>> {
        return await this
            .#execute()
            .then(response => RequestBuilder.#handleResponse<TResult>(response, this.client.dataField));
    }

    static async #handleResponse<TResult>(response: Response, dataField: boolean): Promise<BaseResponse<TResult | null>> {
        if (response.status === 204) {
            return new BaseResponse(null, response);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.startsWith('application/json')) {
            const data = await response.json();

            if ('code' in data && 'error' in data && 'error_description' in data) {
                if ('errors' in data) {
                    throw HttpAdapter.parseValidationError(data);
                }

                throw HttpAdapter.parseRequestError(data, response.status as HttpStatusCode);
            }

            if (dataField && 'data' in data) {
                return new BaseResponse(data.data as TResult, response);
            }

            return new BaseResponse(data, response);
        }

        if (response.status === 401 || response.status === 403) {
            return new BaseResponse(null, response);
        }

        const data = await response.text();

        if (data.length === 0 && response.status >= 200 && response.status < 300) {
            return new BaseResponse(null, response);
        }

        throw new RequestError(-1, 'not_a_json_response', 'The response was not a JSON response.', response.status as HttpStatusCode);
    }
}
