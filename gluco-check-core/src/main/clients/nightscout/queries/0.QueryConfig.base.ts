import {DiabetesPointer} from '../../../../types/DiabetesPointer';

export default class QueryConfig {
  // Callback function that should extract required info from the HTTP response
  public callback!: Function;

  // Querystring parameters that should be added to the HTTP request
  public params: any; // eslint-disable-line

  // API path the HTTP request should be sent to
  public path!: string;

  // DiabetesPointers that will be fulfilled by this query
  public pointers!: DiabetesPointer[];

  // Unique key for caching. Ensures a query is only executed once
  public key!: number;
}
