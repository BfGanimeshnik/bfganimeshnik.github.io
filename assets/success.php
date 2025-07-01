<?php
// Файл: success.php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Оплата успешно завершена</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #43cea2, #185a9d);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            color: white;
            text-align: center;
        }
        .container {
            background: rgba(0, 0, 0, 0.7);
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: #43cea2;
        }
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .icon {
            font-size: 5rem;
            margin-bottom: 20px;
            color: #4CAF50;
        }
        .btn {
            display: inline-block;
            background: #43cea2;
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
        }
        .btn:hover {
            background: #36a18a;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✓</div>
        <h1>Оплата успешно завершена!</h1>
        <p>Спасибо за покупку подписки на Telegram-панель. Ваш доступ был активирован.</p>
        <p>Вы можете начать использовать все функции панели управления прямо сейчас.</p>
        <a href="https://your-panel-domain.com/dashboard" class="btn">Перейти в панель управления</a>
        
        <script>
            // Отправляем событие в Google Analytics (если нужно)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase', {
                    transaction_id: '<?php echo $_GET['m_orderid'] ?? ''; ?>',
                    value: <?php echo $_GET['m_amount'] ?? 0; ?>,
                    currency: '<?php echo $_GET['m_curr'] ?? 'USD'; ?>'
                });
            }
            
            // Перенаправление через 10 секунд
            setTimeout(() => {
                window.location.href = 'https://your-panel-domain.com/dashboard';
            }, 10000);
        </script>
    </div>
</body>
</html>