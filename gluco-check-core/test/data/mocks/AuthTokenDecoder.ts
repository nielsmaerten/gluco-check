export default class {
  decodeGoogleUserToken() {
    return {
      locale: 'en-US',
      params: {
        tokenPayload: {
          email: 'test@example.com',
        },
      },
    };
  }
}
