# ERG HI

Ini adalah sebuah website yang menggunakan algoritma [TF-IDF](https://id.wikipedia.org/wiki/Tf%E2%80%93idf) pada bagian pencarian.

## Installasi Aplikasi

### Backend

Dependencies yang diperlukan untuk menjalankan aplikasi backend adalah `python3` dan `postgreSQL`.

Pertama, masuk ke folder `backend`.

```bash
$ cd backend
```

#### Langkah 1 (Optional)

Buat python virtual environment

```bash
# windows
$ python -m venv venv

# linux
$ python3 -m venv venv
```

Aktifkan python virtual environment

```bash
# windows
$ .\venv\Scripts\activate.ps1 # powershell

# linux
$ source ./venv/bin/activate # bash
$ source ./venv/bin/activate.fish # fish
```

#### Langkah 2

Instal semua package dengan pip

```bash
$ pip install -r ./requirements.txt
```

#### Langkah 3

Buat file `.env`. Jalankan perintah berikut untuk meng-copy file `.env.example`:

```bash
$ cp .env.example .env
```

Lalu sesuaikan variabel `DB_URI` dengan credensial untuk konek ke PostgreSQL. Contoh:

```
DB_URI=postgresql://admin:admin@localhost:5432/erghi
```

Juga sesuai akan variabel `SECRET_KEY` dengan nilai random, semakin sulit semakin bagus karena variabel ini berguna untuk pembuatan jwt token.

#### Langkah 4

Jalankan aplikasi backend.

```bash
$ uvicorn app.main:app --reload
```

### Frontend

Dependencies yang diperlukan untuk menjalankan aplikasi frontend adalah `NodeJs`.

Pertama, masuk ke folder `frontend`.

```bash
$ cd frontend
```

#### Langkah 1

Install semua module.

```bash
$ npm i
# or
$ yarn
```

#### Langkah 2

Buat file `.env`. Jalankan perintah berikut untuk meng-copy file `.env.example`:

```bash
$ cp .env.example .env
```

Lalu sesuaikan variabel `VUE_API_URL` dengan host dan port pada aplikasi backend. Contoh `http://localhost:8000`

#### Langkah 3

Jalankan aplikasi secara developement dengan `yarn dev`, atau build aplikasi dengan `yarn build`.
