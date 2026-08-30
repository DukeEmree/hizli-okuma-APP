@AGENTS.md
@PROJECT_STATUS.md
@BUGS.md
@FEATURE_BACKLOG.md

# Hızlı Okuma Projesi

- Proje bir React Native / Expo projesidir. Backend veya üyelik (Clerk/Convex) yoktur. Tüm veriler lokalde MMKV ve Zustand ile tutulmaktadır.
- Projede sadece "Bun" paket yöneticisi kullanılır.
- Uygulama içi satın alımlar RevenueCat üzerinden yapılır.
- Tüm detaylı kurallar için her zaman `AGENTS.md` dosyasını referans al. Mevcut durum için `PROJECT_STATUS.md` dosyasını oku.

## Agent skills

### Issue tracker

Local markdown under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root (created lazily, not yet present). See `docs/agents/domain.md`.
