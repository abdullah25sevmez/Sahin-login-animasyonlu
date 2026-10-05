// Bekleme yardımcısı
const bekle = ms => new Promise(r => setTimeout(r, ms));

// Ses yardımcısı (sesler.js içindeki kayıtları çalar)
const sesler = {};
for (const ad in SESLER) {
  sesler[ad] = new Audio(SESLER[ad]);
  sesler[ad].preload = 'auto';
}
// iPhone/Safari, dokunuşla başlamayan sesleri engelleyebilir.
// İlk dokunuşta tüm sesleri bir kez sessizce başlatıp durdurarak "kilidi açıyoruz".
let sesKilidiAcik = false;
function sesKilidiniAc() {
  if (sesKilidiAcik) return;
  sesKilidiAcik = true;
  for (const ad in sesler) {
    const s = sesler[ad];
    s.muted = true;
    const p = s.play();
    const geri = () => { s.pause(); s.currentTime = 0; s.muted = false; };
    if (p && p.then) p.then(geri).catch(() => { s.muted = false; sesKilidiAcik = false; });
    else geri();
  }
}
['pointerdown', 'touchstart', 'keydown'].forEach(o =>
  document.addEventListener(o, sesKilidiniAc, { once: false, passive: true })
);

const SEVIYE = { tus1: .9, tus2: .9, tus3: .9, tikla: .6, adimlar: .6, kapi: .7, onay: .8 };
function cal(ad) {
  if (ad === 'tus') ad = 'tus' + (1 + Math.floor(Math.random() * 3)); // 3 tuş sesinden biri
  const s = sesler[ad];
  if (!s) return;
  s.volume = SEVIYE[ad] ?? 1;
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
  await bekle(300);

  // 1) Kapı açılır
  girisBtn.classList.add('acik');
  await bekle(800);

  // 2) Çöp adam kapıya yürür (adım sesleriyle)
  girisBtn.classList.add('yuruyor');
  cal('adimlar');
  await bekle(1250);

  // 3) Kapıdan içeri girip kaybolur
  girisBtn.classList.add('girdi');
  await bekle(450);

  // 4) Kapı kapanır, sesi çalar
  girisBtn.classList.remove('acik');
  await bekle(510);
  cal('kapi');
  await bekle(460);
  cal('onay'); // onay sesi
  girisBtn.classList.remove('yuruyor', 'girdi');
  girisBtn.classList.add('bitti');
  girisYazi.textContent = 'Hoş geldin ✓';
  baslik.textContent = 'Giriş yapıldı';
  altBaslik.textContent = 'Şahin seni tanıdı. Hoş geldin!';
  maskot.classList.add('basari');

  // Gerçek projede burada sunucu isteği ve yönlendirme olur
});
