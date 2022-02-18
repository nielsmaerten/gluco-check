import {ActionsOnGoogleTestManager} from '@assistant/conversation-testing';

const PROJECT_ID = 'gluco-check-prod';
const TRIGGER_PHRASE = 'Talk to Gluco Check';

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  'c:/users/niels/desktop/gluco-check-prod-58ae2de02061.json';

// eslint-disable-next-line no-restricted-properties
describe.only('@assistant/conversation-testing', () => {
  let testManager: ActionsOnGoogleTestManager;
  beforeAll(async () => {
    testManager = new ActionsOnGoogleTestManager({projectId: PROJECT_ID});
    await testManager.writePreviewFromDraft();
    testManager.setSuiteLocale('nl-NL');
    testManager.setSuiteSurface('actions.capability.SCREEN_OUTPUT');
  });

  it('does stuff', () => {
    console.log('hi');
  });

  afterAll(() => {
    testManager.cleanUpAfterTest();
  });
});
