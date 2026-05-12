
# 1. GENERICS

## 📖 Deskripsi
Teknik Generics digunakan dengan TypeScript untuk membuat state management, props component, dan struktur data menjadi lebih type-safe dan reusable.

---

# 📂 Struktur Folder

```plaintext
frontend/
└── src/
    ├── context/
    │   └── AuthContext.tsx
    │
    ├── components/
    │   └── CompetitionCard.tsx
    │
    └── pages/
        ├── LoginPage.tsx
        └── RegisterPage.tsx
````

---

# 📌 File Implementasi

## 1. AuthContext.tsx

### Fungsi

* Authentication State
* User Session
* Login & Logout

### Implementasi Generics

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}
```

```tsx
const [user, setUser] = useState<User | null>(null);
```

### Penjelasan

TypeScript Generic digunakan pada `useState<User | null>` agar state user memiliki tipe data yang jelas dan aman.

---

## 2. CompetitionCard.tsx

### Fungsi

* Reusable Competition Component
* Menampilkan data kompetisi

### Implementasi Generics

```tsx
interface CompetitionCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  level: string;
  participants: number;
  image: string;
}
```

### Penjelasan

Props component menggunakan interface TypeScript agar data yang diterima component lebih terstruktur dan reusable.

---

## 3. LoginPage.tsx

### Fungsi

* Login Form
* Authentication Input

### Implementasi Generics

```tsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

### Penjelasan

Type-safe state digunakan untuk mengelola input login agar validasi data lebih aman.

---

## 4. RegisterPage.tsx

### Fungsi

* Register Form
* User Registration

### Implementasi Generics

```tsx
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```

### Penjelasan

State form menggunakan TypeScript agar data registrasi lebih konsisten dan mudah divalidasi.

---

# ✅ Manfaat Generics

* Mengurangi bug
* Membuat code lebih aman
* Mempermudah reusable component
* Mempermudah maintenance

---

# 2. API

## 📖 Deskripsi

Teknik API digunakan untuk menghubungkan frontend dengan backend dan database agar data kompetisi dapat diakses secara dinamis.

---

# 📂 Struktur Folder

```plaintext
frontend/
└── src/
    ├── context/
    │   └── AuthContext.tsx
    │
    ├── pages/
    │   └── ExplorePage.tsx
    │
    └── components/
        └── HeroCarousel.tsx
```

---

# 📌 File Implementasi

## 1. AuthContext.tsx

### Fungsi

* Login Session
* Authentication

### Implementasi API

```tsx
login(userData)
logout()
```

### Penjelasan

Authentication flow digunakan untuk mengatur session user setelah login.

---

## 2. ExplorePage.tsx

### Fungsi

* Menampilkan daftar kompetisi
* Filter kompetisi

### Implementasi API/Data Fetching

```tsx
competitions.filter((competition) => {
```

### Penjelasan

Data kompetisi diproses dan ditampilkan secara dinamis berdasarkan filter dan pencarian user.

---

## 3. HeroCarousel.tsx

### Fungsi

* Menampilkan featured competitions

### Implementasi API/Data

```tsx
featuredCompetitions.map((competition) => (
```

### Penjelasan

Data kompetisi digunakan untuk membuat carousel dinamis pada landing page.

---

# ✅ Manfaat API

* Data lebih dinamis
* Mudah integrasi frontend-backend
* Mendukung scalability
* Mempermudah pengelolaan data

---

# 📊 Kesimpulan

Teknik Generics dan API berhasil diterapkan pada project Telkom-In-Competition untuk meningkatkan keamanan tipe data, reusable component, serta integrasi data antara frontend dan backend sehingga aplikasi lebih modular dan scalable.

```
```
