// Simple To-Do list for "Hakkımda — Merak Ettikleriniz"
// Stores tasks in localStorage under key 'hakkimdaTodos'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const sendBtn = document.getElementById('send-btn');
  const alertDiv = document.getElementById('send-alert');

  let todos = JSON.parse(localStorage.getItem('hakkimdaTodos') || '[]');

  function save() {
    localStorage.setItem('hakkimdaTodos', JSON.stringify(todos));
  }

  function showAlert(message, type = 'success', timeout = 2500) {
    if (!alertDiv) return;
    alertDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}</div>`;
    if (timeout > 0) setTimeout(() => { alertDiv.innerHTML = ''; }, timeout);
  }

  function render() {
    list.innerHTML = '';
    todos.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      if (task.new) li.classList.add('new-item');


      const left = document.createElement('div');
      left.className = 'd-flex align-items-center gap-3';

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = !!task.done;
      chk.className = 'form-check-input';
      chk.addEventListener('change', () => {
        todos[idx].done = chk.checked;
        save();
        render();
      });

      const text = document.createElement('span');
      text.textContent = task.text;
      if (task.done) text.classList.add('text-decoration-line-through', 'text-muted');

      left.appendChild(chk);
      left.appendChild(text);

      if (task.sent) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success ms-2';
        badge.textContent = 'Gönderildi';
        left.appendChild(badge);
      }

      const right = document.createElement('div');

      const del = document.createElement('button');
      del.className = 'btn btn-sm btn-outline-danger';
      del.textContent = 'Sil';
      del.addEventListener('click', () => {
        todos.splice(idx, 1);
        save();
        render();
      });

      right.appendChild(del);

      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', () => {
    const val = input.value.trim();
    if (!val) return;
    const newId = Date.now();
    todos.push({ id: newId, text: val, done: false, sent: false, new: true });
    input.value = '';
    save();
    render();
    setTimeout(() => {
      const i = todos.findIndex(t => t.id === newId);
      if (i >= 0) { todos[i].new = false; save(); render(); }
    }, 6000);
  });

  document.getElementById('add-btn').addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    const newId = Date.now();
    todos.push({ id: newId, text: val, done: false, sent: false, new: true });
    input.value = '';
    save();
    render();
    setTimeout(() => {
      const i = todos.findIndex(t => t.id === newId);
      if (i >= 0) { todos[i].new = false; save(); render(); }
    }, 6000);
    input.focus();
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (!todos || todos.length === 0) {
        showAlert('Gönderilecek madde yok.', 'warning');
        return;
      }
      sendBtn.disabled = true;
      showAlert('Gönderiliyor...', 'info', 0);

      // Simulate sending to a database and then clear items
      setTimeout(() => {
        // Clear all items after sending
        todos = [];
        save();
        render();
        showAlert('Harun Bey e Mesajınız İletildi.', 'success');
        sendBtn.disabled = false;
      }, 800);
    });
  }

  render();

  // Image zoom overlay: open clicked .zoomable images centered at ~65% viewport
  (function(){
    const overlay = document.createElement('div');
    overlay.id = 'img-overlay';
    overlay.innerHTML = '<div class="img-overlay-content" role="dialog" aria-modal="true"><img src="" alt=""><button id="img-overlay-close" class="btn btn-sm btn-light" aria-label="Kapat">×</button></div>';
    document.body.appendChild(overlay);
    const imgEl = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('#img-overlay-close');

    function open(src, alt, circular){
      imgEl.src = src;
      imgEl.alt = alt || '';
      if (circular) overlay.classList.add('circular'); else overlay.classList.remove('circular');
      overlay.classList.add('open');
      // add small delay to let CSS animation run
      setTimeout(()=> overlay.classList.add('visible'), 10);
      // focus for accessibility
      imgEl.focus();
    }
    function close(){
      overlay.classList.remove('open');
      overlay.classList.remove('circular');
      setTimeout(()=> { imgEl.src = ''; overlay.classList.remove('visible'); }, 250);
    }

    document.addEventListener('click', (e)=>{
      const t = e.target;
      if (t && t.matches && t.matches('img.zoomable')){
        open(t.src, t.alt, !!t.closest('.profile-frame, .profile-circle'));
      }
      // close when clicking overlay background or close button
      if (t && (t.id === 'img-overlay' || t.id === 'img-overlay-close')) {
        close();
      }
    });

    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
      // allow Enter/Space to open focused image
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.matches && document.activeElement.matches('img.zoomable')){
        e.preventDefault();
        const active = document.activeElement;
        open(active.src, active.alt, !!active.closest('.profile-frame, .profile-circle'));
      }
    });

    // Ensure direct click/keyboard listeners on zoomable images (fixes cases where clicks don't reach document handler)
    function bindZoomableImages(){
      document.querySelectorAll('img.zoomable').forEach(img => {
        img.style.cursor = img.style.cursor || 'zoom-in';
        img.setAttribute('tabindex', img.getAttribute('tabindex') || '0');
        img.addEventListener('click', (ev)=>{
          ev.preventDefault();
          open(img.src, img.alt, !!img.closest('.profile-frame, .profile-circle'));
        });
        img.addEventListener('keydown', (ev)=>{
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            open(img.src, img.alt, !!img.closest('.profile-frame, .profile-circle'));
          }
        });
      });
    }

    // Initial bind and re-bind if needed later
    bindZoomableImages();

  })();
});
