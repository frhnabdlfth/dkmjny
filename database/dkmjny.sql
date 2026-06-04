-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 04, 2026 at 10:08 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dkmjny`
--

-- --------------------------------------------------------

--
-- Table structure for table `backups`
--

CREATE TABLE `backups` (
  `id` int NOT NULL,
  `db` varchar(255) NOT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_dkm`
--

CREATE TABLE `jadwal_dkm` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `imam` varchar(255) NOT NULL,
  `kategori_imam` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `khatib` varchar(255) DEFAULT NULL,
  `kategori_khatib` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `muadzin` varchar(255) DEFAULT NULL,
  `kategori_muadzin` enum('5 Waktu','Jumatan','Idul Fitri','Idul Adha') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jadwal_dkm`
--

INSERT INTO `jadwal_dkm` (`id`, `user_id`, `imam`, `kategori_imam`, `khatib`, `kategori_khatib`, `muadzin`, `kategori_muadzin`) VALUES
(1, 1, 'Dia', '5 Waktu', 'Dia', '5 Waktu', 'Diaaa', '5 Waktu');

-- --------------------------------------------------------

--
-- Table structure for table `keuangan`
--

CREATE TABLE `keuangan` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `pemasukan` int DEFAULT '0',
  `jenis_pemasukan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pengeluaran` int DEFAULT '0',
  `jenis_pengeluaran` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tanggal` date NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `keuangan`
--

INSERT INTO `keuangan` (`id`, `user_id`, `pemasukan`, `jenis_pemasukan`, `pengeluaran`, `jenis_pengeluaran`, `tanggal`, `deskripsi`, `created_at`) VALUES
(12, 1, 10000000, 'Lainnya', 0, '', '2026-06-04', 'Uang DKM sebelumnya', '2026-06-04 07:51:33'),
(13, 1, 10000000, 'Infaq', 0, '', '2026-06-03', '', '2026-06-04 07:55:41'),
(14, 1, 0, '', 2500000, 'Renovasi', '2026-06-04', 'Renovasi Genteng', '2026-06-04 07:56:45'),
(15, 1, 0, '', 5000000, 'Renovasi', '2026-06-04', 'Renovasi Gudang', '2026-06-04 07:57:03');

-- --------------------------------------------------------

--
-- Table structure for table `proker_dkm`
--

CREATE TABLE `proker_dkm` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `kegiatan_dkm` varchar(255) NOT NULL,
  `waktu_kegiatan` time NOT NULL,
  `tanggal_kegiatan` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `proker_dkm`
--

INSERT INTO `proker_dkm` (`id`, `user_id`, `kegiatan_dkm`, `waktu_kegiatan`, `tanggal_kegiatan`) VALUES
(1, 1, 'Pawai Obor', '20:00:00', '2026-06-13');

-- --------------------------------------------------------

--
-- Table structure for table `renovasi`
--

CREATE TABLE `renovasi` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `jenis_perbaikan` varchar(255) NOT NULL,
  `tanggal_perbaikan` date NOT NULL,
  `progress` int DEFAULT '0'
) ;

--
-- Dumping data for table `renovasi`
--

INSERT INTO `renovasi` (`id`, `user_id`, `jenis_perbaikan`, `tanggal_perbaikan`, `progress`) VALUES
(1, 1, 'Genteng', '2026-06-08', 100),
(2, 1, 'Gudang', '2026-06-04', 10);

-- --------------------------------------------------------

--
-- Table structure for table `sarpras`
--

CREATE TABLE `sarpras` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `barang` varchar(255) NOT NULL,
  `kondisi` enum('Bagus','Rusak','Perlu Diperbaiki') NOT NULL,
  `foto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sarpras`
--

INSERT INTO `sarpras` (`id`, `user_id`, `barang`, `kondisi`, `foto`) VALUES
(9, 1, 'Bangku', 'Rusak', NULL),
(10, 1, 'Kertas', 'Bagus', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(25) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Ketua','Wakil','Bendahara','Sekretaris') NOT NULL DEFAULT 'Admin',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin@dkmjny.local', '$2b$12$replace_with_hash', 'Admin', '2026-06-02 16:44:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `backups`
--
ALTER TABLE `backups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jadwal_dkm`
--
ALTER TABLE `jadwal_dkm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_jadwal_user` (`user_id`);

--
-- Indexes for table `keuangan`
--
ALTER TABLE `keuangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_keuangan_user` (`user_id`);

--
-- Indexes for table `proker_dkm`
--
ALTER TABLE `proker_dkm`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proker_user` (`user_id`);

--
-- Indexes for table `renovasi`
--
ALTER TABLE `renovasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_renovasi_user` (`user_id`);

--
-- Indexes for table `sarpras`
--
ALTER TABLE `sarpras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sarpras_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `backups`
--
ALTER TABLE `backups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jadwal_dkm`
--
ALTER TABLE `jadwal_dkm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `keuangan`
--
ALTER TABLE `keuangan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `proker_dkm`
--
ALTER TABLE `proker_dkm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `renovasi`
--
ALTER TABLE `renovasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sarpras`
--
ALTER TABLE `sarpras`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jadwal_dkm`
--
ALTER TABLE `jadwal_dkm`
  ADD CONSTRAINT `fk_jadwal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `keuangan`
--
ALTER TABLE `keuangan`
  ADD CONSTRAINT `fk_keuangan_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `proker_dkm`
--
ALTER TABLE `proker_dkm`
  ADD CONSTRAINT `fk_proker_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `renovasi`
--
ALTER TABLE `renovasi`
  ADD CONSTRAINT `fk_renovasi_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sarpras`
--
ALTER TABLE `sarpras`
  ADD CONSTRAINT `fk_sarpras_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
