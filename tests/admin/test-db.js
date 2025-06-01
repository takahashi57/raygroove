



// テスト結果の状態を更新
const testResults = {
    test1: { name: 'データベース接続', passed: false, message: '' },
    test2: { name: 'データ取得', passed: false, message: '' },
    test3: { name: 'データ作成', passed: false, message: '' },
    test4: { name: 'データ更新', passed: false, message: '' },
    test5: { name: 'データ削除', passed: false, message: '' }
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
    try {
        await testDatabaseConnection();
        await testDataFetch();
        const createdId = await testCreateData();
        
        if (createdId) {
            console.log('作成されたID:', createdId);
            await testUpdateData(createdId);
            await testDeleteData(createdId);
        } else {
            console.error('データの作成に失敗したため、更新・削除テストをスキップします');
        }
    } catch (error) {
        console.error('テスト実行中にエラーが発生しました:', error);
    }
}

// テストケース1: データベース接続テスト
async function testDatabaseConnection() {
    const testElement = document.getElementById('test1');
    const resultElement = document.getElementById('test1-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'データベース接続を確認しています...';
        
        // シンプルなクエリを実行して接続をテスト
        const { data, error } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .limit(1);

        console.log('Database connection test:', { data, error });

        if (error) throw error;
        
        testResults.test1.passed = true;
        testResults.test1.message = 'データベース接続に成功しました。';
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
    } catch (error) {
        console.error('データベース接続エラー:', error);
        testResults.test1.message = `データベース接続に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test1.message;
    }
}

// テストケース2: データ取得テスト
async function testDataFetch() {
    const testElement = document.getElementById('test2');
    const resultElement = document.getElementById('test2-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'データを取得しています...';
        
        // テスト用のデータを取得
        const { data, error } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        console.log('Data fetch test:', { data, error });

        if (error) throw error;
        
        testResults.test2.passed = true;
        testResults.test2.message = `データの取得に成功しました（${data.length}件）`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
    } catch (error) {
        console.error('データ取得エラー:', error);
        testResults.test2.message = `データの取得に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test2.message;
    }
}



// テストデータ
const TEST_CONTACT = {
    name: 'テスト 太郎',
    email: 'test@example.com',
    message: 'これはテスト用の問い合わせです。',
    status: 'pending',
    inquiry_type: 'general' // 追加: 一般的な問い合わせとして設定
};

// テストの実行
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded: テストを開始します');
    
    try {
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
    await testDatabaseConnection();
    await testDataFetch();
    const createdId = await testCreateData();
    if (createdId) {
        await testUpdateData(createdId);
        await testDeleteData(createdId);
    }
}

// ...（既存のtestDatabaseConnectionとtestDataFetch関数はそのまま）

// テストケース3: データ作成テスト
async function testCreateData() {
    const testElement = document.getElementById('test3');
    const resultElement = document.getElementById('test3-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'データを作成しています...';
        
        const { data, error } = await window.supabaseClient
            .from('contacts')
            .insert([TEST_CONTACT])
            .select();

        console.log('Create data test:', { data, error });

        if (error) throw error;
        if (!data || data.length === 0) throw new Error('作成されたデータがありません');
        
        testResults.test3.passed = true;
        testResults.test3.message = `データの作成に成功しました（ID: ${data[0].id}）`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
        
        return data[0].id; // 作成されたデータのIDを返す
    } catch (error) {
        console.error('データ作成エラー:', error);
        testResults.test3.message = `データの作成に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
        return null;
    } finally {
        resultElement.textContent = testResults.test3.message;
    }
}

// テストケース4: データ更新テスト
async function testUpdateData(contactId) {
    const testElement = document.getElementById('test4');
    const resultElement = document.getElementById('test4-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'データを更新しています...';
        
        // 更新前のデータを確認
        console.log('更新前のデータ確認 - ID:', contactId);
        const { data: beforeData, error: fetchError } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .eq('id', contactId)
            .single();

        if (fetchError) {
            console.error('更新前データ取得エラー:', fetchError);
            throw new Error(`更新前のデータ取得に失敗: ${fetchError.message}`);
        }
        if (!beforeData) {
            console.error('データが見つかりません - ID:', contactId);
            throw new Error(`ID ${contactId} のデータが見つかりません`);
        }

        console.log('更新前データ:', beforeData);
        
        const updates = {
            status: 'processed',
            inquiry_type: 'general'
        };

        console.log('更新を実行:', { updates, contactId });
        
        // 1. まず認証を行う
        const { data: { session }, error: authError } = await window.supabaseClient.auth.signInWithPassword({
            email: TEST_USER.email,
            password: TEST_USER.password
        });

        if (authError) {
            console.error('認証エラー:', authError);
            throw new Error(`認証に失敗しました: ${authError.message}`);
        }
        
        console.log('認証成功、ユーザー:', session.user);
        
        // 2. 現在のセッションを確認
        const { data: { session: currentSession } } = await window.supabaseClient.auth.getSession();
        console.log('現在のセッション:', currentSession);
        
        // 3. シンプルな更新を実行
        console.log('更新を実行:', { contactId, updates });
        
        // まず現在のデータを確認
        const { data: currentData } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .eq('id', contactId)
            .single();
            
        console.log('現在のデータ:', currentData);
        
        // 更新を実行（select('*') を削除）
        const { error: updateError } = await window.supabaseClient
            .from('contacts')
            .update(updates)
            .eq('id', contactId);

        console.log('更新結果:', { updateError });

        if (updateError) {
            console.error('更新エラー詳細:', updateError);
            
            // RLSエラーの場合
            if (updateError.message.includes('permission denied') || updateError.code === '42501') {
                console.warn('RLSによるアクセス拒否。別の方法を試します...');
                
                // ストアドプロシージャを使用した更新を試みる
                const { data: rpcData, error: rpcError } = await window.supabaseClient.rpc('update_contact_status', {
                    p_id: contactId,
                    p_status: 'processed',
                    p_inquiry_type: 'general'
                });
                
                if (rpcError) {
                    console.error('RPCエラー:', rpcError);
                    throw new Error(`RPCによる更新に失敗: ${rpcError.message}`);
                }
                
                console.log('RPCによる更新成功:', rpcData);
                
                // 更新後のデータを取得して確認
                const { data: rpcAfterData } = await window.supabaseClient
                    .from('contacts')
                    .select('*')
                    .eq('id', contactId)
                    .single();
                    
                console.log('RPC更新後のデータ:', rpcAfterData);
                
                // テスト結果を更新
                testResults.test4.passed = true;
                testResults.test4.message = `RPC経由でデータを更新しました（ID: ${contactId}）`;
                testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
                testElement.classList.add('border-green-200', 'bg-green-50');
                return;
            }
            
            throw updateError;
        }
        
        console.log('更新が正常に完了しました');
        
        // 更新後のデータを取得
        const { data: updatedContact, error: fetchUpdatedError } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .eq('id', contactId)
            .single();
            
        if (fetchUpdatedError) {
            throw new Error(`更新後のデータ取得に失敗: ${fetchUpdatedError.message}`);
        }
        
        console.log('更新後のデータ:', updatedContact);
        
        // 4. 更新が正しく適用されたか確認
        if (updatedContact.status !== 'processed' || updatedContact.inquiry_type !== 'general') {
            throw new Error(`データが正しく更新されていません。status: ${updatedContact.status}, inquiry_type: ${updatedContact.inquiry_type}`);
        }
        
        // テスト結果を更新
        testResults.test4.passed = true;
        testResults.test4.message = `データの更新に成功しました（ID: ${contactId}）`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
        
        // テスト結果は既に更新済みのため、ここでは何もしない
    } catch (error) {
        console.error('データ更新エラー:', error);
        testResults.test4.message = `データの更新に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test4.message;
    }
}

// テストケース5: データ削除テスト
async function testDeleteData(contactId) {
    const testElement = document.getElementById('test5');
    const resultElement = document.getElementById('test5-result');
    
    try {
        testElement.classList.add('border-yellow-200', 'bg-yellow-50');
        resultElement.textContent = 'データを削除しています...';
        
        const { data, error } = await window.supabaseClient
            .from('contacts')
            .delete()
            .eq('id', contactId)
            .select();

        console.log('Delete data test:', { data, error });

        if (error) throw error;
        
        // 削除されたことを確認
        const { data: verifyData, error: verifyError } = await window.supabaseClient
            .from('contacts')
            .select('*')
            .eq('id', contactId)
            .single();

        if (verifyData) {
            throw new Error('データが削除されていません');
        }

        testResults.test5.passed = true;
        testResults.test5.message = `データの削除に成功しました（ID: ${contactId}）`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-green-200', 'bg-green-50');
    } catch (error) {
        console.error('データ削除エラー:', error);
        testResults.test5.message = `データの削除に失敗しました: ${error.message}`;
        testElement.classList.remove('border-yellow-200', 'bg-yellow-50');
        testElement.classList.add('border-red-200', 'bg-red-50');
    } finally {
        resultElement.textContent = testResults.test5.message;
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