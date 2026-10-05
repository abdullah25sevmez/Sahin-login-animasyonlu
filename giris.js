// ---------------------------------------------------------------
// Şahin giriş ekranı
// ---------------------------------------------------------------

// Bekleme yardımcısı
const bekle = ms => new Promise(r => setTimeout(r, ms));

// ---------- Sesler (kayıtlar sesler.js içinde) ----------
const sesler = {};
for (const ad in SESLER) {
  sesler[ad] = new Audio(SESLER[ad]);
  sesler[ad].preload = 'auto';
}
const SEVIYE = { tus: .9, odak: .8, tikla: .7, adimlar: .7, kapi: .8, onay: .8 };
const TUS_SESLERI = ['tus1', 'tus2', 'tus3', 'tus4', 'tus5'];

function cal(ad) {
  let anahtar = ad;
  if (ad === 'tus') anahtar = TUS_SESLERI[Math.floor(Math.random() * TUS_SESLERI.length)];
  const s = sesler[anahtar];
  if (!s) return;
  s.volume = SEVIYE[ad] ?? 1;
  s.currentTime = 0;
  s.play().catch(() => {}); // tarayıcı engellerse sessizce geç
}

// iPhone/Safari, dokunuşla başlamayan sesleri engelleyebilir.
// İlk dokunuşta tüm sesleri sessizce başlatıp durdurarak kilidi açıyoruz.
let sesKilidiAcik = false;
function sesKilidiniAc() {
  if (sesKilidiAcik) return;
  sesKilidiAcik = true;
  for (const ad in sesler) {
    const s = sesler[ad];
    s.muted = true;
    const geri = () => { s.pause(); s.currentTime = 0; s.muted = false; };
    const p = s.play();
    if (p && p.then) p.then(geri).catch(() => { s.muted = false; sesKilidiAcik = false; });
    else geri();
  }
}
['pointerdown', 'touchstart', 'keydown'].forEach(o =>
  document.addEventListener(o, sesKilidiniAc, { passive: true })
);

// ---------- Elemanlar ----------
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

// ---------- Tuş sesleri ----------
kullanici.addEventListener('input', () => cal('tus'));
sifre.addEventListener('input', () => cal('tus'));

// ---------- Şahinin gözleri ----------
// Şifreye tıklayınca gözler kapanır (odak sesiyle)
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

// ---------- Şifreyi göster / gizle ----------
gozBtn.addEventListener('mousedown', e => e.preventDefault()); // odağı şifrede tut
gozBtn.addEventListener('click', () => {
  const gizli = sifre.type === 'password';
  sifre.type = gizli ? 'text' : 'password';
  gozBtn.classList.toggle('acik', gizli);
  gozBtn.setAttribute('aria-label', gizli ? 'Şifreyi gizle' : 'Şifreyi göster');
});

// ---------- Giriş ----------
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

  // Tüm sıra, tıklama anından itibaren milisaniye olarak planlandı
  // (zamanlar referans videodan ölçüldü)
  const t0 = performance.now();
  const an = ms => bekle(Math.max(0, ms - (performance.now() - t0)));

  cal('tikla');

  await an(300);                      // kapı açılmaya başlar
  girisBtn.classList.add('acik');

  await an(1106);                     // adım sesleri
  cal('adimlar');

  await an(1150);                     // çöp adam kapıya yürür
  girisBtn.classList.add('yuruyor');

  await an(1920);                     // kapıdan içeri girer, kaybolur
  girisBtn.classList.add('girdi');

  await an(2800);                     // kapı kapanır
  girisBtn.classList.remove('acik');

  await an(3305);                     // kapı sesi
  cal('kapi');

  await an(3759);                     // onay sesi + "Hoş geldin"
  cal('onay');
  girisBtn.classList.remove('yuruyor', 'girdi');
  girisBtn.classList.add('bitti');
  girisYazi.textContent = 'Hoş geldin ✓';
  baslik.textContent = 'Giriş yapıldı';
  altBaslik.textContent = 'Şahin seni tanıdı. Hoş geldin!';
  maskot.classList.add('basari');

  // Gerçek projede burada sunucu isteği ve yönlendirme olur
});
