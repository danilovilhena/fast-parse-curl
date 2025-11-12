# fast-parse-curl

Parse cURL commands into structured JSON objects.

## Installation

```bash
npm install fast-parse-curl
```

## Usage

### ES Modules

```typescript
import { parseCurl } from "fast-parse-curl";

const result = parseCurl(
  'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"John"}\''
);
console.log(result);
```

## Output Structure

The `parseCurl` function returns an object with the following structure:

```typescript
interface ParseCurlResult {
  method: string /* HTTP method (GET, POST, PUT, DELETE, etc.) */;
  url: string /* The request URL */;
  headers: Record<string, string> /* HTTP headers as key-value pairs */;
  body:
    | object
    | string
    | null /* Request body (parsed JSON object, string, or null) */;
  form: Record<string, string> /* Form data fields (multipart/form-data) */;
  auth: {
    type: "basic" | "digest" | "bearer";
    username: string;
    password: string;
    token: string;
  };
  cookies: Record<string, string> /* Cookies as key-value pairs */;
  options: {
    followRedirects: boolean /* --location / -L flag */;
    insecure: boolean /* --insecure / -k flag */;
    compressed: boolean /* --compressed flag */;
    timeout: number | null /* --max-time value */;
    connectTimeout: number | null /* --connect-timeout value */;
    verbose: boolean /* --verbose / -v flag */;
  };
}
```

## Examples

### Basic GET Request

```typescript
const result = parseCurl("curl https://api.example.com");
/* {
 *   method: 'GET',
 *   url: 'https://api.example.com',
 *   headers: {},
 *   body: null,
 *   form: {},
 *   auth: { type: 'basic', username: '', password: '', token: '' },
 *   cookies: {},
 *   options: { followRedirects: false, insecure: false, ... }
 * }
 */
```

### POST with JSON Body

```typescript
const result = parseCurl(
  'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"John","age":30}\''
);
/* {
 *   method: 'POST',
 *   url: 'https://api.example.com/users',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: { name: 'John', age: 30 },
 *   ...
 * }
 */
```

### With Authentication

```typescript
const result = parseCurl("curl -u username:password https://api.example.com");
/* {
 *   auth: { type: 'basic', username: 'username', password: 'password', token: '' },
 *   ...
 * }
 */
```

### With Bearer Token

```typescript
const result = parseCurl(
  'curl -H "Authorization: Bearer abc123" https://api.example.com'
);
/* {
 *   auth: { type: 'bearer', username: '', password: '', token: 'abc123' },
 *   ...
 * }
 */
```

### With Headers and Cookies

```typescript
const result = parseCurl(
  'curl -H "Content-Type: application/json" -b "sessionId=abc123" https://api.example.com'
);
/* {
 *   headers: { 'Content-Type': 'application/json' },
 *   cookies: { sessionId: 'abc123' },
 *   ...
 * }
 */
```

### File Uploads (Multipart Form Data)

```typescript
const result = parseCurl(
  'curl -F "file=@/path/to/image.jpg" -F "name=My Image" https://api.example.com/upload'
);
/* {
 *   method: 'POST',
 *   form: { file: '@/path/to/image.jpg', name: 'My Image' },
 *   ...
 * }
 */
```

### Binary Data

```typescript
const result = parseCurl(
  'curl --data-binary "@/path/to/file.bin" https://api.example.com/upload'
);
/* {
 *   method: 'POST',
 *   body: '@/path/to/file.bin',
 *   ...
 * }
 */
```

### Multiple File Uploads

```typescript
const result = parseCurl(
  'curl -F "avatar=@/path/to/avatar.jpg" -F "document=@/path/to/doc.pdf" https://api.example.com/upload'
);
/* {
 *   form: {
 *     avatar: '@/path/to/avatar.jpg',
 *     document: '@/path/to/doc.pdf'
 *   },
 *   ...
 * }
 */
```

### Multi-line Command

```typescript
const result = parseCurl(`
  curl -X POST \\
    -H "Content-Type: application/json" \\
    -d '{"key":"value"}' \\
    https://api.example.com
`);
```

## License

MIT
