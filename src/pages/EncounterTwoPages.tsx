import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Card } from "../components/AppShell";
import { ChoiceGroup } from "../components/ChoiceGroup";
import { JourneyActions } from "../components/JourneyActions";
import { MultiSelectCards } from "../components/MultiSelectCards";
import {
  encounterTwoContent,
  encounterTwoNextSteps,
  encounterTwoPromptIds,
  encounterTwoSummary,
  meaningOptions,
  preservationValues,
  pressureOptions,
  tensionOptions,
} from "../content/encounterTwo";
import { useJourney } from "../state/JourneyContext";
import type { PartnerId, PrivateResponse } from "../types/journey";

const asPartner = (value?: string): PartnerId =>
  value === "partner-b" ? "partner-b" : "partner-a";
const labelFor = (partner: PartnerId) =>
  partner === "partner-a" ? "Partner A" : "Partner B";
const otherPartner = (partner: PartnerId): PartnerId =>
  partner === "partner-a" ? "partner-b" : "partner-a";
const options = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

export const encounterTwoTogetherSequence = [
  "laugh",
  "reveal",
  "story",
  "meaning",
  "tradeoff",
  "discern",
  "capture",
] as const;
export function encounterTwoDestination(
  step: string,
  direction: "back" | "next",
  mode: "core" | "christ-centered",
) {
  const sequence =
    mode === "core"
      ? encounterTwoTogetherSequence.filter((item) => item !== "discern")
      : [...encounterTwoTogetherSequence];
  const index = sequence.indexOf(step as (typeof sequence)[number]);
  if (direction === "back")
    return index <= 0
      ? "/encounter-two/together"
      : `/encounter-two/together/${sequence[index - 1]}`;
  return index >= sequence.length - 1
    ? "/encounter-two/integration/partner-a"
    : `/encounter-two/together/${sequence[index + 1]}`;
}

export function EncounterTwoLanding() {
  return (
    <Card eyebrow="Encounter Two" title={encounterTwoContent.landing.title}>
      <p>{encounterTwoContent.landing.body}</p>
      <p className="assurance">You will not choose a wedding format today.</p>
      <ol>
        <li>Reflect separately</li>
        <li>Choose what may be shared</li>
        <li>Come together</li>
        <li>Preserve what you learned</li>
      </ol>
      <Link className="button" to="/encounter-two/prepare/partner-a">
        Begin separately
      </Link>
    </Card>
  );
}

export function EncounterTwoPrepareIntro() {
  const partner = asPartner(useParams().partnerId);
  const { state, dispatch } = useJourney();
  const navigate = useNavigate();
  useEffect(
    () => dispatch({ type: "role", role: partner }),
    [dispatch, partner],
  );
  return (
    <Card eyebrow="Private reflection" title={encounterTwoContent.intro.title}>
      <p>{encounterTwoContent.intro.body}</p>
      <p className="assurance">
        Do not solve anything yet. Just notice what matters.
      </p>
      {state.shared.mode === "christ-centered" && (
        <div className="spiritual">
          <strong>Matthew 6:21</strong>
          <p>What we protect often reveals what we treasure.</p>
        </div>
      )}
      <JourneyActions
        backTo="/encounter-two"
        onContinue={() => {
          dispatch({ type: "role", role: partner });
          dispatch({
            type: "encounter-two",
            values: {
              preparation: {
                ...state.shared.encounterTwo.preparation,
                [partner]: "in-progress",
              },
            },
          });
          navigate(`/encounter-two/prepare/${partner}/values`);
        }}
        continueLabel="Start with what matters"
      />
    </Card>
  );
}

function useEncounterTwoResponse(partner: PartnerId, promptId: string) {
  const { state, dispatch } = useJourney();
  const response = state.partners[partner].responses[promptId] ?? {
    promptId,
    responseState: "not-started",
    sharingLevel: "private" as const,
  };
  const update = (patch: Partial<PrivateResponse>) =>
    dispatch({
      type: "response",
      partner,
      response: { ...response, ...patch, promptId },
    });
  return { state, response, update };
}

export function EncounterTwoPrivateStep() {
  const partner = asPartner(useParams().partnerId);
  const step = useParams().step ?? "values";
  if (step === "values") return <PreserveValues partner={partner} />;
  if (step === "priority") return <TopPriority partner={partner} />;
  if (step === "pressure") return <Pressure partner={partner} />;
  return <Navigate to={`/encounter-two/prepare/${partner}/values`} replace />;
}

function PreserveValues({ partner }: { partner: PartnerId }) {
  const { response, update } = useEncounterTwoResponse(
    partner,
    "e2-preserve-values",
  );
  return (
    <Card title="What Do I Want to Protect?">
      <p className="prompt">
        Choose up to three things you most want this season to preserve.
      </p>
      <p>There is no ideal list. Choose what feels important to you.</p>
      <MultiSelectCards
        legend="Things I want to protect"
        value={response.selectedValues ?? []}
        onChange={(selectedValues) =>
          update({ selectedValues, responseState: "answered" })
        }
        options={options(preservationValues)}
      />
      {response.selectedValues?.includes("Something else") && (
        <label>
          Something else
          <input
            value={response.customValue ?? ""}
            onChange={(event) => update({ customValue: event.target.value })}
          />
        </label>
      )}
      <JourneyActions
        backTo={`/encounter-two/prepare/${partner}`}
        continueTo={`/encounter-two/prepare/${partner}/priority`}
      />
    </Card>
  );
}

function TopPriority({ partner }: { partner: PartnerId }) {
  const { state, response, update } = useEncounterTwoResponse(
    partner,
    "e2-top-priority",
  );
  const valuesResponse =
    state.partners[partner].responses["e2-preserve-values"];
  const selected = (valuesResponse?.selectedValues ?? []).map((value) =>
    value === "Something else" && valuesResponse?.customValue
      ? valuesResponse.customValue
      : value,
  );
  return (
    <Card title="If One Became Hard to Protect…">
      <p className="prompt">
        If planning became difficult, which of these would you be most reluctant
        to sacrifice?
      </p>
      <ChoiceGroup
        legend="Most important to protect"
        value={response.selectedValue}
        onChange={(selectedValue) =>
          update({ selectedValue, responseState: "answered" })
        }
        options={options([...selected, "I cannot choose yet"])}
      />
      {response.selectedValue && (
        <label>
          How would you notice that this was starting to get lost?
          <span className="helper">
            For example: We stop enjoying time together because every
            conversation becomes about planning.
          </span>
          <textarea
            value={response.optionalFollowUp ?? ""}
            onChange={(event) =>
              update({ optionalFollowUp: event.target.value })
            }
          />
        </label>
      )}
      <JourneyActions
        backTo={`/encounter-two/prepare/${partner}/values`}
        continueTo={`/encounter-two/prepare/${partner}/pressure`}
      />
    </Card>
  );
}

function Pressure({ partner }: { partner: PartnerId }) {
  const { response, update } = useEncounterTwoResponse(partner, "e2-pressure");
  const [open, setOpen] = useState(Boolean(response.optionalFollowUp));
  return (
    <Card title="What Is Pulling On Me?">
      <p className="prompt">
        Where do you feel the strongest outside pull right now?
      </p>
      <ChoiceGroup
        legend="Strongest outside pull"
        value={response.selectedValue}
        onChange={(selectedValue) =>
          update({
            selectedValue,
            responseState: "answered",
            sharingLevel: "private",
          })
        }
        options={options(pressureOptions)}
      />
      {response.selectedValue === "Something else" && (
        <label>
          Something else
          <input
            value={response.customValue ?? ""}
            onChange={(event) =>
              update({
                customValue: event.target.value,
                sharingLevel: "private",
              })
            }
          />
        </label>
      )}
      <button
        type="button"
        className="secondary"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Want to say more?
      </button>
      {open && (
        <label>
          What makes this feel like pressure rather than simply something you
          value?
          <textarea
            value={response.optionalFollowUp ?? ""}
            onChange={(event) =>
              update({
                optionalFollowUp: event.target.value,
                sharingLevel: "private",
              })
            }
          />
        </label>
      )}
      <JourneyActions
        backTo={`/encounter-two/prepare/${partner}/priority`}
        continueTo={`/encounter-two/prepare/${partner}/sharing`}
      />
    </Card>
  );
}

export function EncounterTwoSharing() {
  const partner = asPartner(useParams().partnerId);
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const sharing = e2.sharing[partner];
  const nav = useNavigate();
  const update = (
    promptId: string,
    value: "share" | "self-share" | "private",
  ) =>
    dispatch({
      type: "encounter-two",
      values: {
        sharing: {
          ...e2.sharing,
          [partner]: { ...sharing, [promptId]: value },
        },
      },
    });
  return (
    <Card title="What would you like to bring into the conversation?">
      <p>Only what you approve can appear in the shared encounter.</p>
      {encounterTwoPromptIds.slice(0, 3).map((promptId) => {
        const response = state.partners[partner].responses[promptId];
        return (
          <article className="share" key={promptId}>
            <strong>
              {promptId === "e2-preserve-values"
                ? "What I want to protect"
                : promptId === "e2-top-priority"
                  ? "What feels most important"
                  : "What is pulling on me"}
            </strong>
            <p>
              {encounterTwoSummary(promptId, response) || "No recorded answer."}
            </p>
            <ChoiceGroup
              legend="Sharing choice"
              value={sharing[promptId] ?? "private"}
              onChange={(value) => update(promptId, value)}
              options={options([
                "Bring this into our conversation",
                "I will explain it in my own words",
                "Keep this private",
              ]).map((option, index) => ({
                ...option,
                value: (["share", "self-share", "private"] as const)[index],
              }))}
            />
          </article>
        );
      })}
      <JourneyActions
        backTo={`/encounter-two/prepare/${partner}/pressure`}
        onContinue={() => {
          dispatch({
            type: "encounter-two",
            values: {
              preparation: { ...e2.preparation, [partner]: "complete" },
            },
          });
          nav("/encounter-two/waiting");
        }}
        continueLabel="Finish private preparation"
      />
    </Card>
  );
}

export function EncounterTwoWaiting() {
  const { state, dispatch } = useJourney();
  const partner: PartnerId =
    state.role === "partner-b" ? "partner-b" : "partner-a";
  const e2 = state.shared.encounterTwo;
  const bothReady = Object.values(e2.preparation).every(
    (value) => value === "complete",
  );
  return (
    <Card
      title={
        bothReady ? "Both partners are ready" : "Your preparation is complete"
      }
    >
      <p>
        {bothReady
          ? "Both partners are ready."
          : "Your partner is still preparing."}
      </p>
      {!bothReady && (
        <button
          type="button"
          className="secondary"
          onClick={() =>
            dispatch({
              type: "encounter-two",
              values: {
                preparation: {
                  ...e2.preparation,
                  [otherPartner(partner)]: "complete",
                },
              },
            })
          }
        >
          Prototype control: Simulate partner completion
        </button>
      )}
      <JourneyActions
        backTo={`/encounter-two/prepare/${partner}/sharing`}
        continueTo={bothReady ? "/encounter-two/together" : undefined}
      />
    </Card>
  );
}

export function EncounterTwoTogetherArrival() {
  const [ready, setReady] = useState(false);
  const { dispatch } = useJourney();
  useEffect(() => dispatch({ type: "role", role: "together" }), [dispatch]);
  return (
    <Card title="What Are We Trying to Preserve?">
      <p>
        You have each thought about what matters to you. Now the goal is not to
        combine your answers into one perfect list. The goal is to understand
        what each of you is trying to protect.
      </p>
      <p className="assurance">Curiosity is enough.</p>
      <button
        type="button"
        className="choice-option"
        aria-pressed={ready}
        onClick={() => {
          setReady((value) => !value);
          dispatch({ type: "role", role: "together" });
        }}
      >
        <span>We’ll listen, stay curious and pause if we need to.</span>
        {ready && <span className="choice-option__selected">✓ Selected</span>}
      </button>
      <JourneyActions
        backTo="/encounter-two/waiting"
        continueTo="/encounter-two/together/laugh"
        disableContinue={!ready}
        continueLabel="We’re ready"
      />
    </Card>
  );
}

export function EncounterTwoTogetherStep() {
  const step = useParams().step ?? "laugh";
  const { state, dispatch } = useJourney();
  useEffect(() => dispatch({ type: "role", role: "together" }), [dispatch]);
  if (step === "discern" && state.shared.mode === "core")
    return <Navigate to="/encounter-two/together/capture" replace />;
  if (step === "laugh") return <PlayfulOpener />;
  if (step === "reveal") return <EncounterTwoReveal />;
  if (step === "story") return <StoryStep />;
  if (step === "meaning") return <MeaningStep />;
  if (step === "tradeoff") return <TradeoffStep />;
  if (step === "discern") return <DiscernStep />;
  if (step === "capture") return <EncounterTwoCapture />;
  return <Navigate to="/encounter-two/together/laugh" replace />;
}

function StepActions({ step }: { step: string }) {
  const { state } = useJourney();
  return (
    <JourneyActions
      backTo={encounterTwoDestination(step, "back", state.shared.mode)}
      continueTo={encounterTwoDestination(step, "next", state.shared.mode)}
    />
  );
}

function PlayfulOpener() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const starters = [
    "Napkin colors",
    "Fonts",
    "Flowers",
    "Seating details",
    "Invitations",
    "A tiny décor decision",
    "Something completely unexpected",
    "We have our answer",
  ];
  return (
    <Card title="Start Light">
      <p className="prompt">
        Five years from now, what tiny wedding detail are we most likely to
        laugh about caring so much about?
      </p>
      <p>
        Use a card only if it helps you begin talking. This answer will not
        enter your shared record.
      </p>
      <ChoiceGroup
        legend="Conversation starters"
        value={e2.playfulAnswer}
        onChange={(playfulAnswer) =>
          dispatch({ type: "encounter-two", values: { playfulAnswer } })
        }
        options={options(starters)}
      />
      <StepActions step="laugh" />
    </Card>
  );
}

function EncounterTwoReveal() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const updateEntry = (
    partner: PartnerId,
    values: Partial<(typeof e2.reveal.entries)[PartnerId]>,
  ) =>
    dispatch({
      type: "encounter-two",
      values: {
        reveal: {
          ...e2.reveal,
          entries: {
            ...e2.reveal.entries,
            [partner]: { ...e2.reveal.entries[partner], ...values },
          },
        },
      },
    });
  const bothReady =
    e2.reveal.entries["partner-a"].ready &&
    e2.reveal.entries["partner-b"].ready;
  const actual = (partner: PartnerId) => {
    if (e2.sharing[partner]["e2-top-priority"] !== "share") return undefined;
    return state.partners[partner].responses["e2-top-priority"]
      ?.selectedValue === "I cannot choose yet"
      ? "Still figuring this out"
      : state.partners[partner].responses["e2-top-priority"]?.selectedValue;
  };
  return (
    <Card title="What Do You Think Matters Most to Your Partner?">
      <p>
        This is curiosity, not a test. Each person predicts privately, hides the
        answer, and then both reveal together.
      </p>
      {(["partner-a", "partner-b"] as PartnerId[]).map((partner) => {
        const entry = e2.reveal.entries[partner];
        return (
          <section className="reveal-entry" key={partner}>
            <h2>
              {labelFor(partner)} predicts {labelFor(otherPartner(partner))}
            </h2>
            {!entry.ready && !e2.reveal.revealed ? (
              <>
                <ChoiceGroup
                  legend="Choose a prediction"
                  value={entry.prediction}
                  onChange={(prediction) =>
                    updateEntry(partner, { prediction })
                  }
                  options={options(preservationValues)}
                />
                <button
                  type="button"
                  disabled={!entry.prediction}
                  onClick={() => updateEntry(partner, { ready: true })}
                >
                  Hide my prediction and mark ready
                </button>
              </>
            ) : (
              <p className="hidden-answer">
                {e2.reveal.revealed
                  ? `Prediction: ${entry.prediction}`
                  : "Prediction hidden · Ready"}
              </p>
            )}
          </section>
        );
      })}
      {bothReady && !e2.reveal.revealed && (
        <button
          type="button"
          onClick={() =>
            dispatch({
              type: "encounter-two",
              values: { reveal: { ...e2.reveal, revealed: true } },
            })
          }
        >
          Reveal both perspectives
        </button>
      )}
      {e2.reveal.revealed && (
        <div className="reveal-results">
          <p>
            <strong>Partner A predicted:</strong>{" "}
            {e2.reveal.entries["partner-a"].prediction}
          </p>
          <p>
            <strong>Partner B’s priority:</strong>{" "}
            {actual("partner-b") || "Partner will explain their answer aloud."}
          </p>
          <p>
            <strong>Partner B predicted:</strong>{" "}
            {e2.reveal.entries["partner-b"].prediction}
          </p>
          <p>
            <strong>Partner A’s priority:</strong>{" "}
            {actual("partner-a") || "Partner will explain their answer aloud."}
          </p>
          <p>What did you understand correctly? What surprised you?</p>
          <p>What would you like to understand better?</p>
        </div>
      )}
      <StepActions step="reveal" />
    </Card>
  );
}

function StoryStep() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const listenerOptions = [
    "Yes, that is what I mean",
    "Mostly",
    "I want to clarify",
  ];
  return (
    <Card title="When Something Important Was Protected">
      <p className="prompt">
        Think of a stressful or busy season you have already gone through
        together. Was there something important between you that stayed
        protected?
      </p>
      <p>What helped protect it?</p>
      {(["partner-a", "partner-b"] as PartnerId[]).map((partner) => (
        <section key={partner}>
          <h2>{labelFor(partner)} speaks</h2>
          <p>
            {labelFor(otherPartner(partner))} responds: “What I hear mattered
            most was…”
          </p>
          <ChoiceGroup
            legend={`${labelFor(partner)} listener check`}
            value={e2.listenerChecks[partner]}
            onChange={(value) =>
              dispatch({
                type: "encounter-two",
                values: {
                  listenerChecks: { ...e2.listenerChecks, [partner]: value },
                },
              })
            }
            options={options(listenerOptions)}
          />
        </section>
      ))}
      <StepActions step="story" />
    </Card>
  );
}

function MeaningStep() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  return (
    <Card title="What Are We Really Protecting?">
      <p className="prompt">What makes this matter so much?</p>
      {(["partner-a", "partner-b"] as PartnerId[]).map((partner) => (
        <ChoiceGroup
          key={partner}
          legend={`${labelFor(partner)} answers`}
          value={e2.meaning[partner]}
          onChange={(value) =>
            dispatch({
              type: "encounter-two",
              values: { meaning: { ...e2.meaning, [partner]: value } },
            })
          }
          options={options(meaningOptions)}
        />
      ))}
      <p className="assurance">
        You may be protecting different good things. The goal is to understand
        them before asking either person to compromise.
      </p>
      <p>What do you understand better now?</p>
      <StepActions step="meaning" />
    </Card>
  );
}

function TradeoffStep() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  return (
    <Card title="When Two Good Things Compete">
      <p className="scenario">
        Imagine one path makes it easier to include more people you care about,
        but requires more money, coordination and planning energy. Another path
        protects financial peace and gives you more breathing room, but means
        fewer people can participate.
      </p>
      <p>What good does the first path protect?</p>
      <p>What good does the second path protect?</p>
      <MultiSelectCards
        legend="Which tension feels most familiar to us? Choose up to two."
        max={2}
        value={e2.tension}
        onChange={(tension) =>
          dispatch({ type: "encounter-two", values: { tension } })
        }
        options={options(tensionOptions)}
      />
      <StepActions step="tradeoff" />
    </Card>
  );
}

function DiscernStep() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const attention = [
    "Scripture",
    "Church teaching",
    "A church requirement we should verify",
    "Personal conscience",
    "Wise counsel",
    "Hospitality toward others",
    "Stewardship",
    "Something we should pray about",
    "Nothing specific right now",
    "We are not sure yet",
  ];
  const next = [
    "No",
    "Speak with a priest or pastor",
    "Verify a church requirement",
    "Read or pray about something together",
    "Continue discussing it ourselves",
    "We are not sure yet",
  ];
  return (
    <Card title="What Needs Faithful Attention?">
      <p className="prompt">
        Did anything you named tonight feel connected to your faith, conscience
        or responsibilities as Christians?
      </p>
      <MultiSelectCards
        legend="Faithful attention"
        max={attention.length}
        value={e2.faithAttention}
        onChange={(faithAttention) =>
          dispatch({ type: "encounter-two", values: { faithAttention } })
        }
        options={options(attention)}
      />
      <ChoiceGroup
        legend="Is there anything we should understand more clearly before making future wedding decisions?"
        value={e2.faithNextStep}
        onChange={(faithNextStep) =>
          dispatch({ type: "encounter-two", values: { faithNextStep } })
        }
        options={options(next)}
      />
      <StepActions step="discern" />
    </Card>
  );
}

function approvedValuePools(state: ReturnType<typeof useJourney>["state"]) {
  const e2 = state.shared.encounterTwo;
  const byPartner = (["partner-a", "partner-b"] as PartnerId[]).map(
    (partner) => {
      const response = state.partners[partner].responses["e2-preserve-values"];
      if (e2.sharing[partner]["e2-preserve-values"] !== "share") return [];
      return (response?.selectedValues ?? []).map((value) =>
        value === "Something else" && response?.customValue
          ? response.customValue
          : value,
      );
    },
  );
  return {
    all: [...new Set(byPartner.flat())],
    shared: byPartner[0].filter((value) => byPartner[1].includes(value)),
  };
}

function EncounterTwoCapture() {
  const { state, dispatch } = useJourney();
  const e2 = state.shared.encounterTwo;
  const values = approvedValuePools(state);
  const update = (values: Partial<typeof e2>) =>
    dispatch({ type: "encounter-two", values });
  return (
    <Card title="What We Want to Protect">
      <ChoiceGroup
        legend="One thing we both want to protect"
        value={e2.sharedPriority}
        onChange={(sharedPriority) => update({ sharedPriority })}
        options={options([
          ...values.shared,
          "We do not have a shared one yet",
          "Something else",
        ])}
      />
      <label>
        Optional one-sentence note
        <textarea
          value={e2.sharedPriorityNote ?? ""}
          onChange={(event) =>
            update({ sharedPriorityNote: event.target.value })
          }
        />
      </label>
      <ChoiceGroup
        legend="Something one of us may feel more strongly about"
        value={e2.strongerPriority}
        onChange={(strongerPriority) => update({ strongerPriority })}
        options={options([
          ...values.all,
          "We do not need to capture a difference",
        ])}
      />
      <p className="helper">
        A difference does not need to be resolved tonight.
      </p>
      <ChoiceGroup
        legend="One pressure or tension we want to watch"
        value={e2.capturedTension}
        onChange={(capturedTension) => update({ capturedTension })}
        options={options([...e2.tension, "Nothing we need to save yet"])}
      />
      <ChoiceGroup
        legend="What would help next?"
        value={e2.nextStep}
        onChange={(nextStep) => update({ nextStep })}
        options={options(encounterTwoNextSteps)}
      />
      <p className="assurance">
        This preserves what mattered tonight. It does not decide what your
        wedding should look like.
      </p>
      <JourneyActions
        backTo={encounterTwoDestination("capture", "back", state.shared.mode)}
        continueTo="/encounter-two/integration/partner-a"
        continueLabel="Preserve what matters"
      />
    </Card>
  );
}

export function EncounterTwoIntegration() {
  const partner = asPartner(useParams().partnerId);
  const { response, update } = useEncounterTwoResponse(
    partner,
    "e2-private-checkout",
  );
  const { dispatch } = useJourney();
  useEffect(
    () => dispatch({ type: "role", role: partner }),
    [dispatch, partner],
  );
  const showNote =
    response.selectedValue === "Yes, but I want to keep it private" ||
    response.selectedValue === "Yes, and I may want support expressing it";
  return (
    <Card title="What Stayed With Me?">
      <label>
        What is one thing you understand better about your partner?
        <textarea
          value={response.text ?? ""}
          onChange={(event) =>
            update({ text: event.target.value, responseState: "answered" })
          }
        />
      </label>
      <ChoiceGroup
        legend="How did the conversation feel?"
        value={response.customValue}
        onChange={(customValue) =>
          update({ customValue, responseState: "answered" })
        }
        options={options([
          "I felt heard",
          "Mostly heard",
          "I need more clarification",
          "I did not feel heard",
          "I need time before answering",
        ])}
      />
      <ChoiceGroup
        legend="Is anything still hard to express?"
        value={response.selectedValue}
        onChange={(selectedValue) =>
          update({
            selectedValue,
            responseState: "answered",
            sharingLevel: "private",
          })
        }
        options={options([
          "No",
          "Yes, but I want to keep it private",
          "Yes, and I may want support expressing it",
          "I am not sure yet",
        ])}
      />
      {showNote && (
        <label>
          Would you like to leave yourself a private note?
          <textarea
            value={response.optionalFollowUp ?? ""}
            onChange={(event) =>
              update({
                optionalFollowUp: event.target.value,
                sharingLevel: "private",
              })
            }
          />
        </label>
      )}
      <ChoiceGroup
        legend="What would help next?"
        value={response.secondaryFollowUp}
        onChange={(secondaryFollowUp) =>
          update({ secondaryFollowUp, responseState: "answered" })
        }
        options={options([
          "Continue later",
          "Another conversation",
          "More information",
          "Pastoral guidance",
          "Time to pause",
          "I am not sure yet",
        ])}
      />
      <JourneyActions
        backTo={
          partner === "partner-a"
            ? "/encounter-two/together/capture"
            : "/encounter-two/integration/partner-a"
        }
        continueTo={
          partner === "partner-a"
            ? "/encounter-two/integration/partner-b"
            : "/encounter-two/record"
        }
      />
    </Card>
  );
}

export function EncounterTwoRecord() {
  const { state } = useJourney();
  const e2 = state.shared.encounterTwo;
  return (
    <Card title="Our Encounter Two Record">
      <dl>
        <dt>What we both want to protect</dt>
        <dd>{e2.sharedPriority || "Not captured together"}</dd>
        <dt>Something one of us may feel more strongly about</dt>
        <dd>{e2.strongerPriority || "Not captured together"}</dd>
        <dt>A pressure or tension we want to watch</dt>
        <dd>{e2.capturedTension || "Not captured together"}</dd>
        <dt>Agreed next step</dt>
        <dd>{e2.nextStep || "Not chosen together"}</dd>
      </dl>
      <aside className="next">
        <strong>
          Encounter One
          <br />
          What Are We Saying Yes To?
        </strong>
        <Link to="/shared-record">View Encounter One record</Link>
      </aside>
      <aside className="next">
        <strong>Next: Encounter Three — What Story Are We Celebrating?</strong>
        <span>Not yet available in this prototype.</span>
      </aside>
      <JourneyActions
        backTo="/encounter-two/integration/partner-b"
        continueTo="/shared-record"
        continueLabel="View Encounter One record"
      />
    </Card>
  );
}
