// Define URL for the API
const API_URL = ("https://majazocom.github.io/Data/solaris.json");

// References to elements in the DOM
const planetsContainerEl = document.getElementById("planets-container");
const lightboxContainer = document.getElementById("lightbox-container");
const searchBox = document.getElementById("search-box");
const prevPlanetBtn = document.querySelector(".pagination-btn--prev");
const nextPlanetBtn = document.querySelector(".pagination-btn--next");

// Define variables
let planetsArray = [];
let matchesArray = [];
let showAllPlanets;
let openLightbox = null;
let currentPlanetIndex;

// Function to fetch data from the API
// + render planets to the UI and hiding pagination
async function fetchPlanets() {
    try {
      let response = await fetch(API_URL);
      planetsArray = await response.json();
      matchesArray = planetsArray;
      renderPlanetsToUI(planetsArray);
      showAllPlanets = planetsContainerEl.innerHTML;
      prevPlanetBtn.style.display = "none";
      nextPlanetBtn.style.display = "none";
    } catch (error) {
      console.log(error);
    };
  };
  
fetchPlanets();

// Function for rendering planets to the UI
function renderPlanetsToUI(data) {
  planetsContainerEl.innerHTML = '';
  data.forEach((planet) => {
    let planetCardEl = document.createElement("button");
    planetCardEl.classList.add(planet.name.toLowerCase());
    planetCardEl.onclick = () => {
      showLightbox(planet);
    };
    planetsContainerEl.appendChild(planetCardEl);
  });
};

// Function to open lightbox containing data of planets
// + navigation buttons
function showLightbox(planet) {
    let currentPlanetIndex = matchesArray.findIndex((p) => p.id === planet.id);
    if (openLightbox) {
      openLightbox.remove();
    }
  
    const lightboxEl = document.createElement("div");
    lightboxEl.classList.add("lightbox");
    const lightboxContentEl = document.createElement("div");
    lightboxContentEl.classList.add("lightbox-content");
  
    // Show the prev and next buttons
    prevPlanetBtn.style.display = "inline-block";
    nextPlanetBtn.style.display = "inline-block";
  
    prevPlanetBtn.addEventListener("click", () => {
      if (currentPlanetIndex > 0) {
        showLightbox(matchesArray[currentPlanetIndex - 1]);
      }
    });
  
    nextPlanetBtn.addEventListener("click", () => {
      if (currentPlanetIndex < matchesArray.length - 1) {
        showLightbox(matchesArray[currentPlanetIndex + 1]);
      }
    });
  
    // If selected planet has any moons, then show in the UI
    let numberOfMoons = "";
    if (planet.moons && planet.moons.length > 0) {
        const moonsOfPlanet = planet.moons.join(", ");
        numberOfMoons = `<b><p>Månar:</b> ${moonsOfPlanet}</p>`;
    }
    
    // Show data of the selected planet
    lightboxContentEl.innerHTML = `
        <h2>${planet.name}</h2>
        <h3><i>${planet.latinName}</i></h3>
        <p>${planet.desc}</p>
        <p><b>Avstånd från solen:</b> ${planet.distance} km</p>
        <p><b>Omkrets:</b> ${planet.circumference} km</p>
        <p><b>Max temperatur:</b> ${planet.temp.day}°C</p>
        <p><b>Min temperatur:</b> ${planet.temp.night}°C</p>
        <p><b>Antal jorddygn runt solen:</b> ${planet.orbitalPeriod}</p>
        ${numberOfMoons}
    `;
  
    // Creating close button to the lightbox
    const closeLightboxBtn = document.createElement("span");
    closeLightboxBtn.classList.add("close-lightbox-button");
    closeLightboxBtn.innerText = "×";
    closeLightboxBtn.onclick = () => {
      lightboxEl.remove();
      openLightbox = null;
  
      prevPlanetBtn.style.display = "none";
      nextPlanetBtn.style.display = "none";
    };
  
    lightboxEl.appendChild(closeLightboxBtn);
    lightboxContentEl.appendChild(closeLightboxBtn);
    lightboxEl.appendChild(lightboxContentEl);
    lightboxContainer.appendChild(lightboxEl);
    openLightbox = lightboxEl;
  };
  
// Filter planets based on search input
searchBox.addEventListener("input", () => {
    const searchInput = searchBox.value.toLowerCase();
    if (searchInput) {
      matchesArray = planetsArray.filter((planet) =>
        planet.name.toLowerCase().includes(searchInput)
      );
      planetsContainerEl.innerHTML = "";
      if (matchesArray.length > 0) {
        renderPlanetsToUI(matchesArray);
      } else {
        planetsContainerEl.innerHTML = `<p>Ingen planet med namnet "${searchInput}" hittades.</p>`;
      }
    } else {
      planetsContainerEl.innerHTML = showAllPlanets;
      matchesArray = planetsArray;
      renderPlanetsToUI(planetsArray);
    }
  });