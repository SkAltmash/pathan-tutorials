# Project Development Rules — Senior Architect Standard

> Purpose: This document defines the mandatory engineering rules for autonomous coding agents and developers working on production-grade applications.
>
> The goal is not only to make code work, but to ensure every change is secure, correct, reliable, maintainable, performant, accessible, SEO-aware where applicable, testable, and production-ready.

---

# 1. Engineering Priorities

When rules conflict, use this priority order:

1. Security & Data Integrity
2. Correctness
3. Reliability
4. Maintainability
5. Performance
6. Accessibility
7. SEO / Discoverability
8. Reusability
9. Developer Experience

Never sacrifice security, data integrity, or correctness for speed of implementation.

Do not optimize code in ways that make it materially harder to understand unless there is a proven performance requirement.

---

# 2. Engineering Judgment

Do not blindly follow a rule when doing so would make the implementation less secure, less correct, less reliable, or materially worse for the project.

Before modifying architecture:

1. Understand why the existing architecture was designed that way.
2. Inspect existing patterns.
3. Check whether the problem is already solved elsewhere.
4. Preserve existing contracts unless a change is explicitly required.
5. Prefer the smallest correct change.

Never invent:

- Requirements
- API contracts
- Database fields
- Environment variables
- Permission rules
- Business logic
- Third-party response formats
- Existing utilities/components/services

When information can be discovered from the codebase, inspect the codebase instead of guessing.

---

# 3. Core Principles

- Write clean, readable, maintainable, scalable, and production-ready code.
- Follow DRY, SOLID, separation of concerns, and principle of least privilege.
- Prefer simple and reliable solutions over unnecessary complexity.
- Avoid duplicate business logic, validation logic, API logic, and configuration.
- Keep modules focused on one clear responsibility.
- Preserve existing functionality unless the task explicitly changes it.
- Never hide problems just to make builds or tests pass.
- Leave the codebase better than before without performing unrelated refactors.

---

# 4. Mandatory Task Workflow

Before implementing any task:

1. Understand the requested behavior.
2. Inspect relevant existing files.
3. Search for reusable components, hooks, utilities, services, repositories, schemas, constants, types, and helpers.
4. Identify affected routes, APIs, database entities, state, and integrations.
5. Identify authentication and authorization implications.
6. Identify client/server boundaries.
7. Identify validation requirements.
8. Identify caching implications.
9. Identify SEO implications for public pages.
10. Identify accessibility and responsive implications.
11. Identify performance implications.
12. Identify migration/backward-compatibility implications.
13. Reuse the existing architecture where it is sound.
14. Implement the smallest correct change.
15. Test affected workflows.
16. Run relevant lint/type/build/test checks.
17. Review the final diff.
18. Only then report completion.

Do not claim completion if known build, type, lint, security, test, or functional issues remain.

---

# 5. Existing Codebase First

Before writing new code:

1. Inspect the project structure.
2. Understand the architecture and coding patterns.
3. Search for existing implementations.
4. Reuse or extend existing code where appropriate.
5. Follow existing naming and organizational conventions when reasonable.
6. Do not introduce a new architectural pattern when an existing pattern already solves the problem.
7. Do not restructure the entire project unless explicitly required.
8. Do not rewrite working code without a clear reason.
9. Do not modify unrelated files.

If the current architecture has a clear defect, improve it only as much as required for the requested change unless broader refactoring is explicitly requested.

---

# 6. Reuse Without Over-Abstraction

Prefer reuse when behavior is genuinely shared.

Extract code when:

- Business logic is repeated.
- Validation rules are shared.
- UI patterns are genuinely reusable.
- Changes should propagate consistently.
- The abstraction makes the code easier to understand.

Do not abstract solely because two pieces of code look similar.

Prefer small duplication over a premature abstraction that increases coupling or complexity.

Avoid creating generic "universal" components, services, or configuration systems unless the requirements justify them.

---

# 7. Project Structure

A common structure may be:

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── repositories/
├── lib/
├── utils/
├── types/
├── constants/
├── config/
├── schemas/
├── data/
└── styles/
```

Responsibilities:

- `app/` → framework routes, layouts, pages, route handlers, server actions
- `components/` → truly shared reusable UI
- `features/` → feature/domain-specific code
- `hooks/` → genuinely reusable cross-feature hooks
- `services/` → application/service-layer operations and third-party integrations
- `repositories/` → database access where a repository pattern is appropriate
- `lib/` → SDK/library initialization and framework helpers
- `utils/` → generic stateless helpers
- `types/` → truly shared types
- `constants/` → cross-feature constants
- `config/` → application/environment configuration
- `schemas/` → shared validation schemas
- `data/` → static/mock data when required
- `styles/` → shared/global styles

Prefer feature colocation for feature-specific code.

Example:

```text
features/
└── courses/
    ├── components/
    ├── hooks/
    ├── services/
    ├── schemas/
    ├── types.ts
    ├── constants.ts
    └── index.ts
```

Do not move feature-specific code into global folders merely because it is technically a hook, service, type, or utility.

Do not put unrelated functionality into a single large folder or file.

---

# 8. TypeScript

- Use TypeScript throughout the project.
- Avoid `any`.
- Prefer `unknown` when the value is genuinely unknown.
- Narrow unknown values before use.
- Prefer explicit types for public APIs, props, service contracts, important functions, and external data.
- Reuse existing types instead of creating duplicate interfaces.
- Use generics only when they improve type safety and readability.
- Avoid overly complex type-level programming without a strong reason.
- Use discriminated unions where they improve correctness.
- Preserve null/undefined semantics intentionally.
- Do not use type assertions to bypass actual type problems.
- Never use `@ts-ignore` or broad suppressions merely to make code compile.

If a suppression is absolutely necessary, it must be narrowly scoped and justified.

---

# 9. Constants and Configuration

Never hardcode repeated business or configuration values across the application.

Centralize where appropriate:

- Routes
- API endpoints
- Roles
- Permissions
- Statuses
- Limits
- Collection/table names
- Cache durations
- Feature flags
- Public configuration

Do not convert every one-off literal into a constant.

Use constants when they improve consistency, reuse, safety, or maintainability.

---

# 10. React Rules

- Use functional components.
- Keep components focused.
- Avoid very large components.
- Keep business logic out of purely presentational components.
- Prefer composition over prop-drilling hacks.
- Keep local state local.
- Do not introduce global state unnecessarily.
- Avoid unnecessary effects.
- Avoid deriving state in an effect when it can be calculated during render.
- Avoid storing duplicated derived state.
- Memoize only when there is a measurable or clear benefit.
- Do not add `useMemo` or `useCallback` everywhere by default.
- Use stable keys for lists.
- Never use array index as a key when item identity can change.
- Avoid unnecessary re-renders caused by unstable props or duplicated state.

---

# 11. State Placement

Choose state based on its ownership:

- URL/search params → search, filters, sorting, pagination, shareable tab state
- Local component state → local UI interaction
- Server state → API/query cache or server rendering
- Context → relatively stable cross-tree state
- Global store → genuinely shared, frequently-changing client state

Do not use Zustand, Redux, Context, or another global store simply because multiple components need data.

Prefer URL state for state that should survive refresh, browser navigation, or sharing.

---

# 12. Next.js

- Prefer Server Components by default.
- Use `"use client"` only where interactivity, browser APIs, client hooks, or local client state are required.
- Keep Client Components as small as practical.
- Keep secrets and privileged operations on the server.
- Do not import server-only libraries into client dependency graphs.
- Prefer server-side data fetching when it improves security, SEO, and performance.
- Use route handlers/server actions only where appropriate to the project architecture.
- Use built-in image and font optimization where applicable.
- Minimize client-side JavaScript.
- Use streaming/Suspense strategically for slow, independent UI sections.
- Do not block the entire page on data required by only one subsection.

Before choosing a caching strategy, inspect:

- Next.js version
- App Router vs Pages Router
- Whether Cache Components are enabled
- Existing project caching patterns

Never assume Next.js caching semantics.

---

# 13. Client / Server Boundary

Never trust the browser as a security boundary.

Never send the entire database object/model to the client by default.

Return only fields required by the client.

Keep server-only:

- Secrets
- Internal permission metadata
- Internal-only flags
- Sensitive identifiers when unnecessary
- Administrative data
- Private business logic

Treat all client input as untrusted.

---

# 14. API Design

Every API endpoint or server action must consider:

- Input validation
- Authentication
- Authorization
- Rate limiting when appropriate
- Consistent response shape
- Correct HTTP semantics
- Safe error responses
- Pagination for collections
- Maximum page sizes
- Data minimization
- Timeout handling
- Logging/observability
- Cache invalidation after mutations
- Idempotency where retries are realistic

Do not return stack traces or implementation internals to users.

Use correct HTTP status codes.

Avoid returning fields the caller does not need.

Avoid N+1 network/database behavior.

Mutations should be idempotent when duplicate execution could cause financial, booking, inventory, notification, or other business impact.

---

# 15. Business Logic

Business rules should not be scattered through UI components.

Place business logic in the appropriate:

- Service
- Domain module
- Use-case layer
- Repository
- Server action
- Backend handler

depending on the architecture.

Business rules must be testable independently when practical.

Never duplicate important business rules across frontend and backend unless the frontend version is purely for UX and the backend remains authoritative.

---

# 16. Forms and Validation

## Client Validation

Use client validation for user experience:

- Immediate feedback
- Required fields
- Format checks
- Length/range constraints
- Helpful error messages

Client validation is never a security boundary.

## Server Validation

Validate all untrusted input on the server, including:

- Request body
- Query params
- Route params
- Headers when relevant
- Cookies when relevant
- Uploaded files
- Third-party webhook payloads
- Environment variables
- External API responses when critical

Validate:

- Types
- Required fields
- Min/max lengths
- Numeric ranges
- Formats
- Enums
- Allowed values
- Array length
- Nested object shape
- Nullability/optionality
- Resource ownership when relevant

Prefer shared schemas when client and server constraints are identical.

Server validation may be stricter than client validation.

Do not duplicate complex validation rules manually if a shared schema can safely be used.

---

# 17. Validation vs Sanitization

Validation answers:

> Is this input allowed?

Sanitization/encoding answers:

> How can this value be safely used in a specific context?

Do not blindly sanitize every input.

Use context-specific protections:

- Output encoding for HTML
- Parameterized SQL/database queries
- Safe URL parsing
- Safe path/file handling
- Rich text sanitization when HTML is intentionally supported
- Proper escaping for command/shell contexts

Never rely on string replacement as a general security strategy.

---

# 18. Form UX

Forms should:

- Clearly indicate required fields.
- Show actionable validation errors.
- Associate errors with the correct input.
- Preserve entered values after recoverable failures.
- Prevent accidental duplicate submission.
- Show pending/submitting state.
- Show success state when appropriate.
- Normalize values only when semantically safe.
- Focus or clearly identify invalid fields where useful.

Do not trim or alter values where whitespace may be meaningful, such as passwords.

---

# 19. Authentication

Prefer established authentication libraries/providers.

Never implement cryptography manually.

Use secure:

- Session management
- Token storage
- Token rotation/revocation where required
- Password hashing
- OTP verification
- Password reset flows

Never expose private authentication secrets to the browser.

Do not log credentials or authentication tokens.

---

# 20. Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> May this user perform this action on this resource?

Every protected server operation must independently verify authorization.

Never rely on:

- Hidden buttons
- Disabled UI
- Client-side roles
- Client-side route guards

as the only protection.

Prefer deny-by-default permissions.

Verify resource ownership when applicable.

Apply least privilege.

---

# 21. Web Security

## General

- Validate all untrusted input.
- Protect privileged routes.
- Never trust client-side permissions.
- Do not expose secrets.
- Do not log sensitive credentials.
- Keep dependencies reasonably updated.
- Review security impact before completion.

## XSS

- Prefer framework escaping.
- Avoid `dangerouslySetInnerHTML`.
- When rich HTML is required, sanitize using an established, appropriate solution.
- Never render untrusted HTML directly.

## Injection

- Use parameterized database queries.
- Do not build SQL using string concatenation.
- Never execute user input as code.
- Avoid dynamically constructing commands from untrusted input.

## CSRF

Protect state-changing cookie-authenticated requests where the architecture is vulnerable to CSRF.

Use the framework/auth provider's recommended strategy.

## SSRF

When user-controlled URLs can cause server-side requests:

- Validate protocol.
- Restrict schemes.
- Block private/internal network destinations where applicable.
- Prefer allowlists where possible.

## Open Redirects

Validate redirect destinations.

Do not blindly redirect to arbitrary user-provided URLs.

## Clickjacking

Use appropriate CSP `frame-ancestors` or equivalent protections for sensitive applications.

---

# 22. Cookies

Sensitive cookies should generally use appropriate:

- `Secure`
- `HttpOnly`
- `SameSite`
- Expiration

settings according to the authentication architecture.

Never store secrets in client-readable cookies unless there is a deliberate, secure reason.

---

# 23. Security Headers

For production applications, evaluate appropriate headers such as:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame-ancestors / equivalent clickjacking protection

Do not add restrictive security headers blindly without testing application functionality.

---

# 24. Rate Limiting and Abuse Protection

Apply rate limiting or equivalent controls to sensitive/public endpoints where abuse is realistic, such as:

- Login
- Signup
- OTP
- Password reset
- Contact forms
- Public search APIs
- Expensive AI/API operations
- Upload endpoints
- Webhook-triggering operations

Use IP, user, token, device, tenant, or resource-level limits as appropriate.

Do not rely on frontend throttling for abuse prevention.

---

# 25. File Upload Security

For uploads:

- Enforce maximum file size.
- Restrict allowed file types.
- Validate MIME type.
- Do not trust extensions alone.
- Generate safe filenames.
- Avoid serving executable uploads from executable contexts.
- Store uploads in appropriate isolated storage.
- Restrict access when files are private.
- Validate image/document processing libraries for untrusted content.
- Consider malware scanning for high-risk environments.

---

# 26. Environment Variables

- Never hardcode secrets.
- Never commit production credentials.
- Keep private `.env` files out of Git.
- Provide `.env.example` when useful.
- Only expose variables to the browser when intentionally public.
- Never expose admin/service credentials to the client.
- Validate required environment variables at startup.
- Fail fast when critical configuration is missing.

Environment validation should distinguish server-only and client-exposed values.

---

# 27. Database Access

- Keep database access separate from presentation code.
- Reuse queries rather than duplicating them.
- Fetch only required fields.
- Avoid unnecessary reads and writes.
- Use pagination for growing collections.
- Avoid unbounded queries.
- Use proper indexes based on real query patterns.
- Avoid full table/collection scans when unnecessary.
- Do not create indexes blindly.
- Consider write/storage cost of indexes.
- Handle database errors explicitly.
- Enforce database-level constraints when appropriate.

---

# 28. N+1 Queries

Avoid N+1 database or network requests.

Bad pattern:

```text
fetch list
→ loop items
→ fetch related entity once per item
```

Prefer:

- Joins
- Batched reads
- Relation loading
- Aggregation
- Bulk queries
- Preloading

when supported and appropriate.

---

# 29. Transactions and Data Integrity

Use transactions when multiple related writes must succeed or fail together.

Examples:

- Order + inventory update
- Payment record + subscription state
- Booking + slot reservation
- User creation + related profile initialization

For critical writes consider:

- Unique constraints
- Foreign keys/references
- Race conditions
- Idempotency
- Concurrency control
- Atomic operations

Never allow partially completed state when atomicity is required.

---

# 30. Database Migrations

Never make destructive schema changes without considering existing production data.

Prefer backward-compatible evolution:

1. Add new fields/schema.
2. Support old and new data if required.
3. Backfill/migrate existing data.
4. Update application reads/writes.
5. Verify production compatibility.
6. Remove obsolete fields only when safe.

Do not assume historical records match the latest schema.

Use migration scripts or managed migration tools where appropriate.

Never silently delete production data.

---

# 31. Firebase / Firestore

When Firebase/Firestore is used:

- Keep initialization separate from UI.
- Centralize collection names.
- Reuse repository/service functions.
- Minimize reads and writes.
- Use pagination for large collections.
- Design queries around indexes.
- Validate writes.
- Enforce security rules.
- Never rely only on frontend restrictions.
- Verify tenant/user ownership in security rules.
- Test security rules for protected data.
- Avoid broad read/write rules in production.

---

# 32. Data Fetching

- Avoid unnecessary requests.
- Avoid duplicate requests.
- Reuse fetched data safely.
- Parallelize independent requests when beneficial.
- Do not parallelize operations that depend on each other.
- Handle cancellation or stale results when race conditions are possible.
- Avoid fetching large datasets when only a subset is required.
- Prefer server-side data fetching when appropriate.
- Avoid client waterfalls.

Example:

```ts
const [user, products, settings] = await Promise.all([
  getUser(),
  getProducts(),
  getSettings(),
]);
```

only when those operations are independent.

---

# 33. Race Conditions

When async responses can return out of order:

- Cancel stale requests where practical.
- Ignore obsolete responses.
- Prevent stale data from overwriting newer state.
- Guard duplicate mutations.
- Use appropriate optimistic concurrency controls where needed.

Never assume request completion order.

---

# 34. Caching Strategy

Never add caching without defining:

- What is cached?
- Who can share it?
- How fresh must it be?
- How is it invalidated?
- What happens after mutation?

Classify data:

## Static

Examples:

- Build-time content
- Stable configuration
- Static marketing content

Cache aggressively.

## Public + Slow-Changing

Examples:

- CMS content
- Categories
- Published pages

Use caching with timed or event-driven revalidation.

## Public + Frequently Changing

Use shorter cache lifetimes and explicit invalidation.

## User-Specific

Do not share-cache across users unless the cache key fully isolates identity/tenant/session.

## Security-Sensitive

Examples:

- Authentication state
- Permissions
- Financial state
- Private user data

Prefer fresh server-side reads unless a secure caching architecture is explicitly designed.

## Mutations

After a successful mutation:

- Invalidate affected cache tags/keys/routes.
- Update query caches if used.
- Prevent stale UI from persisting indefinitely.

Never assume cached data is fresh.

---

# 35. Performance

Optimize based on actual bottlenecks.

Check whether the bottleneck is:

- Network
- Database
- Server execution
- JavaScript bundle
- Rendering
- Images
- Fonts
- Third-party scripts
- Excessive API calls

Do not prematurely optimize simple code.

For public production websites, target good Core Web Vitals at the 75th percentile:

- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

---

# 36. Bundle Optimization

- Keep Client Components small.
- Avoid importing server-only libraries into client bundles.
- Lazy-load heavy client-only functionality when beneficial.
- Avoid importing entire libraries for one small helper.
- Prefer tree-shakeable imports.
- Review bundle impact before adding heavy dependencies.
- Avoid unnecessary polyfills.
- Remove unused dependencies.
- Do not send server-only data or code to the browser.

---

# 37. Rendering Performance

- Avoid unnecessary renders.
- Avoid duplicated state.
- Avoid expensive calculations on every render when measurable.
- Virtualize very large lists when necessary.
- Use pagination/infinite loading for large datasets.
- Use memoization only when justified.
- Avoid layout thrashing.
- Avoid unnecessary client hydration.

---

# 38. Images

When using images:

- Prefer optimized image components/pipelines.
- Provide dimensions or aspect ratio.
- Prevent layout shift.
- Use responsive sizing.
- Do not serve unnecessarily large images to small screens.
- Prioritize only true above-the-fold/LCP images.
- Lazy-load below-the-fold images.
- Prefer modern formats when supported by the image pipeline.
- Use meaningful alt text for content-bearing images.
- Use empty alt text for decorative images.

Do not misuse alt text for keyword stuffing.

---

# 39. Fonts

- Prefer framework font optimization where applicable.
- Avoid unnecessary font families and weights.
- Avoid font-driven layout shifts.
- Preload only genuinely critical font resources.
- Prefer efficient font subsets.
- Avoid loading duplicate font variants.

---

# 40. Third-Party Scripts

Third-party scripts can significantly harm performance and privacy.

Before adding one:

- Confirm it is required.
- Review security/privacy impact.
- Lazy-load or defer when possible.
- Load after interaction where appropriate.
- Avoid duplicates.
- Verify that it does not block rendering unnecessarily.

Examples include:

- Analytics
- Chat widgets
- Ads
- Heatmaps
- Marketing pixels

---

# 41. SEO

SEO rules apply to public/indexable content.

Every indexable page should consider:

- Unique title
- Unique meta description
- Canonical URL
- Correct robots directives
- Open Graph metadata
- Social metadata
- Semantic HTML
- Logical heading structure
- Descriptive links
- Internal linking
- Image alt text
- Crawlable content
- Structured data where applicable
- Sitemap inclusion
- URL quality
- Duplicate-content prevention

Important SEO content should preferably be present in server-rendered HTML.

Do not move crawl-critical content to client-only rendering without a strong reason.

---

# 42. SEO Titles and Descriptions

- Use descriptive titles.
- Avoid duplicate page titles.
- Avoid generic titles like "Home" or "Page".
- Keep descriptions unique and relevant.
- Do not keyword-stuff.
- Generate dynamic metadata safely for dynamic routes.

Metadata must reflect actual page content.

---

# 43. Canonicals and Indexing

- Use one preferred canonical URL.
- Avoid conflicting canonicals.
- Avoid accidental `noindex`.
- Do not index private/admin/auth pages.
- Review query-parameter pages for duplicate-content risk.
- Use robots controls intentionally.
- Ensure canonical host/protocol consistency.

---

# 44. Sitemap and Robots

For public websites:

- Maintain valid `sitemap.xml`.
- Maintain appropriate `robots.txt`.
- Include only intended canonical URLs in the sitemap.
- Exclude private/admin/auth/internal routes.
- Update sitemap generation when routes/content models change.

---

# 45. Structured Data

Use structured data only when the page actually qualifies.

Examples:

- Organization
- WebSite
- BreadcrumbList
- Product
- Article
- Event
- FAQ where still applicable and supported

Rules:

- Structured data must match visible page content.
- Do not fabricate reviews, ratings, offers, authors, or business details.
- Avoid duplicate conflicting entities.
- Use stable identifiers when helpful.
- Validate generated structured data.

---

# 46. Accessibility

Prefer semantic HTML before ARIA.

Requirements:

- Interactive elements must be keyboard accessible.
- Use `<button>` for actions.
- Use `<a>` / framework Link for navigation.
- Do not use clickable `<div>` when semantic elements exist.
- Maintain visible focus states.
- Associate labels with form controls.
- Associate validation messages with inputs.
- Manage modal/dialog focus properly.
- Do not rely only on color to communicate state.
- Maintain readable contrast.
- Respect `prefers-reduced-motion`.
- Provide appropriate alt text.
- Ensure meaningful heading hierarchy.
- Use ARIA only when native semantics are insufficient.
- Provide live-region announcements for important async states when useful.
- Ensure usable touch targets.

---

# 47. Responsive Design

Build responsive UI by default.

Test at least:

- Mobile
- Tablet
- Desktop

Consider:

- Overflow
- Long text
- Empty states
- Large numbers
- Localization expansion
- Touch behavior
- Fixed/sticky elements
- Keyboard overlays on mobile
- Tables on small screens

Do not make a desktop-only implementation and add responsive fixes as an afterthought.

---

# 48. UI Interaction Standards

For interactive elements:

- Use `cursor-pointer` where the design system/framework does not already provide appropriate affordance and the element is clickable.
- Provide hover/focus/active states where relevant.
- Highlight active navigation correctly.
- Prevent invalid or impossible interactions.
- Disable controls appropriately during non-repeatable pending operations.
- Do not disable controls without communicating why when the reason is not obvious.
- Preserve user context across loading and errors where practical.

---

# 49. Loading, Error, Empty, and Success States

Every data-driven UI should handle:

- Loading
- Error
- Empty
- Success

Do not leave users with unexplained blank screens.

Use skeletons, spinners, progressive rendering, or existing loading patterns appropriately.

Do not show fake data to hide loading states.

---

# 50. Error Handling

Handle errors explicitly.

Never silently ignore important errors.

## Expected Errors

Examples:

- Validation failure
- Unauthorized
- Forbidden
- Not found
- Conflict
- Business-rule rejection

Return controlled, actionable responses.

## Unexpected Errors

Examples:

- Database outage
- Unhandled exception
- External service failure

Log diagnostic context and return a safe generic response.

Never expose:

- Stack traces
- Database credentials
- API keys
- Tokens
- Internal service details

to end users.

---

# 51. Third-Party Integrations

For external APIs:

- Define timeouts.
- Handle non-2xx responses.
- Handle malformed responses.
- Validate critical response data.
- Retry only operations that are safe to retry.
- Use bounded retries.
- Use exponential backoff where appropriate.
- Never retry indefinitely.
- Handle provider outages gracefully.
- Avoid blocking critical user flows on non-critical services when possible.

---

# 52. Webhooks

Webhook endpoints must:

- Verify provider signatures.
- Treat payloads as untrusted.
- Validate payload shape.
- Be idempotent.
- Prevent duplicate side effects.
- Protect against replay where supported.
- Return required responses quickly.
- Offload expensive work to background processing when infrastructure supports it.

Never trust webhook payloads based only on endpoint secrecy.

---

# 53. Payments and Financial Operations

For payments/subscriptions:

- Never trust amount/price from the client.
- Resolve authoritative price server-side.
- Verify payment-provider signatures.
- Make payment processing idempotent.
- Store provider transaction IDs.
- Handle retries/duplicate webhooks.
- Reconcile provider state with application state.
- Never mark payment successful based only on client redirect/query params.
- Log payment state transitions safely.
- Do not log full sensitive payment data.

---

# 54. Destructive Actions

For destructive or high-impact operations:

- Require clear user intent.
- Prevent accidental double execution.
- Confirm high-impact actions where appropriate.
- Prefer reversible soft-delete when business requirements justify it.
- Enforce authorization server-side.
- Log important administrative destructive events where appropriate.

---

# 55. Optimistic UI

Use optimistic UI only when:

- The result is predictable.
- Failure is recoverable.
- Rollback is clear.
- The user experience benefits meaningfully.

Avoid optimistic confirmation for:

- Payments
- Irreversible destructive actions
- High-risk permission changes

unless the architecture explicitly supports reconciliation.

---

# 56. Pagination

For large or growing datasets:

- Enforce maximum page size.
- Avoid unlimited `limit`.
- Prefer cursor pagination for frequently-changing/high-volume datasets.
- Offset pagination is acceptable where appropriate for small/admin datasets.
- Preserve filters/sort order across pages.
- Avoid fetching total counts when they are prohibitively expensive unless required.

---

# 57. Search and Filtering

For search/filter features:

- Debounce only where useful.
- Avoid firing unnecessary requests.
- Keep shareable filters in the URL where appropriate.
- Sanitize/validate server-side query input.
- Enforce safe maximum result sizes.
- Use indexed search strategies for large datasets.
- Avoid client filtering of huge datasets that should be filtered server-side.

---

# 58. Logging and Observability

For important operations and failures, log structured context.

Useful context may include:

- Request/correlation ID
- User/tenant ID where safe
- Operation name
- Resource ID
- Error category
- External provider
- Duration

Never log:

- Passwords
- Access tokens
- Refresh tokens
- API keys
- OTP codes unless explicitly safe and temporary in local-only development
- Full payment details
- Sensitive personal information unnecessarily

Use centralized error monitoring when available.

---

# 59. Analytics and Privacy

Do not add analytics/tracking without a clear requirement.

When analytics exists:

- Avoid collecting sensitive data unnecessarily.
- Do not send secrets or private form values.
- Respect consent/legal requirements applicable to the product.
- Avoid duplicate page-view/event tracking.
- Use consistent event naming.
- Keep analytics separate from core business logic.

---

# 60. Dependencies

Before adding a dependency:

1. Check whether an existing dependency already solves the problem.
2. Check whether the functionality is simple enough to implement safely without one.
3. Review maintenance activity.
4. Review security history.
5. Review bundle impact.
6. Review TypeScript support.
7. Review license where relevant.
8. Review dependency footprint.

Prefer stable, well-maintained libraries.

Do not:

- Add libraries without a clear reason.
- Upgrade major versions during unrelated tasks.
- Add duplicate libraries for the same purpose.
- Use abandoned packages for critical functionality.

---

# 61. Testing Strategy

Test behavior, not implementation details.

## Unit Tests

Use for:

- Pure business logic
- Utilities
- Complex transformations
- Permission rules
- Validation logic

## Integration Tests

Use for:

- API + database behavior
- Services/repositories
- Authentication/authorization
- Third-party adapters
- Server actions/route handlers where appropriate

## End-to-End Tests

Use for critical flows such as:

- Login/signup
- Checkout/payment
- Booking
- Subscription
- Critical CRUD
- Admin workflows

## Regression Tests

When fixing an important bug, add a regression test when practical.

Never delete, weaken, or skip a valid test merely to make the build pass.

---

# 62. Never Cheat the Build

Never:

- Disable tests to hide failures.
- Skip tests without justification.
- Remove assertions to get green CI.
- Use `any` to hide type errors.
- Add broad `eslint-disable`.
- Add `@ts-ignore` just to compile.
- Hardcode test-only values into production behavior.
- Mock away the actual bug.
- Comment out broken logic instead of fixing it.

A green build obtained by hiding errors is not a successful implementation.

---

# 63. Comments

Write comments primarily to explain WHY.

Do not write comments that merely repeat the code.

Prefer self-explanatory code.

Remove stale comments.

Document:

- Non-obvious business rules
- Security-sensitive decisions
- Workarounds
- External provider quirks
- Complex algorithms

when future maintainers would otherwise misunderstand them.

---

# 64. Naming

Use meaningful names.

General conventions:

- Components → PascalCase
- Functions → camelCase
- Variables → camelCase
- Constants → UPPER_SNAKE_CASE when true constants
- Types/Interfaces → PascalCase
- Hooks → `useSomething`

Avoid vague names such as:

- data
- temp
- value
- thing
- test1
- x
- foo
- bar

unless context makes them genuinely clear.

---

# 65. File Size and Complexity

Avoid giant files containing unrelated responsibilities.

If a file becomes difficult to understand:

- Extract components
- Extract hooks
- Extract services
- Extract repositories
- Extract utilities
- Extract schemas
- Extract types
- Extract constants

Do not split files merely to satisfy an arbitrary line count.

Split when cohesion and readability improve.

---

# 66. Git and Change Discipline

- Make focused changes.
- Do not modify unrelated files.
- Preserve existing behavior.
- Avoid unnecessary refactors.
- Keep diffs easy to review.
- Review every changed file before finishing.
- Remove debug code before completion.
- Do not commit generated secrets.
- Do not silently change formatting across unrelated files.

Commit messages should be meaningful when commits are part of the task.

---

# 67. Backward Compatibility

Preserve existing behavior unless change is intentional.

Before changing:

- API contracts
- Database fields
- Route paths
- Component props
- Event payloads
- Storage format
- Authentication behavior

check existing usage.

When contracts must change, prefer backward-compatible migration where practical.

Do not rename or remove production fields without verifying all consumers.

---

# 68. Dead Code and Cleanup

After changes:

- Remove obsolete imports.
- Remove dead code introduced/replaced by the change.
- Remove temporary debug logging.
- Remove commented-out code.
- Remove unused variables.
- Remove temporary feature flags used only for implementation.
- Remove abandoned code paths when safe and in scope.

Do not perform unrelated cleanup across the entire repository.

---

# 69. Do Not Over-Engineer

Avoid:

- Unnecessary abstractions
- Unnecessary design patterns
- Unnecessary layers
- Unnecessary libraries
- Unnecessary state management
- Unnecessary files
- Unnecessary repositories/services
- Unnecessary caching
- Unnecessary database queries
- Unnecessary refactoring

Use the simplest architecture that safely satisfies current and foreseeable project requirements.

---

# 70. Code Review Mindset

Before finalizing, review the implementation as if another senior developer will maintain it six months later.

Ask:

- Is it secure?
- Is it correct?
- Is data integrity protected?
- Is authorization enforced?
- Is validation complete?
- Is the architecture consistent?
- Is business logic separated appropriately?
- Is anything duplicated?
- Are types accurate?
- Are errors handled?
- Are race conditions possible?
- Is cache invalidation correct?
- Is performance acceptable?
- Is SEO affected?
- Is accessibility affected?
- Is the solution unnecessarily complex?
- Is backward compatibility preserved?
- Are tests adequate?

If something can be improved cleanly without adding unnecessary complexity, improve it.

---

# 71. Mandatory Definition of Done

A task is complete only after relevant items below have been verified.

## Code

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Build passes
- [ ] No broken imports
- [ ] No unused imports/variables
- [ ] No accidental `any`
- [ ] No unjustified suppressions
- [ ] No temporary debug code

## Functionality

- [ ] Requested behavior works
- [ ] Existing behavior remains intact
- [ ] Edge cases considered
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Success state handled

## Forms

- [ ] Client validation exists where useful
- [ ] Server validation is authoritative
- [ ] Duplicate submission is prevented
- [ ] Validation messages are useful
- [ ] User input is preserved after recoverable errors

## Security

- [ ] Authentication checked where required
- [ ] Authorization checked server-side
- [ ] Resource ownership checked where required
- [ ] Input validated
- [ ] Secrets remain server-side
- [ ] Sensitive data is not unnecessarily returned
- [ ] Logs do not expose secrets
- [ ] Abuse/rate-limit impact reviewed
- [ ] Upload/security impact reviewed if applicable

## Data

- [ ] Database constraints considered
- [ ] Migration/backward compatibility reviewed
- [ ] Transactions used where atomicity is required
- [ ] N+1 queries avoided
- [ ] Appropriate indexes considered
- [ ] Existing records remain compatible

## Caching

- [ ] Cache behavior is intentional
- [ ] User-specific data is not incorrectly shared
- [ ] Mutation invalidates affected cache
- [ ] Stale-data behavior is acceptable

## Performance

- [ ] No avoidable repeated requests
- [ ] No avoidable client/server waterfalls
- [ ] Client JavaScript minimized
- [ ] Images/assets optimized
- [ ] Large lists paginated/virtualized where necessary
- [ ] No unnecessarily heavy dependency added

## SEO — Public Pages

- [ ] Unique title
- [ ] Meta description
- [ ] Canonical URL
- [ ] Robots/indexing correct
- [ ] Open Graph/social metadata
- [ ] Semantic heading structure
- [ ] Structured data where applicable
- [ ] Sitemap implications considered
- [ ] Important content server-rendered where appropriate

## Accessibility

- [ ] Keyboard behavior works
- [ ] Focus states exist
- [ ] Labels are associated correctly
- [ ] Semantic elements are used
- [ ] Alt text is correct
- [ ] Errors are accessible
- [ ] Responsive touch targets are usable
- [ ] Reduced motion is considered where relevant

## Responsive Design

- [ ] Mobile checked
- [ ] Tablet checked
- [ ] Desktop checked
- [ ] Overflow checked
- [ ] Navigation active states checked
- [ ] Loading/error layouts checked

## Testing

- [ ] Relevant tests pass
- [ ] Critical flow tested
- [ ] Regression test added for important bug when practical
- [ ] Existing tests were not weakened to hide failures

## Final Review

- [ ] No unrelated changes
- [ ] No functionality silently removed
- [ ] No temporary code remains
- [ ] Final diff reviewed
- [ ] Documentation updated if required

---

# 72. Required Validation Commands

Use the project package manager and scripts already defined by the repository.

Examples:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

or equivalent:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Do not invent scripts that do not exist.

Inspect `package.json` first.

Run the checks relevant to the change.

For large repositories, targeted checks may be used during development, but the required project-level checks should be run before completion when practical.

---

# 73. Agent Completion Report

When reporting completion, summarize only verified work.

A useful completion summary should include:

- What changed
- Important architectural/security decisions
- Validation performed
- Tests/checks run
- Any remaining known limitations

Never say:

- "Everything is perfect"
- "Fully secure"
- "100% optimized"

unless such a claim can genuinely be proven.

Do not claim a check was run if it was not run.

---

# 74. Final Rule

Every change should leave the codebase:

- More secure
- Correct
- Reliable
- Maintainable
- Consistent
- Appropriately reusable
- Performant
- Accessible
- SEO-friendly where applicable
- Production-ready

without unnecessary complexity.

The agent should behave like a senior engineer responsible for the long-term health of the product, not like a code generator trying only to complete the immediate task.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
