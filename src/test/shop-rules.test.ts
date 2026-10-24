import { describe, expect, it } from "vitest";
import { checkoutTotals, filterProducts, formatIDR, PRODUCTS } from "@/lib/products";

describe("shop rules", () => {
  it("formats prices as Rupiah", () => {
    expect(formatIDR(99000)).toBe("Rp99.000");
  });
  it("charges Rp15.000 shipping under Rp200.000", () => {
    expect(checkoutTotals(100000, "").shipping).toBe(15000);
  });
  it("gives free shipping from Rp200.000", () => {
    expect(checkoutTotals(200000, "").shipping).toBe(0);
  });
  it("KASHA10 gives 10% off", () => {
    expect(checkoutTotals(300000, "kasha10")).toEqual({ shipping: 0, discount: 30000, total: 270000 });
  });
  it("sorts by lowest price", () => {
    const r = filterProducts(PRODUCTS, { sort: "low" });
    expect(r[0].price).toBeLessThanOrEqual(r[1].price);
  });
  it("searches by brand", () => {
    expect(filterProducts(PRODUCTS, { q: "cosrx" }).every((p) => p.brand === "COSRX")).toBe(true);
  });
});
