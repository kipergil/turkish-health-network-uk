/**
 * Idempotently seeds Turkish translation rows into the "translations"
 * collection (created by apply-schema.ts), demonstrating the multi-language
 * feature end-to-end. Safe to re-run: skips any (collection, itemId, field,
 * language) combination that already has a row, so edits made afterwards in
 * the Directus Data Studio are never overwritten.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/seed-translations.ts
 */
import { createDirectus, createItem, readItems, rest, staticToken } from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  throw new Error(
    "DIRECTUS_URL and DIRECTUS_TOKEN must be set (see .env.example).",
  );
}

const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

interface TranslationDef {
  collection: string;
  itemId: string;
  field: string;
  language: string;
  value: string;
}

const LANGUAGE = "tr";

// specialities: { id: [name_tr, description_tr] }
const SPECIALITY_TRANSLATIONS: Record<string, [string, string]> = {
  "spec-anti-snoring": [
    "Horlama Karşıtı ve Periodontal Tedavi",
    "Horlama, diş eti hastalığı ve periodontal rahatsızlıkların tedavisi.",
  ],
  "spec-cardiology": [
    "Kardiyoloji",
    "Kalp ve kardiyovasküler hastalıkların teşhis ve tedavisi.",
  ],
  "spec-cbt": [
    "Bilişsel Davranışçı Terapi",
    "Kaygı, depresyon ve stres için yapılandırılmış konuşma terapisi.",
  ],
  "spec-child-psychology": [
    "Çocuk Psikolojisi",
    "Çocuklar için duygusal ve davranışsal destek.",
  ],
  "spec-circumcision": [
    "Sünnet",
    "Bebekler, çocuklar ve yetişkinler için erkek sünneti.",
  ],
  "spec-cosmetic-dentistry": [
    "Estetik Diş Hekimliği",
    "Kaplama, diş beyazlatma ve gülüş estetiği.",
  ],
  "spec-dermatology": ["Dermatoloji", "Cilt, saç ve tırnak rahatsızlıkları."],
  "spec-diabetes-nutrition": [
    "Diyabet Beslenmesi",
    "Tip 1 ve Tip 2 diyabetin beslenme yoluyla yönetimi.",
  ],
  "spec-endocrinology": [
    "Endokrinoloji ve Diyabet",
    "Hormonal sağlık ile diyabetin teşhis, tedavi ve yönetimi.",
  ],
  "spec-family-therapy": [
    "Aile Terapisi",
    "Aile ilişkileri ve anlaşmazlıkları için destek.",
  ],
  "spec-general-dentistry": [
    "Genel Diş Hekimliği",
    "Kontroller, dolgular, temizlik ve günlük ağız bakımı.",
  ],
  "spec-general-practice": [
    "Aile Hekimliği",
    "Günlük tıbbi bakım, kontroller, sevkler ve uzun süreli hastalık yönetimi.",
  ],
  "spec-general-surgery": [
    "Genel ve Kolorektal Cerrahi",
    "Kolorektal rahatsızlıklar, kanserler ve genel cerrahi ihtiyaçların ameliyatla tedavisi.",
  ],
  "spec-gynaecology": ["Jinekoloji", "Kadın üreme sağlığı."],
  "spec-hair-restoration": [
    "Saç Ekimi",
    "Saç dökülmesi değerlendirmesi ve saç ekimi işlemleri.",
  ],
  "spec-msk-physiotherapy": [
    "Kas-İskelet Sistemi Fizyoterapisi",
    "Kas, eklem ve sırt ağrılarının tedavisi.",
  ],
  "spec-neurosurgery": [
    "Beyin ve Sinir Cerrahisi",
    "Beyin, omurga ve sinir sistemini etkileyen rahatsızlıkların ameliyatla tedavisi.",
  ],
  "spec-oral-surgery": [
    "Ağız Cerrahisi",
    "Diş çekimi, implant ve cerrahi işlemler.",
  ],
  "spec-orthodontics": [
    "Ortodonti",
    "Diş teli, şeffaf plak ve diş-çene dizilim düzeltmesi.",
  ],
  "spec-paediatrics": [
    "Çocuk Sağlığı ve Hastalıkları",
    "Bebekler, çocuklar ve ergenler için tıbbi bakım.",
  ],
  "spec-pelvic-health": [
    "Pelvik Sağlık Fizyoterapisi",
    "Her cinsiyet ve yaş için pelvik taban disfonksiyonunun değerlendirilmesi ve tedavisi.",
  ],
  "spec-post-surgical-rehab": [
    "Ameliyat Sonrası Rehabilitasyon",
    "Ameliyat sonrası iyileşme desteği.",
  ],
  "spec-psychiatry": [
    "Psikiyatri",
    "Ruh sağlığı rahatsızlıklarının, ilaç yönetimi dahil, tıbbi teşhis ve tedavisi.",
  ],
  "spec-root-canal": [
    "Kanal Tedavisi",
    "Enfekte veya hasarlı diş pulpasının tedavisi.",
  ],
  "spec-sports-injury": [
    "Spor Yaralanması Rehabilitasyonu",
    "Spor yaralanmalarından iyileşme ve rehabilitasyon.",
  ],
  "spec-sports-nutrition": [
    "Spor Beslenmesi",
    "Sportif performans ve toparlanma için beslenme planlaması.",
  ],
  "spec-trauma-ptsd": [
    "Travma ve TSSB",
    "Travma, travma sonrası stres bozukluğu (TSSB) ve göçle ilişkili sıkıntılar için destek.",
  ],
  "spec-weight-management": [
    "Kilo Yönetimi",
    "Sağlıklı kilo yönetimi için kişiselleştirilmiş beslenme planları.",
  ],
};

const NHS_PAGE_TITLE_TR =
  "İngiltere'de NHS Sigortası ve Sağlık Hizmetlerinden Nasıl Yararlanılır";

const NHS_PAGE_BODY_TR = `
<p>NHS (National Health Service — Ulusal Sağlık Hizmeti), Birleşik Krallık'ta sağlık hizmetlerinin büyük bölümünü kullanım anında ücretsiz olarak sağlar ve genel vergilendirme ile Ulusal Sigorta (National Insurance) yoluyla finanse edilir. Bu rehber, NHS'yi kullanmaya başlamak için pratik adımları ve özel sağlık sigortasının NHS ile nasıl bir arada kullanılabileceğini kapsar.</p>

<h2>1. Bir aile hekimliği (GP) kliniğine kayıt olun</h2>
<p>Aile hekimliği (GP) kliniği, acil olmayan sağlık sorunları için neredeyse her zaman ilk başvuru noktasıdır ve bir kliniğe kayıt olmak atılacak en önemli adımdır. Yaşadığınız bölgeyi kapsayan herhangi bir kliniğe, göçmenlik statünüzden bağımsız olarak kayıt olabilirsiniz — kaydın kendisi ücretsizdir ve adres kanıtı, kimlik veya göçmenlik belgesi gerektirmez, ancak bazı klinikler nezaketen bunları isteyebilir. <a href="https://www.nhs.uk/service-search/find-a-gp" target="_blank" rel="noopener noreferrer">nhs.uk</a> üzerinden arama yapabilir veya Türkçe konuşan klinikleri bulmak için bu dizinin <a href="/map">haritasını</a> kullanabilirsiniz.</p>
<p>Kayıt olduktan sonra, tüm sağlık sistemi genelinde kayıtlarınızı birbirine bağlamak için kullanılan bir NHS numarası verilir.</p>

<h2>2. Ücretsiz NHS bakımına kimler hak kazanır</h2>
<p>Aile hekimi muayeneleri Birleşik Krallık'ta yaşayan herkes için ücretsizdir. Hastane tedavisi genellikle Birleşik Krallık'ta "olağan ikametgahı" olan herkes için ücretsizdir; çoğu çalışma ve aile vizesi dahil bazı vize kategorileri, vize başvurusunun bir parçası olarak ödenen bir Göçmenlik Sağlık Ek Ücreti içerir ve bu, sahibine bir yerleşikle büyük ölçüde aynı temelde NHS bakımı hakkı tanır. Kısa süreli ziyaretçiler ve bazı diğer kategoriler belirli hastane hizmetleri için ücretlendirilebilir. Uygunluk kuralları değiştiği ve kişisel duruma bağlı olduğu için, güncel rehberliği <a href="https://www.gov.uk/guidance/healthcare-for-visitors-and-migrants-to-england" target="_blank" rel="noopener noreferrer">gov.uk</a> üzerinden kontrol edin veya emin değilseniz doğrudan aile hekimliği kliniğinizin resepsiyonuna sorun.</p>

<h2>3. Reçeteler, diş ve göz bakımı</h2>
<p>İngiltere'de yazılan reçeteler, kalem başına standart bir ücret taşır; çocuklar, 60 yaş üstü kişiler, hamile veya yakın zamanda hamile kalmış kadınlar ve belirli uzun süreli rahatsızlıkları olan veya düşük gelirli kişiler için yaygın muafiyetler bulunur — İskoçya, Galler ve Kuzey İrlanda'da reçeteler bu kategorilerden bağımsız olarak ücretsizdir. NHS diş tedavisi, işlem başına değil sabit bantlı oranlarla ücretlendirilir ve NHS göz muayeneleri, reçete ücretinden muaf olan aynı gruplar için ücretsizdir. Güncel ücretler ve muafiyet kriterleri <a href="https://www.nhs.uk/nhs-services/help-with-health-costs/" target="_blank" rel="noopener noreferrer">nhs.uk</a> üzerinde listelenmiştir.</p>

<h2>4. Doğru hizmeti seçmek</h2>
<ul>
<li><strong>Aile hekimliği kliniği</strong> — rutin ve devam eden sağlık sorunları, uzmana sevkler, tekrarlanan reçeteler.</li>
<li><strong>NHS 111</strong> (telefon veya çevrimiçi) — acil ancak hayati tehlike arz etmeyen durumlar, aile hekiminiz kapalıyken veya nereye başvuracağınızdan emin değilseniz.</li>
<li><strong>A&E (acil servis) veya 999</strong> — yalnızca acil durumlar: göğüs ağrısı, ciddi kanama, nefes almada zorluk, bilinç kaybı.</li>
<li><strong>Eczane</strong> — küçük rahatsızlıklar, tavsiye ve giderek genişleyen hizmet yelpazesi (bazı eczaneler artık belirli durumları aile hekimine gitmeden doğrudan tedavi edebilir).</li>
</ul>

<h2>5. NHS'nin yanında özel sağlık sigortası</h2>
<p>Birleşik Krallık'ta özel sağlık sigortası NHS'nin yerini almaz — genellikle daha hızlı uzman randevularına ve elektif (acil olmayan) işlemlere, özel hastane odalarına veya NHS tarafından rutin olarak finanse edilmeyen tedavilere erişmek için NHS ile birlikte kullanılır. Acil bakım, özel sigortadan bağımsız olarak her zaman NHS üzerinden yürütülür. Birçok işveren özel sağlık sigortasını bir yan hak olarak sunar; bireysel poliçeler de yaygın olarak mevcuttur. Bu dizin, yerel sağlayıcıların hangi <a href="/insurance">sigorta şirketlerini ve nakit planlarını</a> kabul ettiğini listeler, böylece randevu almadan önce uyumluluğu kontrol edebilirsiniz.</p>

<h2>6. Dil desteği</h2>
<p>Aile hekimliği klinikleri ve hastaneler dahil NHS randevularında ücretsiz olarak tercüman talep etme hakkınız vardır — kendi tercümanınızı getirmenize gerek yoktur, ancak birçok kişi mümkün olduğunda doğrudan Türkçe konuşan bir sağlayıcıyı görmeyi tercih eder. Bu dizin tam olarak bunu kolaylaştırmak için var: her kayıt, sağlayıcının konuştuğu dilleri belirtir.</p>

<h2>Yardım nereden alınır</h2>
<p>Durumunuza özel herhangi bir konu için en güvenilir kaynaklar <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">nhs.uk</a>, <a href="https://www.gov.uk/browse/healthcare" target="_blank" rel="noopener noreferrer">gov.uk</a> ve kendi aile hekimliği kliniğinizdir. Bu sayfa genel bir başlangıç noktasıdır, resmi rehberliğin yerini tutmaz ve kurallar değişebilir — önemli bir konuya güvenmeden önce her zaman doğrudan NHS veya gov.uk ile teyit edin.</p>
`.trim();

function buildTranslations(): TranslationDef[] {
  const translations: TranslationDef[] = [];

  for (const [itemId, [name, description]] of Object.entries(
    SPECIALITY_TRANSLATIONS,
  )) {
    translations.push({
      collection: "specialities",
      itemId,
      field: "name",
      language: LANGUAGE,
      value: name,
    });
    translations.push({
      collection: "specialities",
      itemId,
      field: "description",
      language: LANGUAGE,
      value: description,
    });
  }

  translations.push({
    collection: "pages",
    itemId: "page-nhs-benefits-guide",
    field: "title",
    language: LANGUAGE,
    value: NHS_PAGE_TITLE_TR,
  });
  translations.push({
    collection: "pages",
    itemId: "page-nhs-benefits-guide",
    field: "body",
    language: LANGUAGE,
    value: NHS_PAGE_BODY_TR,
  });

  return translations;
}

async function main() {
  const existing = await directus.request(
    readItems("translations", {
      limit: -1,
      fields: ["collection", "itemId", "field", "language"],
    }),
  );
  const existingKeys = new Set(
    existing.map(
      (t) => `${t.collection}:${t.itemId}:${t.field}:${t.language}`,
    ),
  );

  const translations = buildTranslations();
  let created = 0;
  let skipped = 0;

  for (const translation of translations) {
    const key = `${translation.collection}:${translation.itemId}:${translation.field}:${translation.language}`;
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    await directus.request(createItem("translations", translation));
    created++;
  }

  console.log(`+ created ${created} translation row(s)`);
  console.log(`= skipped ${skipped} already-existing row(s)`);
  console.log("Translation seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
