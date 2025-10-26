import type { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    // Decoded JWT payload attached by our auth hook
    user?: JwtPayload | string;
  }
}
