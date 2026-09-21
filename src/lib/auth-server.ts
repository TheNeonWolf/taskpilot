import { cookies } from "next/headers";

import { verifyAuthToken } from "@/lib/auth";

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("taskpilot_token")?.value;

  if (!token) {
    console.log("AUTH DEBUG: No taskpilot_token cookie found");
    return null;
  }

  try {
    const payload = await verifyAuthToken(token);

    console.log(
      "AUTH DEBUG: JWT verified successfully:",
      payload
    );

    return payload.userId;
  } catch (error) {
    console.error(
      "AUTH DEBUG: JWT verification failed:",
      error
    );

    return null;
  }
}