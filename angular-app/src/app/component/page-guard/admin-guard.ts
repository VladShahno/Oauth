import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {KeycloakService} from "keycloak-angular";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private keycloak: KeycloakService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = this.keycloak.getUserRoles().filter(userRole => 'ADMIN' === userRole);
    if (role) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
