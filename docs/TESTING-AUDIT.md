# Test infrastructure audit
## API unit coverage
Existing service tests cover admin, auth, comments, follows, likes, and posts. The service modules without dedicated unit suites are bookmarks, feed, mentions, notifications, search, and users. These are the highest-value coverage gaps because feed/bookmark/profile paths contain database-heavy logic.

Error-path coverage should assert both legacy response contracts and transport errors. New password migration tests cover wrong-password rejection and legacy-to-scrypt compatibility.

## Client E2E
The user client has comprehensive coverage for auth, bookmarks, comments, feed, mentions, notifications, posts, profile, and search. There is no dedicated follows/likes E2E surface; those interactions are exercised indirectly by post/profile flows.

## Isolation
The API setup creates an in-memory SQLite database and clears dependent tables before each test. Keep cleanup in dependency order and avoid shared mutable fixtures. Query-count tests seed their own records after cleanup and restore spies after each measurement.

Recommended pattern: every integration/service suite owns its fixtures, uses unique IDs, and performs explicit cleanup in beforeEach/afterEach. Never depend on execution order between test files.