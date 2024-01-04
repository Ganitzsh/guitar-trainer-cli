import { Sound } from './sound.ts';

export function newSound(soundFile: string): Sound {
  let cmd: string[];

  const path = `./assets/sound/${soundFile}`;

  if (Deno.build.os === 'windows') {
    cmd = ['powershell', '-c', `Play-Sound -Path ${path}`];
  } else if (Deno.build.os === 'darwin') {
    cmd = ['afplay', path];
  } else {
    cmd = ['aplay', path];
  }

  const command = new Deno.Command(cmd[0], { args: cmd.slice(1) });

  return {
    play: async () => {
      const process = command.spawn();
      await process.status;
    },
  };
}
