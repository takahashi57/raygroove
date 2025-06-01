// テスト結果の状態
const testResults = {
    test1: { name: 'ログイン機能', passed: false, message: '' },
    test2: { name: 'セッション管理', passed: false, message: '' }
};

// テストユーザーの認証情報
const TEST_USER = {
    email: 'takahashi@a-seek.jp',
    password: 'test'
};

// テストの実行
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded: テストを開始します');
    
    try {
        // Supabaseクライアントが利用可能か確認
        if (!window.supabaseClient) {
            throw new Error('Supabaseクライアントが初期化されていません');
        }
        
        console.log('Supabase client status:', window.supabaseClient ? 'OK' : 'Not OK');
        
        // テストを実行
        await runTests();
        updateTestSummary();
    } catch (error) {
        console.error('テストの実行中にエラーが発生しました:', error);
        const summaryText = document.getElementById('test-summary-text');
        if (summaryText) {
            summaryText.textContent = `エラー: ${error.message}`;
        }
    }
});

// テストを実行する関数
async function runTests() {
    await testLoginFunctionality();
    await testSessionManagement();
}

// テストケース1: ログイン機能のテスト
async function testLoginFunctionality() {
    const testElement = document.getElementById('test1');
    const resultElement = document.getElementById('test1-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'ログインを試みています...';
        
        console.log('Attempting to sign in with:', TEST_USER.email);
        
        // ✅ 修正: 正しいプロパティアクセス
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: TEST_USER.email,      // 修正: TEST_USER.email
            password: TEST_USER.password // 修正: TEST_USER.password
        });

        console.log('Sign in response:', { data, error });

        if (error) throw error;
        
        testResults.test1.passed = true;
        testResults.test1.message = 'ログインに成功しました。';
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
    } catch (error) {
        console.error('ログインエラー:', error);
        testResults.test1.message = `ログインに失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test1.message;
    }
}

// テストケース2: セッション管理のテスト
async function testSessionManagement() {
    const testElement = document.getElementById('test2');
    const resultElement = document.getElementById('test2-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'セッションを確認しています...';
        
        // 現在のセッションを取得
        const { data: { session }, error: sessionError } = 
            await window.supabaseClient.auth.getSession();
        
        console.log('Session check:', { session, error: sessionError });

        if (sessionError) throw sessionError;
        
        if (session) {
            testResults.test2.passed = true;
            testResults.test2.message = 'セッションの取得に成功しました。';
            testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
            testElement.classList.add('border-green-200', 'bg-green-50');
        } else {
            throw new Error('セッションが存在しません。');
        }
    } catch (error) {
        console.error('セッションエラー:', error);
        testResults.test2.message = `セッションの取得に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test2.message;
    }
}

// テスト結果のサマリーを更新
function updateTestSummary() {
    const statusElement = document.getElementById('test-status');
    const detailsElement = document.getElementById('test-details');
    const summaryText = document.getElementById('test-summary-text');
    
    if (!statusElement || !detailsElement || !summaryText) {
        console.error('必要な要素が見つかりませんでした');
        return;
    }
    
    const passedTests = Object.values(testResults).filter(test => test.passed).length;
    const totalTests = Object.keys(testResults).length;
    
    if (passedTests === totalTests) {
        statusElement.className = 'w-4 h-4 rounded-full bg-green-500 mr-2';
        summaryText.textContent = 'すべてのテストが成功しました';
        detailsElement.innerHTML = `
            <p class="text-green-700">✅ すべてのテストが成功しました (${passedTests}/${totalTests})</p>
        `;
    } else {
        statusElement.className = 'w-4 h-4 rounded-full bg-red-500 mr-2';
        summaryText.textContent = '一部のテストが失敗しました';
        detailsElement.innerHTML = `
            <p class="text-red-700">❌ 一部のテストが失敗しました (${passedTests}/${totalTests})</p>
            <ul class="list-disc pl-5 mt-2 space-y-1">
                ${Object.entries(testResults).map(([testName, result]) => 
                    `<li class="${result.passed ? 'text-green-700' : 'text-red-700'}">
                        ${result.name}: ${result.passed ? '✓' : '✗'} ${result.message}
                    </li>`
                ).join('')}
            </ul>
        `;
    }
}