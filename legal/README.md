# Legal site — privacy.dukeemree.xyz

The Privacy Policy and Terms of Service for the Hızlı Okuma app. Google Play
requires a publicly reachable Privacy Policy URL for the store listing, and
the app links both documents from Settings (`src/constants/legal.ts`).

Live at:

- <https://privacy.dukeemree.xyz/> — index
- <https://privacy.dukeemree.xyz/privacy> — Gizlilik Politikası / Privacy Policy
- <https://privacy.dukeemree.xyz/terms> — Kullanım Koşulları / Terms of Service

Both documents ship Turkish and English in the same HTML file, with a toggle.
The Turkish block is visible without JavaScript, so a store reviewer or a
crawler can always read the policy.

## Hosting

Cloudflare Workers, in the `dukeemree.xyz` zone (account
`Kozanfurkanemre@gmail.com's Account`). The custom domain and its DNS record
are already attached to the `hizli-okuma-legal` Worker.

## Deploying a change

```sh
cd legal
npx wrangler deploy
```

`wrangler.jsonc` serves `public/` as static assets and claims
`privacy.dukeemree.xyz` as a custom domain, so the files in `public/` are the
single source of truth.

> The version currently live was pushed through the Cloudflare API with the
> page content embedded in a Worker script, before this directory existed.
> The first `wrangler deploy` supersedes it with the static-asset version and
> that caveat stops applying — until then, editing `public/` alone does not
> change the live site.

## Keeping it accurate

These documents describe what the app actually does — the Amplitude event
list, the Sentry configuration, the RevenueCat data, the Android permissions
and the 6-month local retention window. If any of those change in the app,
update the corresponding section here and bump the "Last updated" date in
both language blocks.
