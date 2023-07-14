describe("foo", () => {
  it("should return bar", async () => {
    const { foo } = await import("./index");
    expect(await foo()).toBe("bar");
  });
});
