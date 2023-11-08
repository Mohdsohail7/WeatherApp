const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const userContainer = document.querySelector("[weather-container]");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector(".error-container");
const errorButton = document.querySelector("[error-btn]");
const errorText = document.querySelector("[error-text]");
const errorImage = document.querySelector("[error-image]");



// initially variable
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // serach wale tab pr tha ab your weather visible ktrna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter
    switchTab(searchTab);
});


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");

    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccess.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if(!data.sys){
            throw data;
        }

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
            loadingScreen.classList.remove("active");
            notFound.classList.add("active");
            errorImage.style.display = "block";
            errorText.innerText = `${error?.message}`;
            errorButton.style.display = "block";
            errorButton.addEventListener("click", fetchUserWeatherInfo);

            setTimeout(() => {
                notFound.classList.remove("active");
            },4000);

    }
}

function renderWeatherInfo(weatherInfo){
    // firtsly fetch the elements

    const cityName = document.querySelector("[data-cityname]");
    const contryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const Temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudNess = document.querySelector("[data-cloudness]");

    console.log(weatherInfo);
    // fetch value from weather info object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    contryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    Temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudNess.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        // show an alert geolocation not support
        alert("geolocation not support");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    

    if(searchInput.value === "")
        return;
    else 
    fetchSerachWeatherInfo(searchInput.value);

    searchInput.value = "";


});

async function fetchSerachWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if(!data.sys){
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (error) {
        // Error Message is pending
        loadingScreen.classList.remove("active");
        notFound.classList.add("active");
        errorImage.style.display = "block";
        errorText.innerText = `${error?.message}`;
        errorButton.style.display = "block";
        errorButton.addEventListener("click", fetchUserWeatherInfo);

        setTimeout(() => {
            notFound.classList.remove("active");
        },4000);

    }


}