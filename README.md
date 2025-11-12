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

### CommonJS

```javascript
const { parseCurl } = require("fast-parse-curl");

const result = parseCurl(
  'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"John"}\''
);
console.log(result);
```

### CommonJS (explicit)

```javascript
const { parseCurl } = require("fast-parse-curl/cjs");

const result = parseCurl("curl https://api.example.com");
console.log(result);
```

## Examples

### Basic GET Request

```typescript
const result = parseCurl("curl https://api.example.com");
// {
//   method: 'GET',
//   url: 'https://api.example.com',
//   headers: {},
//   body: null,
//   form: {},
//   auth: { type: 'basic', username: '', password: '', token: '' },
//   cookies: {},
//   options: { followRedirects: false, insecure: false, ... }
// }
```

### POST with JSON Body

```typescript
const result = parseCurl(
  'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"John","age":30}\''
);
// {
//   method: 'POST',
//   url: 'https://api.example.com/users',
//   headers: { 'Content-Type': 'application/json' },
//   body: { name: 'John', age: 30 },
//   ...
// }
```

### With Authentication

```typescript
const result = parseCurl("curl -u username:password https://api.example.com");
// {
//   auth: { type: 'basic', username: 'username', password: 'password', token: '' },
//   ...
// }
```

### With Bearer Token

```typescript
const result = parseCurl(
  'curl -H "Authorization: Bearer abc123" https://api.example.com'
);
// {
//   auth: { type: 'bearer', username: '', password: '', token: 'abc123' },
//   ...
// }
```

### With Headers and Cookies

```typescript
const result = parseCurl(
  'curl -H "Content-Type: application/json" -b "sessionId=abc123" https://api.example.com'
);
// {
//   headers: { 'Content-Type': 'application/json' },
//   cookies: { sessionId: 'abc123' },
//   ...
// }
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

## Author

**Danilo Vilhena**

- Email: danilo.vilhena@edu.unifor.br
- GitHub: [@danilovilhena](https://github.com/danilovilhena)
