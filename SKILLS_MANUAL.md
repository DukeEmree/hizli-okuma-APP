# Hızlı Okuma — Antigravity & Agent Skills & MCP Kullanım Kılavuzu

Bu belge, **Hızlı Okuma** (`hizli-okuma`) projesinde tanımlı olan tüm **Ajan Becerileri (Skills)**, **MCP (Model Context Protocol) Sunucuları** ve bunların en verimli şekilde nasıl kullanılacağını açıklayan kapsamlı başvuru kılavuzudur.

---

## 1. Mimari ve Çalışma Mantığı

### Kademeli Yükleme (Progressive Disclosure)
Hızlı Okuma projesinde 90'ın üzerinde uzmanlaşmış beceri (skill) yer almaktadır. Sistem kaynaklarını ve token bütçesini optimize etmek için:
1. **Açılışta:** Ajan oturum açtığında tüm becerilerin yalnızca adları ve kısa açıklamaları hafızaya yüklenir.
2. **İhtiyaç Anında (On-Demand):** Siz ilgili alanda bir talepte bulunduğunuzda veya beceriyi açıkça çağırdığınızda, ajan `.agents/skills/<beceri>/SKILL.md` dosyasını okuyarak ilgili kuralları, tasarım kalıplarını ve yönergeleri uygulayacaktır.

---

## 2. Becerileri Tetikleme Yöntemleri

### Yöntem A: Doğrudan Beceri Adını Belirterek (En Kesin Yöntem)
İsteminizde (prompt) beceri adını açıkça yazarak ajanın o kural setine sadık kalmasını sağlayabilirsiniz:
> *"Schulte Tablosu egzersizi için `react-native-design` ve `mobile-design` becerilerini kullanarak 60 FPS akıcı geçiş animasyonları hazırla."*

### Yöntem B: Doğal Dil & Konu Odaklı Otomatik Tetikleme
Ajan, üzerinde çalıştığınız konuya göre uygun beceriyi otomatik olarak devreye alır:
* *"Egzersiz sırasındaki Zustand store durumunu ve AsyncStorage verilerini canlı oku."* → `buoy`
* *"RevenueCat ile aylık ve yıllık abonelik paywall ekranını tasarla."* → `revenuecat-paywall` & `revenuecat-purchase-flow`
* *"Egzersiz motoru için TDD ile testleri yaz ve timer temizliğini doğrula."* → `tdd` & `diagnosing-bugs`
* *"EAS ile Google Play Store için kapalı test derlemesi al."* → `eas-app-stores`

---

## 3. Beceri Kategorileri ve Referans Rehberi

### 📱 A. Mobil UI / UX & Tasarım Sistemleri

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `mobile-design` | Touch-first, Platform-Respectful (iOS / Android), 60 FPS, Thumb Zone, MFRI Risk Analizi ve mobil arayüz ergonomisi. | *"Hızlı okuma egzersiz ekranını `mobile-design` prensiplerine göre tasarla."* |
| `react-native-design` | React Native & Reanimated animasyonları, Gesture Handler, Native Look & Feel, Haptics ve Layout. | *"`react-native-design` kalıplarıyla kelime akışı (RSVP) için mikro animasyonlar ve haptic geri bildirim ekle."* |
| `ui-styling` | Erişilebilir bileşenler, Tamagui tema tokenları, modern layoutlar ve dark mode desteği. | *"`ui-styling` ile egzersiz sonuçları için modern ve temaya duyarlı bir özet kartı tasarla."* |
| `ui-ux-pro-max` | 67 UI stili, 161 renk paleti, 57 font eşleşmesi ve 99 UX kuralı içeren tasarım referansı. | *"`ui-ux-pro-max` rehberinden odaklanmayı artıran bir egzersiz renk paleti ve tipografisi seç."* |
| `design-system` | 3-katmanlı token mimarisi (Primitive → Semantic → Component) ve tutarlı tasarım dili. | *"Tasarım sistemimizi denetle ve Tamagui tokenlarını `design-system` ile doğrula."* |
| `design` | İkon tasarımı (SVG), kurumsal kimlik, egzersiz grafikleri ve görsel varlık üretimi. | *"`design` becerisiyle görme alanı genişletme egzersizleri için minimalist SVG ikonlar hazırla."* |
| `banner-design` | Google Play Store, App Store ve sosyal medya için kreatif banner tasarımları. | *"`banner-design` kullanarak Google Play Store özellik grafiği (feature graphic) konsepti çıkar."* |
| `brand` | Marka sesi, tonu, mesajlaşma çerçevesi ve görsel kimlik standartları. | *"`brand` kılavuzuna uygun onboarding karşılama metinleri ve motive edici bildirim dili yaz."* |
| `slides` | Proje yol haritası, sprint hedefleri veya özellik tanıtımı için Chart.js destekli HTML slaytlar. | *"`slides` becerisi ile Hızlı Okuma egzersiz modüllerini anlatan bir slayt oluştur."* |
| `uniwind` | Tailwind v4 ve modern CSS utility sınıfları desteği. | *"`uniwind` kurallarına göre yardımcı arayüz bileşenleri oluştur."* |

---

### 🚀 B. Expo Ekosistemi, Yönlendirme ve Cihaz Araçları

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `expo-router` | Expo Router dosya tabanlı yönlendirme (file-based routing), dinamik rotalar, nested stack/tabs ve layout yönetimi. | *"`expo-router` kullanarak egzersiz detay ekranına dinamik `[exerciseId]` rotası ekle."* |
| `expo-native-ui` | Apple HIG, Material Design, SF Symbols, Liquid Glass / Blur efektleri ve native kontroller. | *"`expo-native-ui` ile iOS için SF Symbols ve Glass Effect içeren başlık çubuğu yaz."* |
| `expo-data-fetching` | Network istekleri, önbellekleme (caching) ve offline veri desteği. | *"`expo-data-fetching` kalıplarıyla okuma metinlerini önbelleğe alan ve offline çalışan bir hook yaz."* |
| `expo-tailwind-setup` | Expo üzerinde Tailwind v4 / NativeWind yapılandırma rehberi. | *"`expo-tailwind-setup` kurallarına göre yapılandırmayı doğrula."* |
| `expo-dev-client` | Özel native modüller içeren development client derleme ve test akışları. | *"`expo-dev-client` ile yerel Android test derlemesini başlat."* |
| `expo-upgrade` | Expo SDK sürümlerini güvenle yükseltme (örn. SDK 56 → 57) ve bağımlılık çakışmalarını çözme. | *"`expo-upgrade` adımlarını takip ederek bağımlılıkları SDK 57 ile senkronize et."* |
| `expo-examples` | ~70 resmi Expo entegrasyon örneği ve kanonik kod şablonları. | *"`expo-examples` referansını kullanarak ses efektleri için expo-audio entegrasyonunu kur."* |
| `android-cli` | Android SDK, AVD emülatör yönetimi, ekran görüntüleri, UI denetimi ve logcat hata takibi. | *"`android-cli` ile bağlı emülatörde uygulamanın ekran görüntüsünü al ve UI ağacını incele."* |
| `migrate-to-strict-api` | React Native 0.86+ Strict TypeScript API göçü ve tip güvenliği sağlama. | *"`migrate-to-strict-api` ile derin react-native importlarını kök importlara dönüştür."* |
| `upgrade-react-native` | React Native sürüm yükseltme ve breaking change yönetimi. | *"`upgrade-react-native` ile son RN sürümündeki değişiklikleri incele."* |
| `react-i18next` | Çok dilli uygulama mimarisi, çeviri anahtarları ve dinamik dil değişimi. | *"`react-i18next` ile egzersiz bitiş ekranına Türkçe ve İngilizce dil desteği ekle."* |

---

### 📦 C. Dağıtım, Sürümleme ve EAS (Expo Application Services)

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `eas-app-stores` | Google Play Store ve Apple App Store derleme (`eas build`), mağazaya gönderme (`eas submit`), TestFlight ve ASO mağaza meta verileri. | *"`eas-app-stores` kurallarına göre `eas.json` üretim profilini hazırla ve versiyonu güncelle."* |
| `eas-workflows` | `.eas/workflows/` altında GitHub Actions benzeri bulut CI/CD otomasyonları yazma. | *"`eas-workflows` ile her ana dala push atıldığında otomatik önizleme derlemesi alan workflow yaz."* |
| `eas-update-insights` | EAS OTA (Over-The-Air) güncelleme sağlığı, kaza oranları ve sürüm dağılımı analizi. | *"`eas-update-insights` ile son yayınlanan OTA güncellemesinin hata oranını raporla."* |
| `eas-observe` | Soğuk/sıcak açılış süresi, TTR, TTI ve rota bazlı performans metriklerini izleme. | *"`eas-observe` entegrasyonuyla egzersiz ekranı açılış süresini (TTI) ölç."* |

---

### 🔍 D. Canlı Denetim, Hata Ayıklama & Telemetri (Buoy & Sentry)

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `buoy` | Canlı çalışan React Native uygulamasından Zustand state'i, Network trafiği, AsyncStorage/MMKV ve Console loglarını anlık denetleme. | *"`buoy` triage çağrısı yap ve aktif egzersiz durumundaki Zustand state'ini kontrol et."* |
| `buoy-optimize` | Render sürelerini (`measure_renders`), JS thread darboğazlarını tespit etme ve performans optimizasyonu. | *"`buoy-optimize` ile Schulte tablosu ekranının gereksiz render sayılarını analiz et."* |
| `sentry-react-native-sdk` | React Native ve Expo için eksiksiz Sentry kurulumu, Tracing, Profiling ve Breadcrumb ayarları. | *"`sentry-react-native-sdk` kurallarına uygun olarak global error boundary ve tracing yapılandır."* |
| `sentry-fix-issues` | Sentry MCP üzerinden gelen canlı prod hatalarını, stack trace ve breadcrumb'ları inceleyip çözme. | *"`sentry-fix-issues` ile son 24 saatte oluşan egzersiz oturumu hatalarını incele ve düzelt."* |
| `diagnosing-bugs` | Zorlu ve tekrarlanamayan hatalar için kök neden teşhis döngüsü. | *"`diagnosing-bugs` metodolojisini kullanarak egzersiz zamanlayıcısındaki hafıza sızıntısını bul."* |

---

### 💳 E. Gelir & Abonelik Yönetimi (RevenueCat Suite)

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `integrate-revenuecat` / `revenuecat` | RevenueCat SDK kurulumu, entitlement'lar, API anahtarları ve genel yapılandırma. | *"`integrate-revenuecat` rehberine göre RevenueCat SDK'sını başlat ve kullanıcı durumunu dinle."* |
| `revenuecat-paywall` | Dinamik paywall UI, paket listeleme, indirim ve deneme süresi sunumları. | *"`revenuecat-paywall` becerisini kullanarak Hızlı Okuma Pro üyeliği için şık bir paywall ekranı kodla."* |
| `revenuecat-purchase-flow` | Satın alma, satın almayı geri yükleme (restore purchases) ve kullanıcı deneyimi akışları. | *"`revenuecat-purchase-flow` ile güvenli ve kullanıcı dostu bir satın alma butonu yaz."* |
| `rc-catalog-management` | Google Play Store ve App Store ürün katalogları. **Kritik Kural:** Google Play için `productId:basePlanId` formatı. | *"`rc-catalog-management` ile Play Store aylık ve yıllık abonelik kimliklerini yapılandır."* |
| `rc-error-handling` | Ödeme iptali, yetersiz bakiye, ağ hatası gibi RevenueCat hata kodlarının zarifçe yönetilmesi. | *"`rc-error-handling` ile kullanıcı ödemeyi iptal ettiğinde veya kart reddedildiğinde uygun mesajları göster."* |
| `revenuecat-entitlements-gate` | Premium egzersizler ve gelişmiş istatistikler için entitlement kilit mekanizmaları. | *"`revenuecat-entitlements-gate` ile 'pro_access' yetkisi olmayan kullanıcıları paywall'a yönlendiren hook yaz."* |
| `revenuecat-customer-center` | Kullanıcıların aboneliklerini yönetebileceği, iptal veya plan değişikliği yapabileceği Müşteri Merkezi. | *"`revenuecat-customer-center` ile ayarlar ekranına abonelik yönetim menüsü ekle."* |
| `revenuecat-testing-setup` | Sandbox kullanıcıları, StoreKit konfigürasyonu ve test kartlarıyla satın alma testleri. | *"`revenuecat-testing-setup` ile Android ve iOS sandbox test adımlarını hazırla."* |

---

### 🛡️ F. Yazılım Mimarisi, Güvenlik & Mühendislik Kalitesi

| Beceri Adı | Açıklama ve Kullanım Alanı | Örnek Prompt |
| :--- | :--- | :--- |
| `codebase-design` | Deep Modules mimarisi, net modül sınırları, katman ayrımı (Domain/Data/UI) ve test edilebilirlik. | *"`codebase-design` ilkelerine göre egzersiz motorunu UI bileşenlerinden tamamen izole et."* |
| `impeccable` | First Principles ile mimari sadeleştirme, gereksiz soyutlamaları ve "AI slop" kalıplarını temizleme. | *"`impeccable` ile `src/features/exercise` dizinini sadeleştir ve gereksiz hookları birleştir."* |
| `karpathy-guidelines` | Surgical (nokta atışı) kod değişiklikleri, yan etkisiz refactoring ve doğrulanabilir başarı kriterleri. | *"`karpathy-guidelines` kurallarına uyarak yalnızca ilgili bug'ı çözen minimal bir diff oluştur."* |
| `security-review` | Cihaz içi veri saklama güvenliği, API anahtarları koruması ve veri sızıntısı önleme. | *"`security-review` ile MMKV ve RevenueCat anahtarlarının istemci tarafında sızdırılmadığını denetle."* |
| `tdd` | Test-Driven Development: Önce testleri yazma (Kırmızı) → Kodu yazma (Yeşil) → Refaktör. | *"`tdd` ile WPM (kelime/dakika) hesaplama motoru için önce Bun testlerini yaz, sonra fonksiyonu uygula."* |
| `code-review` | Kod değişikliklerini hem standartlar hem de iş mantığı açısından çift yönlü denetleme. | *"`code-review` ile son yaptığımız commit'leri performans ve kaynak temizliği (cleanup) açısından incele."* |
| `graphify` | Kod tabanının AST ve bilgi grafiğini çıkarma, karmaşık bağımlılıkları sorgulama. | *"`graphify` ile egzersiz motorunda rol oynayan tüm dosya ve fonksiyon ilişkilerini haritalandır."* |
| `grill-me` / `grilling` | Mimari kararları, egzersiz modellerini ve yeni özellikleri stres testine tabi tutma. | *"`grill-me` ile yeni Takistoskop egzersiz mimarisi planımı sorgula ve açıkları yüzüme vur."* |

---

## 4. MCP (Model Context Protocol) Sunucuları Rehberi

Hızlı Okuma projesinde yapılandırılmış olan MCP sunucuları:

```json
// .mcp.json / .cursor/mcp.json
{
  "mcpServers": {
    "buoy": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@buoy-gg/mcp@latest"],
      "env": { "BUOY_VERIFY": "auto" }
    },
    "sentry": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.sentry.dev/mcp"]
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### 1. Buoy MCP (Canlı Uygulama Denetimi)
* `get_triage`: Tek çağrıda bağlı cihazı, son console hatalarını, network isteklerini ve ekrandaki görünümü döner.
* `get_zustand_state`: Canlı Zustand store durumunu okur veya aksiyon tetikler.
* `get_storage`: MMKV / AsyncStorage üzerinde saklanan kalıcı verileri okur ve değiştirir.
* `measure_renders`: Ekrandaki bileşenlerin render sürelerini ölçer.

### 2. Sentry MCP (Canlı Hata Takibi)
* `search_issues`: Üretim ortamında meydana gelen hataları arar.
* `analyze_issue_with_seer`: Hatanın kök nedenini yapay zeka ile analiz eder.
* `execute_sentry_tool`: Sentry olaylarını, stack trace ve breadcrumb verilerini çeker.

### 3. Context7 MCP (Güncel Dokümantasyon Sorgulama)
* `query-docs`: React 19, Expo SDK 57, Tamagui, Zustand ve RevenueCat kütüphanelerinin en güncel dökümanlarını anlık sorgular.

---

## 5. Hızlı Okuma Projesi Kritik Kuralları & İpuçları

1. **Egzersiz Yaşam Döngüsü & Kaynak Temizliği (Cleanup):**
   * Her egzersiz ekranı unmount olduğunda veya egzersiz bittiğinde; tüm `timer`, `interval`, `expo-audio` ses çalıcıları ve animasyonlar iptal edilmeli ve hafızadan silinmelidir.
2. **RevenueCat Ürün Kimliği:**
   * Google Play Console temel plan kimliği (Base Plan ID) RevenueCat'e `productId:basePlanId` şeklinde girilmelidir. Asla tahmin yürütmeyin.
3. **Guest-First & Local-Only Mimarisi:**
   * Uygulamada hesap açma veya backend bulunmaz. Tüm kullanıcı verisi ve ilerleme yerel olarak Zustand + MMKV üzerinde saklanır.
4. **Zustand State Seçicileri:**
   * `const wpm = useStore(state => state.wpm)` şeklinde seçici (selector) kullanarak tüm store'a gereksiz yere abone olunmamalıdır.
5. **Tamagui & Tema Desteği:**
   * Renkler doğrudan hardcoded verilmemeli, her zaman Tamagui tema tokenları (`$background`, `$color`, `$primary` vb.) kullanılmalıdır.

