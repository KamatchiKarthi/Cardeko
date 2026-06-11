import { formatStartingPrice } from '@/utils/car.utils'

interface ExploreBudgetSliderProps {
  priceMin: number
  priceMax: number
  rangeMin: number
  rangeMax: number
  onChange: (nextMin: number, nextMax: number) => void
}

export default function ExploreBudgetSlider({
  priceMin,
  priceMax,
  rangeMin,
  rangeMax,
  onChange,
}: ExploreBudgetSliderProps) {
  const handleMinChange = (value: number) => {
    onChange(Math.min(value, priceMax - 100_000), priceMax)
  }

  const handleMaxChange = (value: number) => {
    onChange(priceMin, Math.max(value, priceMin + 100_000))
  }

  const minPercent = ((priceMin - rangeMin) / (rangeMax - rangeMin)) * 100
  const maxPercent = ((priceMax - rangeMin) / (rangeMax - rangeMin)) * 100

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-text-secondary">
        <span>{formatStartingPrice(priceMin)}</span>
        <span>{formatStartingPrice(priceMax)}</span>
      </div>

      <div className="relative h-2 rounded-full bg-surface-overlay">
        <div
          className="absolute h-full rounded-full bg-brand-accent/30"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
      </div>

      <div className="relative mt-[-0.5rem]">
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          step={50_000}
          value={priceMin}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow"
          aria-label="Minimum budget"
        />
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          step={50_000}
          value={priceMax}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className="pointer-events-none absolute w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow"
          aria-label="Maximum budget"
        />
      </div>
    </div>
  )
}
