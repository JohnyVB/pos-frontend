import successSound from '../assets/sounds/beep-success.wav'
import errorSound from '../assets/sounds/beep-error.wav'

const useSounds = () => {
  const playSuccessSound = () => {
    const audio = new Audio(successSound)
    audio.play()
  }
  const playErrorSound = () => {
    const audio = new Audio(errorSound)
    audio.play()
  }

  return {
    playSuccessSound,
    playErrorSound
  }
}

export default useSounds