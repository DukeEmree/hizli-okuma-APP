/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as exerciseProgress from "../exerciseProgress.js";
import type * as exerciseSessions from "../exerciseSessions.js";
import type * as expoPush from "../expoPush.js";
import type * as gamification from "../gamification.js";
import type * as home from "../home.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as notificationPolicy from "../notificationPolicy.js";
import type * as pushTokens from "../pushTokens.js";
import type * as revenuecatEvents from "../revenuecatEvents.js";
import type * as statistics from "../statistics.js";
import type * as streaks from "../streaks.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  exerciseProgress: typeof exerciseProgress;
  exerciseSessions: typeof exerciseSessions;
  expoPush: typeof expoPush;
  gamification: typeof gamification;
  home: typeof home;
  http: typeof http;
  migrations: typeof migrations;
  notificationPolicy: typeof notificationPolicy;
  pushTokens: typeof pushTokens;
  revenuecatEvents: typeof revenuecatEvents;
  statistics: typeof statistics;
  streaks: typeof streaks;
  subscriptions: typeof subscriptions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
