import chai from 'chai';
import type { CompassBrowser } from '../helpers/compass-browser';
import { beforeTests, afterTests, afterTest } from '../helpers/compass';
import type { Compass } from '../helpers/compass';
import * as Selectors from '../helpers/selectors';
import { createNumbersCollection } from '../helpers/insert-data';

const { expect } = chai;

describe('Collection explain plan tab', function () {
  const dbName = 'test';
  const collectionName = 'numbers';
  const tabName = 'Explain Plan';
  let compass: Compass;
  let browser: CompassBrowser;

  before(async function () {
    compass = await beforeTests();
    browser = compass.browser;
  });

  beforeEach(async function () {
    await createNumbersCollection();
    await browser.connectWithConnectionString(
      `mongodb://localhost:27091/${dbName}`
    );
    await browser.navigateToCollectionTab(dbName, collectionName, tabName);
  });

  after(async function () {
    await afterTests(compass, this.currentTest);
  });

  afterEach(async function () {
    await afterTest(compass, this.currentTest);
  });

  it('shows an explain plan', async function () {
    await browser.clickVisible(Selectors.ExecuteExplainButton);

    const element = await browser.$(Selectors.ExplainSummary);
    await element.waitForDisplayed();
    const stages = await browser.$$(Selectors.ExplainStage);
    expect(stages).to.have.lengthOf(1);
  });

  it('shows a loading state while explain is running', async function () {
    await browser.runFindOperation(
      'Explain Plan',
      '{ $where: "function() { sleep(10000); return true; }" }',
      { limit: '1', waitForResult: false }
    );

    const spinner = await browser.$(Selectors.ExplainCancellableSpinner);

    await spinner.waitForDisplayed();
  });

  it('cancels an ongoing explain and falls back to welcome page', async function () {
    await browser.runFindOperation(
      'Explain Plan',
      '{ $where: "function() { sleep(10000); return true; }" }',
      { limit: '1', waitForResult: false }
    );

    await browser.clickVisible(Selectors.ExplainCancelButton);

    const welcomePageExecuteExplainBtn = await browser.$$(
      Selectors.ExecuteExplainButton
    );
    expect(welcomePageExecuteExplainBtn).to.have.length(1);
  });

  it('cancels an ongoing explain and falls back to old explain output', async function () {
    await browser.runFindOperation('Explain Plan', '{}', {
      limit: '10',
      waitForResult: false,
    });

    // Ensure the results are shown
    const summaryElement = await browser.$(Selectors.ExplainSummary);
    await summaryElement.waitForDisplayed();

    const totalDocsExaminedSummaryEl = await browser.$(
      Selectors.explainPlanSummaryStat('totalDocsExamined')
    );

    const firstTotalDocs = (await totalDocsExaminedSummaryEl.getText()).trim();

    expect(firstTotalDocs).to.eq('Documents Examined: 10');

    // Run explain again with different limit and cancel
    await browser.runFindOperation(
      'Explain Plan',
      '{ $where: "function() { sleep(10000); return true; }" }',
      { limit: '1', waitForResult: false }
    );

    await browser.clickVisible(Selectors.ExplainCancelButton);

    await summaryElement.waitForDisplayed();

    expect(firstTotalDocs).to.eq(
      (await totalDocsExaminedSummaryEl.getText()).trim()
    );
  });
});
