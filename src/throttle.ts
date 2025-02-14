export default class Throttle {
    private readonly timeout: number
    private clearTimeout?: any
    private readonly handler: Function
    constructor(fn: Function, timeout: number) {
      this.timeout = timeout || 100
      this.handler = fn
    }
    public fire() {
      if (this.clearTimeout) return
      this.clearTimeout = setTimeout(() => {
        this.clearTimeout = undefined
        this.handler()
      }, this.timeout)
    }
  }