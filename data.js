/* =========================================================
   data.js — Data layer untuk Fruit Store App (LocalStorage)
   - Menangani semua CRUD: users, items, buyers, stockIn, stockOut,
     stockOpname, sales
   - Menyediakan helpers laporan & seed data
   - Expose global DataStore API
   ========================================================= */

/*
  Storage keys used across the app (must match backup keys)
  users, items, buyers, stockIn, stockOut, stockOpname, sales
*/

const DataStore = (function () {
  const KEYS = {
    USERS: "users",
    ITEMS: "items",
    BUYERS: "buyers",
    STOCK_IN: "stockIn",
    STOCK_OUT: "stockOut",
    STOCK_OPNAME: "stockOpname",
    SALES: "sales",
  };

  /* -------------------------
     Internal helpers
     ------------------------- */
  function _load(k) {
    return loadJSON(k, null) || [];
  }
  function _save(k, v) {
    return saveJSON(k, v);
  }

  function _findById(list, id) {
    return list.find((x) => x && x.id === id) || null;
  }

  /* -------------------------
     Initialization & Seed
     ------------------------- */
  function initDefaults() {
    // ensure keys exist with sensible defaults
    if (!loadJSON(KEYS.USERS)) {
      const users = [
        { id: generateID("u"), username: "admin", password: "admin123", name: "Administrator", role: "admin" },
        { id: generateID("u"), username: "kasir", password: "kasir123", name: "Kasir", role: "kasir" },
      ];
      _save(KEYS.USERS, users);
    }
    if (!loadJSON(KEYS.ITEMS)) {
      _save(KEYS.ITEMS, []);
    }
    if (!loadJSON(KEYS.BUYERS)) {
      _save(KEYS.BUYERS, [{ id: generateID("b"), name: "Pembeli Umum", address: "-", phone: "-" }]);
    }
    if (!loadJSON(KEYS.STOCK_IN)) _save(KEYS.STOCK_IN, []);
    if (!loadJSON(KEYS.STOCK_OUT)) _save(KEYS.STOCK_OUT, []);
    if (!loadJSON(KEYS.STOCK_OPNAME)) _save(KEYS.STOCK_OPNAME, []);
    if (!loadJSON(KEYS.SALES)) _save(KEYS.SALES, []);
  }

  function seedSampleData() {
    // Overwrite all core data with a friendly sample dataset
    const users = [
      { id: generateID("u"), username: "admin", password: "admin123", name: "Administrator", role: "admin" },
      { id: generateID("u"), username: "kasir", password: "kasir123", name: "Kasir", role: "kasir" },
    ];
    const items = [
      { id: generateID("it"), code: "B001", name: "Pisang Ambon", category: "Pisang", price: 12000, cost: 8000, stock: 50 },
      { id: generateID("it"), code: "B002", name: "Jeruk Medan", category: "Jeruk", price: 15000, cost: 10000, stock: 30 },
      { id: generateID("it"), code: "B003", name: "Mangga Harum", category: "Mangga", price: 20000, cost: 13000, stock: 20 },
    ];
    const buyers = [{ id: generateID("b"), name: "Pembeli Umum", address: "-", phone: "-" }];

    _save(KEYS.USERS, users);
    _save(KEYS.ITEMS, items);
    _save(KEYS.BUYERS, buyers);
    _save(KEYS.STOCK_IN, []);
    _save(KEYS.STOCK_OUT, []);
    _save(KEYS.STOCK_OPNAME, []);
    _save(KEYS.SALES, []);
    showToast("Data sample terpasang. Login: admin/admin123 atau kasir/kasir123");
  }

  /* -------------------------
     Users (Admin/Kasir) CRUD
     ------------------------- */
  function getUsers() {
    return _load(KEYS.USERS);
  }

  function addUser({ username, password = "123456", name = "", role = "kasir" }) {
    if (!username) throw new Error("Username is required");
    const users = _load(KEYS.USERS);
    if (users.some((u) => u.username === username)) {
      throw new Error("Username sudah ada");
    }
    const u = { id: generateID("u"), username, password, name, role };
    users.push(u);
    _save(KEYS.USERS, users);
    return u;
  }

  function updateUser(id, patch) {
    const users = _load(KEYS.USERS);
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User tidak ditemukan");
    users[idx] = { ...users[idx], ...patch };
    _save(KEYS.USERS, users);
    return users[idx];
  }

  function deleteUser(id) {
    const users = _load(KEYS.USERS);
    const remain = users.filter((u) => u.id !== id);
    _save(KEYS.USERS, remain);
    return true;
  }

  function authenticate(username, password) {
    const users = _load(KEYS.USERS);
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) return null;
    // don't return password in UI-friendly object
    const { password: pwd, ...safe } = found;
    return safe;
  }

  /* -------------------------
     Items CRUD
     ------------------------- */
  function getItems() {
    return _load(KEYS.ITEMS);
  }

  function getItemById(id) {
    return _findById(_load(KEYS.ITEMS), id);
  }

  function addItem({ code, name, category = "", price = 0, cost = 0, stock = 0 }) {
    if (!code || !name) throw new Error("Kode dan nama wajib");
    const items = _load(KEYS.ITEMS);
    if (items.some((it) => it.code === code)) throw new Error("Kode item sudah ada");
    const it = { id: generateID("it"), code, name, category, price: Number(price), cost: Number(cost), stock: Number(stock) };
    items.push(it);
    _save(KEYS.ITEMS, items);
    return it;
  }

  function updateItem(id, patch) {
    const items = _load(KEYS.ITEMS);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Item tidak ditemukan");
    items[idx] = { ...items[idx], ...patch };
    _save(KEYS.ITEMS, items);
    return items[idx];
  }

  function deleteItem(id) {
    const items = _load(KEYS.ITEMS);
    const remain = items.filter((i) => i.id !== id);
    _save(KEYS.ITEMS, remain);
    return true;
  }

  /* -------------------------
     Buyers CRUD
     ------------------------- */
  function getBuyers() {
    return _load(KEYS.BUYERS);
  }

  function addBuyer({ name, address = "", phone = "" }) {
    if (!name) throw new Error("Nama pembeli wajib");
    const buyers = _load(KEYS.BUYERS);
    const b = { id: generateID("b"), name, address, phone };
    buyers.push(b);
    _save(KEYS.BUYERS, buyers);
    return b;
  }

  function updateBuyer(id, patch) {
    const buyers = _load(KEYS.BUYERS);
    const idx = buyers.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Pembeli tidak ditemukan");
    buyers[idx] = { ...buyers[idx], ...patch };
    _save(KEYS.BUYERS, buyers);
    return buyers[idx];
  }

  function deleteBuyer(id) {
    const buyers = _load(KEYS.BUYERS);
    const remain = buyers.filter((b) => b.id !== id);
    _save(KEYS.BUYERS, remain);
    return true;
  }

  /* -------------------------
     Inventory: Stock In
     ------------------------- */
  function recordStockIn({ itemId, qty = 0, price = 0, ref = "" }) {
    if (!itemId || qty <= 0) throw new Error("Item dan qty > 0 diperlukan");
    const items = _load(KEYS.ITEMS);
    const it = items.find((x) => x.id === itemId);
    if (!it) throw new Error("Item tidak ditemukan");
    it.stock = (Number(it.stock) || 0) + Number(qty);
    _save(KEYS.ITEMS, items);

    const stockIn = _load(KEYS.STOCK_IN);
    const rec = { id: generateID("si"), date: new Date().toISOString(), itemId, qty: Number(qty), price: Number(price), ref, itemCode: it.code, itemName: it.name };
    stockIn.push(rec);
    _save(KEYS.STOCK_IN, stockIn);
    return rec;
  }

  function getStockIn() {
    return _load(KEYS.STOCK_IN);
  }

  /* -------------------------
     Inventory: Stock Out
     ------------------------- */
  function recordStockOut({ itemId, qty = 0, reason = "" }) {
    if (!itemId || qty <= 0) throw new Error("Item dan qty > 0 diperlukan");
    const items = _load(KEYS.ITEMS);
    const it = items.find((x) => x.id === itemId);
    if (!it) throw new Error("Item tidak ditemukan");
    it.stock = (Number(it.stock) || 0) - Number(qty); // allow negative but logged
    _save(KEYS.ITEMS, items);

    const stockOut = _load(KEYS.STOCK_OUT);
    const rec = { id: generateID("so"), date: new Date().toISOString(), itemId, qty: Number(qty), reason, itemCode: it.code, itemName: it.name };
    stockOut.push(rec);
    _save(KEYS.STOCK_OUT, stockOut);
    return rec;
  }

  function getStockOut() {
    return _load(KEYS.STOCK_OUT);
  }

  /* -------------------------
     Stock Opname
     ------------------------- */
  function recordStockOpname(entries /* [{itemId, physical, reason}] */) {
    if (!Array.isArray(entries)) throw new Error("Entries harus array");
    const items = _load(KEYS.ITEMS);
    const opname = _load(KEYS.STOCK_OPNAME);
    const results = [];

    for (const e of entries) {
      const it = items.find((x) => x.id === e.itemId);
      if (!it) continue;
      const system = Number(it.stock) || 0;
      const physical = Number(e.physical) || 0;
      const diff = physical - system;
      // update stock to physical
      it.stock = physical;
      const rec = {
        id: generateID("sop"),
        date: new Date().toISOString(),
        itemId: it.id,
        itemCode: it.code,
        itemName: it.name,
        system,
        physical,
        diff,
        reason: e.reason || "",
      };
      opname.push(rec);
      results.push(rec);
    }
    _save(KEYS.ITEMS, items);
    _save(KEYS.STOCK_OPNAME, opname);
    return results;
  }

  function getStockOpname() {
    return _load(KEYS.STOCK_OPNAME);
  }

  /* -------------------------
     Sales (Penjualan)
     items: [{ itemId, qty, price }]
     ------------------------- */
  function createSale({ buyerId = null, date = null, items = [], cashier = "unknown" }) {
    if (!Array.isArray(items) || items.length === 0) throw new Error("Transaksi harus memiliki minimal 1 item");

    const itemsMaster = _load(KEYS.ITEMS);
    const buyers = _load(KEYS.BUYERS);
    const buyerRec = buyers.find((b) => b.id === buyerId) || { id: null, name: "Pembeli Umum" };

    // build sale lines with snapshot of price/cost
    const lines = items.map((it) => {
      const master = itemsMaster.find((m) => m.id === it.itemId);
      if (!master) throw new Error(`Item tidak ditemukan: ${it.itemId}`);
      return {
        itemId: master.id,
        code: master.code,
        name: master.name,
        qty: Number(it.qty),
        price: Number(it.price),
        cost: Number(master.cost || 0),
      };
    });

    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const saleRec = {
      id: generateID("s"),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      buyerId: buyerRec.id,
      buyerName: buyerRec.name,
      items: lines,
      total,
      cashier,
    };

    // reduce stock and record stockOut entries for trace
    const stockOutLog = _load(KEYS.STOCK_OUT);
    for (const l of lines) {
      const master = itemsMaster.find((m) => m.id === l.itemId);
      master.stock = (Number(master.stock) || 0) - Number(l.qty); // allow negative
      stockOutLog.push({
        id: generateID("so"),
        date: saleRec.date,
        itemId: l.itemId,
        qty: l.qty,
        reason: "Penjualan",
        itemCode: l.code,
        itemName: l.name,
      });
    }

    // persist
    _save(KEYS.ITEMS, itemsMaster);
    _save(KEYS.STOCK_OUT, stockOutLog);

    const sales = _load(KEYS.SALES);
    sales.push(saleRec);
    _save(KEYS.SALES, sales);

    return saleRec;
  }

  function getSales(filter = {}) {
    // filter: { from: ISOstring, to: ISOstring }
    const sales = _load(KEYS.SALES) || [];
    if (!filter.from && !filter.to) return sales;
    const fromT = filter.from ? new Date(filter.from).getTime() : -Infinity;
    const toT = filter.to ? new Date(filter.to).getTime() : Infinity;
    return sales.filter((s) => {
      const t = new Date(s.date).getTime();
      return t >= fromT && t <= toT;
    });
  }

  /* -------------------------
     Reports
     ------------------------- */
  function inventorySnapshot() {
    const items = _load(KEYS.ITEMS);
    const rows = items.map((it) => {
      const val = (Number(it.stock) || 0) * (Number(it.cost) || 0);
      return { id: it.id, code: it.code, name: it.name, stock: it.stock || 0, hpp: it.cost || 0, value: val };
    });
    const totalValue = rows.reduce((s, r) => s + r.value, 0);
    return { rows, totalValue };
  }

  function profitAndLoss(from = null, to = null) {
    const sales = getSales({ from, to });
    let revenue = 0;
    let cogs = 0;
    for (const s of sales) {
      revenue += Number(s.total) || 0;
      for (const li of s.items) {
        cogs += Number(li.cost || 0) * Number(li.qty || 0);
      }
    }
    const gross = revenue - cogs;
    return { revenue, cogs, gross };
  }

  function salesSummaryByDay(from = null, to = null) {
    // returns array [{ date:'YYYY-MM-DD', revenue, cogs, gross, count }]
    const sales = getSales({ from, to });
    const map = new Map();
    for (const s of sales) {
      const day = new Date(s.date).toISOString().slice(0, 10);
      if (!map.has(day)) map.set(day, { revenue: 0, cogs: 0, gross: 0, count: 0 });
      const rec = map.get(day);
      rec.revenue += Number(s.total) || 0;
      let c = 0;
      for (const li of s.items) c += Number(li.cost || 0) * Number(li.qty || 0);
      rec.cogs += c;
      rec.gross += (Number(s.total || 0) - c);
      rec.count += 1;
    }
    // convert to array sorted by date asc
    return Array.from(map.entries())
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /* -------------------------
     Export helpers (return structured arrays suitable for CSV export)
     ------------------------- */
  function exportItemsCSVRows() {
    const items = _load(KEYS.ITEMS);
    const header = ["Kode", "Nama", "Kategori", "HargaJual", "HPP", "Stok"];
    const rows = [header];
    items.forEach((it) => rows.push([it.code, it.name, it.category || "", it.price, it.cost, it.stock || 0]));
    return rows;
  }

  function exportSalesCSVRows() {
    const sales = _load(KEYS.SALES);
    const header = ["Tanggal", "Pembeli", "Kasir", "ItemKode", "ItemNama", "Qty", "Harga", "Subtotal", "TotalTransaksi"];
    const rows = [header];
    for (const s of sales) {
      for (const it of s.items) {
        rows.push([s.date, s.buyerName || "-", s.cashier || "-", it.code, it.name, it.qty, it.price, it.qty * it.price, s.total]);
      }
    }
    return rows;
  }

  function exportProfitRows(from = null, to = null) {
    const sales = getSales({ from, to });
    const header = ["Tanggal", "Pendapatan", "COGS", "Laba"];
    const rows = [header];
    for (const s of sales) {
      let cogs = 0;
      for (const li of s.items) cogs += li.cost * li.qty;
      const profit = Number(s.total) - cogs;
      rows.push([s.date, s.total, cogs, profit]);
    }
    return rows;
  }

  /* -------------------------
     Utility / Debug
     ------------------------- */
  function clearAllData() {
    // CAREFUL: remove only our keys
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }

  /* -------------------------
     Public API
     ------------------------- */
  const api = {
    // init
    initDefaults,
    seedSampleData,

    // users
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    authenticate,

    // items
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,

    // buyers
    getBuyers,
    addBuyer,
    updateBuyer,
    deleteBuyer,

    // stock in/out/opname
    recordStockIn,
    getStockIn,
    recordStockOut,
    getStockOut,
    recordStockOpname,
    getStockOpname,

    // sales
    createSale,
    getSales,

    // reports
    inventorySnapshot,
    profitAndLoss,
    salesSummaryByDay,

    // export helpers
    exportItemsCSVRows,
    exportSalesCSVRows,
    exportProfitRows,

    // misc
    clearAllData,
    // expose keys for other modules like backup
    _KEYS: KEYS,
  };

  // Auto init defaults at load time
  try {
    initDefaults();
  } catch (e) {
    console.error("DataStore init error:", e);
  }

  return api;
})();

/* Make available globally */
window.DataStore = DataStore;
