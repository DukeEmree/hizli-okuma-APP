import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Ticks every hour; `sendWeeklyDigest` itself filters to users whose local
// time is currently Sunday 20:00, so this is effectively "once a week per
// user, in their own timezone" without a per-timezone cron entry.
crons.interval("weekly summary digest", { hours: 1 }, internal.weeklySummary.sendWeeklyDigest, {});

export default crons;
