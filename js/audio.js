import {
  moveSound,
  bumpSound,
  rotateSound,
  lockSound,
  lineSound,
  levelUpSound,
  gameOverSound,
  audioOnEl,
  audioOffEl,
} from "./selectors.js"

export function audioOn() {
  moveSound.muted = false
  bumpSound.muted = false
  gameOverSound.muted = false
  levelUpSound.muted = false
  lineSound.muted = false
  lockSound.muted = false
  rotateSound.muted = false
  audioOnEl.style.textDecoration = "underline"
  audioOffEl.style.textDecoration = "none"
}
export function audioOff() {
  moveSound.muted = true
  bumpSound.muted = true
  gameOverSound.muted = true
  levelUpSound.muted = true
  lineSound.muted = true
  lockSound.muted = true
  rotateSound.muted = true
  audioOffEl.style.textDecoration = "underline"
  audioOnEl.style.textDecoration = "none"
}
