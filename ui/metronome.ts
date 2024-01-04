import { crayon } from 'https://deno.land/x/crayon@3.3.3/mod.ts';
import {
  Computed,
  GridLayout,
  Rectangle,
  Signal,
  Tui,
} from 'https://deno.land/x/tui@2.1.7/mod.ts';
import { Button } from 'https://deno.land/x/tui@2.1.7/src/components/button.ts';

export interface Metronome {
  parent: Tui;
  rectangle: Signal<Rectangle>;

  layout: GridLayout<
    'bpm' | 'time-signature' | 'current-beat'
  >;

  bpm: Signal<string>;
  timeSignature: Signal<string>;

  currentBeat: Signal<string>;

  flickerBeatBackground: () => void;
}

export function make(
  parent: Tui,
  rectangle?: Signal<Rectangle>,
): Metronome {
  const rectangleSignal = rectangle ?? parent.rectangle;
  const bpm = new Signal<string>('N/A');
  const timeSignature = new Signal<string>('N/A');
  const currentBeat = new Signal<string>('N/A');

  const layout = new GridLayout<
    'bpm' | 'time-signature' | 'current-beat'
  >({
    rectangle: rectangleSignal,
    pattern: [
      ['bpm', 'time-signature'],
      ['current-beat'],
    ],
  });

  const bpmButton = new Button({
    parent,
    rectangle: layout.element('bpm'),
    label: { text: bpm },
    theme: {
      base: crayon.bgBlack,
      active: crayon.bgGreen,
    },
    zIndex: 0,
  });

  bpmButton.on('mousePress', (event) => {
    if (event.button === 0 && event.release != true) {
      dispatchEvent(new CustomEvent('ui:metronome:bpm:increase'));
    }
    if (event.button === 2 && event.release != true) {
      dispatchEvent(new CustomEvent('ui:metronome:bpm:decrease'));
    }
  });

  new Button({
    parent,
    rectangle: layout.element('time-signature'),
    label: {
      text: timeSignature,
    },
    theme: {
      base: crayon.bgBlack,
    },
    zIndex: 0,
  });

  const beatButton = new Button({
    parent,
    rectangle: layout.element('current-beat'),
    label: {
      text: currentBeat,
    },
    theme: {
      base: crayon.bgBlack,
      active: crayon.bgLightWhite,
    },
    zIndex: 0,
  });

  const ui = {
    parent,
    rectangle: rectangle ?? parent.rectangle,

    layout,

    bpm,
    timeSignature,

    currentBeat,

    flickerBeatBackground: () => {
      beatButton.state.value = 'active';
      setTimeout(() => {
        beatButton.state.value = 'base';
      }, 100);
    },
  };

  return ui;
}
