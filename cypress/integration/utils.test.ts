import { HawkEventPayload, HawkEventRepetition } from '@/types/events';
import cloneDeep from 'lodash.clonedeep';
import { repetitionAssembler } from '../../src/utils';

const baseEvent: HawkEventPayload = {
  title: '',
  timestamp: 0,
  backtrace: [{
    file: '',
    line: 0,
    column: 0,
    sourceCode: [],
    function: '',
    arguments: [],
  }],
  get: {},
  post: {},
  headers: {},
  context: {},
  release: '',
  user: {
    id: 0,
    name: '',
    url: '',
    photo: '',
  },
  addons: {}
}

type DeepNullability<T> = {
  [P in keyof T]: T[P] extends object ? DeepNullability<T[P]> : T[P] | null;
};

type RepetitionEventPayload = DeepNullability<HawkEventPayload>;

describe('Merging of the repetition and the original event payloads at the overview stage', () => {
  let originalEvent = baseEvent;
  let repetitionEvent: RepetitionEventPayload = baseEvent;
  let assembledRepetition: HawkEventPayload = baseEvent;

  beforeEach(() => {
    originalEvent = cloneDeep(baseEvent);
    repetitionEvent = cloneDeep(baseEvent);
  });

  it('Should get object params from the original event', () => {
    originalEvent = {
      ...originalEvent,
      release: 'Omega release',
    };

    repetitionEvent = {
      ...repetitionEvent,
      release: null,
    };

    assembledRepetition = {
      ...baseEvent,
      release: 'Omega release',
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should take the value from the repetition payload', () => {
    originalEvent = {
      ...originalEvent,
      release: 'Omega release',
    };

    repetitionEvent = {
      ...repetitionEvent,
      release: 'Alpha release',
    };

    assembledRepetition = {
      ...baseEvent,
      release: 'Alpha release',
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should take the original value from the object in the array', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: 399 }],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: null }],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: 399 }],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should take the repetition value from the object in the array', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: 399 }],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: 1337 }],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [{ ...baseEvent.backtrace[0], line: 1337 }],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should take nullable params from the original event', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], file: 'Red file' },
        { ...baseEvent.backtrace[0], file: 'Orange file' },
        { ...baseEvent.backtrace[0], file: 'Green file' },
      ],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], file: null },
        { ...baseEvent.backtrace[0], file: null },
        { ...baseEvent.backtrace[0], file: 'Purple file' },
      ],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], file: 'Red file' },
        { ...baseEvent.backtrace[0], file: 'Orange file' },
        { ...baseEvent.backtrace[0], file: 'Purple file' },
      ],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should replace some params in the array of objects', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: 1, file: 'Red file' },
        { ...baseEvent.backtrace[0], line: 2, file: 'Orange file' },
      ],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: null, file: 'Magenta file' },
        { ...baseEvent.backtrace[0], line: 4, file: null },
      ],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: 1, file: 'Magenta file' },
        { ...baseEvent.backtrace[0], line: 4, file: 'Orange file' },
      ],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('Should take additional elements from the repetition', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: 1 },
      ],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: null },
        { ...baseEvent.backtrace[0], line: 2 },
      ],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [
        { ...baseEvent.backtrace[0], line: 1 },
        { ...baseEvent.backtrace[0], line: 2 },
      ],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });
});