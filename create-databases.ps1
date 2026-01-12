# PowerShell script - PostgreSQL veritabanlarını oluşturmak için
# Kullanım: .\create-databases.ps1

$env:PGPASSWORD = "1667"

Write-Host "Veritabanları oluşturuluyor..." -ForegroundColor Green

# Ana veritabanı
Write-Host "yazilim_kalite_db oluşturuluyor..." -ForegroundColor Yellow
psql -U postgres -h localhost -c "CREATE DATABASE yazilim_kalite_db;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ yazilim_kalite_db oluşturuldu" -ForegroundColor Green
} else {
    Write-Host "⚠ yazilim_kalite_db zaten mevcut olabilir" -ForegroundColor Yellow
}

# Test veritabanı
Write-Host "yazilim_kalite_db_test oluşturuluyor..." -ForegroundColor Yellow
psql -U postgres -h localhost -c "CREATE DATABASE yazilim_kalite_db_test;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ yazilim_kalite_db_test oluşturuldu" -ForegroundColor Green
} else {
    Write-Host "⚠ yazilim_kalite_db_test zaten mevcut olabilir" -ForegroundColor Yellow
}

Write-Host "`nVeritabanları hazır!" -ForegroundColor Green
