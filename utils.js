/* utils.js — Juragan Buah (FINAL) */
function loadJSON(k,d=null){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return d; } }
function saveJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function saveSession(u){ saveJSON('sessionUser', u); }
function loadSession(){ return loadJSON('sessionUser', null); }
function clearSession(){ localStorage.removeItem('sessionUser'); }

function checkLogin(redirectTo='login.html'){
  try{
    const s = loadSession();
    if(!s || !s.username){
      if(!location.pathname.endsWith('login.html')) location.href = redirectTo;
      return false;
    }
    const ub = document.getElementById('userBox');
    if(ub) ub.innerText = `👤 ${s.name || s.username} (${s.role})`;
    return true;
  }catch(e){
    if(!location.pathname.endsWith('login.html')) location.href = redirectTo;
    return false;
  }
}
function logout(){ if(!confirm('Keluar?')) return; clearSession(); location.href='login.html'; }

function formatRupiah(v=0){ return 'Rp ' + Number(v||0).toLocaleString('id-ID'); }
function formatTanggal(d){ if(!d) return ''; if(typeof d==='string' && d.length>=10) return d.slice(0,10); return new Date(d).toISOString().slice(0,10); }

function toast(msg, type='success'){
  let el = document.getElementById('globalToast') || document.getElementById('toast');
  if(!el){ el = document.createElement('div'); el.id='globalToast'; el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.style.background = (type==='error')? '#e74c3c' : (type==='warn'? '#f39c12' : '#27ae60');
  el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(()=> el.classList.remove('show'),2600);
}

function openModal(html){
  let bg = document.getElementById('globalModal');
  let box = document.getElementById('globalModalBox');
  if(!bg){ bg = document.createElement('div'); bg.id='globalModal'; bg.className='modal-bg'; box = document.createElement('div'); box.id='globalModalBox'; box.className='modal-box'; bg.appendChild(box); document.body.appendChild(bg); }
  box.innerHTML = html; bg.classList.add('show');
}
function closeModal(){ const bg=document.getElementById('globalModal'); if(bg) bg.classList.remove('show'); }

function showFab(cb,title='Tambah'){ let f=document.getElementById('globalFab'); if(!f){ f=document.createElement('div'); f.id='globalFab'; f.className='fab'; f.textContent='＋'; document.body.appendChild(f); } f.title=title; f.onclick=cb; f.classList.remove('hidden'); }
function hideFab(){ const f=document.getElementById('globalFab'); if(f) f.classList.add('hidden'); }

function exportCSV(filename, rows){ const csv = rows.map(r=> r.map(c=> typeof c==='string' && (c.includes(',')||c.includes('"')||c.includes('\n')) ? ('"'+c.replace(/"/g,'""')+'"') : c ).join(',')).join('\n'); const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function printReceiptHTML(htmlContent){ const w = window.open('','_blank','width=450,height=600'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Struk</title><link rel="stylesheet" href="styles.css"></head><body>${htmlContent}</body></html>`); w.document.close(); w.focus(); setTimeout(()=> w.print(), 400); }

function activateSidebarLinks(){ try{ const links = document.querySelectorAll('.sidebar a'); const cur = location.pathname.split('/').pop(); links.forEach(a=>{ const href = a.getAttribute('href')||''; const name = href.split('/').pop(); if(name===cur) a.classList.add('active'); else a.classList.remove('active'); }); }catch(e){} }

window.loadJSON = loadJSON; window.saveJSON = saveJSON; window.saveSession = saveSession; window.loadSession = loadSession; window.clearSession = clearSession;
window.checkLogin = checkLogin; window.logout = logout; window.toast = toast; window.openModal = openModal; window.closeModal = closeModal; window.showFab = showFab; window.hideFab = hideFab; window.exportCSV = exportCSV; window.printReceiptHTML = printReceiptHTML; window.formatRupiah = formatRupiah; window.formatTanggal = formatTanggal; window.activateSidebarLinks = activateSidebarLinks;
