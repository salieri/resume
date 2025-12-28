
## TypeScript
### Type Assertions
* When data is received from an external source, such as JSON from an API, read from a file, or parsed with `JSON.parse()`, do not simply assert the data type using the `as` keyword.
* Instead, use `zod` schemas to validate and parse the data, ensuring it conforms to the expected structure and types.
* This approach helps catch errors early and prevents runtime issues caused by unexpected data formats.
* When creating a `zod` schema, name both the constant and its type using the `PascalCase` convention without a `Schema` suffix. For example, for user data, name the schema `User` and the type `User`.

