import { DifficultyLevel } from "@/types/exercise";

export interface SentenceMemoryItem {
  id: string;
  sentence: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: DifficultyLevel;
}

export const sentenceMemoryItems: SentenceMemoryItem[] = [
  {
    id: 'sm-01',
    sentence: "Ahmet sabah erkenden trene binerek Ankara'ya gitti.",
    question: "Ahmet nereye gitti?",
    options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
    correctIndex: 0,
    difficulty: 1,
  },
  {
    id: 'sm-02',
    sentence: "Ayşe, kütüphaneden aldığı kitabı iki günde bitirdi.",
    question: "Ayşe kitabı nereden aldı?",
    options: ["Okuldan", "Kütüphaneden", "Arkadaşından", "Kitapçıdan"],
    correctIndex: 1,
    difficulty: 1,
  },
  {
    id: 'sm-03',
    sentence: "Masanın üzerindeki kırmızı elmayı kardeşim yedi.",
    question: "Elma ne renkti?",
    options: ["Yeşil", "Sarı", "Kırmızı", "Mor"],
    correctIndex: 2,
    difficulty: 1,
  },
  {
    id: 'sm-04',
    sentence: "Yağmur yağdığı için pikniği iptal etmek zorunda kaldılar.",
    question: "Piknik neden iptal edildi?",
    options: ["Hastalandılar", "Araba bozuldu", "Geç kaldılar", "Yağmur yağdı"],
    correctIndex: 3,
    difficulty: 2,
  },
  {
    id: 'sm-05',
    sentence: "Güneş doğarken kuşların cıvıltısı tüm ormanı sardı.",
    question: "Ormanı saran ses neydi?",
    options: ["Kuş cıvıltısı", "Rüzgar sesi", "Su sesi", "Yaprak hışırtısı"],
    correctIndex: 0,
    difficulty: 2,
  },
  {
    id: 'sm-06',
    sentence: "Öğretmen, sınava geç kalan öğrenciye ek süre vermeyi kabul etti.",
    question: "Öğretmen kime ek süre verdi?",
    options: ["Erken gelen öğrenciye", "Geç kalan öğrenciye", "Sınavı kaybedene", "Devamsız öğrenciye"],
    correctIndex: 1,
    difficulty: 3,
  },
  {
    id: 'sm-07',
    sentence: "Mutfaktaki dolabın en üst rafında unutulmuş bal kavanozunu annem buldu.",
    question: "Annem neyi buldu?",
    options: ["Bal kavanozunu", "Şeker kutusunu", "Reçel kavanozunu", "Un torbasını"],
    correctIndex: 0,
    difficulty: 3,
  },
  {
    id: 'sm-08',
    sentence: "Yorgun işçiler, uzun bir vardiyanın ardından otobüs durağında sessizce beklediler.",
    question: "İşçiler neyin ardından beklediler?",
    options: ["Kısa bir molanın", "Toplantının", "Uzun bir vardiyanın", "Yemek arasının"],
    correctIndex: 2,
    difficulty: 4,
  },
  {
    id: 'sm-09',
    sentence: "Deniz kenarındaki eski fener, fırtınalı gecelerde gemilere yol gösterirdi.",
    question: "Fener ne zaman gemilere yol gösterirdi?",
    options: ["Güneşli günlerde", "Sisli sabahlarda", "Sakin akşamlarda", "Fırtınalı gecelerde"],
    correctIndex: 3,
    difficulty: 4,
  },
  {
    id: 'sm-10',
    sentence: "Toplantıya geç kalan müdür, özür dilemek yerine hemen sunumuna başladı.",
    question: "Müdür özür dilemek yerine ne yaptı?",
    options: ["Toplantıyı iptal etti", "Hemen sunumuna başladı", "Yeniden özür diledi", "Toplantıyı erteledi"],
    correctIndex: 1,
    difficulty: 5,
  },
  {
    id: 'sm-11',
    sentence: "Küçük kız, kaybettiği oyuncağını bulmak için bütün bahçeyi tek tek aradı.",
    question: "Küçük kız neyi arıyordu?",
    options: ["Evcil hayvanını", "Bisikletini", "Kaybettiği oyuncağını", "Ayakkabısını"],
    correctIndex: 2,
    difficulty: 5,
  },
  {
    id: 'sm-12',
    sentence: "Şirketin yeni ürünü, beklenmedik bir teknik arıza yüzünden piyasaya bir hafta geç sürüldü.",
    question: "Ürün piyasaya neden geç sürüldü?",
    options: ["Talep azlığından", "Fiyat anlaşmazlığından", "İzin sorunlarından", "Teknik arızadan"],
    correctIndex: 3,
    difficulty: 6,
  },
  {
    id: 'sm-13',
    sentence: "Araştırmacılar, buzul altında milyonlarca yıldır donmuş halde kalan mikroorganizmalar keşfetti.",
    question: "Mikroorganizmalar nerede keşfedildi?",
    options: ["Okyanus tabanında", "Volkan kraterinde", "Buzul altında", "Mağara içinde"],
    correctIndex: 2,
    difficulty: 6,
  },
  {
    id: 'sm-14',
    sentence: "Mimarın önerdiği tasarım, hem maliyeti düşürüyor hem de binanın deprem dayanıklılığını artırıyordu.",
    question: "Önerilen tasarımın iki avantajı neydi?",
    options: ["Hız ve estetik", "Renk ve malzeme çeşitliliği", "Maliyet düşüşü ve deprem dayanıklılığı", "Işık ve havalandırma"],
    correctIndex: 2,
    difficulty: 7,
  },
  {
    id: 'sm-15',
    sentence: "Uzun süredir iletişimi kesik olan iki eski dost, tesadüfen aynı uçakta yan yana oturdu.",
    question: "İki eski dost nerede karşılaştı?",
    options: ["Bir düğünde", "Bir kafede", "Eski okullarında", "Aynı uçakta"],
    correctIndex: 3,
    difficulty: 7,
  },
  {
    id: 'sm-16',
    sentence: "Bilim insanları, iklim değişikliğinin kutup ayılarının avlanma alışkanlıklarını geri dönüşü olmayan biçimde değiştirdiğini açıkladı.",
    question: "İklim değişikliği neyi geri dönüşsüz biçimde değiştirdi?",
    options: ["Kutup ayılarının üreme döngüsünü", "Kutup ayılarının kürk rengini", "Kutup ayılarının avlanma alışkanlıklarını", "Kutup ayılarının göç güzergahını"],
    correctIndex: 2,
    difficulty: 8,
  },
  {
    id: 'sm-17',
    sentence: "Şirketin finans departmanı, üç ayrı ülkeden gelen faturaları uzlaştırırken döviz kuru farklılıklarından kaynaklanan bir tutarsızlık fark etti.",
    question: "Tutarsızlık neyden kaynaklanıyordu?",
    options: ["Vergi oranı farkından", "Personel eksikliğinden", "Fatura tarihi hatasından", "Döviz kuru farklılığından"],
    correctIndex: 3,
    difficulty: 9,
  },
  {
    id: 'sm-18',
    sentence: "Onlarca yıldır çözülemeyen matematik problemine, alanın dışından genç bir araştırmacının geliştirdiği alışılmadık bir yöntem sayesinde nihayet bir çözüm bulundu.",
    question: "Probleme çözümü kim buldu?",
    options: ["Alanın köklü bir uzmanı", "Bir yapay zeka sistemi", "Alanın dışından genç bir araştırmacı", "Uluslararası bir komite"],
    correctIndex: 2,
    difficulty: 10,
  },
];

export interface MainIdeaItem {
  id: string;
  paragraph: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: DifficultyLevel;
}

export const mainIdeaItems: MainIdeaItem[] = [
  {
    id: 'mi-01',
    paragraph: "Su içmek vücudumuz için çok önemlidir. Susadığımızda bol su içmeliyiz. Su, vücudumuzun düzgün çalışmasına yardımcı olur.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Su içmek vücut için önemlidir.", "Susamak kötü bir duygudur.", "Herkes aynı miktarda su içmelidir.", "Su sadece yaz aylarında içilmelidir."],
    correctIndex: 0,
    difficulty: 1,
  },
  {
    id: 'mi-02',
    paragraph: "Sabah kahvaltısı yapmak günü enerjik başlatır. Kahvaltı yapmayan çocuklar derste daha çabuk yorulur. Bu yüzden kahvaltı çok önemlidir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Çocuklar okula erken gitmelidir.", "Kahvaltı yapmak günü enerjik başlatır.", "Derste yorulmak normaldir.", "Kahvaltıda sadece süt içilmelidir."],
    correctIndex: 1,
    difficulty: 1,
  },
  {
    id: 'mi-03',
    paragraph: "Ağaçlar hava kirliliğini azaltır ve bize temiz oksijen sağlar. Şehirlerde daha fazla ağaç dikilmesi hem havayı temizler hem de sıcaklığı düşürür. Bu yüzden park ve bahçelere yeni ağaçlar dikilmelidir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Ağaçlar sadece gölge sağlar.", "Şehirlerde park olmamalıdır.", "Ağaçlar hava kalitesini ve şehir yaşamını iyileştirir.", "Ağaç dikmek pahalı bir iştir."],
    correctIndex: 2,
    difficulty: 2,
  },
  {
    id: 'mi-04',
    paragraph: "Spor yapmak sadece bedeni değil, ruh halini de olumlu etkiler. Düzenli egzersiz yapan kişiler kendilerini daha mutlu ve enerjik hisseder. Haftada birkaç kez yürüyüş yapmak bile fark yaratabilir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Spor sadece profesyoneller içindir.", "Düzenli egzersiz beden ve ruh sağlığına iyi gelir.", "Yürüyüş yapmak zaman kaybıdır.", "Mutlu olmak için spor şart değildir."],
    correctIndex: 1,
    difficulty: 2,
  },
  {
    id: 'mi-05',
    paragraph: "Uyku, fiziksel ve zihinsel sağlığımız için kritik bir öneme sahiptir. Düzenli ve yeterli uyumak, bağışıklık sistemini güçlendirir, hafızayı tazeler ve gün içindeki odaklanma süresini artırır. Uzmanlar, yetişkinlerin her gece en az yedi saat kesintisiz uyuması gerektiğini vurguluyor.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Yetişkinler en az 7 saat uyumalıdır.", "Düzenli uyku sağlığımız için vazgeçilmezdir.", "Uyku bağışıklık sistemini güçlendirir.", "Odaklanmak için uyumak gerekir."],
    correctIndex: 1,
    difficulty: 3,
  },
  {
    id: 'mi-06',
    paragraph: "Teknoloji, hayatımızı pek çok yönden kolaylaştırmasına rağmen, yanlış kullanımı ciddi sorunlara yol açabilir. Ekran karşısında geçirilen uzun saatler, hem göz sağlığını olumsuz etkiler hem de sosyal ilişkileri zayıflatır. Bu nedenle, teknolojik aletleri bilinçli ve sınırlı kullanmak büyük önem taşır.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Ekran başında uzun süre kalmak gözü bozar.", "Teknoloji hayatımızı kolaylaştıran bir araçtır.", "Teknolojik cihazlar bilinçli ve kontrollü kullanılmalıdır.", "Sosyal ilişkiler teknoloji yüzünden zayıflar."],
    correctIndex: 2,
    difficulty: 4,
  },
  {
    id: 'mi-07',
    paragraph: "Kitap okumak, sadece kelime dağarcığını zenginleştirmekle kalmaz, aynı zamanda empati yeteneğini de geliştirir. Farklı karakterlerin yaşamlarına tanık olmak, dünyaya farklı pencerelerden bakmamızı sağlar. Düzenli okuma alışkanlığı olan bireylerin, sosyal hayatta daha anlayışlı oldukları gözlemlenmiştir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Kitap okumak insanın kelime dağarcığını geliştirir.", "Farklı karakterler empati kurmayı kolaylaştırır.", "Düzenli okumak empati ve anlayışı artırır.", "Kitap okuyanlar sosyal hayatta daha mutludur."],
    correctIndex: 2,
    difficulty: 4,
  },
  {
    id: 'mi-08',
    paragraph: "Sosyal medya, insanları birbirine bağlarken bazen yanlış bilgilerin hızla yayılmasına da neden olabiliyor. Bir haberin doğruluğunu kontrol etmeden paylaşmak, toplumda yanlış algıların oluşmasına yol açabilir. Bu yüzden bilgi paylaşmadan önce kaynağını doğrulamak büyük önem taşır.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Sosyal medya kullanmak zararlıdır.", "Haberler her zaman doğrudur.", "Paylaşım öncesi bilgiyi doğrulamak toplumsal yanlış algıları önler.", "Kaynak kontrolü sadece gazetecilerin işidir."],
    correctIndex: 2,
    difficulty: 5,
  },
  {
    id: 'mi-09',
    paragraph: "Uzun süre aynı pozisyonda oturarak çalışmak, zamanla omurga ve boyun ağrılarına yol açabilir. Uzmanlar, her saat başı birkaç dakika ayağa kalkıp esneme hareketleri yapılmasını öneriyor. Bu basit alışkanlık, masa başı çalışanların uzun vadeli sağlığını korumasına yardımcı olabilir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Masa başı iş yapmak tamamen bırakılmalıdır.", "Kısa aralıklarla hareket etmek masa başı çalışanların sağlığını korur.", "Boyun ağrısı sadece yaşlılarda görülür.", "Esneme hareketleri sadece sporcular içindir."],
    correctIndex: 1,
    difficulty: 5,
  },
  {
    id: 'mi-10',
    paragraph: "Geri dönüşüm, doğal kaynakların daha verimli kullanılmasını sağlar ve çöp miktarını azaltır. Ancak geri dönüşümün etkili olabilmesi için atıkların doğru şekilde ayrıştırılması gerekir. Yanlış ayrıştırılan atıklar, geri dönüşüm tesislerinde ek maliyet ve zaman kaybına neden olur.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Geri dönüşüm hiçbir zaman işe yaramaz.", "Doğru ayrıştırma yapılmadan geri dönüşümün verimi düşer.", "Çöp miktarı azaltılamaz.", "Geri dönüşüm sadece plastik için geçerlidir."],
    correctIndex: 1,
    difficulty: 6,
  },
  {
    id: 'mi-11',
    paragraph: "Uykusuzluk, sadece yorgunluğa değil, aynı zamanda karar verme becerisinin zayıflamasına da yol açabilir. Araştırmalar, yeterince uyumayan kişilerin risk değerlendirmesinde daha fazla hata yaptığını gösteriyor. Bu nedenle önemli kararlar almadan önce dinlenmiş olmak akıllıca bir tercihtir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Uykusuzluk sadece fiziksel yorgunluk yaratır.", "Önemli kararlar sabah alınmalıdır.", "Yetersiz uyku karar verme becerisini de olumsuz etkiler.", "Herkesin uyku ihtiyacı aynıdır."],
    correctIndex: 2,
    difficulty: 6,
  },
  {
    id: 'mi-12',
    paragraph: "Yapay zeka sistemleri, büyük veri kümelerinden öğrenerek insan benzeri kararlar verebilse de, bu kararların arkasındaki mantığı her zaman açıklayamayabilir. Bu şeffaflık eksikliği, özellikle sağlık ve hukuk gibi hassas alanlarda güven sorunlarına yol açabilir. Bu yüzden açıklanabilir yapay zeka üzerine araştırmalar hız kazanmıştır.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Yapay zeka her zaman kararlarını açıklayabilir.", "Yapay zekanın karar mantığındaki şeffaflık eksikliği hassas alanlarda güven sorunu yaratabilir.", "Yapay zeka sadece teknoloji şirketlerinde kullanılır.", "Büyük veri kümeleri gereksizdir."],
    correctIndex: 1,
    difficulty: 7,
  },
  {
    id: 'mi-13',
    paragraph: "Küresel tedarik zincirlerindeki küçük bir aksaklık, farklı kıtalardaki üretim hatlarını etkileyebilir. Bir limandaki gecikme, binlerce kilometre uzaktaki bir fabrikanın üretimini durdurabilir. Bu birbirine bağlılık, şirketleri tedarik kaynaklarını çeşitlendirmeye yöneltmiştir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Tedarik zincirleri birbirinden tamamen bağımsızdır.", "Limanlardaki gecikmeler önemsizdir.", "Küresel tedarik zincirlerindeki birbirine bağlılık şirketleri kaynak çeşitlendirmeye itiyor.", "Üretim hatları hiçbir zaman etkilenmez."],
    correctIndex: 2,
    difficulty: 7,
  },
  {
    id: 'mi-14',
    paragraph: "Bir dilin yok olması, sadece kelimelerin değil, o dile özgü düşünme biçimlerinin ve kültürel belleğin de kaybolması anlamına gelir. Dilbilimciler, dünya genelinde konuşulan dillerin önemli bir kısmının bu yüzyıl içinde yok olma riski taşıdığını belirtiyor. Bu kayıpları önlemek için yerel dillerin belgelenmesi ve genç nesillere aktarılması kritik önem taşıyor.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Diller sadece iletişim aracıdır ve kaybı önemsizdir.", "Bir dilin yok olması kültürel belleğin de kaybı anlamına gelir, bu yüzden belgeleme önemlidir.", "Tüm diller aynı hızda yok olma riskiyle karşı karşıyadır.", "Yerel diller genç nesiller tarafından zaten korunmaktadır."],
    correctIndex: 1,
    difficulty: 8,
  },
  {
    id: 'mi-15',
    paragraph: "Bir şirketin kısa vadeli kârlılığa odaklanması, uzun vadeli yenilikçilik kapasitesini zayıflatabilir. Araştırma ve geliştirmeye yatırım yapmayan şirketler, rakipleri yeni teknolojiler geliştirdiğinde geride kalma riskiyle karşılaşır. Bu nedenle sürdürülebilir büyüme, kısa vadeli kâr ile uzun vadeli yatırım arasında denge kurmayı gerektirir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Kısa vadeli kâr her zaman en doğru stratejidir.", "Araştırma geliştirme yatırımları gereksizdir.", "Sürdürülebilir büyüme kısa vadeli kâr ile uzun vadeli yatırım dengesini gerektirir.", "Rakipler asla yeni teknoloji geliştiremez."],
    correctIndex: 2,
    difficulty: 8,
  },
  {
    id: 'mi-16',
    paragraph: "Bir ekosistemdeki tek bir türün yok olması, ilk bakışta önemsiz görünse de, besin zincirindeki diğer türler üzerinde beklenmedik ve kademeli etkiler yaratabilir. Bilim insanları buna 'basamaklı etki' adını veriyor. Bu nedenle koruma çalışmaları, sadece nesli tükenmekte olan türlere değil, tüm ekosistemin dengesine odaklanmalıdır.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Tek bir türün kaybı ekosistemi hiç etkilemez.", "Koruma çalışmaları sadece popüler türlere odaklanmalıdır.", "Bir türün kaybı ekosistemde basamaklı, beklenmedik etkiler yaratabileceğinden koruma bütüncül olmalıdır.", "Basamaklı etki sadece deniz ekosistemlerinde görülür."],
    correctIndex: 2,
    difficulty: 9,
  },
  {
    id: 'mi-17',
    paragraph: "Merkez bankalarının faiz oranlarını değiştirmesi, sadece borç alan ve veren kurumları değil, döviz kurlarından konut fiyatlarına kadar geniş bir ekonomik ağı etkiler. Bu kararların etkileri genellikle aylar sonra tam olarak ortaya çıkar, bu da politika yapıcıların kararlarını belirsizlik içinde almasına neden olur. Bu gecikmeli etki, ekonomi yönetimini karmaşık bir denge sanatına dönüştürür.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Faiz kararlarının etkisi anında ve tek bir alanda görülür.", "Merkez bankası kararları geniş bir ekonomik ağı gecikmeli olarak etkiler ve bu belirsizlik yaratır.", "Döviz kurları faiz oranlarından etkilenmez.", "Politika yapıcılar her zaman kesin sonuçlarla karar alır."],
    correctIndex: 1,
    difficulty: 9,
  },
  {
    id: 'mi-18',
    paragraph: "Bilimsel bir teorinin geçerliliği, onu destekleyen kanıtların sayısından çok, onu çürütmeye yönelik ciddi girişimlere ne kadar dayanıklı olduğuyla ölçülür. Bir teori, kendisini test etmeye çalışan her yeni deneyden sağlam çıktıkça bilimsel topluluk nezdinde güvenilirlik kazanır; ancak bu güvenilirlik hiçbir zaman mutlak kesinliğe dönüşmez, çünkü gelecekte ortaya çıkacak tek bir çürütücü kanıt teoriyi yeniden gözden geçirmeye zorlayabilir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Bir teori ne kadar çok kanıtla desteklenirse o kadar kesin kabul edilir.", "Bilimsel teoriler asla değişmez.", "Bir teorinin gücü, çürütme girişimlerine karşı gösterdiği dayanıklılıktan gelir ve kesinlik asla mutlak değildir.", "Çürütücü kanıtlar bilim tarihinde hiç ortaya çıkmamıştır."],
    correctIndex: 2,
    difficulty: 10,
  },
];

export interface KeywordItem {
  id: string;
  paragraph: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: DifficultyLevel;
}

export const keywordItems: KeywordItem[] = [
  {
    id: 'kw-01',
    paragraph: "Bugün hava çok güzeldi. Öğleden sonra parka gidip biraz yürüyüş yaptım. Parkta çok sayıda köpek vardı, hepsi neşeyle koşuşturuyordu.",
    question: "Metinde geçen hayvan hangisidir?",
    options: ["Kedi", "Kuş", "Köpek", "At"],
    correctIndex: 2,
    difficulty: 1,
  },
  {
    id: 'kw-02',
    paragraph: "Yaz tatilinde Antalya'ya gitmeyi planlıyoruz. Orada denize girecek, bol bol güneşlenecek ve tarihi yerleri gezeceğiz.",
    question: "Metinde hangi şehirden bahsediliyor?",
    options: ["İzmir", "Antalya", "Muğla", "Aydın"],
    correctIndex: 1,
    difficulty: 2,
  },
  {
    id: 'kw-03',
    paragraph: "Pazar sabahı kahvaltıda yumurta, peynir, zeytin ve taze sıkılmış portakal suyu vardı. Ailecek uzun süre masadan kalkmadık.",
    question: "Kahvaltıda hangi içecek vardı?",
    options: ["Çay", "Kahve", "Portakal Suyu", "Süt"],
    correctIndex: 2,
    difficulty: 2,
  },
  {
    id: 'kw-04',
    paragraph: "Bahçede kırmızı güller ve sarı papatyalar açmıştı. Arılar çiçekten çiçeğe uçuyordu.",
    question: "Metinde hangi böcek geçmektedir?",
    options: ["Kelebek", "Arı", "Karınca", "Sinek"],
    correctIndex: 1,
    difficulty: 1,
  },
  {
    id: 'kw-05',
    paragraph: "Okulun bahçesinde düzenlenen kermeste öğrenciler el yapımı takılar, resimler ve kitaplar sattı. Toplanan gelir, kütüphaneye yeni kitaplar almak için kullanılacaktı.",
    question: "Kermesten toplanan gelir ne için kullanılacaktı?",
    options: ["Yeni sıralar almak için", "Kütüphaneye kitap almak için", "Spor malzemesi almak için", "Bahçe düzenlemesi için"],
    correctIndex: 1,
    difficulty: 3,
  },
  {
    id: 'kw-06',
    paragraph: "Dedem her sabah bahçedeki elma ağaçlarını sular, ardından tavuklara yem verirdi. Öğleden sonra ise komşularıyla çay içip sohbet ederdi.",
    question: "Dedem sabahları hangi hayvanlara yem verirdi?",
    options: ["Koyunlara", "Tavuklara", "Keçilere", "Ördeklere"],
    correctIndex: 1,
    difficulty: 3,
  },
  {
    id: 'kw-07',
    paragraph: "Fabrikada üretilen ayakkabılar, kalite kontrolden geçtikten sonra büyük kamyonlarla şehir dışındaki depoya, oradan da mağazalara gönderiliyordu.",
    question: "Ayakkabılar kalite kontrolden sonra ilk nereye gönderiliyordu?",
    options: ["Doğrudan mağazalara", "Şehir dışındaki depoya", "Fabrika reyonuna", "Limana"],
    correctIndex: 1,
    difficulty: 4,
  },
  {
    id: 'kw-08',
    paragraph: "Doktor, hastaya düzenli yürüyüş yapmasını, tuzlu yiyeceklerden uzak durmasını ve her gün bol su içmesini önerdi.",
    question: "Doktor hastaya hangi besinden uzak durmasını söyledi?",
    options: ["Şekerli", "Tuzlu", "Yağlı", "Baharatlı"],
    correctIndex: 1,
    difficulty: 4,
  },
  {
    id: 'kw-09',
    paragraph: "Arkeologlar, kazı alanında bulunan seramik parçalarının, bölgede daha önce hiç rastlanmamış bir uygarlığa ait olabileceğini düşünüyordu.",
    question: "Arkeologlar hangi buluntuyu incelediler?",
    options: ["Metal aletleri", "Seramik parçalarını", "Taş yazıtları", "Kemik kalıntılarını"],
    correctIndex: 1,
    difficulty: 5,
  },
  {
    id: 'kw-10',
    paragraph: "Konser öncesi teknik ekip, ses sistemini test etti, sahne ışıklarını ayarladı ve son olarak enstrümanların akordunu kontrol etti.",
    question: "Teknik ekip son olarak neyi kontrol etti?",
    options: ["Ses sistemini", "Sahne ışıklarını", "Enstrümanların akordunu", "Bilet girişini"],
    correctIndex: 2,
    difficulty: 5,
  },
  {
    id: 'kw-11',
    paragraph: "Şehir merkezindeki eski tramvay hattı, yıllar süren restorasyon çalışmalarının ardından turistik bir gezi güzergahı olarak yeniden hizmete açıldı.",
    question: "Eski tramvay hattı yeniden ne amaçla açıldı?",
    options: ["Toplu taşıma için", "Turistik gezi güzergahı için", "Yük taşımacılığı için", "Fuar alanı için"],
    correctIndex: 1,
    difficulty: 6,
  },
  {
    id: 'kw-12',
    paragraph: "Meteoroloji uzmanları, sahil kesimlerinde kuvvetli rüzgar ve yüksek dalga beklendiğini, balıkçıların denize açılmaması gerektiğini duyurdu.",
    question: "Uzmanlar balıkçılara ne önerdi?",
    options: ["Erken denize açılmalarını", "Denize açılmamalarını", "Limanda beklemelerini", "Ağlarını değiştirmelerini"],
    correctIndex: 1,
    difficulty: 6,
  },
  {
    id: 'kw-13',
    paragraph: "Şirketin ar-ge ekibi, pil ömrünü iki katına çıkaran yeni bir batarya teknolojisi geliştirdiğini, ancak seri üretime geçmenin en az iki yıl süreceğini açıkladı.",
    question: "Yeni teknolojinin seri üretime geçmesi ne kadar sürecek?",
    options: ["Altı ay", "Bir yıl", "İki yıl", "Beş yıl"],
    correctIndex: 2,
    difficulty: 7,
  },
  {
    id: 'kw-14',
    paragraph: "Orman yangınlarıyla mücadele eden ekipler, rüzgarın yön değiştirmesiyle birlikte söndürme stratejisini son anda değiştirmek zorunda kaldı.",
    question: "Ekipler stratejilerini neden değiştirdi?",
    options: ["Su kaynağı bittiği için", "Rüzgarın yön değiştirmesiyle", "Ekip sayısının azalmasıyla", "Gece olmasıyla"],
    correctIndex: 1,
    difficulty: 7,
  },
  {
    id: 'kw-15',
    paragraph: "Genetik araştırmacılar, nadir görülen bir hastalığın altında yatan mutasyonu tespit etmek için binlerce hasta örneğini karşılaştırmalı olarak inceledi.",
    question: "Araştırmacılar neyi tespit etmeye çalıştı?",
    options: ["Hastalığın yaygınlığını", "Hastalığın altında yatan mutasyonu", "Tedavi maliyetini", "Hastaların yaş ortalamasını"],
    correctIndex: 1,
    difficulty: 8,
  },
  {
    id: 'kw-16',
    paragraph: "Uluslararası uzay istasyonundaki mürettebat, mikroyerçekimi ortamında bitki büyümesini incelemek amacıyla haftalarca süren bir deney yürüttü.",
    question: "Mürettebat neyi incelemek istedi?",
    options: ["Suyun kaynama noktasını", "Mikroyerçekiminde bitki büyümesini", "Yıldızların hareketini", "Radyasyon seviyesini"],
    correctIndex: 1,
    difficulty: 8,
  },
  {
    id: 'kw-17',
    paragraph: "Merkez bankasının beklenmedik faiz kararı sonrası döviz piyasalarında ani dalgalanmalar yaşandı; analistler bu hareketi 'piyasa şaşkınlığı' olarak yorumladı.",
    question: "Analistler piyasa hareketini nasıl yorumladı?",
    options: ["Beklenen bir gelişme", "Piyasa şaşkınlığı", "Normal dalgalanma", "Uzun vadeli trend"],
    correctIndex: 1,
    difficulty: 9,
  },
  {
    id: 'kw-18',
    paragraph: "Derin öğrenme modellerinin eğitiminde kullanılan veri kümesindeki gizli önyargılar, modelin karar verme sürecine sızarak, geliştiricilerin fark etmediği sistematik hatalara yol açabiliyor.",
    question: "Metne göre modelin hatalarının kaynağı nedir?",
    options: ["Yetersiz işlemci gücü", "Veri kümesindeki gizli önyargılar", "Yazılım sürüm hatası", "İnternet bağlantı sorunu"],
    correctIndex: 1,
    difficulty: 10,
  },
];

export interface ComprehensionSpeedItem {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const comprehensionSpeedItems: ComprehensionSpeedItem[] = [
  {
    id: 'cs-01',
    text: "Tarihte bilinen ilk kütüphane, Asur kralı Asurbanipal tarafından M.Ö. 7. yüzyılda Ninova'da kurulmuştur. Bu kütüphane, on binlerce çivi yazılı kil tablet içeriyordu. Gılgamış Destanı'nın en eksiksiz kopyası da bu kütüphanede bulunmuştur. Asurbanipal, bilime ve edebiyata büyük önem veren bir hükümdardı.",
    difficulty: 5,
    questions: [
      {
        question: "İlk kütüphane hangi şehirde kurulmuştur?",
        options: ["Babil", "Ninova", "Sümer", "Uruk"],
        correctIndex: 1,
      },
      {
        question: "Kütüphanede bulunan eserler hangi malzemeye yazılmıştır?",
        options: ["Papirüs", "Kil tablet", "Parşömen", "Derin"],
        correctIndex: 1,
      },
      {
        question: "Hangi meşhur destanın kopyası burada bulunmuştur?",
        options: ["İlyada", "Gılgamış", "Odesa", "Yaratılış"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-02',
    text: "Kediler günün büyük bir bölümünü uyuyarak geçirir. Bir kedi günde ortalama on beş saat uyuyabilir. Uyumadıkları zamanlarda ise oyun oynamayı ve çevrelerini keşfetmeyi severler.",
    difficulty: 1,
    questions: [
      {
        question: "Kediler günde ortalama kaç saat uyur?",
        options: ["On saat", "On beş saat", "Yirmi saat", "Beş saat"],
        correctIndex: 1,
      },
      {
        question: "Kediler uyumadıkları zamanlarda ne yapmayı sever?",
        options: ["Sadece yemek yemeyi", "Oyun oynamayı ve keşfetmeyi", "Sürekli miyavlamayı", "Su içmeyi"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-03',
    text: "Bal arıları, çiçeklerden topladıkları nektarı kovana taşıyarak bal üretir. Bir kovanda binlerce arı birlikte çalışır. Her arının kovan içinde belirli bir görevi vardır: kimi nektar toplar, kimi kovanı korur, kimi de yavruları besler.",
    difficulty: 2,
    questions: [
      {
        question: "Arılar balı neyden üretir?",
        options: ["Sudan", "Nektardan", "Polenden", "Şekerden"],
        correctIndex: 1,
      },
      {
        question: "Metne göre arıların kovan içindeki görevleri nasıldır?",
        options: ["Herkes aynı işi yapar", "Her arının belirli bir görevi vardır", "Arılar görev değiştirmez", "Sadece kraliçe arı çalışır"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-04',
    text: "Piramitler, Antik Mısır'da firavunlar için mezar olarak inşa edilmiştir. En büyük piramit olan Keops Piramidi'nin yapımı yaklaşık yirmi yıl sürmüştür. Piramitlerin nasıl inşa edildiği konusunda bilim insanları arasında hâlâ tartışmalar sürmektedir.",
    difficulty: 3,
    questions: [
      {
        question: "Piramitler kimin için inşa edilmiştir?",
        options: ["Rahipler için", "Firavunlar için", "Askerler için", "Tüccarlar için"],
        correctIndex: 1,
      },
      {
        question: "Keops Piramidi'nin yapımı ne kadar sürmüştür?",
        options: ["On yıl", "Yirmi yıl", "Elli yıl", "Beş yıl"],
        correctIndex: 1,
      },
      {
        question: "Bilim insanları hangi konuda tartışmaktadır?",
        options: ["Piramitlerin yaşı", "Piramitlerin nasıl inşa edildiği", "Piramitlerin rengi", "Piramitlerin sayısı"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-05',
    text: "Amazon Yağmur Ormanları, dünyadaki oksijenin önemli bir kısmını üretir ve on binlerce bitki ve hayvan türüne ev sahipliği yapar. Ancak ormansızlaşma, bu kritik ekosistemi ciddi biçimde tehdit etmektedir. Her yıl futbol sahaları büyüklüğünde alanlar tarım ve hayvancılık için temizlenmektedir.",
    difficulty: 4,
    questions: [
      {
        question: "Amazon Ormanları neye ev sahipliği yapar?",
        options: ["Sadece kuşlara", "On binlerce bitki ve hayvan türüne", "Birkaç nadir türe", "Sadece ağaçlara"],
        correctIndex: 1,
      },
      {
        question: "Ormanı en çok ne tehdit etmektedir?",
        options: ["Deprem", "Ormansızlaşma", "Kuraklık", "Turizm"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-06',
    text: "Uyku sırasında beyin, gün içinde öğrenilen bilgileri pekiştirir ve gereksiz bağlantıları temizler. Bu süreç özellikle derin uyku evresinde yoğunlaşır. Yetersiz uyuyan kişilerde hafıza pekiştirme sürecinin aksadığı ve öğrenme performansının düştüğü gözlemlenmiştir. Bazı araştırmacılar, rüya görme evresinin de duygusal belleğin işlenmesinde rol oynadığını öne sürmektedir.",
    difficulty: 6,
    questions: [
      {
        question: "Beyin uyku sırasında ne yapar?",
        options: ["Sadece dinlenir", "Öğrenilen bilgileri pekiştirir", "Yeni bilgi üretir", "Vücut ısısını düzenler"],
        correctIndex: 1,
      },
      {
        question: "Hafıza pekiştirme süreci hangi uyku evresinde yoğunlaşır?",
        options: ["Hafif uyku", "Derin uyku", "Uyanıklık", "Rüya öncesi"],
        correctIndex: 1,
      },
      {
        question: "Bazı araştırmacılara göre rüya görme evresi neyle ilişkilidir?",
        options: ["Kas gelişimiyle", "Duygusal belleğin işlenmesiyle", "Sindirimle", "Vücut sıcaklığıyla"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-07',
    text: "Şehir planlamacıları, artan nüfusla birlikte trafik sıkışıklığını azaltmak için toplu taşıma ağlarını genişletmenin yeterli olmadığını, aynı zamanda insanları yaya ve bisiklet kullanımına teşvik eden altyapı yatırımlarının da gerekli olduğunu savunuyor. Bazı Avrupa şehirlerinde uygulanan bu yaklaşım, hem hava kalitesini iyileştirmiş hem de merkez bölgelerdeki araç yoğunluğunu belirgin biçimde azaltmıştır.",
    difficulty: 7,
    questions: [
      {
        question: "Planlamacılara göre toplu taşımayı genişletmek neden yeterli değildir?",
        options: ["Maliyeti çok yüksek olduğu için", "Yaya ve bisiklet altyapısı da gerekli olduğu için", "Nüfus azaldığı için", "Şehirler küçük olduğu için"],
        correctIndex: 1,
      },
      {
        question: "Bu yaklaşım Avrupa şehirlerinde neyi iyileştirmiştir?",
        options: ["Sadece toplu taşımayı", "Hava kalitesini ve azaltılmış araç yoğunluğunu", "Sadece bisiklet satışlarını", "Sadece yaya sayısını"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-08',
    text: "Finans piyasalarında algoritmik ticaret sistemleri, saniyenin çok küçük bir kesrinde binlerce işlem gerçekleştirebilir. Bu hız avantajı büyük kazançlar sağlayabilse de, sistemlerin birbirini tetikleyerek ani ve şiddetli fiyat hareketlerine yol açtığı 'flaş çöküş' olayları da yaşanmıştır. Düzenleyici kurumlar, bu tür olayları önlemek için işlem hızını sınırlayan mekanizmalar üzerinde çalışmaktadır.",
    difficulty: 8,
    questions: [
      {
        question: "Algoritmik ticaret sistemlerinin avantajı nedir?",
        options: ["Düşük risk", "Çok yüksek hızda işlem yapabilmek", "Sabit kazanç garantisi", "Basit kullanım"],
        correctIndex: 1,
      },
      {
        question: "Flaş çöküş olayları nasıl ortaya çıkar?",
        options: ["İnsan hatasından", "Sistemlerin birbirini tetiklemesinden", "Elektrik kesintisinden", "Düzenleyici kararlardan"],
        correctIndex: 1,
      },
      {
        question: "Düzenleyici kurumlar ne üzerinde çalışıyor?",
        options: ["Vergi oranlarını artırmak", "İşlem hızını sınırlayan mekanizmalar geliştirmek", "Piyasaları tamamen kapatmak", "Yeni borsalar açmak"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-09',
    text: "Kuantum bilgisayarlar, klasik bilgisayarların bit adı verilen ve 0 ya da 1 değerini alan birimler yerine, aynı anda birden fazla durumda bulunabilen kübitleri kullanır. Bu özellik, kuantum bilgisayarların belirli problem türlerini klasik bilgisayarlardan katlarca hızlı çözebilmesini sağlar. Ancak kübitlerin kararsız yapısı, hata düzeltme mekanizmalarını kuantum bilgisayar mimarisinin en büyük mühendislik zorluklarından biri haline getirmektedir.",
    difficulty: 9,
    questions: [
      {
        question: "Kübitler klasik bitlerden ne bakımdan farklıdır?",
        options: ["Daha ucuzdurlar", "Aynı anda birden fazla durumda bulunabilirler", "Daha yavaş çalışırlar", "Sadece 1 değerini alırlar"],
        correctIndex: 1,
      },
      {
        question: "Metne göre kuantum bilgisayarların en büyük mühendislik zorluğu nedir?",
        options: ["Yazılım eksikliği", "Kübitlerin kararsız yapısından kaynaklanan hata düzeltme sorunu", "Yüksek fiyatı", "Elektrik tüketimi"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-10',
    text: "Bir ekonomideki enflasyon beklentileri, yalnızca geçmiş fiyat verilerine değil, aynı zamanda hane halkının ve firmaların geleceğe dair öznel tahminlerine de dayanır; bu beklentiler kendi kendini gerçekleştiren bir döngü oluşturabilir, çünkü yüksek enflasyon bekleyen firmalar fiyatlarını önceden artırır, bu da beklenen enflasyonun fiilen gerçekleşmesine katkıda bulunur. Merkez bankalarının güvenilirliği, bu döngüyü kırmada belirleyici bir rol oynar; çünkü kararlı ve öngörülebilir bir para politikası, beklentileri çapalayarak fiyat istikrarını destekler.",
    difficulty: 10,
    questions: [
      {
        question: "Metne göre enflasyon beklentileri neye dayanır?",
        options: ["Sadece geçmiş fiyat verilerine", "Geçmiş verilere ve geleceğe dair öznel tahminlere", "Sadece hükümet açıklamalarına", "Sadece döviz kuruna"],
        correctIndex: 1,
      },
      {
        question: "Yüksek enflasyon beklentisi neden kendi kendini gerçekleştirebilir?",
        options: ["Firmalar fiyatlarını önceden artırdığı için", "Hükümet vergileri düşürdüğü için", "Tüketiciler harcamayı bıraktığı için", "Bankalar kredi vermeyi durdurduğu için"],
        correctIndex: 0,
      },
      {
        question: "Merkez bankalarının güvenilirliği neyi destekler?",
        options: ["Döviz kurunun yükselmesini", "Fiyat istikrarını", "Vergi gelirlerinin artmasını", "İşsizliğin artmasını"],
        correctIndex: 1,
      }
    ]
  },
];

export const wordList = [
  "kitap", "kalem", "masa", "araba", "güneş", "deniz", "orman", "kedi", "köpek", "kuş",
  "çocuk", "okul", "bilgisayar", "telefon", "saat", "gözlük", "defter", "silgi", "çanta",
  "çiçek", "ağaç", "bulut", "yağmur", "rüzgar", "yıldız", "ay", "Dünya", "şehir", "sokak",
  "ev", "kapı", "pencere", "duvar", "tavan", "zemin", "halı", "koltuk", "televizyon",
  "radyo", "müzik", "şarkı", "resim", "fotoğraf", "renk", "kırmızı", "mavi", "yeşil",
  "sarı", "siyah", "beyaz", "yemek", "su", "ekmek", "peynir", "zeytin", "yumurta",
  "dağ", "nehir", "göl", "köprü", "tren", "uçak", "gemi", "bisiklet", "motosiklet", "otobüs",
  "market", "hastane", "eczane", "banka", "postane", "cami", "müze", "tiyatro", "sinema", "stadyum",
  "bahçe", "tarla", "çiftlik", "inek", "koyun", "keçi", "tavuk", "at", "balık", "tavşan",
  "kelebek", "arı", "karınca", "örümcek", "yılan", "kaplumbağa", "sincap", "geyik", "aslan", "kaplan",
  "dolap", "yatak", "yastık", "battaniye", "ayna", "lamba", "anahtar", "cüzdan", "şemsiye", "eldiven",
  "şapka", "atkı", "ceket", "pantolon", "ayakkabı", "çorap", "gömlek"
];

export const categoryWords = {
  animals: ["kedi", "köpek", "at", "inek", "kuş", "balık", "tavşan", "aslan", "kaplan", "fil", "zürafa", "ayı", "kurt", "tilki", "maymun", "penguen", "yunus", "kartal", "baykuş", "zebra"],
  fruits: ["elma", "armut", "muz", "çilek", "kiraz", "karpuz", "kavun", "portakal", "mandalina", "üzüm", "şeftali", "kayısı", "erik", "nar", "incir", "ananas", "kivi", "avokado", "greyfurt", "vişne"],
  colors: ["kırmızı", "mavi", "yeşil", "sarı", "siyah", "beyaz", "mor", "turuncu", "gri", "kahverengi", "pembe", "lacivert", "bej", "turkuaz", "bordo", "altın", "gümüş", "haki", "eflatun"],
  objects: ["kalem", "kitap", "masa", "sandalye", "araba", "telefon", "bilgisayar", "saat", "çanta", "anahtar", "cüzdan", "gözlük", "şemsiye", "lamba", "ayna", "kapı", "pencere", "halı", "koltuk", "televizyon"]
};
