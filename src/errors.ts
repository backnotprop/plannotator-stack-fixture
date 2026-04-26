export class ValidationError extends Error {
  readonly field: string;
  readonly code: string;

  constructor(field: string, message: string, code = "INVALID") {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.code = code;
  }
}

export class AuthorizationError extends Error {
  readonly actorId: string;
  readonly resource: string;
  readonly action: string;

  constructor(actorId: string, resource: string, action: string) {
    super(`Not authorized to ${action} ${resource}`);
    this.name = "AuthorizationError";
    this.actorId = actorId;
    this.resource = resource;
    this.action = action;
  }
}
