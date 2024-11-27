const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn");
const weatherCardDis = document.querySelector(".weather-cards")
const currentWeatherDiv = document.querySelector(".weather")
const API_KEY = "8549656c2cdfabf896dc20c33c09b800";

// Function to create weather card HTML
const createWeatherCard = (cityName, weatherItem, index) =>{
    if (index === 0){
        return `
        <div class="left"><h2>Weather In ${cityName}</h2>
        <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
        
        <h1>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h1>
        
        <h4>Wind: ${weatherItem.wind.speed}m/s</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </div>
        <div class="right">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h4 class="desp">${weatherItem.weather[0].description}</h4>
        </div>`;

    }
    else{
        return `<li class="card1">
              <h4>${weatherItem.dt_txt.split(" ")[0]}</h4>
              <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
              <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
              <h4>Wind: ${weatherItem.wind.speed}m/s</h4>
              <h4>Humidity: ${weatherItem.main.humidity}%</h4>`;
    }
};

// Function to fetch weather details
const getWeatherDetails= (cityName, lat, lon) =>{
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
    fetch(WEATHER_API_URL)
   
        .then(res=> res.json())
        .then(data=>{
           
            const ForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast =>{
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if(!ForecastDays.includes(forecastDate)){
                   return ForecastDays.push(forecastDate);
                }
            });

            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardDis.innerHTML = "";
            fiveDaysForecast.forEach((weatherItem, index) =>{
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem, index));
                }
                else {
                    weatherCardDis.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });

            // Extract sunrise and sunset times
            const sunriseTimestamp = data.city.sunrise;
            const sunsetTimestamp = data.city.sunset;

            // Set background video based on weather description
            setWeatherBackground(data.list[0].weather[0].description.toLowerCase(), sunriseTimestamp, sunsetTimestamp);
        })
        .catch(()=>{
            alert("An error occurred while fetching the weather forecast!");
        });
};

// Function to fetch city coordinates
const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res=> res.json())
        .then(data =>{
            if(!data.length) return alert(`No coordinates found for ${cityName}`)
            const {name, lat, lon} = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(()=>{
            alert("An error occurred while fetching the coordinates!");
        });
};

// Function to set background video based on weather description and time of day
const setWeatherBackground = (weatherDescription, sunriseTimestamp, sunsetTimestamp) => {
    const isDaytime = isDaytimeNow(sunriseTimestamp, sunsetTimestamp);


    let videoURL;

    // Set different background videos for clear skies during the day and night
    if (weatherDescription.toLowerCase() === 'clear sky' || weatherDescription.toLowerCase() === 'scattered clouds' || weatherDescription.toLowerCase() === 'broken clouds' || weatherDescription.toLowerCase() === 'overcast clouds' || weatherDescription.toLowerCase() === 'few clouds') {
        if (isDaytime) {
            console.log("here")
            videoURL = 'videos/sunrise.mp4'; // Video for clear sky during the day
        } else {
            videoURL = 'videos/night.mp4'; // Video for clear sky at night
        }
    } else {
        // Default background video for other weather conditions
        const backgroundVideos = {
        
            'shower rain': 'videos/rain.mp4',
            'light rain':'videos/rain.mp4',
            'rain': 'videos/rain.mp4',
            'moderate rain':'videos/rain.mp4',
            'heavy rain':'videos/rain.mp4',
            'thunderstorm': 'videos/thunderstorm.mp4',
            'snow': 'videos/snow.mp4',
            'light snow': 'videos/snow.mp4',
            'heavy snow': 'videos/snow.mp4',
            'mist': 'videos/mist.mp4'
            // Add more mappings as needed for other weather conditions
        };

        videoURL = backgroundVideos[weatherDescription.toLowerCase()] || 'sunrise.mp4';
    }

    const bgVideo = document.getElementById('myVideo');
    bgVideo.src = videoURL;
};

// Function to check if it is daytime based on current time and sunrise/sunset times
const isDaytimeNow = (sunriseTimestamp, sunsetTimestamp) => {
    const currentTime = new Date().getTime() / 1000; // Convert milliseconds to seconds
    return currentTime >= sunriseTimestamp && currentTime < sunsetTimestamp;
};

// Event listener for search button click
cityInput.addEventListener("keyup", e=>e.key === "Enter" && getCityCoordinates());
searchButton.addEventListener("click",getCityCoordinates);


