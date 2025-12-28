# AssetTracker UI

AssetTrackerPro UI, varlik yonetimi icin gelistirilmis React tabanli bir arayuzdur. Bu dokuman, adim adim kurulum ve calistirma surecini sorunsuz tamamlamasi icin hazirlanmistir.

## Teknoloji Yigini

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state yonetimi)
- Axios (API istekleri)
- React Toastify (bildirimler)

## Gereksinimler

- Node.js 20+ (20.19+ onerilir)
- npm 10+
- Calisan bir backend API (varsayilan: `http://localhost:5000`)

## 1) Projeyi Klonla

```bash
git clone https://github.com/Senaseser/assetTracker.git
cd assetTracker
```

## 2) Bagimliliklari Yukle

```bash
npm install
```

## 3) Uygulamayi Calistir

```bash
npm run dev
```

Terminalde Vite tarafindan verilen adrese giderek arayuze erisebilirsiniz.

## Backend Konfig

Frontend varsayilan olarak `http://localhost:5000` adresine istek atar.
Farkli bir API kullaniyorsaniz `src/api/axios.ts` icindeki `baseURL` degerini guncelleyin.

## SQL Server (Opsiyonel)

Projede SQL Server icin `docker-compose.yml` vardir. Calistirmak icin:

```bash
docker compose up -d
```

## Kimlik Dogrulama (Basic Auth)

Uygulama Basic Auth kullanir ve oturumu 30 dakika boyunca saklar.
Sayfa yenilense bile sure dolmadiysa oturum korunur.

## Proje Yapisi (Ozet)

- `src/components` -> UI bilesenleri
- `src/stores` -> Zustand store yapilari
- `src/api` -> Axios config ve interceptor
- `src/types.ts` -> Tip tanimlari
# assetTracker
