// Global test setup - sadece entegrasyon ve E2E testleri için
// Birim testler mock kullandığı için bu setup'a ihtiyaç duymaz

if (process.env.NODE_ENV === 'test') {
  // Test timeout'u artır
  jest.setTimeout(30000);
}
