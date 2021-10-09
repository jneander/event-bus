import EventBus from './EventBus'

export default class EventBusDouble extends EventBus {
  constructor() {
    super()

    this._publishedEvents = []
    this._subscriptions = []
  }

  getPublishedEvents() {
    return this._publishedEvents
  }

  getSubscriptions() {
    return this._subscriptions
  }

  publish(eventName, data) {
    super.publish(eventName, data)
    this._publishedEvents.push({eventName, data})
  }

  subscribe(eventName, handler) {
    const subscription = {eventName}
    const unsubscribe = super.subscribe(eventName, data => {
      handler(data)
    })

    subscription.unsubscribe = () => {
      const index = this._subscriptions.indexOf(subscription)
      if (index !== -1) {
        this._subscriptions.splice(index, 1)
        unsubscribe()
      }
    }

    this._subscriptions.push(subscription)

    return subscription.unsubscribe
  }
}
