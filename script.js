
let block =  document.querySelector(".results");   
let now = new Date();
let pexelKey = '563492ad6f917000010000015b46efac4723482e9b650e2d6fc95fd1';

function getNumber(max = 10, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

let quantity = getNumber(25, 10); //рандомное количество друзей

// функция - отрисовка карточки: !! c i - ключик
function setCards(i) {
    while (i--) {
    let card = document.createElement("div");
    card.innerHTML = `
    <div class="card" id="card">
    <div class="about_photo">   
        <img id="img${i}" src="">         
    </div>
    <div class="about-info">
        <div>
        <label>Имя: </label>
        <input type="text" name="name" readonly id="name${i}" value=""> 
        </div>
        <div>
        <label>Возраст: </label>
        <input type="number" name="age" readonly id="age${i}" value="">
    </div>
    <div>
        <label>email: </label>
        <input type="text" name="email" readonly id="email${i}" value=""> 
    </div>
    </div>
  </div>
      `; 
      block.appendChild(card);
  }}

// формирование запроса для Fakers
function getPersonRequest(maleCheck, femaleCheck, ageFrom, ageTo) {
    let yearStart = now.getFullYear() - ageTo;
    let yearEnd = now.getFullYear() - ageFrom;

// с ноликом
    if (now.getMonth() < 9) {
        //если выбраны оба пола
     if (maleCheck.checked && femaleCheck.checked) {
        return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_birthday_start=${yearStart}-0${now.getMonth()+1}-${now.getDate()}&_birthday_end=${yearEnd}-0${now.getMonth()+1}-${now.getDate()}`
       } else {
         // выбраны мужщины
         if (maleCheck.checked) {
            return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_gender=male&_birthday_start=${yearStart}-0${now.getMonth() +1}-${now.getDate()}&_birthday_end=${yearEnd}-0${now.getMonth() +1}-${now.getDate()}`
         } else {
            //выбраны женщины
            return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_gender=female&_birthday_start=${yearStart}-0${now.getMonth() +1}-${now.getDate()}&_birthday_end=${yearEnd}-0${now.getMonth() +1}-${now.getDate()}`
         } } 
    } else {

        //без нолика
         //если выбраны оба пола
     if (maleCheck.checked && femaleCheck.checked) {
        return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_birthday_start=${yearStart}-${now.getMonth()+1}-${now.getDate()}&_birthday_end=${yearEnd}-${now.getMonth()+1}-${now.getDate()}`
     } else {
         // выбраны мужщины
         if (maleCheck.checked) {
            return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_gender=male&_birthday_start=${yearStart}-${now.getMonth() +1}-${now.getDate()}&_birthday_end=${yearEnd}-${now.getMonth() +1}-${now.getDate()}`
         } else {
            //выбраны женщины
            return `https://fakerapi.it/api/v1/persons?_quantity=${quantity}&_gender=female&_birthday_start=${yearStart}-${now.getMonth() +1}-${now.getDate()}&_birthday_end=${yearEnd}-${now.getMonth() +1}-${now.getDate()}`
         }  } } }

//формирование запроса для Pexel
function getPhotoRequest(maleCheck, femaleCheck) {
    //поиск фото людей обоих полов
    if (maleCheck.checked && femaleCheck.checked) {return `https://api.pexels.com/v1/search?query=person&page=1&per_page=${quantity}&orientation=square`}
    //поиск фото мужщин
    if (maleCheck.checked && !femaleCheck.checked) {return `https://api.pexels.com/v1/search?query=men&page=1&per_page=${quantity}&orientation=square`}
    //поиск фото женщин
    if (!maleCheck.checked && femaleCheck.checked) {return `https://api.pexels.com/v1/search?query=lady&page=1&per_page=${quantity}&orientation=square`}
}

// сбор фото с Pexel и отрисовка на карточках
function getPhoto(photo_request) { 
    fetch(photo_request, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: pexelKey // ключ доступа - обязательно
        }})  
          .then(function(ans) {
          console.log(ans);
          return ans.json();
        })
     .then(function(data) {
         console.log(data);
         let photo_arr = data.photos; // !!! хранятся в photos
         console.log(photo_arr);
         for (let i = 0; i < photo_arr.length; i++) {
            document.querySelector(`#img${i}`).setAttribute("src", photo_arr[i].src.medium); // беру портретные фото
             }
            });
}
   
//сбор данных c Fakers и отрисовка на карточках
function getData(request) { 
       fetch(request)  // просим данные на сервере
          .then(function(ans) {
          console.log(ans);
          return ans.json();
        })
     .then(function(data) {
         console.log(data);
         let arr = data.data;
         for (let i = 0; i < arr.length; i++) {
             document.querySelector(`#name${i}`).setAttribute("value", `${arr[i].firstname} ${arr[i].lastname}`);
             document.querySelector(`#age${i}`).setAttribute("value", now.getFullYear() - (arr[i].birthday).slice(0, 4));
             document.querySelector(`#email${i}`).setAttribute("value", arr[i].email);
           }
        })
    }

document.querySelector("button").addEventListener("click", function() {
    block.innerHTML = ""; // убираем предыдущие карточки
  let maleCheck = document.querySelector("#male");
  let femaleCheck = document.querySelector("#female");
  let ageFrom = document.querySelector("#ageFrom").value;
  let ageTo = document.querySelector("#ageTo").value;
            //проверяем корректность выбранных параметров:
        if (!maleCheck.checked && !femaleCheck.checked) { //не выбран никакой пол
            alert("Please choose the gender.");
            return;
        }
        if (ageFrom > ageTo) { //некорректно выставлен возраст
            alert(`'Age to' value cannot be less than 'Age from'. Please correct.`);
            return;
        }
        setCards(quantity); // рисуем заготовки карточек
        let request = getPersonRequest(maleCheck, femaleCheck, ageFrom, ageTo);
        let photo_request = getPhotoRequest(maleCheck, femaleCheck);
        getData(request); // наполняем с Fakers
        getPhoto(photo_request); // наполняем с Pexel
        })