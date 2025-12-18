Configure the Auth0 plugin in your Vue app's main entry point to provide authentication context throughout your application.

Required configuration options:
- `domain`: your Auth0 tenant's domain
- `clientId`: Your Auth0 Application's Client ID
- `authorizationParams.redirect_uri`: the URL to redirect back from Auth0 after authenticating.
