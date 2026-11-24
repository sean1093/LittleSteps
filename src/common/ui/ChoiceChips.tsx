/**
 * One choice out of a short list, as a row of chips.
 *
 * For a form field with a handful of options. A native `<select>` costs three
 * taps on a phone — open the wheel, spin it, confirm — and hides every option
 * but the current one. Chips cost one tap and show the whole set, which is
 * what a parent logging a feed one-handed needs.
 *
 * It is a radio group to assistive technology: one option is checked, and the
 * group is named by its label. Not for filters above a list — those are
 * toggle buttons (`aria-pressed` on `.chip`), which this does not replace.
 */
interface ChoiceChipsProps<Value extends string> {
  /** The field's label; it names the group. */
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onChange: (value: Value) => void;
  disabled?: boolean;
  /** Colour of the chosen chip. Defaults to the LittleSteps primary. */
  accent?: string;
}

export default function ChoiceChips<Value extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  accent = 'bg-primary-dark text-white',
}: ChoiceChipsProps<Value>) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="block text-sm font-medium text-ink mb-1" aria-hidden="true">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`chip ${checked ? `${accent} border-transparent` : ''}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
