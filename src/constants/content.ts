import { ReadingText } from "@/types/exercise";

export const COMPREHENSION_TEXTS: ReadingText[] = [
  {
    id: 'text-001',
    language: 'tr',
    title: 'Kahvenin Tarihçesi',
    difficulty: 2,
    tags: ['Tarih', 'Kültür', 'İçecek'],
    content: `Kahve, dünya genelinde en çok tüketilen içeceklerden biridir. Efsaneye göre, kahvenin uyarıcı etkisi ilk kez 9. yüzyılda Etiyopya'da Kaldi adında bir keçi çobanı tarafından keşfedilmiştir. Keçilerinin belirli bir ağacın kırmızı meyvelerini yedikten sonra daha enerjik olduğunu fark eden Kaldi, bu meyveleri kendisi de denemiştir. Sonrasında bu keşif bölgedeki manastırlara yayılmış, rahipler uzun dua seansları boyunca uyanık kalmak için bu meyvelerden yapılan bir içecek tüketmeye başlamışlardır. Zamanla kahve ticareti Arap Yarımadası'na ulaşmış ve 15. yüzyılda Yemen'de kahve tarımı başlamıştır. Kahvehaneler hızla sosyalleşme, haberleşme ve entelektüel tartışmaların merkezi haline gelmiştir. 17. yüzyıla gelindiğinde kahve, Avrupa'ya ulaşmış ve "Arap şarabı" olarak adlandırılarak büyük ilgi görmüştür. Bugün kahve, milyarlarca dolarlık küresel bir endüstri olup, farklı kültürlerde sayısız hazırlama yöntemiyle tüketilmektedir.`,
    questions: [
      {
        id: 'q-001-1',
        type: 'detail',
        text: 'Kahvenin uyarıcı etkisi efsaneye göre ilk nerede keşfedilmiştir?',
        options: ['Yemen', 'Avrupa', 'Etiyopya', 'Arap Yarımadası'],
        correctAnswerIndex: 2,
        explanation: 'Metne göre kahve ilk kez 9. yüzyılda Etiyopya\'da keşfedilmiştir.'
      },
      {
        id: 'q-001-2',
        type: 'true_false',
        text: 'Kahve tarımı 15. yüzyılda Yemen\'de başlamıştır.',
        options: ['Doğru', 'Yanlış'],
        correctAnswerIndex: 0,
        explanation: 'Metinde "15. yüzyılda Yemen\'de kahve tarımı başlamıştır." ifadesi yer almaktadır.'
      },
      {
        id: 'q-001-3',
        type: 'inference',
        text: 'Avrupalıların kahveyi "Arap şarabı" olarak adlandırmasının en olası nedeni aşağıdakilerden hangisidir?',
        options: [
          'Kahvenin alkollü bir içecek olması',
          'Kahvenin Arap Yarımadası üzerinden gelmiş egzotik bir içecek olması',
          'Kahvenin kırmızı renkli meyvelerden yapılması',
          'Kahvehanelerin şarap mahzenlerine benzemesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Kahve Avrupa\'ya Arap coğrafyasından geldiği ve o dönem için yeni, etkili bir içecek olduğu için bu isim verilmiştir.'
      },
      {
        id: 'q-001-4',
        type: 'main_idea',
        text: 'Bu metnin ana düşüncesi aşağıdakilerden hangisidir?',
        options: [
          'Kahve sadece Etiyopya\'da yetişen bir bitkidir.',
          'Rahiplerin dualarında uyanık kalmalarının tek yolu kahvedir.',
          'Kahvehaneler eski dönemlerin en önemli eğitim kurumlarıdır.',
          'Kahve, efsanevi bir keşiften başlayarak küresel bir kültür ve endüstri haline gelmiştir.'
        ],
        correctAnswerIndex: 3,
        explanation: 'Metin, kahvenin çoban Kaldi tarafından keşfinden günümüzdeki küresel endüstrisine kadar olan yolculuğunu özetlemektedir.'
      }
    ]
  },
  {
    id: 'text-002',
    language: 'tr',
    title: 'Derin Deniz Keşifleri',
    difficulty: 4,
    tags: ['Bilim', 'Okyanus', 'Biyoloji'],
    content: `Okyanusların en derin ve karanlık bölgeleri, Dünya üzerindeki en az keşfedilmiş yerlerdir. Uzun yıllar boyunca bilim insanları, güneş ışığının ulaşmadığı, basıncın yüzeye göre yüzlerce kat fazla olduğu bu derinliklerde yaşamın mümkün olmadığını düşünmüşlerdir. Ancak 1970'lerde hidrotermal bacaların (deniz tabanındaki sıcak su kaynakları) keşfedilmesiyle bu görüş tamamen değişmiştir. Bu bacaların etrafında, güneşe değil, dünyanın iç ısısına ve kimyasal reaksiyonlara dayalı, kemosentez yapan bakteriler etrafında şekillenmiş bütün bir ekosistem bulunmuştur. Dev tüp solucanları, kör karidesler ve tuhaf yengeç türleri bu ekstrem koşullara evrimsel olarak uyum sağlamıştır. Ayrıca derin deniz canlılarının birçoğu biyolüminesans (kendi ışığını üretme) yeteneğine sahiptir. Bu yetenek, karanlık sularda avlanmak, iletişim kurmak veya avcılardan saklanmak için hayati bir öneme sahiptir. Mariana Çukuru gibi ekstrem derinliklere yapılan modern dalışlar, her seferinde bilime yeni türler kazandırmakta ve biyolojik dayanıklılığın sınırlarını yeniden tanımlamaktadır.`,
    questions: [
      {
        id: 'q-002-1',
        type: 'detail',
        text: 'Hidrotermal bacaların keşfi hangi on yılda gerçekleşmiştir?',
        options: ['1950\'ler', '1960\'lar', '1970\'ler', '1980\'ler'],
        correctAnswerIndex: 2,
        explanation: 'Metinde "1970\'lerde hidrotermal bacaların keşfedilmesiyle" ifadesi açıkça geçmektedir.'
      },
      {
        id: 'q-002-2',
        type: 'main_idea',
        text: 'Hidrotermal bacalar etrafındaki ekosistemin en temel özelliği nedir?',
        options: [
          'Sadece yüzeyden düşen organik atıklarla beslenmeleri',
          'Güneş ışığına değil, kimyasal reaksiyonlara (kemosentez) dayanmaları',
          'Tüm canlıların biyolüminesans özelliğine sahip olması',
          'Okyanus yüzeyindeki sıcaklıklarla aynı ısıya sahip olmaları'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, bu ekosistemin güneşe değil, dünyanın iç ısısına ve kemosentez yapan bakterilere dayandığını vurgulamaktadır.'
      },
      {
        id: 'q-002-3',
        type: 'multiple_choice',
        text: 'Aşağıdakilerden hangisi derin deniz canlılarının kendi ışıklarını üretme (biyolüminesans) nedenlerinden biri olarak sayılmamıştır?',
        options: ['Avlanmak', 'İletişim kurmak', 'Avcılardan saklanmak', 'Isınmak'],
        correctAnswerIndex: 3,
        explanation: 'Metinde biyolüminesansın avlanmak, iletişim kurmak ve avcılardan saklanmak için kullanıldığı belirtilmiş, ısınmak ise sayılmamıştır.'
      },
      {
        id: 'q-002-4',
        type: 'inference',
        text: 'Metindeki bilgilere dayanarak aşağıdaki çıkarımlardan hangisi yapılabilir?',
        options: [
          'Mariana Çukuru okyanusların tek hidrotermal baca noktasıdır.',
          'Güneş ışığının olmaması yaşamın gelişmesi için kesin bir engel değildir.',
          'Derin deniz canlıları yüzeye çıkarıldıklarında daha hızlı çoğalırlar.',
          'Bilim insanları 1970\'lerden önce okyanus tabanını tamamen haritalandırmıştı.'
        ],
        correctAnswerIndex: 1,
        explanation: '1970\'lerdeki keşifler, güneş ışığı olmasa da farklı kimyasal süreçlerle yaşamın var olabileceğini kanıtlamıştır.'
      }
    ]
  },
  {
    id: 'text-003',
    language: 'tr',
    title: 'Mars Kolonizasyonu: Zorluklar ve Umutlar',
    difficulty: 6,
    tags: ['Uzay', 'Teknoloji', 'Gelecek'],
    content: `İnsanlığın Dünya dışında bir gezegende yaşam kurma hayali, Mars odaklı projelerle giderek gerçeğe yaklaşıyor. Kızıl Gezegen, Güneş Sistemi'nde yaşanabilirlik açısından Dünya'ya en çok benzeyen gök cismi olsa da, kolonizasyon süreci devasa teknolojik ve biyolojik zorluklar barındırıyor. En büyük sorunlardan biri radyasyondur. Mars'ın Dünya gibi koruyucu bir manyetik alanı ve yoğun bir atmosferi yoktur; bu nedenle yüzeydeki astronotlar yoğun kozmik ışınlara maruz kalacaktır. Bu radyasyondan korunmak için yer altı habitatlarının inşa edilmesi veya özel kalkan teknolojilerinin geliştirilmesi şarttır. İkinci büyük zorluk ise mikro yerçekimidir. Mars'ın yerçekimi Dünya'nınkinin yaklaşık %38'i kadardır. Uzun süre düşük yerçekiminde kalmak insanlarda kemik erimesi ve kas kaybına yol açmaktadır. Bunlara ek olarak, Mars'taki dondurucu soğuklar, suyun büyük oranda buz halinde bulunması ve atmosferin %95'inin karbondioksitten oluşması, kapalı ve sürdürülebilir yaşam destek sistemlerinin kusursuz çalışmasını zorunlu kılmaktadır. Tüm bu engellere rağmen, bilim insanları in-situ kaynak kullanımı (yerinde kaynak kullanımı) sayesinde Mars toprağından su ve yakıt üretmenin yollarını geliştirmekte, gezegenler arası bir medeniyet olma yolunda umutlu adımlar atmaktadır.`,
    questions: [
      {
        id: 'q-003-1',
        type: 'detail',
        text: 'Mars yüzeyindeki radyasyon tehlikesinin temel nedeni nedir?',
        options: [
          'Gezegenin Güneş\'e çok yakın olması',
          'Koruyucu bir manyetik alanının ve yoğun atmosferinin olmaması',
          'Mars toprağında yüksek miktarda radyoaktif madde bulunması',
          'Karbondioksit oranının %95 olması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde radyasyon sorununun nedeni olarak koruyucu manyetik alan ve yoğun atmosferin eksikliği gösterilmiştir.'
      },
      {
        id: 'q-003-2',
        type: 'multiple_choice',
        text: 'Mars\'ın düşük yerçekimi insan vücudunda hangi fiziksel sorunlara yol açabilir?',
        options: [
          'Görme bozukluğu ve işitme kaybı',
          'Kemik erimesi ve kas kaybı',
          'Solunum yetmezliği ve kalp büyümesi',
          'Hafıza kaybı ve uyku bozukluğu'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde uzun süre düşük yerçekiminde kalmanın "kemik erimesi ve kas kaybına" yol açtığı belirtilmiştir.'
      },
      {
        id: 'q-003-3',
        type: 'true_false',
        text: 'Mars atmosferinin büyük bir kısmı oksijenden oluşmaktadır.',
        options: ['Doğru', 'Yanlış'],
        correctAnswerIndex: 1,
        explanation: 'Yanlış. Metinde atmosferin %95\'inin karbondioksitten oluştuğu belirtilmiştir.'
      },
      {
        id: 'q-003-4',
        type: 'inference',
        text: '"In-situ kaynak kullanımı" stratejisinin temel amacı aşağıdakilerden hangisidir?',
        options: [
          'Dünya\'dan Mars\'a düzenli olarak yakıt ve su taşıyabilmek',
          'Mars\'ın kendi kaynaklarını kullanarak dışa bağımlılığı azaltmak',
          'Mars toprağını Dünya\'ya getirerek incelemek',
          'Güneş enerjisini kullanarak Mars\'ın manyetik alanını yeniden yaratmak'
        ],
        correctAnswerIndex: 1,
        explanation: 'İn-situ (yerinde) kaynak kullanımı, Mars toprağından su ve yakıt üretmek yani oradaki kaynakları kullanarak hayatta kalmayı amaçlar.'
      },
      {
        id: 'q-003-5',
        type: 'main_idea',
        text: 'Metnin en kapsamlı özeti aşağıdakilerden hangisidir?',
        options: [
          'Mars\'ın düşük yerçekimi insan sağlığı için en büyük tehdittir.',
          'Mars kolonizasyonu imkansızdır çünkü atmosferi solumaya uygun değildir.',
          'Mars\'ta yaşamak devasa teknolojik zorluklar içerse de, geliştirilen yeni teknolojilerle bu hedef gerçekçi bir umut taşımaktadır.',
          'Gezegenler arası seyahat sadece radyasyon kalkanları bulunduğunda mümkün olacaktır.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Metin hem zorluklardan (radyasyon, yerçekimi, hava) bahsetmekte hem de yerinde kaynak kullanımı gibi çözümlerle umutlu olunduğunu özetlemektedir.'
      }
    ]
  }
];
