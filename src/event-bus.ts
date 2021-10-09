import type {EventHandler, EventUnsubscribeFn, IEventBus} from './types'

type Registry = {[eventName: string]: EventHandler[]}

/**
 * A class which allows for the subscription to, and publication of, named
 * events and associated data.
 */
export class EventBus implements IEventBus {
  private registry: Registry

  constructor() {
    this.registry = {}
  }

  /**
   * Subscribe a callback function to an event with the given name.
   *
   * @param eventName {string} The unique name for the event to be subscribed to.
   *
   * @param handler {EventHandler} A function which will be called when the
   * event with the given name is published. This handler will receive any data
   * included with the published event as well as an EventInfo object containing
   * information about the event itself.
   *
   * @returns {EventUnsubscribeFn} A function which, when called, will
   * unsubscribe the event handler from this event.
   */
  subscribe(eventName: string, handler: EventHandler): EventUnsubscribeFn {
    this.registry[eventName] = this.registry[eventName] || []
    this.registry[eventName].push(handler)

    return () => {
      const index = this.registry[eventName].indexOf(handler)
      if (index !== -1) {
        this.registry[eventName].splice(index, 1)
      }
    }
  }

  /**
   * Publish an event with the given name and data. Subscribed handlers
   * associated with this name will be called synchronously with the given data
   * and information about the event.
   *
   * @param eventName {string} The name of the event to publish.
   *
   * @param data {unknown} Any data to include with the published event.
   */
  publish(eventName: string, data?: unknown): void {
    if (this.registry[eventName]) {
      this.registry[eventName].forEach(handler => {
        try {
          handler(data, {name: eventName})
        } catch (error) {
          // Ignore error
        }
      })
    }
  }
}
