import {Component, OnInit} from '@angular/core';
import {UserForCreate} from "../../model/user-models/user-for-create";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  role = localStorage.getItem('role');

  userName = this.keycloak.getUsername().toString();

  user: UserForCreate = new UserForCreate();

  constructor(private keycloak: KeycloakService) {
  }

  ngOnInit(): void {
  }
}
