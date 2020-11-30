import 'reflect-metadata';
import {Container} from 'inversify';
import GlucoCheckCore from './main';

// Create an Inversify Container and
// expose a fully initialized instance of the core library
const container = new Container({autoBindInjectable: true});
export default container.get(GlucoCheckCore);
