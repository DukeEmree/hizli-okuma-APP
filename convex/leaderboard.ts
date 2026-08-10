import { query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

export const getLeaderboard = query({
  args: {
    period: v.string(), // e.g. "ALL_TIME"
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('leaderboardEntries')
      .withIndex('by_period_and_score', (q) => q.eq('period', args.period))
      .order('desc')
      .paginate(args.paginationOpts);

    // Fetch user details for each entry
    const entriesWithUsers = await Promise.all(
      result.page.map(async (entry) => {
        const user = await ctx.db.get(entry.userId);
        return {
          _id: entry._id,
          score: entry.score,
          userId: entry.userId,
          nickname: user?.nickname || user?.displayName || 'İsimsiz Okuyucu',
          avatarUrl: user?.avatarUrl,
        };
      })
    );

    return {
      ...result,
      page: entriesWithUsers,
    };
  }
});

export const getMyRank = query({
  args: { period: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const myEntry = await ctx.db
      .query('leaderboardEntries')
      .withIndex('by_userId_and_period', (q) => q.eq('userId', user._id).eq('period', args.period))
      .unique();

    if (!myEntry) return null;

    // Calculate rank by counting how many entries have a strictly higher score in this period.
    // NOTE: For very large leaderboards, this count query might be slow.
    // However, it's the simplest way to determine rank without materializing it.
    const higherScoresCount = await ctx.db
      .query('leaderboardEntries')
      .withIndex('by_period_and_score', (q) => q.eq('period', args.period).gt('score', myEntry.score))
      .collect();

    return {
      score: myEntry.score,
      rank: higherScoresCount.length + 1,
    };
  }
});
