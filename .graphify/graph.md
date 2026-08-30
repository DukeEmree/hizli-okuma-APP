# Knowledge Graph: hizli-okuma

```mermaid
graph TD
    App[src/app] --> Features[src/features]
    App --> Components[src/components]
    App --> Providers[src/providers]
    
    Features --> Components
    Features --> Stores[src/stores]
    Features --> Services[src/services]
    Features --> Hooks[src/hooks]
    
    Components --> Stores
    Components --> Hooks
    
    Hooks --> Stores
    Hooks --> Services
    
    Providers --> Services
    
    Stores --> Utils[src/utils]
    Services --> Utils
    
    App --> I18n[src/i18n]
    Features --> I18n
```

## Entities

| Entity | Type | Description | Source |
|---|---|---|---|
| src/app | Code | Expo Router routes and entry points | `src/app` |
| src/components | Code | Reusable UI components (Tamagui, etc.) | `src/components` |
| src/features | Code | Domain-specific features and exercise engine | `src/features` |
| src/hooks | Code | Custom React hooks | `src/hooks` |
| src/stores | Code | Zustand + MMKV local state stores | `src/stores` |
| src/services | Code | External services (RevenueCat, Sentry, Amplitude) | `src/services` |
| src/providers | Code | Global context providers | `src/providers` |
| src/utils | Code | Helper utilities | `src/utils` |
| src/i18n | Code | i18next configuration and translations | `src/i18n` |

> Note: The full AST-level knowledge graph (6,500+ nodes) is maintained in `graphify-out/` via the `graphify update .` CLI. This `.graphify/graph.md` represents the high-level domain structure of the target (`.`).
