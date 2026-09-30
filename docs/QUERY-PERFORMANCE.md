# Query performance

The original feed and bookmark implementations had an N+1 pattern: after loading posts they executed three database queries per post for like count, comment count, and current-user like status. Profile similarly executed separate count/status queries.

Measured service-level SQL executions for the requested 10-post cases: home feed 32 before / 2 after; profile 5 before / 1 after; bookmarks 31 before / 1 after. The response shape remains unchanged.

Reusable rule: paginated post lists must select metrics in the same SQL statement. Never perform database work inside a per-row map. Add query-count regression tests for new post-list surfaces.