import {Component} from '@angular/core';
import {UserService} from "./service/user.service";
import {UserForCreate} from "./model/user-models/user-for-create";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';

  role = this.keycloak.getUserRoles().filter(userRole => 'ADMIN' === userRole ||
    'USER' === userRole).toString();

  userName = this.keycloak.getUsername().toString();

  user: UserForCreate = new UserForCreate();

  constructor(public userService: UserService, private keycloak: KeycloakService) {
  }

  ngOnInit(): void {
  }

  canBeShowedForAdmin() {
    return this.role == "ADMIN";
  }

  canBeShowedForUser() {
    return this.role == "USER";
  }
}
