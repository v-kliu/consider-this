import 'server-only';
import { fetchAccessToken } from "@humeai/voice";


export const getHumeAccessToken = async (): Promise<string | null> => {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_CLIENT_SECRET;

  if (!apiKey || !secretKey) {
    console.error("HUME_API_KEY or HUME_CLIENT_SECRET is not defined");
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey: apiKey as string,
      secretKey: secretKey as string,
    });

    return accessToken ?? null;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};