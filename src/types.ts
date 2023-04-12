/**
 * The interface for a basic EventBus.
 */
export interface IEventBus {
  publish(eventName: string, data?: unknown): void
  subscribe(eventName: string, handler: EventHandler): EventUnsubscribeFn
}

/**
 * An object containing information about a published event.
 */
export type EventInfo = {
  name: string
}

/**
 * A handler function used to subscribe to an event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandler = (data: any, eventInfo: EventInfo) => void

/**
 * A function used to unsubscribe a handler from an event.
 */
export type EventUnsubscribeFn = () => void
