import Utility from "../src/main";

describe("Bus", () => {
  let bus = Utility.bus;
  test("should register and call any-event handler", () => {
    const handler = jest.fn();
    bus.onAny(handler);
    bus.emitAsync("testEvent");
    expect(handler).toHaveBeenCalledWith("testEvent");
  });

  test("should register and call specific event handler", () => {
    const handler = jest.fn();
    bus.on("testEvent", handler);
    bus.emitAsync("testEvent", "arg1", "arg2");
    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("should remove any-event handler", () => {
    const handler = jest.fn();
    const off = bus.onAny(handler);
    off();
    bus.emitAsync("testEvent");
    expect(handler).not.toHaveBeenCalled();
  });

  test("should remove specific event handler", () => {
    const handler = jest.fn();
    const off = bus.on("testEvent", handler);
    off();
    bus.emitAsync("testEvent");
    expect(handler).not.toHaveBeenCalled();
  });

  test("should handle async handlers", async () => {
    const handler = jest.fn().mockResolvedValueOnce(true);
    bus.on("testEvent", handler);
    await bus.emitAsync("testEvent");
    expect(handler).toHaveBeenCalled();
  });
});
