---
name: buoy
description: Comprehensive skill and runtime guide for Buoy devtools and MCP server in React Native / Expo apps. Use when debugging, inspecting live app state (Zustand, AsyncStorage, Network, Console), driving UI interactions (describe_screen, tap_element, run_flow), benchmarking render performance (perf-monitor), or configuring Buoy in-app devtools and MCP servers.
---

# 🛟 Buoy — React Native DevTools & MCP Agent Skill Manual

Buoy is an in-app developer menu, desktop dashboard, and MCP (Model Context Protocol) runtime bridge for React Native (Expo) and Flutter applications. It enables AI coding agents and developers to inspect live application state, execute scripted interaction flows, monitor network and console activity, and benchmark render performance directly on simulators and physical devices.

---

## 🏗️ 1. Architecture & Core Concepts

Buoy operates directly inside your app's JavaScript process:
1. **In-App Floating DevTools (`FloatingDevTools`):** A lightweight on-screen floating UI to inspect storage, state, network, and logs directly on the phone or simulator.
2. **Local Sync Broker:** A zero-config localhost broker (default port `42831`) that mirrors state between the app, [Buoy Desktop](https://github.com/Buoy-gg/Buoy-Desktop), and AI Agent MCP clients.
3. **MCP Server (`@buoy-gg/mcp`):** An MCP server communicating over `stdio` that exposes structured tools to AI agents (Google Antigravity, Claude Code, Cursor, VS Code).

---

## 📦 2. Package Installation & Root Setup

### Package Installation (via Bun)
```bash
bun add @buoy-gg/core @buoy-gg/zustand @buoy-gg/network @buoy-gg/storage @buoy-gg/console @buoy-gg/events @buoy-gg/perf-monitor @buoy-gg/route-events
```

### Root Component Integration (`src/app/_layout.tsx`)
```tsx
import { FloatingDevTools } from "@buoy-gg/core";
import { watchStores } from "@buoy-gg/zustand";
import {
  useUserStore,
  useHeartStore,
  useEconomyStore,
  useMistakeStore,
  useAchievementStore,
  useQuestStore,
  useGameStore,
  useAuthStore,
} from "../store";

// Auto-register Zustand stores in DEV mode
if (__DEV__) {
  watchStores({
    user: useUserStore,
    heart: useHeartStore,
    economy: useEconomyStore,
    mistake: useMistakeStore,
    achievement: useAchievementStore,
    quest: useQuestStore,
    game: useGameStore,
    auth: useAuthStore,
  });
}

export default function RootLayout() {
  return (
    <>
      {/* App Navigation & Providers */}
      {__DEV__ && <FloatingDevTools />}
    </>
  );
}
```

### Production Safety & Headless Mode
- Always wrap in `__DEV__` or internal user flag checks: `{isInternalUser && <FloatingDevTools />}`.
- For headless test builds (syncing with MCP and Desktop without rendering UI on device):
  ```tsx
  <FloatingDevTools headless />
  ```

---

## 🤖 3. MCP Server Configuration

### Project-level MCP (`.mcp.json` / `.cursor/mcp.json` / `.vscode/mcp.json`)
```json
{
  "mcpServers": {
    "buoy": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@buoy-gg/mcp@latest"],
      "env": {
        "BUOY_VERIFY": "auto"
      }
    }
  }
}
```

### Global MCP (`mcp_config.json`)
```json
"buoy": {
  "command": "npx",
  "args": ["-y", "@buoy-gg/mcp@latest"],
  "env": {
    "BUOY_VERIFY": "auto"
  }
}
```

---

## 🛠️ 4. MCP Tool Reference Catalog

Route by symptom before reading raw source code:

| Tool | Primary Purpose | When to Use |
| :--- | :--- | :--- |
| **`get_triage`** | **START HERE.** Returns device info, recent console errors, network requests, storage keys, and active screen summary in one call. | First step in diagnosing any runtime bug or state mismatch. |
| **`run_flow`** | Executes a scripted sequence of `tap`, `type`, `wait`, and `assert` actions. Returns final screen, network, and console output. | Reproducing bugs or verifying fixes in a single deterministic call. |
| **`get_events`** | Universal activity timeline (network, state changes, storage writes, navigation, renders). | Checking timeline before driving the UI. |
| **`get_network_requests`** | Reads full request and response payloads, status codes, and timing. | API data wrong, endpoints failing, or boot-time requests failing. |
| **`get_console`** | Streams runtime console output and uncaught JS fatal crashes tagged `[FATAL]`. | Component crash investigations or unhandled promise rejections. |
| **`get_zustand_state`** | Inspects current Zustand store states. | Verifying store state, player inventory, score, or match machine. |
| **`get_storage` / `storage_action`** | Reads, writes, or clears persisted AsyncStorage keys. | Persisted state errors, login session persistence, offline cache issues. |
| **`describe_screen`** | Walks the React Native component tree to return accessible UI elements with tap targets. | Exploring screen layout and finding interactive button testIDs/labels. |
| **`tap_element`** | Triggers the native JavaScript press handler of a component on screen. | Navigating or tapping buttons on simulators and real devices. |
| **`reload_app`** | Reloads the JS bundle on the target device. | Recovering from crashes or testing cold-start initialization. |
| **`measure_renders`** | Measures component render counts, render times, and FPS metrics. | Checking re-render regressions with `compareToPrevious: true`. |
| **`run_benchmark_batch`** | Runs test variants under load across devices and returns ranked comparison tables. | Benchmarking animations, heavy lists, canvases, or Skia components. |

---

## 🔬 5. Verification Protocol ("Don't report a fix you haven't watched work")

1. **Symptom Routing:** Start with `get_triage` to read live errors and active state.
2. **Reproduce:** Use `run_flow` or `tap_element` to trigger the broken path on the running app.
3. **Apply Minimal Fix:** Make surgical changes to the code.
4. **Reload & Re-drive:** Call `reload_app`, re-run the flow on the device, and verify console errors are gone and state matches expected values.
