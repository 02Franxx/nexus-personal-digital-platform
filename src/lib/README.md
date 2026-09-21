# Server-side libraries

`env.ts` is the first boundary in the server-side data layer. It validates
environment variables at the point a server feature needs them and prevents
missing configuration from becoming a late `undefined` error.

Do not import `env.ts` from a Client Component, and never expose its values in
browser-rendered props or public API responses.
