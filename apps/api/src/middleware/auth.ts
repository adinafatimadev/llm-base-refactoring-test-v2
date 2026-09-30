import type { GrpcSessionPayload } from "@chirp/shared-types";import jwt from "jsonwebtoken";import { randomBytes } from "node:crypto";
const configured=process.env.GRPC_JWT_SECRET;const devSecret=randomBytes(32).toString("hex");
export interface AuthContext{userId:string;username:string;role:"user"|"admin"|"moderator";}
export function getJwtSecret(){if(configured)return configured;if(process.env.NODE_ENV==="production")throw new Error("GRPC_JWT_SECRET must be configured in production");return devSecret;}
export function validateSessionToken(token:string):AuthContext{try{const d=jwt.verify(token,getJwtSecret()) as GrpcSessionPayload;if(!d.userId||!d.username||!d.role)throw new Error();return{userId:d.userId,username:d.username,role:d.role};}catch{throw new Error("Invalid or expired session token");}}
export function createSessionToken(c:AuthContext,expiresInSeconds=604800){return jwt.sign(c,getJwtSecret(),{expiresIn:expiresInSeconds});}
export function requireAuth(token:string|undefined){if(!token)throw new Error("Authentication required");return validateSessionToken(token);}
export function requireAdmin(c:AuthContext){if(c.role!=="admin"&&c.role!=="moderator")throw new Error("Admin access required");}
export function requireSuperAdmin(c:AuthContext){if(c.role!=="admin")throw new Error("Super admin access required");}
