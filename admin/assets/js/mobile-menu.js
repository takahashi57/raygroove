// モバイルメニュー制御
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.w-64');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!menuToggle || !sidebar || !overlay) {
        console.error('必要な要素が見つかりませんでした');
        return;
    }
    
    // メニューの表示/非表示を切り替える関数
    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }
    
    // メニューボタンクリック時の処理
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // オーバーレイクリック時の処理
    overlay.addEventListener('click', function() {
        if (sidebar.classList.contains('open')) {
            toggleMenu();
        }
    });
    
    // メニュー内のリンククリックでメニューを閉じる
    const menuLinks = sidebar.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                toggleMenu();
            }
        });
    });
    
    // ウィンドウリサイズ時の処理
    function handleResize() {
        if (window.innerWidth > 1024) {
            // デスクトップ表示の場合はメニューをリセット
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            sidebar.style.transform = '';
        } else {
            // モバイル表示の場合はメニューを非表示に
            if (!sidebar.classList.contains('open')) {
                sidebar.style.transform = 'translateX(-100%)';
            }
        }
    }
    
    // 初期表示時の処理
    handleResize();
    
    // リサイズイベントを追加
    window.addEventListener('resize', handleResize);
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
});
