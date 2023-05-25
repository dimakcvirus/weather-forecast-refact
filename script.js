window.location.href = "#tab_01";
//1:20
    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = 'afc9f2df39f9e9e49eeb1afac7034d35';

    let favoritesCity= loadTolocalStorage("favoritCity") || [];

const nameCityNow = document.querySelector('.weather__block-content-city')//выбор для замены города
const temperaturNow = document.querySelector('.weather__block-temp')//выбор для замены температуры
const imgNow = document.querySelector('.weather__block-icon')// выбор для замены картинки
const searchInput = document.getElementById('input') //Обращаюсь к инпуту
const search = document.querySelector('.weather__search')//Обращаюсь ко всей форме

const nameCityDetails = document.querySelector('.weather__details-title')
const temperaturaDetails = document.querySelector('.details_temperature')
const tempfeelsDetails = document.querySelector('.details_feels_likes')
const sunrise = document.querySelector('.details_sunrise')
const sunset = document.querySelector('.details_sunset')
const weatherDetails = document.querySelector('.details_weather')


const addLocations = document.querySelector('.weather__location-save')
const likes = document.querySelector('.weather__block-content-like')

// getRequest - с помощью этой функуции обращаюсь к серверу
async function getRequest(cityName){
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    const request = await fetch (url);
    const data = await request.json();
    if (!request.ok){
        throw new Error(data.message);
    }
    console.log(data);
    return data;
}

//getWeather с помощью этой функции получаю из интпута значения, передаю значение в getRequest в cityName.
// и уже от сервера получаю значения по введенному городу
async function  getWeather(event){
    event.preventDefault();
    const cityName = searchInput.value;
       updateWather(cityName)// передаю значения из инпута в getRequest
    search.reset();
};

getRequest('boston')
search.addEventListener('submit', getWeather)// слушатель


async function updateWather(cityName) {
    try{
        const data = await getRequest(cityName);
        updateNow(data);
        updateDetalis(data);
        saveTolocalStorage('lastLocation',cityName);
    }catch (ERROR) {
        alert(ERROR.message);
    }


}


//отрисовка полученных данных на страничке Now
function updateNow(data){
const {name, main,weather} = data;
    let temp = Math.round(main.temp);

    nameCityNow.textContent = name;
    temperaturNow.textContent = `${temp}°`
    imgNow.src = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

}


function timeConvert(time,timezone) {
    let newDate = new Date((time + timezone)*1000);
    return  newDate.toLocaleTimeString([],{
        hour:'2-digit',
        minute:'2-digit',
        time: 'UTC'
    })
}

//отрисовка полученных данных на странике Details
function updateDetalis(data) {
    const {name, main, weather,sys ,timezone} = data;
    let temp = Math.round(main.temp);
    let feeLslike = Math.round(main.feels_like);
    let weatherr=weather[0].main;
    let timeSunrise = timeConvert(sys.sunrise,timezone);
    let timeSunset = timeConvert(sys.sunset,timezone);

   console.log(weatherDetails)
    console.log(temp)

    nameCityDetails.textContent = name;
    temperaturaDetails.textContent = 'Temperature: ' + temp;
    tempfeelsDetails.textContent= 'Feells like: ' + feeLslike;
    sunrise.textContent ='Sunrise: ' + timeSunrise;
    sunset.textContent ='Sunset: ' + timeSunset;
    weatherDetails.textContent ='Weather: ' + weatherr


}

// функциф добавдения  по клику на серечко в массив
function addFavorites(cityName){
    //проверка если один и тот же город
    if (favoritesCity.some(key => key.cityName === cityName)){
        return;
    }
    favoritesCity.push({cityName});
    saveTolocalStorage("favoritCity", favoritesCity )// добавление  в локал сторедж
}
//функция для кнопки удаления в изьранном
function deleteFavorites(cityName){
    favoritesCity = favoritesCity.filter(city =>city.cityName !== cityName);
    saveTolocalStorage("favoritCity", favoritesCity )// добавление  в локал сторедж
}
//функция отрисовки
function renderFavorites() {
    addLocations.innerHTML ='';
    for(let i = 0;i < favoritesCity.length;i ++){
        let city = createElement(favoritesCity[i].cityName);
        addLocations.append(city);
    }

}
//функция создания элементов в add Locations
function createElement(name) {
 const container = document.createElement('li');
 const span = document.createElement('span');
 const button = document.createElement('button');

 span.textContent = name;
 button.textContent ='X';

 span.addEventListener('click',function () {
     updateWather(name);
 });
 button.addEventListener('click',function () {
     deleteFavorites(name);
     renderFavorites();
 })
 container.append(span,button);

 return container;
}
//функция добавления на страничку в избранное города
function addCitys(){
    addFavorites(nameCityNow.textContent);
    renderFavorites(favoritesCity);
}
likes.addEventListener('click',addCitys )


function saveTolocalStorage(key, value){
 localStorage.setItem(key, JSON.stringify(value));
}

function loadTolocalStorage(key){
    const cityName = JSON.parse(localStorage.getItem(key));
    return cityName;
}

window.addEventListener('DOMContentLoaded',()=>{
    loadTolocalStorage('favoritCity');
    const city = loadTolocalStorage('lastLocation')
    updateWather(city)
    renderFavorites();
});