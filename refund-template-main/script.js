// Seleciona os elementos do formulário.
const form = document.querySelector('form')

const amount = document.getElementById
('amount')

const expense = document. getElementById('expense')

const category = document.getElementById('category')

// Seleciona os elementos da lista.
const expenseList = document.querySelector('ul')

const expensesQuantity = document.querySelector('aside header p span')

const expensesTotal = document.querySelector('aside header h2')


// Captura o evento de input para formatar o valor.
amount.oninput = () => {

    //Obtém o valor atual do input e remove os caracteres não numéricos.
    let value = amount.value.replace(/\D/g, '')


    // Transforma o valor em centavos.
    value = Number(value) / 100


    //Atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    //Formata no padrão BRL

    value = value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    })

    return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {

    // Previne o comportamento padrão de recarregar a página.

    event.preventDefault()

    // Cria um novo objeto com o detalhe das despesas.
    const newExpense ={

        id: new Date().getTime(),

        expense: expense.value,

        category__id: category.value,

        category__name: category.options[category.selectedIndex].text,

        amount : amount.value,
        
        created__at: new Date()
    }

    //Chama a função que ira adicionar a despesa na lista.
    expenseAdd(newExpense)
}

function expenseAdd(newExpense){

    try {
        // Cria o elemento li.
        const expenseItem  = document.createElement('li')
        expenseItem.classList.add('expense')

        // Cria o ícone da categoria.
        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src', `img/${newExpense.category__id}.svg`)
        expenseIcon.setAttribute('alt', newExpense.category__name)

        // Cria a informação da despesa.
        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')

        // Cria o nome da despesa.
        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa.
        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category__name

        // Adiciona nome e categoria na div.
        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa.
        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace('R$', '')}`
        
        // Cria o ícone de remover.
        const removeIcon = document.createElement('img')
        removeIcon.classList.add('remove-icon')
        removeIcon.setAttribute('src','img/remove.svg')
        removeIcon.setAttribute('alt', 'remover')

        // Adiciona as informações no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista.
        expenseList.append(expenseItem)
        
        // Atualiza os totais.
        updateTotals()

        // Limpa o formulário
        clear()


    } catch (error) {

        alert('Não foi possível atualizar a lista de despesas.')

        console.log(error)
        
    }

}

// Atualiza os totais.
function updateTotals(){
    try {
        // Recupera todos os itens li da lista.
        const items = expenseList.children
        
        
        // Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1? 'despesas': 'despesa'}`

        // Variável pra incrementar o total.
        let total = 0

        // Percorre cada item da lista.
        for (let item of items){
            const itemAmount = item.querySelector('.expense-amount')

            // Remove os caracteres não numéricos e substitui a vírgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.')

            // Converte o valor para float.
            value = parseFloat(value)

            // Verifica se é um número válido.
            if(isNaN(value)){
                
                return alert('Não foi possível calcular o total. O valor não parece ser um número.')
            }


            // Incrementar o valor total.
            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado.

        const symbolBRL = document.createElement('small')
        symbolBRL.textContent = 'R$' 

        total = formatCurrencyBRL(total).toUpperCase().replace('R$' , '')


        // Limpa o html do conteúdo do elemento.
        expensesTotal.innerHTML = ''


        // Adiciona o símbolo da moeda e o valor total formatado.
        expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert('Não foi possível atualizar os totais.')
    }
}

// Evento que captura o clique nos itens da lista.

expenseList.addEventListener('click', function(event){
    // Verifica se o elemento clicado é o item 'remove'.
    if (event.target.classList.contains('remove-icon')){
    // Obtém a li pai do elemento clicado.
    
    const item = event.target.closest('.expense')

    // Remove o item da lista.
    item.remove()
    }

    // Atualiza os totais.
    updateTotals()
})

function clear(){

    expense.value = ''
    category.value = ''
    amount.value = ''

    expense.focus()
}