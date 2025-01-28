// Function to fetch prayer times
async function getPrayerTimes() {
  const city = "London"; // Replace with user's city or dynamic input
  const country = "UK"; // Replace with user's country or dynamic input
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
      break;
    }
  }
}

// Main function
async function main() {
  const timings = await getPrayerTimes();
  displayPrayerTimes(timings);
  checkPrayerTime(timings);
}

// Run the main function
main();