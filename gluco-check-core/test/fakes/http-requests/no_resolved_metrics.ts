module.exports = {
  requestJson: {
    handler: {
      name: 'custom_metrics',
    },
    intent: {
      name: 'READ_METRICS',
      params: {},
      // This query (with a typo) won't resolve to any metrics:
      query: 'ask gluco tester check my bge',
    },
    scene: {
      name: 'CustomMetrics',
      slotFillingStatus: 'COLLECTING',
      slots: {
        DmMetric: {
          mode: 'REQUIRED',
          status: 'SLOT_UNSPECIFIED',
          updated: false,
        },
      },
      next: {
        name: 'actions.scene.END_CONVERSATION',
      },
    },
    session: {
      id: 'abcxyz',
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
      gaiamint: '',
      permissions: [],
      lastSeenTime: '2021-01-11T21:08:55Z',
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
