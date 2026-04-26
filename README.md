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

## Authorization

Access control is role-based. Suspended users are always denied.

```ts
import { canAccessResource, assertCanAccess } from "./src/auth";

// boolean check
if (!canAccessResource(actor, "document", "write")) {
  return res.status(403).json({ error: "Forbidden" });
}

// throwing guard (use inside request handlers)
assertCanAccess(actor, "workspace", "manage");
```

### Permission Matrix

| Role | document | workspace | user | billing |
|---|---|---|---|---|
| admin | read write delete manage | read write delete manage | read write delete manage | read manage |
| editor | read write delete | read write | read | — |
| viewer | read | read | — | — |

## API: Update User

`handleUpdateUserRequest` runs validation and authorization in one call.

```ts
import { handleUpdateUserRequest } from "./src/api";

const result = handleUpdateUserRequest({
  actor: currentUser,
  targetUserId: req.params.id,
  payload: req.body,
});
// result: { userId, changes, updatedBy }
```

Throws `ValidationError` for bad input, `AuthorizationError` for permission failures.
Both error types carry structured metadata (`field`, `code`, `actorId`, `resource`, `action`).

### Validation rules

- `id` — required, 2–64 chars, lowercase alphanumeric + `-` or `_`
- `name` — non-empty string, trimmed
- `role` / `status` — must be a valid enum value; only `admin` can change these fields
