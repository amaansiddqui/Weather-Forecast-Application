# Weather Forecast Dashboard
A responsive weather forecast application built using HTML, Tailwind CSS, and JavaScript. The application allows users to **search weather information by city name, view weather data for their current location, and access a 5-day forecast** with a modern and interactive user interface.

It includes a dynamic UI with a glassmorphism look and a themed animated background that changes based on the current weather condition.

---

## Features
- **Current Weather Info**
- Search weather by **city name**
- Get weather using **My Location** (geolocation)
- Shows:
  - Current temperature, description, humidity, wind speed, feels like, and pressure
  - Weather icon
  - 5-day forecast cards
- Animated background theme that updates with the live weather
- Keeps a small **search history** in localStorage
------
- **Extended Forecast**
- 5-day weather forecast
- Forecast cards displaying:
- Date
- Temperature
- Weather icon
- Humidity
- Wind information
------
- **Error Handling*
- Invalid city name validation
- Empty search validation
- API request error handling
- Location permission handling
- User-friendly error messages displayed within the UI
-----
*Responsive Design*
- The application has been tested and optimized for:
   Desktop screens
   iPad Mini
   iPhone SE
   Other mobile devices

----   

## Technologies

- HTML + CSS
- TailwindCSS (CDN)
- Vanilla JavaScript
- OpenWeather API

---

## How to Run

1. Open the project folder:
   - `e:/Weather Forecast App`
2. Start with `index.html` in a browser.

## Note : This project calls OpenWeather from the browser (no backend). If your browser blocks requests due to CORS or network restrictions, you may need to run it using a local web server.

---

## Setup Notes

- The API key is located in:
  - `app.js`

## File Structure

- `index.html` - Page layout
- `style.css` - Styling + animated background + rain effect
- `app.js` - Fetches weather/forecast, updates UI, and switches themes

---

## Troubleshooting

- **City not found**: Double-check spelling.
- **API errors**: Wait and try again, or verify API key/network.

---
## Features
- **Current Weather Information**
Search weather by city name
Get weather for current location using Geolocation API
Display:
Temperature
Weather condition
Humidity
Wind speed
Pressure
Feels like temperature
Sunrise and sunset times

------

## Github Clone 

"https://github.com/amaansiddqui/Weather-Forecast-Application"

## Deploy Live Link

"https://amaansiddqui.github.io/Weather-Forecast-Application/"

------

**Challenges Faced**

*While developing the project, a few challenges were encountered:*
- Managing asynchronous API requests efficiently.
- Handling invalid user input and API failures gracefully.
- Creating a responsive layout that works across different screen sizes.
- Implementing dynamic weather-based themes and animations.
- Maintaining search history using Local Storage.

*These challenges helped improve understanding of JavaScript, DOM manipulation, API integration, and responsive UI development.*

-----

**Learning Outcomes**

*Through this project, I gained practical experience in:*

- Working with REST APIs
- Fetch API and async/await
- DOM manipulation
- Event handling
- Local Storage
- Geolocation API
- Responsive web design
- Error handling and validation
- Tailwind CSS utility classes

-----

**Author**

- Developed as part of a JavaScript Weather Forecast Application project to demonstrate API integration, responsive UI design, and modern JavaScript development practices.