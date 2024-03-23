document.addEventListener("DOMContentLoaded", getCurrentImageOfTheDay);

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  fetchNASAImageOfTheDay(currentDate)
    .then((data) => displayImage(data, currentDate))
    .catch((error) => console.error("Error fetching current image:", error));
}

function getImageOfTheDay(date) {
  fetchNASAImageOfTheDay(date)
    .then((data) => {
      displayImage(data, date);
      saveSearch(date);
      addSearchToHistory();
    })
    .catch((error) => console.error("Error fetching image for date:", error));
}

function fetchNASAImageOfTheDay(date) {
  const apiKey = "LCc8yC3V8qH2zpKDNlqx2G9jEKIw2kwPOhuNCX2a"; // Replace with your NASA API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    return response.json();
  });
}

function displayImage(data, date) {
  const container = document.getElementById("current-image-container");
  container.innerHTML = `
        <h2>Picture on ${date}</h2>
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.push(date);
  localStorage.setItem("searches", JSON.stringify(searches));
}

function addSearchToHistory() {
  const historyList = document.getElementById("search-history");
  historyList.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((date) => {
    const listItem = document.createElement("li");
    listItem.textContent = date;
    listItem.addEventListener("click", () => getImageOfTheDay(date));
    historyList.appendChild(listItem);
  });
}

document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const date = document.getElementById("search-input").value;
    getImageOfTheDay(date);
  });
