const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const dataCount = document.getElementById('data-count');

// AMBIL DATA DARI DATABASE (LocalStorage)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Fungsi Tambah Transaksi
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        text: text.value,
        amount: type.value === 'minus' ? -Math.abs(+amount.value) : Math.abs(+amount.value),
        type: type.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
}

// Tampilkan Data ke Layar
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add('list-item');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        <div class="item-info">
            <h4>${transaction.text}</h4>
            <p>${new Date().toLocaleDateString()}</p>
        </div>
        <div class="item-actions">
            <span class="money-text">${sign} Rp ${Math.abs(transaction.amount).toLocaleString()}</span>
            <button class="btn-delete" onclick="removeTransaction(${transaction.id})">x</button>
        </div>
    `;

    list.appendChild(item);
}

// Update Saldo, Pemasukan, Pengeluaran
function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

    balance.innerText = `Rp ${total.toLocaleString()}`;
    money_plus.innerText = `Rp ${income.toLocaleString()}`;
    money_minus.innerText = `Rp ${expense.toLocaleString()}`;
    dataCount.innerText = `${transactions.length} Data`;
}

// Hapus Transaksi
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

// SIMPAN KE DATABASE (LocalStorage)
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Jalankan Aplikasi
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();
form.addEventListener('submit', addTransaction);
