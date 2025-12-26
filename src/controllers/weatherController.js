const axios = require('axios');

const checkRainStatus = async () => {
  try {
    const city = process.env.WEATHER_CITY || 'Addis Ababa';
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get(url);
    const weatherMain = response.data.weather[0].main; // e.g., "Rain", "Clear", "Clouds"

    console.log(`🌍 Weather in ${city}: ${weatherMain}`);

    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('⚠️ Weather API Error:', error.message);
    return false; 
  }
};

module.exports = { checkRainStatus };
