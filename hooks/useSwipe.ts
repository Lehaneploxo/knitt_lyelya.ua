import { useState } from 'react'

interface UseSwipeProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  minSwipeDistance?: number
  minSwipeVelocity?: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 80, // Увеличена дистанция для меньшей чувствительности
  minSwipeVelocity = 0.3, // Минимальная скорость свайпа (пиксели/мс)
}: UseSwipeProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setTouchStartTime(Date.now())
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartTime) return

    const distance = touchStart - touchEnd
    const timeElapsed = Date.now() - touchStartTime
    const velocity = Math.abs(distance) / timeElapsed

    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    const isFastEnough = velocity >= minSwipeVelocity

    // Требуем либо достаточную дистанцию, либо быструю скорость
    if (isFastEnough || Math.abs(distance) > minSwipeDistance * 1.5) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
