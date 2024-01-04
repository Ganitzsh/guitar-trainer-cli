import { Application } from './application.ts';
import { findNoteFromPitch, NoteWithAccidental } from './notes.ts';

export interface PitchRecogniser {
  listening: boolean;
}

export const make = (): Application<PitchRecogniser> => {
  const state: PitchRecogniser = {
    listening: false,
  };

  const worker = new Worker(new URL('./worker.js', import.meta.url).href, {
    type: 'module',
  });

  worker.onmessage = (event) => {
    const pitch = event.data;

    dispatchEvent(
      new CustomEvent<{ note: NoteWithAccidental; octave: number }>(
        'state:pitch:change',
        {
          detail: findNoteFromPitch(pitch),
        },
      ),
    );
  };

  const start = () => {
    state.listening = true;
  };

  const stop = () => {
    worker.postMessage('stop');
    state.listening = false;
  };

  return {
    state,
    start,
    stop,
  };
};
