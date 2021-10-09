import chai, {expect} from 'chai'
import sinon, {SinonSpy} from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

import type {IEventBus} from '../types'

export function runEventBusExamples(createEventBusFn: () => IEventBus) {
  let eventBus: IEventBus
  let handler1: SinonSpy
  let handler2: SinonSpy

  beforeEach(() => {
    eventBus = createEventBusFn()

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
      const datum = [{example: true}]
      eventBus.subscribe('event1', handler1)
      eventBus.publish('event1', datum)
      const [callData] = handler1.lastCall.args
      expect(callData).to.equal(datum)
    })

    it('calls subscriber handlers with information about the event', () => {
      const datum = [{example: true}]
      eventBus.subscribe('event1', handler1)
      eventBus.publish('event1', datum)
      const eventInfo = handler1.lastCall.args[1]
      expect(eventInfo.name).to.equal('event1')
    })

    it('calls subscribers in the order of subscription', () => {
      eventBus.subscribe('event1', handler2)
      eventBus.subscribe('event1', handler1)
      eventBus.publish('event1')
      expect(handler2).to.have.been.calledBefore(handler1)
    })

    it('ignores errors thrown by subscriber handlers', () => {
      const data = [{example: true}]
      eventBus.subscribe('event1', () => {
        throw new Error('FAIL')
      })
      expect(() => {
        eventBus.publish('event1', data)
      }).not.to.throw()
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
}
