# 🚀 StepCV | Professional AI-Integrated Resume Engineering Platform

**[🔗 Uygulamayı Canlı Yayında Deneyin (Live Demo)](https://cv-builder-pro-1eul.vercel.app/)**

StepCV, modern işe alım süreçlerindeki standartları karşılamak üzere geliştirilmiş, yüksek performanslı ve modüler bir özgeçmiş oluşturma motorudur. Uygulama, kullanıcı verilerini anlık işleme kapasitesi ve gelişmiş yapay zeka analizi ile rakiplerinden ayrışmaktadır.

## Teknik Mimari ve AI Entegrasyonu

Projenin kalbinde yer alan Google Gemini 1.5 Flash entegrasyonu, basit bir metin düzenleyicinin ötesinde bir "Mühendislik Danışmanı" gibi çalışır. 

- **Gelişmiş Semantik Analiz:** Kullanıcının girdiği ham veriler, @google/genai SDK'sı üzerinden Gemini modeline iletilerek sektör standartlarına uygun profesyonel anahtar kelimelerle yeniden yapılandırılır.
- **Gerçek Zamanlı Veri Analiti:** CV Skoru algoritması, veri bütünlüğünü ve bölüm doluluk oranlarını asenkron olarak takip ederek kullanıcıya anlık kalite geri bildirimi sağlar.
- **Bağlamsal Tavsiye Motoru:** AI katmanı, sadece metin düzeltmez; özgeçmişin eksik kalan teknik derinliğini analiz ederek kullanıcıya stratejik iyileştirme önerileri sunar.

## Temel Fonksiyonlar

- **Dinamik Önizleme Sistemi:** Masaüstü görünümlerde form ve A4 çıktı alanı eşzamanlı (synchronized) çalışarak kullanıcının nihai dokümanı anlık takip etmesini sağlar.
- **Veri Sıralama Mimarisi:** @hello-pangea/dnd kütüphanesi kullanılarak karmaşık dizi operasyonları kullanıcı dostu sürükle-bırak arayüzüne indirgenmiştir.
- **Tip Güvenli Altyapı:** Tüm uygulama TypeScript ile uçtan uca tiplendirilmiştir (Strict Type-Safety). VerbatimModuleSyntax kuralı ile derleme optimizasyonu sağlanmıştır.
- **Globalizasyon:** Uygulama çekirdeği 10 farklı dili (TR, EN, DE, FR, ES, IT, AR, RU, ZH, JP) ve bu dillere ait yerelleştirilmiş CV standartlarını destekler.
- **Client-Side PDF Rendering:** Doküman oluşturma işlemi tamamen istemci tarafında (browser) gerçekleşir; sunucu yükünü minimize eder ve veri gizliliğini maksimize eder.

## Teknoloji Stack

- **Core:** React 18 & Vite
- **Language:** TypeScript (Type-Safe Architecture)
- **Styling:** Tailwind CSS (Custom Layouts)
- **Icons:** Lucide React
- **Engine:** Google Generative AI (Gemini API)

## Kurulum Prosedürü

1. Repoyu yerel ortamınıza klonlayın:
   `git clone https://github.com/abuzerduzen/cv-builder-pro.git`

2. Bağımlılıkları yükleyin:
   `npm install`

3. `.env` dosyası içerisine geçerli bir `VITE_GEMINI_API_KEY` tanımlayın.

4. Geliştirme sunucusunu başlatın:
   `npm run dev`

---
Developed by Abuzer Düzen | 2026
