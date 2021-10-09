import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

import {EventBusDouble} from '../event-bus-double'
import {runEventBusExamples} from './shared'

describe('EventBusDouble', () => {
  let eventBus: EventBusDouble

  beforeEach(() => {
    eventBus = new EventBusDouble()
  })

  runEventBusExamples(() => eventBus)

  describe('#getPublishedEvents()', () => {
    it('returns an empty array when no events have been published', () => {
      expect(eventBus.getPublishedEvents()).to.deep.equal([])
    })

    it('includes an entry for each published event', () => {
      eventBus.publish('event1')
      eventBus.publish('event2')
      eventBus.publish('event1')
      expect(eventBus.getPublishedEvents()).to.have.length(3)
    })

    it('includes the data of each published event', () => {
      const datum = [{example: true}]
      eventBus.publish('event1', datum)
      eventBus.publish('event2', 'example')
      eventBus.publish('event1')
      const events = eventBus.getPublishedEvents()
      expect(events.map(event => event.data)).to.deep.equal([datum, 'example', undefined])
    })

    it('includes the name of each published event', () => {
      eventBus.publish('event1')
      eventBus.publish('event2')
      eventBus.publish('event1')
      const events = eventBus.getPublishedEvents()
      expect(events.map(event => event.eventInfo.name)).to.deep.equal([
        'event1',
        'event2',
        'event1',
      ])
    })
  })

  describe('#clearPublishedEvents()', () => {
    it('has no effect when no events have been published', () => {
      eventBus.clearPublishedEvents()
      expect(eventBus.getPublishedEvents()).to.deep.equal([])
    })

    it('removes all records of published events', () => {
      eventBus.publish('event1')
      eventBus.publish('event2')
      eventBus.publish('event1')
      eventBus.clearPublishedEvents()
      expect(eventBus.getPublishedEvents()).to.deep.equal([])
    })
  })

  describe('#getSubscriptions()', () => {
    it('returns an empty array when no handlers have subscribed', () => {
      expect(eventBus.getSubscriptions()).to.deep.equal([])
    })

    it('includes an entry for each subscription', () => {
      eventBus.subscribe('event1', () => {})
      eventBus.subscribe('event2', () => {})
      eventBus.subscribe('event1', () => {})
      expect(eventBus.getSubscriptions()).to.have.length(3)
    })

    it('includes the event name of each subscription', () => {
      eventBus.subscribe('event1', () => {})
      eventBus.subscribe('event2', () => {})
      eventBus.subscribe('event1', () => {})
      const subscriptions = eventBus.getSubscriptions()
      expect(subscriptions.map(sub => sub.eventName)).to.deep.equal(['event1', 'event2', 'event1'])
    })

    it('excludes subscriptions for handlers which have unsubscribed', () => {
      eventBus.subscribe('event1', () => {})
      const unsubscribe = eventBus.subscribe('event2', () => {})
      eventBus.subscribe('event1', () => {})
      unsubscribe()
      const subscriptions = eventBus.getSubscriptions()
      expect(subscriptions.map(sub => sub.eventName)).to.deep.equal(['event1', 'event1'])
    })
  })
})
