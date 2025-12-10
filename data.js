/* =========================================================
   data.js — Juragan Buah
   Basis data lokal berbasis localStorage
   Semua halaman membaca data dari sini
   ========================================================= */

const DataStore = {

  /* ======================
     ITEMS
     ====================== */
  getItems() {
    return getStore("items", []);
  },

  addItem(obj) {
    const items = this.getItems();
    obj.id = obj.id || rid();
    items.push(obj);
    setStore("items", items);
  },

  updateItem(id, data) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...data };
      setStore("items", items);
    }
  },

  deleteItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    setStore("items", items);

    // Bersihkan stok terkait
    setStore("stockIn", this.getStockIn().filter(r => r.itemId !== id));
    setStore("stockOut", this.getStockOut().filter(r => r.itemId !== id));
    setStore("opname", this.getOpname().filter(r => r.itemId !== id));
  },


  /* ======================
     BUYERS
     ====================== */
  getBuyers() {
    return getStore("buyers", []);
  },

  addBuyer(obj) {
    const buyers = this.getBuyers();
    obj.id = obj.id || rid();
    buyers.push(obj);
    setStore("buyers", buyers);
  },

  updateBuyer(id, data) {
    const buyers = this.getBuyers();
    const idx = buyers.findIndex(i => i.id === id);
    if (idx >= 0) {
      buyers[idx] = { ...buyers[idx], ...data };
      setStore("buyers", buyers);
    }
  },

  deleteBuyer(id) {
    const buyers = this.getBuyers().filter(i => i.id !== id);
    setStore("buyers", buyers);
  },


  /* ======================
     STOCK IN / MASUK
     ====================== */
  getStockIn() {
    return getStore("stockIn", []);
  },

  addStockIn(obj) {
    const list = this.getStockIn();
    obj.id = obj.id || rid();
    list.push(obj);
    setStore("stockIn", list);
  },


  /* ======================
     STOCK OUT / KELUAR
     ====================== */
  getStockOut() {
    return getStore("stockOut", []);
  },

  addStockOut(obj) {
    const list = this.getStockOut();
    obj.id = obj.id || rid();
    list.push(obj);
    setStore("stockOut", list);
  },


  /* ======================
     STOCK OPNAME
     ====================== */
  getOpname() {
    return getStore("opname", []);
  },

  addOpname(obj) {
    const list = this.getOpname();
    obj.id = obj.id || rid();
    list.push(obj);
    setStore("opname", list);
  },


  /* ======================
     HITUNG STOK REAL-TIME
     ====================== */
  getStock(id) {
    const inData = this.getStockIn().filter(r => r.itemId === id)
      .reduce((a, b) => a + b.qty, 0);

    const outData = this.getStockOut().filter(r => r.itemId === id)
      .reduce((a, b) => a + b.qty, 0);

    const opname = this.getOpname().filter(r => r.itemId === id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    if (opname) return opname.qty;

    return inData - outData;
  },


  /* ======================
     SALES / PENJUALAN
     ====================== */
  getSales() {
    return getStore("sales", []);
  },

  addSale(obj) {
    const sales = this.getSales();
    obj.id = obj.id || rid();
    sales.push(obj);
    setStore("sales", sales);
  },


  /* ======================
     USERS
     ====================== */
  getUsers() {
    const users = getStore("users", null);

    // jika belum ada user → buat admin default
    if (!users) {
      const admin = [{
        id: rid(),
        username: "admin",
        password: btoa("admin"), // admin/admin
        role: "admin",
        created: today()
      }];
      setStore("users", admin);
      return admin;
    }

    return users;
  },

  addUser(obj) {
    const users = this.getUsers();
    obj.id = obj.id || rid();
    users.push(obj);
    setStore("users", users);
  },

  updateUser(id, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx >= 0) {
      users[idx] = {
        ...users[idx],
        ...data,
        password: data.password ? data.password : users[idx].password
      };
      setStore("users", users);
    }
  },

  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    setStore("users", users);
  },


  /* ======================
     LOGIN USER
     ====================== */
  login(username, password) {
    const users = this.getUsers();
    const passHash = btoa(password);

    const user = users.find(
      u => u.username === username && u.password === passHash
    );

    if (user) {
      setStore("loginUser", user);
      return true;
    }

    return false;
  },

  getLoginUser() {
    return getStore("loginUser", null);
  }
};


// Export agar bisa dipanggil global
window.DataStore = DataStore;
