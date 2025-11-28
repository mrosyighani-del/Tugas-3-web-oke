Vue.component('tracking-table', {
  props: ['data'],
  methods: {
    addJourney(row) {
      if (!row._newKeterangan) return;
      const waktu = new Date().toLocaleString('id-ID');
      row.perjalanan.push({ waktu, keterangan: row._newKeterangan });
      row._newKeterangan = '';
    },
    confirmDelete(row) {
      const idx = this.data.findIndex(d => d.no === row.no);
      if (idx >= 0) this.data.splice(idx, 1);
    }
  },
  template: `
    <div class="tracking-panel">
      <h2>Daftar Tracking DO</h2>
      <table class="tracking-table">
        <thead>
          <tr>
            <th>No DO</th><th>NIM</th><th>Nama</th><th>Ekspedisi</th>
            <th>Paket</th><th>Tanggal Kirim</th><th>Total</th><th>Perjalanan</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.no">
            <td>{{row.no}}</td>
            <td>{{row.nim}}</td>
            <td>{{row.nama}}</td>
            <td>{{row.ekspedisi}}</td>
            <td>{{row.paket}}</td>
            <td>{{row.tanggalKirim}}</td>
            <td>Rp {{row.total}}</td>
            <td>
              <ul>
                <li v-for="j in row.perjalanan">
                  <span>{{j.waktu}}</span> — {{j.keterangan}}
                </li>
              </ul>
              <div>
                <input v-model="row._newKeterangan" placeholder="Tambah perjalanan...">
                <button @click="addJourney(row)">Tambah</button>
              </div>
            </td>
            <td>
              <button @click="confirmDelete(row)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
});