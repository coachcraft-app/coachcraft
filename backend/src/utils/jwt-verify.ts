import type { FastifyReply, FastifyRequest } from "fastify";
import jwksRsa from "jwks-rsa";
import jwt, { type JwtHeader, type JwtPayload } from "jsonwebtoken";

// Build Cognito issuer and JWKS client from environment
const REGION = process.env["COGNITO_REGION"];
const USER_POOL_ID = process.env["COGNITO_USER_POOL_ID"];
const ISSUER =
  REGION && USER_POOL_ID
    ? `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
    : undefined;

// Defaults for jwks config
const jwksClient = ISSUER
  ? jwksRsa({
      jwksUri: `${ISSUER}/.well-known/jwks.json`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000, // cache JWKS public keys for 10 mins
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    })
  : undefined;

function getSigningKey(
  header: JwtHeader,
  callback: (error: Error | null, key?: string) => void,
): void {
  jwksClient?.getSigningKey(header.kid, (error, key) => {
    if (error) return callback(error as Error);
    if (!key) return callback(new Error("No signing key was obtained"));

    // eslint-disable-next-line unicorn/no-null
    callback(null, key.getPublicKey());
  });
}

function getBearerToken(request: FastifyRequest): string | undefined {
  const value = request.headers.authorization;

  if (!value || !value.startsWith("Bearer ")) return undefined;

  // Splice out the "Bearer" part of the token
  return value.slice("Bearer ".length).trim();
}

/**
 * Fastify preHandler to verify JWT and append the decoded payload to request.user
 */
export async function verifyJwtOnRequest(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // break early in testing
  if ("NO_AUTH" in process.env) return;

  // Allow CORS preflight without auth
  if (request.method === "OPTIONS") return;

  const token = getBearerToken(request);

  // In case token is invalid
  if (!token) {
    reply.code(401).send({ error: "Missing or invalid Authorization header" });
    return;
  }

  const payload = await new Promise<JwtPayload | string>((resolve, reject) => {
    jwt.verify(
      token,
      getSigningKey,
      { algorithms: ["RS256"], issuer: ISSUER },
      (error, decoded) =>
        error ? reject(error) : resolve(decoded as JwtPayload | string),
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (request as any).user = payload;
}

export type RequestUser = JwtPayload | string;
