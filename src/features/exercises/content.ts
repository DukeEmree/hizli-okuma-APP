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

export interface MainIdeaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface MainIdeaItem {
  id: string;
  paragraph: string;
  questions: MainIdeaQuestion[];
  difficulty: DifficultyLevel;
}

export const mainIdeaItems: MainIdeaItem[] = [
  {
    id: 'mi-01',
    paragraph: "Su içmek vücudumuz için düşündüğümüzden çok daha önemlidir. Vücudumuzun büyük bölümü sudan oluşur ve neredeyse her işlem suya ihtiyaç duyar. Kanın dolaşabilmesi, besinlerin hücrelere taşınması ve atık maddelerin vücuttan atılması hep su sayesinde olur.\n\nSusadığımızı hissettiğimizde aslında vücudumuz bir süredir su kaybetmiş demektir. Bu yüzden sadece susayınca değil, gün boyunca düzenli aralıklarla su içmek daha doğrudur. Uzmanlar bir bardağı bitirdikten sonra bir sonrakini beklemek yerine, yanımızda bir şişe bulundurmayı önerir.\n\nSu kaybı arttığında vücut bunu bize farklı yollarla haber verir. Baş ağrısı, halsizlik ve dikkat dağınıklığı en sık görülen belirtilerdir. Özellikle çocuklarda derste odaklanma sorunu, bazen sadece yeterince su içilmemesinden kaynaklanabilir.\n\nSıcak havalarda ve spor yaparken su ihtiyacı daha da artar. Terleyerek kaybedilen suyun yerine konması gerekir. Aynı şekilde hastalık dönemlerinde, özellikle ateşli hastalıklarda, vücut daha fazla su kaybeder.\n\nSu içmenin en güzel tarafı ise kolay olmasıdır. Şekerli içecekler yerine su tercih etmek hem daha sağlıklıdır hem de daha ucuzdur. Meyve ve sebzeler de su içerir; karpuz, salatalık ve domates gibi besinler günlük su ihtiyacının bir kısmını karşılar.\n\nHer insanın su ihtiyacı aynı değildir. Yaş, kilo, hava sıcaklığı ve yapılan hareket miktarı bu ihtiyacı değiştirir. Bu yüzden herkese uyan tek bir miktar söylemek zordur. Önemli olan, vücudun verdiği işaretleri fark etmek ve suyu günün her saatine yaymaktır.\n\nKısacası su, pahalı bir takviye ya da özel bir ürün değildir; en basit ve en ulaşılabilir sağlık alışkanlığıdır. Bu alışkanlığı kazanmak, günlük yaşamda kendimizi çok daha iyi hissetmemizi sağlar.\n\nSu içme alışkanlığını kazanmanın en kolay yolu, onu var olan bir rutine bağlamaktır. Örneğin her yemekten önce bir bardak su içmek ya da masaya oturur oturmaz bir şişe doldurmak, ayrı bir çaba gerektirmeyen küçük kurallardır. Zamanla bu davranışlar otomatik hâle gelir ve hatırlamak için uğraşmak gerekmez.\n\nSuyun sıcaklığı ya da özel bir markadan olması ise sanıldığı kadar önemli değildir. Vücut açısından belirleyici olan, alınan toplam miktar ve bunun güne yayılmış olmasıdır. Bir seferde çok miktarda su içmek, aynı miktarı gün boyunca aralıklarla içmek kadar faydalı olmaz; çünkü vücut fazla suyu kısa sürede dışarı atar. Bu yüzden düzenli ve ölçülü içmek, tek seferde çok içmekten daha etkilidir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Su içmek vücudun düzgün çalışması için temel ve kolay bir sağlık alışkanlığıdır.",
          "Susamak kötü bir duygudur.",
          "Herkes günde tam olarak aynı miktarda su içmelidir.",
          "Su sadece yaz aylarında içilmelidir."
        ],
        correctIndex: 0,
      },
      {
        question: "Metne göre susama hissi ne anlama gelir?",
        options: [
          "Vücudun fazla su aldığını",
          "Vücudun bir süredir su kaybetmiş olduğunu",
          "Hemen dinlenmek gerektiğini",
          "Yemek yeme zamanının geldiğini"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde su ihtiyacını değiştiren etkenler arasında hangisi sayılmıştır?",
        options: [
          "Göz rengi ve boy",
          "Yaş, kilo, hava sıcaklığı ve hareket miktarı",
          "Uyku pozisyonu",
          "Kullanılan bardağın büyüklüğü"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 1,
  },
  {
    id: 'mi-02',
    paragraph: "Sabah kahvaltısı, günün en çok konuşulan ama en sık atlanan öğünüdür. Gece boyunca uzun bir süre aç kalan vücut, sabah uyandığında enerji deposunu yenilemeye ihtiyaç duyar. Kahvaltı yapmak, bu depoyu doldurarak günü daha dinç başlatmayı sağlar.\n\nKahvaltı yapmayan çocuklarda derste daha çabuk yorulma ve dikkat dağınıklığı görülebilir. Beyin çalışmak için düzenli enerjiye ihtiyaç duyar; sabah bu enerji sağlanmadığında ilk derslerde odaklanmak zorlaşır. Öğretmenler, kahvaltı yapmadan gelen öğrencilerin ilk saatlerde daha isteksiz olduğunu sıkça belirtir.\n\nAncak her kahvaltı aynı etkiyi yaratmaz. Sadece şekerli bir ürünle yapılan kahvaltı, kısa süreliğine enerji verse de bu enerji hızla düşer ve kişi kısa süre sonra yeniden yorgun hisseder. Protein ve lif içeren besinler ise enerjinin daha uzun süre dengeli kalmasını sağlar. Yumurta, peynir, tam tahıllı ekmek ve meyve bu açıdan iyi seçeneklerdir.\n\nZaman yetersizliği, kahvaltının atlanmasının en yaygın nedenidir. Oysa kahvaltı uzun sürmek zorunda değildir. Akşamdan hazırlanan basit bir tabak ya da yanına alınabilecek bir meyve, hiç kahvaltı yapmamaktan çok daha iyidir.\n\nKahvaltının bir de sosyal tarafı vardır. Aile bireylerinin bir araya geldiği tek öğün çoğu zaman sabah kahvaltısıdır. Bu kısa süre, gün içindeki planların paylaşıldığı ve kısa da olsa birlikte vakit geçirilen bir an olabilir.\n\nSonuç olarak kahvaltı, yalnızca mideyi doldurmak değil, güne fiziksel ve zihinsel olarak hazır başlamak anlamına gelir. Düzenli ve dengeli bir kahvaltı alışkanlığı, gün boyunca hem performansı hem de ruh hâlini olumlu etkiler.\n\nKahvaltının içeriği kadar miktarı da kişiye göre değişir. Herkesin sabah aynı iştahla uyanması beklenemez; bazı kişiler uyandıktan hemen sonra yemek yemekte zorlanır. Bu durumda kahvaltıyı tamamen atlamak yerine, hafif bir başlangıç yapıp bir iki saat sonra tamamlamak daha uygundur.\n\nOkul çağındaki çocuklar için düzen ayrıca önemlidir. Her sabah aynı saatte yapılan kahvaltı, vücudun açlık ritmini düzenler ve zamanla iştahsızlık sorununu azaltır. Sofranın hazırlanmasına çocuğun da katılması, öğüne olan ilgisini artıran basit ama etkili bir yöntemdir. Böylece kahvaltı, zorla yaptırılan bir görev olmaktan çıkıp günün doğal bir parçası hâline gelir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Çocuklar okula erken gitmelidir.",
          "Dengeli bir kahvaltı, güne fiziksel ve zihinsel olarak hazır başlamayı sağlar.",
          "Derste yorulmak normaldir.",
          "Kahvaltıda sadece süt içilmelidir."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre sadece şekerli bir ürünle yapılan kahvaltının sorunu nedir?",
        options: [
          "Hiç enerji vermemesi",
          "Verdiği enerjinin hızla düşmesi ve kısa sürede yorgunluk oluşması",
          "Hazırlanmasının uzun sürmesi",
          "Sadece yetişkinlere uygun olması"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde kahvaltının atlanmasının en yaygın nedeni olarak ne gösterilmiştir?",
        options: ["İştahsızlık", "Zaman yetersizliği", "Maliyet", "Alerjiler"],
        correctIndex: 1,
      }
    ],
    difficulty: 1,
  },
  {
    id: 'mi-03',
    paragraph: "Şehirlerde yaşayan insan sayısı her yıl artıyor. Bu artış, beton ve asfaltın kapladığı alanın genişlemesi anlamına geliyor. Bunun sonucunda şehirler, çevrelerindeki kırsal alanlara göre belirgin biçimde daha sıcak hâle geliyor. Uzmanlar bu duruma şehir ısı adası etkisi adını veriyor.\n\nAğaçlar bu etkiyi azaltan en etkili çözümlerden biridir. Yaprakları güneş ışığını keserek altındaki yüzeyin ısınmasını engeller. Ayrıca kökleriyle çektikleri suyu yapraklarından buharlaştırırlar; bu buharlaşma çevredeki havayı serinletir. Yoğun ağaçlı bir sokakla ağaçsız bir sokak arasındaki sıcaklık farkı, yaz günlerinde birkaç dereceye kadar çıkabilir.\n\nAğaçların katkısı sıcaklıkla sınırlı değildir. Yaprak yüzeyleri havadaki tozu ve bazı kirleticileri tutar. Fotosentez sırasında karbondioksit alıp oksijen verirler. Gövde ve dallar trafik gürültüsünün bir kısmını emerek sokakların daha sessiz olmasına yardımcı olur.\n\nYağmurlu günlerde de fark edilir bir işlevleri vardır. Ağaçların bulunduğu alanlarda yağmur suyunun bir kısmı toprağa süzülür. Böylece kanalizasyon sistemine giden su miktarı azalır ve ani sağanaklarda su baskını riski düşer.\n\nAncak ağaç dikmek tek başına yeterli değildir. Yanlış türün yanlış yere dikilmesi, birkaç yıl içinde ağacın kurumasına ya da altyapıya zarar vermesine yol açabilir. Bölgenin iklimine uygun, kök yapısı kaldırım ve boruları zorlamayan türler seçilmelidir. Dikimden sonraki ilk yıllarda düzenli sulama ve bakım da gereklidir.\n\nBu nedenle şehirlerde ağaçlandırma, tek seferlik bir dikim etkinliği olarak değil, uzun soluklu bir planlama işi olarak ele alınmalıdır. Doğru planlanmış yeşil alanlar, şehirlerde yaşam kalitesini gözle görülür biçimde yükseltir.\n\nAğaçların şehirdeki etkisi ölçülebilir bir konudur. Birçok belediye, sokakların yüzey sıcaklığını ve gölge oranını haritalayarak hangi bölgelerde önceliğe ihtiyaç olduğunu belirliyor. Bu haritalar çoğu zaman beklenmedik bir tabloyu ortaya koyuyor: yeşil alanların dağılımı şehir genelinde eşit değil ve genellikle daha yoğun yapılaşmış mahalleler daha az ağaca sahip.\n\nBu nedenle ağaçlandırma, yalnızca çevresel değil aynı zamanda sosyal bir mesele olarak da ele alınıyor. Gölgeli bir sokak, yaz aylarında yaşlıların ve çocukların dışarı çıkabilmesini doğrudan etkiler. Bakımı yapılmış bir park ise mahalledeki komşuluk ilişkilerini güçlendiren ortak bir alan hâline gelir. Bu yönüyle ağaçlar, şehir yaşamının hem fiziksel hem toplumsal kalitesini yükseltir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Ağaçlar sadece gölge sağlar.",
          "Şehirlerde park olmamalıdır.",
          "Doğru planlanmış ağaçlandırma, şehirlerde sıcaklık, hava kalitesi ve su yönetimi açısından yaşam kalitesini yükseltir.",
          "Ağaç dikmek pahalı bir iştir."
        ],
        correctIndex: 2,
      },
      {
        question: "Şehirlerin çevresindeki kırsal alanlara göre daha sıcak olmasına ne ad verilir?",
        options: ["Sera etkisi", "Şehir ısı adası etkisi", "Buharlaşma döngüsü", "İklim sapması"],
        correctIndex: 1,
      },
      {
        question: "Metne göre yanlış tür seçiminin olası sonucu nedir?",
        options: [
          "Ağacın çok hızlı büyümesi",
          "Ağacın kuruması ya da altyapıya zarar vermesi",
          "Havadaki oksijenin azalması",
          "Yağmur suyunun tamamen kesilmesi"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 2,
  },
  {
    id: 'mi-04',
    paragraph: "Spor yapmanın faydaları çoğu zaman sadece bedensel görünüm üzerinden konuşulur. Oysa düzenli hareketin en belirgin etkilerinden biri ruh hâli üzerindedir. Egzersiz sırasında vücutta salgılanan bazı maddeler, kişinin kendini daha iyi hissetmesini sağlar. Bu etki, egzersiz bittikten sonra da bir süre devam eder.\n\nAraştırmalar, düzenli hareket eden kişilerin gün içinde daha enerjik olduğunu ve stresle daha kolay baş ettiğini gösteriyor. Bunun bir nedeni, egzersizin uyku kalitesini artırmasıdır. Daha iyi uyuyan bir kişi, ertesi gün hem fiziksel hem zihinsel olarak daha dayanıklı olur.\n\nEgzersizin bu etkiyi göstermesi için yoğun olması da gerekmez. Haftada birkaç kez yapılan tempolu yürüyüş bile fark yaratabilir. Önemli olan sürenin uzunluğundan çok düzenliliktir. Ayda bir kez yapılan uzun bir antrenman yerine, haftada üç kez yapılan kısa yürüyüşler daha kalıcı sonuç verir.\n\nBaşlangıçta yapılan en yaygın hata, çok iddialı hedefler koymaktır. İlk hafta her gün uzun süre antrenman yapmaya çalışan biri, genellikle kısa sürede yorulur ve bırakır. Küçük ve sürdürülebilir hedeflerle başlamak, alışkanlığın yerleşmesini kolaylaştırır.\n\nHareketi günlük yaşama yaymak da mümkündür. Asansör yerine merdiven kullanmak, bir durak önce inip yürümek ya da telefon görüşmelerini ayakta yapmak gibi küçük tercihler toplamda anlamlı bir fark oluşturur.\n\nSporun sosyal boyutu da göz ardı edilmemelidir. Bir arkadaşla birlikte yürümek ya da bir gruba katılmak, hem motivasyonu artırır hem de devam etme olasılığını yükseltir. Sonuç olarak düzenli hareket, hem bedeni hem de zihni destekleyen ve herkesin kendi ölçeğinde uygulayabileceği bir alışkanlıktır.\n\nHareketin etkisi yaşla birlikte daha da belirgin hâle gelir. İlerleyen yaşlarda kas kütlesi doğal olarak azalır; düzenli hareket bu kaybı yavaşlatır ve denge becerisini korur. Denge, düşme riskini azalttığı için yaşlılıkta bağımsız yaşamayı doğrudan etkileyen bir etkendir.\n\nEgzersiz türünün kişiye uygun seçilmesi de önemlidir. Herkesin koşmak zorunda olmadığı, yüzme, bisiklet ya da hafif direnç çalışmalarının da aynı faydayı sağlayabildiği sıkça vurgulanır. Eklem sorunu olan biri için yüzme, koşuya göre çok daha uygun bir seçenektir. Kişinin keyif aldığı bir etkinliği bulması, uzun vadede devam etme olasılığını belirleyen en güçlü etkendir; çünkü sevilmeyen bir programın sürdürülmesi neredeyse hiç mümkün olmaz.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Spor sadece profesyoneller içindir.",
          "Düzenli ve sürdürülebilir hareket, hem beden hem ruh sağlığını destekler.",
          "Yürüyüş yapmak zaman kaybıdır.",
          "Egzersiz ancak çok yoğun yapılırsa işe yarar."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre egzersizde asıl belirleyici olan nedir?",
        options: ["Antrenmanın süresinin uzunluğu", "Düzenlilik", "Kullanılan ekipman", "Yapıldığı saat"],
        correctIndex: 1,
      },
      {
        question: "Başlangıçta yapılan en yaygın hata olarak ne gösterilmiştir?",
        options: [
          "Yanlış ayakkabı seçmek",
          "Çok iddialı hedefler koymak",
          "Sabah saatlerinde antrenman yapmak",
          "Arkadaşla birlikte spor yapmak"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 2,
  },
  {
    id: 'mi-05',
    paragraph: "Uyku, uzun süre yalnızca vücudun dinlendiği pasif bir dönem olarak görülmüştür. Bugün ise uyku sırasında beynin son derece etkin bir çalışma yürüttüğü biliniyor. Bu çalışmanın en önemli bileşenlerinden biri, gün içinde öğrenilen bilgilerin kalıcı hâle getirilmesidir.\n\nUyku tek parça bir süreç değildir; gece boyunca tekrarlanan döngülerden oluşur. Her döngüde hafif uyku, derin uyku ve rüyaların yoğunlaştığı evre sırayla yaşanır. Derin uyku evresinde beyin, gün içinde geçici olarak tuttuğu bilgileri daha kalıcı ağlara aktarır. Aynı evrede gereksiz görülen bağlantılar zayıflatılır; böylece hafıza, anlamlı bilgiler için yer açar.\n\nUykunun bağışıklık sistemiyle de doğrudan ilişkisi vardır. Yeterince uyumayan kişilerin enfeksiyonlara karşı daha savunmasız olduğu, aşı sonrası bağışıklık yanıtının bile uyku süresinden etkilenebildiği gösterilmiştir.\n\nSüre kadar düzen de önemlidir. Vücut, ışığa göre ayarlanan bir iç saate sahiptir. Yatma ve kalkma saatlerinin sürekli değişmesi bu saati bozar. Düzensiz saatlerde uyunan sekiz saat, düzenli uyunan yedi saat kadar dinlendirici olmayabilir.\n\nUykusuzluğun etkisi çoğu zaman fark edilmez. Dikkat süresi kısalır, tepki süresi uzar ve karar verme becerisi zayıflar. Ancak kişi bu düşüşü genellikle sezmez; çünkü kendi performansını değerlendirme yeteneği de aynı oranda azalır. Bu nedenle uykusuz bir kişi, kendini iyi hissettiğini söylerken bile ölçülebilir biçimde daha düşük performans gösterebilir.\n\nUzmanlar, yetişkinlerin çoğunda her gece yedi ila dokuz saat arasında uyku ihtiyacı olduğunu belirtiyor. Uyku, bu yönüyle beslenme ve hareket kadar temel bir sağlık bileşenidir; ertelenebilir bir lüks değil, günlük işleyişin zorunlu bir parçasıdır.\n\nUyku sorunlarının bir kısmı, gün içindeki alışkanlıklardan kaynaklanır. Akşam saatlerinde tüketilen kafein, etkisini saatler boyunca sürdürebilir ve uykuya geçişi geciktirebilir. Benzer biçimde geç saatte yapılan yoğun egzersiz, vücut sıcaklığını yükselterek uykuya dalmayı zorlaştırabilir.\n\nUykuya ayrılan sürenin yatakta geçirilen süreyle karıştırılmaması da gerekir. Yatakta uzun süre uyanık kalmak, zamanla yatağın uyanıklıkla ilişkilendirilmesine yol açabilir. Bu nedenle uzmanlar, uzun süre uykuya dalınamıyorsa yataktan kalkıp sakin bir etkinlikle beklemeyi ve uyku hissi geldiğinde geri dönmeyi öneriyor. Böylece yatak yeniden uyku ile ilişkilendirilir ve uykuya geçiş kolaylaşır.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Yetişkinler en az yedi saat uyumalıdır.",
          "Düzenli ve yeterli uyku, hafızadan bağışıklığa kadar pek çok işlev için vazgeçilmezdir.",
          "Uyku bağışıklık sistemini güçlendirir.",
          "Rüyalar hafızayı bozar."
        ],
        correctIndex: 1,
      },
      {
        question: "Derin uyku evresinde beyin ne yapar?",
        options: [
          "Yeni bilgi üretir",
          "Geçici bilgileri kalıcı ağlara aktarır ve gereksiz bağlantıları zayıflatır",
          "Tüm anıları siler",
          "Yalnızca vücut ısısını düzenler"
        ],
        correctIndex: 1,
      },
      {
        question: "Uykusuz kişiler performans düşüşünü neden fark etmez?",
        options: [
          "Düşüş çok küçük olduğu için",
          "Kendi performansını değerlendirme yeteneği de aynı oranda azaldığı için",
          "Ölçüm yapılamadığı için",
          "Düşüş yalnızca gece ortaya çıktığı için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 3,
  },
  {
    id: 'mi-06',
    paragraph: "Teknoloji, gündelik hayatı pek çok yönden kolaylaştırdı. Bilgiye erişim hızlandı, uzaktaki insanlarla iletişim kurmak sıradanlaştı, pek çok iş çok daha kısa sürede yapılabilir hâle geldi. Ancak aynı araçların kullanım biçimi, sağladıkları faydayı zaman zaman gölgeleyebiliyor.\n\nEkran karşısında geçirilen uzun saatler, göz sağlığını olumsuz etkileyen etkenlerin başında geliyor. Yakın mesafeye uzun süre odaklanmak göz kaslarını yorar; ayrıca ekrana bakarken göz kırpma sıklığı belirgin biçimde azaldığı için gözler kurur. Uzmanlar, belirli aralıklarla uzağa bakılmasını ve kısa molalar verilmesini öneriyor.\n\nİkinci sorun uyku düzeniyle ilgilidir. Akşam saatlerinde yoğun ekran ışığına maruz kalmak, vücudun iç saatini geciktirebilir ve uykuya geçişi zorlaştırabilir. Bu nedenle yatmadan önceki son saatte ekran kullanımını azaltmak yaygın bir öneridir.\n\nÜçüncü ve daha az konuşulan etki ise dikkat üzerindedir. Sürekli gelen bildirimler, uzun süre tek bir işe odaklanmayı zorlaştırır. Kesintiye uğrayan bir işe geri dönmek, düşünüldüğünden daha uzun sürer. Bu nedenle bildirimleri kapatmak, çoğu zaman verimliliği en çok artıran küçük değişikliklerden biridir.\n\nSosyal ilişkiler açısından da tablo çift yönlüdür. Teknoloji uzaktaki insanlarla bağı korumayı kolaylaştırırken, aynı ortamda bulunan kişiler arasındaki iletişimi zayıflatabilir. Yemek masasında ya da sohbet sırasında telefona bakmak, karşıdaki kişide görmezden gelinme hissi yaratabilir.\n\nBu nedenle sorunun kaynağı teknolojinin kendisi değil, kullanım biçimidir. Ne zaman, ne kadar ve hangi amaçla kullanıldığına dair bilinçli sınırlar koymak, teknolojinin sunduğu faydayı korurken olumsuz etkilerini belirgin biçimde azaltır.\n\nTeknolojinin çocuklar üzerindeki etkisi ayrı bir başlık oluşturur. Küçük yaşta uzun süre ekran karşısında kalmak, hareket ve doğrudan sosyal etkileşim için ayrılan zamanı azaltır. Uzmanlar burada da toplam süre kadar içeriğin niteliğine ve birlikte geçirilen zamana dikkat çekiyor.\n\nİş hayatında ise sınır koymak daha da zorlaşıyor. Çalışma saatleri dışında gelen mesajlara yanıt verme beklentisi, dinlenme süresini fiilen ortadan kaldırabiliyor. Bu nedenle bazı kurumlar mesai dışı bildirimleri sınırlayan uygulamalar geliştiriyor. Bireysel düzeyde ise belirli saatlerden sonra bildirimleri kapatmak, telefonu yatak odasından uzak tutmak ve bazı uygulamaları yalnızca belirli zamanlarda kullanmak işe yarayan pratik yöntemler arasında sayılıyor.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Ekran başında uzun süre kalmak gözü bozar.",
          "Teknoloji her durumda zararlıdır.",
          "Sorun teknolojinin kendisi değil kullanım biçimidir; bilinçli sınırlar faydayı korurken zararı azaltır.",
          "Sosyal ilişkiler teknoloji yüzünden tamamen biter."
        ],
        correctIndex: 2,
      },
      {
        question: "Metne göre ekrana bakarken gözlerin kurumasının nedeni nedir?",
        options: [
          "Ekran ışığının sıcaklığı",
          "Göz kırpma sıklığının belirgin biçimde azalması",
          "Odanın nemli olması",
          "Yazı tipinin küçüklüğü"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde verimliliği en çok artıran küçük değişikliklerden biri olarak ne gösterilmiştir?",
        options: [
          "Ekran parlaklığını artırmak",
          "Bildirimleri kapatmak",
          "Daha büyük ekran kullanmak",
          "Klavye değiştirmek"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 4,
  },
  {
    id: 'mi-07',
    paragraph: "Kitap okumanın kelime dağarcığını genişlettiği yaygın olarak bilinir. Ancak son yıllarda yapılan çalışmalar, özellikle kurgu okumanın daha az beklenen bir etkisine dikkat çekiyor: empati becerisinin gelişmesi.\n\nBir romanı okurken okuyucu, karakterin yalnızca ne yaptığını değil, neden yaptığını da izler. Karakterin geçmişi, korkuları ve çelişkileri metin boyunca açılır. Bu süreç, okuyucuyu kendi bakış açısının dışına çıkarak başka bir zihnin işleyişini takip etmeye zorlar. Zamanla bu alışkanlık, gerçek hayatta da başkalarının davranışlarını yorumlama biçimini etkiler.\n\nAraştırmalar, düzenli kurgu okuyan kişilerin başkalarının duygusal durumunu tahmin etme testlerinde daha başarılı sonuçlar aldığını gösteriyor. Bu etki, bilgi amaçlı metinlerde aynı ölçüde görülmüyor; çünkü bu metinler okuyucudan bir başkasının iç dünyasını takip etmesini istemiyor.\n\nBu ilişki tek yönlü değildir. Empati becerisi gelişmiş kişilerin karakter odaklı kitaplara daha çok ilgi duyması da mümkündür. Yine de uzun süreli izlemeye dayanan bazı çalışmalar, okuma alışkanlığı kazandıktan sonra bu becerinin ölçülebilir biçimde arttığını ortaya koymuştur.\n\nOkunan metnin niteliği de fark yaratır. Karakterlerin derinlemesine işlendiği eserler, olay örgüsünün öne çıktığı hızlı anlatılara göre bu etkiyi daha güçlü biçimde oluşturur. Ayrıca okuma sonrası metin üzerine düşünmek ya da başkalarıyla konuşmak, etkiyi pekiştiriyor.\n\nBu nedenle okuma, yalnızca bilgi edinmenin ya da kelime öğrenmenin aracı değildir. Farklı yaşamlara tanık olmak, dünyaya birden fazla pencereden bakma alışkanlığı kazandırır. Bu alışkanlık, sosyal ilişkilerde daha anlayışlı ve daha dikkatli olmayı destekleyen bir zemin oluşturur.\n\nBu etkinin çocuklarda daha güçlü olduğu düşünülüyor. Erken yaşta düzenli okuma, hem dil gelişimini hem de başkalarının duygularını tanıma becerisini destekliyor. Birlikte okuma ve okunan hikâye üzerine konuşma, bu etkiyi belirgin biçimde artırıyor; çünkü çocuk karakterin ne hissettiğini yalnızca izlemekle kalmıyor, ifade etmeyi de deniyor.\n\nOkuma alışkanlığının kazanılmasında zorlama ise ters etki yaratabiliyor. Seçilen kitabın kişinin ilgisine uygun olması, uzunluğundan ya da edebi değerinden daha belirleyici. Bir kitabı bitirmek zorunda hissetmemek de önemli bir serbestlik; sevilmeyen bir metni bırakıp başka birine geçmek, okumayı bir yük olmaktan çıkarır ve alışkanlığın yerleşmesini kolaylaştırır.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Kitap okumak yalnızca kelime dağarcığını geliştirir.",
          "Özellikle kurgu okumak, başka zihinleri takip etme alışkanlığı kazandırarak empati becerisini geliştirir.",
          "Empati kurmak öğrenilemez.",
          "Bilgi amaçlı metinler kurgudan daha faydalıdır."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre bu etki bilgi amaçlı metinlerde neden aynı ölçüde görülmez?",
        options: [
          "Bu metinler çok kısa olduğu için",
          "Okuyucudan bir başkasının iç dünyasını takip etmesini istemedikleri için",
          "Daha zor bir dil kullandıkları için",
          "Daha az okunduğu için"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde etkiyi pekiştirdiği belirtilen davranış nedir?",
        options: [
          "Kitabı hızlı bitirmek",
          "Okuma sonrası metin üzerine düşünmek veya başkalarıyla konuşmak",
          "Aynı kitabı tekrar okumak",
          "Sesli okumak"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 4,
  },
  {
    id: 'mi-08',
    paragraph: "Sosyal medya, insanların birbirine ulaşmasını hiç olmadığı kadar kolaylaştırdı. Aynı kolaylık, doğruluğu kontrol edilmemiş bilgilerin de aynı hızla yayılmasına zemin hazırlıyor. Bir iddianın binlerce kişiye ulaşması artık saniyeler sürüyor; oysa o iddianın doğrulanması saatler, bazen günler alabiliyor.\n\nBu asimetri tek başına bir sorun oluştururken, paylaşım davranışının kendisi durumu daha da zorlaştırıyor. Araştırmalar, insanların bir içeriği paylaşırken çoğu zaman yalnızca başlığa baktığını gösteriyor. Öfke, korku ya da şaşkınlık uyandıran içerikler, sakin bir dille yazılmış doğrulanmış haberlere göre daha fazla paylaşılıyor. Bu da yanlış bilginin yayılma hızını artıran temel etkenlerden biri.\n\nYanlış bilgi her zaman kasıtlı da değildir. Çoğu kişi, gerçekten faydalı olduğunu düşündüğü bir uyarıyı iyi niyetle paylaşır. Ancak sonuç, niyetten bağımsız olarak aynı olur: yanlış bir algı toplumda yerleşir ve düzeltilmesi çok daha zorlaşır. Bir bilgi bir kez zihne yerleştikten sonra, doğrusu gösterilse bile etkisini tamamen kaybetmeyebilir.\n\nBu nedenle paylaşmadan önce yapılacak kısa bir kontrol büyük fark yaratır. Kaynağın kim olduğuna bakmak, aynı haberin başka güvenilir yerlerde yer alıp almadığını kontrol etmek ve tarihine dikkat etmek çoğu zaman yeterlidir. Eski bir olayın güncel gibi paylaşılması, en sık karşılaşılan yanılgılardan biridir.\n\nGörseller konusunda da dikkatli olmak gerekir. Bir fotoğraf gerçek olsa bile, başka bir olaya ait olabilir. Görselin nereden geldiğini araştırmak, birkaç saniyelik bir işlemle mümkündür.\n\nSonuç olarak, doğru bilginin yayılması da yanlış bilginin yayılması kadar kullanıcıların davranışına bağlıdır. Paylaşmadan önce durup kaynağı doğrulamak, bireysel bir alışkanlık olmanın ötesinde toplumsal bir sorumluluktur.\n\nPlatformların bu tabloda payı olduğu da açıktır. Kullanıcıyı ekranda tutmayı hedefleyen sıralama sistemleri, ilgi çeken içeriği öne çıkarır; ilgi çekicilik ise çoğu zaman doğrulukla aynı anlama gelmez. Bu nedenle bazı platformlar, paylaşmadan önce içeriği okumayı hatırlatan uyarılar ve doğrulama etiketleri kullanmaya başlamıştır.\n\nBu önlemlerin etkisi sınırlıdır ama ölçülebilirdir. Yapılan denemelerde, paylaş düğmesine basıldığında çıkan basit bir hatırlatmanın bile paylaşım oranını düşürdüğü görülmüştür. Yine de asıl belirleyici olan kullanıcı alışkanlığıdır. Bir içeriği paylaşmadan önce birkaç saniye durmak, hem yanlış bilginin yayılmasını yavaşlatır hem de kişinin kendi bilgi kaynaklarını daha dikkatli seçmesini sağlar.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Sosyal medya kullanmak tamamen zararlıdır.",
          "Haberler her zaman doğrudur.",
          "Paylaşmadan önce kaynağı doğrulamak, yanlış bilginin toplumda yerleşmesini önleyen bireysel ve toplumsal bir sorumluluktur.",
          "Kaynak kontrolü sadece gazetecilerin işidir."
        ],
        correctIndex: 2,
      },
      {
        question: "Metne göre hangi tür içerikler daha fazla paylaşılıyor?",
        options: [
          "Sakin dille yazılmış doğrulanmış haberler",
          "Öfke, korku ya da şaşkınlık uyandıran içerikler",
          "Uzun analiz yazıları",
          "Sadece görsel içeren paylaşımlar"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde en sık karşılaşılan yanılgılardan biri olarak ne belirtilmiştir?",
        options: [
          "Haberin çok uzun olması",
          "Eski bir olayın güncel gibi paylaşılması",
          "Yazım hatası bulunması",
          "Yorumların kapalı olması"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 5,
  },
  {
    id: 'mi-09',
    paragraph: "Masa başında çalışan kişi sayısı her geçen yıl artıyor. Bu çalışma biçiminin en belirgin sonucu, gün içinde çok uzun süre hareketsiz kalınmasıdır. Uzun süre aynı pozisyonda oturmak, omurga ve boyun bölgesinde zamanla ağrıya dönüşen bir yüklenme yaratır.\n\nSorunun kaynağı yalnızca oturmanın kendisi değil, hareketsizliğin süresidir. Vücut, uzun süre sabit kalmak üzere tasarlanmamıştır. Kaslar aynı pozisyonda uzun süre tutulduğunda yorulur, dolaşım yavaşlar ve eklemlerdeki yağlanma azalır. Bu nedenle uzmanlar, mükemmel bir oturuş pozisyonu aramak yerine pozisyonu sık sık değiştirmeyi öneriyor.\n\nEn çok önerilen uygulama, her saat başı birkaç dakika ayağa kalkmak ve basit esneme hareketleri yapmaktır. Bu kısa molalar dolaşımı canlandırır, kas gerginliğini azaltır ve dikkatin tazelenmesine de yardımcı olur. Molanın uzun olması gerekmez; bir bardak su almak için kalkmak bile fark yaratır.\n\nÇalışma alanının düzeni de önemlidir. Ekranın göz hizasında olması boyun eğilmesini azaltır. Ayakların yere tam basması ve dirseklerin desteklenmesi omuz gerginliğini düşürür. Bu düzenlemeler pahalı ekipman gerektirmez; birkaç kitapla ekran yükseltmek ya da sırt desteği için katlanmış bir havlu kullanmak bile işe yarar.\n\nGöz sağlığı da bu tabloya dahildir. Uzun süre yakına odaklanmak gözleri yorar; belirli aralıklarla uzağa bakmak bu yorgunluğu azaltır.\n\nBu önlemlerin hiçbiri tek başına dramatik bir değişiklik yaratmaz. Ancak birlikte ve düzenli uygulandıklarında, masa başı çalışanların uzun vadeli sağlığını korumada belirgin bir fark oluşturur. Küçük ve tekrarlanabilir alışkanlıklar, bu alanda büyük ama sürdürülemeyen değişikliklerden çok daha etkilidir.\n\nHareket ihtiyacı yalnızca ofis çalışanlarını ilgilendirmez. Uzun süre araç kullanan, uzun uçuş yapan ya da evden çalışan kişiler de aynı riski taşır. Evden çalışmada mesafenin ortadan kalkması, gün içindeki doğal hareketi de azaltır; ofise gidiş gelişte yapılan yürüyüş bile ortadan kalkmış olur.\n\nBu nedenle uzmanlar, gün içine bilinçli olarak hareket eklemeyi öneriyor. Telefon görüşmelerini ayakta ya da yürüyerek yapmak, öğle arasında kısa bir yürüyüşe çıkmak ve toplantıların bir kısmını ayakta yapmak sık verilen örneklerdir. Bu değişikliklerin hiçbiri ek zaman gerektirmez; yalnızca var olan işlerin nasıl yapıldığını değiştirir ve bu yüzden uygulanma olasılığı yüksektir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Masa başı iş yapmak tamamen bırakılmalıdır.",
          "Kısa aralıklarla hareket etmek ve çalışma alanını düzenlemek gibi küçük alışkanlıklar masa başı çalışanların sağlığını korur.",
          "Boyun ağrısı sadece yaşlılarda görülür.",
          "Esneme hareketleri sadece sporcular içindir."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre sorunun asıl kaynağı nedir?",
        options: [
          "Oturmanın kendisi",
          "Hareketsizliğin süresi",
          "Sandalyenin markası",
          "Ofisin sıcaklığı"
        ],
        correctIndex: 1,
      },
      {
        question: "Uzmanlar mükemmel oturuş pozisyonu aramak yerine neyi öneriyor?",
        options: [
          "Ayakta çalışmayı",
          "Pozisyonu sık sık değiştirmeyi",
          "Daha yumuşak sandalye kullanmayı",
          "Çalışma süresini iki katına çıkarmayı"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 5,
  },
  {
    id: 'mi-10',
    paragraph: "Geri dönüşüm, atıkların yeniden hammaddeye dönüştürülerek doğal kaynak kullanımını azaltmayı amaçlayan bir süreçtir. Bir tonluk kağıdın geri dönüştürülmesi çok sayıda ağacın kesilmesini önler; alüminyumun yeniden işlenmesi ise cevherden üretime kıyasla enerji tüketimini çarpıcı biçimde düşürür. Bu nedenle geri dönüşüm, hem çevresel hem ekonomik açıdan önemli bir kazanç sağlar.\n\nAncak bu kazancın gerçekleşmesi, atıkların doğru şekilde ayrıştırılmasına bağlıdır. Karışık atık, tesislerde ayrıştırılmak zorunda kalır ve bu ek işlem hem zaman hem maliyet yaratır. Daha kötüsü, bazı durumlarda kirlenmiş bir malzeme tüm partiyi kullanılamaz hâle getirebilir. Yağlı bir pizza kutusunun kağıt konteynerine atılması, o partideki kağıdın geri dönüştürülememesine yol açabilir.\n\nSık yapılan bir başka hata, ambalajların yıkanmadan atılmasıdır. İçinde yiyecek kalıntısı bulunan bir kap, sıcak havalarda kısa sürede bozularak çevresindeki malzemeleri de etkiler. Kısa bir durulama çoğu zaman yeterlidir.\n\nBazı malzemeler ise adı geri dönüştürülebilir olsa da pratikte sorunludur. Farklı katmanların birbirine yapıştırıldığı ambalajlar, katmanlar ayrılamadığı için çoğu tesiste işlenemez. Bu nedenle ürün seçiminde tek malzemeden üretilmiş ambalajları tercih etmek de sürecin bir parçasıdır.\n\nGeri dönüşümün kendisinin de bir maliyeti olduğu unutulmamalıdır. Toplama, taşıma ve işleme aşamaları enerji tüketir. Bu yüzden atık yönetiminde öncelik sırası önemlidir: önce tüketimi azaltmak, sonra yeniden kullanmak, en son geri dönüştürmek.\n\nSonuç olarak geri dönüşüm, tek başına çözüm değil, doğru uygulandığında işe yarayan bir halkadır. Ayrıştırmanın kalitesi, sürecin başarısını doğrudan belirleyen etkendir.\n\nGeri dönüşümün başarısı, sistemin kullanıcı için ne kadar anlaşılır olduğuna da bağlıdır. Konteyner renklerinin ve etiketlerin şehirden şehre değişmesi, doğru davranmak isteyen kişilerde bile kararsızlık yaratır. Basit ve tutarlı işaretler, ayrıştırma kalitesini artıran en düşük maliyetli müdahalelerden biridir.\n\nÜretici tarafının sorumluluğu da giderek daha çok tartışılıyor. Ambalajın nasıl ayrıştırılacağının ürün üzerinde açıkça belirtilmesi, farklı malzemelerin kolay ayrılabilecek biçimde tasarlanması ve gereksiz katman kullanımından kaçınılması, sürecin daha başında verimliliği yükseltir. Tüketicinin doğru davranması önemlidir; ancak ürün baştan ayrıştırılamayacak biçimde tasarlandıysa bu çabanın karşılığı sınırlı kalır. Bu nedenle geri dönüşümü yalnızca bireysel bir davranış meselesi olarak görmek eksik bir bakış olur; sistemin tasarımı, işaretlerin anlaşılırlığı ve üreticinin sorumluluğu da en az kullanıcının dikkati kadar belirleyicidir. Bu üç halkadan biri zayıf kaldığında, diğer ikisinin çabası büyük ölçüde boşa gider.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Geri dönüşüm hiçbir zaman işe yaramaz.",
          "Geri dönüşüm ancak doğru ayrıştırma ile verimli olur ve atık yönetiminde son sırada gelmelidir.",
          "Çöp miktarı azaltılamaz.",
          "Geri dönüşüm sadece plastik için geçerlidir."
        ],
        correctIndex: 1,
      },
      {
        question: "Yağlı bir pizza kutusunun kağıt konteynerine atılmasının sonucu ne olabilir?",
        options: [
          "Kağıdın daha kaliteli olması",
          "O partideki kağıdın geri dönüştürülememesi",
          "Taşıma maliyetinin düşmesi",
          "Hiçbir etkisi olmaması"
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre atık yönetiminde doğru öncelik sırası nedir?",
        options: [
          "Geri dönüştürmek, yeniden kullanmak, azaltmak",
          "Tüketimi azaltmak, yeniden kullanmak, geri dönüştürmek",
          "Yakmak, gömmek, geri dönüştürmek",
          "Yeniden kullanmak, yakmak, azaltmak"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 6,
  },
  {
    id: 'mi-11',
    paragraph: "Uykusuzluğun yorgunluk yarattığı herkesin bildiği bir gerçektir. Daha az bilinen ise, yetersiz uykunun karar verme becerisini doğrudan zayıflatmasıdır. Araştırmalar, uykusuz kişilerin risk değerlendirmesinde belirgin biçimde daha fazla hata yaptığını gösteriyor.\n\nBu bozulmanın belirli bir örüntüsü var. Uykusuz kişiler olası kazançları abartma, olası kayıpları ise hafife alma eğilimi gösteriyor. Yani hata rastgele değil, sistematik olarak riskli seçeneklerden yana. Bu durum, finansal kararlardan trafikteki manevralara kadar geniş bir alanda sonuç doğurabiliyor.\n\nEtkinin bir başka boyutu duygusal tepkilerle ilgili. Yetersiz uyku, olumsuz uyaranlara verilen tepkiyi güçlendirirken bu tepkiyi dengeleyen kontrol mekanizmalarını zayıflatıyor. Sonuç olarak kişi hem daha çabuk sinirleniyor hem de sakinleşmekte zorlanıyor. Bu, özellikle ekip çalışması gerektiren ortamlarda görünür hâle geliyor.\n\nEn kritik nokta ise farkındalık eksikliği. Uykusuz kişiler kendi performans düşüşlerini genellikle fark etmiyor; hatta bazı durumlarda kendilerini normalden daha iyi değerlendirebiliyorlar. Çünkü öz değerlendirme yapma yeteneği de aynı süreçten etkileniyor. Bu nedenle kişi, kendini karar vermeye hazır hissetse bile ölçülebilir biçimde daha kötü kararlar verebiliyor.\n\nKısa süreli çözümler bu tabloyu tam olarak düzeltmiyor. Kahve gibi uyarıcılar uyanıklık hissini artırsa da karar kalitesindeki bozulmayı ortadan kaldırmıyor. Kısa bir şekerleme bazı durumlarda yardımcı olabiliyor, ancak birikmiş uyku eksikliğini kapatmıyor.\n\nBu nedenle önemli kararları mümkün olduğunca dinlenmiş bir hâlde almak, kişisel bir tercih değil pratik bir tedbirdir. Kararın kendisi kadar, o kararın alındığı zihinsel durum da sonucu belirler.\n\nUyku eksikliğinin etkisi kişiden kişiye de değişir. Bazı insanlar aynı uykusuzluk düzeyinde daha az performans kaybı yaşar; ancak bu grubun sanıldığından çok daha küçük olduğu gösterilmiştir. Kendini bu gruba dahil eden çoğu kişi, ölçüldüğünde belirgin bir düşüş sergiler.\n\nBirikmiş uykusuzluk ayrı bir sorundur. Hafta boyunca her gece bir saat eksik uyumak, tek bir gecelik uykusuzluğa benzer bir etki yaratabilir; üstelik kişi bunu tek seferlik bir yorgunluk olarak algılamadığı için önlem alma ihtiyacı da duymaz. Hafta sonu uzun uyumak bu açığı kısmen kapatsa da tamamen gidermez. Bu nedenle uyku, telafi edilebilir bir borç gibi değil, düzenli karşılanması gereken bir ihtiyaç olarak ele alınmalıdır.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Uykusuzluk sadece fiziksel yorgunluk yaratır.",
          "Yetersiz uyku, karar verme becerisini sistematik biçimde bozar ve bu bozulma çoğu zaman fark edilmez.",
          "Önemli kararlar mutlaka sabah alınmalıdır.",
          "Herkesin uyku ihtiyacı aynıdır."
        ],
        correctIndex: 1,
      },
      {
        question: "Uykusuz kişilerin hata örüntüsü nasıl tanımlanmıştır?",
        options: [
          "Tamamen rastgele",
          "Kazançları abartma, kayıpları hafife alma yönünde sistematik",
          "Her zaman aşırı temkinli",
          "Yalnızca finansal kararlarda görülen"
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre kahve gibi uyarıcıların sınırı nedir?",
        options: [
          "Uyanıklık hissini bile artırmazlar",
          "Uyanıklık hissini artırsa da karar kalitesindeki bozulmayı ortadan kaldırmazlar",
          "Uykuyu tamamen gereksiz kılarlar",
          "Yalnızca sabah saatlerinde etkilidirler"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 6,
  },
  {
    id: 'mi-12',
    paragraph: "Yapay zeka sistemleri, büyük veri kümelerinden öğrenerek karmaşık kararlar üretebiliyor. Ancak bu kararların arkasındaki mantığı insanların takip edebileceği bir biçimde açıklamak çoğu zaman mümkün olmuyor. Derin öğrenme modellerinin çıktısı, milyonlarca parametrenin birlikte ürettiği bir sonuçtur ve bu sonucu tek bir gerekçeye indirgemek genellikle yanıltıcıdır.\n\nBu şeffaflık eksikliği, düşük riskli uygulamalarda ciddi bir sorun oluşturmayabilir. Bir müzik önerisinin neden yapıldığını bilmemek kimseyi zora sokmaz. Ancak aynı belirsizlik sağlık, hukuk ve finans gibi alanlarda güven sorununa dönüşür. Bir hekim, tedavi kararını gerekçelendirebilir ve bu gerekçe tartışılabilir. Model ise yalnızca bir olasılık değeri sunar.\n\nSorunun pratikteki sonucu, itiraz hakkının zayıflamasıdır. Gerekçesi bilinmeyen bir karara karşı savunma yapmak güçtür. Kredi başvurusu reddedilen bir kişi, hangi ölçütün belirleyici olduğunu bilmiyorsa durumunu düzeltmek için ne yapması gerektiğini de bilemez.\n\nBu nedenle açıklanabilir yapay zeka üzerine çalışmalar hız kazanmıştır. Geliştirilen yöntemlerin bir kısmı, karara en çok katkı yapan girdileri belirlemeye çalışır. Bir başka yaklaşım ise karmaşık modelin davranışını, belirli bir karar çevresinde daha basit ve yorumlanabilir bir modelle yaklaşık olarak temsil etmeyi hedefler.\n\nBu yöntemlerin sınırları da vardır. Üretilen açıklama, modelin gerçek işleyişinin tam bir yansıması değil, ona yakın bir tahmindir. Yanıltıcı bir açıklama, hiç açıklama olmamasından daha tehlikeli olabilir; çünkü yersiz bir güven duygusu yaratır.\n\nBu nedenle açıklanabilirlik, tek başına bir çözüm değil, insan denetimi ve bağımsız değerlendirme ile birlikte anlam kazanan bir bileşendir.\n\nAçıklanabilirlik talebinin kimden geldiği de sonucu değiştirir. Bir mühendis için modelin hangi girdilere duyarlı olduğunu görmek, hatayı bulmak açısından yeterli olabilir. Oysa kararı doğrudan etkilenen kişi için anlamlı açıklama, ne yaparsa sonucun değişeceğini söyleyen türden bir açıklamadır. Bu iki ihtiyaç aynı yöntemle karşılanamaz.\n\nBu nedenle bazı düzenlemeler, teknik açıklama yerine sonuç odaklı bilgilendirme zorunluluğu getirmektedir. Kişiye hangi ölçütlerin dikkate alındığının ve karara itiraz yolunun bildirilmesi, modelin iç işleyişini anlatmaktan daha uygulanabilir bir çözüm olarak görülüyor. Şeffaflık böylece soyut bir ilke olmaktan çıkıp kişinin fiilen kullanabileceği bir hakka dönüşüyor.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Yapay zeka her zaman kararlarını açıklayabilir.",
          "Yapay zeka kararlarındaki şeffaflık eksikliği hassas alanlarda güven ve itiraz sorunu yaratır; açıklanabilirlik ise tek başına yeterli değildir.",
          "Yapay zeka sadece teknoloji şirketlerinde kullanılır.",
          "Büyük veri kümeleri gereksizdir."
        ],
        correctIndex: 1,
      },
      {
        question: "Şeffaflık eksikliğinin pratikteki en önemli sonucu nedir?",
        options: [
          "Modelin yavaşlaması",
          "İtiraz hakkının zayıflaması",
          "Veri maliyetinin artması",
          "Modelin daha az veri kullanması"
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre yanıltıcı bir açıklama neden tehlikeli olabilir?",
        options: [
          "Modeli yavaşlattığı için",
          "Yersiz bir güven duygusu yarattığı için",
          "Daha fazla veri gerektirdiği için",
          "Yasal olarak zorunlu olduğu için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 7,
  },
  {
    id: 'mi-13',
    paragraph: "Küresel tedarik zincirleri, üretim maliyetini düşürmek amacıyla onlarca yıl boyunca giderek daha verimli hâle getirildi. Stok tutmak maliyetli görüldüğü için parçalar tam ihtiyaç duyulduğu anda teslim edilecek şekilde planlandı. Bu yaklaşım normal koşullarda büyük tasarruf sağladı; ancak sistemin şoklara karşı toleransını da azalttı.\n\nBu kırılganlık, tek bir noktadaki aksaklığın ne kadar geniş bir alanı etkileyebildiğinde görünür hâle geliyor. Bir limandaki gecikme, binlerce kilometre uzaktaki bir fabrikanın üretim hattını durdurabiliyor. Tek bir bileşenin eksikliği, geri kalan tüm parçalar hazır olsa bile ürünün tamamlanmasını engelliyor.\n\nSorunu büyüten bir başka etken yoğunlaşmadır. Bazı kritik bileşenlerin üretimi, dünya genelinde yalnızca birkaç tesiste yapılıyor. Bu tesisler ölçek ekonomisi sayesinde maliyeti düşürüyor; ancak herhangi birinde yaşanan kesinti, alternatifi kısa sürede bulunamadığı için küresel etki yaratıyor.\n\nBir de bilgi sorunu var. Çoğu şirket doğrudan tedarikçisini bilir, ancak tedarikçisinin tedarikçisini bilmez. Bu nedenle riskin nerede biriktiği, kriz çıkana kadar çoğu zaman fark edilmez.\n\nBu deneyimler, şirketleri stratejilerini gözden geçirmeye yöneltti. Tek kaynağa bağımlılığı azaltmak, kritik parçalarda güvenlik stoku tutmak ve üretimin bir bölümünü tüketim pazarına yakın konumlandırmak öne çıkan çözümler oldu.\n\nBu çözümlerin bir bedeli var: hepsi maliyeti artırıyor. Bu nedenle asıl soru, verimlilik ile dayanıklılık arasındaki dengenin nerede kurulacağıdır. Tamamen verime odaklanmış bir zincir ucuz ama kırılgandır; aşırı yedekli bir zincir ise dayanıklı ama pahalıdır.\n\nBu tartışmanın bir de coğrafi boyutu var. Üretimin belirli bölgelerde toplanması, maliyet avantajı sağlarken siyasi ve doğal risklerin de aynı noktada yoğunlaşması anlamına geliyor. Tek bir bölgedeki deprem, kuraklık ya da ihracat kısıtlaması, dünya genelinde aynı anda hissedilebiliyor.\n\nŞirketlerin buna yanıtı çoğu zaman kademeli oluyor. Tedarikçi ağını bir anda değiştirmek hem pahalı hem risklidir; yeni bir tedarikçinin kalite ve kapasite açısından test edilmesi zaman alır. Bu nedenle birçok şirket önce kritik parçalarda ikinci bir kaynak oluşturuyor, ardından bu yapıyı yavaşça genişletiyor. Dayanıklılık, bu yönüyle tek bir kararla değil yıllara yayılan bir dizi tercihle inşa ediliyor.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Tedarik zincirleri birbirinden tamamen bağımsızdır.",
          "Verimlilik için optimize edilmiş küresel tedarik zincirleri kırılgan hâle geldi; asıl mesele verimlilik ile dayanıklılık arasındaki dengedir.",
          "Limanlardaki gecikmeler önemsizdir.",
          "Güvenlik stoku tutmak her zaman gereksizdir."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre yoğunlaşma neden sorunu büyütür?",
        options: [
          "Üretim kalitesini düşürdüğü için",
          "Kritik bileşenlerin birkaç tesiste üretilmesi nedeniyle kesintiye alternatif bulunamadığı için",
          "Taşıma sürelerini uzattığı için",
          "İşçi sayısını azalttığı için"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde belirtilen bilgi sorunu nedir?",
        options: [
          "Şirketlerin kendi ürünlerini tanımaması",
          "Çoğu şirketin tedarikçisinin tedarikçisini bilmemesi",
          "Fiyat listelerinin gizli olması",
          "Gümrük kayıtlarının tutulmaması"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 7,
  },
  {
    id: 'mi-14',
    paragraph: "Bir dilin yok olması, çoğu zaman yalnızca kelimelerin kaybı olarak düşünülür. Oysa her dil, dünyayı belirli bir biçimde bölümleyen bir sistemdir. Bazı diller renk aralıklarını farklı biçimde ayırır, bazıları yön tarifini kişiye göre değil sabit yönlere göre yapar, bazıları akrabalık ilişkilerini çok daha ince ayrımlarla tanımlar. Bir dil kaybolduğunda bu ayrımların taşıdığı düşünme biçimi de dolaşımdan çıkar.\n\nKaybın bir başka boyutu kültürel bellektir. Yazıya geçirilmemiş dillerde tarih, tarifler, şifalı bitki bilgisi ve çevre gözlemleri sözlü aktarımla taşınır. Konuşan son kişiler öldüğünde, kuşaklar boyunca biriken bu bilgi kayıt bırakmadan yok olur. Yerel bitki adlarında saklı ekolojik bilginin, bazı durumlarda bilimsel literatürden daha ayrıntılı olduğu gösterilmiştir.\n\nDilbilimciler, dünya genelinde konuşulan dillerin önemli bir kısmının bu yüzyıl içinde yok olma riski taşıdığını belirtiyor. Süreç genellikle aynı biçimde ilerliyor: dil önce resmî alanlardan çekiliyor, ardından ev dışında konuşulmaz oluyor, sonunda çocuklara aktarılmıyor. Aktarımın kesildiği an, dilin geleceği fiilen belirlenmiş oluyor.\n\nBu nedenle koruma çalışmalarının iki ayağı var. Birincisi belgelemedir: sözlükler, dilbilgisi çalışmaları ve ses kayıtları oluşturmak. İkincisi ve daha zoru ise dilin gündelik yaşamda yeniden kullanılmasıdır. Sadece arşivlenmiş bir dil, müzedeki bir nesne gibi korunur ama yaşamaz.\n\nBaşarılı örnekler, canlanmanın mümkün olduğunu gösteriyor. Okulda öğretim, medya içeriği üretimi ve çocukların dili doğal ortamda duyabileceği alanların oluşturulması bu örneklerin ortak yanı.\n\nSonuç olarak dil koruma, geçmişi saklamak kadar bugünü ve geleceği ilgilendiren bir meseledir.\n\nTeknolojinin bu alanda ikili bir etkisi var. Bir yandan baskın diller dijital ortamda çok daha görünür olduğu için küçük dillerin kullanım alanı daralıyor. Öte yandan aynı teknoloji, belgeleme ve öğretim için daha önce mümkün olmayan araçlar sunuyor. Ses kaydı, sözlük uygulamaları ve çevrim içi dersler, dağınık yaşayan konuşurları bir araya getirebiliyor.\n\nBelirleyici olan, bu araçların kim tarafından ve nasıl kullanıldığıdır. Topluluğun kendi belirlediği önceliklerle yürütülen çalışmalar, dışarıdan yürütülen projelere göre çok daha kalıcı sonuç veriyor. Çünkü dilin yaşaması, arşivin büyüklüğüne değil, o dili günlük hayatında kullanmaya devam eden insan sayısına bağlı.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Diller sadece iletişim aracıdır ve kaybı önemsizdir.",
          "Bir dilin yok olması düşünme biçimlerinin ve kültürel belleğin de kaybıdır; koruma hem belgeleme hem günlük kullanımı gerektirir.",
          "Tüm diller aynı hızda yok olma riski taşır.",
          "Arşivlenmiş bir dil korunmuş sayılır."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre bir dilin geleceği hangi anda fiilen belirlenir?",
        options: [
          "Resmî alanlardan çekildiğinde",
          "Çocuklara aktarımın kesildiği anda",
          "Sözlüğü yayımlandığında",
          "Yazıya geçirildiğinde"
        ],
        correctIndex: 1,
      },
      {
        question: "Yalnızca arşivlenmiş bir dil için metinde hangi benzetme yapılmıştır?",
        options: [
          "Kapalı bir kütüphane",
          "Müzedeki bir nesne gibi korunur ama yaşamaz",
          "Kurumuş bir ağaç",
          "Bozuk bir saat"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 8,
  },
  {
    id: 'mi-15',
    paragraph: "Şirketler için kârlılık, varlığını sürdürmenin temel koşuludur. Ancak kârlılığın hangi zaman ölçeğinde değerlendirildiği, alınan kararların yönünü tamamen değiştirir. Kısa vadeli sonuçlara odaklanan bir yönetim, üç aylık raporlarda iyi görünmek için araştırma ve geliştirme bütçesini kesebilir. Bu kesinti, kısa vadede kârı yükseltir; çünkü gider azalır ve etkisi hemen görünür.\n\nSorun, bu tasarrufun maliyetinin gecikmeli ortaya çıkmasıdır. Yenilikçilik kapasitesi bir anda kaybolmaz; kademeli olarak aşınır. Deneyimli ekipler dağılır, uzun soluklu projeler yarım kalır ve şirket kendi alanındaki teknik gelişmeleri izleyemez hâle gelir. Rakipler yeni bir teknolojiyle piyasaya girdiğinde ise açığı kapatmak, kesilen bütçeden çok daha pahalıya mal olur.\n\nBu durum, ölçüm sorunuyla da ilgilidir. Kesilen giderin etkisi hemen ölçülebilirken, yapılmayan bir yatırımın maliyeti raporlarda görünmez. Bu görünmezlik, kısa vadeli kararları sistematik olarak cazip kılar.\n\nBunun tersi de bir risktir. Sonuç üretmeyen projelere süresiz kaynak aktarmak, şirketin bugünkü sağlığını tehlikeye atar. Uzun vadeli yatırım, denetimsiz harcama anlamına gelmez; ilerlemenin düzenli değerlendirilmesi ve sonuç vermeyen yönlerin kapatılması gerekir.\n\nDolayısıyla sürdürülebilir büyüme, bu iki uç arasında bilinçli bir denge kurmayı gerektirir. Bugünün nakit akışını korurken geleceğin kapasitesini de beslemek, yönetimin en zor kararlarından biridir.\n\nBu dengeyi kuran şirketlerin ortak özelliği, yatırımları tek bir sonuç ölçütüyle değil, farklı zaman ölçeklerine göre ayrı ayrı değerlendirmeleridir.\n\nBu dengeyi zorlaştıran bir etken de teşvik yapısıdır. Yöneticilerin performansı çoğu zaman kısa dönemli sonuçlara göre değerlendirilir; uzun vadeli yatırımın meyvesi ise genellikle başka bir yönetim döneminde ortaya çıkar. Bu durum, rasyonel davranan bir yöneticiyi bile kısa vadeli tercihlere yöneltebilir.\n\nBazı şirketler bu sorunu, değerlendirme ölçütlerini çeşitlendirerek aşmaya çalışıyor. Kârlılığın yanına yeni ürün geliştirme hızı, çalışan sürekliliği ve müşteri memnuniyeti gibi göstergeler ekleniyor. Bu göstergeler tek başına yeterli değil; ancak yalnızca üç aylık kâra bakan bir sistemin yarattığı yönlendirmeyi dengeliyor. Ölçtüğünüz şeyin yönettiğiniz şey hâline geldiği gözlemi, bu tercihin arkasındaki temel gerekçedir. Bu nedenle sürdürülebilir büyüme, tek bir doğru formülle değil, şirketin bulunduğu sektöre ve olgunluk düzeyine göre değişen bir ayarla sağlanır. Hızlı değişen bir alanda yatırımı kesmek çok daha riskliyken, olgunlaşmış ve teknolojisi yerleşmiş bir alanda aynı tercih makul olabilir. Yöneticinin işi, bu ayarın nerede durduğunu düzenli aralıklarla yeniden değerlendirmektir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Kısa vadeli kâr her zaman en doğru stratejidir.",
          "Sürdürülebilir büyüme, bugünkü nakit akışı ile geleceğin kapasitesi arasında bilinçli bir denge kurmayı gerektirir.",
          "Araştırma geliştirme yatırımları sınırsız olmalıdır.",
          "Rakipler asla yeni teknoloji geliştiremez."
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre kısa vadeli kararları sistematik olarak cazip kılan ölçüm sorunu nedir?",
        options: [
          "Giderlerin hiç ölçülememesi",
          "Kesilen giderin etkisi ölçülebilirken yapılmayan yatırımın maliyetinin raporlarda görünmemesi",
          "Kârın yanlış hesaplanması",
          "Vergi oranlarının değişmesi"
        ],
        correctIndex: 1,
      },
      {
        question: "Metinde uzun vadeli yatırımın riski nasıl tanımlanmıştır?",
        options: [
          "Hiçbir riski yoktur",
          "Sonuç üretmeyen projelere süresiz kaynak aktarmak bugünkü sağlığı tehlikeye atar",
          "Yalnızca küçük şirketleri etkiler",
          "Rakipleri güçlendirir"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 8,
  },
  {
    id: 'mi-16',
    paragraph: "Bir ekosistemde tek bir türün yok olması, ilk bakışta sınırlı bir kayıp gibi görünebilir. Oysa türler birbirine besin zinciri, rekabet ve ortak yaşam ilişkileriyle bağlıdır. Bir bağlantının kopması, doğrudan ilişkili olmayan türlere kadar uzanan kademeli etkiler doğurabilir. Bilim insanları bu duruma basamaklı etki adını veriyor.\n\nEn bilinen örnekler üst düzey avcıların kaybıyla ilgilidir. Bir avcının ortadan kalkması, avladığı otçul türün hızla çoğalmasına yol açar. Artan otlatma baskısı bitki örtüsünü zayıflatır; bitki örtüsünün azalması toprağı erozyona açık hâle getirir ve sonuçta akarsuların yatağı bile değişebilir. Zincirin başındaki tek bir kayıp, birkaç adım sonra fiziksel çevreyi dönüştürür.\n\nEtki her zaman bu kadar görünür de olmaz. Bir tozlayıcı böceğin azalması, bağlı olduğu bitki türünün üremesini yavaşlatır; bu bitkiden beslenen canlılar da zamanla etkilenir. Değişim yıllar içinde biriktiği için nedeni geriye dönük olarak saptamak zorlaşır.\n\nBu nedenle koruma çalışmalarının yalnızca nesli tükenmekte olan tek tek türlere odaklanması yetersiz kalır. Bir türü kurtarmak, yaşadığı ortam ve bağlı olduğu ilişkiler korunmadıkça kalıcı sonuç vermez.\n\nAyrıca hangi türün ne kadar kritik olduğunu önceden kestirmek her zaman mümkün değildir. Görünürde sıradan bir tür, ekosistemde beklenmedik ölçüde belirleyici bir rol üstleniyor olabilir. Bu belirsizlik, seçici koruma yaklaşımını riskli kılar.\n\nSonuç olarak etkili koruma, tek tek türleri değil, ilişkileriyle birlikte bütün bir sistemi hedeflemelidir.\n\nKoruma çalışmalarında son yıllarda öne çıkan bir yaklaşım, tek tek türler yerine bağlantı alanlarını korumaktır. Parçalanmış yaşam alanları arasında geçiş koridorları oluşturmak, türlerin hareket edebilmesini ve genetik çeşitliliğin sürmesini sağlar. Küçük ve birbirinden kopuk alanlarda kalan popülasyonlar, sayıca yeterli görünse bile uzun vadede zayıflayabilir.\n\nBu yaklaşımın uygulanması ise idari olarak zordur. Koridorlar çoğu zaman farklı mülkiyet ve yönetim alanlarından geçer; tarım arazileri, yollar ve yerleşimlerle kesişir. Bu nedenle başarılı örneklerin ortak yanı, koruma hedefini yerel geçim kaynaklarıyla çelişmeyecek biçimde tasarlamaktır. Yerel halkın sürecin dışında bırakıldığı planlar, kâğıt üzerinde doğru olsa bile sahada uygulanamıyor. Bu nedenle son yıllarda koruma planları giderek daha çok uzun vadeli izlemeye dayandırılıyor. Bir alanın durumu tek bir ölçümle değil, yıllara yayılan düzenli gözlemlerle değerlendiriliyor; çünkü ekosistemlerdeki değişimin çoğu yavaş ilerliyor ve kısa süreli veriler yanıltıcı olabiliyor. Erken fark edilen bir eğilim ise çoğu zaman çok daha düşük maliyetle düzeltilebiliyor.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Tek bir türün kaybı ekosistemi hiç etkilemez.",
          "Koruma çalışmaları sadece popüler türlere odaklanmalıdır.",
          "Bir türün kaybı basamaklı etkiler yarattığından koruma, ilişkileriyle birlikte tüm sistemi hedeflemelidir.",
          "Basamaklı etki sadece deniz ekosistemlerinde görülür."
        ],
        correctIndex: 2,
      },
      {
        question: "Metinde verilen üst düzey avcı örneğinde zincir nasıl ilerler?",
        options: [
          "Avcı kaybı doğrudan iklimi değiştirir",
          "Otçul çoğalır, bitki örtüsü zayıflar, erozyon artar ve akarsu yatağı bile değişebilir",
          "Bitki örtüsü güçlenir ve toprak zenginleşir",
          "Hiçbir zincirleme etki oluşmaz"
        ],
        correctIndex: 1,
      },
      {
        question: "Seçici koruma yaklaşımını riskli kılan belirsizlik nedir?",
        options: [
          "Türlerin sayılamaması",
          "Hangi türün ne kadar kritik olduğunun önceden kestirilememesi",
          "Koruma alanlarının pahalı olması",
          "Türlerin sürekli göç etmesi"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 9,
  },
  {
    id: 'mi-17',
    paragraph: "Merkez bankalarının faiz kararları, çoğu zaman yalnızca kredi ve mevduat faizlerini ilgilendiren teknik bir işlem gibi sunulur. Oysa bu kararların etkisi çok daha geniş bir ağa yayılır. Faiz oranı değiştiğinde, borçlanma maliyeti kadar döviz kuru, konut fiyatları, şirketlerin yatırım planları ve hane halkının harcama kararları da etkilenir.\n\nBu ağın en zor yanı, etkinin anında ortaya çıkmamasıdır. Bir faiz kararının ekonomiye tam olarak yansıması genellikle aylar, bazen bir yıldan uzun sürer. Bu gecikme, karar alma sürecini köklü biçimde değiştirir: politika yapıcılar bugünkü verilere değil, bugün alınan kararın bir yıl sonraki etkisine bakarak karar vermek zorundadır.\n\nBu durum ikili bir hata riski yaratır. Erken davranmak, henüz gerekmeyen bir sıkılaşmayla büyümeyi gereksiz yere yavaşlatabilir. Geç kalmak ise sorunun yerleşmesine izin verip daha sert bir müdahaleyi zorunlu kılar. Her iki hatanın da bedeli aylar sonra görünür hâle gelir.\n\nGecikmenin bir başka sonucu, kararın etkisini değerlendirmenin güçlüğüdür. Aradan geçen sürede başka pek çok etken devreye girdiği için, gözlenen sonucun ne kadarının faiz kararından kaynaklandığını ayırt etmek kolay değildir.\n\nBu belirsizlik nedeniyle iletişim, kararın kendisi kadar önemli hâle gelmiştir. Merkez bankaları yalnızca oranı değil, gerekçelerini ve gelecek öngörülerini de açıklar. Amaç, piyasaların beklentilerini belirli bir çerçeveye oturtmaktır; çünkü beklentiler de sonucu doğrudan etkiler.\n\nSonuç olarak ekonomi yönetimi, kesin sonuçlarla değil olasılıklarla çalışılan bir denge sanatına dönüşür.\n\nBu belirsizlik, kararların nasıl anlatıldığını da etkiliyor. Kesin bir tahmin sunmak kısa vadede güven verici görünse de, tahmin tutmadığında güvenilirliği zedeliyor. Bu nedenle merkez bankaları giderek daha çok olasılık aralıklarıyla konuşuyor ve hangi koşulda ne yapacaklarını önceden tarif etmeyi tercih ediyor.\n\nBu yaklaşım piyasalar açısından da yararlı. Yatırımcılar tek bir sayıdan çok, kararın hangi verilere bağlı olduğunu bilmek istiyor; çünkü bu bilgi kendi planlarını yapmalarını kolaylaştırıyor. Böylece beklenen bir kararın etkisi, karar açıklanmadan önce piyasa fiyatlarına yansıyabiliyor. Bu da ani ve sert dalgalanmaların önüne geçen bir tampon işlevi görüyor. Bu nedenle merkez bankacılığı, teknik bir hesaplama işi olmanın yanında bir güven yönetimi işidir. Alınan kararın etkisi kadar, o kararın nasıl anlaşıldığı da sonucu belirler. Aynı faiz oranı, kamuoyunun kararlılığa inandığı bir ortamda çok daha güçlü, güvenin zayıf olduğu bir ortamda ise çok daha sınırlı bir etki yaratabilir.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Faiz kararlarının etkisi anında ve tek bir alanda görülür.",
          "Merkez bankası kararları geniş bir ekonomik ağı gecikmeli etkiler; bu belirsizlik karar almayı bir denge sanatına dönüştürür.",
          "Döviz kurları faiz oranlarından etkilenmez.",
          "Politika yapıcılar her zaman kesin sonuçlarla karar alır."
        ],
        correctIndex: 1,
      },
      {
        question: "Gecikme nedeniyle politika yapıcılar neye bakarak karar vermek zorundadır?",
        options: [
          "Yalnızca geçmiş yılın verilerine",
          "Bugün alınan kararın bir yıl sonraki etkisine",
          "Yalnızca döviz kuruna",
          "Kamuoyu anketlerine"
        ],
        correctIndex: 1,
      },
      {
        question: "Metne göre kararın etkisini değerlendirmek neden güçtür?",
        options: [
          "Veriler gizli tutulduğu için",
          "Aradan geçen sürede başka pek çok etken devreye girdiği için",
          "Ölçüm araçları olmadığı için",
          "Bankalar açıklama yapmadığı için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 9,
  },
  {
    id: 'mi-18',
    paragraph: "Bilimsel bir teorinin gücü, sıklıkla onu destekleyen kanıtların sayısıyla ölçülür. Oysa bilim felsefesinde daha belirleyici kabul edilen ölçüt farklıdır: bir teorinin değeri, kendisini çürütmeye yönelik ciddi girişimlere ne kadar dayanıklı olduğuyla ilgilidir.\n\nBunun nedeni mantıksaldır. Bir teoriyi destekleyen sonsuz sayıda gözlem bulunabilir; ancak bu gözlemler teoriyi kesin olarak kanıtlamaz. Buna karşılık teorinin öngörüsüyle açıkça çelişen tek bir güvenilir gözlem, teoriyi gözden geçirmeye zorlar. Destek ve çürütme bu yönüyle simetrik değildir.\n\nBuradan çıkan bir ölçüt, teorinin ne kadar riskli öngörülerde bulunduğudur. Her sonuçla uyumlu görünen, hiçbir gözlemin yanlışlayamayacağı bir açıklama güçlü değil, aksine zayıftır; çünkü sınanabilir bir iddiada bulunmamaktadır. Güçlü teoriler, yanlış çıkabilecekleri açık öngörüler ortaya koyar ve bu öngörüler sınandıkça güvenilirlik kazanır.\n\nBu güvenilirlik hiçbir zaman mutlak kesinliğe dönüşmez. Uzun süre başarıyla sınanmış teoriler bile, yeni bir gözlem alanı açıldığında sınırlarının belirlendiğini görebilir. Bu durum teorinin değersiz olduğu anlamına gelmez; genellikle o teorinin belirli koşullar altında hâlâ geçerli, ancak daha genel bir çerçevenin özel bir hâli olduğu anlaşılır.\n\nBu yaklaşımın pratik bir sonucu vardır: bilimde kesinlik iddiası, güçlü değil şüphe uyandıran bir işarettir. Bir iddianın hangi koşullarda yanlış sayılacağını söyleyemeyen bir açıklama, bilimsel tartışmanın dışında kalır.\n\nBu nedenle bilimin ilerlemesi, doğruların biriktirilmesinden çok, yanlışların sistematik biçimde ayıklanmasıyla açıklanır.\n\nBu yaklaşımın gündelik hayatta da karşılığı vardır. Bir iddiayla karşılaşıldığında sorulacak en yararlı soru, onu destekleyen örnekler değil, hangi gözlemin onu yanlışlayacağıdır. Bu soruya yanıt verilemiyorsa, iddia muhtemelen sınanabilir bir nitelik taşımıyordur.\n\nBilimsel çalışmanın toplu yürütülmesi de bu mantığın bir sonucudur. Tek bir araştırmacının kendi hatasını görmesi zordur; bu nedenle sonuçlar yayımlanır, başkaları tarafından tekrarlanmaya çalışılır ve eleştiriye açılır. Bir bulgunun bağımsız ekiplerce tekrarlanamaması, o bulgunun yeniden değerlendirilmesini gerektirir. Bilimi güvenilir kılan şey, tek tek araştırmacıların yanılmazlığı değil, hataları ortaya çıkaran bu ortak denetim düzenidir. Bu düzenin işlemesi, eleştirinin kişisel bir saldırı olarak değil, sürecin doğal bir parçası olarak görülmesine bağlıdır. Bir çalışmanın eksiğinin gösterilmesi, o çalışmayı yapan kişiyi değil, ortaya konan iddiayı hedef alır. Bu ayrımın korunduğu ortamlarda bilgi daha hızlı düzeliyor; korunmadığı ortamlarda ise hatalar çok daha uzun süre ayakta kalabiliyor.",
    questions: [
      {
        question: "Bu metnin ana fikri nedir?",
        options: [
          "Bir teori ne kadar çok kanıtla desteklenirse o kadar kesin kabul edilir.",
          "Bilimsel teoriler asla değişmez.",
          "Bir teorinin gücü çürütme girişimlerine karşı dayanıklılığından gelir ve kesinlik asla mutlak değildir.",
          "Çürütücü kanıtlar bilim tarihinde hiç ortaya çıkmamıştır."
        ],
        correctIndex: 2,
      },
      {
        question: "Metne göre her sonuçla uyumlu görünen bir açıklama neden zayıftır?",
        options: [
          "Çok karmaşık olduğu için",
          "Sınanabilir bir iddiada bulunmadığı için",
          "Yeterince matematik içermediği için",
          "Çok fazla kanıt gerektirdiği için"
        ],
        correctIndex: 1,
      },
      {
        question: "Uzun süre sınanmış bir teorinin sınırlarının belirlenmesi genellikle ne anlama gelir?",
        options: [
          "Teorinin tamamen değersiz olduğu",
          "Teorinin belirli koşullarda hâlâ geçerli, daha genel bir çerçevenin özel hâli olduğu",
          "Bilimin durduğu",
          "Gözlemlerin hatalı olduğu"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 10,
  },
];

export interface KeywordQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface KeywordItem {
  id: string;
  paragraph: string;
  questions: KeywordQuestion[];
  difficulty: DifficultyLevel;
}

export const keywordItems: KeywordItem[] = [
  {
    id: 'kw-01',
    paragraph: "Bugün hava sabahtan beri açıktı. Sabah kahvaltısını erken yaptıktan sonra biraz ders çalıştım, ardından öğleden sonra parka gitmeye karar verdim. Park evimize on dakika uzaklıkta, büyük bir gölün kenarında yer alıyor. Girişte bir dondurmacı vardı ama sıra çok uzundu, o yüzden vazgeçtim.\\n\\nParkın içinde geniş bir yürüyüş yolu bulunuyor. Yolun iki yanına sıralanmış çınar ağaçları gölge yapıyordu. Yürürken yanımdan bisikletli çocuklar geçti. Biraz ileride bir grup insan gölün kenarında oturmuş, ellerindeki ekmek parçalarını ördeklere atıyordu.\\n\\nParkın en kalabalık bölümü ise köpek alanıydı. Burada çok sayıda köpek vardı ve hepsi neşeyle koşuşturuyordu. Küçük bir beyaz köpek, sahibinin attığı topun peşinden defalarca koştu ve her seferinde geri getirdi. Bir başkası ise gölgede uzanmış, çevresinde olan biteni hiç umursamadan uyuyordu.\\n\\nBir bankta oturup yanımda getirdiğim kitabı okumaya başladım. Ancak çevredeki hareketlilik yüzünden pek konsantre olamadım. Sonunda kitabı kapatıp sadece etrafı izlemeye karar verdim. Uzaktan bir müzik sesi geliyordu; sonradan öğrendim ki parkın diğer ucunda küçük bir konser hazırlığı varmış.\\n\\nGüneş batmaya başlayınca hava biraz serinledi. Dönüş yolunda markete uğrayıp akşam yemeği için birkaç şey aldım. Eve vardığımda saat yediyi geçiyordu. Yorulmuştum ama iyi bir gün geçirdiğimi düşünüyordum. Yarın hava yine güzel olursa aynı parka gitmeyi planlıyorum; bu kez yanıma kitap yerine bir defter almayı düşünüyorum.\n\nEve döndüğümde ayakkabılarımın tamamen tozlandığını fark ettim. Park yolunun bir bölümü asfaltsızdı ve yaz sıcağında toprak iyice kurumuştu. Ayakkabıları balkona çıkarıp fırçaladım.\\n\\nAkşam yemeğinden sonra gün içinde çektiğim fotoğraflara baktım. Çoğu bulanık çıkmıştı; çünkü hareket hâlindeki köpekleri yakalamak sandığımdan zormuş. Yine de göl üzerindeki gün batımını gösteren birkaç kare güzel olmuştu. Bunlardan birini kardeşime gönderdim, o da hafta sonu benimle gelmek istediğini söyledi.\\n\\nYatmadan önce ertesi gün için hava durumuna baktım. Öğleden sonra hafif yağmur ihtimali görünüyordu ama sabah saatleri açıktı. Bu yüzden erken çıkmaya karar verdim. Parka gitmeyi bir alışkanlık hâline getirirsem hem düzenli yürümüş olacağım hem de gün içinde ekran karşısında geçirdiğim süre azalacak.",
    questions: [
      {
        question: "Metinde parkta çok sayıda bulunduğu belirtilen hayvan hangisidir?",
        options: ["Kedi", "Ördek", "Köpek", "At"],
        correctIndex: 2,
      },
      {
        question: "Yürüyüş yolunun iki yanında hangi ağaçlar sıralanmıştı?",
        options: ["Çam", "Çınar", "Kavak", "Söğüt"],
        correctIndex: 1,
      },
      {
        question: "Yazar dondurma almaktan neden vazgeçti?",
        options: ["Parası yoktu", "Sıra çok uzundu", "Dondurmacı kapalıydı", "Hava soğuktu"],
        correctIndex: 1,
      }
    ],
    difficulty: 1,
  },
  {
    id: 'kw-02',
    paragraph: "Yaz tatili planlarımızı geçen hafta yaptık. Uzun bir tartışmadan sonra bu yıl Antalya'ya gitmeye karar verdik. Aslında ilk başta Bodrum düşünülmüştü, ancak fiyatların yüksek olması ve yolun uzunluğu bizi vazgeçirdi. Antalya'ya uçakla gitmek hem daha hızlı hem de daha ekonomik göründü.\\n\\nKonaklama için deniz kenarında küçük bir otel bulduk. Otelin balkonundan denizin göründüğü söyleniyor; fotoğraflarda öyle duruyordu en azından. Rezervasyonu babam yaptı ve altı gecelik kaldık. Tatilin ilk günü dinlenmeye ayrılacak, sonraki günlerde gezmeye çıkacağız.\\n\\nPlanımıza göre orada denize gireceğiz, bol bol güneşleneceğiz ve çevredeki tarihi yerleri gezeceğiz. Özellikle antik tiyatroyu görmek istiyorum; öğretmenimiz derste anlatmıştı ve o zamandan beri merak ediyordum. Ayrıca şelaleye de gitmeyi planlıyoruz, ancak oraya ulaşmak için araç kiralamamız gerekebilir.\\n\\nAnnem yanımıza mutlaka şapka ve güneş kremi almamız gerektiğini söylüyor. Geçen yıl deniz kenarında uzun süre kaldığımız için hepimiz yanmıştık; bu kez daha dikkatli olacağız. Kardeşim ise en çok deniz üzerindeki etkinlikleri merak ediyor.\\n\\nDönüşte akrabalarımıza götürmek için hediyelik bir şeyler almayı düşünüyoruz. Yörenin portakalı meşhurmuş, belki ondan alırız. Tatile daha üç hafta var ama şimdiden valizleri hazırlamaya başladık bile. Herkesin yanına ne alacağını yazdığı bir liste hazırladık; böylece son gün acele etmek zorunda kalmayacağız.\n\nUçak biletlerini geçen hafta aldık. Sabah erken kalkan bir sefer seçtik; böylece varış günü de neredeyse tam gün olarak kullanılabilecek. Havalimanına gidiş için de bir plan yaptık, çünkü sabahın o saatinde toplu taşıma seferleri seyrek oluyor.\\n\\nOtelin yorumlarını tek tek okuduk. Çoğu olumluydu; ancak birkaç kişi sabah kahvaltısının erken bittiğinden şikâyet etmişti. Bu yüzden kahvaltıya geç kalmamaya dikkat edeceğiz.\\n\\nAnnem gitmeden önce yapılacaklar listesi hazırladı. Elektrikli aletlerin fişlerinin çekilmesi, çiçeklerin komşuya emanet edilmesi ve kapının kontrolü bu listede yer alıyor. Geçen yıl dönüşte çiçeklerin bir kısmı kurumuştu; bu yüzden bu kez sulama işini önceden konuştuk. Kardeşim ise valizine kaç tişört alacağını hâlâ karar veremedi. Valizleri erken hazırlamanın bir faydası da unutulan şeyleri fark etmek için zaman kalması. Geçen sene şarj aletini unuttuğumuz için orada yenisini almak zorunda kalmıştık; bu kez listeye onu da yazdık ve valizin dış cebine koyduk.",
    questions: [
      {
        question: "Metinde tatil için hangi şehre gidileceği belirtiliyor?",
        options: ["İzmir", "Antalya", "Bodrum", "Aydın"],
        correctIndex: 1,
      },
      {
        question: "Bodrum'dan neden vazgeçildi?",
        options: [
          "Hava durumu kötü olduğu için",
          "Fiyatların yüksek olması ve yolun uzunluğu nedeniyle",
          "Otel bulunamadığı için",
          "Aile istemediği için"
        ],
        correctIndex: 1,
      },
      {
        question: "Yazarın özellikle görmek istediği yer nedir?",
        options: ["Şelale", "Antik tiyatro", "Müze", "Liman"],
        correctIndex: 1,
      }
    ],
    difficulty: 2,
  },
  {
    id: 'kw-03',
    paragraph: "Pazar sabahları evimizde kahvaltı her zaman geç başlar. Hafta içi herkes aceleyle çıktığı için ancak pazar günü aynı masada buluşabiliyoruz. Bu yüzden pazar kahvaltısı bizim için sadece bir öğün değil, haftanın tek uzun sohbeti sayılır.\\n\\nBu haftaki kahvaltıda masada yumurta, birkaç çeşit peynir, siyah zeytin, domates ve salatalık vardı. Annem ayrıca fırından yeni çıkmış sıcak ekmek almıştı. Babam her zamanki gibi çayı demlemişti; ancak bu kez benim isteğim üzerine taze sıkılmış portakal suyu da hazırladı. Kardeşim reçel olmadan kahvaltı yapmayı sevmediği için dolaptan vişne reçelini çıkardı.\\n\\nMasaya oturduğumuzda saat ondu. Konuşa konuşa uzun süre kalktığımızı fark etmedik. Önce okulda geçen haftadan konuştuk, sonra yaz için düşünülen planlar gündeme geldi. Babam gençliğinde yaptığı bir yolculuğu anlattı; daha önce hiç duymadığımız bir hikâyeydi.\\n\\nKahvaltı bittiğinde masayı birlikte topladık. Bulaşıkları kardeşimle paylaştık; o yıkadı, ben kuruladım. Annem bu sırada öğle yemeği için hazırlık yapmaya başlamıştı bile.\\n\\nÖğleden sonra kısa bir yürüyüşe çıkmayı planlıyorduk ama hava kapandığı için evde kaldık. Bunun yerine oturma odasında hep birlikte eski fotoğraf albümlerine baktık. Bazı fotoğrafların ne zaman çekildiğini kimse tam hatırlayamadı ve bu da uzun bir tartışmaya dönüştü. Akşama doğru herkes kendi işine döndü, ama o sabahki masa uzun süre aklımda kaldı.\n\nÖğleden sonra hava kapansa da akşama doğru yeniden açtı. Balkondan bakıldığında gökyüzü tamamen temizlenmişti. Annem bu havayı değerlendirip pencereleri havalandırmak için açtı.\\n\\nAkşam yemeği için çorba ve fırında sebze hazırlandı. Kahvaltıdan artan peyniri de yanına koyduk. Sofra kalabalık değildi ama sabahki neşeli hava akşam da sürdü.\\n\\nYemekten sonra kardeşim ödevlerine oturdu, ben de pazar günü bitirmeyi planladığım kitabı okumaya devam ettim. Bu kez sessiz bir ortam olduğu için hızlı ilerledim. Babam ise mutfakta çayı yeniden tazeledi. Pazar günleri hep böyle geçer bizde: sabah geç başlar, akşam sakin biter ve hafta içinin telaşı ancak pazartesi sabahı yeniden başlar. Bulaşıkları bitirdikten sonra mutfağın penceresini açık bıraktık. İçerisi kahvaltıdan sonra biraz ısınmıştı ve temiz hava iyi geldi. Pazar akşamları evin bu sakinliği, hafta içinin telaşından sonra herkese iyi geliyor gibi görünüyor.",
    questions: [
      {
        question: "Kahvaltıda yazarın isteği üzerine hazırlanan içecek hangisidir?",
        options: ["Çay", "Kahve", "Taze sıkılmış portakal suyu", "Süt"],
        correctIndex: 2,
      },
      {
        question: "Kardeşi dolaptan hangi reçeli çıkardı?",
        options: ["Çilek", "Kayısı", "Vişne", "İncir"],
        correctIndex: 2,
      },
      {
        question: "Öğleden sonraki yürüyüş planı neden iptal edildi?",
        options: [
          "Herkes yorgun olduğu için",
          "Hava kapandığı için",
          "Misafir geldiği için",
          "Araba bozulduğu için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 2,
  },
  {
    id: 'kw-04',
    paragraph: "Büyükannemin evinin arkasında küçük ama çok bakımlı bir bahçe var. Her ilkbaharda burası tamamen değişir. Kışın çıplak duran dallar birkaç hafta içinde yeşerir ve bahçe bambaşka bir yer hâline gelir.\\n\\nBu yıl bahçede kırmızı güller ve sarı papatyalar açmıştı. Güller duvarın dibindeki sırada, papatyalar ise bahçenin ortasındaki küçük tarhta yer alıyor. Büyükannem gülleri çok sever; her sabah ilk işi onları sulamak olur. Papatyaların bakımı ise daha kolaymış, çünkü daha az su istiyorlarmış.\\n\\nBahçenin köşesinde bir de erik ağacı bulunuyor. Ağaç henüz meyve vermemiş, ancak dallarında küçük tomurcuklar görünüyordu. Büyükannem bu yıl bol ürün alacağını düşünüyor.\\n\\nSabah saatlerinde bahçede sürekli bir hareket oluyor. Arılar çiçekten çiçeğe uçuyor, ara sıra bir kelebek geçiyor ve duvarın dibindeki karıncalar hiç durmadan bir aşağı bir yukarı gidip geliyor. Büyükannem arıları çok önemsiyor; onlar olmazsa meyve alamayacağımızı söylüyor. Bu yüzden bahçede hiçbir zaman ilaç kullanmıyor.\\n\\nÖğleden sonra ise bahçe sessizleşiyor. Sıcak bastırdığında böcekler bile azalıyor. O saatlerde büyükannem gölgedeki sandalyesine oturup çayını içiyor.\\n\\nBiz her gittiğimizde bahçede bir işe yardım ediyoruz. Bazen kuru dalları topluyoruz, bazen tohum ekiyoruz. Geçen hafta duvarın önüne birkaç fesleğen fidesi diktik. Büyükannem fesleğenin hem güzel koktuğunu hem de bazı böcekleri uzak tuttuğunu söyledi.\n\nBahçenin bir köşesinde küçük bir su kabı duruyor. Büyükannem bunu kuşlar için koyduğunu söylüyor ve her sabah suyunu tazeliyor. Özellikle sıcak günlerde kabın çevresinde sürekli bir hareket oluyor.\\n\\nDuvarın dibinde ise eski bir ahşap sandık var. İçinde bahçe aletleri saklanıyor: küçük bir kürek, makas ve birkaç eldiven. Büyükannem her işten sonra aletleri temizleyip yerine koyuyor; böylece hiçbir zaman aradığını bulamamak gibi bir sorun yaşamıyor.\\n\\nGeçen yıl bahçenin bir bölümüne domates ve biber dikilmişti. Bu yıl aynı yere farklı bir sebze ekmeyi planlıyor. Toprağın her yıl aynı bitkiyle yorulmaması gerektiğini, bu yüzden yerlerin değiştirilmesinin iyi olduğunu anlattı. Biz de gelecek sefer geldiğimizde ekim işine yardım edeceğiz. Bahçeden çıkarken büyükannem her seferinde birkaç dal kesip bize veriyor. Bu kez elimize birer demet papatya tutuşturdu. Eve gelince onları bir bardağın içine koyduk; birkaç gün boyunca masanın üzerinde durdular ve odayı hoş bir kokuyla doldurdular.",
    questions: [
      {
        question: "Metinde çiçekten çiçeğe uçtuğu belirtilen böcek hangisidir?",
        options: ["Kelebek", "Arı", "Karınca", "Sinek"],
        correctIndex: 1,
      },
      {
        question: "Bahçenin köşesinde hangi ağaç bulunuyor?",
        options: ["Elma", "Erik", "Kiraz", "Ceviz"],
        correctIndex: 1,
      },
      {
        question: "Büyükanne bahçede neden hiç ilaç kullanmıyor?",
        options: [
          "İlaç pahalı olduğu için",
          "Arıları önemsediği ve onlar olmadan meyve alınamayacağını düşündüğü için",
          "İlaç bulamadığı için",
          "Bahçe çok küçük olduğu için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 1,
  },
  {
    id: 'kw-05',
    paragraph: "Okulumuzda her yıl bahar aylarında bir kermes düzenlenir. Bu yılki kermes geçen cumartesi okulun bahçesinde yapıldı. Hazırlıklar aslında iki hafta önce başlamıştı; sınıflar kendi aralarında görev paylaşımı yapmış, kimler hangi masada duracak önceden belirlenmişti.\\n\\nKermeste öğrenciler el yapımı takılar, kendi çizdikleri resimler ve evden getirdikleri kitaplar sattı. Bizim sınıf ikinci el kitap masasını üstlendi. Kitapların çoğu evlerden toplanmıştı ve fiyatları oldukça düşük tutulmuştu. En çok ilgi gören masa ise pasta ve kurabiye masası oldu; öğle olmadan neredeyse her şey tükenmişti.\\n\\nHava sabah biraz kapalıydı ve yağmur ihtimali herkesi endişelendirdi. Bu yüzden masaların üzerine tente kuruldu. Neyse ki öğleye doğru güneş açtı ve bahçe iyice kalabalıklaştı. Veliler ve mahalleden gelen komşular da alışveriş yaptı.\\n\\nGün sonunda toplanan gelir sayıldı. Beklenenden fazla çıkmıştı. Okul yönetimi bu gelirin kütüphaneye yeni kitaplar almak için kullanılacağını duyurdu. Kütüphanedeki bazı kitaplar yıllardır kullanıldığı için yıpranmıştı; ayrıca öğrencilerin istediği yeni kitaplar da eksikti.\\n\\nÖğretmenimiz, hangi kitapların alınacağına öğrencilerin karar vermesini önerdi. Bunun için sınıflara birer liste dağıtıldı ve herkes okumak istediği kitapları yazdı. Listeler toplandıktan sonra en çok istenen kitaplar belirlenecek.\\n\\nKermes akşam saatlerinde sona erdi. Toplanma işi biraz uzun sürdü ama kimse şikâyet etmedi. Gelecek yıl daha büyük bir organizasyon yapmayı şimdiden konuşmaya başladık.\n\nKermes hazırlıkları sırasında en çok zorlanılan konu fiyatlandırma oldu. Öğrenciler ürünlere ne kadar fiyat biçeceklerini uzun süre tartıştı. Sonunda öğretmenlerin önerisiyle sabit ve düşük fiyatlar belirlendi; böylece herkes alışveriş yapabildi.\\n\\nSatış sırasında para takibi için her masaya bir defter verildi. Satılan her ürün deftere yazıldı ve gün sonunda toplam tutar bu kayıtlarla karşılaştırıldı. Küçük bir fark çıktı ama nedeni kısa sürede bulundu.\\n\\nKermeste ayrıca bir de resim köşesi kuruldu. Küçük sınıflardaki öğrenciler burada boyama yaptı. Bu köşe planlanmamıştı; son gün bir öğretmenin önerisiyle eklendi ve beklenmedik biçimde en çok vakit geçirilen yer oldu. Gelecek yıl bu bölümün daha geniş tutulması kararlaştırıldı. Kermes bittikten sonra öğretmenimiz herkese teşekkür eden kısa bir konuşma yaptı. Bu tür etkinliklerin asıl kazancının toplanan para değil, birlikte çalışma deneyimi olduğunu söyledi. Sınıfça bu görüşe katıldığımızı düşünüyorum.",
    questions: [
      {
        question: "Kermesten toplanan gelir ne için kullanılacaktı?",
        options: [
          "Yeni sıralar almak için",
          "Kütüphaneye kitap almak için",
          "Spor malzemesi almak için",
          "Bahçe düzenlemesi için"
        ],
        correctIndex: 1,
      },
      {
        question: "En çok ilgi gören masa hangisiydi?",
        options: ["Kitap masası", "Pasta ve kurabiye masası", "Takı masası", "Resim masası"],
        correctIndex: 1,
      },
      {
        question: "Alınacak kitaplara nasıl karar verilecek?",
        options: [
          "Okul yönetimi tek başına seçecek",
          "Sınıflara dağıtılan listelerle öğrencilerin istekleri toplanacak",
          "Kütüphaneci karar verecek",
          "Veliler oylayacak"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 3,
  },
  {
    id: 'kw-06',
    paragraph: "Dedemin köydeki günü hep aynı saatte başlardı. Sabah ezanından önce kalkar, önce bahçeye çıkardı. Bahçede sıra sıra dikilmiş elma ağaçları vardı; bunları teker teker sulamak günün ilk işiydi. Su, bahçenin ucundaki küçük havuzdan gelirdi ve dedem hortumu her ağacın dibinde birkaç dakika tutardı.\\n\\nSulama bittikten sonra kümese giderdi. Tavuklara yem verir, yumurtaları toplar ve kümesin kapısını gün boyunca açık bırakırdı. Tavukların bahçede serbest dolaşmasının hem onlar hem toprak için iyi olduğunu söylerdi. Yumurtaları küçük bir sepette eve getirir, anneannem de bunları kahvaltıda kullanırdı.\\n\\nKuşluk vakti kısa bir mola verirdi. Bu molada genellikle bir bardak çay içer, radyoda haberleri dinlerdi. Ardından bahçedeki diğer işlere dönerdi: kuru dalları budamak, otları temizlemek ya da sebze tarhını çapalamak.\\n\\nÖğleden sonra ise komşularıyla buluşurdu. Köy kahvesinin önündeki tahta bankta oturup uzun uzun sohbet ederlerdi. Konu çoğu zaman hava durumu ve hasat olurdu. Dedem yağmurun ne zaman yağacağını bulutlara bakarak tahmin ettiğini söylerdi ve şaşırtıcı biçimde çoğu zaman haklı çıkardı.\\n\\nAkşamüstü eve döner, hayvanların son kontrolünü yapardı. Karanlık basmadan kümesin kapısını kapatmayı hiç unutmazdı.\\n\\nBiz yazları köye gittiğimizde onun bu düzenine katılmaya çalışırdık. İlk günler erken kalkmak zor gelirdi, ama birkaç gün sonra alışırdık. Dedem bize hangi ağacın ne kadar suya ihtiyacı olduğunu tek tek anlatırdı.\n\nDedemin evinin arkasında küçük bir depo vardı. Burada hasat zamanı toplanan ürünler saklanırdı. Deponun havalandırması için üst kısımda küçük bir pencere bulunurdu ve bu pencere yaz kış açık kalırdı.\\n\\nSonbaharda işler değişirdi. Elmalar toplanır, sağlam olanlar ayrı, ezilmiş olanlar ayrı sepetlere konurdu. Ezilenler bekletilmez, aynı gün değerlendirilirdi. Dedem bu ayrımı yapmayı bize öğretmişti; bir tek çürük elmanın sepetin tamamını bozabileceğini söylerdi.\\n\\nKış aylarında ise bahçe işi azalır, dedemin günü kısalırdı. Yine de her sabah bahçeye çıkar, ağaçların durumuna bakardı. Kar yağdığında dalların üzerindeki karı silkelerdi; ağırlığın dalları kırabileceğini söylerdi. Bu küçük alışkanlıkların hepsinin bir nedeni vardı ve o nedeni sorduğumuzda mutlaka anlatırdı. Köyden dönerken dedem her defasında bize bir sepet elma verirdi. Sepeti arabaya koyarken hangilerinin daha çabuk tüketilmesi gerektiğini de ayrıca söylerdi. Bu küçük ayrıntıya bile dikkat etmesi bize her seferinde ilginç gelirdi.",
    questions: [
      {
        question: "Dedem sabahları hangi hayvanlara yem verirdi?",
        options: ["Koyunlara", "Tavuklara", "Keçilere", "İneklere"],
        correctIndex: 1,
      },
      {
        question: "Günün ilk işi neydi?",
        options: [
          "Yumurtaları toplamak",
          "Elma ağaçlarını sulamak",
          "Radyo dinlemek",
          "Komşularla sohbet etmek"
        ],
        correctIndex: 1,
      },
      {
        question: "Dedem yağmuru neye bakarak tahmin ettiğini söylerdi?",
        options: ["Rüzgarın yönüne", "Bulutlara", "Hayvanların davranışına", "Takvime"],
        correctIndex: 1,
      }
    ],
    difficulty: 3,
  },
  {
    id: 'kw-07',
    paragraph: "Fabrikada ayakkabı üretimi birbirini izleyen aşamalardan oluşuyor. İlk aşamada deri ve kumaş rulolar hâlinde kesim bölümüne geliyor. Burada kalıplar kullanılarak parçalar çıkarılıyor. Kesim sırasında oluşan fireyi azaltmak için parçalar bilgisayar destekli bir yerleşim planına göre diziliyor.\\n\\nKesilen parçalar dikim bölümüne aktarılıyor. Bu bölüm fabrikanın en kalabalık kısmı; her makine belirli bir dikiş türü için ayrılmış. Dikimi biten üst parçalar, taban montaj hattına gidiyor. Tabanın yapıştırılması ısı ve basınç gerektirdiği için bu aşama özel preslerde yapılıyor.\\n\\nMontajdan çıkan ayakkabılar doğrudan paketlenmiyor. Önce kalite kontrol bölümüne alınıyor. Burada dikişlerin düzgünlüğü, taban yapışmasının sağlamlığı ve renk farkı kontrol ediliyor. Kusurlu bulunanlar ayrı bir bölüme alınıp mümkünse düzeltiliyor, düzeltilemeyenler ise ikinci kalite olarak ayrılıyor.\\n\\nKalite kontrolden geçen ürünler kutulanıp paletlere yerleştiriliyor. Ardından büyük kamyonlarla şehir dışındaki merkez depoya gönderiliyor. Bu depo, farklı şehirlerdeki mağazaların siparişlerini toplayan bir dağıtım noktası olarak çalışıyor. Ürünler doğrudan mağazalara değil, önce buraya geliyor.\\n\\nDepoda her ürünün barkodu okutularak stoğa işleniyor. Mağazalardan gelen siparişler günlük olarak toplanıyor ve akşam saatlerinde çıkış yapan araçlarla dağıtılıyor.\\n\\nBu düzenin en büyük avantajı, stok takibinin tek merkezden yapılabilmesi. Bir mağazada tükenen bir numara, başka bir mağazada fazlaysa aktarma yapılabiliyor. Böylece hem gereksiz üretim önleniyor hem de müşteri talebi daha hızlı karşılanabiliyor.\n\nFabrikada vardiya düzeni de üretimin bir parçası olarak planlanıyor. Kesim ve dikim bölümleri gün boyunca çalışırken, montaj hattı yoğunluğa göre ikinci vardiyaya geçebiliyor. Bu esneklik, sipariş miktarındaki dalgalanmaların karşılanmasını sağlıyor.\\n\\nAtık yönetimi de ayrı bir başlık. Kesimden artan deri parçaları toplanıyor ve bir bölümü küçük ürünlerde yeniden kullanılıyor. Kullanılamayan kısımlar ise ayrıştırılarak geri dönüşüme gönderiliyor.\\n\\nSon yıllarda fabrikaya eklenen bir uygulama, her ürüne benzersiz bir kod verilmesi oldu. Bu kod sayesinde bir ayakkabının hangi hatta, hangi vardiyada üretildiği sonradan izlenebiliyor. Bir üründe sorun çıktığında aynı partide üretilen diğer ürünler hızlıca tespit edilebiliyor. Bu da hem şikâyetlerin çözümünü hızlandırıyor hem de hatanın kaynağını bulmayı kolaylaştırıyor. Fabrikada çalışanlar için düzenli eğitimler de yapılıyor. Özellikle yeni makinelerin devreye alındığı dönemlerde bu eğitimler zorunlu tutuluyor. Amaç hem üretim kalitesini korumak hem de iş kazalarını en aza indirmek olarak açıklanıyor.",
    questions: [
      {
        question: "Ayakkabılar kalite kontrolden sonra ilk olarak nereye gönderiliyor?",
        options: [
          "Doğrudan mağazalara",
          "Şehir dışındaki merkez depoya",
          "Fabrika mağazasına",
          "Limana"
        ],
        correctIndex: 1,
      },
      {
        question: "Kesim aşamasında fireyi azaltmak için ne yapılıyor?",
        options: [
          "Daha küçük kalıp kullanılıyor",
          "Parçalar bilgisayar destekli yerleşim planına göre diziliyor",
          "Kesim elle yapılıyor",
          "Kumaş ısıtılıyor"
        ],
        correctIndex: 1,
      },
      {
        question: "Merkez depo düzeninin metinde belirtilen en büyük avantajı nedir?",
        options: [
          "Üretimin hızlanması",
          "Stok takibinin tek merkezden yapılabilmesi ve mağazalar arası aktarma imkânı",
          "İşçi sayısının azalması",
          "Kutulama maliyetinin düşmesi"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 4,
  },
  {
    id: 'kw-08',
    paragraph: "Kontrol muayenesi yaklaşık yarım saat sürdü. Doktor önce tansiyonu ölçtü, ardından son tahlil sonuçlarını tek tek inceledi. Değerlerin çoğu normal aralıktaydı, ancak birkaç sonuç sınırda görünüyordu. Bu yüzden ilaç yazmak yerine önce yaşam düzeninde değişiklik önermeyi tercih etti.\\n\\nİlk önerisi hareketle ilgiliydi. Haftada en az beş gün, yaklaşık yarım saat tempolu yürüyüş yapılmasını istedi. Yürüyüşün aynı saatte yapılmasının alışkanlık kazanmayı kolaylaştıracağını ekledi. Ağır egzersiz gerekmediğini, önemli olanın düzen olduğunu vurguladı.\\n\\nİkinci önerisi beslenmeyle ilgiliydi. Özellikle tuzlu yiyeceklerden uzak durulmasını söyledi. Turşu, salamura ürünler ve hazır çorbaların düşünülenden çok daha fazla tuz içerdiğini anlattı. Yemeğe ek tuz eklememenin bile kısa sürede fark yaratabileceğini belirtti.\\n\\nÜçüncü olarak her gün bol su içilmesini önerdi. Suyun güne yayılmasının, bir seferde çok miktarda içmekten daha faydalı olduğunu söyledi.\\n\\nUyku konusuna da değindi. Düzensiz uykunun tansiyon değerlerini etkileyebildiğini, bu yüzden yatma ve kalkma saatlerinin mümkün olduğunca sabit tutulması gerektiğini anlattı.\\n\\nSon olarak üç ay sonra tekrar kontrole gelinmesini istedi. O tarihte aynı tahlillerin tekrarlanacağını ve değerlerin nasıl değiştiğine bakılacağını söyledi. Eğer düzelme görülmezse ilaç tedavisinin gündeme gelebileceğini de ekledi. Çıkarken bütün önerileri kısa notlar hâlinde bir kâğıda yazıp verdi.\n\nDoktor ayrıca günlük tutulmasını önerdi. Bu günlüğe hem yürüyüş süreleri hem de gün içinde tüketilen yiyecekler kısaca yazılacak. Böylece kontrol muayenesinde önerilerin ne kadar uygulandığı somut olarak görülebilecek.\\n\\nTansiyonun evde de ölçülmesini istedi. Ölçümün her gün aynı saatte ve dinlenmiş hâlde yapılması gerektiğini anlattı. Ayakta ya da hemen hareket sonrası yapılan ölçümlerin yanıltıcı olabileceğini vurguladı.\\n\\nSon olarak sigara ve alkol konusuna değindi. Bu alışkanlıkların tansiyon üzerindeki etkisinin, beslenme değişikliklerinin sağlayacağı faydayı geride bırakabileceğini söyledi. Hastanın soruları üzerine, bırakma sürecinde destek alınabilecek merkezler hakkında da kısa bir bilgi verdi ve ilgili birime yönlendirme yaptı. Randevu sonunda hastaya, önerilerin hepsini aynı anda uygulamaya çalışmasının gerekmediği söylendi. Önce yürüyüşle başlanması, birkaç hafta sonra beslenme değişikliklerinin eklenmesi önerildi. Aynı anda çok fazla değişiklik yapmanın, alışkanlığın kalıcı olmasını zorlaştırdığı hatırlatıldı. Ayrıca bir sonraki randevunun tarihini çıkışta almak gerektiği belirtildi.",
    questions: [
      {
        question: "Doktor hangi tür yiyeceklerden uzak durulmasını söyledi?",
        options: ["Şekerli", "Tuzlu", "Yağlı", "Baharatlı"],
        correctIndex: 1,
      },
      {
        question: "Doktor neden ilaç yazmak yerine önce yaşam düzeni değişikliği önerdi?",
        options: [
          "Hasta ilaç istemediği için",
          "Değerlerin çoğu normal aralıkta, birkaçı sınırda olduğu için",
          "İlaç bulunmadığı için",
          "Hasta çok genç olduğu için"
        ],
        correctIndex: 1,
      },
      {
        question: "Kontrol muayenesi ne zaman tekrarlanacak?",
        options: ["Bir ay sonra", "Üç ay sonra", "Altı ay sonra", "Bir yıl sonra"],
        correctIndex: 1,
      }
    ],
    difficulty: 4,
  },
  {
    id: 'kw-09',
    paragraph: "Kazı çalışmaları geçen ilkbaharda başladı ve üç ay boyunca aralıksız sürdü. Alan, daha önce tarım yapılan bir arazinin kenarında yer alıyordu. Sulama kanalı açılırken çıkan birkaç parça, ekibin buraya yönelmesine neden olmuştu.\\n\\nArkeologlar ilk aşamada yüzey taraması yaptı. Toprağın altındaki yapıları bozmadan görüntülemek için özel cihazlar kullanıldı. Elde edilen görüntülerde düzenli bir yerleşim planına benzeyen izler görüldü ve kazı bu izlerin yoğunlaştığı noktadan başlatıldı.\\n\\nKazı sırasında çok sayıda buluntu ortaya çıktı. Bunların arasında metal aletler, öğütme taşları ve hayvan kemikleri vardı. Ancak ekibin asıl dikkatini seramik parçaları çekti. Bu parçaların yüzeyindeki bezeme, bölgede daha önce hiç kaydedilmemiş bir üsluba sahipti.\\n\\nSeramikler laboratuvara gönderildi. Burada hem kilin bileşimi hem de yapım tekniği incelendi. İlk sonuçlar, kilin bölgeye ait olduğunu ancak tekniğin uzak bir coğrafyayla benzerlik taşıdığını gösterdi. Bu, bölgenin sanılandan daha geniş bir ticaret ağının parçası olabileceği anlamına geliyordu.\\n\\nEkip bu aşamada kesin bir yorum yapmaktan kaçındı. Tek bir buluntu grubuna dayanarak sonuç çıkarmanın yanıltıcı olabileceğini vurguladılar. Benzer parçaların çevredeki başka noktalarda da bulunması gerektiğini belirttiler.\\n\\nKazı gelecek yıl aynı alanda genişletilerek sürdürülecek. Bu kez çalışma, ilk bulguların çıktığı noktanın kuzeyine kaydırılacak. Ekip ayrıca yerel müzeyle iş birliği yaparak buluntuların bir bölümünü sergilemeyi planlıyor.\n\nKazı alanında çalışma yöntemi de ayrı bir titizlik gerektiriyordu. Toprak katman katman kaldırılıyor, her katmanın kalınlığı ve içeriği ayrı ayrı kaydediliyordu. Çıkan her parçanın bulunduğu nokta üç boyutlu olarak işaretleniyordu; çünkü bir buluntunun hangi derinlikte ve hangi parçaların yanında bulunduğu, parçanın kendisi kadar bilgi taşıyor.\\n\\nEkipte arkeologların yanı sıra bir jeolog ve bir de arkeobotanikçi görev aldı. Jeolog toprak katmanlarının oluşum sırasını değerlendirdi. Arkeobotanikçi ise elenen topraktan çıkan tohum kalıntılarını inceledi.\\n\\nBu kalıntılar, bölgede hangi bitkilerin yetiştirildiğine dair ipucu veriyor. İlk incelemeler, tahıl kalıntılarının yoğun olduğunu gösterdi. Bu bulgu, yerleşimin tarıma dayalı olduğu yönündeki tahmini destekliyor ancak tek başına kesin bir sonuç sayılmıyor. Kazı sezonu boyunca alan her akşam örtüyle kapatıldı. Yağmur suyunun açılan katmanlara zarar vermesi ihtimaline karşı bu önlem her gün tekrarlandı. Sezon sonunda ise alan tamamen kapatılarak gelecek yıla hazır hâle getirildi.",
    questions: [
      {
        question: "Arkeologların asıl dikkatini çeken buluntu hangisidir?",
        options: ["Metal aletler", "Seramik parçaları", "Öğütme taşları", "Hayvan kemikleri"],
        correctIndex: 1,
      },
      {
        question: "Laboratuvar sonuçları neyi gösterdi?",
        options: [
          "Kilin de tekniğin de yabancı olduğunu",
          "Kilin bölgeye ait olduğunu ancak tekniğin uzak bir coğrafyayla benzerlik taşıdığını",
          "Parçaların çok yeni olduğunu",
          "Hiçbir sonuç elde edilemediğini"
        ],
        correctIndex: 1,
      },
      {
        question: "Ekip neden kesin bir yorum yapmaktan kaçındı?",
        options: [
          "Yeterli bütçe olmadığı için",
          "Tek bir buluntu grubuna dayanarak sonuç çıkarmanın yanıltıcı olabileceği için",
          "Laboratuvar sonuçları gelmediği için",
          "Kazı izni bitmek üzere olduğu için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 5,
  },
  {
    id: 'kw-10',
    paragraph: "Konser gününün sabahı salon henüz bomboştu. Teknik ekip erken saatte geldi ve hazırlıklar sıkı bir program dahilinde yürütüldü. İlk iş sahnenin kurulumuydu; platformlar yerleştirildi, kablolar zemine sabitlendi ve takılma riski oluşturabilecek noktalar bantla kapatıldı.\\n\\nKurulum tamamlandıktan sonra ses sistemi test edildi. Hoparlörler salonun farklı noktalarına yönlendirildi ve sesin her koltukta dengeli duyulup duyulmadığı kontrol edildi. Bu aşamada birkaç noktada yankı sorunu tespit edildi; hoparlörlerin açısı değiştirilerek sorun giderildi.\\n\\nArdından sahne ışıkları ayarlandı. Işık ekibi, her parça için ayrı bir sahne düzeni hazırlamıştı. Provada bu düzenler sırayla denendi ve geçişlerin zamanlaması kaydedildi. Işıkların müzikle uyumlu değişmesi için bu kayıt kritikti.\\n\\nSanatçılar öğleden sonra geldi ve kısa bir prova yapıldı. Prova sırasında sahne üzerindeki monitör hoparlörlerin seviyesi tek tek ayarlandı; her müzisyen kendi duymak istediği dengeyi belirtti.\\n\\nTeknik ekip son olarak enstrümanların akordunu kontrol etti. Salonun sıcaklığı gün içinde değiştiği için özellikle telli çalgıların akordu kapı açılmadan hemen önce yeniden gözden geçirildi.\\n\\nKapılar akşam yedide açıldı. Salon yarım saat içinde doldu. Konser başlamadan önce ekip son bir kez telsizle birbirine durum kontrolü yaptı. Gece boyunca hiçbir teknik aksaklık yaşanmadı; sadece ikinci bölümün başında bir mikrofon kablosu değiştirildi, o da seyircinin fark etmediği bir anda halledildi.\n\nKonser sonrasında toplanma işlemi de aynı düzenle yürütüldü. Kablolar sarılırken hangi ekipmanın hangi kutuya ait olduğu etiketlerle takip edildi. Bu düzen, ertesi gün başka bir şehirde yapılacak kurulumun hızını doğrudan etkiliyor.\\n\\nEkip ayrıca her konserden sonra kısa bir değerlendirme yapıyor. Yaşanan sorunlar, çözüm biçimleri ve süre kayıpları not ediliyor. Bu notlar bir sonraki organizasyonun planlamasında kullanılıyor.\\n\\nBu kez not edilen tek konu, kapıların açılma saatiyle son provanın çakışmasıydı. Prova birkaç dakika uzadığı için kapılar planlanandan geç açılmıştı. Bir sonraki konserde prova ile kapı açılışı arasına yarım saatlik bir tampon süre konulmasına karar verildi. Ekip lideri, bu tür küçük düzeltmelerin zamanla büyük fark yarattığını söyledi. Ekip lideri ayrıca yeni gelen teknisyenler için kısa bir eğitim yapılmasını önerdi. Kurulum sırasında yaşanan küçük gecikmelerin çoğunun deneyim eksikliğinden kaynaklandığını belirtti. Bu eğitim önümüzdeki turne öncesine planlandı.",
    questions: [
      {
        question: "Teknik ekip en son neyi kontrol etti?",
        options: [
          "Ses sistemini",
          "Sahne ışıklarını",
          "Enstrümanların akordunu",
          "Bilet girişini"
        ],
        correctIndex: 2,
      },
      {
        question: "Ses testinde tespit edilen sorun neydi ve nasıl giderildi?",
        options: [
          "Kablo kopukluğu, kablo değiştirilerek",
          "Yankı sorunu, hoparlörlerin açısı değiştirilerek",
          "Elektrik kesintisi, jeneratörle",
          "Mikrofon arızası, yedek mikrofonla"
        ],
        correctIndex: 1,
      },
      {
        question: "Telli çalgıların akordu neden kapı açılmadan hemen önce yeniden gözden geçirildi?",
        options: [
          "Müzisyenler istediği için",
          "Salonun sıcaklığı gün içinde değiştiği için",
          "Prova uzun sürdüğü için",
          "Yeni enstrüman geldiği için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 5,
  },
  {
    id: 'kw-11',
    paragraph: "Şehir merkezindeki eski tramvay hattı, uzun yıllar kullanılmadan kalmıştı. Raylar asfaltın altında kısmen gömülü durumdaydı ve birçok kişi hattın varlığını bile bilmiyordu. Hattın yeniden değerlendirilmesi fikri, kent tarihi üzerine çalışan bir grubun hazırladığı raporla gündeme geldi.\\n\\nRestorasyon çalışmaları yıllar sürdü. İlk aşamada rayların durumu incelendi; büyük bölümünün değiştirilmesi gerektiği anlaşıldı. Ancak özgün görünümü korumak için yeni raylar eskisiyle aynı ölçülerde üretildi. Aynı hassasiyet duraklarda da gösterildi; eski fotoğraflara bakılarak durak yapıları yeniden inşa edildi.\\n\\nAraçların temini ayrı bir sorun oldu. Depolarda bulunan iki eski vagon onarıldı, ancak bunlar yeterli olmadı. Bu yüzden aynı döneme ait tasarımda yeni araçlar üretildi. Dış görünüm korunurken iç kısımda modern fren ve güvenlik sistemleri kullanıldı.\\n\\nHat, tamamlandığında turistik bir gezi güzergahı olarak hizmete açıldı. Yani günlük ulaşımın bir parçası olarak değil, şehri tanıtan bir gezi hattı olarak planlandı. Güzergâh, tarihi merkezdeki başlıca noktaları birbirine bağlıyor ve tam turu yaklaşık kırk dakika sürüyor.\\n\\nAçılıştan sonra ilgi beklenenin üzerinde oldu. Özellikle hafta sonları uzun kuyruklar oluştu. Bu nedenle sefer sayısı artırıldı ve yoğun saatlerde ikinci bir araç devreye alındı.\\n\\nHattın esnafa etkisi de olumlu oldu. Güzergâh üzerindeki dükkânların müşteri sayısında belirgin bir artış görüldü. Belediye şimdi hattın bir sonraki aşamada limana kadar uzatılmasını değerlendiriyor.\n\nHattın işletmesi belediyeye bağlı bir şirket tarafından yürütülüyor. Biletler hem duraklardaki otomatlardan hem de mevcut şehir kartıyla alınabiliyor. Öğrenci ve altmış beş yaş üstü yolcular için indirimli tarife uygulanıyor.\\n\\nSeferler sabah dokuzda başlıyor, akşam sekizde sona eriyor. Kış aylarında ise kapanış saati erkene alınıyor. Araçların bakımı her gün seferler bittikten sonra yapılıyor; bu bakım için hattın ucunda küçük bir atölye kuruldu.\\n\\nProje kapsamında hat boyunca bilgilendirme panoları da yerleştirildi. Panolarda tramvayın tarihi, eski fotoğraflar ve güzergâhtaki yapılara dair kısa bilgiler yer alıyor. Bu panolar hem yolcular hem de yürüyerek geçenler için hazırlandı. Belediye, panoların içeriğini yılda bir kez güncellemeyi planlıyor. Hattın açılışından bu yana çevredeki birkaç eski bina da restore edildi. Belediye bu binaların cephelerini hattın dokusuna uygun biçimde yenilemek için ayrı bir destek programı başlattı. Böylece güzergâh boyunca bütünlüklü bir görünüm oluşması amaçlanıyor.",
    questions: [
      {
        question: "Eski tramvay hattı yeniden hangi amaçla açıldı?",
        options: [
          "Günlük toplu taşıma için",
          "Turistik gezi güzergahı için",
          "Yük taşımacılığı için",
          "Fuar alanı ulaşımı için"
        ],
        correctIndex: 1,
      },
      {
        question: "Yeni üretilen araçlarda hangi yaklaşım benimsendi?",
        options: [
          "Tamamen modern bir tasarım",
          "Dış görünüm korunurken içeride modern fren ve güvenlik sistemleri kullanıldı",
          "Sadece eski vagonlar onarıldı",
          "Araçlar yurt dışından alındı"
        ],
        correctIndex: 1,
      },
      {
        question: "Açılıştan sonra sefer sayısı neden artırıldı?",
        options: [
          "Araç sayısı fazla olduğu için",
          "İlgi beklenenin üzerinde olduğu ve hafta sonları uzun kuyruklar oluştuğu için",
          "Belediye zorunlu tuttuğu için",
          "Güzergâh uzatıldığı için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 6,
  },
  {
    id: 'kw-12',
    paragraph: "Meteoroloji uzmanları dün akşam saatlerinde bölge için ayrıntılı bir uyarı yayımladı. Uyarıya göre önümüzdeki üç gün boyunca sahil kesimlerinde kuvvetli rüzgar ve yüksek dalga bekleniyor. Rüzgarın saatteki hızının yer yer altmış kilometreyi aşabileceği, dalga yüksekliğinin ise açık denizde üç metreye ulaşabileceği belirtildi.\\n\\nUyarı kapsamında balıkçıların denize açılmaması istendi. Özellikle küçük tekneler için riskin yüksek olduğu vurgulandı. Limanlarda bulunan teknelerin bağlarının kontrol edilmesi ve güvertede sabitlenmemiş malzeme bırakılmaması önerildi.\\n\\nUzmanlar ayrıca kıyıya yakın alanlarda bulunan işletmeleri de uyardı. Deniz kenarındaki tenteler, tabelalar ve şemsiyelerin toplanması istendi. Geçen yıl benzer bir hava olayında bu tür malzemelerin savrularak hasara yol açtığı hatırlatıldı.\\n\\nUlaşımla ilgili de bilgi verildi. Bazı vapur seferlerinin iptal edilebileceği, kararın sabah saatlerinde ölçülecek dalga yüksekliğine göre verileceği açıklandı. Yolcuların sefere çıkmadan önce güncel duyuruları takip etmesi önerildi.\\n\\nUyarıda beklenen yağış miktarına da yer verildi. Sahil şeridinde yağışın kısa süreli ama şiddetli olabileceği, iç kesimlerde ise daha zayıf geçeceği belirtildi.\\n\\nYetkililer, uyarının bir tahmin olduğunu ve saatlik güncellemelerle değişebileceğini hatırlattı. Bu nedenle tek bir açıklamaya göre plan yapmak yerine güncellemelerin izlenmesi tavsiye edildi. Bölgedeki kriz merkezinin de üç gün boyunca kesintisiz çalışacağı bildirildi.\n\nUyarının ardından bölgedeki belediyeler de kendi önlemlerini açıkladı. Sahil bandındaki park alanları geçici olarak kapatıldı ve ağaç budama ekipleri sabaha karşı çalışmaya başladı. Zayıf dalların önceden alınması, rüzgar sırasında oluşabilecek hasarı azaltıyor.\\n\\nOkullarla ilgili karar ise ertelendi. Yetkililer, tatil kararının ancak sabah alınabileceğini, çünkü hava olayının en yoğun saatinin henüz netleşmediğini belirtti.\\n\\nElektrik dağıtım şirketi de bir açıklama yaptı. Kuvvetli rüzgarın hatlarda arızaya yol açabileceği, bu nedenle ekiplerin sahada hazır bekletileceği bildirildi. Vatandaşlardan kopmuş kablolara kesinlikle yaklaşmamaları ve arıza durumunda ilgili hattı aramaları istendi. Uyarı metninin sonunda acil durum numaraları da paylaşıldı. Uyarının sonunda, bölgede tatilde bulunanların da bilgilendirilmesi istendi. Otellerden, misafirlerine hava koşullarıyla ilgili duyuru yapmaları ve deniz aktivitelerini bu süre boyunca durdurmaları talep edildi. Sahil güvenlik ekiplerinin devriye sayısının artırılacağı da bildirildi. Yetkililer son olarak, gereksiz seyahatten kaçınılmasını ve zorunlu olmadıkça sahil şeridine yaklaşılmamasını istedi.",
    questions: [
      {
        question: "Uzmanlar balıkçılara ne önerdi?",
        options: [
          "Erken denize açılmalarını",
          "Denize açılmamalarını",
          "Daha uzak sulara gitmelerini",
          "Ağlarını değiştirmelerini"
        ],
        correctIndex: 1,
      },
      {
        question: "Vapur seferlerinin iptali kararı neye göre verilecek?",
        options: [
          "Yolcu sayısına göre",
          "Sabah saatlerinde ölçülecek dalga yüksekliğine göre",
          "Rüzgarın yönüne göre",
          "Yağış miktarına göre"
        ],
        correctIndex: 1,
      },
      {
        question: "Yetkililer uyarıyla ilgili neyi hatırlattı?",
        options: [
          "Uyarının kesin olduğunu",
          "Uyarının bir tahmin olduğunu ve saatlik güncellemelerle değişebileceğini",
          "Uyarının yalnızca balıkçıları ilgilendirdiğini",
          "Uyarının bir hafta geçerli olduğunu"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 6,
  },
  {
    id: 'kw-13',
    paragraph: "Şirketin araştırma geliştirme ekibi, üç yıldır üzerinde çalıştığı batarya teknolojisiyle ilgili sonuçlarını dün düzenlenen basın toplantısında paylaştı. Açıklamaya göre yeni tasarım, mevcut bataryalara kıyasla pil ömrünü yaklaşık iki katına çıkarıyor. Bu artış, hücre içindeki malzeme yapısının değiştirilmesiyle sağlanmış.\\n\\nEkip, laboratuvar koşullarında yürütülen testlerde bataryanın binlerce şarj döngüsünden sonra bile kapasitesinin büyük bölümünü koruduğunu belirtti. Ayrıca şarj süresinin de kısaldığı, ancak bu konuda henüz kesin bir rakam verilmesinin erken olduğu ifade edildi.\\n\\nBununla birlikte ekip, teknolojinin hemen piyasaya çıkmayacağını vurguladı. Laboratuvar sonuçlarının fabrika koşullarında tekrarlanması gerekiyor ve bu geçiş süreci sanıldığından zor. Seri üretime geçmenin en az iki yıl süreceği açıklandı.\\n\\nGecikmenin başlıca nedeni üretim hatlarının uyumlanması. Mevcut hatlar farklı bir malzeme yapısı için tasarlandığından, bazı aşamaların yeniden kurulması gerekiyor. Ayrıca kullanılan malzemelerden birinin tedarikinde sınırlı sayıda kaynak bulunması da planlamayı zorlaştırıyor.\\n\\nGüvenlik testleri de sürecin önemli bir bölümünü oluşturuyor. Yüksek kapasiteli bataryaların ısınma ve darbe koşullarındaki davranışı, uluslararası standartlara göre ayrı ayrı belgelenmek zorunda.\\n\\nŞirket, bu süreçte pilot üretim yapmayı planlıyor. Sınırlı sayıda üretilecek örnekler önce kurumsal müşterilerle test edilecek. Elde edilen geri bildirimlere göre tasarımda düzeltmeler yapılabileceği belirtildi. Yaygın tüketici ürünlerinde kullanımın ise ancak bu aşamadan sonra gündeme geleceği açıklandı.\n\nBasın toplantısında yatırım maliyetine dair sorular da soruldu. Ekip, üretim hatlarının uyumlanması için gereken yatırımın büyüklüğünü açıklamadı; ancak bunun projenin en maliyetli kalemi olduğunu belirtti.\\n\\nRakiplerin durumu da gündeme geldi. Sektörde benzer yönde çalışan başka şirketlerin bulunduğu, ancak açıklanan sonuçların karşılaştırılabilir olmadığı ifade edildi. Farklı laboratuvarların farklı test koşulları kullanması, doğrudan kıyaslamayı güçleştiriyor.\\n\\nEkip ayrıca çevresel etki konusuna değindi. Yeni tasarımın daha uzun ömürlü olması, aynı süre içinde daha az batarya üretilmesi anlamına geliyor. Bunun atık miktarını azaltacağı belirtildi. Ancak kullanılan malzemelerin geri dönüşüm süreçlerinin de yeniden düzenlenmesi gerektiği eklendi. Toplantının sonunda ekip, sonuçların bağımsız bir laboratuvarda da doğrulanacağını duyurdu. Bu doğrulamanın, teknolojinin yatırımcılar ve olası iş ortakları nezdinde güvenilirliğini artıracağı belirtildi. Doğrulama sonuçlarının birkaç ay içinde açıklanması bekleniyor.",
    questions: [
      {
        question: "Yeni teknolojinin seri üretime geçmesi ne kadar sürecek?",
        options: ["Altı ay", "Bir yıl", "En az iki yıl", "Beş yıl"],
        correctIndex: 2,
      },
      {
        question: "Gecikmenin başlıca nedeni nedir?",
        options: [
          "Bütçe yetersizliği",
          "Üretim hatlarının uyumlanması gerekliliği",
          "Ekipte personel eksikliği",
          "Patent sorunları"
        ],
        correctIndex: 1,
      },
      {
        question: "Şirket bu süreçte ne yapmayı planlıyor?",
        options: [
          "Üretimi tamamen durdurmayı",
          "Sınırlı sayıda pilot üretim yapıp kurumsal müşterilerle test etmeyi",
          "Teknolojiyi satmayı",
          "Projeyi askıya almayı"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 7,
  },
  {
    id: 'kw-14',
    paragraph: "Orman yangını cuma sabahı erken saatlerde başladı. İlk müdahale kısa sürede yapıldı; bölgeye en yakın istasyondan üç araç ve yaklaşık kırk kişilik bir ekip sevk edildi. Başlangıçta yangının sınırlı bir alanda kalacağı düşünülüyordu.\\n\\nEkipler ilk saatlerde ilerleme yönünü kesmeye odaklandı. Bunun için ateşin önündeki bitki örtüsü temizlenerek bir kesme hattı oluşturuldu. Bu yöntem, yangının yakacak malzeme bulamayarak durmasını amaçlıyor. Aynı zamanda havadan su atışı için iki uçak görevlendirildi.\\n\\nÖğle saatlerinde koşullar beklenmedik biçimde değişti. Rüzgarın yön değiştirmesiyle birlikte alevler, hazırlanan kesme hattının dışında kalan bir vadiye yöneldi. Bu gelişme, saatler süren hazırlığı büyük ölçüde geçersiz kıldı.\\n\\nEkipler söndürme stratejisini son anda değiştirmek zorunda kaldı. Yeni plana göre öncelik, yangının yerleşim alanına ulaşmasını engellemekti. Bu nedenle kaynaklar vadinin diğer ucuna kaydırıldı ve köye yakın bölgede yeni bir hat açıldı. Aynı zamanda iki köy için tedbir amaçlı tahliye kararı alındı.\\n\\nGece boyunca çalışma sürdü. Karanlıkta uçaklar görev yapamadığı için müdahale tamamen kara ekiplerine kaldı.\\n\\nYangın ertesi gün öğleden sonra kontrol altına alındı. Yetkililer, rüzgarın yön değiştirmesinin süreci uzatan temel etken olduğunu belirtti. Ayrıca soğutma çalışmalarının birkaç gün daha süreceğini, bu aşamada bölgeye girişin kısıtlı tutulacağını açıkladılar.\n\nYangın sonrasında hasar tespit çalışmaları başladı. İlk ölçümlere göre yaklaşık iki yüz hektarlık alan zarar gördü. Bu alanın bir bölümünde ağaçlar tamamen yandı, bir bölümünde ise yalnızca alt örtü etkilendi.\\n\\nUzmanlar, yeniden ağaçlandırma çalışmalarının hemen başlatılmaması gerektiğini belirtti. Toprağın kendini toparlamasına zaman tanınmasının, aceleyle yapılan dikimden daha iyi sonuç verdiğini anlattılar. Bazı türlerin yangından sonra kendiliğinden yeniden filizlendiği de hatırlatıldı.\\n\\nYangının çıkış nedeni araştırılıyor. İlk incelemede yıldırım izine rastlanmadı; bu nedenle insan kaynaklı bir nedenin muhtemel olduğu değerlendiriliyor. Bölgede güvenlik kameraları bulunmadığı için inceleme, tanık ifadelerine ve alandaki fiziksel izlere dayanıyor. Bölge halkına yönelik bilgilendirme toplantıları da planlandı. Bu toplantılarda yangın sonrası dönemde nelere dikkat edilmesi gerektiği anlatılacak. Ayrıca tahliye edilen iki köyün sakinlerinin evlerine dönüş takvimi de bu toplantılarda paylaşılacak. Yetkililer ayrıca bölgeye izinsiz giriş yapılmaması konusunda uyarıda bulundu ve denetimlerin süreceğini bildirdi.",
    questions: [
      {
        question: "Ekipler stratejilerini neden değiştirdi?",
        options: [
          "Su kaynağı bittiği için",
          "Rüzgarın yön değiştirmesiyle alevlerin kesme hattının dışına yönelmesi nedeniyle",
          "Ekip sayısı azaldığı için",
          "Uçaklar arızalandığı için"
        ],
        correctIndex: 1,
      },
      {
        question: "Kesme hattı yönteminin amacı nedir?",
        options: [
          "Ateşi su ile söndürmek",
          "Yangının yakacak malzeme bulamayarak durmasını sağlamak",
          "Rüzgarı engellemek",
          "Dumanı azaltmak"
        ],
        correctIndex: 1,
      },
      {
        question: "Gece boyunca müdahale neden tamamen kara ekiplerine kaldı?",
        options: [
          "Uçaklar yakıtsız kaldığı için",
          "Karanlıkta uçaklar görev yapamadığı için",
          "Rüzgar çok şiddetli olduğu için",
          "Ekipler dinlenmeye çekildiği için"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 7,
  },
  {
    id: 'kw-15',
    paragraph: "Araştırma, nadir görülen bir kas hastalığının genetik temelini aydınlatmayı amaçlıyordu. Hastalık dünya genelinde çok az sayıda kişide görüldüğü için yeterli örnek toplamak başlı başına bir sorundu. Bu nedenle çalışma, on iki ülkedeki hastanelerin katılımıyla ortak yürütüldü.\\n\\nEkip, toplanan binlerce hasta örneğini karşılaştırmalı olarak inceledi. Amaç, hasta bireylerde ortak olarak bulunan ancak sağlıklı bireylerde görülmeyen genetik farklılıkları saptamaktı. Bu tür bir karşılaştırma büyük miktarda veri işlemeyi gerektirdiği için özel hesaplama altyapıları kullanıldı.\\n\\nİlk taramalarda çok sayıda aday farklılık belirlendi. Ancak bunların büyük bölümü hastalıkla ilgisiz çıktı; çünkü insan genomunda kişiden kişiye değişen çok sayıda zararsız farklılık bulunur. Bu nedenle aday listesi kademeli olarak daraltıldı.\\n\\nSonunda tek bir mutasyon öne çıktı. Bu mutasyon, kas hücrelerinde belirli bir proteinin üretimini etkiliyordu. Laboratuvar ortamında yapılan doğrulama çalışmaları, aynı mutasyonun hücre düzeyinde benzer bir bozulmaya yol açtığını gösterdi.\\n\\nBulgu, tedavi açısından doğrudan bir sonuç anlamına gelmiyor. Ancak hastalığın mekanizmasının anlaşılması, hedefe yönelik ilaç geliştirme çalışmalarının başlangıç noktasını oluşturuyor.\\n\\nEkip ayrıca bulgunun tanı sürecine katkı sağlayabileceğini belirtti. Şu anda tanı, uzun süren ve pek çok testi içeren bir süreç gerektiriyor. Mutasyonun bilinmesi, doğrudan genetik testle çok daha erken tanı konulmasına imkân verebilir. Çalışmanın sonuçları uluslararası bir dergide yayımlandı ve veri kümesi diğer araştırmacıların kullanımına açıldı.\n\nÇalışmanın en zor tarafı, farklı ülkelerden gelen verilerin uyumlu hâle getirilmesi oldu. Her hastane kendi kayıt sistemini kullandığı için tanı tanımları ve ölçüm yöntemleri arasında farklar vardı. Bu farklar giderilmeden yapılacak bir karşılaştırma yanıltıcı olurdu.\\n\\nBu nedenle ekip önce ortak bir veri sözlüğü oluşturdu. Hangi bilginin nasıl kaydedileceği tek tek tanımlandı ve mevcut kayıtlar bu tanıma göre yeniden düzenlendi. Bu hazırlık aşaması çalışmanın neredeyse ilk yılını aldı.\\n\\nEtik izinler de ayrı bir süreç gerektirdi. Hasta verilerinin ülkeler arasında paylaşılabilmesi için kimlik bilgileri tamamen ayrıştırıldı ve her katılımcıdan ayrı onam alındı. Bu adımların hiçbiri atlanamadığı için takvim planlanandan uzun sürdü. Ekip, çalışmanın devamında aynı mutasyonu taşıyan ailelerin izlenmesini planlıyor. Böylece hastalığın hangi yaşta ve hangi belirtilerle başladığı daha net biçimde ortaya konabilecek. Bu izleme çalışmasının en az beş yıl süreceği öngörülüyor.",
    questions: [
      {
        question: "Araştırmacılar neyi tespit etmeye çalıştı?",
        options: [
          "Hastalığın yaygınlığını",
          "Hastalığın altında yatan mutasyonu",
          "Tedavi maliyetini",
          "Hastaların yaş ortalamasını"
        ],
        correctIndex: 1,
      },
      {
        question: "İlk taramalardaki aday farklılıkların çoğu neden elendi?",
        options: [
          "Veri kaybı yaşandığı için",
          "İnsan genomunda kişiden kişiye değişen çok sayıda zararsız farklılık bulunduğu için",
          "Örnekler bozulduğu için",
          "Hastalar çalışmadan ayrıldığı için"
        ],
        correctIndex: 1,
      },
      {
        question: "Bulgunun tanı sürecine olası katkısı nedir?",
        options: [
          "Tedaviyi hemen mümkün kılması",
          "Doğrudan genetik testle çok daha erken tanı konulmasına imkân vermesi",
          "Hastane sayısını artırması",
          "İlaç fiyatlarını düşürmesi"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 8,
  },
  {
    id: 'kw-16',
    paragraph: "Uluslararası uzay istasyonundaki mürettebat, altı hafta süren bir bitki deneyini geçtiğimiz ay tamamladı. Deneyin amacı, mikroyerçekimi ortamında bitki büyümesinin nasıl değiştiğini ayrıntılı olarak incelemekti. Bu soru, uzun süreli görevlerde mürettebatın kendi besinini üretebilmesi açısından kritik.\\n\\nDünyada bitkiler köklerini yerçekimi yönünde büyütür. Uzayda ise bu yönlendirici etki ortadan kalkar. Bu nedenle deneyde köklerin hangi işaretlere göre yön bulduğu araştırıldı. Nem ve ışık kaynaklarının konumu değiştirilerek köklerin tepkisi kaydedildi.\\n\\nSulama da ayrı bir sorun oluşturuyor. Mikroyerçekiminde su damla hâlinde dağılmak yerine yüzeye yapışarak kalıyor ve kök çevresinde hava boşluğu bırakmayabiliyor. Bu durum köklerin oksijensiz kalmasına yol açabildiği için deneyde özel bir besin ortamı kullanıldı.\\n\\nAltı hafta boyunca bitkiler düzenli aralıklarla fotoğraflandı ve örnekler alındı. Alınan örneklerin bir kısmı istasyonda dondurularak saklandı, geri kalanı ise ayrıntılı analiz için Dünya'ya gönderildi.\\n\\nİlk gözlemler, bitkilerin beklenenden daha iyi uyum sağladığını gösterdi. Ancak gövde yapısının Dünya'daki örneklere göre daha zayıf olduğu, yaprak yüzeylerinde ise farklılıklar bulunduğu görüldü.\\n\\nEkip, sonuçların yalnızca uzay görevleri için değil, Dünya'daki kapalı tarım sistemleri için de yararlı olabileceğini belirtti. Işık ve su kullanımının en aza indirildiği bu tür sistemler, sınırlı kaynakla üretim yapan bölgelerde giderek daha çok kullanılıyor.\n\nDeney sırasında mürettebatın harcadığı zaman da ayrıca kaydedildi. Bitki bakımının günlük iş yüküne etkisi, uzun görevlerde planlama açısından önemli bir veri sayılıyor. Kayıtlara göre bakım günde ortalama yirmi dakika sürdü.\\n\\nBir başka gözlem ise mürettebatın psikolojik durumuyla ilgiliydi. Ekip üyeleri, bitkilerle ilgilenmenin görev sırasında olumlu bir etki yarattığını bildirdi. Bu tür geri bildirimler daha önceki görevlerde de kaydedilmişti.\\n\\nDeneyin bir sonraki aşamasında farklı bir bitki türü denenecek. Bu kez daha kısa sürede olgunlaşan ve yenilebilir yaprak veren bir tür seçildi. Amaç, mürettebatın görev sırasında taze besin üretip üretemeyeceğini pratikte sınamak. Hazırlıkların önümüzdeki yıl tamamlanması bekleniyor. Deneyin sonuçları uluslararası bir konferansta sunuldu. Sunumun ardından farklı ülkelerden araştırma grupları ortak çalışma önerisi getirdi. Bu önerilerin bir kısmının önümüzdeki görev takvimine dahil edilmesi değerlendiriliyor.",
    questions: [
      {
        question: "Mürettebat neyi incelemek istedi?",
        options: [
          "Suyun kaynama noktasını",
          "Mikroyerçekiminde bitki büyümesini",
          "Yıldızların hareketini",
          "Radyasyon seviyesini"
        ],
        correctIndex: 1,
      },
      {
        question: "Mikroyerçekiminde sulamanın yarattığı sorun nedir?",
        options: [
          "Su hemen buharlaşır",
          "Su yüzeye yapışarak kalır ve kök çevresinde hava boşluğu bırakmayabilir",
          "Su donar",
          "Su kökler tarafından emilemez"
        ],
        correctIndex: 1,
      },
      {
        question: "Sonuçların Dünya'daki hangi alana katkı sağlayabileceği belirtildi?",
        options: [
          "Denizcilik",
          "Kapalı tarım sistemleri",
          "Madencilik",
          "Hava tahmini"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 8,
  },
  {
    id: 'kw-17',
    paragraph: "Merkez bankasının dün açıkladığı faiz kararı, piyasa beklentilerinin belirgin biçimde dışında kaldı. Anketlere katılan ekonomistlerin büyük çoğunluğu oranın değişmeyeceğini öngörmüştü. Açıklamanın ardından döviz piyasalarında ani dalgalanmalar yaşandı ve işlem hacmi kısa sürede olağan seviyesinin çok üzerine çıktı.\\n\\nİlk tepki dakikalar içinde geldi. Kurda hızlı bir hareket görüldü, ardından kısmi bir geri dönüş yaşandı. Tahvil piyasasında da benzer bir dalgalanma gözlendi; özellikle kısa vadeli getiriler belirgin biçimde değişti.\\n\\nAnalistler bu hareketi 'piyasa şaşkınlığı' olarak yorumladı. Bu ifadeyle kastedilen, fiyatların yeni bilgiye uyum sağlarken geçici olarak aşırı tepki vermesi. Analistlere göre asıl belirleyici olan ilk saatlerdeki hareket değil, birkaç gün içinde oluşacak yeni denge.\\n\\nBazı yorumcular ise tepkinin büyüklüğünü kararın kendisinden çok iletişim biçimine bağladı. Karar metninde gerekçelerin sınırlı biçimde açıklanmasının belirsizliği artırdığını savundular. Beklenmedik bir kararın, ayrıntılı bir gerekçeyle birlikte açıklandığında çok daha az dalgalanma yarattığına dikkat çektiler.\\n\\nBanka yetkilileri akşam saatlerinde ek bir açıklama yayımladı. Açıklamada kararın gerekçeleri daha ayrıntılı anlatıldı ve önümüzdeki dönemde izlenecek yaklaşımın çerçevesi çizildi.\\n\\nBu ek açıklamanın ardından piyasalarda kısmi bir sakinleşme gözlendi. Ancak analistler, güvenin tam olarak yerine oturmasının zaman alacağını ve önümüzdeki toplantının bu açıdan daha yakından izleneceğini belirtti.\n\nErtesi gün açıklanan enflasyon verisi de piyasa açısından yakından izlendi. Veri beklentiye yakın çıktı; bu da bir önceki günkü kararın gerekçesine dair tartışmayı bir ölçüde yatıştırdı.\\n\\nYabancı yatırımcı hareketleri de gündemdeydi. İlk gün gözlenen çıkışın ardından ikinci gün kısmi bir giriş kaydedildi. Analistler bu hareketin kalıcı bir yön değişimi sayılamayacağını, en az birkaç haftalık veriyle değerlendirilmesi gerektiğini belirtti.\\n\\nBankaların kredi faizlerine yansıma ise daha yavaş oldu. Bazı bankalar oranlarını aynı gün güncellerken, diğerleri birkaç gün bekledi. Bu farklılık, kararın ekonomiye yansımasının tek seferde değil kademeli gerçekleştiğini gösteren somut bir örnek olarak yorumlandı. Haftanın sonunda yayımlanan analiz raporları, dalgalanmanın büyük ölçüde geride kaldığını gösterdi. Ancak raporlarda, benzer sürprizlerin tekrarlanması durumunda tepkinin daha sert olabileceği uyarısı da yer aldı. Bu değerlendirme, öngörülebilirliğin piyasalar açısından taşıdığı önemi bir kez daha gündeme getirdi.",
    questions: [
      {
        question: "Analistler piyasa hareketini nasıl yorumladı?",
        options: [
          "Beklenen bir gelişme",
          "Piyasa şaşkınlığı",
          "Normal mevsimsel dalgalanma",
          "Uzun vadeli trend"
        ],
        correctIndex: 1,
      },
      {
        question: "Bazı yorumcular tepkinin büyüklüğünü neye bağladı?",
        options: [
          "Kararın kendisine",
          "Karar metninde gerekçelerin sınırlı açıklanması, yani iletişim biçimine",
          "Yabancı yatırımcılara",
          "Mevsimsel etkilere"
        ],
        correctIndex: 1,
      },
      {
        question: "Analistlere göre asıl belirleyici olan nedir?",
        options: [
          "İlk saatlerdeki hareket",
          "Birkaç gün içinde oluşacak yeni denge",
          "İşlem hacmi",
          "Tahvil getirilerinin anlık değeri"
        ],
        correctIndex: 1,
      }
    ],
    difficulty: 9,
  },
  {
    id: 'kw-18',
    paragraph: "Derin öğrenme modellerinin eğitiminde kullanılan veri kümeleri, çoğu zaman geçmişte toplanmış gerçek kayıtlardan oluşur. Bu kayıtlar tarafsız görünse de, toplandıkları dönemin uygulamalarını ve tercihlerini içinde taşır. Modeller bu kayıtlardan örüntü çıkardığı için, veride gizli kalan önyargılar da öğrenilen kuralların bir parçası hâline gelir.\\n\\nSorunun fark edilmesini zorlaştıran şey, bu önyargıların doğrudan görünür olmamasıdır. Yasaklı bir değişken veri kümesinden çıkarılsa bile, onunla ilişkili başka değişkenler aynı bilgiyi dolaylı biçimde taşıyabilir. Model, bu dolaylı ilişkileri kendiliğinden bulur ve kullanır.\\n\\nSonuç, geliştiricilerin fark etmediği sistematik hatalar olur. Bu hatalar rastgele değildir; belirli gruplar için tutarlı biçimde daha kötü sonuç üretirler. Genel doğruluk oranına bakıldığında model başarılı görünebilir, çünkü etkilenen grup toplam içinde küçük bir paya sahiptir.\\n\\nBu nedenle değerlendirme yöntemleri değişmiştir. Tek bir genel başarı ölçütü yerine, performansın alt gruplara ayrılarak incelenmesi öneriliyor. Bu yaklaşım, ortalamanın gizlediği farkların ortaya çıkmasını sağlıyor.\\n\\nVeri toplama aşaması da ayrı bir müdahale noktası olarak görülüyor. Eksik temsil edilen grupların verisinin artırılması bazı durumlarda sorunu azaltıyor; ancak her zaman yeterli olmuyor, çünkü sorun veri miktarında değil kaydın kendisinde olabiliyor.\\n\\nBu nedenle uzmanlar, teknik düzeltmelerin tek başına yeterli olmadığını vurguluyor. Modelin hangi amaçla ve hangi karar sürecinde kullanılacağı belirlenmeden, teknik ölçütlerin tek başına anlamlı olmadığı belirtiliyor.\n\nBu tartışmanın pratik bir sonucu, model geliştirme sürecine yeni bir belgeleme adımının eklenmesi oldu. Kullanılan veri kümesinin nereden geldiği, hangi dönemi kapsadığı ve hangi gruplarda eksik temsil bulunduğu artık ayrı bir belgede kaydediliyor.\\n\\nBu belgeler, modeli sonradan kullanacak ekipler için de yol gösterici oluyor. Bir model, geliştirildiği bağlamdan farklı bir alanda kullanıldığında beklenmedik sonuçlar üretebiliyor; bu nedenle sınırların açıkça yazılması önem taşıyor.\\n\\nDenetim tarafında ise bağımsız değerlendirme fikri öne çıkıyor. Modeli geliştiren ekipten farklı bir grubun testleri tekrarlaması, gözden kaçan sorunların bulunma olasılığını artırıyor. Bu yaklaşım, yazılım güvenliğinde uzun süredir kullanılan bağımsız inceleme mantığının yapay zekâ alanına taşınması olarak değerlendiriliyor. Bu alandaki düzenlemelerin de belgeleme zorunluluğunu içerecek biçimde şekillendiği görülüyor. Yüksek riskli kabul edilen uygulamalarda, veri kaynaklarının ve test sonuçlarının kayda geçirilmesi giderek daha yaygın bir yükümlülük hâline geliyor.",
    questions: [
      {
        question: "Metne göre modelin hatalarının kaynağı nedir?",
        options: [
          "Yetersiz işlemci gücü",
          "Veri kümesindeki gizli önyargılar",
          "Yazılım sürüm hatası",
          "İnternet bağlantı sorunu"
        ],
        correctIndex: 1,
      },
      {
        question: "Yasaklı bir değişken çıkarılsa bile sorun neden sürebilir?",
        options: [
          "Model onu hatırladığı için",
          "Onunla ilişkili başka değişkenler aynı bilgiyi dolaylı taşıyabildiği için",
          "Veri kümesi çok küçük olduğu için",
          "Eğitim süresi kısa olduğu için"
        ],
        correctIndex: 1,
      },
      {
        question: "Genel doğruluk oranına bakıldığında modelin başarılı görünmesinin nedeni nedir?",
        options: [
          "Ölçümün yanlış yapılması",
          "Etkilenen grubun toplam içinde küçük bir paya sahip olması",
          "Modelin sürekli güncellenmesi",
          "Test verisinin eksik olması"
        ],
        correctIndex: 1,
      }
    ],
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
    text: "Tarihte bilinen ilk sistemli kütüphane, Asur kralı Asurbanipal tarafından milattan önce yedinci yüzyılda Ninova'da kurulmuştur. Bu kütüphaneyi kendisinden önceki tablet birikimlerinden ayıran şey, yalnızca büyüklüğü değil, düzenlenme biçimidir. Tabletler konularına göre ayrılmış, her birinin sonuna hangi esere ait olduğunu ve kaçıncı tablet olduğunu belirten kısa notlar eklenmiştir. Bu, bugünkü katalog mantığının erken bir örneğidir.\n\nKoleksiyon on binlerce çivi yazılı kil tabletten oluşuyordu. İçerik oldukça çeşitliydi: tıp reçeteleri, gök gözlemleri, hukuk metinleri, sözlükler, dilekçeler ve edebî eserler bir arada bulunuyordu. Asurbanipal, imparatorluğun dört bir yanına görevliler göndererek tapınaklardaki ve özel koleksiyonlardaki metinlerin kopyalanmasını istemiştir. Bazı tabletlerde, eserin nereden getirildiğine dair kayıtlar da yer alır.\n\nKütüphanenin en ünlü buluntusu, Gılgamış Destanı'nın bugüne ulaşan en eksiksiz kopyasıdır. Bu metin, bir kralın ölümsüzlük arayışını anlatır ve büyük bir tufan anlatısı içerir. Destanın çözümlenmesi, on dokuzuncu yüzyılda hem edebiyat hem de tarih araştırmaları açısından büyük yankı uyandırmıştır.\n\nKütüphanenin günümüze ulaşmasını sağlayan şey ise beklenmedik bir tesadüftür. Ninova, milattan önce altı yüz on iki yılında düşman orduları tarafından ele geçirilmiş ve yakılmıştır. Papirüs ya da parşömen olsaydı koleksiyon tamamen yok olurdu. Ancak kil tabletler yangının yüksek sıcaklığında yanmak yerine pişerek sertleşmiş ve dayanıklı hâle gelmiştir. Böylece imparatorluğu yıkan felaket, aynı zamanda onun yazılı belleğini koruyan etken olmuştur.\n\nBugün bu tabletlerin büyük bölümü müzelerde saklanmakta ve hâlâ çözümlenmeye devam etmektedir. Parçalanmış tabletlerin birbirine ait bölümlerini eşleştirmek uzun süren titiz bir iştir; son yıllarda bu eşleştirmede bilgisayar destekli yöntemler de kullanılmaktadır.\n\nNinova kütüphanesi, yazının yalnızca ticaret kaydı tutmak için değil, bilgiyi biriktirmek ve gelecek kuşaklara aktarmak için de kullanılabileceğini gösteren erken örneklerden biridir. Kral, kendisinden önceki yüzyıllara ait metinleri toplatırken yalnızca kendi dönemini değil, geçmişin bilgi mirasını da korumayı amaçlamıştır. Bu yönüyle koleksiyon, bir hükümdarın gücünü sergilediği kadar, bilginin de bir güç biçimi olarak görüldüğünü ortaya koyar. Tabletlerin bazılarında, esere zarar verecek kişilere yönelik ağır uyarı ifadeleri yer alması, koleksiyona verilen değerin bir başka göstergesidir.",
    difficulty: 5,
    questions: [
      {
        question: "İlk sistemli kütüphane hangi şehirde kurulmuştur?",
        options: ["Babil", "Ninova", "Uruk", "Sümer"],
        correctIndex: 1,
      },
      {
        question: "Bu kütüphaneyi önceki tablet birikimlerinden ayıran temel özellik nedir?",
        options: ["Sadece büyüklüğü", "Konulara göre düzenlenmiş olması ve katalog notları taşıması", "Altından yapılmış olması", "Yalnızca edebî eser içermesi"],
        correctIndex: 1,
      },
      {
        question: "Kütüphanedeki eserler hangi malzemeye yazılmıştır?",
        options: ["Papirüs", "Kil tablet", "Parşömen", "Deri"],
        correctIndex: 1,
      },
      {
        question: "Koleksiyonun günümüze ulaşmasını sağlayan tesadüf nedir?",
        options: ["Tabletlerin toprağa gömülmesi", "Yangında tabletlerin yanmak yerine pişerek sertleşmesi", "Kralın tabletleri başka şehre taşıtması", "Tabletlerin suya dayanıklı olması"],
        correctIndex: 1,
      },
      {
        question: "Hangi meşhur destanın en eksiksiz kopyası burada bulunmuştur?",
        options: ["İlyada", "Gılgamış Destanı", "Odysseia", "Şehname"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-02',
    text: "Kediler, günün büyük bir bölümünü uyuyarak geçiren hayvanlardır. Bir kedi günde ortalama on beş saat uyuyabilir; yaşlı kediler ve yavrular bu süreyi yirmi saate kadar çıkarır. Bu uzun uyku, tembellikten değil, avcı bir hayvan olmalarından kaynaklanır. Doğada avlanmak kısa süreli ama çok yoğun enerji harcayan bir iştir; kediler bu enerjiyi uyuyarak biriktirir.\n\nKedilerin uykusu tek parça değildir. Gün boyunca kısa aralıklarla uyur, sık sık uyanır ve kolayca tetikte hâle geçebilirler. Uykunun büyük kısmı hafif uykudur; bu sırada kulakları çevredeki sesleri izlemeye devam eder. Derin uyku ise toplam sürenin daha küçük bir bölümünü oluşturur.\n\nKediler alacakaranlık saatlerinde daha hareketlidir. Sabahın ilk ışıklarında ve akşam karanlığa yakın vakitlerde canlanmaları, avlandıkları küçük hayvanların da bu saatlerde hareketli olmasıyla ilgilidir. Gözlerinin yapısı bu düşük ışık koşullarına uyum sağlamıştır; retinanın arkasındaki yansıtıcı katman, az ışıkta görüşü belirgin biçimde artırır. Karanlıkta kedi gözlerinin parlamasının nedeni de budur.\n\nUyumadıkları zamanlarda kediler oyun oynamayı ve çevrelerini keşfetmeyi sever. Oyun davranışı aslında avlanma hareketlerinin bir provasıdır: pusuya yatma, ani atılma ve pençeyle yakalama. Ev kedilerinde bu davranış, oyuncaklar üzerinde ya da hareketli ışık noktalarını kovalayarak sürer.\n\nKedilerin bir başka belirgin alışkanlığı da düzenli tüy temizliğidir. Günün önemli bir bölümünü kendini yalayarak geçirirler. Bu davranış yalnızca temizlik sağlamaz; tükürüğün buharlaşması vücudun serinlemesine de yardımcı olur. Ayrıca tüylerin düzenli taranması, ısı yalıtımını artırır ve derinin sağlıklı kalmasına katkıda bulunur.\n\nKedilerin uyku düzeni ev ortamında değişebilir. Yiyeceğe kolay ulaşan ve avlanma ihtiyacı ortadan kalkan bir kedi, enerjisini harcayacak bir uğraş bulamadığında daha da uzun uyuyabilir. Bu nedenle uzmanlar, ev kedilerine gün içinde düzenli oyun zamanı ayrılmasını önerir. Kısa ama sık tekrarlanan oyun seansları, hem kedinin doğal avlanma davranışını karşılar hem de kilo alımını sınırlar. Sahibiyle kurulan bu etkileşim, kedinin gece boyunca daha sakin olmasına da katkı sağlar.\n\nKediler arasındaki iletişim de sanıldığından çeşitlidir. Yetişkin kediler kendi aralarında nadiren miyavlar; bu ses daha çok insanlarla kurulan ilişkide gelişmiştir. Kendi aralarında ise kuyruk duruşu, kulak açısı, göz kırpma hızı ve koku işaretleri kullanırlar. Bir kedinin kuyruğunu dik tutarak yaklaşması genellikle olumlu bir yaklaşım işaretidir. Bu işaretleri okuyabilmek, kedinin ne zaman ilgi istediğini ve ne zaman yalnız bırakılmak istediğini anlamayı kolaylaştırır.",
    difficulty: 1,
    questions: [
      {
        question: "Bir kedi günde ortalama kaç saat uyur?",
        options: ["On saat", "On beş saat", "Yirmi beş saat", "Beş saat"],
        correctIndex: 1,
      },
      {
        question: "Metne göre kedilerin uzun uyumasının nedeni nedir?",
        options: ["Tembel olmaları", "Avlanmanın kısa ama yoğun enerji harcayan bir iş olması", "Az yemek yemeleri", "Soğuktan korunmaları"],
        correctIndex: 1,
      },
      {
        question: "Kedi gözlerinin karanlıkta parlamasının nedeni nedir?",
        options: ["Gözyaşı tabakası", "Retinanın arkasındaki yansıtıcı katman", "Göz bebeğinin büyüklüğü", "Tüylerin rengi"],
        correctIndex: 1,
      },
      {
        question: "Kedilerin oyun davranışı aslında neyin provasıdır?",
        options: ["Uyku düzeninin", "Avlanma hareketlerinin", "Tüy temizliğinin", "Sosyalleşmenin"],
        correctIndex: 1,
      },
      {
        question: "Kendini yalama davranışının temizlik dışındaki faydası nedir?",
        options: ["Sindirimi hızlandırır", "Tükürüğün buharlaşmasıyla vücudu serinletir", "Görüşü güçlendirir", "İşitmeyi keskinleştirir"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-03',
    text: "Bal arıları, çiçeklerden topladıkları nektarı kovana taşıyarak bal üretir. Bu iş göründüğünden çok daha uzun sürer: bir kavanoz bal için binlerce arının toplamda milyonlarca çiçeği ziyaret etmesi gerekir. Tek bir arının ömrü boyunca ürettiği bal miktarı ise bir çay kaşığının çok altındadır. Bu yüzden bal, ancak binlerce arının ortak çalışmasıyla anlamlı bir miktara ulaşır.\n\nBir kovanda mevsime göre otuz ila altmış bin arı birlikte yaşar. Her arının kovan içinde belirli bir görevi vardır ve bu görevler yaşa göre değişir. Genç işçi arılar önce kovan temizliği ve yavru bakımıyla ilgilenir, ardından petek inşasına geçer, sonra kovan girişini korur ve en son aşamada dışarıda nektar toplamaya başlar.\n\nNektar, arının vücudundaki özel bir mide bölümünde taşınır ve bu sırada enzimlerle işlenmeye başlar. Kovana dönen toplayıcı arı, yükünü kovan içindeki arılara aktarır. Nektar arıdan arıya geçerken işlenmeye devam eder ve sonunda petek gözlerine bırakılır. Bu aşamada karışım hâlâ oldukça suludur.\n\nSuyun uzaklaştırılması için arılar kanat çırparak petek üzerinde sürekli bir hava akımı oluşturur. Su oranı yeterince düştüğünde petek gözü mumla kapatılır. Bu düşük nem, bal içinde mikroorganizmaların çoğalmasını engeller; balın çok uzun süre bozulmadan kalabilmesinin nedeni budur.\n\nBalın rengi, kokusu ve kıvamı hangi çiçeklerden toplandığına göre değişir. Çam ormanlarının yakınındaki kovanlarda üretilen bal koyu ve yoğun olurken, narenciye bahçelerinin yanındaki kovanlarda daha açık renkli ve hafif aromalı bal elde edilir. Aynı kovan, mevsim içinde farklı çiçekler açtıkça farklı özelliklerde bal üretebilir.\n\nArıların bu düzeni yalnızca bal üretimiyle sınırlı bir öneme sahip değildir. Nektar toplamak için çiçekten çiçeğe dolaşan arılar, farkında olmadan polen taşıyarak tozlaşmayı sağlar. Birçok meyve ve sebze türünün verimi doğrudan bu işleme bağlıdır. Bu nedenle arı kolonilerindeki azalma, yalnızca bal üretimini değil, tarımsal üretimin genelini ilgilendiren bir sorun olarak değerlendirilmektedir. Arıcılar da bu nedenle kovanlarını çoğu zaman tarım alanlarının yakınına yerleştirir.\n\nKovanın sağlığı büyük ölçüde çevresel koşullara bağlıdır. Yakında yeterli çiçek bulunmaması, uzun süren yağışlar ya da aşırı sıcaklar toplayıcı arıların verimini düşürür. Bazı hastalıklar ve asalak canlılar da koloniyi hızla zayıflatabilir. Bu nedenle arıcılar kovanları düzenli olarak inceler, yavru peteklerinin durumunu kontrol eder ve gerektiğinde koloniyi daha uygun bir bölgeye taşır. İyi yönetilen bir kovan, yıllar boyunca üretimini sürdürebilir.",
    difficulty: 2,
    questions: [
      {
        question: "Arılar balı neyden üretir?",
        options: ["Sudan", "Nektardan", "Mumdan", "Topraktan"],
        correctIndex: 1,
      },
      {
        question: "Metne göre bir arının ömrü boyunca ürettiği bal miktarı ne kadardır?",
        options: ["Bir kavanoz", "Bir çay kaşığının çok altında", "Yarım kilo", "Bir litre"],
        correctIndex: 1,
      },
      {
        question: "Arıların kovan içindeki görevleri nasıl belirlenir?",
        options: ["Herkes aynı işi yapar", "Görevler arının yaşına göre değişir", "Kraliçe her gün yeni görev dağıtır", "Görevler rastgele seçilir"],
        correctIndex: 1,
      },
      {
        question: "Balın uzun süre bozulmadan kalmasının nedeni nedir?",
        options: ["Peteğin mumla kaplı olması", "Su oranının düşük olması nedeniyle mikroorganizmaların çoğalamaması", "Kovanın karanlık olması", "Balın soğuk tutulması"],
        correctIndex: 1,
      },
      {
        question: "Balın rengi ve aroması neye göre değişir?",
        options: ["Kovanın büyüklüğüne", "Nektarın toplandığı çiçeklere", "Arı sayısına", "Peteğin yaşına"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-04',
    text: "Piramitler, Antik Mısır'da firavunlar için mezar olarak inşa edilmiştir. Ancak bu yapılar yalnızca birer gömü yeri değildi; ölümden sonraki yaşama geçişi güvence altına almak üzere tasarlanmış geniş bir dinî yapı topluluğunun merkeziydi. Her piramide bağlı tapınaklar, tören yolları ve görevlilerin yaşadığı yerleşimler bulunurdu.\n\nEn büyük örnek olan Keops Piramidi'nin yapımının yaklaşık yirmi yıl sürdüğü tahmin edilmektedir. Yapıda kullanılan taş blokların sayısı iki milyonu aşar ve bazılarının ağırlığı birkaç tonu bulur. Tamamlandığında yüz kırk altı metreye yaklaşan yüksekliğiyle, yaklaşık dört bin yıl boyunca dünyanın en yüksek insan yapımı yapısı olarak kalmıştır.\n\nUzun süre bu yapıların köle emeğiyle inşa edildiği düşünülmüştür. Ancak yapı alanının yakınında bulunan işçi yerleşimleri bu görüşü değiştirmiştir. Kazılarda ortaya çıkarılan fırınlar, bira üretim alanları, tıbbi müdahale görmüş kırık kemikler ve işçilere ait düzenli mezarlar, çalışanların beslenen, tedavi edilen ve saygın biçimde gömülen kişiler olduğunu göstermektedir. Bugün baskın görüş, işçilerin büyük ölçüde tarım mevsiminin dışında çalışan örgütlü ekipler olduğu yönündedir.\n\nİnşa yöntemi ise hâlâ tartışmalıdır. Rampa kullanıldığı konusunda geniş bir uzlaşı vardır; ancak rampanın düz mi yoksa piramidin çevresini saran sarmal bir yapı mı olduğu netleşmemiştir. Taşların kaydırılmasını kolaylaştırmak için zeminin ıslatılmış olabileceğine dair kanıtlar da bulunmuştur.\n\nPiramitlerin dış yüzeyi başlangıçta parlak beyaz kireç taşı bloklarla kaplıydı ve güneş ışığında uzaktan görülebilecek kadar parlıyordu. Yüzyıllar içinde bu kaplama taşlarının büyük bölümü sökülerek başka yapılarda kullanılmıştır. Bugün gördüğümüz basamaklı görünüm, aslında yapının iç çekirdeğidir.\n\nPiramitlerin iç yapısı da dikkat çekicidir. Yapının içinde dar geçitler, hava kanalları ve büyük taş bloklarla kapatılmış odalar bulunur. Mezar odasının üzerine yerleştirilen boşluklu katmanlar, üstteki devasa ağırlığın odayı ezmesini önleyecek biçimde tasarlanmıştır. Bu çözüm, dönemin yapı mühendisliğinin ulaştığı seviyeyi gösterir. Buna rağmen piramitlerin neredeyse tamamı, tarihin bir noktasında mezar soyguncuları tarafından boşaltılmıştır; bu da yapının koruma amacına ulaşamadığını ortaya koyar.\n\nPiramitlerin inşası tek başına bir yapı işi de değildi. Binlerce kişinin aylarca beslenmesi, barındırılması ve organize edilmesi gerekiyordu. Bu da tahıl depolanmasını, dağıtımın kayıt altına alınmasını ve iş gücünün ekiplere bölünmesini zorunlu kılıyordu. Bulunan kayıtlarda ekiplerin kendilerine ad verdiği ve bu adları taşların üzerine yazdığı görülmüştür. Bu yönüyle piramitler, aynı zamanda gelişmiş bir yönetim ve kayıt sisteminin ürünüdür.",
    difficulty: 3,
    questions: [
      {
        question: "Piramitler kimin için inşa edilmiştir?",
        options: ["Rahipler için", "Firavunlar için", "Askerler için", "Tüccarlar için"],
        correctIndex: 1,
      },
      {
        question: "Keops Piramidi'nin yapımı ne kadar sürmüştür?",
        options: ["On yıl", "Yaklaşık yirmi yıl", "Yüz yıl", "Üç yıl"],
        correctIndex: 1,
      },
      {
        question: "İşçilerin köle olmadığı görüşünü destekleyen bulgular nelerdir?",
        options: ["Piramidin yüksekliği", "Fırınlar, tıbbi müdahale görmüş kemikler ve düzenli işçi mezarları", "Rampaların büyüklüğü", "Kaplama taşlarının parlaklığı"],
        correctIndex: 1,
      },
      {
        question: "İnşa yöntemiyle ilgili hâlâ netleşmemiş olan nedir?",
        options: ["Rampa kullanılıp kullanılmadığı", "Rampanın düz mü yoksa sarmal mı olduğu", "Taşların nereden geldiği", "Piramidin kim için yapıldığı"],
        correctIndex: 1,
      },
      {
        question: "Piramitlerin bugünkü basamaklı görünümünün nedeni nedir?",
        options: ["Baştan böyle inşa edilmesi", "Parlak kireç taşı kaplamanın sökülmüş olması", "Deprem hasarı", "Kum fırtınaları"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-05',
    text: "Amazon Yağmur Ormanları, yeryüzündeki en büyük tropikal orman alanıdır ve bilinen tüm canlı türlerinin önemli bir bölümüne ev sahipliği yapar. Bölgede on binlerce bitki türü, binlerce balık ve kuş türü ile sayısı hâlâ net olarak bilinmeyen böcek türü bulunur. Her yıl bilime yeni türler kazandırılmaya devam edilmektedir.\n\nOrmanın en dikkat çekici özelliklerinden biri kendi yağmurunu üretmesidir. Ağaçlar kökleriyle çektikleri suyu yapraklarından buharlaştırır; bu nem havada yükselerek yoğunlaşır ve yeniden yağış olarak düşer. Bu döngü, ormanın kendi iklimini büyük ölçüde kendisinin sürdürdüğü anlamına gelir. Nemin bir bölümü ise atmosferde uzun mesafeler kat ederek kıtanın başka bölgelerindeki tarım alanlarına ulaşır.\n\nOrmanın toprağı, beklenenin aksine oldukça fakirdir. Besin maddelerinin büyük kısmı toprakta değil, canlı bitki dokularında ve yüzeydeki ince çürüntü tabakasında bulunur. Düşen yapraklar hızla ayrışır ve besinler doğrudan köklerce geri alınır. Bu nedenle ağaçlar kesildiğinde döngü kırılır ve toprak birkaç yıl içinde verimsizleşir.\n\nOrmansızlaşma bu ekosistemi ciddi biçimde tehdit etmektedir. Alanlar çoğunlukla hayvancılık ve büyük ölçekli tarım için temizlenmekte, yol yapımı ise daha önce ulaşılamayan bölgelere erişimi kolaylaştırarak kaybı hızlandırmaktadır. Araştırmacılar, kaybın belirli bir eşiği aşması hâlinde yağış döngüsünün zayıflayabileceği ve ormanın bir bölümünün kendiliğinden savana benzeri bir yapıya dönüşebileceği konusunda uyarmaktadır.\n\nBölgede yaşayan yerli topluluklar bu tartışmanın merkezindedir. Uydu verileriyle yapılan analizler, yerli halkların yönetimindeki alanlarda orman kaybının çevresindeki bölgelere kıyasla belirgin biçimde daha düşük olduğunu göstermektedir.\n\nOrmanın korunmasına yönelik yaklaşımlar da zamanla değişmiştir. Yalnızca yasaklara dayanan yöntemlerin sınırlı kaldığı görüldükçe, yerel halkın geçim kaynaklarını dikkate alan modeller öne çıkmıştır. Ormanı ayakta tutarak gelir elde etmeyi mümkün kılan ürün toplama, sürdürülebilir balıkçılık ve doğa turizmi gibi uygulamalar bu kapsamda değerlendirilir. Uydu görüntülerinin herkese açık hâle gelmesi de denetimi kolaylaştırmış; kayıp alanlar artık haftalar içinde tespit edilebilmektedir.\n\nOrmanın canlı çeşitliliği tıp açısından da önemlidir. Bugün kullanılan birçok ilacın etken maddesi, doğadaki bitki ve mikroorganizmalardan elde edilen bileşiklerden geliştirilmiştir. Amazon'daki türlerin büyük bölümü ise henüz kimyasal olarak incelenmemiştir. Bu nedenle her kaybedilen tür, yalnızca ekolojik değil, potansiyel bir bilimsel kaynağın da yitirilmesi anlamına gelir. Yerel toplulukların bitkiler hakkındaki kuşaktan kuşağa aktarılan bilgisi de bu araştırmalar için önemli bir başlangıç noktası oluşturur.",
    difficulty: 4,
    questions: [
      {
        question: "Amazon Ormanları neye ev sahipliği yapar?",
        options: ["Sadece kuşlara", "Bilinen canlı türlerinin önemli bir bölümüne", "Yalnızca birkaç nadir türe", "Sadece ağaçlara"],
        correctIndex: 1,
      },
      {
        question: "Orman kendi yağmurunu nasıl üretir?",
        options: ["Nehirlerden buharlaşan suyla", "Ağaçların yapraklarından buharlaştırdığı nemin yoğunlaşıp yağış olarak düşmesiyle", "Okyanustan gelen rüzgarlarla", "Toprağın nem salmasıyla"],
        correctIndex: 1,
      },
      {
        question: "Metne göre orman toprağının özelliği nedir?",
        options: ["Çok verimlidir", "Oldukça fakirdir; besinler bitki dokularında ve ince çürüntü tabakasındadır", "Tamamen kumdur", "Sürekli su altındadır"],
        correctIndex: 1,
      },
      {
        question: "Ormanı en çok ne tehdit etmektedir?",
        options: ["Deprem", "Ormansızlaşma", "Kuraklık", "Volkanik faaliyet"],
        correctIndex: 1,
      },
      {
        question: "Uydu verileri yerli toplulukların yönettiği alanlarla ilgili ne göstermektedir?",
        options: ["Orman kaybının daha yüksek olduğunu", "Orman kaybının çevredeki bölgelere kıyasla belirgin biçimde daha düşük olduğunu", "Hiçbir fark olmadığını", "Bu alanlarda ölçüm yapılamadığını"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-06',
    text: "Uyku, uzun süre yalnızca bir dinlenme dönemi olarak görülmüştür. Oysa günümüzdeki araştırmalar, beynin uyku sırasında son derece etkin bir çalışma yürüttüğünü göstermektedir. Bu çalışmanın en önemli bileşenlerinden biri, gün içinde öğrenilen bilgilerin pekiştirilmesidir.\n\nUyku tek tip değildir; gece boyunca birbirini izleyen döngülerden oluşur. Her döngüde hafif uyku, derin uyku ve hızlı göz hareketlerinin görüldüğü evre sırayla yaşanır. Derin uyku evresinde beyin, gün içinde geçici olarak tutulan bilgileri daha kalıcı ağlara aktarır. Aynı evrede gereksiz görülen bağlantılar zayıflatılır; böylece hafıza kapasitesi anlamlı bilgiler için korunur.\n\nRüya görme evresinin işlevi ise daha çok tartışılan bir konudur. Bazı araştırmacılar bu evrenin duygusal belleğin işlenmesinde rol oynadığını öne sürer. Bu görüşe göre, yoğun duygu içeren anılar bu evrede yeniden ele alınır ve zamanla duygusal yükleri hafifler. Beceri öğrenmede de bu evrenin katkısı olduğuna dair bulgular vardır.\n\nYetersiz uyuyan kişilerde pekiştirme sürecinin aksadığı ve öğrenme performansının düştüğü defalarca gözlenmiştir. Uykusuzluğun etkisi yalnızca hafızayla sınırlı kalmaz; dikkat süresi kısalır, tepki süresi uzar ve risk değerlendirmesi bozulur. Kişi çoğu zaman bu düşüşün farkında olmaz, çünkü kendi performansını değerlendirme yeteneği de aynı ölçüde zayıflar.\n\nSon yıllarda öne çıkan bir bulgu ise beynin uyku sırasında bir tür temizlik yürüttüğüdür. Uyanıkken biriken bazı atık maddelerin, uyku sırasında beyin dokusundaki sıvı akışının artmasıyla daha etkin biçimde uzaklaştırıldığı gösterilmiştir. Bu bulgu, uykunun neden hiçbir canlıda tamamen ortadan kalkmadığını açıklamaya yönelik açıklamalardan biri olarak değerlendirilmektedir.\n\nUyku düzeninin bozulması yalnızca süreyle ilgili değildir. Vücut, ışığa göre ayarlanan bir iç saate sahiptir ve bu saat uyku hormonlarının salgılanma zamanını belirler. Akşam saatlerinde yoğun ışığa maruz kalmak bu saati geciktirebilir; kişi yatağa girse bile uykuya geçişi uzar. Bu nedenle uzmanlar, uyku süresinin yanı sıra yatma ve kalkma saatlerinin de mümkün olduğunca sabit tutulmasını önerir. Düzensiz saatlerde uyunan sekiz saat, düzenli uyunan yedi saat kadar dinlendirici olmayabilir.\n\nUykunun bedensel etkileri de belirgindir. Derin uyku sırasında büyüme ve onarımla ilişkili hormonların salgısı artar; kaslar onarılır, bağışıklık sistemi güçlenir. Düzenli uyku eksikliğinin uzun vadede metabolik sorunlara ve bağışıklık zayıflığına yol açtığı gösterilmiştir. Ayrıca açlık ve tokluk hissini düzenleyen hormonların dengesi bozulur; bu da yetersiz uyuyan kişilerde iştah artışı olarak gözlenir. Uyku, bu yönüyle beslenme ve hareket kadar temel bir sağlık bileşenidir.",
    difficulty: 6,
    questions: [
      {
        question: "Beyin uyku sırasında ne yapar?",
        options: ["Sadece dinlenir", "Gün içinde öğrenilen bilgileri pekiştirir", "Tüm bilgileri siler", "Yalnızca vücut ısısını düzenler"],
        correctIndex: 1,
      },
      {
        question: "Hafıza pekiştirme hangi uyku evresinde yoğunlaşır?",
        options: ["Hafif uyku", "Derin uyku", "Uyanıklık", "Uykuya dalış anı"],
        correctIndex: 1,
      },
      {
        question: "Bazı araştırmacılara göre rüya görme evresi neyle ilişkilidir?",
        options: ["Kas gelişimiyle", "Duygusal belleğin işlenmesiyle", "Sindirimle", "Kemik yoğunluğuyla"],
        correctIndex: 1,
      },
      {
        question: "Uykusuz kişiler performans düşüşünü neden fark etmez?",
        options: ["Düşüş çok küçük olduğu için", "Kendi performansını değerlendirme yeteneği de aynı ölçüde zayıfladığı için", "Ölçüm yapılamadığı için", "Düşüş yalnızca gece görüldüğü için"],
        correctIndex: 1,
      },
      {
        question: "Son yıllarda öne çıkan bulgu nedir?",
        options: ["Uykunun tamamen gereksiz olduğu", "Uyku sırasında beyin dokusundaki sıvı akışının artarak atık maddeleri daha etkin uzaklaştırdığı", "Rüyaların hafızayı bozduğu", "Derin uykunun zararlı olduğu"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-07',
    text: "Şehir planlamacıları, artan nüfusla birlikte ortaya çıkan trafik sıkışıklığını azaltmak için uzun süre tek bir çözüme başvurdu: daha fazla ve daha geniş yol. Ancak yıllar içinde biriken veriler bu yaklaşımın beklenen sonucu vermediğini gösterdi. Yol kapasitesi arttıkça yolculuk başlangıçta kolaylaşıyor, bu kolaylık daha fazla kişiyi araç kullanmaya yöneltiyor ve sıkışıklık birkaç yıl içinde eski seviyesine dönüyordu. Bu döngü, ulaşım yazınında talep artışı olarak tanımlanır.\n\nBu nedenle bugünkü yaklaşım, yol kapasitesini artırmak yerine yolculuk talebini yeniden dağıtmaya odaklanmaktadır. Toplu taşıma ağlarının genişletilmesi bu stratejinin merkezinde yer alır; ancak tek başına yeterli değildir. Bir kişinin metroyu tercih edebilmesi için durağa güvenli ve rahat biçimde ulaşabilmesi gerekir. Bu da yaya kaldırımlarını, geçitleri ve bisiklet yollarını doğrudan ulaşım altyapısının parçası hâline getirir.\n\nBazı Avrupa şehirlerinde uygulanan bu bütünleşik yaklaşım ölçülebilir sonuçlar vermiştir. Merkez bölgelerdeki araç yoğunluğu belirgin biçimde azalmış, hava kalitesi iyileşmiş ve gürültü seviyesi düşmüştür. Beklenmedik bir sonuç ise ticari olmuştur: araç trafiğinin azaltıldığı caddelerde esnaf cirosunun düşmediği, birçok örnekte arttığı görülmüştür. Yaya sayısının artması, dükkânların önünden geçen potansiyel müşteri sayısını da artırmıştır.\n\nUygulamalar her zaman sorunsuz ilerlememiştir. Otopark alanlarının kaldırılması ve araç şeritlerinin daraltılması, ilk aşamada çoğu zaman tepkiyle karşılanmıştır. Bu nedenle birçok şehir, kalıcı düzenlemeye geçmeden önce geçici uygulamalarla başlamayı tercih etmektedir. Belirli bir cadde, birkaç ay boyunca hafif malzemelerle yayalaştırılır; sonuçlar ölçülür ve düzenleme ancak veriler olumluysa kalıcı hâle getirilir.\n\nBu dönüşümün en zor tarafı ise alışkanlıkların değişme süresidir. Yeni bir hattın ya da yayalaştırılmış bir caddenin etkisi genellikle ilk haftalarda değil, aylar sonra netleşir. İnsanlar rotalarını, işe gidiş saatlerini ve hatta oturdukları yeri zaman içinde yeni koşullara göre yeniden düzenler. Bu nedenle planlamacılar, bir düzenlemenin başarısını erken verilerle değerlendirmenin yanıltıcı olabileceğini vurgular. Kalıcı sonuçlar ancak yıllara yayılan ölçümlerle güvenilir biçimde okunabilir.\n\nBu yaklaşımın erişilebilirlik boyutu da vardır. Araç sahibi olmayan, yaşlı ya da hareket kısıtlılığı bulunan kişiler için şehirde dolaşabilmek doğrudan kaldırım ve toplu taşıma kalitesine bağlıdır. Yüksek kaldırımlar, dar geçitler ve bakımsız duraklar bu grupların şehir yaşamına katılımını fiilen sınırlar. Dolayısıyla yaya altyapısına yapılan yatırım yalnızca bir trafik çözümü değil, aynı zamanda bir erişim hakkı meselesidir.",
    difficulty: 7,
    questions: [
      {
        question: "Yol kapasitesini artırmanın beklenen sonucu vermemesinin nedeni nedir?",
        options: ["Yolların çabuk bozulması", "Kolaylaşan yolculuğun daha fazla kişiyi araç kullanmaya yöneltmesi", "İnşaat maliyetlerinin yüksekliği", "Nüfusun azalması"],
        correctIndex: 1,
      },
      {
        question: "Bugünkü yaklaşım neye odaklanmaktadır?",
        options: ["Yol kapasitesini artırmaya", "Yolculuk talebini yeniden dağıtmaya", "Araç satışlarını kısıtlamaya", "Şehir nüfusunu azaltmaya"],
        correctIndex: 1,
      },
      {
        question: "Toplu taşımanın tek başına yeterli olmamasının nedeni nedir?",
        options: ["Çok pahalı olması", "Kişinin durağa güvenli ve rahat ulaşabilmesi için yaya ve bisiklet altyapısının da gerekmesi", "Araçların yetersiz olması", "Sefer sayısının fazla olması"],
        correctIndex: 1,
      },
      {
        question: "Araç trafiğinin azaltıldığı caddelerde ticari sonuç ne olmuştur?",
        options: ["Esnaf cirosu keskin biçimde düşmüştür", "Ciro düşmemiş, birçok örnekte artmıştır", "Dükkânlar kapanmıştır", "Kira bedelleri sıfırlanmıştır"],
        correctIndex: 1,
      },
      {
        question: "Şehirler kalıcı düzenlemeden önce neden geçici uygulamalarla başlar?",
        options: ["Maliyeti tamamen ortadan kaldırmak için", "Sonuçları ölçüp ancak veriler olumluysa kalıcı hâle getirmek için", "Yasal zorunluluk olduğu için", "Turistleri çekmek için"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-08',
    text: "Finans piyasalarında algoritmik ticaret sistemleri, saniyenin çok küçük bir kesrinde binlerce emir gönderip iptal edebilir. Bu sistemler, fiyat farklarını insan tepki süresinin çok altında sürelerde değerlendirerek işlem yapar. Hız avantajı o kadar belirleyicidir ki, bazı şirketler sunucularını borsanın veri merkezine fiziksel olarak birkaç metre daha yakın konumlandırmak için ciddi bedeller ödemektedir; çünkü sinyalin kablo boyunca aldığı mesafe bile sonuca etki edebilmektedir.\n\nBu yapının savunucuları, algoritmik işlemlerin piyasa derinliğini artırdığını ve alış ile satış fiyatı arasındaki farkı daralttığını belirtir. Bu, sıradan yatırımcı için de işlem maliyetinin düşmesi anlamına gelir. Ancak sistemin kırılgan bir yanı vardır: bu likidite kalıcı bir taahhüt değildir. Piyasa beklenmedik biçimde hareketlendiğinde algoritmalar aynı hızla çekilebilir ve alım satım derinliği bir anda ortadan kalkabilir.\n\nFlaş çöküş olarak adlandırılan olaylar tam olarak bu koşulda ortaya çıkar. Bir sistemin verdiği satış emri fiyatı düşürür, bu düşüş başka sistemlerin eşiklerini tetikler, onların emirleri fiyatı daha da aşağı çeker ve dakikalar içinde şiddetli bir düşüş zinciri oluşur. Bazı durumlarda fiyatlar kısa süre sonra eski seviyesine dönmüş, ancak bu arada gerçekleşen işlemler kalıcı zararlar bırakmıştır.\n\nDüzenleyici kurumlar bu tür olayları önlemek için çeşitli mekanizmalar geliştirmiştir. Bunların başında devre kesiciler gelir: bir varlığın fiyatı belirlenen sürede belirli bir yüzdeden fazla değişirse işlemler kısa süreliğine durdurulur. Bu duraklama, hem sistemlerin hem de insanların durumu değerlendirmesine zaman tanır. Emir gönderme hızını sınırlayan kurallar ve iptal edilen emirlerin oranını izleyen denetim yöntemleri de aynı amaca hizmet eder.\n\nBu tartışmanın bir de erişim boyutu vardır. Milisaniye düzeyindeki avantajı elde etmek için gereken altyapı son derece pahalıdır ve yalnızca büyük kurumların ulaşabileceği bir yatırımdır. Eleştirenler, bunun piyasada eşit olmayan bir yapı oluşturduğunu savunur. Savunanlar ise bu yatırımların daralan işlem maliyetleri yoluyla tüm katılımcılara dolaylı fayda sağladığını öne sürer. Düzenleyicilerin görevi, bu iki savı dengeleyen kurallar tasarlamaktır.\n\nSistemlerin denetlenmesi de kendine özgü güçlükler taşır. Bir algoritmanın neden belirli bir anda emir gönderdiğini sonradan açıklamak, çoğu zaman kodun kendisini incelemeyi gerektirir; oysa bu kodlar ticari sır olarak korunur. Bu nedenle düzenleyiciler doğrudan koda değil, işlem kayıtlarının bıraktığı izlere odaklanır. Emir gönderme ve iptal etme örüntüleri, piyasayı yanıltmaya yönelik davranışların tespitinde temel veri kaynağıdır.",
    difficulty: 8,
    questions: [
      {
        question: "Algoritmik ticaret sistemlerinin temel avantajı nedir?",
        options: ["Düşük risk", "İnsan tepki süresinin çok altında hızda işlem yapabilmek", "Sabit kazanç garantisi", "Basit kullanım"],
        correctIndex: 1,
      },
      {
        question: "Şirketler neden sunucularını borsanın veri merkezine yakın konumlandırır?",
        options: ["Kira daha ucuz olduğu için", "Sinyalin kablo boyunca aldığı mesafenin bile sonuca etki etmesi nedeniyle", "Yasal zorunluluk olduğu için", "Elektrik tasarrufu için"],
        correctIndex: 1,
      },
      {
        question: "Algoritmik likiditenin kırılgan yanı nedir?",
        options: ["Çok pahalı olması", "Kalıcı bir taahhüt olmaması ve piyasa hareketlendiğinde aniden çekilebilmesi", "Yalnızca gece çalışması", "Sadece küçük hisselerde bulunması"],
        correctIndex: 1,
      },
      {
        question: "Flaş çöküş nasıl ortaya çıkar?",
        options: ["Tek bir insan hatasından", "Bir sistemin emrinin diğerlerinin eşiklerini tetiklemesiyle oluşan zincirleme düşüşten", "Elektrik kesintisinden", "Borsanın kapanmasından"],
        correctIndex: 1,
      },
      {
        question: "Devre kesici mekanizması nasıl çalışır?",
        options: ["Tüm algoritmaları kalıcı olarak yasaklar", "Fiyat belirli sürede belirli yüzdeden fazla değişirse işlemleri kısa süreliğine durdurur", "İşlem ücretlerini artırır", "Yalnızca büyük yatırımcıları engeller"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-09',
    text: "Kuantum bilgisayarlar, klasik bilgisayarların temel birimi olan ve yalnızca sıfır ya da bir değerini alabilen bitler yerine kübitleri kullanır. Bir kübit, ölçülene kadar bu iki durumun belirli oranlarda karışımı hâlinde bulunabilir. Buna üst üste binme denir. Ayrıca kübitler birbirleriyle dolanık hâle getirilebilir; bu durumda bir kübitin ölçüm sonucu diğerininkiyle klasik olarak açıklanamayan biçimde ilişkilenir.\n\nBu iki özellik, belirli problem türlerinde çok büyük bir hız avantajı sağlar. Ancak yaygın bir yanlış anlama vardır: kuantum bilgisayarlar tüm hesaplamaları hızlandırmaz. Avantaj, yapısı bu özelliklere uygun problemlerle sınırlıdır. Büyük sayıların çarpanlarına ayrılması, moleküllerin davranışının benzetimi ve bazı arama problemleri bu kategoriye girer. Günlük yazılımların büyük bölümü için klasik bilgisayarlar hem yeterli hem de çok daha pratiktir.\n\nEn büyük mühendislik zorluğu kübitlerin kararsızlığıdır. Kübitler çevreyle en küçük etkileşimde bile taşıdıkları bilgiyi kaybeder; bu sürece dekoherans denir. Bu nedenle sistemler mutlak sıfıra çok yakın sıcaklıklarda, titreşimden ve elektromanyetik gürültüden yalıtılmış ortamlarda çalıştırılır. Bu koşullarda bile bir kübitin kararlı kalabildiği süre son derece kısadır.\n\nÇözüm olarak hata düzeltme yöntemleri geliştirilmektedir. Buradaki temel fikir, bilgiyi tek bir fiziksel kübitte tutmak yerine çok sayıda fiziksel kübite yayarak tek bir mantıksal kübit oluşturmaktır. Böylece bireysel hatalar tespit edilip düzeltilebilir. Ancak bunun bedeli ağırdır: kullanışlı tek bir mantıksal kübit için binlerce fiziksel kübit gerekebilir. Bugünkü araştırmaların önemli bir kısmı, bu oranı düşürmeye ve kübitlerin kararlılık süresini uzatmaya odaklanmıştır.\n\nBu tabloya rağmen alan hızla ilerlemektedir. Kübit sayıları her yıl artmakta, hata oranları düşmekte ve farklı fiziksel yaklaşımlar aynı anda denenmektedir. Süperiletken devreler, tuzaklanmış iyonlar ve fotonik sistemler bunların başlıcalarıdır; her birinin kendine özgü avantaj ve sınırlamaları vardır. Hangi yaklaşımın uzun vadede baskın hâle geleceği henüz belli değildir. Bu belirsizlik, alanın hem en zorlayıcı hem de en canlı yanını oluşturmaktadır.\n\nBu gelişmelerin şifreleme üzerindeki olası etkisi de yakından izlenmektedir. Bugün yaygın olarak kullanılan bazı şifreleme yöntemleri, büyük sayıların çarpanlarına ayrılmasının klasik bilgisayarlar için çok zor olmasına dayanır. Yeterince güçlü bir kuantum bilgisayar bu zorluğu ortadan kaldırabilir. Bu ihtimal nedeniyle, kuantum bilgisayarlara karşı dayanıklı olduğu değerlendirilen yeni şifreleme yöntemleri şimdiden geliştirilmekte ve kademeli olarak kullanıma alınmaktadır.",
    difficulty: 9,
    questions: [
      {
        question: "Kübitler klasik bitlerden hangi bakımdan farklıdır?",
        options: ["Daha ucuzdurlar", "Ölçülene kadar iki durumun karışımı hâlinde bulunabilirler", "Daha yavaş çalışırlar", "Yalnızca bir değerini alırlar"],
        correctIndex: 1,
      },
      {
        question: "Metne göre yaygın yanlış anlama nedir?",
        options: ["Kuantum bilgisayarların hiç çalışmadığı", "Kuantum bilgisayarların tüm hesaplamaları hızlandırdığı sanılması", "Kübitlerin hiç hata yapmadığı", "Klasik bilgisayarların artık gereksiz olduğu"],
        correctIndex: 1,
      },
      {
        question: "Dekoherans nedir?",
        options: ["Kübitlerin ısınması", "Kübitlerin çevreyle etkileşimde taşıdıkları bilgiyi kaybetmesi", "İşlemcinin yavaşlaması", "Verinin şifrelenmesi"],
        correctIndex: 1,
      },
      {
        question: "Hata düzeltmedeki temel fikir nedir?",
        options: ["Kübit sayısını azaltmak", "Bilgiyi çok sayıda fiziksel kübite yayarak tek bir mantıksal kübit oluşturmak", "Sistemi ısıtmak", "Ölçümü hiç yapmamak"],
        correctIndex: 1,
      },
      {
        question: "Hata düzeltmenin bedeli nedir?",
        options: ["Hesaplamanın imkânsız hâle gelmesi", "Kullanışlı tek bir mantıksal kübit için binlerce fiziksel kübit gerekmesi", "Sonuçların şifrelenememesi", "Elektrik tüketiminin sıfırlanması"],
        correctIndex: 1,
      }
    ]
  },
  {
    id: 'cs-10',
    text: "Bir ekonomideki enflasyon beklentileri, yalnızca geçmiş fiyat verilerine değil, aynı zamanda hane halkının ve firmaların geleceğe dair öznel tahminlerine de dayanır. Bu ayrım önemlidir; çünkü beklenti, geçmişin pasif bir yansıması değil, bugünkü davranışı belirleyen etkin bir değişkendir.\n\nBu mekanizma kendi kendini gerçekleştiren bir döngü oluşturabilir. Önümüzdeki dönemde maliyetlerin artacağını düşünen bir firma, zarar etmemek için fiyatını şimdiden yükseltir. Ücret pazarlığına giren çalışan, alım gücünü korumak için daha yüksek bir artış talep eder. Tüketici ise fiyatların yükseleceği inancıyla harcamasını öne çeker. Bu davranışların her biri tek başına makul olsa da toplamı, beklenen enflasyonun fiilen gerçekleşmesine katkıda bulunur.\n\nMerkez bankalarının güvenilirliği bu döngüyü kırmada belirleyici rol oynar. Kararlı ve öngörülebilir bir para politikası, beklentileri belirli bir hedefe çapalar. Kamuoyu, enflasyonun uzun vadede hedefe döneceğine inanıyorsa geçici fiyat şoklarına aşırı tepki vermez ve şok kalıcı bir sarmala dönüşmez. Bu nedenle iletişim, faiz kararının kendisi kadar önemli hâle gelmiştir; bankaların yayımladığı öngörüler ve gerekçeler bu çapalamanın araçlarıdır.\n\nSüreci zorlaştıran bir başka etken gecikmedir. Para politikası kararlarının ekonomiye tam olarak yansıması aylar, bazen bir yıldan uzun sürer. Politika yapıcılar, bugünkü verilere bakarak değil, bugün alınan kararın bir yıl sonraki etkisini tahmin ederek karar almak zorundadır. Bu, sürekli belirsizlik altında yön bulmayı gerektirir.\n\nGüvenilirliğin en kırılgan yanı ise asimetrik olmasıdır: uzun yıllarda kazanılan güven, tutarsız birkaç kararla hızla kaybedilebilir. Kaybedilen güvenin yeniden inşası ise genellikle çok daha uzun sürer ve daha yüksek bir ekonomik maliyet gerektirir.\n\nBeklentilerin ölçülmesi de başlı başına bir sorundur. Anketler doğrudan bir fikir verse de, insanların söyledikleriyle davranışları her zaman örtüşmez. Bu nedenle merkez bankaları anketlerin yanı sıra piyasa fiyatlarından türetilen dolaylı göstergelere de bakar. Farklı vadelerdeki tahvil getirileri arasındaki fark, yatırımcıların gelecekteki enflasyona dair tahminini yansıtabilir. Bu göstergelerin hepsi birlikte değerlendirildiğinde bile ortaya çıkan tablo kesin değil, olasılıklı bir tahmindir.\n\nEnflasyonun toplumsal etkisi de eşit dağılmaz. Gelirinin tamamına yakınını zorunlu harcamalara ayıran haneler, fiyat artışlarından çok daha sert biçimde etkilenir; çünkü harcamalarını kısabilecekleri bir alan neredeyse yoktur. Varlık sahibi haneler ise bazı durumlarda fiyat artışlarına karşı kısmen korunabilir. Bu nedenle enflasyon, yalnızca bir para politikası göstergesi değil, aynı zamanda gelir dağılımını doğrudan etkileyen bir olgudur.",
    difficulty: 10,
    questions: [
      {
        question: "Enflasyon beklentileri neye dayanır?",
        options: ["Sadece geçmiş fiyat verilerine", "Geçmiş verilere ve geleceğe dair öznel tahminlere", "Sadece hükümet açıklamalarına", "Sadece döviz kuruna"],
        correctIndex: 1,
      },
      {
        question: "Beklenti neden pasif bir yansıma değildir?",
        options: ["Ölçülemediği için", "Bugünkü davranışı belirleyen etkin bir değişken olduğu için", "Geçmişi değiştirdiği için", "Sadece firmaları ilgilendirdiği için"],
        correctIndex: 1,
      },
      {
        question: "Yüksek enflasyon beklentisi neden kendi kendini gerçekleştirebilir?",
        options: ["Firmalar fiyatı önceden artırdığı, çalışanlar yüksek zam istediği ve tüketici harcamayı öne çektiği için", "Hükümet vergileri düşürdüğü için", "Bankalar kredi vermeyi durdurduğu için", "İthalat arttığı için"],
        correctIndex: 0,
      },
      {
        question: "Merkez bankası iletişimi neden faiz kararı kadar önemlidir?",
        options: ["Yasal zorunluluk olduğu için", "Yayımlanan öngörü ve gerekçelerin beklentileri hedefe çapalamasını sağladığı için", "Faiz kararı etkisiz olduğu için", "Piyasalar iletişimi dikkate almadığı için"],
        correctIndex: 1,
      },
      {
        question: "Güvenilirliğin asimetrik olması ne anlama gelir?",
        options: ["Güven her zaman aynı hızda değişir", "Uzun yıllarda kazanılan güven birkaç tutarsız kararla hızla kaybedilebilir, yeniden inşası çok daha uzun sürer", "Güven hiç kaybedilemez", "Güven yalnızca dış piyasaları etkiler"],
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
