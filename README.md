# AssetTracker UI

AssetTrackerPro UI, varlık yönetimi için geliştirilmiş React tabanlı bir arayüzdür. Bu doküman, adım adım kurulum ve çalıştırma sürecini sorunsuz tamamlaması için hazırlanmıştır.

## Teknoloji Yığını

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state yönetimi)
- Axios (API istekleri)
- React Toastify (bildirimler)

## Gereksinimler

- Node.js 20+ (20.19+ önerilir)
- npm 10+
- Çalışan bir backend API (varsayılan: `http://localhost:5000`)

## 1) Projeyi Klonla

```bash
git clone https://github.com/Senaseser/assetTracker.git
cd assetTracker
```

## 2) Bağımlılıkları Yükle

```bash
npm install
```

## 3) Uygulamayı Çalıştır

```bash
npm run dev
```

Terminalde Vite tarafından verilen adrese giderek arayüze erişebilirsiniz.

## Backend Konfig

Frontend varsayılan olarak `http://localhost:5000` adresine istek atar.
Farklı bir API kullanıyorsanız `src/api/axios.ts` içindeki `baseURL` değerini güncelleyin.

## SQL Server (Opsiyonel)

Projede SQL Server için `docker-compose.yml` vardır. Çalıştırmak için:

```bash
docker compose up -d
```

## Kimlik Doğrulama (Basic Auth)

Uygulama Basic Auth kullanır ve oturumu 30 dakika boyunca saklar.
Sayfa yenilense bile süre dolmadıysa oturum korunur.

## Proje Yapısı (Özet)

- `src/components` -> UI bileşenleri
- `src/stores` -> Zustand store yapıları
- `src/api` -> Axios config ve interceptor
- `src/types.ts` -> Tip tanımları
