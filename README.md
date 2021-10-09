# @jneander/event-bus

A Basic Event Bus

## EventBus

A class which allows for the subscription to, and publication of, named events and associated data.

### subscribe

Subscribe a callback function to an event with the given name.

#### Parameters

- `eventName` {string} The unique name for the event to be subscribed to.
- `handler` {EventHandler} A function which will be called when the event with the given name is
  published. This handler will receive any data included with the published event as well as an
  EventInfo object containing information about the event itself.

Returns **EventUnsubscribeFn** A function which, when called, will unsubscribe the event handler
from this event.

### publish

Publish an event with the given name and data. Subscribed handlers associated with this name will be
called synchronously with the given data and information about the event.

#### Parameters

- `eventName` {string} The name of the event to publish.
- `data` {unknown} Any data to include with the published event.

## EventBusDouble

**Extends EventBus**

A class extending EventBus which includes additional methods intended for test environments.

### getPublishedEvents

Return an array containing each event published from this EventBus.

Returns **Array\<EventBusDoubleEvent>**

### clearPublishedEvents

Remove internal records for each event published from this EventBus.

Returns **Array\<EventBusDoubleEvent>**

### getSubscriptions

Return an array containing information about each event subscription not yet unsubscribed from this
EventBus.

Returns **Array\<EventBusDoubleSubscription>**
