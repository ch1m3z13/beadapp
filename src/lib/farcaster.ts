// Farcaster utility functions using Neynar API

interface UserStats {
  fid: number;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  pfpUrl?: string;
}

/**
 * Get user stats from Neynar API
 * @param fid 
 * @returns User stats object
 */
export async function getUserStats(fid: number): Promise<UserStats> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY is not configured');
    }

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'api_key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user) {
      throw new Error('User not found');
    }

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      followerCount: user.follower_count || 0,
      followingCount: user.following_count || 0,
      pfpUrl: user.pfp_url,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    
    // Return default values on error
    return {
      fid,
      username: `User ${fid}`,
      displayName: `User ${fid}`,
      followerCount: 0,
      followingCount: 0,
    };
  }
}

/**
 * Get recent casts for a user
 * @param fid - Farcaster ID
 * @param limit - Number of casts to fetch (default: 10)
 * @returns Array of casts
 */
export async function getUserCasts(fid: number, limit: number = 10) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY is not configured');
    }

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/${fid}?limit=${limit}`,
      {
        headers: {
          'api_key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.casts || [];
  } catch (error) {
    console.error('Error fetching user casts:', error);
    return [];
  }
}

/**
 * Search for users by username
 * @param query - Search query
 * @returns Array of matching users
 */
export async function searchUsers(query: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('NEYNAR_API_KEY is not configured');
    }

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'api_key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result?.users || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}