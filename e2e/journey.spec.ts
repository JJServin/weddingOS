import { expect, test, type Page } from '@playwright/test';

const selected = (page: Page, name: string | RegExp) =>
  page.getByRole('button', { name });

async function chooseWords(page: Page) {
  for (const word of ['Peaceful', 'Playful', 'Secure']) {
    await page.getByRole('button', { name: word, exact: true }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('A: text does not carry forward into unanswered prompts', async ({ page }) => {
  await page.goto('/prepare/partner-a/marriage-sentence');
  await selected(page, /Write privately/).click();
  await page.getByLabel('Your sentence').fill('patient friendship');
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'An Ordinary Evening' })).toBeVisible();
  await expect(page.getByText('patient friendship')).toHaveCount(0);
  await chooseWords(page);
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'The Promise' })).toBeVisible();
  await expect(page.getByText('patient friendship')).toHaveCount(0);
  await expect(page.locator('.choice-option[aria-pressed="true"]')).toHaveCount(0);
  await expect(page.getByLabel('What do you hope your partner understands about why this promise matters to you?')).toHaveValue('');
});

test('B: Back restores only the matching prompt data', async ({ page }) => {
  await page.goto('/prepare/partner-a/marriage-sentence');
  await selected(page, /Write privately/).click();
  await page.getByLabel('Your sentence').fill('patient friendship');
  await page.getByRole('link', { name: 'Continue' }).click();
  await chooseWords(page);
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(selected(page, /Write privately/)).toHaveAttribute('aria-pressed', 'true');
  await expect(selected(page, /Write privately/).getByText('Selected')).toBeVisible();
  await expect(page.getByLabel('Your sentence')).toHaveValue('patient friendship');
  await page.getByRole('link', { name: 'Continue' }).click();
  for (const word of ['Peaceful', 'Playful', 'Secure']) {
    await expect(selected(page, new RegExp(word))).toHaveAttribute('aria-pressed', 'true');
  }
});

test('C: all private prompts retain independent values backward and forward', async ({ page }) => {
  await page.goto('/prepare/partner-a/marriage-sentence');
  await selected(page, /Write privately/).click();
  await page.getByLabel('Your sentence').fill('sentence-only-value');
  await page.getByRole('link', { name: 'Continue' }).click();
  await chooseWords(page);
  await page.getByLabel(/ordinary weekly practice/).fill('weekly-only-value');
  await page.getByRole('link', { name: 'Continue' }).click();
  await selected(page, /Companionship/).click();
  await page.getByLabel(/hope your partner understands/).fill('promise-only-value');
  await page.getByRole('link', { name: 'Continue' }).click();
  await selected(page, /There is something I want to explore privately/).click();
  await page.getByLabel('Optional private note').fill('question-only-value');
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page.getByLabel(/hope your partner understands/)).toHaveValue('promise-only-value');
  await expect(page.getByText('question-only-value')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page.getByLabel(/ordinary weekly practice/)).toHaveValue('weekly-only-value');
  await page.getByRole('link', { name: 'Back' }).click();
  await expect(page.getByLabel('Your sentence')).toHaveValue('sentence-only-value');
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByLabel('Optional private note')).toHaveValue('question-only-value');
});

test('D: Partner A and Partner B keep independent values across every prompt', async ({ page }) => {
  await page.goto('/prepare/partner-a/marriage-sentence');
  await selected(page, /Write privately/).click();
  await page.getByLabel('Your sentence').fill('partner-a-sentence');
  await page.goto('/prepare/partner-a/ten-year-words');
  await chooseWords(page);
  await page.goto('/prepare/partner-a/promise');
  await selected(page, /Companionship/).click();
  await page.goto('/prepare/partner-a/marriage-open-question');
  await page.getByLabel('Optional private note').fill('partner-a-note');
  await page.getByRole('button', { name: 'Prototype menu' }).click();
  await page.getByRole('button', { name: 'Partner B' }).click();
  await expect(page.getByLabel('Optional private note')).toHaveValue('');
  await page.goto('/prepare/partner-b/marriage-sentence');
  await selected(page, /Write privately/).click();
  await expect(page.getByLabel('Your sentence')).toHaveValue('');
  await page.getByLabel('Your sentence').fill('partner-b-sentence');
  await page.goto('/prepare/partner-b/ten-year-words');
  await expect(page.locator('.choice-option[aria-pressed="true"]')).toHaveCount(0);
  await page.goto('/prepare/partner-b/promise');
  await expect(page.locator('.choice-option[aria-pressed="true"]')).toHaveCount(0);
  await page.goto('/prepare/partner-b/marriage-open-question');
  await expect(page.getByLabel('Optional private note')).toHaveValue('');
  await page.getByRole('button', { name: 'Prototype menu' }).click();
  await page.getByRole('button', { name: 'Partner A' }).click();
  await expect(page.getByLabel('Optional private note')).toHaveValue('partner-a-note');
  await page.goto('/prepare/partner-a/marriage-sentence');
  await expect(page.getByLabel('Your sentence')).toHaveValue('partner-a-sentence');
});

test('E: controlled choice groups change selection, expose indicator, and persist', async ({ page }) => {
  await page.goto('/choose-mode');
  await selected(page, /Christ-Centered Journey/).click();
  await expect(selected(page, /Christ-Centered Journey/)).toHaveAttribute('aria-pressed', 'true');
  await expect(selected(page, /Christ-Centered Journey/).getByText('Selected')).toBeVisible();
  await selected(page, /Core Journey/).click();
  await expect(selected(page, /Christ-Centered Journey/)).toHaveAttribute('aria-pressed', 'false');
  await expect(selected(page, /Core Journey/)).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(selected(page, /Core Journey/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/prepare/partner-a/marriage-sentence');
  await selected(page, /Write privately/).click();
  await selected(page, /Reflect without recording/).click();
  await expect(selected(page, /Write privately/)).toHaveAttribute('aria-pressed', 'false');
  await expect(selected(page, /Reflect without recording/)).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(selected(page, /Reflect without recording/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/together/pause-check');
  await selected(page, /We feel peaceful/).click();
  await expect(selected(page, /We feel peaceful/).getByText('Selected')).toBeVisible();
  await page.reload();
  await expect(selected(page, /We feel peaceful/)).toHaveAttribute('aria-pressed', 'true');
});

test('F: private and shared Back links follow the deterministic map', async ({ page }) => {
  const privateMap = [
    ['/choose-mode', '/'], ['/demo', '/choose-mode'], ['/prepare/partner-a', '/demo'],
    ['/prepare/partner-a/marriage-sentence', '/prepare/partner-a'],
    ['/prepare/partner-a/ten-year-words', '/prepare/partner-a/marriage-sentence'],
    ['/prepare/partner-a/promise', '/prepare/partner-a/ten-year-words'],
    ['/prepare/partner-a/marriage-open-question', '/prepare/partner-a/promise'],
    ['/prepare/partner-a/sharing', '/prepare/partner-a/marriage-open-question'],
    ['/waiting', '/prepare/partner-a/sharing'], ['/bridge', '/waiting'],
  ];
  for (const [url, href] of privateMap) {
    await page.goto(url);
    await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', href);
  }
  const sharedMap = [
    ['/together', '/bridge'], ['/together/ground', '/together'],
    ['/together/conversation-one', '/together/ground'], ['/together/mirror', '/together/conversation-one'],
    ['/together/conversation-two', '/together/mirror'], ['/together/scenarios', '/together/conversation-two'],
    ['/together/tradeoff', '/together/scenarios'], ['/together/pause-check', '/together/tradeoff'],
    ['/together/capture', '/together/pause-check'], ['/together/close', '/together/capture'],
    ['/integration/partner-a', '/together/close'], ['/integration/partner-b', '/integration/partner-a'],
    ['/shared-record', '/integration/partner-b'], ['/feedback', '/shared-record'], ['/complete', '/feedback'],
  ];
  for (const [url, href] of sharedMap) {
    await page.goto(url);
    await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', href);
  }
  await page.goto('/choose-mode');
  await selected(page, /Christ-Centered Journey/).click();
  await page.goto('/together/pause-check');
  await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/together/discern');
});

test('G: incomplete v2 localStorage hydrates safely across choices, Mirror, reveal, and Back', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('weddingos-prototype-v2', JSON.stringify({
    schemaVersion: 2,
    partners: { 'partner-a': { responses: {} } },
    shared: { mode: 'core', mirror: { generatedText: 'Partial saved mirror' }, reveal: { entries: { 'partner-a': { ready: false } } } },
  })));
  await page.goto('/choose-mode');
  await selected(page, /Christ-Centered Journey/).click();
  await expect(selected(page, /Christ-Centered Journey/)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: 'Back' })).toBeVisible();
  await page.goto('/together/mirror');
  await selected(page, /Partly/).click();
  await expect(page.getByLabel('What needs adjusting?')).toBeVisible();
  await page.goto('/together/conversation-two');
  await selected(page, 'Faithfulness').first().click();
  await expect(selected(page, 'Faithfulness').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).not.toContainText('JourneyProvider missing');
});

test('H: simultaneous reveal highlights, hides, persists, reveals, and never scores', async ({ page }) => {
  await page.goto('/together/conversation-two');
  await selected(page, 'Faithfulness').first().click();
  await expect(selected(page, 'Faithfulness').first()).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Hide my prediction and mark ready' }).click();
  await expect(page.getByText('Prediction hidden · Ready')).toBeVisible();
  await selected(page, 'Companionship').click();
  await page.getByRole('button', { name: 'Hide my prediction and mark ready' }).click();
  await page.reload();
  await expect(page.getByText('Prediction hidden · Ready')).toHaveCount(2);
  await page.getByRole('button', { name: 'Reveal both perspectives' }).click();
  await expect(page.getByText("Partner A’s prediction")).toBeVisible();
  await expect(page.getByText(/score|winner|percentage|correct\/incorrect/i)).toHaveCount(0);
});

test('I: mobile actions remain visible, separate from Pause, and selections remain obvious', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/prepare/partner-a/marriage-sentence');
  const back = page.getByRole('link', { name: 'Back' });
  const next = page.getByRole('link', { name: 'Continue' });
  const pause = page.getByRole('button', { name: 'Pause' });
  await expect(back).toBeVisible();
  await expect(next).toBeVisible();
  await expect(pause).toBeVisible();
  await next.scrollIntoViewIfNeeded();
  const nextBox = await next.boundingBox();
  const pauseBox = await pause.boundingBox();
  const overlap = nextBox && pauseBox && !(nextBox.x + nextBox.width <= pauseBox.x || pauseBox.x + pauseBox.width <= nextBox.x || nextBox.y + nextBox.height <= pauseBox.y || pauseBox.y + pauseBox.height <= nextBox.y);
  expect(overlap).toBeFalsy();
  await selected(page, /Write privately/).click();
  await expect(selected(page, /Write privately/).getByText('Selected')).toBeVisible();
});

test('J: active encounter contains no removed timeline comparison language', async ({ page }) => {
  const forbidden = /Should We Marry Now and Celebrate Later|legally married within the next few months|destination celebration|wait until the destination wedding|marriage may be ready while celebration needs preparation/i;
  for (const url of ['/', '/bridge', '/together', '/together/scenarios', '/together/tradeoff', '/together/capture', '/shared-record']) {
    await page.goto(url);
    await expect(page.locator('body')).not.toContainText(forbidden);
  }
});

test('choice-group audit: remaining selectable controls update, identify, and persist', async ({ page }) => {
  await page.goto('/prepare/partner-a/ten-year-words');
  await selected(page, 'Peaceful').click();
  await selected(page, 'Playful').click();
  await expect(selected(page, /Peaceful/)).toHaveAttribute('aria-pressed', 'true');
  await expect(selected(page, /Peaceful/).getByText('Selected')).toBeVisible();
  await page.reload();
  await expect(selected(page, /Playful/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/prepare/partner-a/promise');
  await selected(page, /Faithfulness/).click();
  await selected(page, /Mutual service/).click();
  await expect(selected(page, /Faithfulness/)).toHaveAttribute('aria-pressed', 'false');
  await expect(selected(page, /Mutual service/)).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(selected(page, /Mutual service/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/prepare/partner-a/marriage-open-question');
  await selected(page, /There is something I want to explore privately/).click();
  await selected(page, /Personal growth/).click();
  await selected(page, /More information/).click();
  await expect(selected(page, /Personal growth/)).toHaveAttribute('aria-pressed', 'false');
  await expect(selected(page, /More information/)).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(selected(page, /There is something I want to explore privately/)).toHaveAttribute('aria-pressed', 'true');
  await expect(selected(page, /More information/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/prepare/partner-a/sharing');
  await selected(page, /Share my exact response/).click();
  await selected(page, /I will explain it myself/).click();
  await expect(selected(page, /Share my exact response/)).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(selected(page, /I will explain it myself/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/together/conversation-one');
  await selected(page, /I felt understood/).first().click();
  await selected(page, /Mostly understood/).first().click();
  await expect(selected(page, /I felt understood/).first()).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(selected(page, /Mostly understood/).first()).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/together/capture');
  await selected(page, /Gather more information/).click();
  await selected(page, /Pause intentionally/).click();
  await expect(selected(page, /Gather more information/)).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(selected(page, /Pause intentionally/)).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/integration/partner-a');
  await selected(page, 'Yes').click();
  await selected(page, 'Mostly').click();
  await expect(selected(page, 'Yes')).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(selected(page, 'Mostly')).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/feedback');
  const firstScale = selected(page, '1').first();
  await firstScale.click();
  await selected(page, '2').first().click();
  await expect(firstScale).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(selected(page, '2').first()).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Prototype menu' }).click();
  await page.getByRole('button', { name: 'Partner B' }).click();
  await page.getByRole('button', { name: 'Prototype menu' }).click();
  await expect(page.getByRole('button', { name: /Partner B/ })).toHaveAttribute('aria-pressed', 'true');
});
