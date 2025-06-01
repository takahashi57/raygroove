// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.w-64');
    const overlay = document.getElementById('overlay');
    
    // メニューボタンとオーバーレイが存在する場合のみ初期化
    if (menuToggle && overlay) {
        // メニューボタンクリック時の処理
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sidebar) {
                sidebar.classList.toggle('open');
            }
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });
        
        // オーバーレイクリック時の処理
        overlay.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.remove('open');
            }
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // メニュー項目をクリックしたらメニューを閉じる
        if (sidebar) {
            const menuItems = sidebar.querySelectorAll('a');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    if (window.innerWidth <= 1024) {
                        sidebar.classList.remove('open');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    }
    
    // リサイズ時にメニューをリセット
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            if (sidebar) {
                sidebar.classList.remove('open');
            }
            if (overlay) {
                overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
});
