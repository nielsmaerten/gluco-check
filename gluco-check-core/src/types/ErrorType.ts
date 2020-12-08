export enum ErrorType {
  // Timeouts, network errors, HTTP errors, ...
  Nightscout_Unavailable = 'Nightscout Unavailable',

  // HTTP 401 Unauthorized error from Nightscout
  Nightscout_Unauthorized = 'Nightscout Unauthorized',

  // Nightscout responded, but response did not contain the requested info
  QueryResponse_MetricNotFound = 'DmMetric Not Found',

  // No user document in Firestore
  Firebase_UserNotFound = 'User not found',
}
