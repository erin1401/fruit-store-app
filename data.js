/* =========================================================
   data.js — Juragan Buah (UI Level 3 Final)
   Database berbasis LocalStorage
   Support:
   - Items
   - Buyers
   - Stock In / Stock Out
   - Opname
   - Sales (Tunai/Transfer, barcode, kembalian, struk)
   - Users + Login system
   ========================================================= */

// ----------------------
// FUNCTION UTILITY
// ----------------------
function getStore(key, def) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : def;
}

function setStore(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function rid() {
  return "ID" + Math.random().toString(36).substring(2, 10);
}

function today() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// =========================================================
//                 DATA STORE UTAMA
// =========================================================

const DataStore = {

  /* ------------------------------------
     MASTER ITEM
  ------------------------------------ */
  getItems() {
    return getStore("items", []);
  },

  addItem(obj) {
    const list = this.getItems();
    obj.id = rid();
    list.push(obj);
    setStore("items", list);
  },

  updateItem(id, data) {
    const list = this.getItems();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      setStore("items", list);
    }
  },

  deleteItem(id) {
    setStore("items", this.getItems().filter(i => i.id !== id));
    setStore("stockIn", this.getStockIn().filter(r => r.itemId !== id));
    setStore("stockOut", this.getStockOut().filter(r => r.itemId !== id));
    setStore("opname", this.getOpname().filter(r => r.itemId !== id));
  },

  /* ------------------------------------
     BUYERS
  ------------------------------------ */
  getBuyers() {
    return getStore("buyers", []);
  },

  addBuyer(obj) {
    const list = this.getBuyers();
    obj.id = rid();
    list.push(obj);
    setStore("buyers", list);
  },

  updateBuyer(id, data) {
    const list = this.getBuyers();
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data };
      setStore("buyers", list);
    }
  },

  deleteBuyer(id) {
    setStore("buyers", this.getBuyers().filter(b => b.id !== id));
  },

  /* ------------------------------------
     STOCK IN
  ------------------------------------ */
  getStockIn() {
    return getStore("stockIn", []);
  },

  addStockIn(obj) {
    const list = this.getStockIn();
    obj.id = rid();
    list.push(obj);
    setStore("stockIn", list);
  },

  /* ------------------------------------
     STOCK OUT
  ------------------------------------ */
  getStockOut() {
    return getStore("stockOut", []);
  },

  addStockOut(obj) {
    const list = this.getStockOut();
    obj.id = rid();
    list.push(obj);
    setStore("stockOut", list);
  },

  /* ------------------------------------
     STOCK OPNAME
  ------------------------------------ */
  getOpname() {
    return getStore("opname", []);
  },

  addOpname(obj) {
    const list = this.getOpname();
    obj.id = rid();
    list.push(obj);
    setStore("opname", list);
  },

  /* ------------------------------------
     HITUNG STOK REALTIME
  ------------------------------------ */
  getStock(itemId) {
    const masuk = this.getStockIn().filter(r => r.itemId === itemId)
      .reduce((a, b) => a + Number(b.qty), 0);

    const keluar = this.getStockOut().filter(r => r.itemId === itemId)
      .reduce((a, b) => a + Number(b.qty), 0);

    const opname = this.getOpname().filter(r => r.itemId === itemId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    return opname ? opname.qty : masuk - keluar;
  },


  /* ------------------------------------
     SALES / PENJUALAN
     ------------------------------------
     Format penjualan:
     {
       id,
       date,
       items: [ {itemId, name, price, qty} ],
       total,
       bayar,
       kembali,
       metode: "tunai" | "transfer",
       buyerId,
       barcode
     }
  ------------------------------------ */
  getSales() {
    return getStore("sales", []);
  },

  addSale(obj) {
    const list = this.getSales();
    obj.id = rid();
    list.push(obj);
    setStore("sales", list);
  },


  /* ------------------------------------
     USER SYSTEM
  ------------------------------------ */
  getUsers() {
    let users = getStore("users", null);

    // Jika belum ada user → buat admin default
    if (!users) {
      users = [{
        id: rid(),
        username: "admin",
        password: btoa("admin"),   // admin/admin
        role: "admin",
        created: today()
      }];
      setStore("users", users);
    }

    return users;
  },

  addUser(obj) {
    const users = this.getUsers();
    obj.id = rid();
    obj.password = btoa(obj.password);
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
        password: data.password ? btoa(data.password) : users[idx].password
      };
      setStore("users", users);
    }
  },

  deleteUser(id) {
    setStore("users", this.getUsers().filter(u => u.id !== id));
  },

  /* ------------------------------------
     LOGIN
  ------------------------------------ */
  login(username, password) {
    const users = this.getUsers();
    const hash = btoa(password);

    const u = users.find(x =>
      x.username === username && x.password === hash
    );

    if (!u) return false;

    setStore("loginUser", u);
    return true;
  },

  getLoginUser() {
    return getSto
