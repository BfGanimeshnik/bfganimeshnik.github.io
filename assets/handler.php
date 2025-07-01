<?php
// Файл: handler.php
header('Content-Type: text/plain; charset=utf-8');

// Логирование в файл
$logFile = 'payeer_payments.log';
$logData = date('[Y-m-d H:i:s]') . " IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
file_put_contents($logFile, $logData, FILE_APPEND);

// Основные параметры
$secretKey = 'your_payeer_secret_key'; // Замените на реальный секретный ключ
$data = $_POST;

// Проверка подписи
$sign = $data['m_sign'];
unset($data['m_sign']);

ksort($data);
$signStr = implode(':', $data) . ':' . $secretKey;
$calculatedSign = strtoupper(hash('sha256', $signStr));

if ($calculatedSign !== $sign) {
    // Неверная подпись
    file_put_contents($logFile, "ERROR: Invalid signature\n", FILE_APPEND);
    die($data['m_orderid'] . '|error');
}

// Проверка статуса платежа
if ($data['m_status'] !== 'success') {
    file_put_contents($logFile, "ERROR: Payment failed ({$data['m_desc']})\n", FILE_APPEND);
    die($data['m_orderid'] . '|error');
}

// Платеж успешен - обновляем подписку
$orderId = $data['m_orderid'];
$userId = explode('_', $orderId)[0]; // Извлекаем ID пользователя
$amount = $data['m_amount'];
$currency = $data['m_curr'];

// Здесь должна быть логика активации подписки
// Например, запрос к вашему API:
$apiUrl = 'https://your-panel-domain.com/api/activate-subscription';
$apiData = [
    'user_id' => $userId,
    'amount' => $amount,
    'currency' => $currency,
    'payment_id' => $data['m_operation_id'],
    'signature' => hash_hmac('sha256', $userId . $amount, $secretKey)
];

// Отправка запроса (пример с cURL)
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

// Логирование результата
if ($response === false) {
    file_put_contents($logFile, "ERROR: API request failed\n", FILE_APPEND);
    die($orderId . '|error');
}

$responseData = json_decode($response, true);
if ($responseData && $responseData['status'] === 'success') {
    file_put_contents($logFile, "SUCCESS: Subscription activated for user $userId\n", FILE_APPEND);
    die($orderId . '|success');
} else {
    $error = $responseData['error'] ?? 'Unknown API error';
    file_put_contents($logFile, "ERROR: $error\n", FILE_APPEND);
    die($orderId . '|error');
}