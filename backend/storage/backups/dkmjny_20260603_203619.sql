-- Backup database: dkmjny
-- Created at: 2026-06-03 20:36:19

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `backups`;
CREATE TABLE `backups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `db` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `jadwal_dkm`;
CREATE TABLE `jadwal_dkm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `imam` varchar(255) NOT NULL,
  `kategori_imam` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `kategori_khatib` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `kategori_muadzin` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jadwal_user` (`user_id`),
  CONSTRAINT `fk_jadwal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `jadwal_dkm` (`id`, `user_id`, `imam`, `kategori_imam`, `khatib`, `kategori_khatib`, `muadzin`, `kategori_muadzin`) VALUES (1, 1, 'Dia', 'Jumatan', 'Dia', 'Jumatan', 'Dia', 'Jumatan');

DROP TABLE IF EXISTS `keuangan`;
CREATE TABLE `keuangan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pemasukan` int DEFAULT '0',
  `jenis_pemasukan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pengeluaran` int DEFAULT '0',
  `jenis_pengeluaran` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_keuangan_user` (`user_id`),
  CONSTRAINT `fk_keuangan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (6, 1, 100000, 'Amal', 0, '', '2026-06-03', '2026-06-03 19:53:09');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (7, 1, 0, '', 100000, 'Belanja', '2026-06-03', '2026-06-03 19:53:20');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (8, 1, 20000, 'Sedekah', 0, '', '2026-06-03', '2026-06-03 20:04:53');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (9, 1, 2000000, 'Infaq', 0, '', '2026-06-03', '2026-06-03 20:05:13');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (10, 1, 200000, 'Lainnya', 0, '', '2026-06-03', '2026-06-03 20:28:15');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `created_at`) VALUES (11, 1, 0, '', 1000000, 'Renovasi', '2026-06-03', '2026-06-03 20:28:52');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES (1, 1, 'Pawai Obor', '20:00:00', '2026-06-11');

DROP TABLE IF EXISTS `renovasi`;
CREATE TABLE `renovasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `jenis_perbaikan` varchar(255) NOT NULL,
  `tanggal_perbaikan` date NOT NULL,
  `progress` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_renovasi_user` (`user_id`),
  CONSTRAINT `fk_renovasi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_progress` CHECK ((`progress` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `renovasi` (`id`, `user_id`, `jenis_perbaikan`, `tanggal_perbaikan`, `progress`) VALUES (1, 1, 'Genteng', '2026-06-08', 90);

DROP TABLE IF EXISTS `sarpras`;
CREATE TABLE `sarpras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `barang` varchar(255) NOT NULL,
  `kondisi` enum('Bagus','Rusak','Perlu Diperbaiki') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sarpras_user` (`user_id`),
  CONSTRAINT `fk_sarpras_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `sarpras` (`id`, `user_id`, `barang`, `kondisi`) VALUES (1, 1, 'Meja', 'Bagus');
INSERT INTO `sarpras` (`id`, `user_id`, `barang`, `kondisi`) VALUES (3, 1, 'Bangku', 'Rusak');
INSERT INTO `sarpras` (`id`, `user_id`, `barang`, `kondisi`) VALUES (5, 1, 'Speaker', 'Perlu Diperbaiki');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (1, 'admin', 'admin@dkmjny.local', '$2b$12$replace_with_hash', 'Admin', '2026-06-02 23:44:01');

SET FOREIGN_KEY_CHECKS=1;
