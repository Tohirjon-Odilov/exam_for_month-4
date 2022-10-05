//! call element

let body = document.body
let template = body.querySelector('#templete').content
let tbody = body.querySelector('.tbody')
let sortEL = body.querySelector('#inputGroupSelect02')
let search = body.querySelector('#search')
let modalBtn = body.querySelector('.modal-btn') //! modalni ishga tushirish
let result = localStorage.getItem('modal') //! local storage'dan ma'lumot olish

//! add local storage
const localCurrencies = localStorage.getItem("currencies");

let currencies = [];

//! fetch
if (localCurrencies)
  currencies = JSON.parse(localCurrencies);

async function getMainData(url) {
  try {
    const rawData = await fetch(url);
    const { data } = await rawData.json();

    currencies = data;

    localStorage.setItem("currencies", JSON.stringify(data));
  } catch (error) {
    console.error("Internet bilan aloqa yo'qoldi!" + error);
  }
}
getMainData("https://pressa-exem.herokuapp.com/api-49");

// console.log(currencies);

//! Create element
function createElement(data) {
  let itemElement = template.cloneNode(true)

  itemElement.querySelector(".data__id").textContent = data.Code
  itemElement.querySelector(".data__name").textContent = data.CcyNm_UZ
  itemElement.querySelector(".data__short-name").textContent = data.Ccy
  itemElement.querySelector(".data__price").textContent = data.Diff
  itemElement.querySelector(".data__date").textContent = data.Date

  return itemElement
}

//! render

function render(renderData) {
  tbody.innerHTML = "";

  let listFragment = document.createDocumentFragment();

  renderData.forEach((currency) => {
    listFragment.append(createElement(currency))
  });

  tbody.appendChild(listFragment)
}
render(currencies)

// ! sorting data
// let sorted = null;
let sortArr = [...currencies]
sortEL.addEventListener('change', function (e) {
  let sortValue = e.target.value

  switch (sortValue) {
    case 'down':
      sortArr.sort((a, b) => a.Diff - b.Diff);
      break;
    case 'up':
      sortArr.sort((a, b) => b.Diff - a.Diff);
      break
    default:
      sortArr = currencies
      break;
  }
  console.log(sortArr);
  render(sortArr)
})

//! searching
search.addEventListener('input', (e) => {
  const searchVal = +e.target.value.trim()

  let newSearch;
  newSearch = [...currencies].filter((searchDate) => {
    let diff = +searchDate.Diff
    if (diff >= searchVal) return searchDate
  })
  render(newSearch)
})


//! modal
setTimeout(() => {
  if (!result)
    modalBtn.click()
  localStorage.setItem('modal', 'Ishladi va nihoyat')

}, 10000)
