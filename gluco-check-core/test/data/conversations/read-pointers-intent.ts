module.exports = {
  requestJson: {
    handler: {
      name: 'read_single_parameter',
    },
    intent: {
      name: 'read_pointers',
      params: {
        diabetesPointer: {
          original: '',
          resolved: ['blood sugar', 'insulin on board'],
        },
      },
      query: "ask gluco nightly what's my bg and iob",
    },
    scene: {
      name: 'actions.scene.START_CONVERSATION',
      slotFillingStatus: 'UNSPECIFIED',
      slots: {},
      next: {
        name: 'actions.scene.END_CONVERSATION',
      },
    },
    session: {
      id: 'abcdefghijklmnopqrstuvwxyz',
      params: {},
      typeOverrides: [],
      languageCode: '',
    },
    user: {
      locale: 'en-US',
      params: {},
      accountLinkingStatus: 'ACCOUNT_LINKING_STATUS_UNSPECIFIED',
      verificationStatus: 'VERIFIED',
      packageEntitlements: [],
      lastSeenTime: '2020-08-17T13:38:21Z',
    },
    home: {
      params: {},
    },
    device: {
      capabilities: ['SPEECH', 'RICH_RESPONSE', 'LONG_FORM_AUDIO'],
    },
  },
};
