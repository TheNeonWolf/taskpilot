import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(
  JWT_SECRET
);

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