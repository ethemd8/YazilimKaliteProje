-- PostgreSQL veritabanlarını oluşturmak için SQL script
-- Bu dosyayı psql ile çalıştırabilirsiniz: psql -U postgres -f create-databases.sql

-- Ana veritabanı
CREATE DATABASE yazilim_kalite_db;

-- Test veritabanı
CREATE DATABASE yazilim_kalite_db_test;

-- Veritabanlarının oluşturulduğunu kontrol et
\l
