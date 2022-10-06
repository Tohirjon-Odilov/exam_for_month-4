//! call element
let body = document.body
let template = body.querySelector('#templete').content
let tbody = body.querySelector('.tbody')
let sortEL = body.querySelector('#inputGroupSelect02')
let search = body.querySelector('#search')
let modalBtn = body.querySelector('#btnModal') //! modalni ishga tushirish
let modalGetResult = localStorage.getItem('modal') //! local storage'dan ma'lumot olish
let spinBg = body.querySelector('.img__bg')
let mainCount = body.querySelector('#count')

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
    if (!currencies.length == 0)
      render(data)

    localStorage.setItem("currencies", JSON.stringify(data));

    //! spinner
    !rawData.status ? spinBg.classList.add('img__bg') : spinBg.className = 'd-none'
  } catch (error) {
    console.error("Internet bilan aloqa yo'qoldi!" + error);
  }
}
getMainData("https://pressa-exem.herokuapp.com/api-49");

//! remove spin
setTimeout(() => {
  spinBg.className = 'd-none'
}, 1000)

//! Create element
let iterator;
function createElement(data) {
  let itemElement = template.cloneNode(true)
  itemElement.querySelector(".data__id").textContent = data.Code
  itemElement.querySelector(".data__name").textContent = data.CcyNm_UZ
  itemElement.querySelector(".data__short-name").textContent = data.Ccy
  itemElement.querySelector(".data__price").textContent = data.Rate
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
  if (!modalGetResult)
    modalBtn.click()
  localStorage.setItem('modal', 'Ishladi va nihoyat')
}, 10000)

//! bukmark
tbody.addEventListener('click', (e) => {
  if (e.target.matches(".btn")) {
    if (e.target.src.includes('bookmark')) {
      mainCount.textContent++
      e.target.src = "../images/heart-fill.svg"
    } else {
      mainCount.textContent--
      e.target.src = "../images/bookmark-fill.svg"
    }
  }
})