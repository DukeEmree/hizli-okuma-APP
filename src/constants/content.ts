import { ReadingText } from "@/types/exercise";

export const COMPREHENSION_TEXTS: ReadingText[] = [
  {
    id: 'text-001',
    language: 'tr',
    title: 'Kahvenin Tarihçesi',
    difficulty: 2,
    tags: ['Tarih', 'Kültür', 'İçecek'],
    content: `Kahve, bugün dünya genelinde günde iki milyardan fazla fincan tüketilen, petrolden sonra en çok ticareti yapılan ürünlerden biridir. Ancak bu küresel yolculuk, oldukça mütevazı bir efsaneyle başlar. Anlatıya göre kahvenin uyarıcı etkisi ilk kez 9. yüzyılda Etiyopya'nın Kaffa bölgesinde, Kaldi adında bir keçi çobanı tarafından fark edilmiştir. Kaldi, keçilerinin belirli bir ağacın parlak kırmızı meyvelerini yedikten sonra gece boyunca uyumadığını, alışılmadık bir canlılıkla zıpladığını gözlemlemiş ve merakına yenilerek bu meyveleri kendisi de tatmıştır.

Keşif kısa sürede bölgedeki manastırlara ulaşmıştır. Uzun gece ayinleri boyunca uyanık kalmakta zorlanan rahipler, bu meyvelerden hazırlanan koyu içeceği düzenli olarak tüketmeye başlamışlardır. Başlangıçta meyve, bugünkü gibi kavrulup öğütülmüyor; ezilerek hayvansal yağla karıştırılıyor ya da kabuğuyla birlikte kaynatılıyordu. Kavurma tekniğinin bulunması, kahveye bugün tanıdığımız yoğun aromayı kazandıran asıl dönüm noktası olmuştur.

15. yüzyıla gelindiğinde kahve ticareti Arap Yarımadası'na ulaşmış ve Yemen'de sistematik kahve tarımı başlamıştır. Yemen'in Mokha limanı, uzun süre dünyanın tek kahve ihraç merkezi olarak kalmıştır. Bölge yöneticileri kahve tohumlarının dışarı çıkarılmasını yasaklamış, çekirdekler ülke dışına gönderilmeden önce çimlenmesin diye kaynatılmıştır. Buna rağmen kaçak yollarla taşınan birkaç fide, kahvenin Hindistan ve ardından Endonezya'ya yayılmasını sağlamıştır.

Kahvehaneler ise kısa sürede içecek satılan mekânlar olmaktan çıkmıştır. İstanbul, Kahire ve Şam'daki kahvehaneler; şairlerin, tüccarların ve devlet adamlarının buluştuğu, haberlerin dolaştığı ve siyasetin tartışıldığı merkezlere dönüşmüştür. Bu işlev, dönemin bazı yöneticilerini rahatsız etmiş ve kahvehaneler zaman zaman kapatılmıştır. Yasaklar ise genellikle uzun ömürlü olmamıştır.

17. yüzyılda kahve Avrupa'ya ulaştığında, geldiği coğrafya nedeniyle "Arap şarabı" olarak adlandırılmıştır. Londra ve Viyana'da açılan kahvehaneler, tıpkı doğudaki örnekleri gibi entelektüel tartışmaların merkezi hâline gelmiştir. Hatta Londra'daki bazı kahvehaneler, denizcilik sigortacılığı ve borsa gibi modern finans kurumlarının ilk çekirdeğini oluşturmuştur; tüccarlar burada gemilerin akıbetini konuşurken risk paylaşımının kurallarını da belirlemişlerdir.

Bugün kahve, tarladan fincana uzanan devasa bir endüstridir. Üretimin büyük bölümü ekvator kuşağındaki dar bir şeritte, çoğunlukla küçük aile işletmeleri tarafından yapılır. Buna karşın kârın önemli bir kısmı kavurma, paketleme ve perakende aşamalarında oluşur; bu dengesizlik, adil ticaret hareketlerinin ana tartışma konusudur. Her kültür ise kendi hazırlama yöntemini geliştirmiştir: Türk kahvesinde çekirdek toz inceliğinde öğütülüp cezvede pişirilirken, İtalyan espressosunda basınçlı su kullanılır; İskandinav ülkelerinde ise açık kavrulmuş, filtreyle demlenen çeşitler tercih edilir.`,
    questions: [
      {
        id: 'q-001-1',
        type: 'detail',
        text: 'Kahvenin uyarıcı etkisi efsaneye göre ilk nerede keşfedilmiştir?',
        options: ['Yemen', 'Avrupa', "Etiyopya'nın Kaffa bölgesi", 'Arap Yarımadası'],
        correctAnswerIndex: 2,
        explanation: "Metne göre kahve ilk kez 9. yüzyılda Etiyopya'nın Kaffa bölgesinde keçi çobanı Kaldi tarafından fark edilmiştir."
      },
      {
        id: 'q-001-2',
        type: 'detail',
        text: 'Metne göre kahveye bugünkü yoğun aromasını kazandıran asıl dönüm noktası nedir?',
        options: [
          'Meyvenin hayvansal yağla karıştırılması',
          'Kavurma tekniğinin bulunması',
          'Kabuğuyla birlikte kaynatılması',
          'Mokha limanının açılması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kavurma tekniğinin bulunmasının, kahveye bugün tanıdığımız yoğun aromayı kazandıran asıl dönüm noktası olduğu belirtilmiştir.'
      },
      {
        id: 'q-001-3',
        type: 'detail',
        text: 'Yemen yöneticileri kahve tohumlarının ülke dışına çıkmasını nasıl engellemeye çalışmıştır?',
        options: [
          'Limanları tamamen kapatarak',
          'Çekirdekleri gönderilmeden önce kaynatarak',
          'Tarlaları yakarak',
          'Tüccarlardan yüksek vergi alarak'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metne göre çekirdekler, ülke dışında çimlenmesin diye gönderilmeden önce kaynatılmıştır.'
      },
      {
        id: 'q-001-4',
        type: 'inference',
        text: 'Dönemin bazı yöneticilerinin kahvehanelerden rahatsız olmasının en olası nedeni nedir?',
        options: [
          'Kahvenin sağlığa zararlı olduğunu düşünmeleri',
          'Kahvehanelerin haberlerin dolaştığı ve siyasetin tartışıldığı yerler hâline gelmesi',
          'Kahvenin çok pahalı olması',
          'Kahvehanelerin vergi ödememesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, kahvehanelerin haber ve siyaset tartışmalarının merkezi olduğunu ve bu işlevin yöneticileri rahatsız ettiğini belirtir.'
      },
      {
        id: 'q-001-5',
        type: 'main_idea',
        text: 'Bu metnin ana düşüncesi aşağıdakilerden hangisidir?',
        options: [
          'Kahve sadece Etiyopya\'da yetişen bir bitkidir.',
          'Kahvehaneler eski dönemlerin en önemli eğitim kurumlarıdır.',
          'Yemen, kahve ticaretini kalıcı olarak tekelinde tutmayı başarmıştır.',
          'Kahve, efsanevi bir keşiften başlayarak tarım, ticaret ve toplumsal yaşamı dönüştüren küresel bir kültüre ve endüstriye dönüşmüştür.'
        ],
        correctAnswerIndex: 3,
        explanation: 'Metin, kahvenin Kaldi efsanesinden günümüzdeki küresel endüstrisine uzanan yolculuğunu ve toplumsal etkilerini özetlemektedir.'
      }
    ]
  },
  {
    id: 'text-002',
    language: 'tr',
    title: 'Derin Deniz Keşifleri',
    difficulty: 4,
    tags: ['Bilim', 'Okyanus', 'Biyoloji'],
    content: `Okyanusların en derin bölgeleri, Ay yüzeyinden bile daha az haritalanmış alanlardır. Deniz seviyesinden bin metre aşağıya inildiğinde güneş ışığı tamamen kaybolur ve "gece bölgesi" olarak adlandırılan sonsuz karanlık başlar. Bu derinliklerde su sıcaklığı sıfıra yakındır, basınç ise yüzeydekinin yüzlerce katına çıkar. Uzun yıllar boyunca bilim insanları, besin üretiminin temeli olan fotosentezin mümkün olmadığı bu koşullarda kayda değer bir yaşamın var olamayacağını varsaymışlardır.

Bu varsayım 1977 yılında kesin biçimde çökmüştür. Galapagos açıklarında yürütülen bir araştırmada, deniz tabanındaki yarıklardan yüzlerce derece sıcaklıkta mineral yüklü su püskürten hidrotermal bacalar keşfedilmiştir. Araştırmacıları asıl şaşırtan ise bacaların çevresinde bulunan yoğun canlı topluluğu olmuştur. Bu ekosistemin temelinde, güneş enerjisi yerine bacalardan çıkan hidrojen sülfürü kimyasal olarak işleyen bakteriler yer alır. Kemosentez adı verilen bu süreç, tüm besin zincirini ayakta tutar.

Bacaların etrafında iki metreye kadar uzayabilen dev tüp solucanları bulunur. Bu solucanların ağzı ve sindirim sistemi yoktur; vücutlarında barındırdıkları simbiyotik bakterilerin ürettiği besinle yaşarlar. Kör karidesler, beyaz yengeçler ve alışılmadık yumuşakça türleri de aynı ortama evrimsel olarak uyum sağlamıştır.

Karanlık suların bir başka çarpıcı özelliği biyolüminesanstır. Derin deniz canlılarının büyük çoğunluğu kendi ışığını üretebilir. Bu yetenek üç temel amaca hizmet eder: avı kendine çekmek, tür içi iletişim kurmak ve avcıdan kaçmak. Fener balığı, başındaki ışıklı uzantıyla küçük balıkları kendine çekerken; bazı mürekkep balıkları tehdit anında parlak bir bulut salarak kaçış için gereken saniyeleri kazanır.

Derin denizde yaşamı zorlaştıran bir diğer etken basınçtır. On bin metre derinlikte, her santimetrekareye bir tonun üzerinde kuvvet uygulanır. Bu koşulda hayatta kalan canlılar, hücre zarlarının yapısını ve proteinlerinin katlanma biçimini değiştirerek uyum sağlamıştır. Bazı türlerde, yüksek basınç altında protein şeklinin bozulmasını engelleyen özel moleküllerin derinlikle orantılı biçimde arttığı ölçülmüştür.

Mariana Çukuru gibi on bir kilometreye yaklaşan derinliklere yapılan modern dalışlar, her seferinde bilime yeni türler kazandırmaktadır. Bu keşifler yalnızca canlı listesini uzatmakla kalmaz; yaşamın hangi koşullarda ortaya çıkabileceğine dair kabullerimizi de yeniden şekillendirir. Nitekim buzla kaplı uydularda yaşam arayan gökbilimciler, ilhamlarının önemli bir kısmını bu bacalardan alır. Öte yandan aynı derinliklerde plastik parçalarına ve kimyasal kalıntılara rastlanması, henüz haritalanmamış bir alanın insan etkisiyle çoktan tanışmış olduğunu göstermektedir.`,
    questions: [
      {
        id: 'q-002-1',
        type: 'detail',
        text: 'Hidrotermal bacalar hangi yıl ve nerede keşfedilmiştir?',
        options: [
          '1957, Mariana Çukuru',
          '1977, Galapagos açıkları',
          '1988, Kızıldeniz',
          '1965, Atlas Okyanusu'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde keşfin 1977 yılında Galapagos açıklarında gerçekleştiği belirtilmiştir.'
      },
      {
        id: 'q-002-2',
        type: 'main_idea',
        text: 'Hidrotermal baca ekosisteminin besin zincirinin temelinde ne yer alır?',
        options: [
          'Yüzeyden batan organik atıklar',
          'Fotosentez yapan derin deniz algleri',
          'Hidrojen sülfürü işleyen kemosentetik bakteriler',
          'Dev tüp solucanlarının avladığı karidesler'
        ],
        correctAnswerIndex: 2,
        explanation: 'Metin, ekosistemin temelinde bacalardan çıkan hidrojen sülfürü kimyasal olarak işleyen (kemosentez yapan) bakterilerin bulunduğunu belirtir.'
      },
      {
        id: 'q-002-3',
        type: 'detail',
        text: 'Dev tüp solucanları nasıl beslenir?',
        options: [
          'Deniz tabanındaki tortuları süzerek',
          'Küçük karidesleri avlayarak',
          'Vücutlarındaki simbiyotik bakterilerin ürettiği besinle',
          'Yüzeye çıkıp plankton toplayarak'
        ],
        correctAnswerIndex: 2,
        explanation: 'Metinde bu solucanların ağzı ve sindirim sistemi olmadığı, simbiyotik bakterilerin ürettiği besinle yaşadıkları belirtilmiştir.'
      },
      {
        id: 'q-002-4',
        type: 'multiple_choice',
        text: 'Aşağıdakilerden hangisi metinde biyolüminesansın amaçları arasında sayılmamıştır?',
        options: ['Avı kendine çekmek', 'Tür içi iletişim kurmak', 'Avcıdan kaçmak', 'Vücut ısısını korumak'],
        correctAnswerIndex: 3,
        explanation: 'Metinde üç amaç sayılmıştır: avı çekmek, iletişim kurmak ve avcıdan kaçmak. Isınma sayılmamıştır.'
      },
      {
        id: 'q-002-5',
        type: 'inference',
        text: 'Buzla kaplı uydularda yaşam arayan gökbilimcilerin hidrotermal bacalardan ilham almasının nedeni nedir?',
        options: [
          'Bu uydularda da dev tüp solucanları bulunmuştur.',
          'Bacalar, güneş ışığı olmadan da yaşamın kurulabileceğini kanıtlamıştır.',
          'Bacalar okyanus haritalarının çıkarılmasını kolaylaştırmıştır.',
          'Uydulardaki basınç Mariana Çukuru ile aynıdır.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, bu keşiflerin yaşamın hangi koşullarda ortaya çıkabileceğine dair kabulleri değiştirdiğini vurgular; güneşsiz yaşam mümkündür.'
      }
    ]
  },
  {
    id: 'text-003',
    language: 'tr',
    title: 'Mars Kolonizasyonu: Zorluklar ve Umutlar',
    difficulty: 6,
    tags: ['Uzay', 'Teknoloji', 'Gelecek'],
    content: `İnsanlığın Dünya dışında kalıcı bir yerleşim kurma hayali, uzun süre bilim kurgunun konusu olarak kaldı. Son yirmi yılda geliştirilen yeniden kullanılabilir roket teknolojileri ve maliyetleri düşüren üretim yöntemleri, bu hedefi mühendislik gündeminin somut bir maddesine dönüştürdü. Kızıl Gezegen, Güneş Sistemi'nde yaşanabilirlik açısından Dünya'ya en çok benzeyen gök cismidir; günü yaklaşık yirmi dört buçuk saat sürer, mevsimleri vardır ve kutuplarında donmuş su bulunur. Buna rağmen kolonizasyon süreci, üst üste binen devasa zorluklar barındırır.

En kritik sorunlardan biri radyasyondur. Mars'ın Dünya'daki gibi küresel bir manyetik alanı ve yoğun bir atmosferi yoktur. Bu nedenle yüzeydeki bir astronot, hem Güneş'ten gelen parçacık fırtınalarına hem de galaktik kozmik ışınlara doğrudan maruz kalır. Uzun vadede kanser riskini artıran bu maruziyete karşı önerilen çözümler, yer altı tünellerinde ya da regolit adı verilen Mars toprağıyla kalınlaştırılmış habitatlarda yaşamayı içerir.

İkinci büyük engel düşük yerçekimidir. Mars'ın çekim kuvveti Dünya'nınkinin yaklaşık yüzde otuz sekizi kadardır. Uzun süreli uzay görevlerinden elde edilen veriler, düşük yerçekiminde kemik yoğunluğunun ayda yüzde bire varan oranlarda azaldığını, kas kütlesinin eridiğini ve dolaşım sisteminin bozulduğunu göstermektedir. Bu etkilerin bir Mars kolonisinde doğacak çocuklar üzerindeki sonuçları ise tamamen bilinmezdir.

Buna atmosfer koşulları eklenir. Mars atmosferinin yaklaşık yüzde doksan beşi karbondioksittir ve yüzey basıncı Dünya'nınkinin yüzde birinden azdır; bu basınçta koruma olmadan vücut sıvıları kaynama noktasına ulaşır. Ortalama sıcaklık eksi altmış derecedir ve gezegeni haftalarca saran toz fırtınaları güneş panellerinin verimini düşürür.

Lojistik de kendi başına bir engeldir. Dünya ile Mars arasındaki mesafe, gezegenlerin konumuna göre değişir ve fırlatma için elverişli pencere yaklaşık yirmi altı ayda bir açılır. Bu, bir sorun çıktığında yardım göndermenin aylar süreceği anlamına gelir. Aynı mesafe iletişimi de etkiler: bir radyo sinyalinin tek yönlü yolculuğu, konuma göre dört ila yirmi dört dakika arasında sürer. Dolayısıyla Dünya'dan anlık yönlendirme mümkün değildir; kolonicilerin acil durumları kendi başlarına çözebilecek özerklikte olması gerekir.

Tüm bu engellere rağmen mühendisler umutlu adımlar atmaktadır. In-situ kaynak kullanımı, yani gerekli malzemeyi Dünya'dan taşımak yerine yerinde üretme yaklaşımı, bu iyimserliğin merkezindedir. Atmosferdeki karbondioksitten oksijen üretmeyi başaran deneysel cihazlar hâlihazırda Mars yüzeyinde test edilmiştir. Yer altı buzundan elde edilecek su ise hem içme suyu hem de roket yakıtının hammaddesi olabilir. Regolitin üç boyutlu yazıcılarla yapı malzemesine dönüştürülmesi üzerine yürütülen çalışmalar da aynı mantığın devamıdır.`,
    questions: [
      {
        id: 'q-003-1',
        type: 'detail',
        text: 'Mars yüzeyindeki radyasyon tehlikesinin temel nedeni nedir?',
        options: [
          "Gezegenin Güneş'e çok yakın olması",
          'Küresel bir manyetik alanının ve yoğun atmosferinin olmaması',
          'Mars toprağında yüksek miktarda radyoaktif madde bulunması',
          'Toz fırtınalarının radyasyonu yoğunlaştırması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde radyasyon sorununun nedeni olarak küresel manyetik alan ve yoğun atmosferin eksikliği gösterilmiştir.'
      },
      {
        id: 'q-003-2',
        type: 'detail',
        text: 'Metne göre düşük yerçekiminde kemik yoğunluğu ne kadar azalabilmektedir?',
        options: ['Yılda yüzde bir', 'Ayda yüzde bire varan oranlarda', 'Haftada yüzde beş', 'Ayda yüzde on'],
        correctAnswerIndex: 1,
        explanation: 'Metinde kemik yoğunluğunun ayda yüzde bire varan oranlarda azaldığı belirtilmiştir.'
      },
      {
        id: 'q-003-3',
        type: 'detail',
        text: "Mars'ın yüzey basıncıyla ilgili metinde ne belirtilmiştir?",
        options: [
          "Dünya'nınkiyle hemen hemen aynıdır.",
          "Dünya'nınkinin yüzde birinden azdır ve korumasız vücut sıvıları kaynama noktasına ulaşır.",
          "Dünya'nınkinin iki katıdır.",
          'Mevsimlere göre Dünya seviyesine çıkar.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde yüzey basıncının Dünya\'nınkinin yüzde birinden az olduğu ve bu basınçta vücut sıvılarının kaynadığı belirtilmiştir.'
      },
      {
        id: 'q-003-4',
        type: 'inference',
        text: '"In-situ kaynak kullanımı" stratejisinin temel amacı aşağıdakilerden hangisidir?',
        options: [
          "Dünya'dan Mars'a düzenli olarak yakıt ve su taşıyabilmek",
          'Gerekli malzemeyi yerinde üreterek Dünya\'ya bağımlılığı azaltmak',
          "Mars toprağını Dünya'ya getirerek incelemek",
          "Mars'ın manyetik alanını yeniden yaratmak"
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde in-situ kaynak kullanımı, malzemeyi Dünya\'dan taşımak yerine yerinde üretme yaklaşımı olarak tanımlanmıştır.'
      },
      {
        id: 'q-003-5',
        type: 'main_idea',
        text: 'Metnin en kapsamlı özeti aşağıdakilerden hangisidir?',
        options: [
          "Mars'ın düşük yerçekimi insan sağlığı için tek gerçek tehdittir.",
          'Mars kolonizasyonu imkânsızdır çünkü atmosferi solunmaya uygun değildir.',
          "Mars'ta kalıcı yerleşim radyasyon, yerçekimi ve atmosfer gibi ağır engeller içerse de yerinde üretim teknolojileri bu hedefi gerçekçi bir mühendislik sorununa dönüştürmüştür.",
          'Gezegenler arası seyahat yalnızca yeniden kullanılabilir roketlerle mümkündür.'
        ],
        correctAnswerIndex: 2,
        explanation: 'Metin hem zorlukları (radyasyon, yerçekimi, atmosfer) hem de in-situ üretim gibi çözümleri birlikte ele almaktadır.'
      }
    ]
  },
  {
    id: 'text-004',
    language: 'tr',
    title: 'Türk Çay Kültürü',
    difficulty: 1,
    tags: ['Kültür', 'Gelenek', 'İçecek'],
    content: `Çay, Türkiye'de sabah kahvaltısından gece sohbetlerine kadar günün her saatinde içilen bir içecektir. Kişi başına düşen tüketim miktarı bakımından Türkiye, dünyanın en çok çay içen ülkeleri arasında yer alır. Oysa çayın ülkedeki geçmişi sanıldığı kadar eski değildir. Yaygın olarak içilmeye başlanması yaklaşık yüz yıl öncesine dayanır.

Cumhuriyetin ilk yıllarında kahve ithalatının pahalı hâle gelmesi, alternatif bir sıcak içecek arayışını başlatmıştır. Karadeniz'in doğu kesimindeki iklimin çay bitkisi için elverişli olduğu anlaşılınca, Rize ve çevresinde çay tarımı desteklenmiştir. Bölgenin bol yağış alması, nemli havası ve eğimli arazisi çay için oldukça uygundur. Zamanla çay, bölge ekonomisinin belkemiği hâline gelmiştir.

Çay hasadı yılda birkaç kez yapılır ve genellikle elle toplanır. Toplayıcılar filizin en üstteki taze yapraklarını alır; çünkü kalitenin büyük bölümü bu genç yapraklardan gelir. Toplanan yapraklar fabrikalarda soldurulur, kıvrılır, oksitlenir ve kurutulur. Bu aşamalardan geçen yapraklar paketlenerek satışa hazır hâle gelir.

Türkiye'de çay demleme yöntemi de kendine özgüdür. İki katlı bir demlikte, alttaki kapta su kaynatılır, üstteki kapta ise çay demlenir. Böylece isteyen koyu, isteyen açık çay içebilir. Bu yönteme "tavşan kanı" gibi kendine has tarifler eşlik eder; bu tabir, berrak ve koyu kırmızı renkte demlenmiş çayı anlatır.

Servis şekli de kültürün bir parçasıdır. Çay, ince belli bardaklarda ikram edilir. Bu bardağın biçimi yalnızca estetik değildir: dar bel, sıcak çayın parmakları yakmadan tutulabilmesini sağlar; şeffaf cam ise çayın renginin görülmesine imkân verir.

Çayın en güçlü tarafı ise sosyal işlevidir. Bir eve gelen misafire ilk olarak çay ikram edilmesi yaygın bir gelenektir. Komşu ziyaretleri, esnaf sohbetleri ve aile toplantıları çoğu zaman çay eşliğinde sürer. Bu yönüyle çay, yalnızca bir içecek değil, konuşmayı ve birlikte vakit geçirmeyi kolaylaştıran bir bahanedir.

Bu işlev, şehirlerde kendine özgü bir meslek de doğurmuştur. Çarşı ve iş hanlarında çalışan çaycılar, tepsilerle sipariş taşıyarak dükkân dükkân dolaşır. Bir esnaf için gün içinde gelen çay sayısı, o günün ne kadar hareketli geçtiğinin gayriresmî bir ölçüsüdür. Kırsalda ise çay çoğunlukla semaverle hazırlanır ve saatler boyunca sıcak tutulur; bu da ziyaretin süresine dair hiçbir sınır konmadığı anlamına gelir.

Çayın yanında ikram edilenler bölgeye göre değişir. Kimi yerde kesme şeker, kimi yerde kuru meyve ya da tuzlu kurabiye eşlik eder. Şekerin bardağa atılmak yerine ağızda tutularak çayın üzerine içilmesi, bazı yörelerde hâlâ sürdürülen bir alışkanlıktır.`,
    questions: [
      {
        id: 'q-004-1',
        type: 'detail',
        text: "Türkiye'de çay yetiştiriciliği en çok hangi bölgede yapılır?",
        options: ['Ege', "Karadeniz'in doğusu (Rize ve çevresi)", 'Akdeniz', 'İç Anadolu'],
        correctAnswerIndex: 1,
        explanation: "Metinde Karadeniz'in doğu kesimi, özellikle Rize ve çevresi belirtilmiştir."
      },
      {
        id: 'q-004-2',
        type: 'detail',
        text: 'Metne göre Türkiye\'de çay tarımının başlamasının nedeni nedir?',
        options: [
          'Çayın kahveden daha sağlıklı olması',
          'Kahve ithalatının pahalı hâle gelmesi ve alternatif arayışı',
          'Karadeniz halkının kahve içmemesi',
          'Yabancı şirketlerin talebi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde Cumhuriyetin ilk yıllarında kahve ithalatının pahalılaşmasının alternatif arayışını başlattığı belirtilmiştir.'
      },
      {
        id: 'q-004-3',
        type: 'detail',
        text: 'İnce belli bardağın dar belinin işlevsel faydası nedir?',
        options: [
          'Çayın daha hızlı soğumasını sağlar',
          'Sıcak çayın parmakları yakmadan tutulabilmesini sağlar',
          'Daha az çay kullanılmasını sağlar',
          'Bardağın daha kolay yıkanmasını sağlar'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde dar belin, sıcak çayın parmakları yakmadan tutulmasını sağladığı belirtilmiştir.'
      },
      {
        id: 'q-004-4',
        type: 'true_false',
        text: 'Çayın Türkiye\'deki geçmişi birkaç yüzyıl öncesine dayanır.',
        options: ['Doğru', 'Yanlış'],
        correctAnswerIndex: 1,
        explanation: 'Metne göre çayın yaygın olarak içilmeye başlanması yaklaşık yüz yıl öncesine dayanır.'
      },
      {
        id: 'q-004-5',
        type: 'main_idea',
        text: 'Bu metnin ana fikri nedir?',
        options: [
          "Çay sadece Rize'de üretilir.",
          'Çay, görece yeni bir geçmişe sahip olmasına rağmen üretimden servise kadar Türk günlük yaşamının ve sosyal ilişkilerinin merkezine yerleşmiştir.',
          'Çay bardakları çok pahalıdır.',
          'Çay demlemenin tek bir doğru yöntemi vardır.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin çayın tarihçesini, üretimini, demlenmesini ve en çok da sosyal işlevini birlikte ele alır.'
      }
    ]
  },
  {
    id: 'text-005',
    language: 'tr',
    title: 'Bal Arıları ve Kovan Düzeni',
    difficulty: 1,
    tags: ['Doğa', 'Biyoloji', 'Hayvanlar'],
    content: `Bal arıları, doğadaki en düzenli çalışan canlı topluluklarından birini kurar. Sağlıklı bir kovanda tek bir kraliçe arı, mevsime göre otuz ila altmış bin arasında işçi arı ve birkaç yüz erkek arı bulunur. Bu üç grubun görevleri kesin biçimde ayrılmıştır ve kovanın hayatta kalması bu iş bölümüne bağlıdır.

Kraliçe arının tek görevi yumurta bırakmaktır. Yoğun mevsimde günde iki bine yakın yumurta bırakabilir; bu, kendi vücut ağırlığından fazla bir üretim anlamına gelir. Kraliçe ayrıca salgıladığı özel kokularla kovandaki düzeni korur. Bu koku zayıfladığında işçi arılar yeni bir kraliçe yetiştirmeye başlar.

İşçi arıların tamamı dişidir ve yaşlarına göre görev değiştirirler. Yumurtadan çıkan genç bir işçi arı önce kovan temizliğiyle ilgilenir. Birkaç gün sonra yavruları besleme görevine geçer. Ardından bal peteği inşa etmeye, sonra kovan girişini korumaya başlar. Ancak ömrünün son haftalarında dışarı çıkıp nektar ve polen toplar. Yani en tehlikeli iş, en tecrübeli arılara verilir.

Erkek arıların görevi ise yalnızca yeni kraliçelerle çiftleşmektir. Nektar toplamaz, kovanı savunmaz ve kendi başlarına beslenemezler. Kış yaklaştığında kovanın besin stoğunu korumak için işçi arılar tarafından dışarı çıkarılırlar.

Arıların en dikkat çekici becerilerinden biri iletişim biçimidir. Zengin bir çiçek tarlası bulan bir arı, kovana döndüğünde peteğin üzerinde sekiz şeklinde bir dans yapar. Dansın açısı besinin güneşe göre yönünü, süresi ise uzaklığını anlatır. Böylece diğer arılar tarlayı tarif üzerinden bulabilir.

Kovan içi sıcaklığın sabit tutulması da ortak bir çabadır. Hava fazla ısındığında arılar kovan girişinde toplanıp kanatlarını hızla çırparak hava akımı yaratır ve içeriye su taşıyarak serinletir. Hava soğuduğunda ise birbirine sokulup göğüs kaslarını titreterek ısı üretirler. Bu sayede kovan sıcaklığı, dışarıda ne olursa olsun yavru gelişimi için gereken seviyede kalır.

Balın üretimi de aynı ortaklığa dayanır. Toplanan nektar, arıdan arıya aktarılırken enzimlerle işlenir ve peteğe bırakılır. Başlangıçta oldukça sulu olan bu karışım, kanat çırpmayla oluşturulan hava akımı sayesinde suyunu kaybeder. Yeterince koyulaştığında petek gözü mumla kapatılır. Bu düşük su oranı, balın bozulmadan yıllarca saklanabilmesinin temel nedenidir.

Arıların bu düzeni, yalnızca kendi türleri için değil, tarım için de belirleyicidir. Birçok meyve ve sebze türünün verimi, doğrudan tozlaşmaya bağlıdır. Bu nedenle arı kolonilerindeki azalma, sadece bir doğa sorunu değil, gıda üretimini ilgilendiren bir mesele olarak değerlendirilmektedir.`,
    questions: [
      {
        id: 'q-005-1',
        type: 'detail',
        text: 'Metne göre işçi arılar hangi görevi ömürlerinin son haftalarında üstlenir?',
        options: ['Kovan temizliği', 'Yavru besleme', 'Petek inşası', 'Dışarıda nektar ve polen toplama'],
        correctAnswerIndex: 3,
        explanation: 'Metinde en tehlikeli iş olan dışarıda toplayıcılığın, ömrün son haftalarında yapıldığı belirtilmiştir.'
      },
      {
        id: 'q-005-2',
        type: 'detail',
        text: 'Kraliçe arının yumurta bırakmak dışındaki işlevi nedir?',
        options: [
          'Kovanı savunmak',
          'Salgıladığı kokularla kovandaki düzeni korumak',
          'Petek inşa etmek',
          'Erkek arıları beslemek'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kraliçenin salgıladığı özel kokularla kovan düzenini koruduğu belirtilmiştir.'
      },
      {
        id: 'q-005-3',
        type: 'detail',
        text: 'Arıların yaptığı sekiz şeklindeki dans neyi anlatır?',
        options: [
          'Sadece kovandaki bal miktarını',
          'Besinin güneşe göre yönünü ve uzaklığını',
          'Kraliçenin sağlık durumunu',
          'Havanın sıcaklığını'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metne göre dansın açısı yönü, süresi ise uzaklığı anlatır.'
      },
      {
        id: 'q-005-4',
        type: 'true_false',
        text: 'Erkek arılar kovanı savunmak ve nektar toplamakla görevlidir.',
        options: ['Doğru', 'Yanlış'],
        correctAnswerIndex: 1,
        explanation: 'Metinde erkek arıların nektar toplamadığı ve kovanı savunmadığı açıkça belirtilmiştir.'
      },
      {
        id: 'q-005-5',
        type: 'main_idea',
        text: 'Bu metnin ana fikri nedir?',
        options: [
          'Arılar tembel canlılardır.',
          'Bir arı kovanı, yaşa göre değişen görevler, gelişmiş iletişim ve ortak sıcaklık kontrolüyle işleyen düzenli bir toplumdur.',
          'Sadece kraliçe arı önemlidir.',
          'Kovanlar her zaman aynı büyüklüktedir.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, görev dağılımını, dans yoluyla iletişimi ve ortak ısı düzenlemesini bir bütün olarak anlatır.'
      }
    ]
  },
  {
    id: 'text-006',
    language: 'tr',
    title: "İstanbul'un Kısa Tarihi",
    difficulty: 3,
    tags: ['Tarih', 'Şehir', 'Kültür'],
    content: `İstanbul, tarih boyunca birbirinden farklı üç büyük devlete başkentlik yapmış nadir şehirlerden biridir. Kuruluşu, milattan önce yedinci yüzyılda bölgeye yerleşen Megaralı denizcilere dayandırılır; kurdukları yerleşim, önderlerinin adına atfen Byzantion olarak anılmıştır. Şehrin seçildiği nokta tesadüf değildir: Haliç, doğal ve korunaklı bir liman sunarken, İstanbul Boğazı Karadeniz ile Akdeniz arasındaki tüm deniz trafiğini denetlemeye imkân verir.

Roma İmparatoru Konstantin, 330 yılında başkenti buraya taşıdığında şehir yeniden inşa edilmiş ve Konstantinopolis adını almıştır. Roma'nın ikiye ayrılmasının ardından Doğu Roma, yani Bizans İmparatorluğu, bin yılı aşkın süre bu şehirden yönetilmiştir. Bu dönemde inşa edilen Ayasofya, altıncı yüzyılın mühendislik sınırlarını zorlayan devasa kubbesiyle uzun süre dünyanın en büyük kapalı mekânı olma unvanını korumuştur. Şehri kara tarafından çevreleyen surlar ise defalarca kuşatmayı püskürtmüş ve neredeyse aşılmaz kabul edilmiştir.

Bu durum 1453'te değişmiştir. Fatih Sultan Mehmet komutasındaki Osmanlı ordusu, dönemin en büyük toplarını kullanarak surları aşmış ve şehri fethetmiştir. Kuşatma sırasında gemilerin karadan yürütülerek Haliç'e indirilmesi, askeri tarihte sıkça anılan bir manevra olmuştur. Fetihten sonra şehir Osmanlı İmparatorluğu'nun yönetim merkezi hâline gelmiş; Ayasofya camiye çevrilmiş, harap durumdaki mahalleler yeniden iskân edilmiştir.

Osmanlı döneminde şehrin silueti bugünkü hâlini kazanmıştır. Topkapı Sarayı devletin idari merkezi olmuş, Mimar Sinan'ın eserleri şehrin tepelerine yerleşmiş, Sultanahmet Camii altı minaresiyle dikkat çekmiştir. Kapalıçarşı ve Mısır Çarşısı ise ticaretin kalbi hâline gelmiştir.

Şehrin su ihtiyacı da her dönemde ayrı bir mühendislik sorunu olmuştur. Çevresinde büyük bir akarsu bulunmadığı için su, kilometrelerce uzaktaki kaynaklardan kemerlerle taşınmış ve yer altı sarnıçlarında biriktirilmiştir. Bizans döneminde inşa edilen bu sarnıçların bazıları yüzlerce sütun üzerine oturur ve bugün hâlâ ayaktadır. Osmanlı döneminde ise su yolları genişletilmiş, mahalle çeşmeleri şehir dokusunun ayrılmaz parçası hâline gelmiştir.

Bugün İstanbul, hem Avrupa hem Asya kıtasında toprağı bulunan az sayıdaki büyük şehirden biridir. Farklı dönemlerden kalan yapılar çoğu zaman aynı sokakta yan yana durur: bir Bizans sarnıcının hemen yanında bir Osmanlı çeşmesi, birkaç adım ötede modern bir iş merkezi bulunabilir. Bu katmanlı yapı, şehri tek bir döneme sığdırmayı imkânsız kılar. Kazılarda beklenmedik biçimde ortaya çıkan liman kalıntıları ya da yerleşim izleri, şehrin bilinen tarihini zaman zaman geriye doğru genişletmeye devam etmektedir.`,
    questions: [
      {
        id: 'q-006-1',
        type: 'detail',
        text: 'Şehrin ilk kuruluşunda aldığı ad nedir?',
        options: ['Konstantinopolis', 'Byzantion', 'Megara', 'Haliç'],
        correctAnswerIndex: 1,
        explanation: 'Metinde Megaralı denizcilerin kurduğu yerleşimin Byzantion olarak anıldığı belirtilmiştir.'
      },
      {
        id: 'q-006-2',
        type: 'detail',
        text: 'Roma İmparatoru Konstantin başkenti hangi yılda buraya taşımıştır?',
        options: ['30', '330', '1053', '1453'],
        correctAnswerIndex: 1,
        explanation: 'Metinde başkentin 330 yılında taşındığı belirtilmiştir.'
      },
      {
        id: 'q-006-3',
        type: 'detail',
        text: 'Metne göre şehrin konumunu stratejik kılan iki unsur nedir?',
        options: [
          'Yüksek rakımı ve ormanları',
          "Haliç'in korunaklı liman sunması ve Boğaz'ın deniz trafiğini denetleme imkânı",
          'Verimli tarım arazileri ve maden yatakları',
          'Nehir ulaşımı ve göl kıyısı olması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde Haliç\'in doğal liman olduğu ve Boğaz\'ın Karadeniz-Akdeniz trafiğini denetlemeye imkân verdiği belirtilmiştir.'
      },
      {
        id: 'q-006-4',
        type: 'detail',
        text: 'Kuşatma sırasında askeri tarihte sıkça anılan manevra nedir?',
        options: [
          'Surların altından tünel kazılması',
          "Gemilerin karadan yürütülerek Haliç'e indirilmesi",
          'Şehrin su yollarının kesilmesi',
          'Gece baskını düzenlenmesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde gemilerin karadan yürütülerek Haliç\'e indirilmesinin sıkça anılan bir manevra olduğu belirtilmiştir.'
      },
      {
        id: 'q-006-5',
        type: 'main_idea',
        text: 'Bu metnin ana fikri nedir?',
        options: [
          'İstanbul sadece Bizans döneminde önemliydi.',
          'İstanbul, stratejik konumu sayesinde farklı devletlere başkentlik yapmış ve bu dönemlerin izlerini üst üste taşıyan katmanlı bir şehir hâline gelmiştir.',
          'Ayasofya İstanbul\'un tek tarihi yapısıdır.',
          "İstanbul 1453'ten önce önemsiz bir şehirdi."
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, şehrin konumunu, ardışık dönemlerini ve bu dönemlerin bir arada duran izlerini anlatır.'
      }
    ]
  },
  {
    id: 'text-007',
    language: 'tr',
    title: 'Matbaanın İcadı',
    difficulty: 3,
    tags: ['Tarih', 'Teknoloji', 'Bilim'],
    content: `Matbaadan önce Avrupa'da bir kitap üretmek, aylar hatta yıllar süren bir el emeği gerektiriyordu. Manastırlardaki yazı odalarında çalışan müstensihler, metinleri sayfa sayfa elle kopyalıyordu. Bu yöntem hem son derece yavaştı hem de her kopyada yeni hataların birikmesine yol açıyordu. Bir kitabın fiyatı, çoğu zaman bir ustanın aylarca kazandığı paraya denk düşüyordu. Dolayısıyla kitap sahibi olmak, kilisenin, üniversitelerin ve varlıklı ailelerin ayrıcalığıydı.

Bu tablo, on beşinci yüzyılın ortasında Almanya'nın Mainz şehrinde çalışan Johannes Gutenberg sayesinde değişti. Gutenberg'in dehası tek bir buluşta değil, birkaç tekniği bir araya getirmesindeydi. Her harfi ayrı ayrı dökülmüş metal bloklar hâlinde üretti; böylece harfler istenildiği gibi dizilebiliyor, baskı bittikten sonra dağıtılıp yeni bir sayfa için tekrar kullanılabiliyordu. Buna, üzüm presinden esinlenerek geliştirdiği baskı makinesini ve kâğıda iyi tutunan yağ bazlı mürekkebi ekledi.

Gutenberg'in bastığı ilk büyük eser, İncil'in Latince baskısı oldu. Bu kitap, el yazması örneklerle boy ölçüşecek bir baskı kalitesine sahipti ve teknolojinin ciddiye alınmasını sağladı. Bir müstensihin yıllarca uğraşacağı işi, matbaa haftalar içinde ve çok daha ucuza yapabiliyordu.

Sonuçlar hızla çığ gibi büyüdü. Yüzyılın sonuna gelindiğinde Avrupa genelinde binlerce matbaa kurulmuş ve milyonlarca kitap basılmıştı. Kitap fiyatlarının düşmesi okuryazarlığı teşvik etti; okuryazarlığın artması ise kitaba olan talebi daha da yükseltti. Bilimsel çalışmalar artık yalnızca birkaç kütüphanede saklanmıyor, aynı metin farklı ülkelerdeki araştırmacılara aynı biçimde ulaşabiliyordu. Bu standartlaşma, deneylerin tekrarlanabilmesi açısından bilimin gelişiminde kritik rol oynadı.

Etkiler bilimle sınırlı kalmadı. Dinî tartışmalar, siyasi bildiriler ve halk dilinde yazılmış edebî eserler geniş kitlelere ulaşabildi. Fikirlerin bu kadar hızlı yayılabilmesi, dönemin siyasi ve dinî otoriteleri için de yeni bir sorun anlamına geliyordu; nitekim sansür uygulamalarının sistematik hâle gelmesi de aynı döneme rastlar.

Matbaanın daha az konuşulan bir etkisi ise dil üzerinde oldu. Basılı eserler belirli bir yazım biçimini tekrar tekrar dolaşıma soktukça, o zamana kadar bölgeden bölgeye değişen imlâ ve sözcük tercihleri yavaş yavaş sabitlendi. Yayıncıların tercih ettiği lehçeler zamanla standart yazı dili hâline geldi. Böylece matbaa, yalnızca metinleri değil, o metinlerin yazıldığı dilleri de biçimlendirdi.

Benzer bir baskı geleneğinin Doğu Asya'da yüzyıllar önce var olduğu da hatırlanmalıdır. Ancak binlerce farklı karakter kullanan yazı sistemleri, hareketli harf tekniğinden Avrupa alfabeleri kadar verim alınmasını güçleştirmiştir. Teknolojinin etkisini belirleyenin yalnızca buluşun kendisi değil, uygulandığı bağlam olduğu bu karşılaştırmada açıkça görülür.`,
    questions: [
      {
        id: 'q-007-1',
        type: 'detail',
        text: 'Metne göre Gutenberg\'in asıl dehası neydi?',
        options: [
          'Kâğıdı ilk kez üretmesi',
          'Birkaç farklı tekniği bir araya getirmesi',
          'İlk kütüphaneyi kurması',
          'Latince alfabeyi geliştirmesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde dehasının tek bir buluşta değil, birkaç tekniği birleştirmesinde olduğu belirtilmiştir.'
      },
      {
        id: 'q-007-2',
        type: 'detail',
        text: 'Gutenberg baskı makinesini neyden esinlenerek geliştirmiştir?',
        options: ['Su değirmeninden', 'Üzüm presinden', 'Dokuma tezgâhından', 'Saat mekanizmasından'],
        correctAnswerIndex: 1,
        explanation: 'Metinde baskı makinesinin üzüm presinden esinlenerek geliştirildiği belirtilmiştir.'
      },
      {
        id: 'q-007-3',
        type: 'detail',
        text: 'Elle kopyalama yönteminin metinde belirtilen iki temel sorunu nedir?',
        options: [
          'Pahalı mürekkep ve ağır kâğıt',
          'Yavaşlık ve her kopyada hataların birikmesi',
          'Dil farklılıkları ve okunaksız yazı',
          'Kısa ömürlü kâğıt ve nemli ortam'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde yöntemin hem çok yavaş olduğu hem de her kopyada yeni hataların biriktiği belirtilmiştir.'
      },
      {
        id: 'q-007-4',
        type: 'inference',
        text: 'Metne göre baskının bilimsel gelişimdeki kritik katkısı nedir?',
        options: [
          'Kitapların daha güzel görünmesi',
          'Aynı metnin farklı ülkelere aynı biçimde ulaşarak deneylerin tekrarlanabilmesini sağlaması',
          'Bilim insanlarının daha hızlı yazmayı öğrenmesi',
          'Üniversitelerin sayısının azalması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde standartlaşmanın deneylerin tekrarlanabilmesi açısından kritik rol oynadığı belirtilmiştir.'
      },
      {
        id: 'q-007-5',
        type: 'inference',
        text: 'Sansür uygulamalarının sistematik hâle gelmesinin metindeki en olası nedeni nedir?',
        options: [
          'Kâğıt üretiminin azalması',
          'Fikirlerin geniş kitlelere hızla ulaşabilir hâle gelmesi',
          'Matbaaların çok pahalı olması',
          'Okuryazarlığın düşmesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, fikirlerin hızla yayılmasının otoriteler için yeni bir sorun oluşturduğunu ve sansürün aynı döneme rastladığını belirtir.'
      }
    ]
  },
  {
    id: 'text-008',
    language: 'tr',
    title: 'Çin Seddi',
    difficulty: 4,
    tags: ['Tarih', 'Mimari', 'Coğrafya'],
    content: `Çin Seddi, tek bir hükümdarın emriyle bir seferde inşa edilmiş bütünsel bir yapı değildir. Aksine, farklı hanedanlıkların yaklaşık iki bin yıl boyunca yaptığı duvarların, kulelerin ve doğal engellerin toplamıdır. Bu nedenle "sed" tekil bir duvardan çok, kimi yerde birbirine paralel ilerleyen, kimi yerde tamamen kopuk bir savunma hattı ağıdır. Toplam uzunluğunun yirmi bin kilometreyi aştığı tahmin edilmektedir.

Yapının temel amacı, kuzeydeki bozkırlardan gelen göçebe süvari birliklerinin akınlarına karşı yerleşik tarım topraklarını korumaktı. Ancak setin işlevi yalnızca fiziksel bir bariyer olmakla sınırlı değildi. Süvari birliklerinin geçişini yavaşlatmak, saldırıyı belirli geçitlere yönlendirmek ve en önemlisi haber iletmek de sistemin parçasıydı. Belirli aralıklarla dizilmiş gözetleme kuleleri sayesinde bir sınır bölgesinde başlayan alarm, gündüz duman gece ateş işaretleriyle yüzlerce kilometre öteye saatler içinde ulaştırılabiliyordu.

İnşaat yöntemleri bölgeye göre değişiyordu. Çöl kesimlerinde sıkıştırılmış toprak ve saz katmanları kullanılırken, dağlık bölgelerde taş ve pişmiş tuğla tercih edilmişti. Malzemenin sırtta ya da katırlarla dik yamaçlara taşınması gerekiyordu; bu da inşaatın en yorucu tarafıydı. İşçilerin büyük kısmı asker, mahkûm veya zorunlu çalışmaya alınmış köylülerdi. Uzun çalışma süreleri, sert kış koşulları ve yetersiz beslenme yüzünden binlerce işçi hayatını kaybetmiştir.

Setin askeri başarısı tartışmalıdır. Duvar, küçük çaplı akınları caydırmakta etkili olsa da büyük ve örgütlü ordulara karşı tek başına yeterli olmamıştır. Tarihte birkaç kez, duvarın kendisi aşılmadan, geçitleri savunan komutanların ikna edilmesi ya da satın alınması yoluyla geçilmiştir. Bu da savunmanın yalnızca taşa değil, insana da bağlı olduğunu göstermiştir.

Setin ekonomik işlevi de göz ardı edilmemelidir. Duvar boyunca yer alan kapılar, ticaretin denetlendiği geçiş noktalarıydı. Bozkır halklarıyla yapılan at ve kürk alışverişi bu kapılardan yürütülür, vergilendirilir ve gerektiğinde kapatılarak bir baskı aracına dönüştürülürdü. Bu yönüyle sed, yalnızca bir savunma hattı değil, aynı zamanda bir sınır yönetimi altyapısıydı.

Bugün setin yalnızca belirli bölümleri iyi korunmuş durumdadır. Turistlerin gezdiği restore edilmiş kesimler, yapının toplam uzunluğunun küçük bir bölümünü oluşturur. Geri kalan kısımların önemli bir bölümü erozyon, tarım faaliyetleri ve yapı malzemesi olarak sökülme nedeniyle yok olmuştur. Köylüler yüzyıllar boyunca duvarın taş ve tuğlalarını ev, ahır ve tarla sınırı yapımında kullanmıştır. Son yıllarda uydu görüntüleri ve hava taramalarıyla yürütülen çalışmalar, daha önce haritalanmamış birçok kesimin izini sürmeyi mümkün kılmaktadır.`,
    questions: [
      {
        id: 'q-008-1',
        type: 'detail',
        text: 'Metne göre Çin Seddi nasıl bir yapıdır?',
        options: [
          'Tek bir hükümdarın emriyle bir seferde inşa edilmiş bütünsel bir duvar',
          'Farklı hanedanlıkların yaklaşık iki bin yılda yaptığı duvar, kule ve doğal engellerin toplamı',
          'Yalnızca dağlık bölgelerde inşa edilmiş kısa bir duvar',
          'Modern dönemde turizm için inşa edilmiş bir yapı'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde setin tek bir yapı değil, iki bin yıl boyunca eklenen parçaların toplamı olduğu belirtilmiştir.'
      },
      {
        id: 'q-008-2',
        type: 'detail',
        text: 'Gözetleme kuleleri sayesinde haber nasıl iletiliyordu?',
        options: [
          'Atlı ulaklarla',
          'Gündüz duman, gece ateş işaretleriyle',
          'Güvercinlerle',
          'Davul sesiyle'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde alarmın gündüz duman gece ateş işaretleriyle iletildiği belirtilmiştir.'
      },
      {
        id: 'q-008-3',
        type: 'detail',
        text: 'Çöl kesimlerinde hangi inşaat malzemesi kullanılmıştır?',
        options: [
          'Pişmiş tuğla ve mermer',
          'Sıkıştırılmış toprak ve saz katmanları',
          'Ahşap kalaslar',
          'Demir çubuklar'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde çöl kesimlerinde sıkıştırılmış toprak ve saz katmanlarının kullanıldığı belirtilmiştir.'
      },
      {
        id: 'q-008-4',
        type: 'inference',
        text: 'Metne göre setin askeri başarısının tartışmalı olmasının nedeni nedir?',
        options: [
          'Hiçbir zaman kullanılmamış olması',
          'Küçük akınları caydırsa da büyük ordulara karşı yetersiz kalması ve bazen komutanların ikna edilmesiyle geçilmesi',
          'Çok kısa olması',
          'Yalnızca barış dönemlerinde inşa edilmiş olması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin, duvarın büyük ordulara karşı tek başına yeterli olmadığını ve bazen geçit komutanlarının satın alınmasıyla aşıldığını belirtir.'
      },
      {
        id: 'q-008-5',
        type: 'true_false',
        text: 'Çin Seddi\'nin tamamı günümüzde iyi korunmuş durumdadır.',
        options: ['Doğru', 'Yanlış'],
        correctAnswerIndex: 1,
        explanation: 'Metinde yalnızca belirli bölümlerin korunduğu, geri kalanının erozyon ve sökülme nedeniyle yok olduğu belirtilmiştir.'
      }
    ]
  },
  {
    id: 'text-009',
    language: 'tr',
    title: 'Fotosentez Nasıl Gerçekleşir',
    difficulty: 5,
    tags: ['Bilim', 'Biyoloji', 'Doğa'],
    content: `Fotosentez, yeryüzündeki neredeyse tüm besin zincirlerinin başlangıç noktasıdır. Bitkiler, algler ve bazı bakteriler bu süreç sayesinde güneş ışığındaki enerjiyi kimyasal bağlara dönüştürür. Denklem basit görünür: karbondioksit ve su, ışık enerjisi yardımıyla glikoz ve oksijene çevrilir. Ancak bu basit özet, birbirine bağlı iki farklı aşamayı gizler.

Süreç, bitki yapraklarındaki kloroplast adı verilen özel organellerde gerçekleşir. Kloroplastların içinde bulunan klorofil pigmenti, güneş ışığının mavi ve kırmızı dalga boylarını soğurur, yeşil dalga boyunu ise yansıtır. Yaprakların gözümüze yeşil görünmesinin nedeni budur; yeşil renk aslında bitkinin kullanmadığı ışıktır.

İlk aşama ışığa bağımlı tepkimelerdir. Burada soğurulan ışık enerjisi su moleküllerini parçalar. Bu parçalanmadan açığa çıkan oksijen atmosfere salınır. Yani soluduğumuz oksijen, aslında fotosentezin bir yan ürünüdür. Aynı aşamada hücrenin enerji taşıyıcısı olarak kullandığı moleküller üretilir.

İkinci aşama ise Calvin döngüsü olarak bilinir ve doğrudan ışığa ihtiyaç duymaz. Bu aşamada, ilk aşamada üretilen enerji kullanılarak havadan alınan karbondioksit sabitlenir ve glikoza dönüştürülür. Üretilen glikoz bitkinin büyümesinde, kök ve gövde yapımında kullanılır; fazlası nişasta olarak depolanır.

Fotosentez hızı sabit değildir. Işık şiddeti arttıkça hız belirli bir noktaya kadar yükselir, sonra sabitlenir. Sıcaklık da benzer bir eğri izler: belirli bir aralıkta hız artar, ancak çok yüksek sıcaklıklarda süreci yürüten enzimler bozulduğu için hız hızla düşer. Karbondioksit derişimi ise özellikle seralarda dikkatle izlenen bir etkendir; bilinçli olarak artırıldığında verim yükselebilir.

Bitkiler ayrıca su kaybını sınırlamak için yapraklarındaki gözenekleri kapatabilir. Ancak bu gözenekler karbondioksitin girdiği yerdir; kapandığında fotosentez de yavaşlar. Kurak bölgelerdeki bitkilerin geliştirdiği alternatif fotosentez yolları, tam olarak bu ikilemi çözmek için evrimleşmiştir. Bazı çöl bitkileri gözeneklerini gündüz kapalı tutar, karbondioksiti serin gecelerde alıp kimyasal olarak depolar ve gündüz ışık varken bu depodan kullanır. Böylece su kaybı en aza inerken üretim sürebilir.

Fotosentezin önemi tek bir bitkiyle sınırlı değildir. Atmosferdeki oksijenin bugünkü seviyeye ulaşması, milyarlarca yıl önce fotosentez yapmaya başlayan mikroskobik canlıların uzun soluklu faaliyeti sayesindedir. Bu süreç, yalnızca havanın bileşimini değil, kayaçların kimyasını ve okyanusların yapısını da köklü biçimde değiştirmiştir.

Bugün fosil yakıt olarak kullandığımız kömür ve petrol de aslında geçmişte fotosentezle depolanmış güneş enerjisidir. Bu yakıtların yakılması, milyonlarca yılda toprak altına hapsedilmiş karbonu kısa sürede atmosfere geri salar. Fotosentez ile fosil yakıt tüketimi arasındaki bu bağ, iklim tartışmalarının biyolojik zeminini oluşturur.`,
    questions: [
      {
        id: 'q-009-1',
        type: 'detail',
        text: 'Yaprakların yeşil görünmesinin nedeni metinde nasıl açıklanmıştır?',
        options: [
          'Klorofilin yeşil ışığı soğurması',
          'Klorofilin yeşil dalga boyunu yansıtması, yani kullanmaması',
          'Kloroplastların yeşil renkli olması',
          'Glikozun yeşil renkli olması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde klorofilin mavi ve kırmızıyı soğurup yeşili yansıttığı, yeşilin kullanılmayan ışık olduğu belirtilmiştir.'
      },
      {
        id: 'q-009-2',
        type: 'detail',
        text: 'Atmosfere salınan oksijen hangi aşamada ve neyin parçalanmasıyla açığa çıkar?',
        options: [
          'Calvin döngüsünde, karbondioksitin parçalanmasıyla',
          'Işığa bağımlı tepkimelerde, su moleküllerinin parçalanmasıyla',
          'Nişasta depolanırken',
          'Gözenekler kapandığında'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde ışığa bağımlı tepkimelerde su moleküllerinin parçalandığı ve oksijenin bu parçalanmadan açığa çıktığı belirtilmiştir.'
      },
      {
        id: 'q-009-3',
        type: 'detail',
        text: 'Calvin döngüsünün temel işlevi nedir?',
        options: [
          'Su moleküllerini parçalamak',
          'Havadan alınan karbondioksiti sabitleyip glikoza dönüştürmek',
          'Klorofil üretmek',
          'Yaprak gözeneklerini açmak'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde Calvin döngüsünde karbondioksitin sabitlenip glikoza dönüştürüldüğü belirtilmiştir.'
      },
      {
        id: 'q-009-4',
        type: 'inference',
        text: 'Çok yüksek sıcaklıklarda fotosentez hızının düşmesinin nedeni nedir?',
        options: [
          'Işık şiddetinin azalması',
          'Süreci yürüten enzimlerin bozulması',
          'Karbondioksitin tükenmesi',
          'Klorofilin renk değiştirmesi'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde çok yüksek sıcaklıklarda enzimlerin bozulduğu ve hızın hızla düştüğü belirtilmiştir.'
      },
      {
        id: 'q-009-5',
        type: 'inference',
        text: 'Bitkilerin su kaybını önlemek için gözenekleri kapatması neden bir ikilem yaratır?',
        options: [
          'Işık girişi engellenir',
          'Karbondioksit girişi de engellendiği için fotosentez yavaşlar',
          'Kloroplastlar parçalanır',
          'Nişasta depolanamaz hâle gelir'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde gözeneklerin karbondioksitin girdiği yer olduğu, kapandığında fotosentezin yavaşladığı belirtilmiştir.'
      }
    ]
  },
  {
    id: 'text-010',
    language: 'tr',
    title: 'İnternetin Doğuşu',
    difficulty: 5,
    tags: ['Teknoloji', 'Tarih', 'İletişim'],
    content: `İnternetin kökeni, 1960'larda ABD Savunma Bakanlığı'na bağlı bir araştırma kurumunun desteklediği ARPANET projesine dayanır. Projenin çıkış noktası, o dönemde birbirine bağlanamayan pahalı araştırma bilgisayarlarının kaynaklarını paylaşabilmesiydi. Kurulan ağın en özgün yanı ise merkezsiz olmasıydı: veri, tek bir merkezden geçmek yerine, ağdaki uygun herhangi bir yol üzerinden hedefe ulaşabiliyordu. Bir düğüm devre dışı kalsa bile iletişim başka bir güzergâh üzerinden sürebiliyordu.

Bu tasarımı mümkün kılan fikir paket anahtarlamaydı. Gönderilecek veri bütün hâlinde değil, küçük paketlere bölünerek yollanır; her paket kendi başına yol alır ve hedefte yeniden birleştirilir. 1969 yılında birbirine bağlanan ilk dört üniversite bilgisayarıyla ağ çalışmaya başlamıştır.

Ancak farklı üreticilerin bilgisayarlarının ortak bir dilde anlaşması gerekiyordu. Bu ihtiyaç, 1970'lerde geliştirilen TCP/IP protokol ailesiyle karşılandı. Bu protokoller, hangi donanım kullanılırsa kullanılsın verinin nasıl paketleneceğini, adresleneceğini ve kaybolduğunda nasıl yeniden isteneceğini tanımlıyordu. 1983'te ARPANET'in bu protokollere geçmesi, bugünkü internetin teknik doğum tarihi sayılır.

Buna rağmen internet uzun süre yalnızca üniversiteler ve araştırma kurumları tarafından kullanıldı; çünkü kullanımı komut satırı bilgisi gerektiriyordu. Asıl dönüşüm, 1989'da Tim Berners-Lee'nin CERN'de geliştirdiği World Wide Web ile yaşandı. Berners-Lee, belgeleri birbirine bağlayan köprü metin fikrini, adres sistemi ve tarayıcı yazılımıyla birleştirdi. Böylece kullanıcı, teknik bilgiye ihtiyaç duymadan bir bağlantıya tıklayarak başka bir belgeye geçebiliyordu.

Web'in ücretsiz ve açık bir standart olarak yayımlanması, yayılmasını hızlandırdı. Berners-Lee ve CERN, teknolojiyi patentlemek yerine kamuya açtı; herkes kendi sunucusunu kurabildi ve kimseden izin almadan sayfa yayımlayabildi. Bu açıklık, bugün geriye dönüp bakıldığında yayılmanın en belirleyici nedeni olarak görülmektedir.

1990'ların ortasında grafik arayüzlü tarayıcıların yaygınlaşmasıyla kullanıcı sayısı hızla arttı. Metnin yanında görselleri de gösterebilen tarayıcılar, interneti akademik bir araç olmaktan çıkarıp gündelik bir mecraya dönüştürdü. Arama motorlarının gelişmesi ise büyüyen sayfa yığınının içinde yön bulmayı mümkün kıldı.

Bugün internet; iletişimden ticarete, eğitimden sağlığa kadar neredeyse her alanın altyapısı hâline gelmiştir. Merkezsiz bir askeri araştırma ağı olarak başlayan yapı, günümüzde milyarlarca cihazı birbirine bağlayan küresel bir sisteme dönüşmüştür. Ancak bu büyümenin beraberinde getirdiği bir çelişki de vardır: teknik olarak hâlâ merkezsiz çalışan bu ağın trafiğinin büyük bölümü, artık az sayıda büyük platform üzerinden akmaktadır.`,
    questions: [
      {
        id: 'q-010-1',
        type: 'detail',
        text: 'ARPANET tasarımının en özgün yanı nedir?',
        options: [
          'Tek bir merkezden yönetilmesi',
          'Merkezsiz olması, verinin farklı güzergâhlardan ulaşabilmesi',
          'Yalnızca askeri amaçla kullanılması',
          'Kablosuz çalışması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde ağın merkezsiz olduğu, bir düğüm devre dışı kalsa bile iletişimin sürebildiği belirtilmiştir.'
      },
      {
        id: 'q-010-2',
        type: 'detail',
        text: 'Paket anahtarlama nasıl çalışır?',
        options: [
          'Veri bütün hâlinde tek yoldan gönderilir',
          'Veri küçük paketlere bölünür, her paket kendi başına yol alır ve hedefte birleştirilir',
          'Veri şifrelenip tek bir sunucuda saklanır',
          'Veri yalnızca gece saatlerinde iletilir'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde paket anahtarlamanın tanımı bu şekilde verilmiştir.'
      },
      {
        id: 'q-010-3',
        type: 'detail',
        text: 'Bugünkü internetin teknik doğum tarihi olarak hangi olay sayılır?',
        options: [
          "1969'da ilk dört bilgisayarın bağlanması",
          "1983'te ARPANET'in TCP/IP protokollerine geçmesi",
          "1989'da World Wide Web'in geliştirilmesi",
          "1990'larda grafik tarayıcıların yaygınlaşması"
        ],
        correctAnswerIndex: 1,
        explanation: "Metinde 1983'teki TCP/IP geçişinin teknik doğum tarihi sayıldığı belirtilmiştir."
      },
      {
        id: 'q-010-4',
        type: 'detail',
        text: 'Tim Berners-Lee hangi üç unsuru birleştirmiştir?',
        options: [
          'Paket anahtarlama, TCP/IP ve modem',
          'Köprü metin fikri, adres sistemi ve tarayıcı yazılımı',
          'Uydu bağlantısı, fiber kablo ve sunucu',
          'Şifreleme, sıkıştırma ve depolama'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde bu üç unsurun birleştirildiği açıkça belirtilmiştir.'
      },
      {
        id: 'q-010-5',
        type: 'inference',
        text: 'İnternetin uzun süre yalnızca üniversitelerde kullanılmasının nedeni nedir?',
        options: [
          'İnternetin yasak olması',
          'Kullanımının komut satırı bilgisi gerektirmesi',
          'Bağlantı ücretlerinin çok yüksek olması',
          'Bilgisayarların çok yavaş olması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kullanımın komut satırı bilgisi gerektirdiği için yaygınlaşmadığı belirtilmiştir.'
      }
    ]
  },
  {
    id: 'text-011',
    language: 'tr',
    title: 'Volkanlar ve Oluşumu',
    difficulty: 7,
    tags: ['Bilim', 'Coğrafya', 'Doğa'],
    content: `Volkanlar, yerkabuğunun altındaki erimiş kayaç kütlesinin, yani magmanın yüzeye ulaşmasıyla oluşan yer şekilleridir. Magma, çevresindeki katı kayaçlardan daha az yoğun olduğu için yavaşça yukarı doğru yükselir ve yolu üzerinde magma odaları oluşturur. Yüzeye çıktığı anda ise lav adını alır. Bu isim değişikliği yalnızca bir terim tercihi değildir: magma, basınç altında çözünmüş hâlde tuttuğu gazları yüzeye çıkarken serbest bırakır ve bu, patlamanın karakterini belirleyen en kritik faktördür.

Volkanların büyük çoğunluğu, levha sınırlarında yoğunlaşır. Levhaların birbirinden uzaklaştığı yerlerde magma boşluğu doldurmak üzere yükselir ve genellikle sakin akıntılar oluşturur. Levhaların çarpıştığı bölgelerde ise okyanus levhası, kıta levhasının altına dalar; taşıdığı su, üstteki mantonun erime sıcaklığını düşürerek gaz bakımından zengin ve patlamaya yatkın magma üretir. Üçüncü bir grup volkan ise levha sınırlarından uzakta, mantodaki sıcak noktalar üzerinde oluşur.

Patlama şiddetini belirleyen iki temel özellik, magmanın gaz içeriği ve viskozitesidir. Silis oranı düşük magma akışkandır; içindeki gazlar kolayca kaçabildiği için lav genellikle sakin biçimde akar ve geniş tabanlı, hafif eğimli kalkan volkanlar oluşturur. Silis oranı yüksek magma ise koyu ve yapışkandır; gazlar bu yapıdan kaçamaz, basınç birikir ve sonunda kayaç kütlesi şiddetle parçalanır. Bu tür patlamalar, dik yamaçlı koni biçimli volkanlar üretir.

En yıkıcı volkanik olaylardan biri piroklastik akıntılardır. Bunlar, yüzlerce derece sıcaklıktaki gaz ve kül karışımının yamaç boyunca saatte yüzlerce kilometre hızla inmesiyle oluşur ve lav akıntılarından çok daha ölümcüldür.

Volkanların etkisi yerelde kalmaz. Şiddetli patlamalarda stratosfere ulaşan kükürt bileşikleri, küçük damlacıklar oluşturarak güneş ışığının bir kısmını uzaya geri yansıtır. Tarihte bazı büyük patlamaların ardından dünya genelinde ortalama sıcaklıkların bir ila iki yıl boyunca ölçülebilir biçimde düştüğü, tarım verimliliğinin buna bağlı olarak azaldığı kayıtlara geçmiştir. Aynı dönemlere ait ağaç halkaları ve buz çekirdekleri, bu soğumanın izini bağımsız biçimde doğrulamaktadır.

Buna karşın volkanlar yalnızca yıkıcı değildir. Lav ve külün ayrışmasıyla oluşan topraklar, mineral bakımından son derece zengindir; bu nedenle aktif volkanların etekleri dünyanın en verimli tarım alanları arasındadır. İnsanların bilinen riske rağmen bu bölgelerde yoğun biçimde yerleşmesinin başlıca nedeni budur. Yer altındaki ısı ayrıca jeotermal enerji üretiminde kullanılır.

Modern volkan izleme çalışmaları, patlamaların bütünüyle öngörülemez olmadığını göstermektedir. Magmanın yükselmesi genellikle küçük depremlere, zeminde ölçülebilir şişmelere ve salınan gazların bileşimindeki değişimlere yol açar. Bu göstergelerin birlikte izlenmesi, tahliye kararlarının zamanında alınmasını sağlayarak can kaybını belirgin biçimde azaltabilmektedir.`,
    questions: [
      {
        id: 'q-011-1',
        type: 'detail',
        text: 'Metne göre magmanın yükselmesinin nedeni nedir?',
        options: [
          'Yerçekiminin zayıflaması',
          'Çevresindeki katı kayaçlardan daha az yoğun olması',
          'Deprem dalgalarının itmesi',
          'Yeraltı sularının basıncı'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde magmanın çevresindeki kayaçlardan daha az yoğun olduğu için yükseldiği belirtilmiştir.'
      },
      {
        id: 'q-011-2',
        type: 'detail',
        text: 'Levhaların çarpıştığı bölgelerde patlamaya yatkın magma nasıl oluşur?',
        options: [
          'Magma tamamen soğuyup katılaşır',
          'Dalan okyanus levhasının taşıdığı su, üstteki mantonun erime sıcaklığını düşürür',
          'Sıcak noktalar magmayı ısıtır',
          'Levhalar birbirinden uzaklaşır ve boşluk oluşur'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde dalan levhanın taşıdığı suyun erime sıcaklığını düşürerek gaz bakımından zengin magma ürettiği belirtilmiştir.'
      },
      {
        id: 'q-011-3',
        type: 'multiple_choice',
        text: 'Silis oranı düşük magma nasıl bir volkan oluşturur?',
        options: [
          'Dik yamaçlı koni biçimli volkanlar',
          'Geniş tabanlı, hafif eğimli kalkan volkanlar',
          'Yalnızca yeraltı mağaraları',
          'Hiçbir yer şekli oluşturmaz'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde akışkan (düşük silisli) magmanın geniş tabanlı, hafif eğimli kalkan volkanlar oluşturduğu belirtilmiştir.'
      },
      {
        id: 'q-011-4',
        type: 'detail',
        text: 'Piroklastik akıntılar neden lav akıntılarından daha ölümcüldür?',
        options: [
          'Daha uzun süre devam ettikleri için',
          'Yüzlerce derece sıcaklıktaki gaz ve kül karışımının saatte yüzlerce kilometre hızla inmesi nedeniyle',
          'Daha kalın bir tabaka oluşturdukları için',
          'Yeraltı sularını kirlettikleri için'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde piroklastik akıntıların sıcaklığı ve hızı vurgulanarak lavdan daha ölümcül olduğu belirtilmiştir.'
      },
      {
        id: 'q-011-5',
        type: 'inference',
        text: 'Şiddetli patlamaların küresel iklimi etkileme mekanizması nedir?',
        options: [
          'Lav akıntılarının okyanusları ısıtması',
          'Stratosfere ulaşan kükürt bileşiklerinin güneş ışığının bir kısmını uzaya geri yansıtması',
          'Kül tabakasının toprağı verimsizleştirmesi',
          'Magmanın atmosfere oksijen salması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde stratosferdeki kükürt damlacıklarının güneş ışığını yansıtarak sıcaklıkları düşürdüğü belirtilmiştir.'
      }
    ]
  },
  {
    id: 'text-012',
    language: 'tr',
    title: 'İpek Yolu',
    difficulty: 7,
    tags: ['Tarih', 'Ticaret', 'Kültür'],
    content: `İpek Yolu, tek bir güzergâhın adı değil, Doğu Asya'yı Akdeniz havzasına bağlayan kara ve deniz yollarından oluşan geniş bir ağın modern dönemde verilmiş ortak adıdır. Bu ağ üzerinde yolculuk eden tüccarların büyük çoğunluğu, yolun tamamını baştan sona kat etmezdi. Mallar genellikle bölgeden bölgeye el değiştirerek ilerler, her aracı kendi payını ekler ve fiyat, varış noktasına ulaştığında kat kat artmış olurdu.

İpek, adını yola veren ürün olsa da tek başına taşınan mal değildi. Doğudan batıya baharat, porselen, kâğıt ve değerli taşlar; batıdan doğuya cam eşya, yün kumaş, gümüş ve at taşınırdı. Kâğıdın batıya ulaşması özellikle önemli bir dönüm noktasıdır; bu teknoloji, bilgi kaydını ucuzlatarak yayıldığı her coğrafyada yazılı kültürü dönüştürmüştür.

Yolun taşıdığı en kalıcı yük ise fikirlerdi. Budizm, Hindistan'dan Orta Asya'ya ve oradan Çin'e bu güzergâhlar üzerinden ulaşmıştır. Sanat üslupları da benzer biçimde karışmış; Orta Asya'da bulunan heykellerde Yunan heykel geleneğinin izleriyle Budist ikonografinin bir arada olduğu görülmüştür. Matematiksel yöntemler, astronomi bilgisi ve tarım teknikleri de aynı yolları izlemiştir.

Ancak bu hareketlilik yalnızca olumlu sonuçlar doğurmamıştır. Kalabalık kervanlar ve limanlar, hastalıkların uzun mesafelere taşınmasını da kolaylaştırmıştır. Ondördüncü yüzyılda Avrupa nüfusunun büyük bölümünü etkileyen veba salgınının yayılmasında bu ticaret ağlarının rol oynadığı kabul edilir.

Ticaretin sürekliliği güvenliğe bağlıydı. Bu nedenle güzergâh boyunca kervansaraylar inşa edilmiştir. Bir günlük yol mesafesiyle konumlandırılan bu yapılar; tüccara konaklama, hayvanlara ahır, mallara güvenli depo ve gerektiğinde onarım imkânı sunardı. Kervansaraylar aynı zamanda haberlerin ve fiyat bilgisinin el değiştirdiği enformel merkezlerdi.

Ticaretin canlılığı, güzergâh üzerindeki siyasi istikrara sıkı biçimde bağlıydı. Geniş bir alanı tek bir yönetimin denetlemesi, gümrük sayısını azaltıp yol güvenliğini artırdığı için ticaret hacmini yükseltirdi. Buna karşılık bölgesel çatışmalar ve yol kesme olayları, tüccarları güney rotalarına ya da tamamen deniz yollarına yöneltirdi. Bu yüzden İpek Yolu'nun tarihi, kesintisiz bir akış değil, dönem dönem canlanan ve sönen bir hareketlilik olarak okunmalıdır.

Yol boyunca kurulan şehirler de bu hareketlilikten beslenmiştir. Semerkant, Buhara ve Kaşgar gibi merkezler yalnızca konaklama noktaları değil; çevirmenlerin, sarrafların ve zanaatkârların yoğunlaştığı üretim merkezleriydi. Farklı dillerin bir arada konuşulduğu bu şehirlerde ticaret sözleşmeleri çoğu zaman birden fazla dilde düzenlenirdi.

İpek Yolu'nun önemi, on beşinci yüzyıldan itibaren okyanus aşırı deniz rotalarının gelişmesiyle azalmıştır. Deniz taşımacılığı daha ucuz ve daha yüksek hacimliydi. Buna rağmen yolun bıraktığı kültürel miras, geçtiği şehirlerin mimarisinde, mutfağında ve dilinde hâlâ izlenebilir durumdadır.`,
    questions: [
      {
        id: 'q-012-1',
        type: 'detail',
        text: 'Metne göre tüccarların çoğu yolu nasıl kat ederdi?',
        options: [
          'Baştan sona tek seferde',
          'Mallar bölgeden bölgeye el değiştirerek ilerlerdi',
          'Yalnızca deniz yoluyla',
          'Devlet görevlileri eşliğinde'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde malların bölgeden bölgeye el değiştirerek ilerlediği ve her aracının payını eklediği belirtilmiştir.'
      },
      {
        id: 'q-012-2',
        type: 'detail',
        text: 'Kâğıdın batıya ulaşması neden önemli bir dönüm noktası sayılır?',
        options: [
          'Ticaret hacmini azalttığı için',
          'Bilgi kaydını ucuzlatarak yazılı kültürü dönüştürdüğü için',
          'İpek üretimini durdurduğu için',
          'Kervansarayların inşasını gerektirdiği için'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kâğıdın bilgi kaydını ucuzlatarak yazılı kültürü dönüştürdüğü belirtilmiştir.'
      },
      {
        id: 'q-012-3',
        type: 'detail',
        text: 'Kervansaraylar nasıl konumlandırılmıştı ve ne sunardı?',
        options: [
          'Rastgele noktalarda, yalnızca yemek',
          'Bir günlük yol mesafesiyle; konaklama, ahır, güvenli depo ve onarım imkânı',
          'Sadece şehir merkezlerinde, yalnızca depo',
          'Deniz kıyılarında, yalnızca gemi bakımı'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kervansarayların bir günlük yol mesafesiyle konumlandırıldığı ve bu hizmetleri sunduğu belirtilmiştir.'
      },
      {
        id: 'q-012-4',
        type: 'inference',
        text: 'Metne göre ticaret ağlarının olumsuz bir sonucu nedir?',
        options: [
          'Sanat üsluplarının karışması',
          'Hastalıkların uzun mesafelere taşınmasını kolaylaştırması',
          'Kervansarayların inşa edilmesi',
          'Kâğıdın yayılması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kalabalık kervan ve limanların hastalık yayılmasını kolaylaştırdığı, veba salgınında rol oynadığı belirtilmiştir.'
      },
      {
        id: 'q-012-5',
        type: 'main_idea',
        text: 'Bu metnin ana fikri nedir?',
        options: [
          'İpek Yolu sadece ipek ticareti içindi.',
          'İpek Yolu; mal, fikir, teknoloji ve hatta hastalık taşıyan, kalıcı kültürel izler bırakmış geniş bir alışveriş ağıydı.',
          'Kervansaraylar yolun tek önemli yapısıydı.',
          'Deniz yolları hiçbir zaman İpek Yolu ile rekabet edememiştir.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metin yolun ticari, kültürel, teknolojik ve olumsuz sonuçlarını birlikte ele alır.'
      }
    ]
  },
  {
    id: 'text-013',
    language: 'tr',
    title: 'Kara Delikler',
    difficulty: 8,
    tags: ['Bilim', 'Uzay', 'Fizik'],
    content: `Kara delikler, kütleçekiminin o kadar güçlü olduğu uzay bölgeleridir ki, belirli bir sınırın içinden hiçbir şey, ışık dahi kaçamaz. Genel görelilik kuramına göre kütle, içinde bulunduğu uzay-zamanı büker; kütle yeterince küçük bir hacme sıkıştığında bu bükülme öyle keskinleşir ki, tüm olası yollar içeriye doğru kıvrılır. Kaçış, artık bir hız meselesi olmaktan çıkar; dışarı giden bir yol kalmaz.

Yıldız kökenli kara delikler, kütlesi yeterince büyük bir yıldızın yaşam döngüsünün sonunda oluşur. Yıldızlar, çekirdeklerindeki füzyon tepkimelerinin ürettiği dışa doğru basınç sayesinde kendi kütleçekimlerine karşı dengede durur. Nükleer yakıt tükendiğinde bu denge bozulur ve çekirdek saniyeler içinde çöker. Çöken kütle belirli bir sınırın üzerindeyse, çöküşü durduracak hiçbir bilinen kuvvet kalmaz.

Kara deliğin sınırını oluşturan yüzeye olay ufku denir. Olay ufku katı bir yüzey değil, geri dönüşü olmayan bir eşiktir. Dışarıdan izleyen bir gözlemci için, olay ufkuna yaklaşan bir nesnenin zamanı giderek yavaşlar; nesne ufka ulaşıyormuş gibi görünse de asla ulaştığı görülmez ve yaydığı ışık giderek kızıla kayarak sönükleşir.

Kara delikler doğrudan görülemez; çünkü ışık yaymazlar. Buna karşın varlıkları dolaylı yollarla saptanabilir. Kara deliğe doğru çekilen madde, düşmeden önce yüksek hızda dönen bir disk oluşturur; sürtünme nedeniyle milyonlarca dereceye ısınan bu disk yoğun X ışını yayar. Ayrıca yakın yıldızların alışılmadık yörüngeleri, görünmeyen ama çok büyük kütleli bir cismin varlığına işaret eder. Son yıllarda, dünya çapına yayılmış radyo teleskoplarının verileri birleştirilerek olay ufkunun çevresindeki parlak halkanın görüntüsü de elde edilmiştir.

Yıldız kökenli kara deliklerin yanı sıra, galaksilerin merkezlerinde milyonlarca hatta milyarlarca güneş kütlesine ulaşan dev kara delikler bulunur. Kendi galaksimizin merkezindeki cismin varlığı, çevresindeki yıldızların onlarca yıl boyunca izlenen yörüngeleriyle saptanmıştır. Bu yıldızların görünürde boş bir noktanın etrafında hızla dolanması, oradaki kütlenin ne kadar büyük ve ne kadar küçük bir hacme sıkışmış olduğunu hesaplamayı mümkün kılmıştır.

Kara deliklerin fizikteki asıl önemi, iki temel kuramın çeliştiği noktayı işaret etmeleridir. Genel görelilik onları büyük ölçekte tutarlı biçimde tanımlarken, kuantum mekaniği bilginin yok olamayacağını söyler. Kuramsal çalışmalar, kara deliklerin olay ufkunun hemen dışındaki kuantum etkileri nedeniyle çok zayıf bir ışıma yayarak son derece uzun sürelerde buharlaşabileceğini öngörür. Bu doğruysa, içeri düşen maddenin taşıdığı bilgiye ne olduğu sorusu ortaya çıkar. Söz konusu gerilim, günümüz kuramsal fiziğinin en canlı tartışma alanlarından biridir ve iki kuramı birleştirecek daha kapsamlı bir çerçeve arayışını sürdüren başlıca nedenlerden biridir.`,
    questions: [
      {
        id: 'q-013-1',
        type: 'inference',
        text: 'Metne göre kara delikten kaçışın imkânsız olmasının nedeni nedir?',
        options: [
          'Yeterince hızlı gidilememesi',
          'Uzay-zamanın öyle büküldüğü ki tüm olası yolların içeriye kıvrılması',
          'Kara deliğin çok soğuk olması',
          'Işığın orada yavaşlaması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde kaçışın bir hız meselesi olmaktan çıktığı, dışarı giden yol kalmadığı belirtilmiştir.'
      },
      {
        id: 'q-013-2',
        type: 'detail',
        text: 'Yıldızlar normalde kendi kütleçekimlerine karşı nasıl dengede durur?',
        options: [
          'Manyetik alanları sayesinde',
          'Çekirdeklerindeki füzyon tepkimelerinin ürettiği dışa doğru basınç sayesinde',
          'Çevrelerindeki gezegenlerin çekimi sayesinde',
          'Dönme hızları sayesinde'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde füzyonun ürettiği dışa doğru basıncın dengeyi sağladığı belirtilmiştir.'
      },
      {
        id: 'q-013-3',
        type: 'detail',
        text: 'Dışarıdan izleyen bir gözlemci için olay ufkuna yaklaşan nesneye ne olur?',
        options: [
          'Aniden kaybolur',
          'Zamanı yavaşlar, ışığı kızıla kayarak sönükleşir ve ufka ulaştığı görülmez',
          'Daha parlak hâle gelir',
          'Geri sekerek uzaklaşır'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde bu gözlem etkisi ayrıntılı biçimde açıklanmıştır.'
      },
      {
        id: 'q-013-4',
        type: 'multiple_choice',
        text: 'Aşağıdakilerden hangisi metinde kara deliklerin dolaylı saptanma yöntemleri arasında sayılmamıştır?',
        options: [
          'Isınan diskin yaydığı X ışınları',
          'Yakın yıldızların alışılmadık yörüngeleri',
          'Radyo teleskop verileriyle elde edilen halka görüntüsü',
          'Kara deliğin yaydığı görünür ışığın ölçülmesi'
        ],
        correctAnswerIndex: 3,
        explanation: 'Metinde kara deliklerin ışık yaymadığı ve doğrudan görülemediği belirtilmiştir; diğer üç yöntem sayılmıştır.'
      },
      {
        id: 'q-013-5',
        type: 'main_idea',
        text: 'Metne göre kara deliklerin fizikteki asıl önemi nedir?',
        options: [
          'Uzay yolculuğu için kestirme yol sunmaları',
          'Genel görelilik ile kuantum mekaniğinin çeliştiği noktayı işaret etmeleri',
          'Yıldız oluşumunu hızlandırmaları',
          'Galaksileri birbirine bağlamaları'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metnin son paragrafında bu gerilim, kuramsal fiziğin en canlı tartışma alanlarından biri olarak belirtilmiştir.'
      }
    ]
  },
  {
    id: 'text-014',
    language: 'tr',
    title: 'Yapay Zeka Etiği',
    difficulty: 9,
    tags: ['Teknoloji', 'Etik', 'Toplum'],
    content: `Yapay zekâ sistemlerinin karar süreçlerine giderek daha fazla dahil olması, teknik bir başarı öyküsü olduğu kadar bir dizi çözülmemiş etik sorunun da kaynağıdır. Bu sorunların en yaygın olanı önyargı meselesidir. Makine öğrenmesi modelleri, kendilerine sunulan geçmiş veriden örüntü çıkarır. Eğer bu veri, geçmişteki eşitsiz uygulamaların kaydını içeriyorsa, model bu eşitsizliği bir hata olarak değil, öğrenilmesi gereken bir kural olarak yorumlar. Sonuç, geçmişin sistematik biçimde geleceğe kopyalanmasıdır.

Bu durum özellikle hassas alanlarda ağır sonuçlar doğurur. İşe alım süreçlerinde geçmiş kararların verisiyle eğitilen bir model, belirli grupları farkında olmadan eleyebilir. Kredi değerlendirmesinde, doğrudan yasaklı bir ölçüt kullanmasa bile posta kodu gibi dolaylı değişkenler üzerinden benzer bir ayrım üretebilir. Adli risk tahmini yapan sistemlerde ise hatanın bedeli doğrudan bireyin özgürlüğüne yansır.

İkinci temel sorun açıklanabilirliktir. Derin öğrenme modellerinin çıktısı, milyonlarca parametrenin bir arada üretiği bir sonuçtur ve bu sonucun insan tarafından takip edilebilir bir gerekçesi çoğu zaman yoktur. Bir hekim, tedavi kararını gerekçelendirebilir; bir model ise yalnızca bir olasılık değeri verir. Bu şeffaflık eksikliği, itiraz hakkını da fiilen zorlaştırır: gerekçesi bilinmeyen bir karara karşı savunma yapmak güçtür.

Üçüncü sorun sorumluluğun dağılmasıdır. Zararlı bir kararın sorumlusu, modeli geliştiren ekip mi, eğitim verisini toplayan kurum mu, sistemi devreye alan işletme mi, yoksa çıktıya güvenerek işlem yapan kullanıcı mıdır? Klasik hukuk, kusuru belirli bir failin niyetine ve öngörüsüne bağlar; oysa burada zarar, hiçbirinin tek başına öngörmediği bir etkileşimden doğabilir.

Dördüncü bir sorun, insan denetiminin çoğu zaman kâğıt üzerinde kalmasıdır. Bir sisteme "nihai kararı insan verir" kaydı eklemek, uygulamada yeterli bir güvence sağlamayabilir. Yüksek hacimli işlerde model önerilerini tek tek incelemek için zaman yoktur; ayrıca sayısal bir çıktının karşısında insanların kendi yargılarını geri plana atma eğilimi defalarca gözlenmiştir. Denetimin anlamlı olabilmesi için denetleyen kişinin itiraz edebilecek bilgiye, zamana ve yetkiye sahip olması gerekir.

Bu nedenle son yıllarda düzenleyici yaklaşımlar risk temelli bir çerçeveye yönelmiştir. Uygulamalar, yol açabilecekleri zarara göre sınıflandırılır; yüksek riskli sayılan alanlarda veri kalitesi belgeleme, insan denetimi ve bağımsız denetlenebilirlik zorunlu hâle getirilir. Düşük riskli kabul edilen kullanımlar ise daha hafif yükümlülüklerle sınırlanır. Bu yaklaşımın temel varsayımı, teknolojinin kendisini değil, kullanıldığı bağlamı düzenlemenin daha gerçekçi olduğudur. Aynı modelin bir eğlence uygulamasında zararsız, bir sağlık kararında ise ciddi sonuçlar doğurabilmesi, bu varsayımın en güçlü dayanağıdır.`,
    questions: [
      {
        id: 'q-014-1',
        type: 'detail',
        text: 'Metne göre model, geçmiş verideki eşitsizliği nasıl yorumlar?',
        options: [
          'Düzeltilmesi gereken bir hata olarak',
          'Öğrenilmesi gereken bir kural olarak',
          'Anlamsız gürültü olarak',
          'Eksik veri olarak'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde modelin eşitsizliği hata olarak değil, öğrenilmesi gereken bir kural olarak yorumladığı belirtilmiştir.'
      },
      {
        id: 'q-014-2',
        type: 'detail',
        text: 'Kredi değerlendirmesinde dolaylı ayrım nasıl ortaya çıkabilir?',
        options: [
          'Doğrudan yasaklı ölçütlerin kullanılmasıyla',
          'Posta kodu gibi dolaylı değişkenler üzerinden',
          'Yalnızca gelir bilgisiyle',
          'Model hiç ayrım üretemez'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde posta kodu gibi dolaylı değişkenlerin benzer bir ayrım üretebileceği belirtilmiştir.'
      },
      {
        id: 'q-014-3',
        type: 'inference',
        text: 'Açıklanabilirlik eksikliği neden itiraz hakkını zorlaştırır?',
        options: [
          'Modeller çok yavaş çalıştığı için',
          'Gerekçesi bilinmeyen bir karara karşı savunma yapmak güç olduğu için',
          'İtiraz süreleri kısa olduğu için',
          'Modeller sürekli güncellendiği için'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde gerekçesi bilinmeyen bir karara karşı savunma yapmanın güç olduğu açıkça belirtilmiştir.'
      },
      {
        id: 'q-014-4',
        type: 'inference',
        text: 'Klasik hukukun sorumluluk sorununda yetersiz kalmasının nedeni nedir?',
        options: [
          'Yapay zekâ hakkında hiç yasa bulunmaması',
          'Kusuru belirli bir failin niyet ve öngörüsüne bağlaması, oysa zararın kimsenin tek başına öngörmediği bir etkileşimden doğabilmesi',
          'Mahkemelerin teknik bilgiye sahip olmaması',
          'Şirketlerin sigorta yaptırmaması'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde klasik hukukun kusuru faile bağladığı, oysa zararın öngörülemeyen bir etkileşimden doğabildiği belirtilmiştir.'
      },
      {
        id: 'q-014-5',
        type: 'main_idea',
        text: 'Risk temelli düzenleyici yaklaşımın temel varsayımı nedir?',
        options: [
          'Tüm yapay zekâ uygulamaları yasaklanmalıdır.',
          'Teknolojinin kendisini değil, kullanıldığı bağlamı düzenlemek daha gerçekçidir.',
          'Düzenleme yalnızca geliştiricilere yönelik olmalıdır.',
          'Veri kalitesi belgelemesi gereksizdir.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metnin son cümlesinde bu varsayım açıkça ifade edilmiştir.'
      }
    ]
  },
  {
    id: 'text-015',
    language: 'tr',
    title: 'Kuantum Dolanıklık',
    difficulty: 10,
    tags: ['Bilim', 'Fizik', 'Teknoloji'],
    content: `Kuantum dolanıklık, iki ya da daha fazla parçacığın ortak bir kuantum durumunu paylaşması ve bu parçacıkların artık bağımsız birer nesne olarak tanımlanamaması durumudur. Dolanık bir çiftin bileşenleri, aralarındaki mesafe ne olursa olsun tek bir bütünün parçaları gibi davranır; birinin ölçümüyle elde edilen sonuç, diğerinin ölçüm sonucuyla klasik olasılıkla açıklanamayacak biçimde ilişkilidir.

Einstein, Podolsky ve Rosen'in 1935 tarihli makalesi bu olguyu bir kusur olarak sunmayı amaçlıyordu. Yazarlara göre böyle bir ilişki ya uzak etkileşim gerektiriyordu ki bu görelilikle bağdaşmazdı, ya da kuantum kuramı eksikti ve parçacıklar ölçümden önce zaten belirli değerler taşıyordu. Einstein bu durumu "ürkütücü uzaktan etki" olarak nitelemiştir.

Tartışma otuz yıl boyunca felsefi düzlemde kalmıştır. 1964'te John Bell, iki görüşü ayırt edecek deneysel bir ölçüt formüle etmiştir. Bell eşitsizliği, parçacıkların ölçümden önce belirli değerler taşıdığı varsayımı doğruysa, ölçüm sonuçları arasındaki ilişkinin aşamayacağı bir üst sınır tanımlar. Kuantum kuramı ise bu sınırın aşılacağını öngörür. Sonraki yıllarda giderek daha titiz biçimde tasarlanan deneyler, olası açıkları tek tek kapatarak eşitsizliğin ihlal edildiğini defalarca göstermiştir.

Bu sonuç, dolanıklığın teknolojik uygulamalarının önünü açmıştır. Kuantum anahtar dağıtımında, dolanık çiftler kullanılarak iki taraf arasında ortak bir şifre üretilir. Sistemin gücü matematiksel zorluktan değil, fizikten gelir: araya giren bir dinleyicinin ölçüm yapması durumu kaçınılmaz olarak bozar ve taraflar bu bozulmayı istatistiksel olarak fark eder. Kuantum bilgisayarlarda ise dolanıklık, kübitler arasında klasik bitlerle kurulamayan korelasyonlar oluşturarak belirli algoritmaların üstünlüğünü mümkün kılar.

Dolanıklığın pratikte kullanılmasının önündeki en büyük engel kırılganlığıdır. Dolanık parçacıklar çevreyle en küçük etkileşimde bile ortak durumlarını kaybeder; bu sürece dekoherans denir. Bu nedenle laboratuvarlarda kübitler mutlak sıfıra yakın sıcaklıklarda ve titreşimden yalıtılmış ortamlarda tutulur. Uzun mesafelerde dolanıklığı korumak da benzer bir sorundur: optik fiberde ilerleyen fotonların bir kısmı yolda kaybolur ve klasik iletişimdeki gibi sinyali kopyalayıp güçlendirmek kuantum durumları için mümkün değildir. Bu sınırlamayı aşmak üzere geliştirilen kuantum yineleyiciler, hâlâ aktif bir araştırma konusudur.

Buna karşın yaygın bir yanlış anlama düzeltilmelidir: dolanıklık, ışıktan hızlı iletişime izin vermez. Ölçüm yapan taraf sonucu seçemez; elde edilen değer rastgeledir. Uzaktaki gözlemci de yalnızca rastgele bir dizi görür. İki dizinin arasındaki olağandışı ilişki, ancak sonuçlar klasik bir kanal üzerinden karşılaştırıldığında ortaya çıkar. Bu nedenle dolanıklık, nedenselliği ihlal etmeden korelasyonun sınırlarını genişletir.`,
    questions: [
      {
        id: 'q-015-1',
        type: 'main_idea',
        text: 'Metne göre kuantum dolanıklık nedir?',
        options: [
          'Parçacıkların birbirini hiç etkilememesi',
          'İki ya da daha fazla parçacığın ortak bir kuantum durumu paylaşması ve bağımsız nesneler olarak tanımlanamaması',
          'Yalnızca çok yakın parçacıklar arasında görülen bir çekim',
          'Işığın hızını değiştiren bir olgu'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metnin ilk paragrafında dolanıklığın tanımı bu şekilde verilmiştir.'
      },
      {
        id: 'q-015-2',
        type: 'detail',
        text: 'Einstein, Podolsky ve Rosen makalesinin amacı neydi?',
        options: [
          'Dolanıklığı teknolojik olarak kullanmak',
          'Olguyu bir kusur olarak sunmak ve kuantum kuramının eksik olabileceğini savunmak',
          'Bell eşitsizliğini kanıtlamak',
          'Kuantum bilgisayar tasarlamak'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde makalenin olguyu bir kusur olarak sunmayı amaçladığı belirtilmiştir.'
      },
      {
        id: 'q-015-3',
        type: 'detail',
        text: 'Bell eşitsizliğinin işlevi nedir?',
        options: [
          'Parçacıkların hızını ölçmek',
          'İki görüşü ayırt edecek deneysel bir ölçüt sunmak; belirli değerler varsayımı doğruysa aşılamayacak bir üst sınır tanımlamak',
          'Şifreleme anahtarı üretmek',
          'Kübit sayısını artırmak'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde Bell eşitsizliğinin bu ayırt edici ölçütü tanımladığı belirtilmiştir.'
      },
      {
        id: 'q-015-4',
        type: 'inference',
        text: 'Kuantum anahtar dağıtımının güvenliği neden matematiksel zorluğa değil fiziğe dayanır?',
        options: [
          'Şifreler çok uzun olduğu için',
          'Araya giren bir dinleyicinin ölçümü durumu kaçınılmaz olarak bozar ve bu bozulma fark edilir',
          'Bilgisayarlar yeterince hızlı olmadığı için',
          'Anahtarlar sürekli değiştiği için'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metinde dinleyicinin ölçümünün durumu bozduğu ve tarafların bunu istatistiksel olarak fark ettiği belirtilmiştir.'
      },
      {
        id: 'q-015-5',
        type: 'inference',
        text: 'Dolanıklık neden ışıktan hızlı iletişime izin vermez?',
        options: [
          'Parçacıklar birbirinden çok uzak olduğu için',
          'Ölçüm yapan taraf sonucu seçemez; sonuç rastgeledir ve ilişki ancak klasik bir kanalla karşılaştırıldığında ortaya çıkar',
          'Dolanıklık yalnızca teoride var olduğu için',
          'Ölçüm cihazları yeterince hassas olmadığı için'
        ],
        correctAnswerIndex: 1,
        explanation: 'Metnin son paragrafında bu sınırlama ayrıntılı biçimde açıklanmıştır.'
      }
    ]
  }
];
