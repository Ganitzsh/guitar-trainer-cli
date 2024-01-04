import { Accidental, Note } from './notes.ts';
import { Application } from './application.ts';
import { pickRandomElement } from './utils.ts';

const DEFAULT_MEASURES_PER_NOTE = 2;
const DEFAULT_USE_ACCIDENTAL = true;

const notes: Note[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const accidentals: Accidental[] = ['#', 'b'];

const pickNote = (useAccidental: boolean, previousNote?: Note): {
  note: Note;
  accidental?: Accidental;
} => {
  const note = pickRandomElement(notes);
  const accidental = useAccidental ? pickRandomElement(accidentals) : undefined;

  if (
    note === previousNote ||
    (accidental === '#' && note === 'E') ||
    (accidental === '#' && note === 'B') ||
    (accidental === 'b' && note === 'C') ||
    (accidental === 'b' && note === 'F')
  ) {
    return pickNote(useAccidental, previousNote);
  }

  const headsOrTail = Math.random() > 0.5;

  return {
    note,
    accidental: headsOrTail ? accidental : undefined,
  };
};

export interface NeckTraining {
  measuresPerNote: number;
  useAccidental: boolean;
  currentMeasure: number;
  currentNote?: Note;
  currentAccidental?: Accidental;
  previousNote?: Note;
}

const handleMetronomeTic = (state: NeckTraining, newBeat: number) => {
  if (newBeat !== 1) return;

  state.currentMeasure = (state.currentMeasure % state.measuresPerNote) + 1;
  if (state.currentMeasure !== 1) return;

  state.previousNote = state.currentNote;

  const { note, accidental } = pickNote(
    state.useAccidental,
    state.previousNote,
  );

  state.currentNote = note;
  state.currentAccidental = accidental;

  dispatchEvent(
    new CustomEvent<{ note: Note; accidental?: Accidental }>(
      'state:neckTraining:note:change',
      {
        detail: {
          accidental,
          note,
        },
      },
    ),
  );
};

export const make = (
  options?: Partial<NeckTraining>,
): Application<NeckTraining> => {
  const state: NeckTraining = {
    measuresPerNote: options?.measuresPerNote ?? DEFAULT_MEASURES_PER_NOTE,
    useAccidental: options?.useAccidental ?? DEFAULT_USE_ACCIDENTAL,
    currentMeasure: 0,
  };

  const metronomeTicHandler = (event: CustomEvent<{ newBeat: number }>) =>
    handleMetronomeTic(state, event.detail.newBeat);

  return {
    state,
    start: () => {
      addEventListener(
        'state:metronome:beat:tic',
        metronomeTicHandler as EventListenerOrEventListenerObject,
      );
    },
    stop: () => {
      removeEventListener(
        'state:metronome:beat:tic',
        metronomeTicHandler as EventListenerOrEventListenerObject,
      );
    },
  };
};
