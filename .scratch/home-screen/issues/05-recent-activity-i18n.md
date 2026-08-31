# 05 — Son Aktiviteler'de ham İngilizce slug ve en-US tarih

Status: done (2026-08-31)

## Çözüm

- "Son Aktiviteler" artık `exerciseRegistry.getByType(...).nameKey` üzerinden
  Türkçe ad gösteriyor ("Görsel Yönlendirici", "Schulte Tablosu"), ham slug yok.
- `textTransform="capitalize"` üç yerden de kalktı: ana sayfa, `StatisticsDashboard`
  egzersiz kırılımı (o da artık çeviriden geçiyor), egzersiz detay kategori satırı.
  Uygulamada kullanıcı-görünür Türkçe metinde `uppercase`/`capitalize` kalmadı.
- Tarih/saat tek yerden: `src/utils/datetime.ts` (`formatShortDate`,
  `formatDateTime`), `tr-TR` sabit. `WeeklySummaryCard` da oradan geçiyor;
  uygulamada iki tarih konvansiyonu kalmadı.
- Emülatörde doğrulandı: `20 Ağu 18:47`.

## Kasten yapılmadı

`StatisticsDashboard`'ın bar chart'ının X ekseni hâlâ ham `type` yazıyor —
oraya Türkçe adlar sığmıyor (eksen etiketi, liste değil). Ayrı bir tasarım
kararı.
Severity: P2
Blocked by: —

## Belirti

"Son Aktiviteler" bölümü (fold'un altında, tek kaydırma gerektiren bölüm)
egzersiz adlarını **ham id** olarak gösteriyor:

> Pacer · Scanning · Schulte · Comprehension-Speed

…ve tarihleri **en-US** formatında:

> 8/20/2026 6:47 PM

Aynı ekranın 500px yukarısında, günlük plan kartı aynı egzersizleri Türkçe
gösteriyor ("Görsel Yönlendirici", "Kelime Arama"). Tek ekranda iki dil, iki
tarih konvansiyonu.

## Kök neden

`src/app/(app)/(tabs)/index.tsx:110-111`

```tsx
<Text fontWeight="bold" textTransform="capitalize">{session.exerciseType}</Text>
<Text color="$color11" fontSize="$2">
  {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</Text>
```

1. `session.exerciseType` çeviriden geçmiyor, ham slug render ediliyor.
2. `textTransform="capitalize"` Türkçe metne uygulanmış — `DESIGN.md`'nin
   No-Caps Rule'u tam bunu yasaklıyor, çünkü locale-naive büyütme `i` → `I`
   yapıyor, Türkçe `İ` istiyor.
3. `toLocaleDateString()` / `toLocaleTimeString()` locale argümanı almıyor, cihaz
   locale'ini izliyor. `WeeklySummaryCard` aynı ekranda `'tr-TR'`'yi hardcode
   ediyor — iki farklı yaklaşım.

## Yapılacak

`DailyPlanCard.tsx:66` bunu zaten doğru yapıyor, aynı deseni uygula:

```tsx
const definition = exerciseRegistry.getByType(session.exerciseType);
// ...
{definition ? tExercises(definition.nameKey) : session.exerciseType}
```

- `textTransform="capitalize"` sil.
- Tarih/saat formatlamasını tek bir yerden geçir (küçük bir util veya i18n'in
  kendi formatlayıcısı), `'tr-TR'` ile. Uygulamada iki farklı tarih konvansiyonu
  kalmasın.

## Kabul kriteri

- Son Aktiviteler'de İngilizce slug yok.
- Tarihler Türkçe formatta ve uygulamanın geri kalanıyla tutarlı.
- Uygulamada `textTransform="uppercase"` veya `"capitalize"` taşıyan kullanıcı-
  görünür Türkçe metin kalmadı.
- `bun run i18n:check` geçiyor.
