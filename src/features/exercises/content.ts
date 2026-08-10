export interface SentenceMemoryItem {
  sentence: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const sentenceMemoryItems: SentenceMemoryItem[] = [
  {
    sentence: "Ahmet sabah erkenden trene binerek Ankara'ya gitti.",
    question: "Ahmet nereye gitti?",
    options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
    correctIndex: 0,
  },
  {
    sentence: "Ayşe, kütüphaneden aldığı kitabı iki günde bitirdi.",
    question: "Ayşe kitabı nereden aldı?",
    options: ["Okuldan", "Kütüphaneden", "Arkadaşından", "Kitapçıdan"],
    correctIndex: 1,
  },
  {
    sentence: "Masanın üzerindeki kırmızı elmayı kardeşim yedi.",
    question: "Elma ne renkti?",
    options: ["Yeşil", "Sarı", "Kırmızı", "Mor"],
    correctIndex: 2,
  },
  {
    sentence: "Yağmur yağdığı için pikniği iptal etmek zorunda kaldılar.",
    question: "Piknik neden iptal edildi?",
    options: ["Hastalandılar", "Araba bozuldu", "Geç kaldılar", "Yağmur yağdı"],
    correctIndex: 3,
  },
  {
    sentence: "Güneş doğarken kuşların cıvıltısı tüm ormanı sardı.",
    question: "Ormanı saran ses neydi?",
    options: ["Kuş cıvıltısı", "Rüzgar sesi", "Su sesi", "Yaprak hışırtısı"],
    correctIndex: 0,
  },
];

export interface MainIdeaItem {
  paragraph: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const mainIdeaItems: MainIdeaItem[] = [
  {
    paragraph: "Uyku, fiziksel ve zihinsel sağlığımız için kritik bir öneme sahiptir. Düzenli ve yeterli uyumak, bağışıklık sistemini güçlendirir, hafızayı tazeler ve gün içindeki odaklanma süresini artırır. Uzmanlar, yetişkinlerin her gece en az yedi saat kesintisiz uyuması gerektiğini vurguluyor.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Yetişkinler en az 7 saat uyumalıdır.", "Düzenli uyku sağlığımız için vazgeçilmezdir.", "Uyku bağışıklık sistemini güçlendirir.", "Odaklanmak için uyumak gerekir."],
    correctIndex: 1,
  },
  {
    paragraph: "Teknoloji, hayatımızı pek çok yönden kolaylaştırmasına rağmen, yanlış kullanımı ciddi sorunlara yol açabilir. Ekran karşısında geçirilen uzun saatler, hem göz sağlığını olumsuz etkiler hem de sosyal ilişkileri zayıflatır. Bu nedenle, teknolojik aletleri bilinçli ve sınırlı kullanmak büyük önem taşır.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Ekran başında uzun süre kalmak gözü bozar.", "Teknoloji hayatımızı kolaylaştıran bir araçtır.", "Teknolojik cihazlar bilinçli ve kontrollü kullanılmalıdır.", "Sosyal ilişkiler teknoloji yüzünden zayıflar."],
    correctIndex: 2,
  },
  {
    paragraph: "Kitap okumak, sadece kelime dağarcığını zenginleştirmekle kalmaz, aynı zamanda empati yeteneğini de geliştirir. Farklı karakterlerin yaşamlarına tanık olmak, dünyaya farklı pencerelerden bakmamızı sağlar. Düzenli okuma alışkanlığı olan bireylerin, sosyal hayatta daha anlayışlı oldukları gözlemlenmiştir.",
    question: "Bu metnin ana fikri nedir?",
    options: ["Kitap okumak insanın kelime dağarcığını geliştirir.", "Farklı karakterler empati kurmayı kolaylaştırır.", "Düzenli okumak empati ve anlayışı artırır.", "Kitap okuyanlar sosyal hayatta daha mutludur."],
    correctIndex: 2,
  },
];

export interface KeywordItem {
  paragraph: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const keywordItems: KeywordItem[] = [
  {
    paragraph: "Bugün hava çok güzeldi. Öğleden sonra parka gidip biraz yürüyüş yaptım. Parkta çok sayıda köpek vardı, hepsi neşeyle koşuşturuyordu.",
    question: "Metinde geçen hayvan hangisidir?",
    options: ["Kedi", "Kuş", "Köpek", "At"],
    correctIndex: 2,
  },
  {
    paragraph: "Yaz tatilinde Antalya'ya gitmeyi planlıyoruz. Orada denize girecek, bol bol güneşlenecek ve tarihi yerleri gezeceğiz.",
    question: "Metinde hangi şehirden bahsediliyor?",
    options: ["İzmir", "Antalya", "Muğla", "Aydın"],
    correctIndex: 1,
  },
  {
    paragraph: "Pazar sabahı kahvaltıda yumurta, peynir, zeytin ve taze sıkılmış portakal suyu vardı. Ailecek uzun süre masadan kalkmadık.",
    question: "Kahvaltıda hangi içecek vardı?",
    options: ["Çay", "Kahve", "Portakal Suyu", "Süt"],
    correctIndex: 2,
  },
];

export interface ComprehensionSpeedItem {
  text: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const comprehensionSpeedItems: ComprehensionSpeedItem[] = [
  {
    text: "Tarihte bilinen ilk kütüphane, Asur kralı Asurbanipal tarafından M.Ö. 7. yüzyılda Ninova'da kurulmuştur. Bu kütüphane, on binlerce çivi yazılı kil tablet içeriyordu. Gılgamış Destanı'nın en eksiksiz kopyası da bu kütüphanede bulunmuştur. Asurbanipal, bilime ve edebiyata büyük önem veren bir hükümdardı.",
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
  }
];

export const wordList = [
  "kitap", "kalem", "masa", "araba", "güneş", "deniz", "orman", "kedi", "köpek", "kuş",
  "çocuk", "okul", "bilgisayar", "telefon", "saat", "gözlük", "defter", "silgi", "çanta",
  "çiçek", "ağaç", "bulut", "yağmur", "rüzgar", "yıldız", "ay", "Dünya", "şehir", "sokak",
  "ev", "kapı", "pencere", "duvar", "tavan", "zemin", "halı", "koltuk", "televizyon",
  "radyo", "müzik", "şarkı", "resim", "fotoğraf", "renk", "kırmızı", "mavi", "yeşil",
  "sarı", "siyah", "beyaz", "yemek", "su", "ekmek", "peynir", "zeytin", "yumurta"
];

export const categoryWords = {
  animals: ["kedi", "köpek", "at", "inek", "kuş", "balık", "tavşan", "aslan", "kaplan", "fil", "zürafa", "ayı"],
  fruits: ["elma", "armut", "muz", "çilek", "kiraz", "karpuz", "kavun", "portakal", "mandalina", "üzüm"],
  colors: ["kırmızı", "mavi", "yeşil", "sarı", "siyah", "beyaz", "mor", "turuncu", "gri", "kahverengi"],
  objects: ["kalem", "kitap", "masa", "sandalye", "araba", "telefon", "bilgisayar", "saat", "çanta"]
};
