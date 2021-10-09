export default class EventBus {
  constructor() {
    this._registry = {}
  }

  subscribe(eventName, handler) {
    this._registry[eventName] = this._registry[eventName] || []
    this._registry[eventName].push(handler)

    return () => {
      const index = this._registry[eventName].indexOf(handler)
      if (index !== -1) {
        this._registry[eventName].splice(index, 1)
      }
    }
  }

  publish(eventName, data) {
    if (this._registry[eventName]) {
      this._registry[eventName].forEach(handler => {
        handler(data)
      })
    }
  }
}
