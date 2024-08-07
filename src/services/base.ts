import fetch from 'node-fetch';
import { Client } from '../client.js';

/**
 * This is the Base Service used by all other services (except Auth)
 * @param {Client} Client Sitecore Personalize Client
 * @returns BaseService
 */
export class BaseService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  private Fetch = async (method: string, path: string, body: object | null | undefined) => {
    if (!this.client.options.region) {
      throw 'You did not provide a valid region when you initialized the client';
    }

    let data = body !== null && body !== undefined ? JSON.stringify(body) : null;

    return await this.client.requestWithAuthCheck(() =>
      fetch(`https://${this.client.options.region}/${path}`, {
        method,
        body: data,
        headers: {
          Authorization: `Bearer ${this.client.options.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    );
  };

  protected Get = async (path: string) => {
    return await this.Fetch('get', path, null);
  };

  protected Post = async (path: string, body: object | null | undefined) => {
    return await this.Fetch('post', path, body);
  };

  protected Put = async (path: string, body: object | null | undefined) => {
    return await this.Fetch('put', path, body);
  };

  protected Delete = async (path: string, body: object | null | undefined) => {
    return await this.Fetch('delete', path, body);
  };
}
