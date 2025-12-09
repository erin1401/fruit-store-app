/* data.js — DataStore lengkap untuk Juragan Buah */
const LS = {
  ITEMS: 'jb_items_v1',
  BUYERS: 'jb_buyers_v1',
  STOCK_IN: 'jb_stock_in_v1',
  STOCK_OUT: 'jb_stock_out_v1',
  OPNAME: 'jb_opname_v1',
  SALES: 'jb_sales_v1',
  USERS: 'jb_users_v1'
};

const DataStore = (function(){
  // helpers
  function load(key){ return JSON.parse(localStorage.getItem(key) || '[]'); }
  function save(key, v){ localStorage.setItem(key, JSON.stringify(v)); }

  function uid(prefix='ID'){ return prefix + Date.now().toString(36) + Math.floor(Math.random()*900).toString(36); }

  /* ---------- ITEMS ---------- */
  function getItems(){ return load(LS.ITEMS); }
  function getItemById(id){ return getItems().find(i => i.id === id) || null; }
  function addItem(item){
    const list = getItems();
    // item must contain name, price, cost, stock, code optional
    item.id = uid('ITM'); item.stock = Number(item.stock||0);
    list.push(item); save(LS.ITEMS, list); return item;
  }
  function updateItem(id, patch){
    const list = getItems().map(i => i.id === id ? Object.assign({}, i, patch) : i);
    save(LS.ITEMS, list);
  }
  function deleteItem(id){
    save(LS.ITEMS, getItems().filter(i => i.id !== id));
  }

  /* ---------- BUYERS ---------- */
  function getBuyers(){ return load(LS.BUYERS); }
  function addBuyer(b){
    const list = getBuyers();
    b.id = uid('BYR'); list.push(b); save(LS.BUYERS, list); return b;
  }
  function updateBuyer(id, patch){
    save(LS.BUYERS, getBuyers().map(b => b.id === id ? Object.assign({}, b, patch) : b));
  }
  function deleteBuyer(id){ save(LS.BUYERS, getBuyers().filter(b => b.id !== id)); }

  /* ---------- STOCK IN / OUT / OPNAME ---------- */
  function getStockIn(){ return load(LS.STOCK_IN); }
  function recordStockIn({ itemId, qty, price, date }){
    const list = getStockIn();
    const rec = { id: uid('IN'), itemId, qty: Number(qty), price: Number(price||0), date: date || new Date().toISOString().slice(0,10) };
    list.push(rec); save(LS.STOCK_IN, list);
    // update item stock
    const items = getItems();
    const it = items.find(x => x.id === itemId);
    if(it){ it.stock = Number(it.stock||0) + Number(qty); save(LS.ITEMS, items); }
    return rec;
  }

  function getStockOut(){ return load(LS.STOCK_OUT); }
  function recordStockOut({ itemId, qty, reason, date }){
    const list = getStockOut();
    const rec = { id: uid('OUT'), itemId, qty: Number(qty), reason: reason||'', date: date || new Date().toISOString().slice(0,10) };
    list.push(rec); save(LS.STOCK_OUT, list);
    // update item stock
    const items = getItems();
    const it = items.find(x => x.id === itemId);
    if(it){ it.stock = Number(it.stock||0) - Number(qty); if(it.stock < 0) it.stock = 0; save(LS.ITEMS, items); }
    return rec;
  }

  function getStockOpname(){ return load(LS.OPNAME); }
  function recordStockOpname(entries = []){ // entries: [{itemId, physical, reason}]
    const hist = getStockOpname();
    const items = getItems();
    entries.forEach(e => {
      const it = items.find(x => x.id === e.itemId);
      const system = it ? Number(it.stock||0) : 0;
      const physical = Number(e.physical||0);
      const diff = physical - system;
      const rec = { id: uid('SO'), itemId: e.itemId, system, physical, diff, reason: e.reason||'', date: new Date().toISOString().slice(0,10) };
      hist.push(rec);
      // adjust item stock
      if(it){ it.stock = physical; }
    });
    save(LS.OPNAME, hist);
    save(LS.ITEMS, items);
    return hist;
  }

  /* ---------- USERS (simple auth) ---------- */
  function getUsers(){
    let u = load(LS.USERS);
    if(!u || u.length === 0){
      // default admin + kasir
      u = [
        { id: uid('USR'), username: 'admin', password: 'admin', name: 'Administrator', role: 'admin' },
        { id: uid('USR'), username: 'kasir', password: 'kasir', name: 'Kasir', role: 'kasir' }
      ];
      save(LS.USERS, u);
    }
    return u;
  }
  function addUser(u){ u.id = uid('USR'); const list = getUsers(); list.push(u); save(LS.USERS, list); }
  function updateUser(id, patch){ save(LS.USERS, getUsers().map(x=>x.id===id?Object.assign({},x,patch):x)); }
  function deleteUser(id){ save(LS.USERS, getUsers().filter(x=>x.id!==id)); }

  function authenticate(username, password){
    const u = getUsers().find(x => x.username === username && x.password === password);
    if(!u) return null;
    // don't return password
    const { password:_, ...out } = u;
    return out;
  }

  /* ---------- SALES (core) ---------- */
  function getSales(){ return load(LS.SALES); }
  function createSale({ buyerId, items = [], cashier = 'kasir', payment = { method:'cash', paid:0 }, date }){
    // items: [{ itemId, qty, price }]
    if(!items || items.length === 0) throw new Error('Keranjang kosong');
    const sales = getSales();
    // compute totals and reduce stocks
    const itemsFull = items.map(it => {
      const item = getItemById(it.itemId);
      if(!item) throw new Error('Item tidak ditemukan');
      if(Number(it.qty) > Number(item.stock)) throw new Error('Stok tidak mencukupi untuk ' + (item.name||item.code||''));
      return { itemId: it.itemId, name: item.name, code: item.code||'', qty: Number(it.qty), price: Number(it.price||item.price||0), cost: Number(item.cost||0) };
    });

    const total = itemsFull.reduce((s,x) => s + x.price * x.qty, 0);
    // reduce stock
    const allItems = getItems();
    itemsFull.forEach(i => {
      const it = allItems.find(x => x.id === i.itemId);
      if(it){ it.stock = Number(it.stock||0) - Number(i.qty); if(it.stock < 0) it.stock = 0; }
    });
    save(LS.ITEMS, allItems);

    const sale = {
      id: uid('S'),
      date: date || new Date().toISOString().slice(0,10),
      buyerId: buyerId || null,
      buyerName: (buyerId ? (getBuyers().find(b => b.id === buyerId)?.name || '') : ''),
      items: itemsFull,
      total,
      cashier,
      payment // { method, paid, transferRef? }
    };
    sales.push(sale);
    save(LS.SALES, sales);
    return sale;
  }

  /* ---------- EXPORT / REPORT HELPERS ---------- */
  function exportSalesCSVRows(){
    const rows = [['Invoice','Tanggal','Pembeli','Total']];
    getSales().forEach(s => rows.push([s.id, s.date, s.buyerName||'', s.total]));
    return rows;
  }

  function exportProfitRows(from='', to=''){
    let sales = getSales();
    if(from) sales = sales.filter(s => s.date >= from);
    if(to) sales = sales.filter(s => s.date <= to);
    const rows = [['Invoice','Tanggal','Pendapatan','HPP','Laba']];
    const items = getItems();
    sales.forEach(s => {
      let hpp=0;
      s.items.forEach(it => {
        const cost = items.find(x => x.id===it.itemId)?.cost || 0;
        hpp += cost * it.qty;
      });
      const laba = s.total - hpp;
      rows.push([s.id, s.date, s.total, hpp, laba]);
    });
    return rows;
  }

  function salesSummaryByDay(){
    // return array [{date, revenue}]
    const map = {};
    getSales().forEach(s => {
      map[s.date] = (map[s.date] || 0) + Number(s.total || 0);
    });
    return Object.keys(map).sort().map(d => ({ date: d, revenue: map[d] }));
  }

  /* ---------- Public API ---------- */
  return {
    // items
    getItems, getItemById, addItem, updateItem, deleteItem,
    // buyers
    getBuyers, addBuyer, updateBuyer, deleteBuyer,
    // stock
    getStockIn, recordStockIn, getStockOut, recordStockOut, getStockOpname, recordStockOpname,
    // users
    getUsers, addUser, updateUser, deleteUser, authenticate,
    // sales
    getSales, createSale,
    // export
    exportSalesCSVRows, exportProfitRows, salesSummaryByDay
  };
})();
