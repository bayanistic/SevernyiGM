const tg = window.Telegram?.WebApp || {
  ready() {}, expand() {}, HapticFeedback: null,
  showPopup(options) { window.alert(options?.message || 'Готово'); },
  openTelegramLink(url) { window.open(url, '_blank', 'noopener,noreferrer'); }
};
tg.ready();
tg.expand();

document.addEventListener('DOMContentLoaded', () => {
    loadPage('home', document.querySelector('.nav-btn'));
});

async function loadPage(pageId, btnElement) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    } else {
        const navMap = {'home':0, 'events':1, 'shop':2, 'rules':3, 'rating':4, 'reviews':5};
        if (navMap[pageId] !== undefined) {
            document.querySelectorAll('.nav-btn')[navMap[pageId]].classList.add('active');
        }
    }

    const container = document.getElementById('page-content');
    container.innerHTML = '<div style="text-align:center; padding: 50px; color:#888;">Загрузка...</div>';
    
    try {
        const response = await fetch('pages/' + pageId + '.html');
        if (!response.ok) {
            throw new Error('Файл не найден: pages/' + pageId + '.html');
        }
        const html = await response.text();
        container.innerHTML = html;
        window.scrollTo(0, 0);
        
        if(tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="text-align:center; padding: 50px; color:#f5c518;"><h2>Ошибка загрузки страницы</h2><p>Проверьте, что файл pages/' + pageId + '.html существует</p></div>';
    }
}

function toggleForum(element) {
    element.classList.toggle('active');
    if(tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function copyPromo(code) {
    const fallback = () => {
        const field = document.createElement('textarea');
        field.value = code;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        try { document.execCommand('copy'); } catch (e) {}
        field.remove();
        tg.showPopup({
            title: 'Промокод готов',
            message: 'Промокод: ' + code,
            buttons: [{type: 'ok'}]
        });
    };
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(code).then(() => {
            tg.showPopup({ title: 'Скопировано!', message: 'Промокод ' + code + ' скопирован', buttons: [{type: 'ok'}] });
        }).catch(fallback);
    } else fallback();
}

function openTelegramChannel() {
    tg.openTelegramLink('https://t.me/Severnyi_GM');
}

function openTelegram() {
    tg.openTelegramLink('https://t.me/Severnyi_GM?direct');
}
