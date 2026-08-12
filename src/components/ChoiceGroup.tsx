export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type ChoiceGroupProps<T extends string> = {
  legend: string;
  value?: T;
  options: ChoiceOption<T>[];
  onChange: (value: T) => void;
  required?: boolean;
  layout?: 'row' | 'stacked';
};

export function ChoiceGroup<T extends string>({
  legend,
  value,
  options,
  onChange,
  required = false,
  layout = 'stacked',
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className={`choice-group choice-group--${layout}`}>
      <legend>
        {legend}
        {required && <span className="sr-only"> (required)</span>}
      </legend>
      <div className="choice-options">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              aria-pressed={selected}
              className="choice-option"
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="choice-option__content">
                <strong>{option.label}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
              {selected && <span className="choice-option__selected">✓ Selected</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
