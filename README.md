# plannotator-stack-fixture

Fixture repo for testing stacked PR review UX in Plannotator.

## User Model

Users have a `role` (`admin | editor | viewer`) and a `status` (`active | suspended | pending`).

```ts
import { createUser } from "./src/user";

const user = createUser({
  id: "u-001",
  name: "Ada Lovelace",
  email: "ada@example.com",
  role: "editor",
  status: "active",
});
```

### Utilities

| Function | Description |
|---|---|
| `createUser(params)` | Construct a normalized `User` |
| `normalizeUserId(id)` | Lowercase + trim a user ID |
| `isActiveUser(user)` | Check active status |
| `formatDisplayName(user)` | Name or email prefix |
| `formatUserLabel(user)` | `"Name (Role)"` string |
