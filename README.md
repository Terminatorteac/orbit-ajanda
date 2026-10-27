# Orbit · Kişisel Ajanda

Telefon, tablet ve bilgisayarda çalışan, sunucusuz kişisel ajanda. Siyah/antrasit ve neon sarı arayüz. Örnek veya kişisel görevler depoya gömülmez.

## Kullanım
GitHub Pages adresini Safari’de açın. Paylaş → Ana Ekrana Ekle ile ayrı bir uygulama görünümünde kullanın. İlk başarılı çevrimiçi açılıştan sonra arayüz çevrimdışı önbelleğe alınır.

- Metinle görev oluşturma, düzenleme, silme; tarih ve saat seçimi.
- Gecikmiş görevler, aciliyet ve son tarihe göre otomatik sıralama.
- Tamamlama/geçmiş/geri alma. Günlük veya haftalık görev tamamlandığında sonraki oluşumu ekleme; geçmişte kalan tekrarları ileri atlama.
- Gerçek Türkçe Web Speech API girişi. Tarayıcı/Siri desteği ve izinler gerekir. Destek yoksa klavyenin dikte mikrofonunu kullanın. Tarih ve tekrar alanları elle kontrol edilir; doğal dil tarih çözümleme yoktur.
- Gün seçimi, son 7 gün grafiği, 25 dakikalık odak sayacı, geniş panel.
- 15 dakika erteleme, uygulama açıkken hatırlatma, ICS Takvim aktarımı.
- JSON yedek indirme ve doğrulamalı geri yükleme.

## Veriler ve sınırlar
Görevler `localStorage` içinde yalnızca kullanılan cihaz/tarayıcıda tutulur. GitHub’a gönderilmez; cihazlar arası senkronizasyon veya hesap sistemi yoktur. Tarayıcı verileri silinirse görevler kaybolabilir: yedek alın. Ses tanıma Apple’ın veya tarayıcı sağlayıcısının hizmeti üzerinden işlenebilir. Uygulama ses dosyası tutmaz.

GitHub Pages adresi ve kaynak kodlar herkese açık olabilir. Siteyi ziyaret edenler kendi boş ajandalarını görür; sizin cihazınızdaki görevleri göremezler. Bu uygulama bir kimlik doğrulama veya şifreli kasa çözümü değildir.

Kapalı uygulamada zamanlanmış push bildirimi **yoktur**. GitHub Pages sunucu çalıştırmaz. Uygulama içi hatırlatmalar yalnızca sayfa açık/etkinken çalışır. ICS aktarımını Takvim’e içe aktarın; takvim bildirim izinlerini kontrol edin. ICS bir kopyadır, sonraki değişiklikler eşitlenmez. Tekrarlı olaylar Takvim’e RRULE ile aktarılır.

Gerçek iOS ana ekran widget’ı **yoktur**. Ana ekran simgesi uygulamayı açar. Geniş panel uygulama içinde kullanılır.

## GitHub Pages yayını
Bu klasördeki dosyaları deponun köküne yükleyin. Settings → Pages → Deploy from a branch → main → /(root) → Save. Yayın tamamlanınca GitHub’ın verdiği HTTPS adresini açın.

## Geliştirme ve doğrulama
Harici paket veya derleme gerektirmez. HTTPS ya da localhost üzerinden servis edin. Safari/iPhone üzerinde mikrofon, ana ekrana ekleme, dosya paylaşımı ve çevrimdışı kullanım gerçek cihazda doğrulanmalıdır. Her eski iOS sürümü için garanti verilmez; özellik algılama ve metin girişi geri dönüşü vardır.
