import {EventBus} from '../event-bus'
import {runEventBusExamples} from './shared'

describe('EventBus', () => {
  let eventBus: EventBus

  beforeEach(() => {
    eventBus = new EventBus()
  })

  runEventBusExamples(() => eventBus)
})
