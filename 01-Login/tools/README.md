# Tools

This directory contains utility scripts for configuring and managing the Auth0 Vue sample application.

## auth0-config.cjs
Configures Auth0 environment variables in your `.env.local` file based on command line arguments.

**Usage:**
```bash
npm run auth0-config -- --domain <domain> --clientId <clientId> [--port <port>]
```

**Required Arguments:**
- `--domain` - Your Auth0 domain (e.g., `your-tenant.auth0.com`)
- `--clientId` - Your Auth0 application client ID

**Optional Arguments:**
- `--port` - Port number for the development server (defaults to 5173)

**Features:**
- Creates or updates `.env.local` file
- Comments out existing values before adding new ones
- Preserves unmanaged environment variables
- Shows status of all configuration changes

## check-port.cjs
Verifies that the configured port is available before starting the development server.

**Features:**
- Reads port from environment configuration
- Uses `detect-port` to check availability
- Provides helpful error messages if port is in use

## Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx jest __tests__/auth0-config.test.cjs
```
