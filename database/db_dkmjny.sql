CREATE DATABASE IF NOT EXISTS db_dkmjny CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_dkmjny;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin','Ketua','Wakil','Bendahara','Sekretaris') NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS keuangan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  saldo_awal INT DEFAULT 0,
  pemasukan INT DEFAULT 0,
  pengeluaran INT DEFAULT 0,
  jenis_pengeluaran ENUM('Jasa','Belanja','Renovasi','Lainnya') NULL,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_keuangan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sarpras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  barang VARCHAR(255) NOT NULL,
  kondisi ENUM('Bagus','Rusak','Perlu Diperbaiki') NOT NULL,
  CONSTRAINT fk_sarpras_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jadwal_dkm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  imam VARCHAR(255) NOT NULL,
  kategori_imam ENUM('5 Waktu','Jum''atan','Idul Fitri','Idul Adha') NOT NULL,
  khatib VARCHAR(255) NULL,
  kategori_khatib ENUM('5 Waktu','Jum''atan','Idul Fitri','Idul Adha') NULL,
  muadzin VARCHAR(255) NULL,
  kategori_muadzin ENUM('5 Waktu','Jum''atan','Idul Fitri','Idul Adha') NULL,
  CONSTRAINT fk_jadwal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proker_dkm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  kegiatan_dkm VARCHAR(255) NOT NULL,
  waktu_kegiatan TIME NOT NULL,
  tanggal_kegiatan DATE NOT NULL,
  CONSTRAINT fk_proker_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS renovasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jenis_perbaikan VARCHAR(255) NOT NULL,
  tanggal_perbaikan DATE NOT NULL,
  progress INT DEFAULT 0,
  CONSTRAINT fk_renovasi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_progress CHECK (progress BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS backups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  db VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL,
  CONSTRAINT fk_backup_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@dkmjny.local', '$2b$12$replace_with_hash', 'Admin');
