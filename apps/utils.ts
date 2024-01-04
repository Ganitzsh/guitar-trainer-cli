export const bpmToMs = (bpm: number, quarters = 4, beats = 4): number => {
  const msPerBeat = (60 / bpm) * 1000;
  const msPerQuarter = msPerBeat * (beats / quarters);

  return msPerQuarter;
};

export const pickRandomElement = <TElement>(array: TElement[]): TElement =>
  array[Math.floor(Math.random() * array.length)];
