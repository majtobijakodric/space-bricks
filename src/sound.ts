import brickHitSoundFile from './assets/sound/discord-notification.mp3';

const brickHitSound = new Audio(brickHitSoundFile);
brickHitSound.preload = 'auto';

export function playBrickHitSound() {
  const soundInstance = brickHitSound.cloneNode() as HTMLAudioElement;

  soundInstance.currentTime = 0;
  void soundInstance.play().catch(() => {
  });
}
