<?php
// Файл: fail.php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ошибка оплаты</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #ff416c, #ff4b2b);
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
            color: #ff416c;
        }
        p {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .icon {
            font-size: 5rem;
            margin-bottom: 20px;
            color: #ff4b2b;
        }
        .btn {
            display: inline-block;
            background: #ff416c;
            color: white;
            padding: 12px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
        }
        .btn:hover {
            background: #e03a5f;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .btn-secondary {
            background: #4a5568;
        }
        .btn-secondary:hover {
            background: #2d3748;
        }
        .error-details {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
            font-family: monospace;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✗</div>
        <h1>Ошибка при оплате</h1>
        <p>К сожалению, во время обработки платежа произошла ошибка.</p>
        <p>Пожалуйста, попробуйте еще раз или свяжитесь со службой поддержки.</p>
        
        <?php if (!empty($_GET['m_desc'])): ?>
            <div class="error-details">
                <strong>Детали ошибки:</strong><br>
                <?php echo base64_decode($_GET['m_desc']); ?>
            </div>
        <?php endif; ?>
        
        <div>
            <a href="https://your-panel-domain.com/subscribe" class="btn">Попробовать снова</a>
            <a href="https://your-panel-domain.com/support" class="btn btn-secondary">Служба поддержки</a>
        </div>
        
        <script>
            // Отправляем событие в Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'payment_failed', {
                    transaction_id: '<?php echo $_GET['m_orderid'] ?? ''; ?>',
                    reason: '<?php echo $_GET['m_desc'] ?? 'unknown'; ?>'
                });
            }
        </script>
    </div>
</body>
</html>