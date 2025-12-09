/* data.js — DataStore final + sample seed */
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
  function load(k){ return JSON.parse(localStorage.getItem(k) || '[]'); }
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function uid(prefix='ID'){ return prefix + Date.now().toString(36) + Math.floor(Math.random()*900).toString(36); }

  // seed default data if empty
  function seedDefault(){
    if(!load(LS.ITEMS) || load(LS.ITEMS).length===0){
      const items = [
        { id: uid('ITM'), code: 'APL01', name: 'Apel Fuji', price: 12000, cost: 8000, stock: 30 },
        { id: uid('ITM'), code: 'ORG01', name: 'Jeruk Manis', price: 8000, cost: 5000, stock: 50 },
        { id: uid('ITM'), code: 'PAP01', name: 'Pepaya', price: 15000, cost: 9000, stock: 20 }
      ];
      save(LS.ITEMS, items);
    }
    if(!load(LS.BUYERS) || load(LS.BUYERS).length===0){
      const buyers = [
        { id: uid('BYR'), name: 'Umum', phone: '', address: '' },
        { id: uid('BYR'), name: 'Toko Buah Jaya', phone: '081234567890', address: 'Jl. Mangga 10' }
      ];
      save(LS.BUYERS, buyers);
    }
    if(!load(LS.USERS) || load(LS.USERS).length===0){
      const users = [
        { id: uid('USR'), username: 'admin', password: 'admin', name: 'Administrator', role: 'admin' },
        { id: uid('USR'), username: 'kasir', password: 'kasir', name: 'Kasir', role: 'kasir' }
      ];
      save(LS.USERS, users);
    }
    if(!load(LS.SALES) || load(LS.SALES).length===0){
      const items = load(LS.ITEMS);
      const sales = [
        { id: uid('S'), date: new Date().toISOString().slice(0,10), buyerId: null, buyerName: 'Umum', items: [{ itemId: items[0].id, name: items[0].name, qty: 2, price: items[0].price }], total: items[0].price * 2, cashier: 'kasir', payment: { method:'cash', paid: items[0].price * 2 } }
      ];
      // adjust stock
      const allItems = load(LS.ITEMS);
      allItems[0].stock = allItems[0].stock - 2;
      save(LS.ITEMS, allItems);
      save(LS.SALES, sales);
    }
  }

  seedDefault();

  // ITEMS
  function getItems(){ return load(LS.ITEMS); }
  function getItemById(id){ return getItems().find(i=>i.id===id) || null; }
  function addItem(it){ it.id = uid('ITM'); it.stock = Number(it.stock||0); save(LS.ITEMS, getItems().concat(it)); return it; }
  function updateItem(id, patch){ save(LS.ITEMS, getItems().map(i=> i.id===id ? Object.assign({}, i, patch) : i)); }
  function deleteItem(id){ save(LS.ITEMS, getItems().filter(i=>i.id!==id)); }

  // BUYERS
  function getBuyers(){ return load(LS.BUYERS); }
  function addBuyer(b){ b.id = uid('BYR'); save(LS.BUYERS, getBuyers().concat(b)); return b; }
  function updateBuyer(id, patch){ save(LS.BUYERS, getBuyers().map(b=> b.id===id ? Object.assign({}, b, patch) : b)); }
  function deleteBuyer(id){ save(LS.BUYERS, getBuyers().filter(b=>b.id!==id)); }

  // STOCK
  function getStockIn(){ return load(LS.STOCK_IN); }
  function recordStockIn({ itemId, qty, price, date }){
    const list = getStockIn(); const rec = { id: uid('IN'), itemId, qty: Number(qty), price: Number(price||0), date: date || new Date().toISOString().slice(0,10) };
    save(LS.STOCK_IN, list.concat(rec));
    const all = getItems(); const it = all.find(x=>x.id===itemId); if(it){ it.stock = Number(it.stock||0) + Number(qty); save(LS.ITEMS, all); }
    return rec;
  }

  function getStockOut(){ return load(LS.STOCK_OUT); }
  function recordStockOut({ itemId, qty, reason, date }){
    const list = getStockOut(); const rec = { id: uid('OUT'), itemId, qty: Number(qty), reason: reason||'', date: date||new Date().toISOString().slice(0,10) };
    save(LS.STOCK_OUT, list.concat(rec)); const all = getItems(); const it = all.find(x=>x.id===itemId); if(it){ it.stock = Number(it.stock||0) - Number(qty); if(it.stock<0) it.stock=0; save(LS.ITEMS, all); }
    return rec;
  }

  function getStockOpname(){ return load(LS.OPNAME); }
  function recordStockOpname(entries=[]){ const hist = getStockOpname(); const all = getItems(); entries.forEach(e=>{ const it = all.find(x=>x.id===e.itemId); const system = it ? Number(it.stock||0) : 0; const physical = Number(e.physical||0); const diff = physical - system; const rec = { id: uid('SO'), itemId: e.itemId, system, physical, diff, reason: e.reason||'', date: new Date().toISOString().slice(0,10) }; hist.push(rec); if(it) it.stock = physical; }); save(LS.OPNAME, hist); save(LS.ITEMS, all); return hist; }

  // USERS
  function getUsers(){ let u = load(LS.USERS); if(!u || u.length===0){ u = [{ id: uid('USR'), username:'admin', password:'admin', name:'Administrator', role:'admin' },{ id: uid('USR'), username:'kasir', password:'kasir', name:'Kasir', role:'kasir' }]; save(LS.USERS, u); } return u; }
  function addUser(u){ u.id = uid('USR'); save(LS.USERS, getUsers().concat(u)); }
  function updateUser(id, patch){ save(LS.USERS, getUsers().map(x=> x.id===id ? Object.assign({},x,patch) : x)); }
  function deleteUser(id){ save(LS.USERS, getUsers().filter(x=>x.id!==id)); }
  function authenticate(username, password){ const u = getUsers().find(x=>x.username===username && x.password===password); if(!u) return null; const { password:_, ...out } = u; return out; }

  // SALES
  function getSales(){ return load(LS.SALES); }
  function createSale({ buyerId, items = [], cashier='kasir', payment={method:'cash', paid:0}, date }){
    if(!items || items.length===0) throw new Error('Keranjang kosong');
    const allItems = getItems();
    const itemsFull = items.map(it=>{ const item = getItemById(it.itemId); if(!item) throw new Error('Item tidak ditemukan'); if(Number(it.qty) > Number(item.stock)) throw new Error('Stok tidak mencukupi untuk ' + (item.name||item.code||'')); return { itemId: it.itemId, name: item.name, code: item.code||'', qty: Number(it.qty), price: Number(it.price||item.price||0), cost: Number(item.cost||0) }; });
    const total = itemsFull.reduce((s,x)=> s + x.price * x.qty, 0);
    // reduce stock
    const all = getItems();
    itemsFull.forEach(i=>{ const it = all.find(x=>x.id===i.itemId); if(it){ it.stock = Number(it.stock||0) - Number(i.qty); if(it.stock < 0) it.stock = 0; } });
    save(LS.ITEMS, all);
    const sales = getSales(); const sale = { id: uid('S'), date: date || new Date().toISOString().slice(0,10), buyerId: buyerId||null, buyerName: (buyerId ? (getBuyers().find(b=>b.id===buyerId)?.name||'') : ''), items: itemsFull, total, cashier, payment };
    save(LS.SALES, sales.concat(sale)); return sale;
  }

  // REPORT HELPERS
  function exportSalesCSVRows(){ const rows = [['Invoice','Tanggal','Pembeli','Total']]; getSales().forEach(s=> rows.push([s.id, s.date, s.buyerName||'', s.total])); return rows; }
  function exportProfitRows(from='', to=''){ let sales = getSales(); if(from) sales = sales.filter(s=>s.date>=from); if(to) sales = sales.filter(s=>s.date<=to); const rows = [['Invoice','Tanggal','Pendapatan','HPP','Laba']]; const items = getItems(); sales.forEach(s=>{ let hpp=0; s.items.forEach(it=> { const cost = items.find(x=>x.id===it.itemId)?.cost || 0; hpp += cost * it.qty }); const laba = s.total - hpp; rows.push([s.id, s.date, s.total, hpp, laba]); }); return rows; }
  function salesSummaryByDay(){ const map={}; getSales().forEach(s=> map[s.date] = (map[s.date] || 0) + Number(s.total||0) ); return Object.keys(map).sort().map(d=> ({ date: d, revenue: map[d] })); }

  return {
    getItems, getItemById, addItem, updateItem, deleteItem,
    getBuyers, addBuyer, updateBuyer, deleteBuyer,
    getStockIn, recordStockIn, getStockOut, recordStockOut, getStockOpname, recordStockOpname,
    getUsers, addUser, updateUser, deleteUser, authenticate,
    getSales, createSale,
    exportSalesCSVRows, exportProfitRows, salesSummaryByDay
  };
})();
