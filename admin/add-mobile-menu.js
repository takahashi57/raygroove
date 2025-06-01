const fs = require('fs');
const path = require('path');

// モバイルメニューボタンとオーバーレイのHTML
const mobileMenuHTML = `
    <!-- モバイル用メニューボタン -->
    <button class="menu-toggle md:hidden" id="menuToggle">
        <i class="fas fa-bars"></i>
    </button>
    <div class="overlay" id="overlay"></div>`;

// モバイル最適化用のCSSリンク
const mobileCSSLink = `
    <link rel="stylesheet" href="/admin/assets/css/mobile-optimize.css">`;

// モバイルメニュー用のJavaScript
const mobileJSScript = `
    <script src="/admin/assets/js/mobile-menu.js"></script>`;

// 処理対象のディレクトリ
const adminDir = __dirname;

// HTMLファイルを処理する関数
function processHTMLFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // ディレクトリの場合は再帰的に処理
            processHTMLFiles(filePath);
        } else if (path.extname(file) === '.html') {
            // HTMLファイルを処理
            processHTMLFile(filePath);
        }
    });
}

// 個々のHTMLファイルを処理する関数
function processHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // すでに処理済みの場合はスキップ
        if (content.includes('id="menuToggle"')) {
            console.log(`Skipped (already processed): ${filePath}`);
            return;
        }
        
        // bodyタンの直後にモバイルメニューボタンとオーバーレイを追加
        content = content.replace(/(<body[^>]*>)/, `$1\n${mobileMenuHTML}`);
        
        // headタグ内にCSSリンクを追加
        if (content.includes('</head>')) {
            content = content.replace('</head>', `    ${mobileCSSLink}\n</head>`);
        }
        
        // body閉じタグの直前にJavaScriptを追加
        if (content.includes('</body>')) {
            content = content.replace('</body>', `    ${mobileJSScript}\n</body>`);
        }
        
        // ファイルを保存
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Processed: ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// 処理を実行
console.log('Starting mobile optimization...');
processHTMLFiles(adminDir);
console.log('Mobile optimization completed!');
