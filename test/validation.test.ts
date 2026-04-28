import { validateUserId, validateRole, validateStatus, validateUpdateUserPayload } from "../src/validation";
import { ValidationError } from "../src/errors";

describe("validateUserId", () => {
  it("accepts valid lowercase id", () => {
    expect(validateUserId("u-001")).toBe("u-001");
  });

  it("normalizes to lowercase", () => {
    expect(validateUserId("U-001")).toBe("u-001");
  });

  it("throws REQUIRED for empty string", () => {
    expect(() => validateUserId("  ")).toThrow(ValidationError);
    expect(() => validateUserId("  ")).toThrow("required");
  });

  it("throws FORMAT for invalid characters", () => {
    try {
      validateUserId("bad id!");
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as ValidationError).code).toBe("FORMAT");
    }
  });

  it("throws for non-string input", () => {
    expect(() => validateUserId(42)).toThrow(ValidationError);
  });
});

describe("validateRole", () => {
  it("accepts valid roles", () => {
    expect(validateRole("admin")).toBe("admin");
    expect(validateRole("viewer")).toBe("viewer");
  });

  it("throws for unknown role", () => {
    expect(() => validateRole("superuser")).toThrow(ValidationError);
  });
});

describe("validateStatus", () => {
  it("accepts valid statuses", () => {
    expect(validateStatus("active")).toBe("active");
  });

  it("throws for unknown status", () => {
    expect(() => validateStatus("archived")).toThrow(ValidationError);
  });
});

describe("validateUpdateUserPayload", () => {
  it("accepts partial update with name only", () => {
    expect(validateUpdateUserPayload({ name: "  Ada  " })).toEqual({ name: "Ada" });
  });

  it("throws EMPTY when no fields provided", () => {
    try {
      validateUpdateUserPayload({});
    } catch (e) {
      expect((e as ValidationError).code).toBe("EMPTY");
    }
  });

  it("throws REQUIRED for null body", () => {
    expect(() => validateUpdateUserPayload(null)).toThrow("object");
  });

  it("throws for blank name", () => {
    expect(() => validateUpdateUserPayload({ name: "   " })).toThrow(ValidationError);
  });
});
