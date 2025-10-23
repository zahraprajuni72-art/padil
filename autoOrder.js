(async function () {
  const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

  const waitForEl = async (selector, timeout = 10000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(200);
    }
    throw new Error(`⏰ Timeout menunggu selector: ${selector}`);
  };

  const triggerInput = (el, value) => {
    if (!el) return;
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    console.log(`✅ Diisi: ${value}`);
  };

  // Optional: bersihkan cache/cookies localStorage & sessionStorage
  console.log("🧹 Membersihkan cache lokal...");
  localStorage.clear();
  sessionStorage.clear();

  try {
    // === STEP 1: Ambil data JSON dari GitHub ===
    const urlPengirim = 'https://raw.githubusercontent.com/zahraprajuni72-art/padil/refs/heads/main/pengirim.json';
    const urlPenerima = 'https://raw.githubusercontent.com/zahraprajuni72-art/padil/refs/heads/main/penerima.json';

    console.log("⏳ Mengambil data pengirim & penerima dari GitHub...");
    const [pengirimRes, penerimaRes] = await Promise.all([
      fetch(urlPengirim),
      fetch(urlPenerima)
    ]);

    if (!pengirimRes.ok || !penerimaRes.ok) throw new Error("Gagal ambil data dari GitHub!");

    const pengirimData = await pengirimRes.json();
    const penerimaData = await penerimaRes.json();

    const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

    const pengirim = Array.isArray(pengirimData) ? getRandom(pengirimData) : pengirimData;
    const penerima = Array.isArray(penerimaData) ? getRandom(penerimaData) : penerimaData;

    // Normalisasi field biar konsisten
    const namaPengirimVal = pengirim.nama || pengirim.Nama || pengirim["nama pengirim"];
    const telpPengirimVal = pengirim.telepon || pengirim["No penerima"] || pengirim.telp;
    const alamatPengirimVal = pengirim.alamat || pengirim.Alamat;

    console.log("✅ Data Pengirim:", namaPengirimVal, telpPengirimVal, alamatPengirimVal);
    console.log("✅ Data Penerima:", penerima.nama, penerima.telepon, penerima.alamat);

    // === STEP 2: Klik bagian pengirim ===
    document.querySelector('span[data-v-67c91dd2].mr8.left')?.click();
    console.log("✅ Klik span awal");
    await delay(800);

    // === STEP 3: Isi nama pengirim ===
    const namaPengirim = await waitForEl('textarea[name="name"]');
    triggerInput(namaPengirim, namaPengirimVal);
    await delay();

    // === STEP 4: Isi no HP pengirim ===
    const hpPengirim = await waitForEl('input[name="phone"]');
    triggerInput(hpPengirim, telpPengirimVal);
    await delay();

    // === STEP 5: Klik dan pilih provinsi pengirim ===
    const provField = await waitForEl('input[placeholder="Provinsi, Kota, Kecamatan"]');
    provField.click();
    console.log("✅ Klik field alamat pengirim");
    await delay();

    const provSearch = await waitForEl('input[placeholder="Cari provinsi,kota,kecamatan"]');
    triggerInput(provSearch, "Sumatera Barat,Padang,Lubuk Begalung");
    await delay();

    const hasilPengirim = [...document.querySelectorAll('span.van-highlight__tag')]
      .find(e => e.textContent.includes("Sumatera Barat,Padang,Lubuk Begalung"));
    hasilPengirim?.click();
    console.log("✅ Klik hasil pencarian pengirim");
    await delay();

    // === STEP 6: Isi alamat pengirim ===
    const alamatPengirim = await waitForEl('textarea[name="address"]');
    triggerInput(alamatPengirim, alamatPengirimVal);
    await delay();

    // === STEP 7: Klik tombol simpan pengirim ===
    const simpanPengirim = await waitForEl('button.van-button--primary');
    simpanPengirim.click();
    console.log("✅ Klik tombol Simpan pengirim");
    await delay();

    // === STEP 8: Klik bagian penerima ===
    const penerimaDiv = await waitForEl('div.address-content.placeholder');
    penerimaDiv.click();
    console.log("✅ Klik bagian penerima");
    await delay();

    // === STEP 9: Isi nama penerima ===
    const namaPenerima = await waitForEl('textarea[name="name"]');
    triggerInput(namaPenerima, penerima.nama);
    await delay();

    // === STEP 10: Isi no HP penerima ===
    const hpPenerima = await waitForEl('input[name="phone"]');
    triggerInput(hpPenerima, penerima.telepon);
    await delay();

    // === STEP 11: Klik icon provinsi penerima ===
    const iconProvPenerima = await waitForEl('i.van-icon-arrow');
    iconProvPenerima.click();
    console.log("✅ Klik icon field Provinsi penerima");
    await delay();

    // === STEP 12: Isi pencarian provinsi penerima ===
    const provSearchPenerima = await waitForEl('input[placeholder="Cari provinsi,kota,kecamatan"]');
    triggerInput(provSearchPenerima, "Sumatera Barat,Padang,Padang Utara");
    await delay();

    const hasilPenerima = [...document.querySelectorAll('span.van-highlight__tag')]
      .find(e => e.textContent.includes("Sumatera Barat,Padang,Padang Utara"));
    hasilPenerima?.click();
    console.log("✅ Klik hasil pencarian penerima");
    await delay();

    // === STEP 13: Isi alamat penerima ===
    const alamatPenerima = await waitForEl('textarea[name="address"]');
    triggerInput(alamatPenerima, penerima.alamat);
    await delay();

    // === STEP 14: Klik tombol simpan penerima ===
    const simpanPenerima = await waitForEl('button.van-button--primary');
    simpanPenerima.click();
    console.log("✅ Klik tombol Simpan penerima");
    await delay();

    // === STEP 15: Klik elemen wajib (kategori) ===
    const wajib = document.querySelector('span.red, .required, .van-field__error-message');
    if (wajib) {
      wajib.click();
      console.log("✅ Klik elemen 'Wajib'");
      await delay();
    } else {
      console.warn("⚠️ Elemen 'Wajib' tidak ditemukan, lanjut...");
    }

    // === STEP 16: Pilih kategori barang ===
    const barang = [...document.querySelectorAll('span')].find(e => e.textContent.trim() === "Barang");
    barang?.click();
    console.log("✅ Klik kategori: Barang");
    await delay();

    const fashion = [...document.querySelectorAll('span')].find(e => e.textContent.trim() === "Fashion");
    fashion?.click();
    console.log("✅ Klik subkategori: Fashion");
    await delay();

    // === STEP 17: Klik tombol simpan kategori ===
    const simpanKategori = [...document.querySelectorAll('button.van-button')]
      .find(btn => btn.textContent.includes("Simpan"));
    simpanKategori?.click();
    console.log("✅ Klik tombol Simpan kategori");
    await delay();

    // === STEP 18: Klik tombol Order ===
    const orderBtn = [...document.querySelectorAll('button.van-button')]
      .find(btn => btn.textContent.includes("Order"));
    orderBtn?.click();
    console.log("✅ Klik tombol 'Order'");
    await delay(1500);

    // === STEP 19: Klik Order Sekarang ===
    const orderSekarang = [...document.querySelectorAll('button.van-button')]
      .find(btn => btn.textContent.includes("Order sekarang"));
    orderSekarang?.click();
    console.log("✅ Klik tombol 'Order sekarang'");

    console.log("🎉 Semua langkah selesai tanpa error!");

  } catch (err) {
    console.error("❌ Terjadi error:", err);
  }
})();
