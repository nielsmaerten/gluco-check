module.exports = {
  requestJson: {
    handler: {
      name: 'default_pointers',
    },
    intent: {
      name: 'actions.intent.MAIN',
      params: {},
      query: 'Talk to Gluco Nightly',
    },
    scene: {
      name: 'DefaultPointers',
      slotFillingStatus: 'UNSPECIFIED',
      slots: {},
      next: {
        name: 'actions.scene.END_CONVERSATION',
      },
    },
    session: {
      id: '',
      params: {},
      typeOverrides: [],
      languageCode: '',
    },
    user: {
      locale: 'en-US',
      params: {},
      accountLinkingStatus: 'LINKED',
      verificationStatus: 'VERIFIED',
      packageEntitlements: [],
      lastSeenTime: '2020-08-24T01:11:14Z',
    },
    headers: {
      'gluco-check-version': '1',
    },
    home: {
      params: {},
    },
    device: {
      capabilities: ['SPEECH', 'RICH_RESPONSE', 'LONG_FORM_AUDIO'],
    },
  },
};
