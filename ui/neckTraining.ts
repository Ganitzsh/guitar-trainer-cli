import { crayon } from 'https://deno.land/x/crayon@3.3.3/mod.ts';
import {
  GridLayout,
  Rectangle,
  Signal,
  Tui,
} from 'https://deno.land/x/tui@2.1.7/mod.ts';
import { Button } from 'https://deno.land/x/tui@2.1.7/src/components/button.ts';

export interface NeckTraining {
  parent: Tui;
  layout: GridLayout<'note'>;
  noteSignal: Signal<string>;
}

export const make = (
  parent: Tui,
  rectangle?: Signal<Rectangle>,
): NeckTraining => {
  const noteSignal = new Signal<string>('None');

  const layout = new GridLayout<'note'>({
    rectangle: rectangle ?? parent.rectangle,
    pattern: [
      ['note'],
    ],
    gapX: 1,
    gapY: 1,
  });

  new Button({
    parent,
    rectangle: layout.element('note'),
    label: {
      text: noteSignal,
    },
    theme: {
      base: crayon.bgCyan,
    },
    zIndex: 1,
  });

  const ui = {
    parent,
    layout,
    noteSignal,
  };

  return ui;
};
