import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { JourneyActions } from '../src/components/JourneyActions';
import {
  approvedContent,
  approvedMirror,
  approvedResponse,
  bridgeFor,
  hydrateJourneyState,
  initialState,
  reducer,
  STORAGE_KEY,
} from '../src/state/JourneyContext';
import { togetherDestination } from '../src/pages/Pages';

const response = (
  promptId: string,
  sharingLevel: 'private' | 'share-exact' | 'summary-requested' | 'self-share' | 'not-ready' = 'private',
) => ({ promptId, responseState: 'answered' as const, text: 'SECRET concern', sharingLevel });

describe('v0.2 private boundaries', () => {
  it('uses schema-v2 storage and separates partners', () => {
    expect(STORAGE_KEY).toBe('weddingos-prototype-v2');
    const state = reducer(initialState, {
      type: 'response', partner: 'partner-a', response: response('marriage-sentence'),
    });
    expect(state.partners['partner-b'].responses['marriage-sentence']).toBeUndefined();
  });

  it('returns only explicitly approved response forms', () => {
    expect(approvedResponse(response('promise'))).toBeUndefined();
    expect(approvedResponse(response('promise', 'self-share'))).toBeUndefined();
    expect(approvedResponse(response('promise', 'share-exact'))).toBe('SECRET concern');
    expect(approvedResponse({ ...response('promise', 'summary-requested'), approvedSummary: 'Approved' })).toBe('Approved');
  });

  it('never uses the open question in bridge language', () => {
    const state = reducer(initialState, {
      type: 'response', partner: 'partner-a',
      response: { ...response('marriage-open-question', 'share-exact'), text: 'distinctive private concern' },
    });
    expect(bridgeFor(state)).not.toMatch(/distinctive|concern|withheld/i);
  });

  it('formats approved structured selections and filters private content', () => {
    expect(approvedResponse({
      ...response('ten-year-words', 'share-exact'), text: undefined,
      selectedValues: ['Peaceful', 'Playful', 'Secure'],
    })).toBe('Peaceful, Playful, Secure');
    let state = reducer(initialState, { type: 'response', partner: 'partner-a', response: response('promise') });
    state = reducer(state, { type: 'response', partner: 'partner-b', response: response('promise', 'not-ready') });
    expect(approvedContent(state)).toEqual([]);
  });
});

describe('safe hydration', () => {
  it('deeply supplies defaults to an incomplete compatible state', () => {
    const state = hydrateJourneyState({
      schemaVersion: 2,
      partners: { 'partner-a': { responses: { promise: response('promise') } } },
      shared: { mirror: { assessment: 'partly' }, reveal: { entries: { 'partner-a': { ready: true } } } },
    });
    expect(state.partners['partner-b'].responses).toEqual({});
    expect(state.shared.discoveries).toEqual({});
    expect(state.shared.bridgeApprovals).toEqual([]);
    expect(state.shared.mirror.corrections).toEqual({});
    expect(state.shared.reveal.entries['partner-b']).toEqual({ ready: false });
  });

  it('resets an incompatible or invalid schema safely', () => {
    expect(hydrateJourneyState({ schemaVersion: 1, role: 'partner-b' })).toEqual(initialState);
    expect(hydrateJourneyState(null)).toEqual(initialState);
  });
});

describe('shared interaction state', () => {
  it('skips discernment for Core in both directions', () => {
    expect(togetherDestination('tradeoff', 'next', 'core')).toBe('/together/pause-check');
    expect(togetherDestination('pause-check', 'back', 'core')).toBe('/together/tradeoff');
    expect(togetherDestination('tradeoff', 'next', 'christ-centered')).toBe('/together/discern');
  });

  it('stores listener, pause, reveal, and mirror choices', () => {
    let state = reducer(initialState, { type: 'listener', partner: 'partner-a', value: 'Mostly understood' });
    state = reducer(state, { type: 'pause-check', value: 'peaceful' });
    state = reducer(state, { type: 'reveal-entry', partner: 'partner-a', values: { prediction: 'Faithfulness', ready: true } });
    expect(state.partners['partner-a'].listenerCheck).toBe('Mostly understood');
    expect(state.shared.pauseCheck).toBe('peaceful');
    expect(state.shared.reveal.revealed).toBe(false);
    expect(approvedMirror(reducer(state, { type: 'mirror-assessment', value: 'do-not-save' }))).toBeUndefined();
  });
});

describe('JourneyActions', () => {
  it('supports callback actions and blocks disabled Continue', () => {
    const back = vi.fn();
    const next = vi.fn();
    render(<MemoryRouter><JourneyActions onBack={back} onContinue={next} disableContinue /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(back).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
  });

  it('renders deterministic link actions', () => {
    render(<MemoryRouter><JourneyActions backTo="/before" continueTo="/after" /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/before');
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/after');
  });
});
