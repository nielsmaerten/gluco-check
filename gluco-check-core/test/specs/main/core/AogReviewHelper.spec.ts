/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import AogReviewHelper from '../../../../src/main/core/AogReviewHelper';
import User from '../../../../src/types/User';
import {stubFirebaseClient, docSetStub} from '../../../stubs/FirestoreClient';

describe('AoG Review Helper', () => {
  const aogReviewHelper = new AogReviewHelper(stubFirebaseClient as any);
  const createFakeUser = (email: string) => {
    const user = new User();
    user.userId = email;
    return user;
  };
  const normalUser = createFakeUser('user@example.com');
  const gmailUser = createFakeUser('user@gmail.com');
  const aogOtherDomain = createFakeUser('aog.platform.agent007@example.com');
  const realAogReviewer = createFakeUser('aog.platform.agent007@gmail.com');

  it('detects AoG Reviewer accounts', () => {
    expect(aogReviewHelper.isReviewer(normalUser)).toBeFalsy();
    expect(aogReviewHelper.isReviewer(gmailUser)).toBeFalsy();
    expect(aogReviewHelper.isReviewer(aogOtherDomain)).toBeFalsy();
    expect(aogReviewHelper.isReviewer(realAogReviewer)).toBeTruthy();
  });

  it('populates a test user with test data', async () => {
    await aogReviewHelper.addSampleData(realAogReviewer);
    const setPayload = docSetStub.mock.calls[0][0];
    expect(setPayload.exists).toBeTruthy();
    expect(setPayload.userId).toBeDefined();
    expect(setPayload.defaultMetrics.length).toBeGreaterThan(0);
    expect(setPayload.nightscout.url).toBeDefined();
    expect(setPayload.nightscout.token).toBeDefined();
  });
});
