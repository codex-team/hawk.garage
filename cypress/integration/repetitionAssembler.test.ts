import { HawkEventPayload } from '@/types/events';
import cloneDeep from 'lodash.clonedeep';
import { repetitionAssembler } from '../../src/utils';

/**
 * Empty event to test the merging of the event and it's repetition
 */
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

/**
 * Recursively make all fields possibly equal to zero
 */
type DeepNullability<T> = {
  [P in keyof T]: T[P] extends object ? DeepNullability<T[P]> : T[P] | null;
};

/**
 * An event in which each field can possibly be equal to zero.
 * If this is the case, then during the merge process we must replace 
 * fields with null value with the original event values
 */
type RepetitionEventPayload = DeepNullability<HawkEventPayload>;

describe('Merging of the repetition and the original event payloads at the overview stage', () => {
  let originalEvent = baseEvent;
  let repetitionEvent: RepetitionEventPayload = baseEvent;
  let assembledRepetition: HawkEventPayload = baseEvent;

  beforeEach(() => {
    originalEvent = cloneDeep(baseEvent);
    repetitionEvent = cloneDeep(baseEvent);
  });

  it('should replace null field values of the repetition with the original event field values', () => {
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

  it('should take the repetition value if it is not null insted of the original event value', () => {
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

  it('should replace null field with the original event value in the array of objects', () => {
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

  it('(array of objects) should replace null in original if the repetition event has value', () => {
    originalEvent = {
      ...originalEvent,
      backtrace: [
        {
          ...baseEvent.backtrace[0],
          sourceCode: null
        }
      ],
    };

    repetitionEvent = {
      ...repetitionEvent,
      backtrace: [
        {
          ...baseEvent.backtrace[0],
          sourceCode: [
            {
              content: '111',
              line: 4
            },
            {
              content: '222',
              line: 5
            },
            {
              content: '333',
              line: 6
            }
          ]
        }
      ],
    };

    assembledRepetition = {
      ...baseEvent,
      backtrace: [
        {
          ...baseEvent.backtrace[0],
          sourceCode: [
            {
              content: '111',
              line: 4
            },
            {
              content: '222',
              line: 5
            },
            {
              content: '333',
              line: 6
            }
          ]
        }
      ],
    };

    const result = repetitionAssembler(originalEvent, repetitionEvent);

    expect(result).to.deep.equal(assembledRepetition);
  });

  it('should take the repetition field value instead of the original event value in the array of objects', () => {
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

  it('should take null field values from the original event', () => {
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

  it('should replace null fields from the repetition using the original event values in the array of objects', () => {
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

  it('should add elements from the repetition that are not in the original event', () => {
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
