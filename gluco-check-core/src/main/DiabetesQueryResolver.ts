import DiabetesQuery from '../types/DiabetesQuery';
import AssistantResponse from '../types/AssistantResponse';
import {injectable} from 'inversify';

@injectable()
export default class DiabetesQueryResolver {
  resolve(query: DiabetesQuery): AssistantResponse {
    // TODO (when NsClient and ResponseFormatter are stable??)
    return {
      SSML: `I can't tell you your ${query.pointers} yet.`,
      locale: query.locale,
      timestamp: Date.now(),
    };
  }
}
