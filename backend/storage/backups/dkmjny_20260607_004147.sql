-- Backup database: dkmjny
-- Created at: 2026-06-07 00:41:47

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `backups`;
CREATE TABLE `backups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `db` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `jadwal_dkm`;
CREATE TABLE `jadwal_dkm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `imam` varchar(255) NOT NULL,
  `kategori_imam` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `kategori_khatib` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `kategori_muadzin` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jadwal_user` (`user_id`),
  CONSTRAINT `fk_jadwal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `jadwal_dkm` (`id`, `user_id`, `tanggal`, `imam`, `kategori_imam`, `khatib`, `kategori_khatib`, `muadzin`, `kategori_muadzin`) VALUES (3, 2, '2026-06-12', 'Dia', 'Jumatan', 'Dia 2', 'Jumatan', 'Dia lagi', 'Jumatan');

DROP TABLE IF EXISTS `keuangan`;
CREATE TABLE `keuangan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pemasukan` int DEFAULT '0',
  `jenis_pemasukan` varchar(50) DEFAULT NULL,
  `pengeluaran` int DEFAULT '0',
  `jenis_pengeluaran` varchar(50) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_keuangan_user` (`user_id`),
  CONSTRAINT `fk_keuangan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `deskripsi`, `created_at`) VALUES (17, 2, 10000000, 'Amal', 0, '', '2026-06-05', 'Amal Jumat', '2026-06-07 00:39:21');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `deskripsi`, `created_at`) VALUES (18, 2, 0, '', 1000000, 'Renovasi', '2026-06-08', 'Genteng', '2026-06-07 00:40:09');

DROP TABLE IF EXISTS `proker_dkm`;
CREATE TABLE `proker_dkm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `kegiatan_dkm` varchar(255) NOT NULL,
  `waktu_kegiatan` time NOT NULL,
  `tanggal_kegiatan` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_proker_user` (`user_id`),
  CONSTRAINT `fk_proker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES (3, 2, 'Pawai Obor', '9:42:00', '2026-06-08');

DROP TABLE IF EXISTS `renovasi`;
CREATE TABLE `renovasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `jenis_perbaikan` varchar(255) NOT NULL,
  `tanggal_perbaikan` date NOT NULL,
  `progress` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_renovasi_user` (`user_id`),
  CONSTRAINT `fk_renovasi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `renovasi` (`id`, `user_id`, `jenis_perbaikan`, `tanggal_perbaikan`, `progress`) VALUES (5, 2, 'Genteng', '2026-06-08', 10);

DROP TABLE IF EXISTS `sarpras`;
CREATE TABLE `sarpras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `barang` varchar(255) NOT NULL,
  `kondisi` enum('Bagus','Rusak','Perlu Diperbaiki') NOT NULL,
  `foto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sarpras_user` (`user_id`),
  CONSTRAINT `fk_sarpras_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `sarpras` (`id`, `user_id`, `barang`, `kondisi`, `foto`) VALUES (13, 2, 'Speaker', 'Perlu Diperbaiki', '279b0250720c49dc9b98b98774ee2788.jpg');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Ketua','Wakil','Bendahara','Sekretaris') NOT NULL DEFAULT 'Admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (2, 'admin', 'admin@dkmjny.local', '$2b$12$PqRCA0Cket4LJReS2hoJh.EBswAr5p.VTn7CgsXLrCSpmWTWZUkpq', 'Admin', '2026-06-07 00:33:31');

SET FOREIGN_KEY_CHECKS=1;
