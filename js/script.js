//! call element
let body = document.body
let template = body.querySelector('#templete').content
let tbody = body.querySelector('.tbody')
let sortEL = body.querySelector('#inputGroupSelect02')
let search = body.querySelector('#search')
let modalBtn = body.querySelector('#btnModal') //! modalni ishga tushirish
let result = localStorage.getItem('modal') //! local storage'dan ma'lumot olish
let img__bg = body.querySelector('.img__bg')
let count = body.querySelector('#count')

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

    //! spinner
    !rawData.status ? img__bg.classList.add('img__bg') : img__bg.className = 'd-none'
  } catch (error) {
    img__bg.className = 'd-none'
    console.error("Internet bilan aloqa yo'qoldi!" + error);
  }
}
getMainData("https://pressa-exem.herokuapp.com/api-49");

//! Create element
let btnCount, iterator, heart, heartill;
function createElement(data) {
  let itemElement = template.cloneNode(true)

  itemElement.querySelector("#data__raw")
  itemElement.querySelector(".data__id").textContent = data.Code
  itemElement.querySelector(".data__name").textContent = data.CcyNm_UZ
  itemElement.querySelector(".data__short-name").textContent = data.Ccy
  itemElement.querySelector(".data__price").textContent = data.Rate
  itemElement.querySelector(".data__date").textContent = data.Date
  btnCount = itemElement.querySelector("#btnCount")
  iterator = itemElement.querySelector(".iterator")

  //! bukmark
  iterator.addEventListener('click', (e) => {
    let counter = 0;
    if (e.target.checked) {
      counter = count.textContent = +count.textContent + 1
    } else {
      counter = count.textContent = +count.textContent - 1
    }
  })

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
let sortArr = [...currencies]
let defaultt = currencies
sortEL.addEventListener('change', function (e) {
  let sortValue = e.target.value

  switch (sortValue) {
    case 'down':
      sortArr.sort((a, b) => a.Rate - b.Rate);
      break;
    case 'up':
      sortArr.sort((a, b) => b.Rate - a.Rate);
      break
    default:
      sortArr = defaultt
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
    if (+searchDate.Rate >= searchVal) return searchDate
  })
  render(newSearch)
})

//! modal
setTimeout(() => {
  if (!result)
    modalBtn.click()
  localStorage.setItem('modal', 'Ishladi va nihoyat')
}, 10000)

