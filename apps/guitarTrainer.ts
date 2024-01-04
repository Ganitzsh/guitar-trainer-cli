import { Application } from './application.ts';

import * as MetronomeApp from './metronome.ts';
import * as NeckTrainingApp from './neckTraining.ts';

export interface GuitarTrainer {
  metronome: Application<MetronomeApp.Metronome>;
  neckTraining: Application<NeckTrainingApp.NeckTraining>;
}

export const make = (): Application<GuitarTrainer> => {
  const state: GuitarTrainer = {
    metronome: MetronomeApp.make({
      bpm: 120,
    }),
    neckTraining: NeckTrainingApp.make(),
  };

  return {
    state,
    start: () => {
      state.metronome.start();
      state.neckTraining.start();
    },
    stop: () => {
      state.metronome.stop();
      state.neckTraining.stop();
    },
  };
};
