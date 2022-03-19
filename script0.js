// Напонение селектов возраста
let select1 = document.querySelector("#ageFrom");
let select2 = document.querySelector("#ageTo");
for (let i = 18; i <= 90; i++) {
    select1.innerHTML += `<option value="${i}">${i}</option>`;
    select2.innerHTML += `<option value="${i}">${i}</option>`;
}


 