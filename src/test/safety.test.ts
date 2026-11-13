import { describe, it, expect } from "vitest";
import { commentSchema, createRateLimiter } from "@/lib/safety";

describe("safety", () => {
  it("rejects comments over 140 chars", () => {
    expect(commentSchema.safeParse("a".repeat(141)).success).toBe(false);
  });
  it("rejects html in comments", () => {
    expect(commentSchema.safeParse("<script>x</script>").success).toBe(false);
  });
  it("blocks the 6th action within a minute", () => {
    let t = 0;
    const ok = createRateLimiter(5, 60000, () => t);
    for (let i = 0; i < 5; i++) expect(ok()).toBe(true);
    expect(ok()).toBe(false);
    t = 60001;
    expect(ok()).toBe(true);
  });
});

import { joinCodeSchema } from "@/lib/safety";
describe("join code", () => {
  it("accepts 6 alphanumeric chars, any case", () => {
    expect(joinCodeSchema.parse("ab12cd")).toBe("AB12CD");
  });
  it("rejects 5 or 7 chars and symbols", () => {
    expect(joinCodeSchema.safeParse("AB12C").success).toBe(false);
    expect(joinCodeSchema.safeParse("AB12CD3").success).toBe(false);
    expect(joinCodeSchema.safeParse("AB-2CD").success).toBe(false);
  });
});
