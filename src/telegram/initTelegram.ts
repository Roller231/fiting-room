import {
  init,
  viewport,
  swipeBehavior,
  isTMA,
} from '@telegram-apps/sdk-react'

export async function initTelegram() {
  if (!(await isTMA())) return false

  init()

  if (viewport.mount.isAvailable()) {
    await viewport.mount()
    viewport.expand()
  }

  // ❌ fullscreen УБРАЛИ — он ломает race condition
  // viewport.requestFullscreen()

  if (swipeBehavior.isSupported()) {
    swipeBehavior.mount()
    swipeBehavior.disableVertical()
  }

  return true
}
