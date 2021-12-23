import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs';
import {User} from '../model/user-models/user';
import {UserForCreate} from "../model/user-models/user-for-create";
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  problem!: Map<string, string>

  private baseURL = "http://localhost:8081/api";
  jwtToken = window.localStorage.getItem('jwtToken');

  constructor(private httpClient: HttpClient, private keycloakService: KeycloakService) {
  }

  getUsersList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/users/all`);
  }

  createUser(user: UserForCreate): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/users`, user);
  }

  getUserByLogin(login: string): Observable<UserForCreate> {
    return this.httpClient.get<UserForCreate>(`${this.baseURL}/users/${login}`);
  }

  updateUser(login: string, user: UserForCreate): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/users/update${login}`, user);
  }

  deleteUser(login: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/users/${login}`);
  }

  loggedIn() {
    return !!localStorage.getItem('jwtToken')
  }

  async keycloakLogout() {
    await this.keycloakService.logout();
  }
}
