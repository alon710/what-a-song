import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

interface RateLimit {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimit>();

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  skipSuccessfulRequests: false,
};

/**
 * Rate limiting middleware
 */
export function checkRateLimit(req: NextRequest): NextResponse | null {
  const forwardedIp = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedIp?.split(",")[0] || realIp || "127.0.0.1";

  const key = `rate_limit:${ip}`;
  const now = Date.now();

  let limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    limit = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitStore.set(key, limit);
    return null;
  }

  if (limit.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: `Rate limit exceeded. Try again in ${Math.ceil(
          (limit.resetTime - now) / 1000
        )} seconds.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((limit.resetTime - now) / 1000).toString(),
          "X-RateLimit-Limit": RATE_LIMIT_CONFIG.maxRequests.toString(),
          "X-RateLimit-Remaining": Math.max(
            0,
            RATE_LIMIT_CONFIG.maxRequests - limit.count
          ).toString(),
          "X-RateLimit-Reset": new Date(limit.resetTime).toISOString(),
        },
      }
    );
  }

  limit.count++;
  rateLimitStore.set(key, limit);
  return null;
}

/**
 * Clean up expired rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of rateLimitStore.entries()) {
    if (now > limit.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Validation utilities
 */
export const validators = {
  spotifyId: (id: string): boolean => {
    return /^[a-zA-Z0-9]{22}$/.test(id);
  },

  searchQuery: (query: string): boolean => {
    return query.trim().length >= 2 && query.trim().length <= 100;
  },

  artistTitle: (value: string): boolean => {
    return value.trim().length >= 1 && value.trim().length <= 200;
  },

  limit: (limit: number): boolean => {
    return Number.isInteger(limit) && limit > 0 && limit <= 50;
  },

  offset: (offset: number): boolean => {
    return Number.isInteger(offset) && offset >= 0;
  },
};

/**
 * Spotify API utilities
 */
export class SpotifyApiHelper {
  private static spotifyApi: SpotifyWebApi | null = null;
  private static tokenExpiresAt: number = 0;

  private static createSpotifyApi(): SpotifyWebApi {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error("Spotify credentials not configured");
    }

    return new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
  }

  static async getAuthenticatedApi(): Promise<SpotifyWebApi> {
    const now = Date.now();

    if (!this.spotifyApi || now >= this.tokenExpiresAt) {
      this.spotifyApi = this.createSpotifyApi();

      try {
        const data = await this.spotifyApi.clientCredentialsGrant();
        this.spotifyApi.setAccessToken(data.body.access_token);

        this.tokenExpiresAt = now + data.body.expires_in * 1000 - 5 * 60 * 1000;
      } catch (error) {
        console.error("Failed to authenticate with Spotify API:", error);
        throw new Error("Failed to authenticate with Spotify API");
      }
    }

    return this.spotifyApi;
  }

  static async getAccessToken(): Promise<string> {
    const api = await this.getAuthenticatedApi();
    const token = api.getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token from Spotify");
    }
    return token;
  }
}

/**
 * Genius API utilities
 */
export class GeniusApiHelper {
  static getAccessToken(): string | null {
    return process.env.GENIUS_ACCESS_TOKEN || null;
  }

  static validateCredentials(): boolean {
    return !!process.env.GENIUS_ACCESS_TOKEN;
  }
}

/**
 * Error response utilities
 */
export const ApiError = {
  badRequest: (message: string) =>
    NextResponse.json({ error: message }, { status: 400 }),

  unauthorized: (message: string = "Unauthorized") =>
    NextResponse.json({ error: message }, { status: 401 }),

  notFound: (message: string = "Not found") =>
    NextResponse.json({ error: message }, { status: 404 }),

  tooManyRequests: (message: string = "Too many requests") =>
    NextResponse.json({ error: message }, { status: 429 }),

  internalServerError: (message: string = "Internal server error") =>
    NextResponse.json({ error: message }, { status: 500 }),

  serviceUnavailable: (message: string = "Service unavailable") =>
    NextResponse.json({ error: message }, { status: 503 }),
};

/**
 * Success response utilities
 */
export const ApiSuccess = {
  ok: (data: unknown) => NextResponse.json(data),

  created: (data: unknown) => NextResponse.json(data, { status: 201 }),
};

/**
 * Parameter extraction and validation utilities
 */
export const ParamUtils = {
  getString: (
    searchParams: URLSearchParams,
    key: string,
    required = true
  ): string | null => {
    const value = searchParams.get(key);
    if (required && !value) {
      throw new Error(`Missing required parameter: ${key}`);
    }
    return value ? value.trim() : null;
  },

  getNumber: (
    searchParams: URLSearchParams,
    key: string,
    defaultValue?: number
  ): number => {
    const value = searchParams.get(key);
    if (!value) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing required parameter: ${key}`);
    }

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Invalid number parameter: ${key}`);
    }
    return parsed;
  },
};

/**
 * Generic error handler wrapper for API routes
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const rateLimitResponse = checkRateLimit(req);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("Missing required parameter") ||
          error.message.includes("Invalid")
        ) {
          return ApiError.badRequest(error.message);
        }

        if (
          error.message.includes("authenticate") ||
          error.message.includes("credentials")
        ) {
          return ApiError.serviceUnavailable(
            "External service authentication failed"
          );
        }
      }

      return ApiError.internalServerError("An unexpected error occurred");
    }
  };
}
