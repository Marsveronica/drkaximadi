/* NAV */
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
    }
  });
}

/* ESPA modal */
(() => {
  const modalId = 'espa-modal';
  function openModal(modal){
    if(!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close')?.focus();
  }
  function closeModal(modal){
    if(!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    document.querySelector('.espa-trigger')?.focus();
  }
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.espa-trigger');
    const modal = document.getElementById(modalId);
    if(trigger){e.preventDefault();openModal(modal);return;}
    if(!modal || modal.hidden) return;
    if(e.target.closest('.modal-close')){e.preventDefault();closeModal(modal);return;}
    if(e.target === modal) closeModal(modal);
  });
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById(modalId);
    if(e.key === 'Escape' && modal && !modal.hidden) closeModal(modal);
  });
})();

/* Cookies */
const COOKIE_KEY='cookie_prefs_v1';
function getCookiePrefs(){try{const raw=localStorage.getItem(COOKIE_KEY);return raw?JSON.parse(raw):null}catch{return null}}
function setCookiePrefs(prefs){localStorage.setItem(COOKIE_KEY,JSON.stringify(prefs))}
function applyPrefs(){/* analytics intentionally not loaded */}
function buildCookieUI(){
  if(document.querySelector('.cookie-banner')||document.querySelector('.cookie-modal'))return;
  const banner=document.createElement('section'); banner.className='cookie-banner'; banner.setAttribute('role','region'); banner.setAttribute('aria-label','Επιλογές cookies');
  banner.innerHTML=`<p>Χρησιμοποιούμε απολύτως απαραίτητα cookies για τη λειτουργία του ιστοτόπου. Προαιρετικά cookies ενεργοποιούνται μόνο με τη συγκατάθεσή σας. <a class="cookie-link" href="cookies.html">Πολιτική Cookies</a> · <a class="cookie-link" href="privacy.html">Πολιτική Απορρήτου</a></p><div class="cookie-actions"><button class="cookie-btn primary" type="button" data-action="accept">Αποδοχή προαιρετικών</button><button class="cookie-btn" type="button" data-action="reject">Απόρριψη προαιρετικών</button><button class="cookie-btn" type="button" data-action="settings">Ρυθμίσεις</button></div>`;
  const modal=document.createElement('div'); modal.className='cookie-modal'; modal.hidden=true; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label','Ρυθμίσεις cookies');
  modal.innerHTML=`<div class="cookie-modal-card"><h2>Ρυθμίσεις cookies</h2><p class="cookie-small">Μπορείτε να αλλάξετε τις επιλογές σας οποιαδήποτε στιγμή.</p><div class="cookie-row"><div><strong>Απολύτως απαραίτητα</strong><div class="cookie-small">Απαιτούνται για λειτουργία & ασφάλεια.</div></div><div class="cookie-toggle"><input type="checkbox" checked disabled aria-label="Απολύτως απαραίτητα (πάντα ενεργά)"><label>Πάντα ενεργά</label></div></div><div class="cookie-row"><div><strong>Στατιστικά (Analytics)</strong><div class="cookie-small">Προαιρετικά.</div></div><div class="cookie-toggle"><input id="cookie-analytics" type="checkbox"><label for="cookie-analytics">Ενεργά</label></div></div><div class="cookie-actions"><button class="cookie-btn primary" type="button" data-action="save">Αποθήκευση</button><button class="cookie-btn" type="button" data-action="cancel">Ακύρωση</button></div></div>`;
  document.body.append(banner,modal);
  let lastFocusEl=null; const toggle=modal.querySelector('#cookie-analytics');
  const open=()=>{lastFocusEl=document.activeElement;modal.hidden=false;toggle.checked=!!getCookiePrefs()?.analytics;toggle.focus()};
  const close=()=>{modal.hidden=true;lastFocusEl?.focus?.()};
  banner.querySelector('[data-action="accept"]').onclick=()=>{const p={necessary:true,analytics:true,ts:Date.now()};setCookiePrefs(p);applyPrefs(p);banner.remove()};
  banner.querySelector('[data-action="reject"]').onclick=()=>{const p={necessary:true,analytics:false,ts:Date.now()};setCookiePrefs(p);applyPrefs(p);banner.remove()};
  banner.querySelector('[data-action="settings"]').onclick=open;
  modal.querySelector('[data-action="save"]').onclick=()=>{const p={necessary:true,analytics:!!toggle.checked,ts:Date.now()};setCookiePrefs(p);applyPrefs(p);close();banner.remove()};
  modal.querySelector('[data-action="cancel"]').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
  document.querySelectorAll('.cookie-settings-link').forEach(b=>b.addEventListener('click',open));
}
(() => {const prefs=getCookiePrefs();buildCookieUI();if(prefs){document.querySelector('.cookie-banner')?.remove();applyPrefs(prefs)}})();

/* Clinic image lightbox — one continuous gallery */
(() => {
  const box = document.getElementById('image-lightbox');
  if (!box) return;

  const image = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  const prevBtn = box.querySelector('.lightbox-prev');
  const nextBtn = box.querySelector('.lightbox-next');
  const counter = box.querySelector('.lightbox-counter');
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  if (!triggers.length) return;

  let currentIndex = 0;
  let lastTrigger = null;

  const show = (index) => {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    const thumb = trigger.querySelector('img');
    image.src = trigger.dataset.src || thumb?.src || '';
    image.alt = trigger.dataset.alt || thumb?.alt || '';
    if (counter) counter.textContent = `${currentIndex + 1} / ${triggers.length}`;
  };

  const open = (trigger, index) => {
    lastTrigger = trigger;
    show(index);
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    box.hidden = true;
    image.src = '';
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  triggers.forEach((btn, index) => btn.addEventListener('click', () => open(btn, index)));
  prevBtn?.addEventListener('click', () => show(currentIndex - 1));
  nextBtn?.addEventListener('click', () => show(currentIndex + 1));
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });

  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });

  let touchStartX = null;
  box.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0]?.clientX ?? null;
  }, {passive:true});
  box.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 50) return;
    show(currentIndex + (delta < 0 ? 1 : -1));
  }, {passive:true});
})();


/* V15 – keyboard accessibility hardening */
(() => {
  const getFocusable = (root) => Array.from(root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el => !el.hidden && el.offsetParent !== null);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const openDialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(d => !d.hidden && getComputedStyle(d).display !== 'none');
    if (!openDialog) return;
    const items = getFocusable(openDialog);
    if (!items.length) return;
    const first=items[0], last=items[items.length-1];
    if (e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
  });
  const hb=document.querySelector('.hamburger');
  if(hb){
    const sync=()=>hb.setAttribute('aria-label',hb.getAttribute('aria-expanded')==='true'?'Κλείσιμο μενού':'Άνοιγμα μενού');
    hb.addEventListener('click',()=>requestAnimationFrame(sync)); sync();
  }
})();
