import axios, { type AxiosInstance } from 'axios'

export abstract class BaseConnector {
  protected client: AxiosInstance

  constructor(
    baseURL: string,
    headers: Record<string, string>,
  ) {
    this.client = axios.create({ baseURL, headers })
  }
}
