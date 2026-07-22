const YOUTUBE_SEARCH_URL =
  "https://www.googleapis.com/youtube/v3/search";

export async function requestYouTubeSearch(
  searchTerm,
  {
    apiKey = process.env.YOUTUBE_API_KEY,
    fetchImpl = fetch,
  } = {},
) {
  const normalizedSearchTerm = searchTerm?.trim();

  if (!normalizedSearchTerm) {
    return {
      status: 400,
      body: {
        error: "A search term is required.",
      },
    };
  }

  if (!apiKey) {
    return {
      status: 500,
      body: {
        error: "The YouTube API key is not configured.",
      },
    };
  }

  const url = new URL(YOUTUBE_SEARCH_URL);

  url.searchParams.set("part", "snippet");
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", normalizedSearchTerm);
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetchImpl(url);

    if (!response.ok) {
      const upstreamBody = await response.text();

      console.error("YouTube API request failed", {
        status: response.status,
        body: upstreamBody,
      });

      return {
        status: 502,
        body: {
          error: "YouTube search is temporarily unavailable.",
        },
      };
    }

    return {
      status: 200,
      body: await response.json(),
    };
  } catch (error) {
    console.error("YouTube API request failed", error);

    return {
      status: 502,
      body: {
        error: "YouTube search is temporarily unavailable.",
      },
    };
  }
}

export default async function handler(request) {
  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed." },
      {
        status: 405,
        headers: {
          Allow: "GET",
        },
      },
    );
  }

  const requestUrl = new URL(request.url);

  const result = await requestYouTubeSearch(
    requestUrl.searchParams.get("search"),
  );

  return Response.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  path: "/api/search",
};