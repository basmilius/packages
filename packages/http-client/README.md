<a href="https://bas.dev" target="_blank" rel="noopener">
	<img src="https://bmcdn.nl/assets/branding/logo.svg" alt="Bas-logo" height="48"/>
</a>

---

# `@basmilius/http-client`

A TypeScript HTTP client for Vue 3 projects with DTO (Data Transfer Object) support, automatic reactivity, and robust type safety.

## ✨ Features

- **Type-Safe HTTP Client**: Full TypeScript support with strict mode enabled
- **DTO System**: Decorator-based classes with automatic serialization/deserialization
- **Vue 3 Reactivity**: DTOs are automatically reactive using Vue's reactivity system
- **Fluent API**: Chainable RequestBuilder for constructing HTTP requests
- **Request Management**: Automatic request cancellation and error handling
- **Validation Errors**: Structured validation error parsing
- **File Downloads**: Built-in support for blob/file responses

## ⭐️ Prerequisites

- Bun >= 1.2.11
- Node >= 23
- Vue >= 3.6.0

## 🚀 Getting Started

### Installation

```bash
bun add @basmilius/http-client
```

### Basic Setup

```typescript
import { HttpClient } from '@basmilius/http-client';

// Create and register a global HttpClient instance
const client = new HttpClient(
  null,                          // Auth token (can be set later)
  'https://api.example.com',     // Base URL
  false                          // Extract 'data' field from responses
);

HttpClient.register(client);

// Set auth token when available
client.authToken = 'your-bearer-token';
```

## 📖 Usage Examples

### Making Simple Requests

```typescript
import { RequestBuilder } from '@basmilius/http-client';

// GET request
const response = await new RequestBuilder('/users')
  .run<User[]>();

console.log(response.data); // User[]

// POST request with body
const newUser = await new RequestBuilder('/users')
  .method('POST')
  .body({ name: 'John Doe', email: 'john@example.com' })
  .run<User>();

// PUT request with authentication
const updated = await new RequestBuilder('/users/123')
  .method('PUT')
  .bearerToken('custom-token')  // Override global token
  .body({ name: 'Jane Doe' })
  .run<User>();

// DELETE request
await new RequestBuilder('/users/123')
  .method('DELETE')
  .runEmpty();
```

### Query Parameters

```typescript
import { QueryString } from '@basmilius/http-client';

const queryString = QueryString.builder()
  .append('page', 1)
  .append('limit', 10)
  .append('search', 'john')
  .appendArray('tags', ['admin', 'active']);

const response = await new RequestBuilder('/users')
  .queryString(queryString)
  .run<User[]>();
```

### Using DTOs with Decorators

```typescript
import { dto } from '@basmilius/http-client';

@dto
class User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  constructor(id: number, name: string, email: string, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }

  static fromJson(data: any): User {
    return new User(
      data.id,
      data.name,
      data.email,
      new Date(data.created_at)
    );
  }
}

// Use adapter to transform response
const response = await new RequestBuilder('/users/123')
  .runAdapter<User>(User.fromJson);

console.log(response.data.name); // Fully typed User instance
```

### Paginated Responses

```typescript
import { HttpAdapter } from '@basmilius/http-client';

const response = await new RequestBuilder('/users')
  .queryString(QueryString.builder().append('page', 1))
  .runPaginatedAdapter<User>(User.fromJson);

const paginated = response.data;
console.log(paginated.items);     // User[]
console.log(paginated.page);      // 1
console.log(paginated.total);     // Total items count
console.log(paginated.pages);     // Total pages
```

### Error Handling

```typescript
import { RequestError, ValidationError } from '@basmilius/http-client';

try {
  const response = await new RequestBuilder('/users')
    .method('POST')
    .body({ email: 'invalid' })
    .run<User>();
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    console.log(error.errors);  // { email: ValidationError, ... }
    console.log(error.params);  // Field-level parameters
  } else if (error instanceof RequestError) {
    // Handle other request errors
    console.log(error.code);              // Error code from backend
    console.log(error.error);             // Error type
    console.log(error.errorDescription);  // Human-readable message
    console.log(error.statusCode);        // HTTP status code
  }
}
```

### Request Cancellation

```typescript
// Automatic cancellation of previous requests with same identifier
const searchSymbol = Symbol('search');

// First request
new RequestBuilder('/search')
  .queryString(QueryString.builder().append('q', 'first'))
  .autoCancel(searchSymbol)
  .run();

// This automatically cancels the first request
new RequestBuilder('/search')
  .queryString(QueryString.builder().append('q', 'second'))
  .autoCancel(searchSymbol)
  .run();

// Manual cancellation with AbortController
const controller = new AbortController();

new RequestBuilder('/users')
  .signal(controller.signal)
  .run();

// Cancel the request
controller.abort();
```

### File Downloads

```typescript
const blobResponse = await new RequestBuilder('/reports/123/download')
  .runBlob();

// Create download link
const url = URL.createObjectURL(blobResponse.blob);
const link = document.createElement('a');
link.href = url;
link.download = blobResponse.filename; // Parsed from Content-Disposition header
link.click();
URL.revokeObjectURL(url);
```

### Creating a Base Service Class

```typescript
import { BaseService, RequestBuilder } from '@basmilius/http-client';

export class UserService extends BaseService {
  async getAll(): Promise<User[]> {
    return (await this.builder('/users')
      .runArrayAdapter(User.fromJson))
      .data;
  }

  async getById(id: number): Promise<User> {
    return (await this.builder(`/users/${id}`)
      .runAdapter(User.fromJson))
      .data;
  }

  async create(data: Partial<User>): Promise<User> {
    return (await this.builder('/users')
      .method('POST')
      .body(data)
      .runAdapter(User.fromJson))
      .data;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return (await this.builder(`/users/${id}`)
      .method('PUT')
      .body(data)
      .runAdapter(User.fromJson))
      .data;
  }

  async delete(id: number): Promise<void> {
    await this.builder(`/users/${id}`)
      .method('DELETE')
      .runEmpty();
  }
}

// Usage
const userService = new UserService();
const users = await userService.getAll();
```

## 🔧 Advanced Configuration

### Custom Headers

```typescript
const response = await new RequestBuilder('/api/endpoint')
  .header('X-Custom-Header', 'value')
  .header('X-Request-ID', crypto.randomUUID())
  .run();
```

### FormData Uploads

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My file');

const response = await new RequestBuilder('/upload')
  .method('POST')
  .body(formData)  // Content-Type boundary set automatically
  .run();
```

## 🛠️ Development

### Build the Package

```bash
bun --cwd packages/http-client build
```

## 📝 API Reference

For detailed API documentation, see the JSDoc comments in the source code or your IDE's autocomplete.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👤 Author

Created by [Basmilius](https://github.com/basmilius)

## 💖 Support

If you find this package helpful, consider [sponsoring](https://github.com/sponsors/basmilius)!
