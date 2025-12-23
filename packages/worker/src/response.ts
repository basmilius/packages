export function error(code: number, error: string, errorDescription: string, status: number): Response {
    return json({
        code,
        error,
        error_description: errorDescription
    }, {}, status);
}

export function json(json: object, headers: HeadersInit = {}, status: number = 200): Response {
    const date = new Date();
    const expires = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

    headers = headers || {};
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Content-Type'] = 'application/json';

    if (status === 200) {
        headers['Cache-Control'] = 'public, max-age=2628000, immutable';
        headers['Date'] = date.toISOString();
        headers['Expires'] = expires.toISOString();
    }

    return new Response(JSON.stringify(json), {
        headers,
        status
    });
}
