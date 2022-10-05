//addElements

let body = document.body;
let contentRender = body.querySelector(".table__body");
let template = body.querySelector("#template").content;
let searchInput = body.querySelector(".currency__search-input");
let sort = body.querySelector(".currency_sort");
let filter = body.querySelector(".currency__filter");


//get from fetch;

const localCurrencies = localStorage.getItem("currencies");

let currencies = [];

if (localCurrencies) {
  currencies = JSON.parse(localCurrencies);
}

async function getMainData(url) {
  try {
    const rawData = await fetch(url);
    const { data } = await rawData.json();

    currencies = data;

    localStorage.setItem("currencies", JSON.stringify(data));
  } catch (error) {
    console.error(error);
    console.error("Please, connnect to network!");
  }
}

getMainData("https://pressa-exem.herokuapp.com/api-49");

console.log(currencies);


//createElement

function createElement(currency) {

  let elItem = template.cloneNode(true)

  elItem.querySelector(".table-id").textContent = currency.id;
  elItem.querySelector(".table-name").textContent = currency.CcyNm_UZ;
  elItem.querySelector(".table-name-code").textContent = currency.Ccy;
  elItem.querySelector(".table-price").textContent = currency.Diff;
  elItem.querySelector(".table-update").textContent = currency.Date;

  return elItem
}

//render

function render(currencies) {
  contentRender.innerHTML = "";

  let listFragment = document.createDocumentFragment();

  currencies.forEach((currency) => {
    listFragment.append(createElement(currency))
  });

  contentRender.appendChild(listFragment)
}




// //sort 
// let sortArr = [...data];

// sort.addEventListener("change", () => {
//   sortArr.sort((a,b) => {
//     if(a.name > b.name) return 1;
//     else if(a.name < b.name) return -1;
//     return 0
//   })

//   if (sort.value === "a-z") {
//     render(sortArr)
//   }
//   else if (sort.value === "z-a") {
//     render(sortArr.reverse())
//   }
//   else if (sort.value === "default"){
//     render(data);
//   }
// })

// //filter
// filter.addEventListener("change", () => {
//   let filterUser = filter.value
//   let filteredUsers = sortArr.filter(user => user.priority.toLowerCase().includes(filterUser));

//   render(filteredUsers);

//   if(filter.value === "default"){
//     render(sortArr);
//   }
// })

// //changePriority

// contentRender.addEventListener("click", (evt) => {
//   if(evt.path[1].matches(".priority-btn")) {
//     let selectPriority = evt.path[1].nextElementSibling
//     selectPriority.classList = "block"; 
//   }
// })


render(currencies);