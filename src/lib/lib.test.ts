import { describe, expect, it } from "vitest";
import { applyListParams } from "@/lib/resource";
import { formatPrice, propertyRef, slugify } from "@/lib/utils";
import { loginSchema, propertySchema } from "@/lib/validations";

describe("utils", () => {
  it("formats Indian prices", () => {
    expect(formatPrice(15500000)).toBe("₹1.55 Cr");
    expect(formatPrice(8200000)).toBe("₹82 Lac");
    expect(formatPrice(45000)).toBe("₹45,000");
  });
  it("builds the public reference id", () => {
    expect(propertyRef("1")).toBe("HVN1001");
  });
  it("slugifies", () => {
    expect(slugify("Plot vs Flat: what suits you?")).toBe("plot-vs-flat-what-suits-you");
  });
});

describe("applyListParams", () => {
  const rows = [
    { id: "1", name: "Alpha", status: "new", n: 3 },
    { id: "2", name: "Beta", status: "closed", n: 1 },
    { id: "3", name: "Gamma", status: "new", n: 2 },
  ];
  it("filters by status and search", () => {
    expect(applyListParams(rows, { status: "new" }, ["name"]).total).toBe(2);
    expect(applyListParams(rows, { search: "gam" }, ["name"]).data[0].id).toBe("3");
  });
  it("sorts and paginates", () => {
    const res = applyListParams(rows, { sort: "n", order: "desc", pageSize: 2 }, ["name"]);
    expect(res.data.map((r) => r.id)).toEqual(["1", "3"]);
    expect(res.total).toBe(3);
    expect(applyListParams(rows, { sort: "n", pageSize: 2, page: 2 }, ["name"]).data).toHaveLength(
      1,
    );
  });
});

describe("validations", () => {
  const valid = {
    title: "3 BHK Apartment",
    description: "A spacious apartment close to the metro station.",
    type: "sale",
    category: "apartment",
    price: 100,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1000,
    address: "Main Road",
    locality: "Edappally",
    city: "Kochi",
    possession: "Ready to move",
    amenities: [],
    posterName: "Anil",
    posterRole: "owner",
    status: "draft",
    featured: false,
    verified: false,
  };
  it("accepts a valid property", () => {
    expect(propertySchema.safeParse(valid).success).toBe(true);
  });
  it("rejects missing city and bad price", () => {
    const r = propertySchema.safeParse({ ...valid, city: "", price: 0 });
    expect(r.success).toBe(false);
  });
  it("validates login", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });
});
