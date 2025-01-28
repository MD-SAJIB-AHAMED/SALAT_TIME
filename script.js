// Function to fetch prayer times based on city and country
async function getPrayerTimes(city, country) {
  const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
  const data = await response.json();
  return data.data.timings;
}

// Function to format time in 12-hour format
function formatTime(time) {
  const [hours, minutes] = time.split(':');
  let period = 'AM';
  let hour = parseInt(hours);
  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) hour -= 12;
  }
  return `${hour}:${minutes} ${period}`;
}

// Function to display prayer times
function displayPrayerTimes(timings) {
  const prayerTimesElement = document.getElementById('prayer-times');
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  let html = '';
  prayers.forEach(prayer => {
    const time = formatTime(timings[prayer]);
    html += `<p><strong>${prayer}:</strong> ${time}</p>`;
  });
  prayerTimesElement.innerHTML = html;
}

// Function to check if it's prayer time
function checkPrayerTime(timings) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const prayer of prayers) {
    const [hours, minutes] = timings[prayer].split(':');
    const prayerTime = parseInt(hours) * 60 + parseInt(minutes); // Convert to minutes

    if (currentTime === prayerTime) {
      const messageElement = document.getElementById('message');
      messageElement.textContent = `It's time for ${prayer}!`;
      playAdhan();
      break;
    }
  }
}

// Function to get the next prayer time and display countdown
function getNextPrayerTime(timings) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const prayer of prayers) {
    const [hours, minutes] = timings[prayer].split(':');
    const prayerTime = parseInt(hours) * 60 + parseInt(minutes); // Convert to minutes

    if (currentTime < prayerTime) {
      return { prayer, time: prayerTime - currentTime };
    }
  }
  // If all prayers are done for the day, return Fajr of the next day
  return { prayer: 'Fajr', time: (24 * 60 - currentTime) + (parseInt(timings['Fajr'].split(':')[0]) * 60 + parseInt(timings['Fajr'].split(':')[1])) };
}

function displayCountdown(timings) {
  const { prayer, time } = getNextPrayerTime(timings);
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  const countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = `<p>Time until ${prayer}: ${hours}h ${minutes}m</p>`;
}

// Function to play Adhan
function playAdhan() {
  const adhan = document.getElementById('adhan');
  adhan.play();
}

// Main function to initialize the app
async function main(city = "London", country = "UK") {
  const timings = await getPrayerTimes(city, country);
  displayPrayerTimes(timings);
  checkPrayerTime(timings);
  displayCountdown(timings);

  // Update countdown every minute
  setInterval(() => {
    displayCountdown(timings);
  }, 60000);
}

// Geolocation fallback
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const data = await response.json();
    main(data.city, data.countryName);
  }, () => {
    // If user denies location access, use default location
    main();
  });
} else {
  // If geolocation is not supported, use default location
  main();
}

// Update location manually
document.getElementById('update-location').addEventListener('click', () => {
  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;
  if (city && country) {
    main(city, country);
  } else {
    alert("Please enter both city and country.");
  }
});