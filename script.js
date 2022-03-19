let now = new Date();
 
function getNumber(max = 10, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

let quantity = getNumber(25, 10);

// функция - отрисовка карточки: !! c id - ключик
function setCard(obj) {
    return `
    <div class="card" id=${obj.id}>
    <div class="about_photo">   
        <img src=${obj.image}>         
    </div>
    
    <div class="about-info">
        <div>
        <label>Имя: </label>
        <input type="text" name="name" readonly value=${obj.firstname} ${obj.lastname}> 
        </div>
        <div>
        <label>Возраст: </label>
        <input type="number" name="age" readonly value=${now.getFullYear() - (obj.birthday).slice(0, 4)}>
    </div>
    <div>
        <label>email: </label>
        <input type="text" name="email" readonly value=${obj.email}> 
    </div>
    </div>
  </div>
      `; 
  }

//функция составления запроса по выбранным параметрам:
function getRequest(maleCheck, femaleCheck, ageFrom, ageTo) {
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

    //функция -забор данных из БД и отрисовка
    function getData(request) { 
     let block =  document.querySelector(".results");  
     console.log(request)    
       fetch(request)  // просим данные на сервере
          .then(function(ans) {
          console.log(ans);
          return ans.json();
        })
     .then(function(data) {
         console.log(data);
         let arr = data.data;
         arr.forEach(function(el) {
             block.innerHTML += setCard(el);
            });
        })
    }

document.querySelector("button").addEventListener("click", function() {
  document.querySelector(".results").innerHTML = "";
  let maleCheck = document.querySelector("#male");
  let femaleCheck = document.querySelector("#female");
  let ageFrom = document.querySelector("#ageFrom").value;
  let ageTo = document.querySelector("#ageTo").value;
  
  console.log(now);
  console.log(maleCheck.checked);
  console.log(femaleCheck.checked);
  console.log(ageFrom);
  console.log(ageTo);

          //проверяем корректность выбранных параметров:
        if (!maleCheck.checked && !femaleCheck.checked) { //не выбран никакой пол
            alert("Please choose the gender.");
            return;
        }
        if (ageFrom > ageTo) { 
            alert(`'Age to' value cannot be less than 'Age from'. Please correct.`);
            return;
        }
        
        let request = getRequest(maleCheck, femaleCheck, ageFrom, ageTo);
        getData(request);   
        })
