# Hızlı Okuma

Türkçe, exercise tabanlı bir speed-reading / reading-skills uygulaması. React
Native + Expo, tamamen local-only (backend veya üyelik yok, tüm veri MMKV +
Zustand ile cihazda tutuluyor), abonelikler RevenueCat üzerinden.

Detaylı mimari ve geliştirme kuralları için:

- [`AGENTS.md`](./AGENTS.md) — kurallar, mimari, kod stili
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — mevcut durum, tamamlanan işler, açık konular
- [`RELEASE_TODO.md`](./RELEASE_TODO.md) — yayın öncesi kalan işler
- [`FEATURE_BACKLOG.md`](./FEATURE_BACKLOG.md) — planlanan özellikler
- [`BUGS.md`](./BUGS.md) — açık bug takibi

## Başlarken

Yalnızca **Bun** kullanılır — npm/yarn/pnpm yok.

```bash
bun install
bun start              # Expo dev server
bun run android         # Android'de çalıştır
bun run ios             # iOS'ta çalıştır
```

## Komutlar

```bash
bun run lint            # eslint
bun run typecheck       # tsc --noEmit
bun test                # bun test runner
bun run i18n:check      # i18n key kapsama kontrolü
```
