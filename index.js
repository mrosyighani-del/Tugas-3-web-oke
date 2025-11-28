new Vue({
  el: '#app',
  data: {
    tab: 'stok', // default tab aktif
    state: {
      upjList: dataBahanAjar.upbjjList || [],
      kategoriList: dataBahanAjar.kategoriList || [],
      pengirimanList: dataBahanAjar.pengirimanList || [],
      paket: dataBahanAjar.paket || [],
      stok: dataBahanAjar.stok || [],
      tracking: (dataBahanAjar.tracking || []).map(obj => {
        const no = Object.keys(obj)[0];
        const detail = obj[no];
        return {
          no,
          nim: detail.nim,
          nama: detail.nama,
          status: detail.status,
          ekspedisi: detail.ekspedisi,
          tanggalKirim: detail.tanggalKirim,
          paket: detail.paket,
          total: detail.total,
          perjalanan: detail.perjalanan || []
        };
      })
    }
  },

  methods: {
    // === STOK ===
    handleStockCreate(newItem) {
      const exists = this.state.stok.some(s => s.kode === newItem.kode);
      if (exists) {
        alert('Kode sudah ada. Gunakan kode unik.');
        return;
      }
      this.state.stok.unshift(newItem);
    },

    handleStockUpdate(updatedItem) {
      const idx = this.state.stok.findIndex(s => s.kode === updatedItem.kode);
      if (idx >= 0) {
        this.$set(this.state.stok, idx, updatedItem);
      } else {
        alert('Item tidak ditemukan.');
      }
    },

    handleStockDelete({ item }) {
      const idx = this.state.stok.findIndex(s => s.kode === item.kode);
      if (idx >= 0) {
        this.state.stok.splice(idx, 1);
      }
    },

    // === TRACKING DO ===
    handleNewDO(newDO) {
      this.state.tracking.unshift(newDO);
      this.tab = 'tracking'; // otomatis pindah ke tab tracking
    },

    handleJourneyAdd(row, keterangan) {
      if (!keterangan) return;
      const waktu = new Date().toLocaleString('id-ID');
      row.perjalanan.push({ waktu, keterangan });
      row._newKeterangan = '';
    },

    handleDeleteDO(row) {
      const idx = this.state.tracking.findIndex(d => d.no === row.no);
      if (idx >= 0) {
        this.state.tracking.splice(idx, 1);
      }
    },

    // === PEMESANAN ===
    handleOrderSubmit(form) {
      const paket = this.state.paket.find(p => p.kode === form.paketKode);
      if (!paket) {
        alert('Paket tidak ditemukan.');
        return;
      }

      const newDO = {
        no: 'DO' + Date.now(),
        nim: form.nim,
        nama: form.nama,
        ekspedisi: form.ekspedisi,
        tanggalKirim: new Date().toISOString().slice(0, 10),
        paket: paket.kode,
        total: paket.harga,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: 'Pesanan dibuat'
          }
        ]
      };

      this.handleNewDO(newDO);
    }
  }
});