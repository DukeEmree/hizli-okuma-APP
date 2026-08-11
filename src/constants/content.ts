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
  },
  {
    id: 'text-004',
    language: 'tr',
    title: 'Türk Çay Kültürü',
    difficulty: 1,
    tags: ['Kültür', 'Gelenek', 'İçecek'],
    content: `Çay, Türkiye'de sabah kahvaltısından akşam sohbetlerine kadar günün her saatinde içilen bir içecektir. Türkiye'nin Karadeniz bölgesi, özellikle Rize ili, çay yetiştiriciliği için elverişli iklime sahiptir. Çay yaprakları toplandıktan sonra kurutulur ve işlenerek bardaklara ulaşır. İnce belli bardaklarda servis edilen çay, Türk misafirperverliğinin de önemli bir simgesidir. Bir eve gelen misafire ilk olarak çay ikram edilmesi yaygın bir gelenektir.`,
    questions: [
      { id: 'q-004-1', type: 'detail', text: 'Türkiye\'de çay yetiştiriciliği en çok hangi bölgede yapılır?', options: ['Ege', 'Karadeniz', 'Akdeniz', 'İç Anadolu'], correctAnswerIndex: 1, explanation: 'Metinde Karadeniz bölgesi, özellikle Rize ili belirtilmiştir.' },
      { id: 'q-004-2', type: 'true_false', text: 'Çay Türkiye\'de sadece sabahları içilir.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 1, explanation: 'Metne göre çay günün her saatinde içilir.' },
      { id: 'q-004-3', type: 'detail', text: 'Çay hangi tür bardaklarda servis edilir?', options: ['Geniş kupalarda', 'İnce belli bardaklarda', 'Plastik bardaklarda', 'Kase şeklinde kaplarda'], correctAnswerIndex: 1, explanation: 'Metinde ince belli bardaklar belirtilmiştir.' },
      { id: 'q-004-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['Çay sadece Rize\'de üretilir.', 'Çay, Türk kültüründe günlük yaşamın ve misafirperverliğin önemli bir parçasıdır.', 'Çay bardakları çok pahalıdır.', 'Herkes çayı aynı şekilde sever.'], correctAnswerIndex: 1, explanation: 'Metin çayın günlük yaşamdaki ve misafirlik kültüründeki yerini anlatır.' }
    ]
  },
  {
    id: 'text-005',
    language: 'tr',
    title: 'Bal Arıları ve Kovan Düzeni',
    difficulty: 1,
    tags: ['Doğa', 'Biyoloji', 'Hayvanlar'],
    content: `Bal arıları, doğada en düzenli çalışan canlılardan biridir. Bir kovanda tek bir kraliçe arı, binlerce işçi arı ve mevsimine göre değişen sayıda erkek arı bulunur. İşçi arılar çiçeklerden nektar toplar, kovanı temizler ve yavruları besler. Kraliçe arının tek görevi yumurta bırakmaktır. Arılar, kovan içindeki sıcaklığı sabit tutmak için kanatlarını hızla çırparak hava akımı yaratır.`,
    questions: [
      { id: 'q-005-1', type: 'detail', text: 'Kovanda kaç kraliçe arı bulunur?', options: ['Bir', 'İki', 'Üç', 'Değişken'], correctAnswerIndex: 0, explanation: 'Metinde tek bir kraliçe arı olduğu belirtilmiştir.' },
      { id: 'q-005-2', type: 'true_false', text: 'Kraliçe arı nektar toplamakla görevlidir.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 1, explanation: 'Kraliçe arının tek görevi yumurta bırakmaktır, nektar toplamaz.' },
      { id: 'q-005-3', type: 'detail', text: 'Arılar kovan sıcaklığını nasıl sabit tutar?', options: ['Bal üreterek', 'Kanatlarını çırparak hava akımı yaratarak', 'Kovanı büyüterek', 'Güneşte durarak'], correctAnswerIndex: 1, explanation: 'Metinde kanat çırpma ile hava akımı yaratıldığı belirtilir.' },
      { id: 'q-005-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['Arılar tembel canlılardır.', 'Bir arı kovanı, görev dağılımıyla düzenli işleyen bir toplum gibidir.', 'Sadece işçi arılar önemlidir.', 'Kovanlar her zaman aynı büyüklüktedir.'], correctAnswerIndex: 1, explanation: 'Metin, kovandaki görev paylaşımının düzenli bir toplum gibi işlediğini anlatır.' }
    ]
  },
  {
    id: 'text-006',
    language: 'tr',
    title: 'İstanbul\'un Kısa Tarihi',
    difficulty: 3,
    tags: ['Tarih', 'Şehir', 'Kültür'],
    content: `İstanbul, tarih boyunca Bizans İmparatorluğu ve Osmanlı İmparatorluğu olmak üzere iki büyük imparatorluğa başkentlik yapmış nadir şehirlerden biridir. Şehir, Boğaz'ın iki yakasında, hem Avrupa hem de Asya kıtasında yer alması nedeniyle stratejik bir öneme sahiptir. 1453 yılında Fatih Sultan Mehmet tarafından fethedilen şehir, o dönemde İstanbul adını almış ve Osmanlı'nın yönetim merkezi haline gelmiştir. Ayasofya, Topkapı Sarayı ve Sultanahmet Camii gibi tarihi yapılar, şehrin farklı dönemlerinden izler taşımaktadır.`,
    questions: [
      { id: 'q-006-1', type: 'detail', text: 'İstanbul kaç kıtada yer almaktadır?', options: ['Bir', 'İki', 'Üç', 'Dört'], correctAnswerIndex: 1, explanation: 'Metinde şehrin hem Avrupa hem Asya kıtasında yer aldığı belirtilmiştir.' },
      { id: 'q-006-2', type: 'detail', text: 'İstanbul hangi yıl fethedilmiştir?', options: ['1353', '1453', '1553', '1071'], correctAnswerIndex: 1, explanation: 'Metinde fetih tarihi 1453 olarak belirtilmiştir.' },
      { id: 'q-006-3', type: 'detail', text: 'İstanbul\'u fetheden hükümdar kimdir?', options: ['Kanuni Sultan Süleyman', 'Fatih Sultan Mehmet', 'II. Abdülhamit', 'Yavuz Sultan Selim'], correctAnswerIndex: 1, explanation: 'Metinde şehri fethedenin Fatih Sultan Mehmet olduğu belirtilmiştir.' },
      { id: 'q-006-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['İstanbul sadece Bizans döneminde önemliydi.', 'İstanbul, konumu ve tarihi mirasıyla iki imparatorluğa başkentlik yapmış özel bir şehirdir.', 'Ayasofya İstanbul\'un tek tarihi yapısıdır.', 'İstanbul 1453\'ten önce önemsiz bir şehirdi.'], correctAnswerIndex: 1, explanation: 'Metin İstanbul\'un stratejik konumunu ve iki imparatorluğa başkentlik yapmasını özetler.' }
    ]
  },
  {
    id: 'text-007',
    language: 'tr',
    title: 'Matbaanın İcadı',
    difficulty: 3,
    tags: ['Tarih', 'Teknoloji', 'Bilim'],
    content: `Johannes Gutenberg, 15. yüzyılın ortasında hareketli harflerle baskı yapabilen matbaa makinesini geliştirdi. Bu buluş, kitapların elle kopyalanması yerine hızlı ve ucuz biçimde çoğaltılabilmesini sağladı. Matbaanın yaygınlaşmasıyla birlikte bilgiye erişim kolaylaştı ve okuryazarlık oranı zamanla arttı. Gutenberg'in bastığı ilk büyük eser, İncil'in Latince baskısıydı. Bu teknoloji, Avrupa'da bilimsel ve dini fikirlerin hızla yayılmasında büyük rol oynadı.`,
    questions: [
      { id: 'q-007-1', type: 'detail', text: 'Matbaayı kim geliştirmiştir?', options: ['Isaac Newton', 'Johannes Gutenberg', 'Leonardo da Vinci', 'Galileo Galilei'], correctAnswerIndex: 1, explanation: 'Metinde matbaayı Johannes Gutenberg\'in geliştirdiği belirtilmiştir.' },
      { id: 'q-007-2', type: 'true_false', text: 'Matbaadan önce kitaplar elle kopyalanıyordu.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 0, explanation: 'Metinde matbaanın kitapların elle kopyalanmasının yerini aldığı belirtilmiştir.' },
      { id: 'q-007-3', type: 'detail', text: 'Gutenberg\'in bastığı ilk büyük eser hangisidir?', options: ['Bir şiir kitabı', 'İncil\'in Latince baskısı', 'Bir tarih kitabı', 'Bir harita atlası'], correctAnswerIndex: 1, explanation: 'Metinde ilk büyük eserin İncil\'in Latince baskısı olduğu belirtilmiştir.' },
      { id: 'q-007-4', type: 'inference', text: 'Metinden matbaanın en önemli sonucu olarak ne çıkarılabilir?', options: ['Kitap fiyatları arttı.', 'Bilgiye erişim kolaylaştı ve okuryazarlık arttı.', 'El yazması kitaplar daha değerli hale geldi.', 'Matbaa sadece dini kitaplar için kullanıldı.'], correctAnswerIndex: 1, explanation: 'Metin, matbaanın bilgiye erişimi kolaylaştırdığını ve okuryazarlığı artırdığını vurgular.' }
    ]
  },
  {
    id: 'text-008',
    language: 'tr',
    title: 'Çin Seddi',
    difficulty: 4,
    tags: ['Tarih', 'Mimari', 'Coğrafya'],
    content: `Çin Seddi, farklı hanedanlıklar tarafından yüzyıllar boyunca inşa edilmiş, binlerce kilometre uzunluğunda bir savunma yapısıdır. Setin temel amacı, kuzeyden gelebilecek göçebe kabilelerin akınlarına karşı Çin topraklarını korumaktı. Yapının bazı bölümleri dağlık ve ulaşılması zor arazilerde inşa edildiği için, inşaat sırasında binlerce işçi hayatını kaybetmiştir. Günümüzde Çin Seddi'nin yalnızca belirli bölümleri iyi korunmuş durumdadır ve bu bölümler dünyanın dört bir yanından turist çekmektedir.`,
    questions: [
      { id: 'q-008-1', type: 'detail', text: 'Çin Seddi\'nin temel amacı nedir?', options: ['Ticaret yolunu kontrol etmek', 'Kuzeyden gelen akınlara karşı korunmak', 'Turizm geliri elde etmek', 'Nehirleri kontrol etmek'], correctAnswerIndex: 1, explanation: 'Metinde setin göçebe kabilelerin akınlarına karşı koruma amaçlı yapıldığı belirtilmiştir.' },
      { id: 'q-008-2', type: 'detail', text: 'Set kim tarafından inşa edilmiştir?', options: ['Tek bir imparator tarafından', 'Farklı hanedanlıklar tarafından yüzyıllar boyunca', 'Yabancı işgalciler tarafından', 'Modern Çin hükümeti tarafından'], correctAnswerIndex: 1, explanation: 'Metinde farklı hanedanlıkların yüzyıllar boyunca inşa ettiği belirtilmiştir.' },
      { id: 'q-008-3', type: 'true_false', text: 'Çin Seddi\'nin tamamı günümüzde iyi korunmuş durumdadır.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 1, explanation: 'Metinde yalnızca belirli bölümlerin iyi korunduğu belirtilmiştir.' },
      { id: 'q-008-4', type: 'inference', text: 'Metinden Çin Seddi\'nin inşası hakkında ne çıkarılabilir?', options: ['İnşaat kolay ve güvenli geçmiştir.', 'İnşaat zorlu koşullarda gerçekleşmiş ve ağır bir bedeli olmuştur.', 'Set tek bir sezonda tamamlanmıştır.', 'İnşaatta hiç işçi kullanılmamıştır.'], correctAnswerIndex: 1, explanation: 'Metinde dağlık arazi ve işçi kayıpları vurgulanarak inşaatın zorluğu anlatılmıştır.' }
    ]
  },
  {
    id: 'text-009',
    language: 'tr',
    title: 'Fotosentez Nasıl Gerçekleşir',
    difficulty: 5,
    tags: ['Bilim', 'Biyoloji', 'Doğa'],
    content: `Bitkiler, güneş ışığını kullanarak karbondioksit ve suyu glikoz ve oksijene dönüştürür; bu sürece fotosentez denir. Bu işlem, bitkilerin yapraklarındaki kloroplast adı verilen özel yapılarda gerçekleşir. Fotosentez sırasında açığa çıkan oksijen, atmosfere salınarak diğer canlıların solunumu için gerekli olan havayı sağlar. Üretilen glikoz ise bitkinin büyümesi ve enerji ihtiyacı için kullanılır. Fotosentez hızı; ışık şiddeti, sıcaklık ve karbondioksit miktarı gibi etkenlere bağlı olarak değişebilir.`,
    questions: [
      { id: 'q-009-1', type: 'detail', text: 'Fotosentez hangi yapıda gerçekleşir?', options: ['Kökte', 'Kloroplastta', 'Çekirdekte', 'Gövdede'], correctAnswerIndex: 1, explanation: 'Metinde fotosentezin kloroplastlarda gerçekleştiği belirtilmiştir.' },
      { id: 'q-009-2', type: 'detail', text: 'Fotosentez sonucunda hangi gaz açığa çıkar?', options: ['Karbondioksit', 'Azot', 'Oksijen', 'Metan'], correctAnswerIndex: 2, explanation: 'Metinde fotosentez sonucu oksijenin açığa çıktığı belirtilmiştir.' },
      { id: 'q-009-3', type: 'detail', text: 'Fotosentez hızını hangi etkenler etkiler?', options: ['Sadece toprak türü', 'Işık şiddeti, sıcaklık ve karbondioksit miktarı', 'Sadece bitkinin yaşı', 'Sadece su miktarı'], correctAnswerIndex: 1, explanation: 'Metinde bu üç etken açıkça sıralanmıştır.' },
      { id: 'q-009-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['Bitkiler sadece su tüketir.', 'Fotosentez, bitkilerin güneş ışığıyla besin ve oksijen ürettiği hayati bir süreçtir.', 'Kloroplastlar sadece köklerde bulunur.', 'Fotosentez her koşulda aynı hızda gerçekleşir.'], correctAnswerIndex: 1, explanation: 'Metin fotosentezin bitkiler ve diğer canlılar için önemini özetler.' }
    ]
  },
  {
    id: 'text-010',
    language: 'tr',
    title: 'İnternetin Doğuşu',
    difficulty: 5,
    tags: ['Teknoloji', 'Tarih', 'İletişim'],
    content: `İnternetin temelleri, 1960'larda ABD Savunma Bakanlığı'nın desteklediği ARPANET adlı bir proje ile atıldı. Bu proje, farklı üniversitelerdeki bilgisayarları birbirine bağlayarak bilgi paylaşımını hızlandırmayı amaçlıyordu. 1990'larda Tim Berners-Lee'nin geliştirdiği World Wide Web sayesinde internet, teknik bir araç olmaktan çıkıp herkesin kolayca kullanabileceği bir platforma dönüştü. Bugün internet, iletişimden ticarete, eğitimden eğlenceye kadar hayatın hemen her alanını derinden etkilemektedir.`,
    questions: [
      { id: 'q-010-1', type: 'detail', text: 'İnternetin temelleri hangi proje ile atılmıştır?', options: ['World Wide Web', 'ARPANET', 'Ethernet', 'TCP/IP'], correctAnswerIndex: 1, explanation: 'Metinde ARPANET projesi belirtilmiştir.' },
      { id: 'q-010-2', type: 'detail', text: 'World Wide Web\'i kim geliştirmiştir?', options: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Alan Turing'], correctAnswerIndex: 1, explanation: 'Metinde World Wide Web\'i Tim Berners-Lee\'nin geliştirdiği belirtilmiştir.' },
      { id: 'q-010-3', type: 'true_false', text: 'ARPANET, üniversite bilgisayarlarını birbirine bağlamayı amaçlıyordu.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 0, explanation: 'Metinde bu amaç açıkça belirtilmiştir.' },
      { id: 'q-010-4', type: 'inference', text: 'Metinden World Wide Web\'in etkisi hakkında ne çıkarılabilir?', options: ['İnterneti daha karmaşık hale getirmiştir.', 'İnterneti sıradan kullanıcılar için erişilebilir kılmıştır.', 'İnternetin kullanımını azaltmıştır.', 'Sadece askeri amaçlarla kullanılmıştır.'], correctAnswerIndex: 1, explanation: 'Metin, Web sayesinde internetin herkesin kullanabileceği bir platforma dönüştüğünü belirtir.' }
    ]
  },
  {
    id: 'text-011',
    language: 'tr',
    title: 'Volkanlar ve Oluşumu',
    difficulty: 7,
    tags: ['Bilim', 'Coğrafya', 'Doğa'],
    content: `Volkanlar, Dünya'nın manto katmanındaki erimiş kayaçların, yani magmanın, yüzeye ulaşmasıyla oluşan yeryüzü şekilleridir. Magma yüzeye çıktığında lav adını alır ve soğuyarak katılaşır. Volkanik patlamaların şiddeti, magmanın içindeki gaz miktarına ve viskozitesine bağlı olarak büyük farklılıklar gösterebilir; düşük viskoziteli magma genellikle sakin akıntılar oluştururken, yüksek viskoziteli ve gaz bakımından zengin magma şiddetli patlamalara yol açabilir. Volkanik küller, atmosfere yayıldığında güneş ışığını engelleyerek küresel iklimi geçici olarak etkileyebilir.`,
    questions: [
      { id: 'q-011-1', type: 'detail', text: 'Magma yüzeye çıktığında ne adını alır?', options: ['Kül', 'Lav', 'Kayaç', 'Kristal'], correctAnswerIndex: 1, explanation: 'Metinde magmanın yüzeye çıktığında lav adını aldığı belirtilmiştir.' },
      { id: 'q-011-2', type: 'detail', text: 'Volkanik patlamaların şiddeti neye bağlıdır?', options: ['Sadece yüksekliğe', 'Magmanın gaz miktarı ve viskozitesine', 'Sadece bölgenin iklimine', 'Volkanın yaşına'], correctAnswerIndex: 1, explanation: 'Metinde bu iki etken açıkça belirtilmiştir.' },
      { id: 'q-011-3', type: 'multiple_choice', text: 'Düşük viskoziteli magma genellikle nasıl davranır?', options: ['Şiddetli patlamalara yol açar', 'Sakin akıntılar oluşturur', 'Hiç lav üretmez', 'Sadece kül çıkarır'], correctAnswerIndex: 1, explanation: 'Metinde düşük viskoziteli magmanın sakin akıntılar oluşturduğu belirtilmiştir.' },
      { id: 'q-011-4', type: 'inference', text: 'Metinden volkanik küllerin etkisi hakkında ne çıkarılabilir?', options: ['İklim üzerinde hiçbir etkisi yoktur.', 'Güneş ışığını engelleyerek geçici iklim değişikliklerine yol açabilir.', 'Sadece yerel bitkileri etkiler.', 'Sürekli ve kalıcı bir etki bırakır.'], correctAnswerIndex: 1, explanation: 'Metinde küllerin güneş ışığını engelleyerek küresel iklimi geçici olarak etkilediği belirtilmiştir.' }
    ]
  },
  {
    id: 'text-012',
    language: 'tr',
    title: 'İpek Yolu',
    difficulty: 7,
    tags: ['Tarih', 'Ticaret', 'Kültür'],
    content: `İpek Yolu, Antik Çin'i Akdeniz'e bağlayan, binlerce kilometre uzunluğundaki ticaret yollarından oluşan bir ağdı. Bu yol yalnızca ipek değil, baharat, kağıt, cam eşya ve değerli metaller gibi pek çok malın taşınmasına da olanak sağlıyordu. Ticaretin yanı sıra, İpek Yolu boyunca dinler, sanat üslupları ve teknolojik bilgiler de farklı kültürler arasında yayıldı. Yolun güvenliğini sağlamak amacıyla kervansaraylar inşa edildi ve bu yapılar tüccarlara konaklama ve dinlenme imkanı sundu.`,
    questions: [
      { id: 'q-012-1', type: 'detail', text: 'İpek Yolu hangi iki bölgeyi birbirine bağlıyordu?', options: ['Avrupa ve Afrika', 'Antik Çin ve Akdeniz', 'Hindistan ve Amerika', 'Mısır ve Roma'], correctAnswerIndex: 1, explanation: 'Metinde İpek Yolu\'nun Antik Çin\'i Akdeniz\'e bağladığı belirtilmiştir.' },
      { id: 'q-012-2', type: 'true_false', text: 'İpek Yolu\'nda yalnızca ipek taşınıyordu.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 1, explanation: 'Metinde baharat, kağıt, cam eşya gibi başka malların da taşındığı belirtilmiştir.' },
      { id: 'q-012-3', type: 'detail', text: 'Kervansaraylar hangi amaçla inşa edildi?', options: ['Askeri savunma için', 'Tüccarlara konaklama ve dinlenme imkanı sunmak için', 'Sadece dini törenler için', 'Hayvan yetiştirmek için'], correctAnswerIndex: 1, explanation: 'Metinde kervansarayların tüccarlara konaklama imkanı sunduğu belirtilmiştir.' },
      { id: 'q-012-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['İpek Yolu sadece ipek ticareti içindi.', 'İpek Yolu, ticaretin yanı sıra kültürel ve teknolojik alışverişi de sağlayan geniş bir ağdı.', 'Kervansaraylar İpek Yolu\'nun tek önemli yapısıydı.', 'İpek Yolu sadece Çin içinde kullanılıyordu.'], correctAnswerIndex: 1, explanation: 'Metin, İpek Yolu\'nun ticaretin yanında kültürel etkileşimi de sağladığını vurgular.' }
    ]
  },
  {
    id: 'text-013',
    language: 'tr',
    title: 'Kara Delikler',
    difficulty: 8,
    tags: ['Bilim', 'Uzay', 'Fizik'],
    content: `Kara delikler, kütleçekimlerinin o kadar güçlü olduğu uzay bölgeleridir ki, ışık dahi bu bölgelerden kaçamaz. Bir yıldızın çekirdeğindeki nükleer yakıt tükendiğinde, yıldız kendi kütleçekimi altında çökebilir ve eğer kütlesi yeterince büyükse bu çöküş bir kara delik oluşumuyla sonuçlanabilir. Kara deliğin sınırını oluşturan ve 'olay ufku' adı verilen noktadan sonra hiçbir şey, ışık dahil, geri dönemez. Bilim insanları, kara delikleri doğrudan gözlemleyemese de, çevrelerindeki maddenin davranışını inceleyerek varlıklarını tespit edebilmektedir.`,
    questions: [
      { id: 'q-013-1', type: 'inference', text: 'Kara deliklerden neden ışık kaçamaz?', options: ['Çok soğuk oldukları için', 'Kütleçekimlerinin çok güçlü olması nedeniyle', 'Çok küçük oldukları için', 'Işık hızının orada değiştiği için'], correctAnswerIndex: 1, explanation: 'Metinde kütleçekiminin gücünün ışığın kaçmasını engellediği belirtilmiştir.' },
      { id: 'q-013-2', type: 'detail', text: 'Kara delik nasıl oluşabilir?', options: ['Bir gezegenin patlamasıyla', 'Bir yıldızın nükleer yakıtının tükenip kendi kütleçekimi altında çökmesiyle', 'İki galaksinin çarpışmasıyla', 'Bir kuyruklu yıldızın parçalanmasıyla'], correctAnswerIndex: 1, explanation: 'Metinde yıldız çöküşü süreci anlatılmıştır.' },
      { id: 'q-013-3', type: 'detail', text: 'Olay ufku nedir?', options: ['Kara deliğin merkezi', 'Kara deliğin sınırı, bu noktadan sonra hiçbir şey geri dönemez', 'Bir yıldızın yüzeyi', 'Bir galaksinin kenarı'], correctAnswerIndex: 1, explanation: 'Metinde olay ufkunun tanımı verilmiştir.' },
      { id: 'q-013-4', type: 'inference', text: 'Bilim insanları kara delikleri nasıl tespit eder?', options: ['Doğrudan gözlemleyerek', 'Çevrelerindeki maddenin davranışını inceleyerek', 'Sadece matematiksel hesaplarla, hiç gözlem yapmadan', 'Kara deliklere araç göndererek'], correctAnswerIndex: 1, explanation: 'Metinde çevredeki maddenin davranışının incelendiği belirtilmiştir.' }
    ]
  },
  {
    id: 'text-014',
    language: 'tr',
    title: 'Yapay Zeka Etiği',
    difficulty: 9,
    tags: ['Teknoloji', 'Etik', 'Toplum'],
    content: `Yapay zeka sistemlerinin karar alma süreçlerine giderek daha fazla dahil olması, beraberinde önemli etik sorular da getirmektedir. Bir yapay zeka modeli, eğitildiği veride var olan toplumsal önyargıları öğrenip pekiştirebilir; bu durum, işe alım, kredi değerlendirmesi veya adli kararlar gibi hassas alanlarda ayrımcı sonuçlara yol açabilir. Ayrıca bir yapay zeka sisteminin verdiği zararlı bir kararın sorumluluğunun kime ait olduğu - geliştiriciye, kullanıcıya ya da sistemin kendisine - hukuki ve felsefi açıdan hâlâ tartışmalı bir konudur. Bu nedenle birçok ülke ve kurum, yapay zeka için şeffaflık ve hesap verebilirlik standartları geliştirmeye çalışmaktadır.`,
    questions: [
      { id: 'q-014-1', type: 'detail', text: 'Yapay zeka modelleri hangi riski taşıyabilir?', options: ['Sadece yavaş çalışma riski', 'Eğitim verisindeki önyargıları öğrenip pekiştirme riski', 'Sadece yüksek maliyet riski', 'Sadece elektrik tüketimi riski'], correctAnswerIndex: 1, explanation: 'Metinde bu risk açıkça belirtilmiştir.' },
      { id: 'q-014-2', type: 'detail', text: 'Metne göre hangi alanlarda ayrımcı sonuçlar ortaya çıkabilir?', options: ['Sadece spor alanında', 'İşe alım, kredi değerlendirmesi ve adli kararlar gibi alanlarda', 'Sadece eğlence sektöründe', 'Sadece tarım alanında'], correctAnswerIndex: 1, explanation: 'Metinde bu alanlar örnek olarak verilmiştir.' },
      { id: 'q-014-3', type: 'true_false', text: 'Yapay zekanın verdiği zararlı bir kararın sorumluluğu konusu hukuki açıdan netliğe kavuşmuştur.', options: ['Doğru', 'Yanlış'], correctAnswerIndex: 1, explanation: 'Metinde bu konunun hâlâ tartışmalı olduğu belirtilmiştir.' },
      { id: 'q-014-4', type: 'main_idea', text: 'Bu metnin ana fikri nedir?', options: ['Yapay zeka hiçbir etik sorun yaratmaz.', 'Yapay zekanın karar süreçlerindeki rolü önyargı ve sorumluluk gibi ciddi etik sorunlar doğurmaktadır.', 'Yapay zeka sadece teknik bir araçtır ve etikle ilgisi yoktur.', 'Tüm ülkeler yapay zeka standartlarında hemfikirdir.'], correctAnswerIndex: 1, explanation: 'Metin, yapay zekanın önyargı ve sorumluluk sorunlarını ele almaktadır.' }
    ]
  },
  {
    id: 'text-015',
    language: 'tr',
    title: 'Kuantum Dolanıklık',
    difficulty: 10,
    tags: ['Bilim', 'Fizik', 'Teknoloji'],
    content: `Kuantum dolanıklık, iki ya da daha fazla parçacığın, aralarındaki mesafe ne olursa olsun, birinin durumundaki değişimin diğerini anında etkilediği bir kuantum mekaniği fenomenidir. Einstein bu olguyu 'ürkütücü uzaktan etki' olarak tanımlamış ve klasik fizik anlayışıyla bağdaştıramamıştır. Ancak sonraki deneyler, dolanıklığın gerçek ve ölçülebilir bir fenomen olduğunu doğrulamıştır. Bu özellik, bilgiyi klasik yöntemlerle kırılması neredeyse imkansız biçimde şifreleyebilen kuantum iletişim sistemlerinin ve kuantum bilgisayarların temel yapı taşlarından birini oluşturur; ancak dolanık parçacıklar arasında klasik anlamda bilgi anında iletilemez, çünkü ölçüm sonucu rastgeledir ve ancak klasik bir kanal üzerinden karşılaştırıldığında anlam kazanır.`,
    questions: [
      { id: 'q-015-1', type: 'main_idea', text: 'Kuantum dolanıklık nedir?', options: ['Parçacıkların birbirini hiç etkilememesi', 'Parçacıklardan birinin durumundaki değişimin diğerini mesafeden bağımsız anında etkilemesi', 'Sadece yakın parçacıklar arasında görülen bir etki', 'Işığın hızını değiştiren bir olgu'], correctAnswerIndex: 1, explanation: 'Metinde dolanıklığın tanımı bu şekilde verilmiştir.' },
      { id: 'q-015-2', type: 'detail', text: 'Einstein bu olguyu nasıl tanımlamıştır?', options: ['Bilimsel bir hata olarak', 'Ürkütücü uzaktan etki olarak', 'Önemsiz bir tesadüf olarak', 'Kanıtlanamaz bir teori olarak'], correctAnswerIndex: 1, explanation: 'Metinde Einstein\'ın bu tanımı kullandığı belirtilmiştir.' },
      { id: 'q-015-3', type: 'detail', text: 'Kuantum dolanıklık hangi teknolojilerin temelini oluşturur?', options: ['Sadece klasik radyo teknolojisinin', 'Kuantum iletişim sistemleri ve kuantum bilgisayarların', 'Sadece güneş panellerinin', 'Sadece optik fiber kablolarının'], correctAnswerIndex: 1, explanation: 'Metinde bu teknolojiler açıkça belirtilmiştir.' },
      { id: 'q-015-4', type: 'inference', text: 'Metne göre dolanık parçacıklar arasında klasik anlamda bilgi neden anında iletilemez?', options: ['Çünkü parçacıklar birbirinden çok uzaktır', 'Çünkü ölçüm sonucu rastgeledir ve ancak klasik bir kanalla karşılaştırıldığında anlam kazanır', 'Çünkü dolanıklık sadece teoride vardır', 'Çünkü ışık hızı sınırı fiziksel olarak aşılamaz'], correctAnswerIndex: 1, explanation: 'Metnin son cümlesinde bu sınırlama açıklanmıştır.' }
    ]
  }
];
