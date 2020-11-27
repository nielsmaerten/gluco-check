import 'reflect-metadata';
import {Container} from 'inversify';
import GlucoCheckCore from './main';

// Create an Inversify Container and
// expose a fully initialized instance of the core library
const container = new Container({autoBindInjectable: true});
export default container.get(GlucoCheckCore);

/**
 * Code Cleanup / Refactoring
 * // TODO: Refactoring tasks
 * - Sort imports
 * - Split QueryResolver into QueryFulfiller and ResponseFormatter
 * - Turn DmMetric from an enum into a class???
 *   - Each class could have a humanizer function, extract function, ... ???
 *
 * - Rename:
 *   - DiabetesSnapshot --> DmSnapshot
 *   - DiabetesQuery --> DmQuery
 */
