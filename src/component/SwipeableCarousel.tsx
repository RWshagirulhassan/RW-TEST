import { useCallback, useEffect, useState } from 'react'

export default function SwipableCarousel({
  enableIndicator = true,
  gapbetweenindicator = '2',
  indicatorBorderWidth = '1.5px',
  sizeOfIndicator = '10px',
  slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}: {
  sizeOfIndicator?: string
  enableIndicator?: boolean
  gapbetweenindicator?: string
  indicatorBorderWidth?: string
  autoSlide?: boolean
  slides: React.ReactElement[]
  autoSlideInterval?: number
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [curr, setCurr] = useState<number>(0)
  const minSwipeDistance = 20

  const specificIndex = (index: number) => setCurr(index)

  const prev = () => setCurr(curr === 0 ? slides.length - 1 : curr - 1)

  const next = useCallback(() => {
    setCurr(curr === slides.length - 1 ? 0 : curr + 1)
  }, [curr, slides.length])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      if (isLeftSwipe) {
        next()
      } else {
        prev()
      }
    }
  }

  useEffect((): (() => void) | undefined => {
    if (!autoSlideInterval) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
    return
  }, [autoSlideInterval, next])

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className='relative overflow-x-hidden flex w-full h-full justify-start items-center '
    >
      {enableIndicator && (
        <div className={`absolute flex z-10 w-full bottom-1 items-center  justify-center gap-${gapbetweenindicator}  `}>
          {slides.map((_, i) => (
            <button
              key={i}
              style={{ height: sizeOfIndicator, width: sizeOfIndicator, borderWidth: indicatorBorderWidth }}
              type='button'
              aria-label={`select index ${i}`}
              onClick={() => specificIndex(i)}
              className={`
              transition-all  bg-none rounded-full 
              ${curr === i ? 'bg-white border-none' : 'bg-opacity-0 border-solid  border-white'}
            `}
            />
          ))}
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={index}
          aria-label={`slide-${index}`}
          role='tabpanel'
          className='h-full w-full min-w-[100%] transition-transform ease-out duration-500'
          style={{
            transform: `translateX(-${curr * 100}%)`,
          }}
        >
          {slide}
        </div>
      ))}
    </div>
  )
}
