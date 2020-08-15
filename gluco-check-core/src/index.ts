import 'reflect-metadata';
import {Container} from 'inversify';
import GlucoCheckCore from './main';

// Initialize the IOC Container with automatic binding
const container = new Container({autoBindInjectable: true});

// Default export of this library package is an initialized instance
// of the GlucoCheckCore Class
export default container.get(GlucoCheckCore);
