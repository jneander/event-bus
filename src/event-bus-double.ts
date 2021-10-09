import {EventBus} from './event-bus'
import type {EventHandler, EventInfo, EventUnsubscribeFn} from './types'

/**
 * An object containing any data included in a published event and information
 * about the event.
 */
export type EventBusDoubleEvent = {
  /**
   * Data included in the published event.
   */
  data: unknown

  /**
   * Information about the published event.
   */
  eventInfo: EventInfo
}

/**
 * An object containing information about an active EventBus subscription.
 */
export type EventBusDoubleSubscription = {
  /**
   * The name of the event subscribed to.
   */
  eventName: string
}

/**
 * A class extending EventBus which includes additional methods intended for
 * test environments.
 */
export class EventBusDouble extends EventBus {
  private publishedEvents: EventBusDoubleEvent[]
  private subscriptions: EventBusDoubleSubscription[]

  constructor() {
    super()

    this.publishedEvents = []
    this.subscriptions = []
  }

  /**
   * Return an array containing each event published from this EventBus.
   *
   * @returns {EventBusDoubleEvent[]}
   */
  getPublishedEvents(): EventBusDoubleEvent[] {
    return this.publishedEvents
  }

  /**
   * Remove internal records for each event published from this EventBus.
   *
   * @returns {EventBusDoubleEvent[]}
   */
  clearPublishedEvents(): void {
    this.publishedEvents.length = 0
  }

  /**
   * Return an array containing information about each event subscription not
   * yet unsubscribed from this EventBus.
   *
   * @returns {EventBusDoubleSubscription[]}
   */
  getSubscriptions(): EventBusDoubleSubscription[] {
    return this.subscriptions
  }

  publish(eventName: string, data?: unknown): void {
    super.publish(eventName, data)
    this.publishedEvents.push({data, eventInfo: {name: eventName}})
  }

  subscribe(eventName: string, handler: EventHandler): EventUnsubscribeFn {
    const subscription = {eventName} as EventBusDoubleSubscription
    const unsubscribe = super.subscribe(eventName, data => {
      handler(data, {name: eventName})
    })

    this.subscriptions.push(subscription)

    return () => {
      const index = this.subscriptions.indexOf(subscription)
      if (index !== -1) {
        this.subscriptions.splice(index, 1)
        unsubscribe()
      }
    }
  }
}
