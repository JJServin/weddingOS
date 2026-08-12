import { Link } from 'react-router-dom';

type JourneyActionsProps = {
  backTo?: string;
  continueTo?: string;
  backLabel?: string;
  continueLabel?: string;
  onBack?: () => void;
  onContinue?: () => void;
  disableContinue?: boolean;
};

/** Consistent, deterministic navigation for a guided journey screen. */
export function JourneyActions({
  backTo,
  continueTo,
  backLabel = 'Back',
  continueLabel = 'Continue',
  onBack,
  onContinue,
  disableContinue = false,
}: JourneyActionsProps) {
  return (
    <div className="actions journey-actions">
      {backTo && !onBack && (
        <Link className="button secondary" to={backTo}>
          {backLabel}
        </Link>
      )}
      {onBack && (
        <button className="secondary" type="button" onClick={onBack}>
          {backLabel}
        </button>
      )}
      {continueTo && !onContinue && (
        <Link
          aria-disabled={disableContinue}
          className={`button${disableContinue ? ' disabled' : ''}`}
          onClick={(event) => disableContinue && event.preventDefault()}
          to={continueTo}
        >
          {continueLabel}
        </Link>
      )}
      {onContinue && (
        <button type="button" disabled={disableContinue} onClick={onContinue}>
          {continueLabel}
        </button>
      )}
    </div>
  );
}
