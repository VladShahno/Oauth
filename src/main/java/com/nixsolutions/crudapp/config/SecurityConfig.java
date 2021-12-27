package com.nixsolutions.crudapp.config;

import com.auth0.jwk.JwkProvider;
import com.nixsolutions.crudapp.jwt.AccessTokenAuthenticationFailureHandler;
import com.nixsolutions.crudapp.jwt.AccessTokenFilter;
import com.nixsolutions.crudapp.jwt.AuthorizationAccessDeniedHandler;
import com.nixsolutions.crudapp.jwt.JwtTokenValidator;
import com.nixsolutions.crudapp.jwt.KeycloakJwkProvider;
import lombok.RequiredArgsConstructor;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Order(1)
@EnableWebSecurity
@RequiredArgsConstructor
@ComponentScan("com.nixsolutions.crudapp")
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final String jwkProviderUrl = "http://localhost:8080/auth/realms/oauth/protocol/openid-connect/certs";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().configurationSource(request -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.applyPermitDefaultValues();
                    corsConfiguration.setAllowedMethods(
                            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    return corsConfiguration;
                }).and().headers().httpStrictTransportSecurity().disable().and().csrf()
                .disable().authorizeRequests().antMatchers("users/**")
                .hasRole("ADMIN").anyRequest().authenticated();

        http.addFilterBefore(
                new AccessTokenFilter(jwtTokenValidator(keycloakJwkProvider()),
                        authenticationManagerBean(),
                        authenticationFailureHandler()),
                BasicAuthenticationFilter.class);
        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @ConditionalOnMissingBean
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new KeycloakAuthenticationProvider();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new AccessTokenAuthenticationFailureHandler();
    }

    @Bean
    public JwtTokenValidator jwtTokenValidator(JwkProvider jwkProvider) {
        return new JwtTokenValidator(jwkProvider);
    }

    @Bean
    public JwkProvider keycloakJwkProvider() {
        return new KeycloakJwkProvider(jwkProviderUrl);
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new AuthorizationAccessDeniedHandler();
    }
}
