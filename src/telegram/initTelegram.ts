import {
  init,
  viewport,
  swipeBehavior,
  isTMA,
} from '@telegram-apps/sdk-react'

export async function initTelegram() {
  // Проверяем, что мы реально в Telegram Mini App
  if (!(await isTMA())) return false

  // Инициализация SDK
  init()

  // === VIEWPORT ===
  if (viewport.mount.isAvailable()) {
    await viewport.mount()

    // максимально растягиваем
    viewport.expand()

    // пробуем фуллскрин (если разрешён платформой)
    if (viewport.requestFullscreen.isAvailable()) {
      try {
        await viewport.requestFullscreen()
      } catch (e) {
        // на iOS часто запрещено — это ок
        console.warn('Fullscreen not allowed:', e)
      }
    }
  }

  // === SWIPE ===
  if (swipeBehavior.isSupported()) {
    swipeBehavior.mount()

    // ❌ запрещаем вертикальный свайп (закрытие / сворачивание)
    swipeBehavior.disableVertical()


  }

  return true
}
