# Error handling and observability

Use a unified taxonomy: INVALID_ARGUMENT for validation, UNAUTHENTICATED for missing/invalid sessions, PERMISSION_DENIED for authorization, NOT_FOUND for missing entities, ALREADY_EXISTS for conflicts, RESOURCE_EXHAUSTED for quotas, FAILED_PRECONDITION for invalid state, and INTERNAL for unexpected failures.

Generate one trace ID per RPC and propagate it through service calls and structured logs. Return it as transport metadata named x-trace-id so existing response payloads remain compatible. Never log passwords or session tokens.