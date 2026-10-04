// Bekleme yardımcısı
const bekle = ms => new Promise(r => setTimeout(r, ms));

// Ses yardımcısı (sesler.js içindeki kayıtları çalar)
const sesler = {};
for (const ad in SESLER) {
  sesler[ad] = new Audio(SESLER[ad]);
  sesler[ad].preload = 'auto';
}
function cal(ad) {
  const s = sesler[ad];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {}); // tarayıcı engellerse sessizce geç
}

const maskot    = document.getElementById('maskot');
const kart      = document.getElementById('kart');
const kullanici = document.getElementById('kullanici');
const sifre     = document.getElementById('sifre');
const gozBtn    = document.getElementById('gozBtn');
const hata      = document.getElementById('hata');
const girisBtn  = document.getElementById('girisBtn');
const girisYazi = document.getElementById('girisYazi');
const baslik    = document.getElementById('baslik');
const altBaslik = document.getElementById('altBaslik');

let giriliyor = false;

// Her tuşa basışta tık sesi
kullanici.addEventListener('input', () => cal('tus'));
sifre.addEventListener('input', () => cal('tus'));

// Şifreye tıklayınca şahinin gözleri kapanır
sifre.addEventListener('focus', async () => {
  cal('odak');
  maskot.dataset.goz = 'yari';
  await bekle(170);
  maskot.dataset.goz = 'kapali';
});

// Şifreden çıkınca gözler açılır
sifre.addEventListener('blur', () => {
  maskot.dataset.goz = 'acik';
});

// Şifreyi göster / gizle
gozBtn.addEventListener('mousedown', e => e.preventDefault()); // odağı şifrede tut
gozBtn.addEventListener('click', () => {
  const gizli = sifre.type === 'password';
  sifre.type = gizli ? 'text' : 'password';
  gozBtn.classList.toggle('acik', gizli);
  gozBtn.setAttribute('aria-label', gizli ? 'Şifreyi gizle' : 'Şifreyi göster');
});

// Giriş
kart.addEventListener('submit', async e => {
  e.preventDefault();
  if (giriliyor) return;
  hata.textContent = '';

  if (!kullanici.value.trim() || !sifre.value) {
    hata.textContent = 'Kullanıcı adı ve şifreyi doldur.';
    kart.classList.remove('titre');
    void kart.offsetWidth; // animasyonu yeniden başlat
    kart.classList.add('titre');
    return;
  }

  giriliyor = true;
  girisBtn.disabled = true;
  sifre.blur();
  cal('tikla');

  // Çöp adam kapıya yürür (adım sesleriyle)
  await bekle(500);
  girisBtn.classList.add('yuruyor');
  cal('adimlar');
  await bekle(1500);

  // Kapı kapanır, ardından başarı sesi
  cal('kapi');
  girisBtn.classList.replace('yuruyor', 'bitti');
  await bekle(350);
  cal('basari');
  girisYazi.textContent = 'Hoş geldin ✓';
  baslik.textContent = 'Giriş yapıldı';
  altBaslik.textContent = 'Şahin seni tanıdı. Hoş geldin!';
  maskot.classList.add('basari');

  // Gerçek projede burada sunucu isteği ve yönlendirme olur
});
