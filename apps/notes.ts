export type Accidental = '#' | 'b';
export type Note = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type NoteWithAccidental =
  | 'A#'
  | 'B#'
  | 'C#'
  | 'D#'
  | 'E#'
  | 'F#'
  | 'G#'
  | 'Ab'
  | 'Bb'
  | 'Cb'
  | 'Db'
  | 'Eb'
  | 'Fb'
  | 'Gb';

const noteNames: { [noteNumber: number]: string[] } = {
  0: ['C', 'B#', 'Dbb'],
  1: ['C#', 'Db'],
  2: ['D', 'C##', 'Ebb'],
  3: ['D#', 'Eb', 'Fbb'],
  4: ['E', 'D##', 'Fb'],
  5: ['F', 'E#', 'Gbb'],
  6: ['F#', 'Gb'],
  7: ['G', 'F##', 'Abb'],
  8: ['G#', 'Ab'],
  9: ['A', 'G##', 'Bbb'],
  10: ['A#', 'Bb', 'Cbb'],
  11: ['B', 'A##', 'Cb'],
};

export const findNoteFromPitch = (
  pitch: number,
): { note: NoteWithAccidental; octave: number } => {
  const note = Math.round(12 * Math.log2(pitch / 440) + 69);
  const octave = Math.floor(note / 12) - 1;
  const noteName = note % 12;

  const noteWithAccidental = noteNames[noteName][0];

  return { note: noteWithAccidental as NoteWithAccidental, octave };
};
