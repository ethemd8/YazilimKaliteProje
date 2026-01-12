const { pool } = require('./db');

const seedData = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Örnek kategoriler
    const categoryResult = await client.query(`
      INSERT INTO categories (name, description) VALUES
      ('Elektronik', 'Elektronik ürünler'),
      ('Giyim', 'Giyim ve aksesuar'),
      ('Ev & Yaşam', 'Ev ve yaşam ürünleri'),
      ('Kitap', 'Kitap ve dergi'),
      ('Spor', 'Spor malzemeleri')
      ON CONFLICT (name) DO NOTHING
      RETURNING id
    `);

    // Örnek kullanıcılar
    await client.query(`
      INSERT INTO users (name, email, password, phone, address) VALUES
      ('Ahmet Yılmaz', 'ahmet@example.com', 'hashed_password_1', '555-0001', 'İstanbul, Türkiye'),
      ('Ayşe Demir', 'ayse@example.com', 'hashed_password_2', '555-0002', 'Ankara, Türkiye'),
      ('Mehmet Kaya', 'mehmet@example.com', 'hashed_password_3', '555-0003', 'İzmir, Türkiye')
      ON CONFLICT (email) DO NOTHING
    `);

    // Örnek ürünler
    await client.query(`
      INSERT INTO products (name, description, price, stock, category_id) VALUES
      ('Laptop', 'Yüksek performanslı laptop', 15000.00, 10, 1),
      ('Akıllı Telefon', 'Son model akıllı telefon', 12000.00, 25, 1),
      ('Tişört', 'Rahat pamuklu tişört', 150.00, 50, 2),
      ('Koltuk Takımı', 'Modern koltuk takımı', 5000.00, 5, 3),
      ('Roman Kitabı', 'Bestseller roman', 50.00, 100, 4),
      ('Futbol Topu', 'Profesyonel futbol topu', 200.00, 30, 5)
      ON CONFLICT DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('Örnek veriler başarıyla eklendi');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed hatası:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seed tamamlandı');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed başarısız:', error);
      process.exit(1);
    });
}

module.exports = { seedData };
