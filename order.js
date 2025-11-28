Vue.component('order-form', {
  props: ['paket','ekspedisi'],
  data() {
    return {
      form: { nim:'', nama:'', ekspedisi:'', paketKode:'' }
    };
  },
  computed: {
    selectedPaket() {
      return this.paket.find(p => p.kode === this.form.paketKode);
    }
  },
  methods: {
    submitOrder() {
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paketKode) {
        alert('Lengkapi semua data pemesanan!');
        return;
      }
      // Buat DO baru
      const newDO = {
        no: 'DO' + Date.now(),
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        tanggalKirim: new Date().toISOString().slice(0,10),
        paket: this.form.paketKode,
        total: this.selectedPaket ? this.selectedPaket.harga : 0,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: 'Pesanan dibuat'
          }
        ]
      };
      alert('Pesanan berhasil dibuat!\nNomor DO: ' + newDO.no);
      this.resetForm();
      // Catatan: di implementasi penuh, newDO ini bisa dikirim ke server atau disimpan ke localStorage
    },
    resetForm() {
      this.form = { nim:'', nama:'', ekspedisi:'', paketKode:'' };
    }
  },
  template: `
    <div class="order-panel">
      <h2>Form Pemesanan</h2>
      <form class="order-form" @submit.prevent="submitOrder">
        <div>
          <label>NIM</label>
          <input v-model="form.nim" placeholder="Masukkan NIM">
        </div>
        <div>
          <label>Nama</label>
          <input v-model="form.nama" placeholder="Nama Mahasiswa">
        </div>
        <div>
          <label>Ekspedisi</label>
          <select v-model="form.ekspedisi">
            <option value="">Pilih Ekspedisi</option>
            <option v-for="e in ekspedisi" :value="e.kode">{{e.nama}}</option>
          </select>
        </div>
        <div>
          <label>Paket Bahan Ajar</label>
          <select v-model="form.paketKode">
            <option value="">Pilih Paket</option>
            <option v-for="p in paket" :value="p.kode">{{p.nama}}</option>
          </select>
        </div>
        <div class="package-detail">
          <strong>Detail Paket:</strong>
          <span v-if="selectedPaket">
            {{selectedPaket.nama}} — isi: {{selectedPaket.isi.join(', ')}}, Total: Rp {{selectedPaket.harga}}
          </span>
          <span v-else>Belum memilih paket</span>
        </div>
        <div class="form-actions">
          <button class="primary" type="submit">Pesan Sekarang</button>
          <button class="reset" type="button" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  `
});