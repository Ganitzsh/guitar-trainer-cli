# Metronome and Neck Training App

This application serves as a metronome to help musicians keep time and also includes a neck training feature for guitarists to practice note recognition on the fretboard.

## Features

- **Metronome**: Set the beats per minute (BPM), beats, and quarters to practice your timing with auditory cues for each beat.
- **Neck Training**: A tutor telling you what note to find with a pitch recognition listening to your default input and says yes or no
  
## How to Run

To run the app, you need to have Deno installed on your machine. Once Deno is installed, you can start the application using the following command:

```sh
deno run --unstable -A main.ts
```

## How to use

To adjust the BPM (Beats Per Minute):

- **Increase BPM**: Left-click on the BPM value to increase it.
- **Decrease BPM**: Right-click on the BPM value to decrease it.

## TODO

- [ ] Add real time settings input for each individual app
- [ ] Add toggles to disable/enable individual apps
- [ ] Add toggles to mute/unmute specific sounds

### Credits

- Sound assets for notes generated with Google's TTS on [freetts.com](https://freetts.com/)
- [Tic](https://freesound.org/people/MrOwn1/sounds/110314/), [Toc](https://freesound.org/people/fellur/sounds/429721/), [Yes](https://freesound.org/people/vikuserro/sounds/246307/) and [No](https://freesound.org/people/allietron/sounds/269542/) found on [freesound.org](https://freesound.org)
