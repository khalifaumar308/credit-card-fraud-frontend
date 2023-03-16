const url = 'http://umaraminu.pythonanywhere.com/predict-fraud?'

const banks = ['--choose--','GTB', 'First Bank', 'Sterling Bank', 
            'Unoin Bank', 'Access Bank','Fidelity Bank',
            'First City Monument Bank','United Bank for Africa','Zenith Bank']
const bank_names = banks.map((val)=>`<option value="${val}">${val}</option>`)

const trans_data_card = document.getElementsByClassName('colums')[0]
const labels = ['Bank', 'Time', 'Amount', 'use_chip', 'MCC', 'transaction_error', 'age',
                  'ret_age', 'Gender', 'Zipcode', 'yearly_income', 'total_debt', 'fico_score']
const submitbtn = document.getElementById('submit')
submitbtn.onclick = getData
labels.forEach(addLabels)

async function getFraudProbabilty(data) {
  params = new URLSearchParams(data)
  const response = await fetch(url + params,{
    method: 'GET',
    headers: {'Content-type': 'application/json; charset=UTF-8'}})
  const json = await response.json()
  const prob_tag = document.getElementById('prb-tag')
  console.log(json)
  let prob = Number(json)*100
  if (prob < 0.001) {
    prob_tag.innerText = prob_tag.innerText +' Safe Transaction'
  }
  else {
  prob_tag.innerText = 'Probability that transaction is fraud: ' + String(prob) + '%'}
}

function addLabels(label){
  let div = document.createElement('div')
  let bank_d = ''
  bank_names.forEach(val => bank_d += val)
  if (label == 'transaction_error') {
    div.innerHTML = `<label for="${label}"> Transaction Error<span>*</span></label>
          <select name="transaction-error" id="${label}" required>
          <option value="choose">--choose--</option>
          <option value="None">None</option>
          <option value="Insufficient Balance">Insufficient Balance</option>
          <option value="Bad PIN">Bad PIN</option>
          <option value="Bad CVV">Bad CVV</option>
          <option value="Bad Expiration Date">Bad Expiration Date</option>
          <option value="Bad Card Number">Bad Card Number</option>
          <option value="Technical Glitch">Technical Glitch</option></select>`} 
  else if (label == 'use_chip'){
    div.innerHTML = `<label for="${label}"> Transaction Type<span>*</span></label>
          <select name="transaction-error" id="${label}">
          <option value="choose">--choose--</option>
          <option value="Swipe Transaction">Swipe Transaction</option>
          <option value="Chip Transaction">Chip Transaction</option>
          <option value="Online Transaction">Online Transaction</option></select>`}
  else if (label == 'Bank') {
    div.innerHTML = `<label for="${label}"> Bank Name<span>*</span></label>
          <select name="Bank" id="${label}">` + bank_d
  }
  else if (label == 'Gender'){
    div.innerHTML = `<label for="${label}">User Gender<span>*</span></label>
          <select name="transaction-error" id="${label}">
          <option value="choose">--choose--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option></select>`
  }
  else {
    const label_names = {Time:'Transaction Time',Amount:'Transaction Amount',
          age:'User Age', ret_age:'User Retairment Age', Zipcode:'User Zipcode',
          yearly_income:'User Yearly Income', total_debt:'User Total Debt', 
          fico_score:'User FICO score', MCC:'User MCC', Bank:'Bank Name'}
    div.innerHTML = `<label for="${label}"> ${label_names[label]}<span>*</span></label>
          <input id="${label}" type="text" name="${label}" required/>`}
  div.setAttribute('class', 'item')
  trans_data_card.appendChild(div)
}

function getData() {
  let data = {}
  const items = document.getElementsByClassName('item')
  labels.forEach(function(label) {
    if (label !=='Bank') {
      const item = document.getElementById(label)
      data[item.id] = item.value
    }
  })
  let rt = true
  const chk = ['choose', '']

  Object.values(data).forEach(val => {
    if (chk.includes(val)) {rt = false}})

  if (rt) {
    document.getElementById('prb-tag').innerText = 'Fraud Probability: '
    getFraudProbabilty(data)
  }
  else {
    window.alert('All Fields Most Be Field')
    return
  }
}
