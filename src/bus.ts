import { IUtility, IBus } from "./types";

export default class Bus implements IBus {
  private readonly $u: IUtility;
  constructor(util: IUtility) {
    this.$u = util;
  }
  private readonly _allHandlers = new Map<string, Set<Function>>();
  private readonly _anyHandlers = new Set<Function>();
  /**
   * Registers a handler function to be called for any event.
   *
   * @param handler - The function to be called for any event. Must be a valid function.
   * @returns A function that, when called, will remove the handler from the list of any-event handlers.
   * @throws {Error} If the provided handler is not a function.
   */
  onAny(handler: Function) {
    if (!this.$u.is.function(handler))
      throw new Error("Handler must be a function");
    this._anyHandlers.add(handler);
    return () => this._anyHandlers.delete(handler);
  }
  /**
   * Registers an event handler for a specific event.
   *
   * @param evt - The name of the event to listen for.
   * @param handler - The function to be called when the event is emitted.
   * @returns A function that, when called, will remove the event handler.
   * @throws Will throw an error if the handler is not a function.
   */
  on(evt: string, handler: Function): Function {
    if (!this.$u.is.function(handler))
      throw new Error("Handler must be a function");
    let handlers = this._allHandlers.get(evt);
    if (!handlers) {
      handlers = new Set<Function>();
      this._allHandlers.set(evt, handlers);
    }
    handlers.add(handler);
    return () => handlers?.delete(handler);
  }
  /**
   * Asynchronously emits an event to all registered handlers.
   *
   * @param evt - The name of the event to emit.
   * @param args - Additional arguments to pass to the event handlers.
   * @returns A promise that resolves when all handlers have been executed.
   */
  async emitAsync(evt: string, ...args: any[]) {
    const params = this.$u.skip(Array.from(arguments), 1);
    for (let handler of this._anyHandlers) {
      const result = handler(evt, ...params);
      if (result instanceof Promise) await result;
    }
    let handlers = this._allHandlers.get(evt);
    if (!handlers) return;
    for (let handler of handlers) {
      var result = handler(...params);
      if (result instanceof Promise) await result;
    }
  }
}
