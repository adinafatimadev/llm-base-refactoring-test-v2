import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
const traceStore = new AsyncLocalStorage<string>();
export function currentTraceId(): string | undefined { return traceStore.getStore(); }
export function runWithTrace<T>(traceId: string, fn: () => Promise<T>): Promise<T> { return traceStore.run(traceId, fn); }
export function newTraceId(): string { return randomUUID(); }
export function structuredLog(event: string, fields: Record<string, unknown> = {}): void { console.log(JSON.stringify({ event, traceId: currentTraceId(), ...fields })); }
