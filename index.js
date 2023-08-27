import WEATHER_API_KEY from "./apikey.js";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
// const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");

//variables
let currentTab = userTab;
const API_KEY = WEATHER_API_KEY;
currentTab.classList.add("current-tab")


getfromSessionStorage();

//switch tab

function switchTab(clickedTab){
    if(clickedTab !== currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            // is search container is invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now i am in weather tab so its obvious that the weather needs to be displayed
            getfromSessionStorage();


        }
    }
}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinated nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
       
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}


async function fetchUserWeatherInfo(coordinates){
    const {lat,long} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    errorContainer.classList.remove("active");

    // API CALL
    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
        );        
      const  data = await response.json();
      if(data.cod!="404"){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data); // it will put the data in the UI 
      }
      else{
        userInfoContainer.classList.remove("active");
        errorContainer.classList.add("active");
      }
      
    }
    catch(err){
        loadingScreen.classList.remove('active');
          //homework
        errorContainer.classList.add("active");

    }
}


function renderWeatherInfo(weatherInfo){
    // location
    // city
    // country code
    // description
    //weather icon
    // windspeed
    // humidity
    // clouds

    //firstly we have to fecth the elements 
    console.log(weatherInfo)
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed =  document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const wrapper = document.querySelector(".wrapper");
    // wrapper.style.backgroundImage = `url("https://api.unsplash.com/search/photos?page=1&query=weather")`;




    //fetch values from weather-info object and put the values in gui
    cityName.innerText = weatherInfo?.name;
    // countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    countryIcon.src = `https://www.countryflagicons.com/FLAT/64/${weatherInfo?.sys?.country}.png`
    description.innerText =weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=  `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerHTML = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

   
}

function getlocation(){
    if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

        Alert("Geolocation support not available for your browser version")

    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        long:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}


const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener("click",getlocation);



const searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
       fetchSearchWeatherInfo(cityName);

});


async function fetchSearchWeatherInfo(city){
        
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if(data?.cod =='404'){
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.add("active");
            console.log(errorContainer.classList);
            
          }
          else{

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data); // it will put the data in the UI 
            
          }
    }catch(e){
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
    }
}

