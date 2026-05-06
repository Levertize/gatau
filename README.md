# 🌌 ZENSPACE — Your Ultimate Atmospheric Sanctuary

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

### 🚀 [Live Demo — Experience ZENSPACE Now] ([https://zenspace-xi.vercel.app/])

[**English**](#english) | [**Bahasa Indonesia**](#bahasa-indonesia)

---

<a name="english"></a>
## 🌍 English

### 🌟 Introduction & Philosophy
In an era of constant digital noise and notification fatigue, **ZENSPACE** was born from a simple need: **The need for a digital sanctuary.** 

ZENSPACE is not just a lofi player; it is a boutique, highly customizable atmospheric environment designed to help you reclaim your focus. Whether you are a developer deep in a flow state, a student tackling a complex subject, or someone seeking a moment of peace, ZENSPACE stays out of your way while keeping you grounded.

---

### ✨ Deep-Dive Features

#### 🎵 The Audio Engine
Powered by the native **Web Audio API**, ZENSPACE features a professional-grade audio stack:
- **YouTube Integration**: Stream your favorite curated lofi stations or any custom YouTube link via our "Soundtrack Hub".
- **Local Audio Support**: Prefer your own library? Upload MP3s directly to your local browser session.
- **Dynamic Visualizer**: A custom-built frequency analyzer that transforms audio data into rhythmic pulsing bars, providing a subtle visual anchor.

#### 🍃 The Ambient Mixer
Layer your environment with our 5-track nature mixer. Each track is high-definition and loop-ready:
- **🌧️ Rain**: Soft, consistent rainfall for cozy vibes.
- **💨 Wind**: Howling winds for a sense of isolation.
- **🌙 Night**: Cricket chirps and the stillness of the countryside.
- **🌊 Waves**: The rhythmic coming and going of the ocean.
- **🌲 Forest**: The subtle life of a deep woodland.
*All tracks feature independent volume sliders and a master ambient control.*

#### 🖼️ Canvas & Particle System
Your visual vibe is just as important as your sound:
- **Custom Wallpapers**: Choose from boutique presets, paste a remote URL (Unsplash, Pinterest), or upload a local image.
- **Particle Dynamics**: A procedural particle system offering **Dust, Sakura, Rain, and Fireflies**. These aren't static; they react to the music and mouse movement.

#### 🧘 Zen UI & Idle Mode
We believe the UI should vanish when not needed:
- **Boutique Glass UI**: A professional aesthetic inspired by modern glassmorphism.
- **Total Clean Idle Mode**: After 8 seconds of inactivity, all UI elements (navbars, links, footers) fade to zero opacity. Only the branding and the visualizer remain, turning your screen into a living piece of art.

---

### 🛠️ Technical Architecture
ZENSPACE is built with a modern, performance-first stack:
- **React 18**: Utilizing functional components and advanced hooks (`useRef`, `useEffect`) for state and audio management.
- **TypeScript**: Ensuring type safety across audio nodes and component props.
- **Tailwind CSS 4.0**: Leveraging the latest CSS-in-JS capabilities for high-performance glassmorphism and animations.
- **Vite**: For near-instant development starts and optimized production builds.

---

### 📂 Project Structure
```text
zenspace/
├── public/              # Static assets (icons, favicon)
├── src/
│   ├── assets/          # Local background images & sound clips
│   ├── components/      # Modular UI components (AudioPlayer, NatureMixer, etc.)
│   ├── types/           # Global TypeScript definitions
│   ├── App.tsx          # Main application orchestration & Idle Mode logic
│   ├── index.css        # Global styles & custom glassmorphism classes
│   └── main.tsx         # Entry point
```

---

### 🚀 Getting Started
**Prerequisites**: Node.js 18+ and npm.

1. **Clone & Enter**:
   ```bash
   git clone https://github.com/Levertize/zenspace.git
   cd zenspace
   ```
2. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

---

<a name="bahasa-indonesia"></a>
## 🇮🇩 Bahasa Indonesia

### 🌟 Pendahuluan & Filosofi
Di era kebisingan digital yang konstan dan kelelahan notifikasi, **ZENSPACE** lahir dari kebutuhan sederhana: **Kebutuhan akan tempat suci digital.**

ZENSPACE bukan sekadar pemutar lofi; ini adalah lingkungan atmosferik butik yang sangat dapat dikustomisasi, dirancang untuk membantu Anda memulihkan fokus. Baik Anda seorang pengembang dalam *flow state*, pelajar yang sedang berjuang, atau seseorang yang mencari kedamaian, ZENSPACE tidak akan mengganggu fokus Anda sambil menjaga Anda tetap tenang.

---

### ✨ Fitur Utama

#### 🎵 Audio Engine
Ditenagai oleh **Web Audio API**, ZENSPACE menghadirkan tumpukan audio kelas profesional:
- **Integrasi YouTube**: Putar stasiun radio lofi pilihan atau link YouTube apa pun.
- **Dukungan Audio Lokal**: Unggah file MP3 langsung ke sesi browser lokal Anda.
- **Visualizer Dinamis**: Analyzer frekuensi kustom yang mengubah data audio menjadi denyut visual yang ritmis.

#### 🍃 Ambient Mixer
Bangun atmosfer Anda dengan 5 track suara alam berkualitas tinggi:
- **Hujan, Angin, Malam, Ombak, dan Hutan**.
*Setiap track memiliki slider volume independen dan kontrol volume master.*

#### 🖼️ Canvas & Sistem Partikel
Estetika visual Anda sama pentingnya dengan suara:
- **Wallpaper Kustom**: Pilih dari preset butik, tempel URL gambar, atau unggah gambar lokal.
- **Dinamika Partikel**: Sistem partikel prosedural seperti **Debu, Sakura, Hujan, dan Kunang-kunang** yang bereaksi terhadap musik.

#### 🧘 Zen UI & Idle Mode
Kami percaya antarmuka harus menghilang saat tidak diperlukan:
- **Boutique Glass UI**: Estetika profesional yang terinspirasi oleh tren *glassmorphism* modern.
- **Total Clean Idle Mode**: Setelah 8 detik tanpa aktivitas, semua elemen UI menghilang total. Hanya judul dan visualizer yang tersisa, mengubah layar Anda menjadi karya seni yang hidup.

---

### 🛠️ Arsitektur Teknis
- **React 18 + TypeScript**: Untuk manajemen state dan keamanan tipe data.
- **Tailwind CSS 4.0**: Untuk estetika kaca dan animasi berperforma tinggi.
- **Vite**: Untuk pengembangan yang instan dan build yang teroptimasi.

---

### 🗺️ Roadmap Masa Depan
Kami terus berupaya mengembangkan ZENSPACE. Berikut adalah rencana kami:
- [ ] **Integrasi Spotify**: Hubungkan akun premium Anda untuk streaming langsung di dalam ZENSPACE.
- [ ] **Pomodoro Timer**: Timer minimalis untuk membantu sesi produktivitas Anda.
- [ ] **Simpan Preset**: Simpan kombinasi wallpaper, suara, dan efek partikel favorit Anda.
- [ ] **Optimasi Mobile**: Meningkatkan pengalaman untuk tablet dan perangkat seluler.
- [ ] **Editor Partikel Kustom**: Izinkan pengguna mengubah kecepatan, jumlah, dan warna efek secara langsung.

---

### 🤝 Kontribusi
Kami sangat terbuka untuk kontribusi!
1. **Fork** proyek ini.
2. **Buat Branch Fitur** (`git checkout -b feature/FiturKeren`).
3. **Commit perubahan** (`git commit -m 'Menambahkan FiturKeren'`).
4. **Buka Pull Request**.

---

### 📜 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

### ☕ Dukungan
Dibuat dengan ❤️ oleh [iqbal/levertize](https://github.com/Levertize)
(https://github.com/Levertize)
