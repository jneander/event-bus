import sinon from 'sinon'

import EventBus from './EventBus'

describe('EventBus', () => {
  let eventBus
  let handler1
  let handler2

  beforeEach(() => {
    eventBus = new EventBus()

    handler1 = sinon.spy()
    handler2 = sinon.spy()
  })

  describe('#publish()', () => {
    it('calls all subscriber handlers assigned to the event', () => {
      eventBus.subscribe('event1', handler1)
      eventBus.subscribe('event1', handler2)
      eventBus.publish('event1')
      expect([handler1.callCount, handler2.callCount]).to.deep.equal([1, 1])
    })

    it('does not call subscriber handlers not assigned to the event', () => {
      eventBus.subscribe('event1', handler1)
      eventBus.subscribe('event2', handler2)
      eventBus.publish('event2')
      expect([handler1.callCount, handler2.callCount]).to.deep.equal([0, 1])
    })

    it('calls subscriber handlers assigned to the given event and other events', () => {
      eventBus.subscribe('event1', handler1)
      eventBus.subscribe('event1', handler2)
      eventBus.subscribe('event2', handler2)
      eventBus.publish('event1')
      expect([handler1.callCount, handler2.callCount]).to.deep.equal([1, 1])
    })

    it('calls subscriber handlers with the given data', () => {
      const data = [{example: true}]
      eventBus.subscribe('event1', handler1)
      eventBus.publish('event1', data)
      const [callData] = handler1.lastCall.args
      expect(callData).to.equal(data)
    })

    it('calls subscribers in the order of subscription', () => {
      eventBus.subscribe('event1', handler2)
      eventBus.subscribe('event1', handler1)
      eventBus.publish('event1')
      expect(handler2).to.have.been.calledBefore(handler1)
    })
  })

  describe('unsubscribing', () => {
    it('stops the subscriber from being called upon event publication', () => {
      const unsubscribe = eventBus.subscribe('event1', handler1)
      unsubscribe()
      eventBus.publish('event1')
      expect(handler1.callCount).to.equal(0)
    })

    it('does not unsubscribe other handlers from the same event', () => {
      const unsubscribe = eventBus.subscribe('event1', handler1)
      eventBus.subscribe('event1', handler2)
      unsubscribe()
      eventBus.publish('event1')
      expect(handler2.callCount).to.equal(1)
    })

    it('does not unsubscribe the same handler from other events', () => {
      const unsubscribe = eventBus.subscribe('event1', handler1)
      eventBus.subscribe('event2', handler1)
      unsubscribe()
      eventBus.publish('event2')
      expect(handler1.callCount).to.equal(1)
    })

    it('has no effect when the handler is already unsubscribed', () => {
      const unsubscribe = eventBus.subscribe('event1', handler1)
      unsubscribe()
      expect(unsubscribe).not.to.throw()
    })
  })
})
