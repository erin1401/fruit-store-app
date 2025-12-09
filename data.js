/* =========================================================
   data.js — FINAL VERSION (Juragan Buah POS)
   ========================================================= */

const KEY = {
  ITEMS: "jb_items",
  BUYERS: "jb_buyers",
  STOCK_IN: "jb_stock_in",
  STOCK_OUT: "jb_stock_out",
  OPNAME: "jb_opname",
  SALES: "jb_sales"
};

/* ---------- GENERIC STORAGE HANDLER ---------- */
function load(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ---------- CRUD GENERIC ---------- */
function addData(key, item) {
  const list = load(key);
  list.push(item);
  save(key, list);
}

function updateData(key, id, newData) {
  let list = load(key);
  list = list.map(x => (x.id === id ? newData : x));
  save(key, list);
}

function deleteData(key, id) {
  let list = load(key);
  list = list.filter(x => x.id !== id);
  save(key, list);
}

/* ---------- AUTONUMBER ID ---------- */
function newId(prefix = "ID") {
  return prefix + Date.now();
}
