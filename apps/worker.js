import {
  PortAudio,
  SampleFormat,
  StreamFlags,
} from 'https://deno.land/x/portaudio@0.2.0/mod.ts';
import { PitchDetector } from 'https://esm.sh/pitchy@4.1.0';

PortAudio.initialize();

const NUM_CHANNELS = 1;
const SAMPLE_RATE = 44100;
const FRAMES_PER_BUFFER = 4096;
const BROADCAST_INTERVAL = 2000;
const MIN_CLARITY_THRESHOLD = 0.9;

const pitchDetector = PitchDetector.forFloat32Array(FRAMES_PER_BUFFER);
const inputDevice = PortAudio.getDefaultInputDevice();

const inputStream = PortAudio.openStream(
  {
    device: inputDevice,
    channelCount: NUM_CHANNELS,
    sampleFormat: SampleFormat.float32,
    suggestedLatency:
      PortAudio.getDeviceInfo(inputDevice).defaultLowInputLatency,
  },
  null,
  SAMPLE_RATE,
  FRAMES_PER_BUFFER,
  StreamFlags.clipOff,
);

PortAudio.startStream(inputStream);

const buffer = new Float32Array(pitchDetector.inputLength);
let listening = true;

self.onmessage = (event) => {
  if (event.data === 'stop') {
    listening = false;
  }
};

let lastSentAt = 0;

while (listening) {
  buffer.fill(0);

  PortAudio.readStream(inputStream, buffer, pitchDetector.inputLength);

  // Detect pitch
  const [pitch, clarity] = pitchDetector.findPitch(buffer, SAMPLE_RATE);

  const since = Date.now() - lastSentAt;

  // Send pitch if it's clear enough and it's been at least 2s since the last one
  if (clarity > MIN_CLARITY_THRESHOLD && since > BROADCAST_INTERVAL) {
    self.postMessage(pitch);
    lastSentAt = Date.now();
  }
}

PortAudio.stopStream(inputStream);
PortAudio.terminate();

self.close();
