import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "build-time-fallback-secret";

export function getJwtSecretKey() {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production" && !process.env.DOCKER_BUILD) {
    throw new Error("JWT_SECRET is not defined in production environment");
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export type AuthTokenPayload = {
  userId: number;
};

export async function createAuthToken(
  payload: AuthTokenPayload
) {
  const userId = Number(payload.userId);

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error("Invalid user ID");
  }

  return new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAuthToken(
  token: string
) {
  const { payload } = await jwtVerify(
    token,
    secret,
    {
      algorithms: ["HS256"],
    }
  );

  const rawUserId = payload.userId;

  const userId =
    typeof rawUserId === "number"
      ? rawUserId
      : typeof rawUserId === "string"
        ? Number(rawUserId)
        : NaN;

  if (
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    throw new Error("Invalid auth token");
  }

  return {
    userId,
  };
}