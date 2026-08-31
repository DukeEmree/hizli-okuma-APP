# Ana Sayfa — kritik sonrası iyileştirme

Kaynak: `/impeccable critique src/app/(app)/(tabs)/index.tsx`, 2026-08-30.
Yöntem: iki bağımsız değerlendirme (tasarım incelemesi + canlı emülatör ölçümü).
Puan: **16/40 (Poor)**. Tam rapor: `.impeccable/critique/2026-08-30T18-10-21Z__src-app-app-tabs-index-tsx.md`
(not: `.impeccable/` gitignore'da, rapor yalnızca yerelde durur — bu dosya kalıcı özet).

## Karar: sınav çerçevesi uygulama içine giriyor

PRODUCT.md'de "açık karar" olarak duran madde **kapandı**: mağaza listelemesindeki
YKS/LGS/ALES konumlandırması artık uygulama içine de inecek. Bu kritiğin en büyük
bulgusuydu — ekran hiçbir yerde sınavdan, paragraftan veya öğrencinin takviminden
bahsetmiyor; mağaza vaadi uygulamanın karşılamadığı bir çek yazıyor.

Bunun somut karşılığı `02` ve `03` numaralı ticket'larda.

## Ekranın bugünkü durumu — değişmemesi gerekenler

Kritiğin doğruladığı ve korunacak olanlar:

- **Track** (`src/components/ui/track/Track.tsx`) — sistemin signature component'i.
  Çubuk yüksekliği = hız, mineral dolgu = kavrama, altındaki ember pip şeridi = streak.
  Eksen/legend/tooltip eklenmeyecek (`DESIGN.md` → "The Square Baseline Rule").
- **`AppCard`** — light/dark derinlik ayrımı. Çağrı yerlerinde `borderWidth`/`borderColor`/
  `backgroundColor`/`elevation` yeniden tanımlanmayacak.
- **Dört adımlık plan kartı** — doğru primitif. "4 egzersiz, yaklaşık 12 dk" kararı
  kullanıcı vermeden önce fiyatlıyor.
- **Ölçülen ve geçen değerler:** tüm dokunma hedefleri ≥48dp (en küçüğü tam 48.0dp),
  tüm metin/zemin çiftleri iki temada da WCAG AA geçiyor (light 5.10–18.37:1,
  dark 5.94–15.03:1). Bunları bozma.

## Ticket sırası

`01` → `02` → `03` → `04` → `05`. Numara sırası uygulama sırasıdır.

Kritikteki önem sırası P0 → P1 ×3 → P2 idi; burada tek bir yer değiştirme var:
**iki-yeşil-buton sorunu (`02`), bugün-satırı yeniden kurgusundan (`03`) önce geliyor.**
Sebep: `03` ana ekranın kompozisyonunu yeniden kuruyor ve tek bir primary eylem
varsayımı üzerine oturuyor; `02` çözülmeden `03`'ü yapmak aynı hiyerarşi kararını
iki kez vermek olur.

| # | Ticket | Severity | Bağımlılık | Durum |
|---|---|---|---|---|
| 01 | `01-daily-plan-duplicate-step.md` | P0 | — | ✅ 2026-08-31 |
| 02 | `02-single-primary-action.md` | P1 | — | ✅ 2026-08-31 |
| 03 | `03-today-answer-and-exam-framing.md` | P1 | 02 | ✅ 2026-08-31 |
| 04 | `04-font-scale-and-accessibility.md` | P1 | 03 | ✅ 2026-08-31 |
| 05 | `05-recent-activity-i18n.md` | P2 | — | ✅ 2026-08-31 |

Beşi de sırayla uygulandı. `bun run typecheck`, `bun run lint`, `bun test`
(172 test) ve `bun run i18n:check` temiz; emülatörde (Pixel_7, light + dark,
`font_scale` 1.0 / 1.3 / 1.5) doğrulandı. Her ticket'ın kendi dosyasında
"## Çözüm" bölümü var.

## Her ticket için geçerli kabul kriteri

- `bun run typecheck`, `bun run lint`, `bun test`, `bun run i18n:check` temiz.
- Yeni hardcoded kullanıcı-görünür string yok.
- `DESIGN.md`'nin Do's and Don'ts listesi ihlal edilmiyor.
- Emülatörde doğrulandı (`adb -s <serial> shell screencap -p /sdcard/s.png` +
  `adb pull` — `exec-out screencap` bu emülatörde boş kare döndürüyor).
