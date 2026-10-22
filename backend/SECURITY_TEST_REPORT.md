# Backend test and security review

Date: 2026-10-22

## Scope and method

- Reviewed the Express API, auth and profile routes, validation, JWT handling, upload handling, and Supabase service calls.
- Added unit tests and HTTP integration tests with Supertest. Tests use a signed test JWT and do not call the configured Supabase project.
- Added GitHub Actions automation for the backend test suite.
- No external host, production account, or production data was tested.

## Findings and fixes

### High — Public registration could create an administrator

`POST /api/auth/register` accepted `role: "admin"`; the value was persisted and admin endpoints trust the JWT role. An unauthenticated caller could therefore self-promote.

**Fix:** removed role from the public registration schema and force the stored role to `user` in the service. Added a unit regression test.

### High — Authenticated users could access other users' profiles

`GET /api/users/:id` and `PUT /api/users/:id` required authentication but did not check that the requested ID belonged to the caller. This allowed cross-account profile reads and edits (BOLA/IDOR).

**Fix:** added self-or-admin authorization to both routes. Added integration coverage asserting a different user receives HTTP 403.

### Medium — Access tokens could be used as refresh tokens

Access and refresh JWTs used the same signing secret and had no token-purpose claim. The refresh endpoint accepted either kind, allowing an access token to be exchanged for a longer-lived session.

**Fix:** tokens now carry a `token_use` claim and both middleware and refresh flow validate the expected purpose. Added an integration regression test.

**Compatibility note:** tokens issued before this change have no `token_use` claim and will need to be replaced by signing in again after deployment.

## Remaining review notes

- Uploads now require file signatures matching the declared MIME type and use an extension derived from that MIME type. This verifies common file headers; it does not scan document contents for malware.
- Competition search values are quoted and escape backslashes and quotes before being placed in the PostgREST `.or(...)` filter.
- These protections were verified with unit tests and were not tested against a live Supabase instance.

## Test coverage added

- Unit: registration privilege stripping, self-versus-other profile authorization, upload signature validation, and PostgREST search filter escaping.
- Integration: health/security headers, unauthenticated profile access, cross-user profile read/update denial, invalid query validation, and rejection of access tokens on the refresh endpoint.
- Automation: `.github/workflows/backend-tests.yml` runs the full Jest suite on backend changes in pushes and pull requests.

## Verification

`npm run test:unit`, `npm run test:integration`, and `npm run test:automation` passed locally (23 tests total). The tests use the project's installed dependencies; CI uses placeholder environment values and makes no database calls for these tests.

`npm run lint` passed with the new ESLint 9 flat config. The config exposed and helped fix four pre-existing unused-variable issues.
