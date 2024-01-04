import { Application } from './application.ts';

import { bpmToMs } from './utils.ts';

const DEFAULT_BPM = 60;
const DEFAULT_BEATS = 4;
const DEFAULT_QUARTERS = 4;

export interface Metronome {
  bpm: number;
  beats: number;
  quarters: number;
  msPerBeat: number;
  currentBeat: number;

  newIntervalId?: number;
  intervalId?: number;

  setBpm: (bpm: number) => void;
}

const update = (state: Metronome) => {
  const event = new CustomEvent<{ newBeat: number }>(
    `state:metronome:beat:${state.currentBeat === 1 ? 'tic' : 'toc'}`,
    {
      detail: { newBeat: state.currentBeat },
    },
  );

  dispatchEvent(event);

  state.currentBeat = (state.currentBeat % state.beats) + 1;

  if (state.newIntervalId !== undefined) {
    clearInterval(state.intervalId);
    state.intervalId = state.newIntervalId;
    state.newIntervalId = undefined;
  }
};

export const make = (options?: Partial<Metronome>): Application<Metronome> => {
  const state: Metronome = {
    bpm: options?.bpm ?? DEFAULT_BPM,
    beats: options?.beats ?? DEFAULT_BEATS,
    quarters: options?.quarters ?? DEFAULT_QUARTERS,
    msPerBeat: bpmToMs(options?.bpm ?? DEFAULT_BPM),
    currentBeat: 1,
    setBpm: (bpm: number) => {
      clearInterval(state.newIntervalId);

      state.bpm = bpm;
      state.msPerBeat = bpmToMs(bpm);

      state.newIntervalId = setInterval(() => update(state), state.msPerBeat);
    },
  };

  return {
    state,
    start: () => {
      clearInterval(state.intervalId);

      update(state);
      state.intervalId = setInterval(() => update(state), state.msPerBeat);
    },
    stop: () => {
      clearInterval(state.intervalId);
    },
  };
};
