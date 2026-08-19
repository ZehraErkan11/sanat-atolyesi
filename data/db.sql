-- ============================================
-- SANAT ATÖLYESİ — MariaDB Veritabanı Modeli
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `sanat_atolyesi`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_turkish_ci;

USE `sanat_atolyesi`;

-- ─── Tablolar ───

DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `offers`;
DROP TABLE IF EXISTS `manga_lessons`;
DROP TABLE IF EXISTS `sketch_lessons`;
DROP TABLE IF EXISTS `faq`;
DROP TABLE IF EXISTS `artworks`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
    `id`        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `key_name`  VARCHAR(100) NOT NULL,
    `value`     TEXT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_key` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `users` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`       VARCHAR(100) NOT NULL,
    `email`      VARCHAR(150) NOT NULL,
    `password`   VARCHAR(255) NOT NULL,
    `role`       ENUM('admin','artist','user') NOT NULL DEFAULT 'user',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `artworks` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title`      VARCHAR(200) NOT NULL,
    `artist`     VARCHAR(100) NOT NULL,
    `price`      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `size`       VARCHAR(50) DEFAULT NULL,
    `canvas`     VARCHAR(50) DEFAULT NULL,
    `technique`  VARCHAR(100) DEFAULT NULL,
    `materials`  VARCHAR(200) DEFAULT NULL,
    `image`      TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `faq` (
    `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `question`   TEXT NOT NULL,
    `answer`     TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `sketch_lessons` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title`       VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `manga_lessons` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title`       VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `offers` (
    `id`          CHAR(36) NOT NULL,
    `artwork_id`  BIGINT UNSIGNED DEFAULT NULL,
    `user_id`     BIGINT UNSIGNED DEFAULT NULL,
    `amount`      DECIMAL(10,2) NOT NULL,
    `status`      ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
    `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_offers_artwork` (`artwork_id`),
    KEY `idx_offers_user` (`user_id`),
    CONSTRAINT `fk_offers_artwork` FOREIGN KEY (`artwork_id`) REFERENCES `artworks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_offers_user`    FOREIGN KEY (`user_id`)    REFERENCES `users` (`id`)    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE `messages` (
    `id`          CHAR(36) NOT NULL,
    `sender_id`   BIGINT UNSIGNED DEFAULT NULL,
    `receiver_id` BIGINT UNSIGNED DEFAULT NULL,
    `artwork_id`  BIGINT UNSIGNED DEFAULT NULL,
    `content`     TEXT NOT NULL,
    `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_messages_sender`   (`sender_id`),
    KEY `idx_messages_receiver` (`receiver_id`),
    KEY `idx_messages_artwork`  (`artwork_id`),
    CONSTRAINT `fk_messages_sender`   FOREIGN KEY (`sender_id`)   REFERENCES `users` (`id`)    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_messages_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_messages_artwork`  FOREIGN KEY (`artwork_id`)  REFERENCES `artworks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- ÖRNEK VERİLER
-- ============================================

-- Settings (4 satır)
INSERT INTO `settings` (`key_name`, `value`) VALUES
('siteName',     'Gogh'),
('heroTitle',    'Duvarınıza bir hikâye asın.'),
('heroSubtitle', 'Yeni yeteneklerden, özgün ve karakteri olan eserleri keşfedin.'),
('announcement', 'Özgün eserler, doğrudan sanatçısından.');

-- Users (10 satır)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Zehra Eren',    'zehra@atolye.com',   '$2b$10$hashedpassword01', 'admin'),
('Elif Yalçın',   'elif@atolye.com',    '$2b$10$hashedpassword02', 'artist'),
('Mert Kaya',     'mert@atolye.com',    '$2b$10$hashedpassword03', 'artist'),
('Ada Erdem',     'ada@atolye.com',     '$2b$10$hashedpassword04', 'artist'),
('Selin Arı',     'selin@atolye.com',   '$2b$10$hashedpassword05', 'artist'),
('Deniz Akın',    'deniz@atolye.com',   '$2b$10$hashedpassword06', 'artist'),
('Zeynep İnce',   'zeynep@atolye.com',  '$2b$10$hashedpassword07', 'artist'),
('Can Demir',     'can@atolye.com',     '$2b$10$hashedpassword08', 'user'),
('Ayşe Kılıç',   'ayse@atolye.com',    '$2b$10$hashedpassword09', 'user'),
('Burak Yıldız',  'burak@atolye.com',   '$2b$10$hashedpassword10', 'user');

-- Artworks (20 satır)
INSERT INTO `artworks` (`title`, `artist`, `price`, `size`, `canvas`, `technique`, `materials`, `image`) VALUES
('Sessiz Bahçe',        'Elif Yalçın',  12500.00, '70 × 100 cm',  'Tuval / Dikey', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85'),
('Toprağın Hafızası',   'Mert Kaya',     8900.00, '60 × 80 cm',   'Tuval / Dikey', 'Akrilik',        'Akrilik, spatula',          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85'),
('Kıyıdaki Ev',        'Ada Erdem',     6200.00, '50 × 50 cm',   'Tuval / Kare',  'Karışık teknik', 'Akrilik, pastel',           'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=85'),
('Yeşile Doğru',       'Selin Arı',    14700.00, '90 × 120 cm',  'Tuval / Yatay', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85'),
('Mavi Saat',           'Deniz Akın',    9800.00, '80 × 80 cm',   'Tuval / Kare',  'Akrilik',        'Akrilik, vernik',           'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85'),
('Yaban Çiçekleri',     'Zeynep İnce',   5300.00, '40 × 60 cm',   'Kağıt / Dikey', 'Suluboya',       'Pamuklu kağıt, suluboya',   'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=85'),
('Güneş Batarken',     'Elif Yalçın',  11200.00, '60 × 90 cm',   'Tuval / Yatay', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'),
('Anadolu Rüzgârı',    'Mert Kaya',     7600.00, '50 × 70 cm',   'Tuval / Dikey', 'Akrilik',        'Akrilik, boya kalemi',      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85'),
('Derin Mavi',          'Deniz Akın',   13400.00, '100 × 100 cm', 'Tuval / Kare',  'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=900&q=85'),
('Sabah Sisi',          'Ada Erdem',     4800.00, '30 × 40 cm',   'Kağıt / Yatay', 'Suluboya',       'Pamuklu kağıt, suluboya',   'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85'),
('Sonbahar Yaprakları', 'Zeynep İnce',   6700.00, '50 × 70 cm',   'Kağıt / Dikey', 'Suluboya',       'Pamuklu kağıt, suluboya',   'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=85'),
('Kayalıklar',          'Selin Arı',    16200.00, '100 × 140 cm', 'Tuval / Yatay', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85'),
('Portre #7',           'Elif Yalçın',   8200.00, '40 × 50 cm',   'Tuval / Dikey', 'Karışık teknik', 'Akrilik, kömür',            'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=900&q=85'),
('Gece Lambası',        'Mert Kaya',     5900.00, '35 × 45 cm',   'Tuval / Dikey', 'Akrilik',        'Akrilik, vernik',           'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=900&q=85'),
('Eski Sokak',          'Ada Erdem',     7100.00, '60 × 80 cm',   'Tuval / Dikey', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?auto=format&fit=crop&w=900&q=85'),
('Deniz Feneri',        'Deniz Akın',   10500.00, '70 × 90 cm',   'Tuval / Dikey', 'Akrilik',        'Akrilik, spatula',          'https://images.unsplash.com/photo-1501472312651-726afe119ff1?auto=format&fit=crop&w=900&q=85'),
('Kır Çiçekleri',       'Zeynep İnce',   4200.00, '25 × 35 cm',   'Kağıt / Yatay', 'Suluboya',       'Pamuklu kağıt, suluboya',   'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?auto=format&fit=crop&w=900&q=85'),
('Dağ Silüeti',         'Selin Arı',    11800.00, '80 × 120 cm',  'Tuval / Yatay', 'Yağlı boya',    'Keten tuval, yağlı boya',   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85'),
('Soyut Hareket',       'Elif Yalçın',  15300.00, '90 × 90 cm',   'Tuval / Kare',  'Karışık teknik', 'Akrilik, mürekkep, pastel', 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?auto=format&fit=crop&w=900&q=85'),
('Lavanta Tarlası',     'Mert Kaya',     9100.00, '60 × 90 cm',   'Tuval / Yatay', 'Akrilik',        'Akrilik, vernik',           'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=900&q=85');

-- FAQ (20 satır)
INSERT INTO `faq` (`question`, `answer`) VALUES
('Eser iade edilebilir mi?',                          'Eser teslim alındıktan sonra 7 gün içinde iade edilebilir.'),
('Taksitli ödeme var mı?',                            'Kredi kartına 3 veya 6 taksit seçenekleri mevcuttur.'),
('Eserlerin orijinalliği garanti altında mı?',        'Evet, her eser sanatçısı tarafından imzalanır ve orijinallik sertifikası ile gönderilir.'),
('Kargo ücreti ne kadar?',                            'Türkiye içi kargo ücretsizdir. Yurtdışı gönderimler için iletişime geçin.'),
('Eseri çerçeveli olarak alabilir miyim?',            'Evet, sipariş sırasında çerçeve seçeneklerini görebilirsiniz.'),
('Sanatçı olarak nasıl eser yükleyebilirim?',        'Üye olduktan sonra profil sayfanızdan "Yeni eser ekle" butonunu kullanabilirsiniz.'),
('Teklif verdikten sonra ne olur?',                   'Sanatçı teklifinizi değerlendirir ve 48 saat içinde yanıt verir.'),
('Sipariş ne zaman teslim edilir?',                   'Eserler genellikle 3-7 iş günü içinde kargoya verilir.'),
('Özel sipariş verebilir miyim?',                     'Evet, sanatçı ile doğrudan iletişime geçerek özel sipariş talep edebilirsiniz.'),
('Ödeme yöntemleri nelerdir?',                        'Kredi kartı, banka havalesi ve kapıda ödeme seçenekleri mevcuttur.'),
('Eser hasarlı gelirse ne yapmalıyım?',               'Teslimat sırasında hasar fark ederseniz 24 saat içinde bize ulaşın, ücretsiz değişim yapılır.'),
('Galeri ziyareti yapılabilir mi?',                   'Şu an yalnızca online satış yapılmaktadır. Fiziksel galeri açılışı planlanmaktadır.'),
('Eser boyutları tam olarak belirtildiği gibi mi?',   'Evet, tüm ölçüler ±1 cm tolerans ile belirtilmektedir.'),
('Hediye paketi seçeneği var mı?',                    'Evet, sipariş sırasında hediye paketi seçeneğini işaretleyebilirsiniz.'),
('Sanatçı komisyon oranı nedir?',                     'Platform, satış fiyatı üzerinden %15 komisyon almaktadır.'),
('Eserimi satıştan kaldırabilir miyim?',              'Evet, profilinizden istediğiniz zaman eseri yayından kaldırabilirsiniz.'),
('Fatura düzenleniyor mu?',                           'Evet, tüm satışlar için e-fatura düzenlenir ve e-posta ile gönderilir.'),
('Yurtdışına gönderim yapılıyor mu?',                 'Evet, AB ülkeleri ve ABD\'ye gönderim yapılmaktadır.'),
('Birden fazla esere teklif verebilir miyim?',        'Evet, aynı anda birden fazla esere teklif verebilirsiniz.'),
('Üyelik ücreti var mı?',                             'Hayır, üyelik tamamen ücretsizdir.');

-- Sketch Lessons (20 satır)
INSERT INTO `sketch_lessons` (`title`, `description`) VALUES
('Gözlemle',                'Konunuzu basit geometrik formlara ayırın. Nesnenin tamamını değil, oranlarını görmeye çalışın.'),
('Çizgiyi kur',             'Hafif bir HB kalemle ana hatları bastırmadan yerleştirin. Bu aşama hata yapma özgürlüğüdür.'),
('Işık ve gölge',           'Işığın geldiği yönü belirleyin. En koyu ve en açık noktaları karşılaştırarak tonları kurun.'),
('Dokuyu ekle',             'Tarama, çapraz tarama veya silgiyle açma yöntemleriyle yüzey hissini güçlendirin.'),
('Kontur çizimi',           'Kalemi kağıttan kaldırmadan nesnenin çevresini takip edin. Göz-el koordinasyonunu geliştirir.'),
('Ton skalası',             'HB\'den 6B\'ye kadar aynı kalemle açık-koyu geçişler oluşturun. Basıncı kontrol etmeyi öğrenin.'),
('Günlük nesne çizimi',     'Bir kupa, anahtar veya yaprak seçin. Önce oran, sonra gölge, en son doku ekleyin.'),
('Negatif boşluk',          'Nesnenin kendisini değil, çevresindeki boşlukları çizin. Perspektif algınızı geliştirir.'),
('Gesture çizim',           '30 saniye ile 2 dakika arasında hızlı insan figürü eskizleri yapın. Hareket hissini yakalayın.'),
('Perspektif temelleri',    'Tek kaçış noktalı perspektif ile basit bir sokak veya koridor çizin.'),
('İki noktalı perspektif',  'İki kaçış noktalı perspektif ile bina ve kutu formları oluşturun.'),
('Elleri çizmek',           'El anatomisini basit bloklara ayırın. Parmak oranlarına dikkat edin.'),
('Yüz oranları',            'Yüzü beş eşit yatay bölgeye ayırın. Göz, burun ve ağız yerleşimini öğrenin.'),
('Kumaş kıvrımları',        'Kumaşın düşüş yönünü ve gerginlik noktalarını gözlemleyin, kıvrımları çizin.'),
('Doğa eskizi',             'Dışarı çıkın, bir ağaç veya çiçek seçin. Detaydan önce genel formu yakalayın.'),
('Hayvan çizimi',           'Hayvan anatomisini basit geometrik şekillerle başlatın. Hareket ve duruşa odaklanın.'),
('Mimari eskiz',            'Binaların genel formunu ve süslemelerini hızlı çizgilerle yakalayın.'),
('Karışık ortam çalışması', 'Kalem ve mürekkebi bir arada kullanarak kontrast ve derinlik oluşturun.'),
('Portre çalışması',        'Bir fotoğraftan portre çizin. Işık-gölge geçişlerine ve ifadeye odaklanın.'),
('Serbest eskiz',           'Kafanızdaki bir sahneyi herhangi bir referans olmadan kağıda aktarın.');

-- Manga Lessons (20 satır)
INSERT INTO `manga_lessons` (`title`, `description`) VALUES
('Karakter tasarımı',        'Önce silüeti belirleyin: saç, duruş ve kıyafet karakteri uzaktan bile tanıtmalıdır.'),
('Yüz ifadeleri',            'Kaş, göz ve ağız arasındaki küçük farklar duyguyu taşır. Dört farklı duyguyla tekrar çizin.'),
('Panel akışı',              'Okurun gözünü soldan sağa, yukarıdan aşağıya yönlendirin. Geniş paneller zamanı yavaşlatır.'),
('Chibi karakter',           'Başı büyük, vücudu küçük oranlarla sevimli chibi karakterler oluşturun.'),
('Göz çizim teknikleri',     'Manga gözlerinde ışık yansıması, iris detayı ve ifade varyasyonlarını öğrenin.'),
('Saç çizimi',               'Saçı tek tek tel olarak değil, hacimli gruplar halinde çizin. Akış yönüne dikkat edin.'),
('Aksiyon sahneleri',        'Hareket çizgileri, dinamik açılar ve abartılı pozlarla enerji yaratın.'),
('Konuşma balonları',        'Balon şekli duyguyu yansıtır: yuvarlak=normal, sivri=bağırma, bulut=düşünce.'),
('Tonlama ve tarama',        'Screentone veya el taramasıyla derinlik ve atmosfer oluşturun.'),
('Arka plan tasarımı',       'Karakteri destekleyen ama boğmayan arka planlar tasarlayın.'),
('Kıyafet tasarımı',         'Karakterin kişiliğini yansıtan kıyafetler tasarlayın. Kıvrım ve hareket ekleyin.'),
('Duygu panelleri',          'Dramatik sahnelerde yakın çekim ve sessiz paneller kullanarak gerilim yaratın.'),
('Sayfa düzeni',             'Sayfadaki panel boyutlarını hikâyenin temposuna göre ayarlayın.'),
('Mürekkepleme',             'Kalem çizimini mürekkeple temizleyin. Çizgi kalınlığı ile derinlik yaratın.'),
('Dijital manga araçları',   'Clip Studio Paint ve Procreate gibi araçlarda manga fırçalarını keşfedin.'),
('Hikâye taslağı',           'Name (ネーム) oluşturun: kabataslak sayfa düzeniyle hikâye akışını planlayın.'),
('Karakter profili',         'Her karakter için geçmiş, motivasyon ve ilişki haritası oluşturun.'),
('Savaş koreografisi',       'Dövüş sahnelerinde panel geçişleri ve hareket akışını planlayın.'),
('Kapak tasarımı',           'Dikkat çekici bir kapak için kompozisyon, renk dengesi ve tipografiyi kullanın.'),
('Seri yönetimi',            'Uzun soluklu bir seri için bölüm planı, karakter gelişimi ve alt konuları yönetin.');

-- Offers (5 satır)
INSERT INTO `offers` (`id`, `artwork_id`, `user_id`, `amount`, `status`, `created_at`) VALUES
('a1b2c3d4-e5f6-7890-abcd-111111111111', 1,  8, 11000.00, 'pending',  '2026-08-15 10:30:00'),
('a1b2c3d4-e5f6-7890-abcd-222222222222', 4,  9, 13500.00, 'accepted', '2026-08-14 14:20:00'),
('a1b2c3d4-e5f6-7890-abcd-333333333333', 5, 10,  9000.00, 'pending',  '2026-08-16 09:15:00'),
('a1b2c3d4-e5f6-7890-abcd-444444444444', 2,  8,  8000.00, 'rejected', '2026-08-13 16:45:00'),
('a1b2c3d4-e5f6-7890-abcd-555555555555', 6,  9,  5000.00, 'accepted', '2026-08-12 11:00:00');

-- Messages (5 satır)
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `artwork_id`, `content`, `created_at`) VALUES
('m1m2m3m4-e5f6-7890-abcd-111111111111', 8, 2, 1, 'Merhaba, Sessiz Bahçe eseri hâlâ satışta mı?',          '2026-08-15 10:35:00'),
('m1m2m3m4-e5f6-7890-abcd-222222222222', 2, 8, 1, 'Evet, hâlâ mevcut. Detay için mesaj atabilirsiniz.',     '2026-08-15 11:00:00'),
('m1m2m3m4-e5f6-7890-abcd-333333333333', 9, 5, 4, 'Yeşile Doğru eserini çerçeveli gönderebilir misiniz?',  '2026-08-14 14:25:00'),
('m1m2m3m4-e5f6-7890-abcd-444444444444', 5, 9, 4, 'Elbette, çerçeve seçeneklerini size iletiyorum.',       '2026-08-14 15:10:00'),
('m1m2m3m4-e5f6-7890-abcd-555555555555', 10, 6, 5, 'Mavi Saat eserinin vernikli versiyonu var mı?',        '2026-08-16 09:20:00');
