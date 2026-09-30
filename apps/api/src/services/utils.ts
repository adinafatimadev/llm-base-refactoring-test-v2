import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const scrypt=promisify(scryptCallback);const N=16384,R=8,P=1,KEY=64;
export function generateId(){return `${Date.now()}-${randomBytes(8).toString("hex")}`;}
export async function hashPassword(password:string){const salt=randomBytes(16);const key=(await scrypt(password,salt,KEY,{N,r:R,p:P,maxmem:64*1024*1024})) as Buffer;return `scrypt$v1$${salt.toString("base64url")}$${key.toString("base64url")}`;}
export function isLegacyPasswordHash(v:string){return /^[a-f0-9]{64}$/.test(v);}
export function legacyHashPassword(password:string){return createHash("sha256").update(password+"salt").digest("hex");}
async function verifyLegacy(password:string,stored:string){const actual=createHash("sha256").update(password+"salt").digest();const expected=Buffer.from(stored,"hex");return expected.length===actual.length&&timingSafeEqual(actual,expected);}
export async function verifyPassword(password:string,stored:string){if(isLegacyPasswordHash(stored))return verifyLegacy(password,stored);const [scheme,version,saltEncoded,keyEncoded]=stored.split("$");if(scheme!=="scrypt"||version!=="v1"||!saltEncoded||!keyEncoded)return false;try{const salt=Buffer.from(saltEncoded,"base64url"),expected=Buffer.from(keyEncoded,"base64url");const actual=(await scrypt(password,salt,expected.length,{N,r:R,p:P,maxmem:64*1024*1024})) as Buffer;return timingSafeEqual(actual,expected);}catch{return false;}}
export function toProtoTimestamp(date:Date){const ms=date.getTime();return{seconds:BigInt(Math.floor(ms/1000)),nanos:(ms%1000)*1000000};}
export function fromProtoTimestamp(t:{seconds:bigint;nanos:number}){return new Date(Number(t.seconds)*1000+t.nanos/1000000);}
