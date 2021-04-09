import axios, {AxiosRequestConfig} from 'axios';
import {gc_url} from '../../../constants';
import {URL} from 'url';
import {sha1} from '../../../utils';

const NEW_TOKEN = {
  permissions: '*:*:read',
  name: 'gluco-check',
  notes: `Auto-generated by Gluco Check (${gc_url})`,
};

const ENDPOINT = {
  roles: '/api/v2/authorization/roles',
  subjects: '/api/v2/authorization/subjects',
};

type Role = {
  permissions: string[];
  name: string;
  notes: string;
};

type Subject = {
  _id?: string;
  roles: string[];
  name: string;
  notes: string;
  accessToken?: string;
};

export default class TokenCreator {
  private secretHash: string;
  private endpointRoles: string;
  private endpointSubjects: string;

  constructor(apiSecret: string, url: string) {
    this.secretHash = sha1(apiSecret);
    this.endpointRoles = new URL(ENDPOINT.roles, url) + '';
    this.endpointSubjects = new URL(ENDPOINT.subjects, url) + '';
  }

  /**
   * Attempts to create role/subject set for GlucoCheck using
   * the provided apiSecret
   */
  public async create() {
    try {
      // Try creating a role (or reuse existing)
      const success = await this.createNightscoutRole();
      if (!success) return undefined;

      // Try adding a subject to the role (or reuse existing)
      const token = await this.createNightscoutSubject();
      return token;

      // In case of error, return undefined
    } catch {
      return undefined;
    }
  }

  /**
   * Verifies GlucoCheck exists in Nightscout.
   * Will attempt to create if it doesn't exist.
   */
  private async createNightscoutRole() {
    // Specs for the (new) role
    const role: Role = {
      notes: NEW_TOKEN.notes,
      name: NEW_TOKEN.name,
      permissions: [NEW_TOKEN.permissions],
    };

    // Build Axios request to /authorization/roles
    const request: AxiosRequestConfig = {
      data: role,
      headers: {'api-secret': this.secretHash},
      url: this.endpointRoles,
    };

    // Find existing roles
    const currentRoles = await axios.request<Role[]>(request);

    // Does a role with our specs exist?
    const exists = currentRoles.data.find(_role => {
      return (
        _role.name === role.name && _role.permissions.includes(NEW_TOKEN.permissions)
      );
    });
    if (exists) return true;

    // If not, try adding the role
    const res = await axios.request({...request, method: 'POST'});
    return res.status === 200;
  }

  /**
   * Verifies GlucoCheck subject exists in Nightscout.
   * Will attempt to create if it doesn't exist
   */
  private async createNightscoutSubject() {
    // Specs for our Subject
    const subject: Subject = {
      notes: NEW_TOKEN.notes,
      name: NEW_TOKEN.name,
      roles: [NEW_TOKEN.name],
    };

    // Basic Axios request to /authorization/subjects
    const reqConfig: AxiosRequestConfig = {
      data: subject,
      headers: {'api-secret': this.secretHash},
      url: this.endpointSubjects,
    };

    // Find existing subjects
    const currentSubjects = await axios.request<Subject[]>(reqConfig);

    // Does a subject with our specs exist?
    const exists = currentSubjects.data.find(_subject => {
      return _subject.name === subject.name && _subject.roles.includes(NEW_TOKEN.name);
    });
    if (exists) return exists.accessToken!;

    // Create our new subject
    const created = await axios.request<Subject[]>({...reqConfig, method: 'POST'});
    const subjectId = created.data[0]?._id;

    // Get the accessToken of the newly created subject
    const subjects = await axios.request<Subject[]>(reqConfig);
    const token = subjects.data.find(s => s._id === subjectId)?.accessToken;
    return token;
  }
}