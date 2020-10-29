import {DiabetesPointer} from '../../../src/types/DiabetesPointer';
import {GlucoseUnit} from '../../../src/types/GlucoseUnit';
import NightscoutProps from '../../../src/types/NightscoutProps';
import User from '../../../src/types/User';

const fakeUser = new User();
fakeUser.defaultPointers = [DiabetesPointer.Everything];
fakeUser.exists = true;
fakeUser.glucoseUnit = GlucoseUnit.mgDl;
fakeUser.userId = 'fake@user';
fakeUser.nightscout = new NightscoutProps('https://cgm.example.com');

export default fakeUser;
