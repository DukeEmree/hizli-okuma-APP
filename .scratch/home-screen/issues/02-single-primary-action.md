# 02 — İki özdeş yeşil primary buton, ve alttaki yanlış yere gidiyor

Status: done (2026-08-31)

## Çözüm

- `WeeklySummaryCard`'ın boş durumundaki `Egzersize başla` butonu kaldırıldı;
  kart zaten `AppCard onPress` ile tıklanabilir bir yüzey. `weeklySummary.card.emptyCta`
  anahtarı silindi. Artık hiçbir buton gittiği yerden farklı bir şey vaat etmiyor.
- Ekranda tek dolu mineral yeşil buton kaldı: günlük planınki (emülatörde
  doğrulandı).
- Premium kartın iç içe `AppCard onPress` + `Button` ikilisi teke indi: buton
  yerine `ChevronRight`, kartın kendisi `accessibilityRole="button"` +
  birleşik etiket taşıyor. Kart ayrıca `$green3`/`$green7` call-site
  override'larından kurtuldu (DESIGN.md "Don't re-specify backgroundColor on a
  card at a call site").
Severity: P1
Blocked by: —

## Belirti

Ana ekranda iki tam genişlikte mineral yeşil primary buton var, ~500px arayla:

| Buton | Ölçülen bounds | Kaynak |
|---|---|---|
| `Başla` | `[94,897][985,1033]` | `DailyPlanCard.tsx` |
| `Egzersize başla` | `[94,1700][985,1826]` | `WeeklySummaryCard.tsx` (boş durum) |

`DESIGN.md` bunu açıkça yasaklıyor: *"Don't put more than one primary green
button in a screen region."* Ayrıca Scarcity Rule'u deliyor (ekranın renkli
piksel oranı).

**Daha kötüsü: alttaki buton yalan söylüyor.** Etiketi egzersiz vaat ediyor,
`onPress`'i `router.push('/(app)/weekly-summary')` — salt-okunur bir özet ekranı.

## Neden P1

Ölçülen ergonomi bunu kötüleştiriyor: 2400px'lik ekranda alttaki buton (y≈1700)
tek elle **daha kolay** ulaşılan konumda. Yani dikkati dağınık bir öğrenci, ders
arasında büyük yeşil slab'a basıyor, yapacak bir şeyi olmayan özet ekranına
düşüyor ve geri çıkmak zorunda kalıyor. PRODUCT.md İlke 1'in tam olarak
yasakladığı şey: ekran onun dakikasını kötüleştirdi.

## Yapılacak

- `WeeklySummaryCard`'ın boş durumundaki primary butonu **kaldır**. Başlatma
  affordance'ı zaten hemen üstünde (`DailyPlanCard` → `Başla`).
- Kart zaten `AppCard onPress` ile tıklanabilir bir yüzey; boş durumda da öyle
  kalsın.
- CTA gerçekten isteniyorsa: ghost/text buton, ve **gittiği yerin adıyla**
  etiketlensin ("Haftalık özeti gör"). i18n anahtarı güncellenmeli
  (`weeklySummary.card.emptyCta` şu an "Egzersize başla").
- Ekranda tek `theme="accent"` dolu buton kalmalı: günlük planınki.

## Kabul kriteri

- Ana ekranda aynı anda birden fazla dolu mineral yeşil buton yok.
- Hiçbir buton etiketi gittiği yerden farklı bir şey vaat etmiyor.
- Premium kartın iç içe geçmiş `AppCard onPress` + `Button` ikilisi de gözden
  geçirilmiş (ekran okuyucu aynı işi yapan iki bitişik hedef buluyor —
  bkz. `04`).
