
//----------Get API Key-----------------------*/
const API_KEY = "3ffb4469c147bc12c865e4ba05bafe1e";
//-------------Declare Val by DOM Manipulation--------------------------------*/
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherCard = document.getElementById("weatherCard");
const forecastContainer = document.getElementById("forecastContainer");
const loader = document.getElementById("loader");
const errorOverlay = document.getElementById("errorOverlay");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const errorCloseBtn = document.getElementById("errorCloseBtn");
//------------Declare Function For Error Heledling----------------------------*/
function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

function showError(message, title = "Something went wrong") {
    if (!errorOverlay) return;

    errorTitle && (errorTitle.textContent = title);
    if (errorMessage) errorMessage.textContent = message;

    errorOverlay.classList.remove("hidden");
    errorOverlay.classList.add("flex");
}

function hideError() {
    if (!errorOverlay) return;
    errorOverlay.classList.add("hidden");
    errorOverlay.classList.remove("flex");
}

if (errorCloseBtn) {
    errorCloseBtn.addEventListener("click", hideError);
}

// ESC closes the error popup
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideError();
});

function mapApiError(httpStatus, apiMessage) {
    // OpenWeather commonly returns: { cod, message, ... }
    if (httpStatus === 401) return "Invalid API key (authorization failed). Please try again later.";
    if (httpStatus === 403) return "Access to weather service is forbidden. Please try again later.";
    if (httpStatus === 429) return "Too many requests. Please wait a moment and try again.";
    if (httpStatus === 404) return "City not found. Please check the spelling and try again.";

    const msg = (apiMessage || "").toLowerCase();
    if (msg.includes("city") && msg.includes("not")) return "City not found. Please check the spelling and try again.";
    if (msg.includes("not found")) return "Requested resource was not found.";

    return apiMessage ? apiMessage : "Unable to fetch weather right now. Please try again later.";
}

async function getWeather(city) {

    showLoader();
    hideError();

    // animate background while fetching
    document.body.classList.add("bg-transition");
    document.body.classList.remove("weather-clear","weather-clouds","weather-rain","weather-snow","weather-thunderstorm","weather-mist","weather-default");

    try {
        // 1) Current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) {
            let apiErr;
            try {
                apiErr = await weatherResponse.json();
            } catch {
                // ignore JSON parse error
            }

            const title = "Weather request failed";
            const apiMessage = apiErr && (apiErr.message || apiErr.error) ? (apiErr.message || apiErr.error) : "";
            const userMessage = mapApiError(weatherResponse.status, apiMessage);
            throw new Error(userMessage);
        }

        const weatherData = await weatherResponse.json();
        saveSearch(city);

        // 2) Forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
            let apiErr;
            try {
                apiErr = await forecastResponse.json();
            } catch {
                // ignore JSON parse error
            }

            const apiMessage = apiErr && (apiErr.message || apiErr.error) ? (apiErr.message || apiErr.error) : "";
            const userMessage = mapApiError(forecastResponse.status, apiMessage);
            throw new Error(userMessage);
        }

        const forecastData = await forecastResponse.json();

        // Basic validation to prevent crashes on unexpected API payloads
        if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
            throw new Error("Weather data is incomplete. Please try again later.");
        }

        displayWeather(weatherData);
        displayForecast(forecastData);

    } catch (error) {
        const msg = error && error.message ? error.message : "Unable to fetch weather right now.";
        showError(msg);
    } finally {
        hideLoader();
        // stop loading animation; actual weather background will be set in displayWeather
        document.body.classList.remove("bg-transition");
    }
}

function displayWeather(data) {

    weatherCard.classList.remove("hidden");

    document.getElementById("cityName").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("weatherDesc").textContent =
        data.weather[0].description;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind.speed} m/s`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("pressure").textContent =
        `${data.main.pressure} hPa`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    updateBackground(data.weather[0].main);
}

function displayForecast(data) {

    forecastContainer.innerHTML = "";

    const forecastDays = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    forecastDays.forEach(day => {

        const date = new Date(day.dt_txt);

        const card = document.createElement("div");

        card.className =
            "glass rounded-2xl p-5";

        card.innerHTML = `
            <h3 class="font-bold mb-3">
                ${date.toLocaleDateString("en-US", {
                    weekday: "short"
                })}
            </h3>

            <img
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                class="mx-auto"
            >

            <p class="capitalize">
                ${day.weather[0].description}
            </p>

            <h2 class="text-2xl font-bold mt-2">
                ${Math.round(day.main.temp)}°C
            </h2>
        `;

        forecastContainer.appendChild(card);
    });
}

async function getWeatherByLocation(lat, lon) {

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            let apiErr;
            try {
                apiErr = await response.json();
            } catch {
                
            }

            const apiMessage = apiErr && (apiErr.message || apiErr.error) ? (apiErr.message || apiErr.error) : "";
            throw new Error(mapApiError(response.status, apiMessage));
        }

        const data = await response.json();

        if (!data || !data.name) {
            throw new Error("Location weather data is incomplete. Please try again.");
        }

        getWeather(data.name);

    } catch (error) {
        const msg = error && error.message ? error.message : "Unable to fetch location weather.";
        showError(msg);
    }
}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {
        searchBtn.click();
    }
});

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        position => {
            getWeatherByLocation(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        () => {
            showError("Location permission denied.");
        }
    );
});

window.addEventListener("load", () => {

    renderHistoryDropdown();

    getWeather("Delhi");

});

function saveSearch(city) {

    let history =
        JSON.parse(
            localStorage.getItem("weatherHistory")
        ) || [];

    city =
        city.charAt(0).toUpperCase() +
        city.slice(1).toLowerCase();

    history = history.filter(
        item => item !== city
    );

    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );

    renderHistoryDropdown();
}

function renderHistoryDropdown() {

    const dropdown =
        document.getElementById(
            "historyDropdown"
        );

    const wrapper =
        document.getElementById(
            "historyWrapper"
        );

    const history =
        JSON.parse(
            localStorage.getItem(
                "weatherHistory"
            )
        ) || [];

    if (history.length === 0) {

        wrapper.classList.add("hidden");
        return;
    }

    wrapper.classList.remove("hidden");

    dropdown.innerHTML = `
        <option value="">
            Select a city
        </option>
    `;

    history.forEach(city => {

        dropdown.innerHTML += `
            <option value="${city}">
                ${city}
            </option>
        `;
    });
}

const historyDropdown =
document.getElementById(
    "historyDropdown"
);

historyDropdown.addEventListener(
    "change",
    e => {

        const city = e.target.value;

        if(city){
            getWeather(city);
        }
    }
);

function removeRain(){

    document.getElementById(
        "rain-container"
    ).innerHTML = "";

}

function createRain() {

    const container = document.getElementById("rain-container");

    if (!container) {
        console.error("rain-container not found");
        return;
    }

    // Clear existing raindrops
    container.innerHTML = "";

    for (let i = 0; i < 150; i++) {

        const drop = document.createElement("div");

        drop.classList.add("raindrop");

        // Random horizontal position
        drop.style.left = Math.random() * 100 + "%";

        // Random size
        drop.style.height = Math.random() * 20 + 15 + "px";

        // Random animation speed
        drop.style.animationDuration =
            Math.random() * 0.8 + 0.5 + "s";

        // Random delay
        drop.style.animationDelay =
            Math.random() * 2 + "s";

        container.appendChild(drop);
    }
}


function updateBackground(condition){

    removeRain();

    // Keep existing tailwind/text-white classes, but swap weather classes
    // (don’t wipe body.className entirely because body starts with text-white).
    const body = document.body;
    const classesToRemove = [
        "weather-default",
        "weather-clear",
        "weather-clouds",
        "weather-rain",
        "weather-snow",
        "weather-thunderstorm",
        "weather-mist",
    ];
    classesToRemove.forEach(c => body.classList.remove(c));

    switch(condition){
        case "Rain":
        case "Drizzle":
            body.classList.add("weather-rain");
            createRain();
            break;

        case "Clear":
            body.classList.add("weather-clear");
            break;

        case "Clouds":
            body.classList.add("weather-clouds");
            break;

        case "Snow":
            body.classList.add("weather-snow");
            break;

        case "Thunderstorm":
            body.classList.add("weather-thunderstorm");
            break;

        case "Mist":
        case "Smoke":
        case "Haze":
        case "Fog":
            body.classList.add("weather-mist");
            break;

        default:
            body.classList.add("weather-default");
    }
}




