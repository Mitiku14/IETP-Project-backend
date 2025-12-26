const axios = require('axios');

// Helper function: Returns TRUE if it is raining, FALSE if clear
const checkRainStatus = async () => {
  try {
    const city = process.env.WEATHER_CITY || 'Addis Ababa';
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await axios.get(url);
    const weatherMain = response.data.weather[0].main; // e.g., "Rain", "Clear", "Clouds"

    console.log(`🌍 Weather in ${city}: ${weatherMain}`);

    // If weather is Rain, Drizzle, or Thunderstorm -> Return TRUE
    if (['Rain', 'Drizzle', 'Thunderstorm'].includes(weatherMain)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('⚠️ Weather API Error:', error.message);
    return false; // If API fails, assume it's NOT raining (safety fallback)
  }
};

module.exports = { checkRainStatus };
