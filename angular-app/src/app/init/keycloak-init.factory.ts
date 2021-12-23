import {KeycloakService} from "keycloak-angular";

export function initializeKeycloak(
  keycloak: KeycloakService
) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080' + '/auth',
        realm: 'oauth',
        clientId: 'front-angular',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: true
      }
    });
}
