Vue.component('stock-table', {
  props: ['items','upbjj','kategori'],
  data() {
    return {
      filters: { upbjj:'', kategori:'', reorderOnly:false },
      sortBy: 'judul',
      newItem: { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' },
      editItem: null,
      deleteConfirm: null
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(i => {
        const f1 = !this.filters.upbjj || i.upbjj === this.filters.upbjj;
        const f2 = !this.filters.kategori || i.kategori === this.filters.kategori;
        const f3 = !this.filters.reorderOnly || i.qty < i.safety || i.qty === 0;
        return f1 && f2 && f3;
      });
    },
    sortedItems() {
      return [...this.filteredItems].sort((a,b) => {
        if (this.sortBy==='judul') return a.judul.localeCompare(b.judul);
        if (this.sortBy==='qty') return a.qty - b.qty;
        if (this.sortBy==='harga') return a.harga - b.harga;
      });
    }
  },
  methods: {
    statusClass(item) {
      if (item.qty === 0) return 'badge danger';
      if (item.qty < item.safety) return 'badge warning';
      return 'badge success';
    },
    statusLabel(item) {
      if (item.qty === 0) return 'Kosong';
      if (item.qty < item.safety) return 'Menipis';
      return 'Aman';
    },
    resetFilters() {
      this.filters = { upbjj:'', kategori:'', reorderOnly:false };
      this.sortBy = 'judul';
    },
    createItem() {
      if (!this.newItem.kode || !this.newItem.judul) return alert('Lengkapi data!');
      this.items.push({...this.newItem});
      this.newItem = { kode:'', judul:'', kategori:'', upbjj:'', lokasiRak:'', harga:0, qty:0, safety:0, catatanHTML:'' };
    },
    startEdit(item) { this.editItem = {...item}; },
    updateItem() {
      const idx = this.items.findIndex(i => i.kode===this.editItem.kode);
      if (idx>=0) this.$set(this.items, idx, this.editItem);
      this.editItem = null;
    },
    confirmDelete(item) { this.deleteConfirm = item; },
    deleteItem() {
      const idx = this.items.findIndex(i => i.kode===this.deleteConfirm.kode);
      if (idx>=0) this.items.splice(idx,1);
      this.deleteConfirm = null;
    }
  },
  template: `
    <div>
      <!-- Filter -->
      <div class="filters">
        <label>UT-Daerah:</label>
        <select v-model="filters.upbjj">
          <option value="">(Semua)</option>
          <option v-for="u in upbjj" :value="u">{{u}}</option>
        </select>

        <label>Kategori:</label>
        <select v-model="filters.kategori" :disabled="!filters.upbjj">
          <option value="">(Semua)</option>
          <option v-for="k in kategori" :value="k">{{k}}</option>
        </select>

        <label><input type="checkbox" v-model="filters.reorderOnly"> Hanya stok menipis/kosong</label>

        <label>Sort:</label>
        <select v-model="sortBy">
          <option value="judul">Judul</option>
          <option value="qty">Jumlah</option>
          <option value="harga">Harga</option>
        </select>

        <button @click="resetFilters">Reset</button>
      </div>

      <!-- Form tambah stok -->
      <div class="form-create">
        <h3>Tambah Bahan Ajar</h3>
        <input v-model="newItem.kode" placeholder="Kode" @keyup.enter="createItem">
        <input v-model="newItem.judul" placeholder="Judul" @keyup.enter="createItem">
        <select v-model="newItem.kategori">
          <option v-for="k in kategori" :value="k">{{k}}</option>
        </select>
        <select v-model="newItem.upbjj">
          <option v-for="u in upbjj" :value="u">{{u}}</option>
        </select>
        <input v-model="newItem.lokasiRak" placeholder="Lokasi Rak" @keyup.enter="createItem">
        <input v-model.number="newItem.harga" placeholder="Harga" @keyup.enter="createItem">
        <input v-model.number="newItem.qty" placeholder="Qty" @keyup.enter="createItem">
        <input v-model.number="newItem.safety" placeholder="Safety" @keyup.enter="createItem">
        <button @click="createItem">Tambah</button>
      </div>

      <!-- Tabel stok -->
      <table>
        <thead>
          <tr>
            <th>Kode</th><th>Judul</th><th>Kategori</th><th>UT-Daerah</th>
            <th>Lokasi Rak</th><th>Harga</th><th>Qty</th><th>Safety</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedItems" :key="item.kode">
            <td>{{item.kode}}</td>
            <td>{{item.judul}}</td>
            <td>{{item.kategori}}</td>
            <td>{{item.upbjj}}</td>
            <td>{{item.lokasiRak}}</td>
            <td>Rp {{item.harga}}</td>
            <td>{{item.qty}} buah</td>
            <td>{{item.safety}} buah</td>
            <td>
              <div class="tooltip">
                <span :class="statusClass(item)">{{statusLabel(item)}}</span>
                <span class="tooltiptext" v-html="item.catatanHTML"></span>
              </div>
            </td>
            <td>
              <button @click="startEdit(item)">Edit</button>
              <button @click="confirmDelete(item)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Form edit stok -->
      <div v-if="editItem">
        <h3>Edit Bahan Ajar</h3>
        <input v-model="editItem.judul" @keyup.enter="updateItem">
        <input v-model.number="editItem.qty" @keyup.enter="updateItem">
        <button @click="updateItem">Simpan</button>
        <button @click="editItem=null">Batal</button>
      </div>

      <!-- Modal konfirmasi hapus -->
      <div v-if="deleteConfirm" class="modal">
        <p>Yakin ingin menghapus {{deleteConfirm.judul}}?</p>
        <button @click="deleteItem">Ya</button>
        <button @click="deleteConfirm=null">Tidak</button>
      </div>
    </div>
  `
});