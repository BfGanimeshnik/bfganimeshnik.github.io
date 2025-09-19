document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const productsContainer = document.getElementById('products-container');
    const totalAmountSpan = document.getElementById('total-amount');
    const productsTotalSpan = document.getElementById('products-total');
    const savePurchaseBtn = document.getElementById('save-purchase');
    const resetCalculatorBtn = document.getElementById('reset-calculator');
    const purchaseHistoryBody = document.getElementById('purchase-history-body');
    const customAmountsList = document.getElementById('custom-amounts-list');
    const addCustomAmountBtn = document.getElementById('add-custom-amount');
    const customAmountInput = document.getElementById('custom-amount-input');
    const productSearchInput = document.getElementById('product-search');
    const salesHistoryBody = document.getElementById('sales-history-body');
    const salesSearchInput = document.getElementById('sales-search');
    const totalRevenueSpan = document.getElementById('total-revenue');
    const totalCostSpan = document.getElementById('total-cost');
    const totalProfitSpan = document.getElementById('total-profit');
    const totalProfitabilitySpan = document.getElementById('total-profitability');
    const saleProductNameInput = document.getElementById('sale-product-name');
    const saleProductPriceInput = document.getElementById('sale-product-price');
    const saleProductQuantityInput = document.getElementById('sale-product-quantity');
    const saleTaxInput = document.getElementById('sale-tax');
    const calculateSaleBtn = document.getElementById('calculate-sale');
    const addSaleHistoryBtn = document.getElementById('add-sale-history');
    const profitSection = document.getElementById('profit-section');
    const saleGrossSpan = document.getElementById('sale-gross');
    const saleTaxAmountSpan = document.getElementById('sale-tax-amount');
    const saleNetSpan = document.getElementById('sale-net');
    const saleProfitSpan = document.getElementById('sale-profit');
    const saleProfitabilitySpan = document.getElementById('sale-profitability');
    const myProductsTab = document.getElementById('my-products');
    const customProductsList = document.getElementById('custom-products-list');
    const clearMyProductsBtn = document.getElementById('clear-my-products');
    const bulkUploadTextarea = document.getElementById('bulk-upload-textarea');
    const bulkUploadButton = document.getElementById('bulk-upload-button');
    const balanceAmountSpan = document.getElementById('balance-amount');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const saveSettingsBtn = document.getElementById('save-settings');
    const initialBalanceInput = document.getElementById('initial-balance');
    const auctionCommissionInput = document.getElementById('auction-commission');
    const themeColorSelect = document.getElementById('theme-color');

    let totalProductsCost = 0;
    let productsData = [];
    let purchaseHistory = [];
    let salesHistory = [];
    let customAmounts = [];
    let customProducts = [];
    let balance = 0;
    let auctionCommission = 5;

    // --- UTILITY FUNCTIONS ---
    function formatNumber(num) {
        return Math.round(num).toLocaleString('ru-RU');
    }

    function formatNumberWithDecimals(num) {
        return num.toFixed(2).replace(/\.00$/, '');
    }

    function toReadablePrice(num) {
        if (num >= 1000000) {
            return (num / 1000000).toLocaleString('ru-RU') + 'кк';
        }
        if (num >= 1000) {
            return (num / 1000).toLocaleString('ru-RU') + 'к';
        }
        return num.toLocaleString('ru-RU');
    }

    function parsePrice(priceStr) {
        priceStr = priceStr.toLowerCase().replace(/\s/g, '').replace(',', '.');
        if (priceStr.endsWith('кк')) {
            return parseFloat(priceStr.slice(0, -2)) * 1000000;
        }
        if (priceStr.endsWith('к')) {
            return parseFloat(priceStr.slice(0, -1)) * 1000;
        }
        return parseFloat(priceStr);
    }

    // --- BULK UPLOAD FUNCTIONALITY ---
    function parseAndAddProducts() {
        const text = bulkUploadTextarea.value;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        const newItems = [];
        const namePattern = /^(?:\[?(.*?)\]?)/;
        const pricePattern = /(?:по|-|\s)\s*([\d\s,.]+)(?:[кк]|\/|$)/;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            const nameMatch = trimmedLine.match(namePattern);
            const priceMatch = trimmedLine.match(pricePattern);

            if (nameMatch && priceMatch) {
                const productName = nameMatch[1].trim();
                const pricePart = priceMatch[1].trim();
                const prices = pricePart.split(/[\s\/]+/).map(p => parsePrice(p));

                const validPrices = prices.filter(price => !isNaN(price) && price > 0);

                if (productName && validPrices.length > 0) {
                    const finalPrice = validPrices[0]; // Use the first valid price
                    const discountedPrice = finalPrice * 0.8;
                    const roundedPrice = parseFloat(discountedPrice.toFixed(2));
                    
                    newItems.push({
                        name: productName,
                        price: roundedPrice
                    });
                }
            } else {
                console.warn(`Could not parse line: ${trimmedLine}`);
            }
        });
        
        customProducts = [...customProducts, ...newItems];
        saveCustomProducts();
        renderCustomProducts();
        showNotification(`${newItems.length} товаров добавлено.`);
        bulkUploadTextarea.value = '';
    }

    function saveCustomProducts() {
        localStorage.setItem('customProducts', JSON.stringify(customProducts));
    }

    function renderCustomProducts() {
        customProductsList.innerHTML = '';
        if (customProducts.length === 0) {
            customProductsList.innerHTML = `<div class="custom-amount-item">
                <span>Нет своих товаров.</span>
            </div>`;
            return;
        }

        customProducts.forEach((product, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'custom-amount-item';
            itemElement.innerHTML = `
                <span>${product.name}</span>
                <span>${formatNumber(product.price)} ₽</span>
                <button class="btn-danger remove-custom-product" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            customProductsList.appendChild(itemElement);
        });

        document.querySelectorAll('.remove-custom-product').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                customProducts.splice(index, 1);
                saveCustomProducts();
                renderCustomProducts();
                showNotification('Товар удален.');
            });
        });
    }

    function clearMyProducts() {
        if (confirm("Вы уверены, что хотите удалить все свои товары?")) {
            customProducts = [];
            saveCustomProducts();
            renderCustomProducts();
            showNotification('Все товары удалены.', true);
        }
    }

    // --- CORE FUNCTIONALITY ---
    function saveAllData() {
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
        localStorage.setItem('customAmounts', JSON.stringify(customAmounts));
        localStorage.setItem('balance', JSON.stringify(balance));
    }

    function loadAllData() {
        const storedPurchaseHistory = localStorage.getItem('purchaseHistory');
        const storedSalesHistory = localStorage.getItem('salesHistory');
        const storedCustomAmounts = localStorage.getItem('customAmounts');
        const storedCustomProducts = localStorage.getItem('customProducts');
        const storedBalance = localStorage.getItem('balance');

        if (storedPurchaseHistory) purchaseHistory = JSON.parse(storedPurchaseHistory);
        if (storedSalesHistory) salesHistory = JSON.parse(storedSalesHistory);
        if (storedCustomAmounts) customAmounts = JSON.parse(storedCustomAmounts);
        if (storedCustomProducts) customProducts = JSON.parse(storedCustomProducts);
        if (storedBalance) balance = JSON.parse(storedBalance);
    }
    
    function loadSettings() {
        const storedInitialBalance = localStorage.getItem('initialBalance');
        const storedAuctionCommission = localStorage.getItem('auctionCommission');
        const storedThemeColor = localStorage.getItem('themeColor');
        if (storedInitialBalance) {
            initialBalanceInput.value = storedInitialBalance;
            balance = parseFloat(storedInitialBalance) || 0;
            updateBalanceDisplay();
        }
        if (storedAuctionCommission) {
            auctionCommissionInput.value = storedAuctionCommission;
            auctionCommission = parseFloat(storedAuctionCommission) || 5;
        }
        if (storedThemeColor) {
            themeColorSelect.value = storedThemeColor;
            applyTheme(storedThemeColor);
        }
    }
    
    function applyTheme(theme) {
        const root = document.documentElement;
        switch (theme) {
            case 'purple':
                root.style.setProperty('--accent-primary', '#7b68ee');
                root.style.setProperty('--accent-secondary', '#8a2be2');
                root.style.setProperty('--accent-tertiary', '#9370db');
                break;
            case 'green':
                root.style.setProperty('--accent-primary', '#00c853');
                root.style.setProperty('--accent-secondary', '#64dd17');
                root.style.setProperty('--accent-tertiary', '#1de9b6');
                break;
            case 'red':
                root.style.setProperty('--accent-primary', '#ff1744');
                root.style.setProperty('--accent-secondary', '#d50000');
                root.style.setProperty('--accent-tertiary', '#ff8a80');
                break;
            default:
                root.style.setProperty('--accent-primary', '#477def');
                root.style.setProperty('--accent-secondary', '#7b68ee');
                root.style.setProperty('--accent-tertiary', '#00c6ff');
                break;
        }
    }

    function updateBalanceDisplay() {
        balanceAmountSpan.textContent = formatNumber(balance) + ' ₽';
    }

    async function fetchProducts() {
        try {
            const response = await fetch('data/items.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            productsData = data.items;
            renderProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            showNotification('Ошибка загрузки товаров. Проверьте файл data/items.json', true);
        }
    }

    function renderProducts(filter = '') {
        productsContainer.innerHTML = '';
        const filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p class="text-secondary" style="text-align: center;">Товары не найдены.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatNumber(product.price)} ₽</div>
                <input type="number" class="product-input" placeholder="Кол-во" data-price="${product.price}">
            `;
            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll('.product-input').forEach(input => {
            input.addEventListener('input', updateSummary);
        });
    }

    function updateSummary() {
        totalProductsCost = 0;
        document.querySelectorAll('.product-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            totalProductsCost += quantity * price;
        });

        const customAmountsTotal = customAmounts.reduce((sum, amount) => sum + amount.value, 0);
        const overallTotal = totalProductsCost + customAmountsTotal;

        productsTotalSpan.textContent = formatNumber(totalProductsCost) + ' ₽';
        totalAmountSpan.textContent = formatNumber(overallTotal) + ' ₽';
    }

    function addCustomAmount() {
        const value = parseFloat(customAmountInput.value);
        if (!isNaN(value) && value > 0) {
            customAmounts.push({
                value: value,
                date: new Date().toLocaleString()
            });
            renderCustomAmounts();
            updateSummary();
            customAmountInput.value = '';
            showNotification('Сумма добавлена.');
        } else {
            showNotification('Введите корректную сумму.', true);
        }
    }

    function renderCustomAmounts() {
        customAmountsList.innerHTML = '';
        if (customAmounts.length === 0) {
            customAmountsList.innerHTML = `<div class="custom-amount-item"><span>Нет дополнительных сумм.</span></div>`;
            return;
        }
        customAmounts.forEach((amount, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'custom-amount-item';
            itemElement.innerHTML = `
                <span>Доп. сумма:</span>
                <span>${formatNumber(amount.value)} ₽</span>
                <button class="btn-danger remove-custom-amount" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            `;
            customAmountsList.appendChild(itemElement);
        });
        document.querySelectorAll('.remove-custom-amount').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                customAmounts.splice(index, 1);
                renderCustomAmounts();
                updateSummary();
                showNotification('Сумма удалена.');
            });
        });
    }

    function savePurchase() {
        const purchaseItems = [];
        document.querySelectorAll('.product-input').forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const price = parseFloat(input.dataset.price);
                const name = input.closest('.product-card').querySelector('.product-name').textContent;
                purchaseItems.push({
                    name,
                    price,
                    quantity
                });
            }
        });

        if (purchaseItems.length === 0 && customAmounts.length === 0) {
            showNotification('Выберите хотя бы один товар или добавьте сумму.', true);
            return;
        }

        const overallTotal = totalProductsCost + customAmounts.reduce((sum, amount) => sum + amount.value, 0);
        const purchaseRecord = {
            date: new Date().toLocaleString(),
            items: purchaseItems,
            customAmounts: customAmounts,
            total: overallTotal
        };

        purchaseHistory.unshift(purchaseRecord);
        balance -= overallTotal;
        saveAllData();
        renderPurchaseHistory();
        updateBalanceDisplay();
        resetCalculator();
        showNotification('Покупка сохранена.');
    }

    function renderPurchaseHistory(filter = '') {
        purchaseHistoryBody.innerHTML = '';
        if (purchaseHistory.length === 0) {
            purchaseHistoryBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">История покупок пуста.</td></tr>';
            return;
        }
        purchaseHistory.filter(purchase => purchase.items.some(item => item.name.toLowerCase().includes(filter.toLowerCase()))).forEach((purchase, index) => {
            const row = document.createElement('tr');
            const itemsList = purchase.items.map(item => `${item.name} (${item.quantity})`).join(', ');
            row.innerHTML = `
                <td>${purchase.date}</td>
                <td>${itemsList}</td>
                <td>${formatNumber(purchase.total)} ₽</td>
                <td><button class="btn-danger remove-purchase" data-index="${index}"><i class="fas fa-trash-alt"></i></button></td>
            `;
            purchaseHistoryBody.appendChild(row);
        });
        document.querySelectorAll('.remove-purchase').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const total = purchaseHistory[index].total;
                balance += total;
                purchaseHistory.splice(index, 1);
                saveAllData();
                renderPurchaseHistory();
                updateBalanceDisplay();
                showNotification('Покупка удалена из истории.');
            });
        });
    }

    function resetCalculator() {
        document.querySelectorAll('.product-input').forEach(input => input.value = '');
        customAmountInput.value = '';
        totalProductsCost = 0;
        customAmounts = [];
        updateSummary();
        renderCustomAmounts();
        showNotification('Калькулятор сброшен.');
    }

    function calculateSale() {
        const productName = saleProductNameInput.value;
        const price = parseFloat(saleProductPriceInput.value) || 0;
        const quantity = parseFloat(saleProductQuantityInput.value) || 1;
        const tax = parseFloat(saleTaxInput.value) || 0;
        
        if (!productName || price <= 0 || quantity <= 0) {
            showNotification('Введите корректные данные для расчета.', true);
            return;
        }

        const grossAmount = price * quantity;
        const taxAmount = grossAmount * (tax / 100);
        const netAmount = grossAmount - taxAmount;

        let cost = 0;
        const purchasedItem = purchaseHistory.find(ph => ph.items.some(item => item.name.toLowerCase() === productName.toLowerCase()));
        if (purchasedItem) {
            const item = purchasedItem.items.find(i => i.name.toLowerCase() === productName.toLowerCase());
            if (item) {
                cost = item.price * quantity;
            }
        } else {
            const customProduct = customProducts.find(cp => cp.name.toLowerCase() === productName.toLowerCase());
            if (customProduct) {
                cost = customProduct.price * quantity;
            }
        }
        
        const profit = netAmount - cost;
        const profitability = cost > 0 ? (profit / cost) * 100 : 0;

        saleGrossSpan.textContent = formatNumber(grossAmount) + ' ₽';
        saleTaxAmountSpan.textContent = formatNumber(taxAmount) + ' ₽';
        saleNetSpan.textContent = formatNumber(netAmount) + ' ₽';
        saleProfitSpan.textContent = formatNumber(profit) + ' ₽';
        saleProfitabilitySpan.textContent = formatNumberWithDecimals(profitability) + '%';
        
        saleProfitSpan.className = profit >= 0 ? 'positive' : 'negative';
        saleProfitabilitySpan.className = profitability >= 0 ? 'positive' : 'negative';

        profitSection.style.display = 'block';
    }

    function addSaleToHistory() {
        const productName = saleProductNameInput.value;
        const price = parseFloat(saleProductPriceInput.value) || 0;
        const quantity = parseFloat(saleProductQuantityInput.value) || 1;
        const tax = parseFloat(saleTaxInput.value) || 0;

        if (!productName || price <= 0 || quantity <= 0) {
            showNotification('Введите корректные данные для сохранения.', true);
            return;
        }
        
        const grossAmount = price * quantity;
        const taxAmount = grossAmount * (tax / 100);
        const netAmount = grossAmount - taxAmount;

        let cost = 0;
        const purchasedItem = purchaseHistory.find(ph => ph.items.some(item => item.name.toLowerCase() === productName.toLowerCase()));
        if (purchasedItem) {
            const item = purchasedItem.items.find(i => i.name.toLowerCase() === productName.toLowerCase());
            if (item) {
                cost = item.price * quantity;
            }
        } else {
             const customProduct = customProducts.find(cp => cp.name.toLowerCase() === productName.toLowerCase());
            if (customProduct) {
                cost = customProduct.price * quantity;
            }
        }
        
        const profit = netAmount - cost;

        const saleRecord = {
            date: new Date().toLocaleString(),
            name: productName,
            quantity: quantity,
            purchaseCost: cost,
            salePrice: netAmount,
            profit: profit
        };

        salesHistory.unshift(saleRecord);
        balance += netAmount;
        saveAllData();
        renderSalesHistory();
        updateBalanceDisplay();
        showNotification('Продажа сохранена.');
    }

    function renderSalesHistory() {
        salesHistoryBody.innerHTML = '';
        if (salesHistory.length === 0) {
            salesHistoryBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">История продаж пуста.</td></tr>';
            return;
        }

        const filteredSales = salesHistory.filter(sale => salesSearchInput.value === '' || sale.name.toLowerCase().includes(salesSearchInput.value.toLowerCase()));

        filteredSales.forEach((sale, index) => {
            const row = document.createElement('tr');
            const profitClass = sale.profit >= 0 ? 'positive' : 'negative';
            row.innerHTML = `
                <td>${sale.name}</td>
                <td>${sale.quantity}</td>
                <td>${formatNumber(sale.purchaseCost)} ₽</td>
                <td>${formatNumber(sale.salePrice)} ₽</td>
                <td class="${profitClass}">${formatNumber(sale.profit)} ₽</td>
                <td><button class="btn-danger remove-sale" data-index="${index}"><i class="fas fa-trash-alt"></i></button></td>
            `;
            salesHistoryBody.appendChild(row);
        });

        document.querySelectorAll('.remove-sale').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const profit = salesHistory[index].salePrice;
                balance -= profit;
                salesHistory.splice(index, 1);
                saveAllData();
                renderSalesHistory();
                updateBalanceDisplay();
                showNotification('Продажа удалена из истории.');
            });
        });

        updateSalesSummary();
    }

    function updateSalesSummary() {
        const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.salePrice, 0);
        const totalCost = salesHistory.reduce((sum, sale) => sum + sale.purchaseCost, 0);
        const totalProfit = totalRevenue - totalCost;
        const totalProfitability = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

        totalRevenueSpan.textContent = formatNumber(totalRevenue) + ' ₽';
        totalCostSpan.textContent = formatNumber(totalCost) + ' ₽';
        totalProfitSpan.textContent = formatNumber(totalProfit) + ' ₽';
        totalProfitabilitySpan.textContent = totalProfitability.toFixed(2) + '%';
        
        totalProfitSpan.className = totalProfit >= 0 ? 'positive' : 'negative';
        totalProfitabilitySpan.className = totalProfitability >= 0 ? 'positive' : 'negative';
    }

    function updateStats() {
        const totalPurchases = purchaseHistory.length;
        const totalSpent = purchaseHistory.reduce((sum, p) => sum + p.total, 0);
        const largestPurchase = totalPurchases > 0 ? Math.max(...purchaseHistory.map(p => p.total)) : 0;
        
        const totalSales = salesHistory.length;
        const totalRevenue = salesHistory.reduce((sum, s) => sum + s.salePrice, 0);
        const largestSale = totalSales > 0 ? Math.max(...salesHistory.map(s => s.salePrice)) : 0;
        
        const totalCost = salesHistory.reduce((sum, s) => sum + s.purchaseCost, 0);
        const totalProfit = totalRevenue - totalCost;
        const profitability = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

        document.getElementById('stats-total-purchases').textContent = totalPurchases;
        document.getElementById('stats-total-spent').textContent = formatNumber(totalSpent) + ' ₽';
        document.getElementById('stats-largest-purchase').textContent = formatNumber(largestPurchase) + ' ₽';
        document.getElementById('stats-total-sales').textContent = totalSales;
        document.getElementById('stats-total-revenue').textContent = formatNumber(totalRevenue) + ' ₽';
        document.getElementById('stats-largest-sale').textContent = formatNumber(largestSale) + ' ₽';
        document.getElementById('stats-profitability').textContent = profitability.toFixed(2) + '%';
        
        const profitabilityElement = document.getElementById('stats-profitability');
        if (profitability >= 0) {
            profitabilityElement.className = 'positive';
        } else {
            profitabilityElement.className = 'negative';
        }
    }

    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('i');
        const text = notification.querySelector('span');
        
        text.textContent = message;
        
        if (isError) {
            notification.classList.add('error');
            icon.className = 'fas fa-exclamation-circle';
        } else {
            notification.classList.remove('error');
            icon.className = 'fas fa-check-circle';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tab.dataset.tab).classList.add('active');
            if (tab.dataset.tab === 'stats') {
                updateStats();
            }
        });
    });

    addCustomAmountBtn.addEventListener('click', addCustomAmount);
    savePurchaseBtn.addEventListener('click', savePurchase);
    resetCalculatorBtn.addEventListener('click', resetCalculator);
    
    productSearchInput.addEventListener('input', (e) => {
        renderProducts(e.target.value);
    });

    salesSearchInput.addEventListener('input', () => {
        renderSalesHistory();
    });

    calculateSaleBtn.addEventListener('click', calculateSale);
    addSaleHistoryBtn.addEventListener('click', addSaleToHistory);

    myProductsTab.addEventListener('click', renderCustomProducts);
    clearMyProductsBtn.addEventListener('click', clearMyProducts);
    bulkUploadButton.addEventListener('click', parseAndAddProducts);
    
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });

    saveSettingsBtn.addEventListener('click', () => {
        localStorage.setItem('initialBalance', initialBalanceInput.value);
        localStorage.setItem('auctionCommission', auctionCommissionInput.value);
        localStorage.setItem('themeColor', themeColorSelect.value);
        loadSettings();
        showNotification('Настройки сохранены.');
    });

    loadAllData();
    loadSettings();
    updateBalanceDisplay();
    renderCustomProducts();
    renderCustomAmounts();
    renderPurchaseHistory();
    renderSalesHistory();
    fetchProducts();

    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particlesContainer.appendChild(particle);
    }
});