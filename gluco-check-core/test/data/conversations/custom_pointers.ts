module.exports = {
  requestJson: {
    handler: {
      name: 'custom_pointers',
    },
    intent: {
      name: 'READ_POINTERS',
      params: {
        diabetesPointer: {
          original: '',
          resolved: ['insulin on board', 'blood sugar', 'sensor age'],
        },
      },
      query: 'ask gluco nightly my iob, glucose and sensor',
    },
    scene: {
      name: 'CustomPointers',
      slotFillingStatus: 'FINAL',
      slots: {
        diabetesPointer: {
          mode: 'REQUIRED',
          status: 'SLOT_UNSPECIFIED',
          updated: true,
          value: ['insulin on board', 'blood sugar', 'sensor age'],
        },
      },
      next: {
        name: 'actions.scene.END_CONVERSATION',
      },
    },
    session: {
      id:
        'xyz',
      params: {
        diabetesPointer: ['insulin on board', 'blood sugar', 'sensor age'],
      },
      typeOverrides: [],
      languageCode: '',
    },
    user: {
      locale: 'en-US',
      params: {},
      accountLinkingStatus: 'LINKED',
      verificationStatus: 'VERIFIED',
      packageEntitlements: [],
      lastSeenTime: '2020-08-24T13:26:22Z',
    },
    home: {
      params: {},
    },
    device: {
      capabilities: ['SPEECH', 'RICH_RESPONSE', 'LONG_FORM_AUDIO'],
    },
  },
};
