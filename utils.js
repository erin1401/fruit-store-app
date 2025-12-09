/* utils.js — helpers Juragan Buah (final) */

/* ---------- Storage helpers ---------- */
function loadJSON(k, d = null){
  try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return d; }
}
function saveJSON(k, v){ localStorage.setItem(k, JSON.stringify(v)); }

/* ---------- Formatting ---------- */
function formatRupiah(v = 0){
  return 'Rp ' + Number(v||0).toLocaleString('id-ID');
}
function formatTanggal(d){
  if(!d) return '';
  if(typeof d === 'string' && d.length === 10) return d;
  const dt = new Date(d);
  return dt.toISOString().slice(0,10);
}

/* ---------- UI: toast ---------- */
function toast(msg, type='success'){
  // find #globalToast or #toast
  let el = document.getElementById('globalToast') || document.getElementById('toast');
  if(!el){
    el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.background = type === 'error' ? '#e74c3c' : (type === 'warn' ? '#f39c12' : '#27ae60');
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=> el.classList.remove('show'), 2600);
}

/* ---------- Modal (global) ---------- */
function openModal(html){
  let bg = document.getElementById('globalModal');
  let box = document.getElementById('globalModalBox');
  if(!bg){
    bg = document.createElement('div'); bg.id='globalModal'; bg.className='modal-bg';
    box = document.createElement('div'); box.id='globalModalBox'; box.className='modal-box';
    bg.appendChild(box); document.body.appendChild(bg);
  }
  box.innerHTML = html;
  bg.classList.add('show');
}
function closeModal(){
  const bg = document.getElementById('globalModal');
  if(bg) bg.classList.remove('show');
}

/* ---------- FAB control ---------- */
function showFab(cb, title='Tambah'){
  const fab = document.getElementById('globalFab') || ( ()=> {
    const f = document.createElement('div'); f.id='globalFab'; f.className='fab'; document.body.appendChild(f); return f;
  })();
  fab.classList.remove('hidden');
  fab.title = title;
  fab.onclick = cb;
}
function hideFab(){
  const fab = document.getElementById('globalFab'); if(fab) fab.classList.add('hidden');
}

/* ---------- Export CSV ---------- */
function exportCSV(filename, rows){
  // rows: array of arrays
  const csv = rows.map(r=> r.map(c => {
    if(typeof c === 'string' && (c.includes(',')||c.includes('"')||c.includes('\n'))) {
      return '"' + c.replace(/"/g,'""') + '"';
    }
    return c;
  }).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ---------- Print Struk ---------- */
function printReceiptHTML(htmlContent){
  // open new window and print
  const w = window.open('', '_blank', 'width=400,height=600');
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Struk</title><link rel="stylesheet" href="styles.css"></head><body>${htmlContent}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>{ w.print(); /* w.close(); */ }, 400);
}

/* ---------- small helpers ---------- */
function formatRupiahNumber(n){ return Number(n||0).toLocaleString('id-ID'); }

/* expose some to global for pages */
window.loadJSON = loadJSON;
window.saveJSON = saveJSON;
window.toast = toast;
window.openModal = openModal;
window.closeModal = closeModal;
window.showFab = showFab;
window.hideFab = hideFab;
window.exportCSV = exportCSV;
window.printReceiptHTML = printReceiptHTML;
window.formatRupiah = formatRupiah;
window.formatTanggal = formatTanggal;
