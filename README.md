# E-Ticaret REST API

Yazılım Kalite Güvencesi ve Test Projesi - E-Ticaret REST API

## 📋 Proje Açıklaması

Bu proje, Node.js ve PostgreSQL kullanılarak geliştirilmiş bir e-ticaret REST API'sidir. Proje, kapsamlı test kapsamı (%60+ code coverage), Swagger/OpenAPI dokümantasyonu ve CI/CD pipeline içermektedir.

## 🚀 Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js
- **Veritabanı**: PostgreSQL
- **Test Framework**: Jest, Supertest
- **API Dokümantasyonu**: Swagger/OpenAPI 3.0
- **CI/CD**: GitHub Actions
- **Code Coverage**: Codecov

## 📦 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL (v15 veya üzeri)
- npm veya yarn

### Adım Adım Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/ethemd8/YazilimKaliteProje.git
cd YazilimKaliteProje
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **PostgreSQL veritabanını oluşturun:**

**Windows PowerShell için:**
```powershell
# Yöntem 1: PowerShell script kullanın
.\create-databases.ps1

# Yöntem 2: psql ile SQL script çalıştırın
psql -U postgres -f create-databases.sql

# Yöntem 3: Manuel olarak psql ile
psql -U postgres
CREATE DATABASE yazilim_kalite_db;
CREATE DATABASE yazilim_kalite_db_test;
\q
```

**Linux/Mac için:**
```bash
createdb yazilim_kalite_db
createdb yazilim_kalite_db_test
```

4. **Environment değişkenlerini ayarlayın:**
`.env` dosyasını oluşturun ve aşağıdaki değerleri girin:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yazilim_kalite_db
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3000
NODE_ENV=development
```

**Not:** `DB_PASSWORD` değerini kendi PostgreSQL şifrenizle değiştirin.

5. **Veritabanı migration'ını çalıştırın:**
```bash
npm run migrate
```

6. **Örnek verileri yükleyin (opsiyonel):**
```bash
npm run seed
```

7. **Uygulamayı başlatın:**
```bash
# Development modu
npm run dev

# Production modu
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📚 API Dokümantasyonu

Swagger UI üzerinden API dokümantasyonuna erişebilirsiniz:

**URL**: http://localhost:3000/api-docs

API dokümantasyonu OpenAPI 3.0 standardına uygundur ve tüm endpoint'ler, parametreler, request/response şemaları içermektedir.

## 🔌 API Endpoint'leri

### Kullanıcılar (Users)
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Kullanıcı detayı
- `POST /api/users` - Yeni kullanıcı oluştur
- `PATCH /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil

### Kategoriler (Categories)
- `GET /api/categories` - Tüm kategorileri listele
- `GET /api/categories/:id` - Kategori detayı
- `POST /api/categories` - Yeni kategori oluştur
- `PATCH /api/categories/:id` - Kategori güncelle
- `DELETE /api/categories/:id` - Kategori sil

### Ürünler (Products)
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Ürün detayı
- `GET /api/products/category/:categoryId` - Kategoriye göre ürünleri listele
- `POST /api/products` - Yeni ürün oluştur
- `PATCH /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

### Siparişler (Orders)
- `GET /api/orders` - Tüm siparişleri listele
- `GET /api/orders/:id` - Sipariş detayı
- `GET /api/orders/user/:userId` - Kullanıcıya göre siparişleri listele
- `POST /api/orders` - Yeni sipariş oluştur
- `PATCH /api/orders/:id` - Sipariş güncelle
- `DELETE /api/orders/:id` - Sipariş sil

### Yorumlar (Reviews)
- `GET /api/reviews` - Tüm yorumları listele
- `GET /api/reviews/:id` - Yorum detayı
- `GET /api/reviews/product/:productId` - Ürüne göre yorumları listele
- `POST /api/reviews` - Yeni yorum oluştur
- `PATCH /api/reviews/:id` - Yorum güncelle
- `DELETE /api/reviews/:id` - Yorum sil

## 🧪 Testler

### Test Komutları

```bash
# Tüm testleri çalıştır (coverage ile)
npm test

# Sadece birim testleri
npm run test:unit

# Sadece entegrasyon testleri
npm run test:integration

# Sadece E2E testleri
npm run test:e2e

# Watch modu
npm run test:watch
```

### Test Kapsamı

- **Birim Testler**: 13 test dosyası, ~102 test case
  - **Controllers** (5 dosya, 58 test):
    - `userController.test.js`: 10 test
    - `productController.test.js`: 12 test
    - `orderController.test.js`: 14 test
    - `categoryController.test.js`: 10 test
    - `reviewController.test.js`: 12 test
  - **Services** (5 dosya, 34 test):
    - `userService.test.js`: 6 test
    - `productService.test.js`: 9 test
    - `orderService.test.js`: 7 test
    - `categoryService.test.js`: 9 test
    - `reviewService.test.js`: 3 test
  - **Models** (2 dosya, 8 test):
    - `User.test.js`: 4 test
    - `Product.test.js`: 4 test
  - **Utils** (1 dosya, 2 test):
    - `validators.test.js`: 2 test

- **Entegrasyon Testleri**: 5 test dosyası, 10 test case
  - `users.test.js`: 3 test (POST, GET by ID, PATCH)
  - `products.test.js`: 2 test (POST, GET by ID)
  - `orders.test.js`: 2 test (POST, GET by ID with items)
  - `reviews.test.js`: 1 test (POST)
  - `categories.test.js`: 2 test (POST, GET all)
  - API endpoint'leri (GET, POST, PATCH, DELETE)
  - Veritabanı işlemleri
  - İlişkili kaynaklar arası işlemler
  - Hata durumları (404, 400, 500)

- **E2E/Sistem Testleri**: 1 test dosyası, 5 kompleks senaryo
  - Kullanıcı kaydı → Ürün ekleme → Sipariş oluşturma
  - Ürün yaşam döngüsü (create → update → delete)
  - Yorum ve değerlendirme akışı
  - Çoklu ürünlü sipariş senaryosu
  - Hata yönetimi senaryoları

**Toplam**: 19 test dosyası, ~117 test case

### Test İzolasyonu

Tüm entegrasyon ve E2E testleri, her test öncesinde veritabanı transaction'ları (`BEGIN`, `COMMIT`, `ROLLBACK`) kullanarak izole edilmiştir. Bu sayede:
- Testler birbirini etkilemez
- Her test temiz bir veritabanı durumuyla başlar
- Test verileri otomatik olarak temizlenir
- Test sırası önemli değildir

### Code Coverage

Proje **%60+ code coverage** hedeflemektedir ve bu hedefi aşmıştır. Coverage raporu test çalıştırıldıktan sonra `coverage/` klasöründe oluşturulur.

**Coverage Hedefleri:**
- Statements: %60+ (Mevcut: **80.85%**)
- Branches: %45+ (Mevcut: **67.89%**)
- Functions: %60+ (Mevcut: **75.75%**)
- Lines: %60+ (Mevcut: **81%**)

Coverage raporunu görüntülemek için:
```bash
npm test
# Sonra coverage/lcov-report/index.html dosyasını tarayıcıda açın
```

## 🔄 CI/CD

Proje GitHub Actions ile CI/CD pipeline'ı içermektedir. Pipeline 4 ayrı job'dan oluşur:

1. **unit-tests**: Birim testlerini çalıştırır (PostgreSQL gerektirmez)
2. **integration-tests**: Entegrasyon testlerini çalıştırır (PostgreSQL servisi ile)
3. **e2e-tests**: E2E testlerini çalıştırır (PostgreSQL servisi ile)
4. **coverage**: Tüm testleri coverage ile çalıştırır ve Codecov'a yükler

**Özellikler:**
- Her push ve pull request'te otomatik test çalıştırma
- Code coverage raporlama (Codecov entegrasyonu)
- Test sonuçlarının action loglarında görüntülenmesi
- Job'lar arası bağımlılık yönetimi (`needs` kullanımı)
- Hata toleransı (`continue-on-error` ile)

### CI/CD Badge'leri

[![CI/CD Pipeline](https://github.com/ethemd8/YazilimKaliteProje/actions/workflows/ci.yml/badge.svg)](https://github.com/ethemd8/YazilimKaliteProje/actions/workflows/ci.yml)

[![codecov](https://codecov.io/gh/ethemd8/YazilimKaliteProje/branch/main/graph/badge.svg)](https://codecov.io/gh/ethemd8/YazilimKaliteProje)

## 📊 Veritabanı Şeması

### Tablolar

- **users**: Kullanıcı bilgileri
- **categories**: Ürün kategorileri
- **products**: Ürün bilgileri
- **orders**: Siparişler
- **order_items**: Sipariş kalemleri
- **reviews**: Ürün yorumları ve değerlendirmeleri

### İlişkiler

- User → Order (1:N)
- Product → OrderItem (1:N)
- Category → Product (1:N)
- User → Review (1:N)
- Product → Review (1:N)

## 📝 Örnek Kullanım

### Kullanıcı Oluşturma
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "password": "password123",
    "phone": "555-0001",
    "address": "İstanbul, Türkiye"
  }'
```

### Ürün Oluşturma
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 15000,
    "stock": 10,
    "category_id": 1
  }'
```

### Sipariş Oluşturma
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "items": [
      {"product_id": 1, "quantity": 2}
    ],
    "shipping_address": "İstanbul, Türkiye"
  }'
```

## 🏗️ Proje Yapısı

```
YazilimKaliteProje/
├── src/
│   ├── config/          # Konfigürasyon dosyaları (Swagger)
│   ├── controllers/     # Controller katmanı
│   ├── database/        # Veritabanı bağlantısı ve migration
│   ├── models/          # Veritabanı modelleri
│   ├── routes/          # API route'ları
│   ├── services/        # İş mantığı servisleri
│   ├── utils/           # Yardımcı fonksiyonlar
│   └── app.js           # Ana uygulama dosyası
├── tests/
│   ├── unit/            # Birim testler (13 dosya, ~102 test)
│   ├── integration/     # Entegrasyon testleri (5 dosya, 10 test)
│   └── e2e/             # E2E testleri (1 dosya, 5 test)
├── .github/
│   └── workflows/       # GitHub Actions workflow'ları
├── coverage/            # Test coverage raporları
├── package.json
├── codecov.yml          # Codecov konfigürasyonu
└── README.md
```

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👤 Yazar

**Ethem Demir**  
Öğrenci Numarası: 4010930268

## 🔗 Bağlantılar

- **Swagger UI**: http://localhost:3000/api-docs
- **GitHub Repository**: https://github.com/ethemd8/YazilimKaliteProje
