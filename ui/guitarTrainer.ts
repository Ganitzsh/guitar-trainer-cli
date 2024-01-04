import { crayon } from 'https://deno.land/x/crayon@3.3.3/mod.ts';
import {
  Canvas,
  GridLayout,
  handleInput,
  handleKeyboardControls,
  handleMouseControls,
  Tui,
} from 'https://deno.land/x/tui@2.1.7/mod.ts';

import * as MetronomeUi from './metronome.ts';
import * as NeckTrainingUi from './neckTraining.ts';

const ONE_SECOND_IN_MS = 1000;
const FPS = 60;

interface App {
  tui: Tui;
  metronome: MetronomeUi.Metronome;
  neckTraining: NeckTrainingUi.NeckTraining;
  run: () => void;
}

export function make(): App {
  const tui = new Tui({
    style: crayon.bgBlack,
    refreshRate: ONE_SECOND_IN_MS / FPS,
    canvas: new Canvas({
      stdout: Deno.stdout,
      size: {
        columns: 40,
        rows: 24,
      },
    }),
  });

  const layout = new GridLayout<'metronome' | 'neck-training'>({
    rectangle: tui.rectangle,
    pattern: [
      ['metronome'],
      ['neck-training'],
    ],
    gapX: 1,
    gapY: 1,
  });

  const metronome = MetronomeUi.make(tui, layout.element('metronome'));
  const neckTraining = NeckTrainingUi.make(
    tui,
    layout.element('neck-training'),
  );

  tui.dispatch();

  handleInput(tui);
  handleMouseControls(tui);
  handleKeyboardControls(tui);

  return {
    tui,
    metronome,
    neckTraining,
    run: tui.run.bind(tui),
  };
}
