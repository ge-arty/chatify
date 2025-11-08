const keyStrokeSound: HTMLAudioElement[] = [
  new Audio("/sounds/keystroke1.mp3"),
  new Audio("/sounds/keystroke2.mp3"),
  new Audio("/sounds/keystroke3.mp3"),
  new Audio("/sounds/keystroke4.mp3"),
];

const useKeyboardSound = (): (() => void) => {
  const playRandomKeyStrokeSound = (): void => {
    const randomSound: HTMLAudioElement =
      keyStrokeSound[Math.floor(Math.random() * keyStrokeSound.length)];

    randomSound.currentTime = 0;
    randomSound
      .play()
      .catch((error: Error) => console.log("Audio play failed:", error));
  };

  return playRandomKeyStrokeSound;
};

export default useKeyboardSound;
