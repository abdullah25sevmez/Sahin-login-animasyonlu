// Bekleme yardımcısı
const bekle = ms => new Promise(r => setTimeout(r, ms));

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

  // Çöp adam kapıya yürür
  girisBtn.classList.add('yuruyor');
  await bekle(1000);

  girisBtn.classList.replace('yuruyor', 'bitti');
  girisYazi.textContent = 'Hoş geldin ✓';
  baslik.textContent = 'Giriş yapıldı';
  altBaslik.textContent = 'Şahin seni tanıdı. Hoş geldin!';
  maskot.classList.add('basari');

  // Gerçek projede burada sunucu isteği ve yönlendirme olur
});
