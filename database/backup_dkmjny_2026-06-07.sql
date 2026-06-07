-- Backup database: dkmjny
-- Created at: 2026-06-07 12:10:54

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `backups`;
CREATE TABLE `backups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `db` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_backups_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `jadwal_dkm`;
CREATE TABLE `jadwal_dkm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tanggal` date NOT NULL,
  `imam` varchar(255) NOT NULL,
  `kategori_imam` varchar(100) NOT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `kategori_khatib` varchar(100) DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `kategori_muadzin` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_jadwal_dkm_user_id` (`user_id`),
  KEY `ix_jadwal_dkm_id` (`id`),
  KEY `ix_jadwal_dkm_tanggal` (`tanggal`),
  CONSTRAINT `fk_jadwal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jadwal_dkm_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `jadwal_dkm` (`id`, `user_id`, `tanggal`, `imam`, `kategori_imam`, `khatib`, `kategori_khatib`, `muadzin`, `kategori_muadzin`) VALUES (3, 2, '2026-06-12', 'Dia', 'Jumatan', NULL, NULL, NULL, NULL);

DROP TABLE IF EXISTS `keuangan`;
CREATE TABLE `keuangan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pemasukan` int NOT NULL,
  `pengeluaran` int NOT NULL,
  `jenis_pengeluaran` varchar(50) DEFAULT NULL,
  `jenis_pemasukan` varchar(50) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_keuangan_tanggal` (`tanggal`),
  KEY `ix_keuangan_user_id` (`user_id`),
  KEY `ix_keuangan_deskripsi` (`deskripsi`),
  KEY `ix_keuangan_id` (`id`),
  CONSTRAINT `fk_keuangan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `keuangan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `jenis_pemasukan`, `tanggal`, `deskripsi`, `created_at`) VALUES (17, 2, 10000000, 0, '', 'Amal', '2026-06-05', 'Amal Jumat', '2026-06-06 17:39:21');
INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `jenis_pemasukan`, `tanggal`, `deskripsi`, `created_at`) VALUES (18, 2, 0, 1000000, 'Renovasi', '', '2026-06-08', 'Genteng', '2026-06-06 17:40:09');

DROP TABLE IF EXISTS `proker_dkm`;
CREATE TABLE `proker_dkm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `kegiatan_dkm` varchar(255) NOT NULL,
  `waktu_kegiatan` time NOT NULL,
  `tanggal_kegiatan` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_proker_dkm_id` (`id`),
  KEY `ix_proker_dkm_user_id` (`user_id`),
  KEY `ix_proker_dkm_tanggal_kegiatan` (`tanggal_kegiatan`),
  CONSTRAINT `fk_proker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `proker_dkm_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES (3, 2, 'Pawai Obor', '6:30:00', '2026-06-11');
INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES (4, 2, 'Maulid Nabi Muhammad SAW', '2:00:00', '2026-06-08');
INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES (5, 2, 'Makan Bersama', '22:00:00', '2026-06-08');

DROP TABLE IF EXISTS `renovasi`;
CREATE TABLE `renovasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `jenis_perbaikan` varchar(255) NOT NULL,
  `tanggal_perbaikan` date NOT NULL,
  `progress` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_renovasi_tanggal_perbaikan` (`tanggal_perbaikan`),
  KEY `ix_renovasi_user_id` (`user_id`),
  KEY `ix_renovasi_id` (`id`),
  CONSTRAINT `fk_renovasi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `renovasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `renovasi` (`id`, `user_id`, `jenis_perbaikan`, `tanggal_perbaikan`, `progress`) VALUES (5, 2, 'Genteng', '2026-06-08', 20);

DROP TABLE IF EXISTS `sarpras`;
CREATE TABLE `sarpras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `barang` varchar(255) NOT NULL,
  `kondisi` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_sarpras_id` (`id`),
  KEY `ix_sarpras_kondisi` (`kondisi`),
  KEY `ix_sarpras_user_id` (`user_id`),
  CONSTRAINT `fk_sarpras_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sarpras_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `sarpras` (`id`, `user_id`, `foto`, `barang`, `kondisi`) VALUES (14, 2, '74ea4d91ba6a49ee864fb45bb9872094.jpg', 'Bangku', 'Bagus');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Ketua','Wakil','Bendahara','Sekretaris') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  UNIQUE KEY `ix_users_username` (`username`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES (2, 'admin', 'admin@dkmjny.my.id', '$2b$12$jUCEC8NnjR6GvleaJTYLdOY5EngTQilDlqcBSuwtFbEyaCF2uuh/m', 'Admin', '2026-06-06 17:33:31');

SET FOREIGN_KEY_CHECKS=1;
