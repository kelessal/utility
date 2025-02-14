export default class Debounce {
    private readonly timeout: number
    private clearTimeout?: any
    private readonly handler: Function
    constructor(fn: Function, timeout: number) {
      this.timeout = timeout || 100
      this.handler = fn
    }
    public fire() {
      if (this.clearTimeout) {
        clearTimeout(this.clearTimeout)
        this.clearTimeout = undefined
      }
      const self = this
      const args = arguments
      self.clearTimeout = setTimeout(() => {
        self.clearTimeout = undefined
        self.handler.apply(self, args)
      }, self.timeout)
    }
  }