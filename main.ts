import * as GuitarTrainerUI from './ui/guitarTrainer.ts';
import * as GuitarTrainerApp from './apps/guitarTrainer.ts';
import { Accidental, Note } from './apps/notes.ts';
import { Sound } from './sound/sound.ts';
import { newSound } from './sound/cmd.ts';

// Resources

export const noteSoundMap: Record<Note, Sound> = {
  A: newSound('alphabet/A.mp3'),
  B: newSound('alphabet/B.mp3'),
  C: newSound('alphabet/C.mp3'),
  D: newSound('alphabet/D.mp3'),
  E: newSound('alphabet/E.mp3'),
  F: newSound('alphabet/F.mp3'),
  G: newSound('alphabet/G.mp3'),
};

export const accidentalSoundMap: Record<Accidental, Sound> = {
  '#': newSound('sharp.mp3'),
  b: newSound('flat.mp3'),
};

const tic: Sound = newSound('tic.wav');
const toc: Sound = newSound('toc.wav');

// Logic

const ui = GuitarTrainerUI.make();
const app = GuitarTrainerApp.make();

const updateMetronomeUi = (currentBeat: number) => {
  ui.metronome.flickerBeatBackground();
  ui.metronome.currentBeat.value = currentBeat.toString();
};

const updateNeckTrainingUi = (note: Note, accidental?: Accidental) => {
  ui.neckTraining.noteSignal.value = `${note}${accidental ?? ''}`;
};

const handleMetronomeBeatTic = (event: CustomEvent<{ newBeat: number }>) => {
  tic.play();
  updateMetronomeUi(event.detail.newBeat);
};

const handleMetronomeBeatToc = (event: CustomEvent<{ newBeat: number }>) => {
  toc.play();
  updateMetronomeUi(event.detail.newBeat);
};

const handleNeckTrainingNoteChange = (
  event: CustomEvent<{ note: Note; accidental?: Accidental }>,
) => {
  const { note, accidental } = event.detail;

  updateNeckTrainingUi(note, accidental);

  noteSoundMap[note].play();
  if (accidental) {
    setTimeout(() => {
      accidentalSoundMap[accidental].play();
    }, 300);
  }
};

const handleUiMetronomeBpmIncrease = () => {
  app.state.metronome.state.setBpm(app.state.metronome.state.bpm + 1);
  ui.metronome.bpm.value = app.state.metronome.state.bpm.toString();
};

const handleUiMetronomeBpmDecrease = () => {
  app.state.metronome.state.setBpm(app.state.metronome.state.bpm - 1);
  ui.metronome.bpm.value = app.state.metronome.state.bpm.toString();
};

const init = () => {
  const { metronome: { state: { bpm, beats, quarters } } } = app.state;

  ui.metronome.bpm.value = bpm.toString();
  ui.metronome.timeSignature.value = `${beats}/${quarters}`;

  addEventListener(
    'state:metronome:beat:tic',
    handleMetronomeBeatTic as EventListenerOrEventListenerObject,
  );
  addEventListener(
    'state:metronome:beat:toc',
    handleMetronomeBeatToc as EventListenerOrEventListenerObject,
  );
  addEventListener(
    'state:neckTraining:note:change',
    handleNeckTrainingNoteChange as EventListenerOrEventListenerObject,
  );
  addEventListener(
    'ui:metronome:bpm:increase',
    handleUiMetronomeBpmIncrease as EventListenerOrEventListenerObject,
  );
  addEventListener(
    'ui:metronome:bpm:decrease',
    handleUiMetronomeBpmDecrease as EventListenerOrEventListenerObject,
  );
};

// Main

init();

app.start();
ui.run();
