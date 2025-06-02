// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.w-64');
    const overlay = document.createElement('div');
    overlay.id = 'mobile-overlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 hidden';
    document.body.appendChild(overlay);
    
    // メニューの表示/非表示を切り替える関数
    function toggleMenu() {
        if (sidebar) {
            sidebar.classList.toggle('open');
            // サイドバーの位置を調整（左からスライドイン）
            if (sidebar.classList.contains('open')) {
                sidebar.style.transform = 'translateX(0)';
            } else {
                sidebar.style.transform = 'translateX(-100%)';
            }
        }
        overlay.classList.toggle('hidden');
        document.body.style.overflow = overlay.classList.contains('hidden') ? '' : 'hidden';
    }
    
    // メニューボタンとオーバーレイが存在する場合のみ初期化
    if (menuToggle && overlay) {
        // メニューボタンクリック時の処理
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
        
        // オーバーレイクリック時の処理
        overlay.addEventListener('click', function() {
            toggleMenu();
        });
        
        // メニュー項目をクリックしたらメニューを閉じる
        if (sidebar) {
            const menuItems = sidebar.querySelectorAll('a, button');
            menuItems.forEach(item => {
                // サブメニューのトグルボタンの場合は処理をスキップ
                if (item.getAttribute('aria-expanded')) return;
                
                item.addEventListener('click', function(event) {
                    // リンクのデフォルト動作を維持するため、サブメニューでない場合のみ処理
                    if (!item.nextElementSibling || !item.nextElementSibling.classList.contains('submenu')) {
                        toggleMenu();
                    }
                });
            });
            
            // 初期状態でサイドバーを非表示に
            sidebar.style.transition = 'transform 0.3s ease-in-out';
            sidebar.style.transform = 'translateX(-100%)';
        }
    }
    
    // リサイズ時にメニューをリセット
    function handleResize() {
        if (window.innerWidth > 1024) {
            if (sidebar) {
                sidebar.classList.remove('open');
                sidebar.style.transform = '';
            }
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        } else {
            if (sidebar && !sidebar.classList.contains('open')) {
                sidebar.style.transform = 'translateX(-100%)';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // 初期表示時の処理
    handleResize();
});
