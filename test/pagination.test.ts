import { paginate, validatePaginationParams } from "../src/pagination";

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => `item-${i}`);

  it("returns first page", () => {
    const result = paginate(items, { page: 1, perPage: 10 });
    expect(result.items).toHaveLength(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  it("returns last page with remainder", () => {
    const result = paginate(items, { page: 3, perPage: 10 });
    expect(result.items).toHaveLength(5);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  it("returns empty for out-of-range page", () => {
    const result = paginate(items, { page: 99, perPage: 10 });
    expect(result.items).toHaveLength(0);
  });
});

describe("validatePaginationParams", () => {
  it("applies defaults for missing values", () => {
    expect(validatePaginationParams({})).toEqual({ page: 1, perPage: 20 });
  });

  it("clamps perPage to 100", () => {
    expect(validatePaginationParams({ perPage: 500 }).perPage).toBe(100);
  });

  it("floors to integers", () => {
    const params = validatePaginationParams({ page: "2.7", perPage: "15.3" });
    expect(params).toEqual({ page: 2, perPage: 15 });
  });
});
