const profile = document.getElementById('profile');
const dashboard = document.getElementById('dashboard');
const transactions = document.getElementById('transactions');
const transaction_form = document.getElementById('transaction-form');
const logout = document.getElementById('logout');

const tip = document.getElementById('tip');


profile.addEventListener('mouseover', function(event) {
    mostrar_tip(profile, 'Perfil');
});
profile.addEventListener('mouseout', function() {
    esconder_tip();
});


dashboard.addEventListener('mouseover', function(event) {
    mostrar_tip(dashboard, 'Dashboard');
});
dashboard.addEventListener('mouseout', function() {
    esconder_tip();
});


transactions.addEventListener('mouseover', function(event) {
    mostrar_tip(transactions, 'Lista de Transações');
});
transactions.addEventListener('mouseout', function() {
    esconder_tip();
});


transaction_form.addEventListener('mouseover', function(event) {
    mostrar_tip(transaction_form, 'Nova Transação');
});
transaction_form.addEventListener('mouseout', function() {
    esconder_tip();
});


logout.addEventListener('mouseover', function(event) {
    mostrar_tip(logout, 'Sair da Conta');
});
logout.addEventListener('mouseout', function() {
    esconder_tip();
});


function mostrar_tip(element, text) {
    const posicao_elemento = element.getBoundingClientRect();
    tip.style.display = 'block';
    tip.innerText = text;
    tip.style.left = posicao_elemento.right + '100px';
    tip.style.top = posicao_elemento.top + 'px';
}

function esconder_tip() {
    tip.style.display = 'none';
}