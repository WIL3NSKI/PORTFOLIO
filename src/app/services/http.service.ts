import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Environment } from '@env/env'

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(`${Environment.apiUrl}`)
  }

}
