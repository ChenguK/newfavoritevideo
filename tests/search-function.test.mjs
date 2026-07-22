import assert from "node:assert/strict";
import test from "node:test";

import {
  requestYouTubeSearch,
} from "../netlify/functions/search.mjs";

test("rejects an empty search term", async () => {
  const result = await requestYouTubeSearch("   ", {
    apiKey: "test-key",
  });

  assert.equal(result.status, 400);
  assert.deepEqual(result.body, {
    error: "A search term is required.",
  });
});

test("reports a missing API key", async () => {
  const result = await requestYouTubeSearch("travel", {
    apiKey: "",
  });

  assert.equal(result.status, 500);
  assert.deepEqual(result.body, {
    error: "The YouTube API key is not configured.",
  });
});

test("sends a normalized query to YouTube", async () => {
  let requestedUrl;

  const fetchImpl = async (url) => {
    requestedUrl = new URL(url);

    return new Response(
      JSON.stringify({
        items: [{ id: { videoId: "video-1" } }],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  const result = await requestYouTubeSearch(
    "  travel videos  ",
    {
      apiKey: "test-key",
      fetchImpl,
    },
  );

  assert.equal(result.status, 200);
  assert.equal(
    requestedUrl.searchParams.get("q"),
    "travel videos",
  );
  assert.equal(
    requestedUrl.searchParams.get("type"),
    "video",
  );
  assert.equal(
    requestedUrl.searchParams.get("maxResults"),
    "10",
  );
});

test("handles an upstream YouTube error", async () => {
  const fetchImpl = async () =>
    new Response("Quota exceeded", {
      status: 403,
    });

  const result = await requestYouTubeSearch("travel", {
    apiKey: "test-key",
    fetchImpl,
  });

  assert.equal(result.status, 502);
  assert.deepEqual(result.body, {
    error: "YouTube search is temporarily unavailable.",
  });
});