import { Application } from './application.ts';

import * as MetronomeApp from './metronome.ts';
import * as NeckTrainingApp from './neckTraining.ts';
import * as PitchRecogniserApp from './pitchRecogniser.ts';

export interface GuitarTrainer {
  metronome: Application<MetronomeApp.Metronome>;
  neckTraining: Application<NeckTrainingApp.NeckTraining>;
  pitchRecogniser: Application<PitchRecogniserApp.PitchRecogniser>;
}

export const make = (): Application<GuitarTrainer> => {
  const state: GuitarTrainer = {
    metronome: MetronomeApp.make({
      bpm: 100,
    }),
    neckTraining: NeckTrainingApp.make(),
    pitchRecogniser: PitchRecogniserApp.make(),
  };

  return {
    state,
    start: () => {
      state.metronome.start();
      state.neckTraining.start();
      new Promise<undefined>((resolve, reject) => {
        try {
          state.pitchRecogniser.start();
          resolve(undefined);
        } catch (e) {
          reject(e);
        }
      }).catch((e) => {
        console.error(e);
      });
    },
    stop: () => {
      state.metronome.stop();
      state.neckTraining.stop();
      state.pitchRecogniser.stop();
    },
  };
};
