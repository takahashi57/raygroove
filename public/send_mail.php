<?php
// エラーレポートを有効化（本番環境では削除するか、ログに出力するように変更してください）
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 日本語の設定
mb_language("japanese");
mb_internal_encoding("UTF-8");

// 送信先メールアドレス
$to = 'takahashi@a-seek.jp';

// メールの件名
$subject = '【RayGroove】お問い合わせがありました';

// フォームデータの取得
$company = isset($_POST['company']) ? $_POST['company'] : '';
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$inquiry_type = isset($_POST['inquiry_type']) ? $_POST['inquiry_type'] : '';
$event_date = isset($_POST['event_date']) ? $_POST['event_date'] : '';
$location = isset($_POST['location']) ? $_POST['location'] : '';
$budget = isset($_POST['budget']) ? $_POST['budget'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// 問い合わせ種別を日本語に変換
$inquiry_types = [
    'drone_show' => 'ドローンショー開催',
    'event_intro' => 'イベントのご紹介',
    'sponsor' => 'スポンサー・協賛に関して',
    'recruitment' => '採用に関して',
    'other' => 'その他'
];
$inquiry_type_text = isset($inquiry_types[$inquiry_type]) ? $inquiry_types[$inquiry_type] : $inquiry_type;

// 予算を日本語に変換
$budget_text = '';
if ($budget === '0-300') $budget_text = '0〜300万円';
elseif ($budget === '300-600') $budget_text = '300〜600万円';
elseif ($budget === '600-1000') $budget_text = '600〜1,000万円';
elseif ($budget === '1000-1500') $budget_text = '1,000〜1,500万円';
elseif ($budget === '1500-2000') $budget_text = '1,500〜2,000万円';
elseif ($budget === '2000-4000') $budget_text = '2,000〜4,000万円';
elseif ($budget === '4000-') $budget_text = '4,000万円〜';
elseif ($budget === 'other') $budget_text = 'その他・要相談';

// メール本文の作成
$body = "RayGroove お問い合わせフォームより以下の内容でお問い合わせがありました。\n\n";
$body .= "■お問い合わせ内容\n";
$body .= "種別: " . $inquiry_type_text . "\n";
$body .= "\n■お客様情報\n";
$body .= "会社名・団体名: " . $company . "\n";
$body .= "お名前: " . $name . "\n";
$body .= "メールアドレス: " . $email . "\n";
$body .= "電話番号: " . $phone . "\n";
$body .= "\n■イベント情報\n";
$body .= "イベント予定日時: " . $event_date . "\n";
$body .= "イベント開催予定地: " . $location . "\n";
$body .= "\n■ご予算の目安\n";
$body .= $budget_text . "\n";
$body .= "\n■ご相談内容・ご要望\n";
$body .= $message . "\n";

// メールヘッダーの設定
$headers = [];
$headers[] = 'From: ' . mb_encode_mimeheader('RayGroove お問い合わせフォーム') . ' <noreply@' . $_SERVER['HTTP_HOST'] . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';

// メール送信
$mail_sent = mb_send_mail($to, $subject, $body, implode("\r\n", $headers));

// 自動返信メールの送信（オプション）
if ($mail_sent) {
    $auto_reply_subject = '【RayGroove】お問い合わせありがとうございます';
    $auto_reply_body = $name . " 様\n\n";
    $auto_reply_body .= "この度は、RayGrooveにお問い合わせいただき、誠にありがとうございます。\n";
    $auto_reply_body .= "以下の内容でお問い合わせを承りました。\n\n";
    $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $auto_reply_body .= "【お問い合わせ内容】\n";
    $auto_reply_body .= $body;
    $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $auto_reply_body .= "内容を確認の上、2営業日以内に担当者よりご連絡いたします。\n";
    $auto_reply_body .= "しばらくお待ちください。\n\n";
    $auto_reply_body .= "※このメールは自動送信されています。\n";
    $auto_reply_body .= "※本メールに心当たりのない場合は、お手数ですがこのメールを破棄してください。\n\n";
    $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $auto_reply_body .= "RayGroove\n";
    $auto_reply_body .= "〒162-0067 東京都新宿区富久町16-6西倉LKビル4階\n";
    $auto_reply_body .= "TEL: 03-1234-5678\n";
    $auto_reply_body .= "Email: info@raygroove.jp\n";
    $auto_reply_body .= "URL: https://raygroove.jp\n";
    $auto_reply_body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    
    $auto_reply_headers = [];
    $auto_reply_headers[] = 'From: RayGroove <noreply@' . $_SERVER['HTTP_HOST'] . '>';
    $auto_reply_headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $auto_reply_headers[] = 'Content-Transfer-Encoding: 8bit';
    
    mb_send_mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
}

// レスポンスを返す
header('Content-Type: application/json');
echo json_encode([
    'success' => $mail_sent,
    'message' => $mail_sent ? 'メールを送信しました。' : 'メールの送信に失敗しました。'
]);
?>
