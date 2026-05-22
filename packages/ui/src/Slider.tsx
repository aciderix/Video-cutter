import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from './cn.ts';

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  ariaLabel,
  className,
  disabled,
}: SliderProps) {
  return (
    <RadixSlider.Root
      className={cn('relative flex h-5 w-full items-center', className)}
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onValueChange(v[0] ?? value)}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <RadixSlider.Track className="relative h-1.5 grow rounded-full bg-zinc-800">
        <RadixSlider.Range className="absolute h-full rounded-full bg-indigo-500" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block h-4 w-4 rounded-full border-2 border-indigo-500 bg-white shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        aria-label={ariaLabel}
      />
    </RadixSlider.Root>
  );
}
