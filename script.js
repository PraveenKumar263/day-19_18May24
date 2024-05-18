// Create div element with class
function createDivElement(classname) {
    let ele = document.createElement("div");
    ele.className = classname;
    return ele;
}

// Fetch tv show data based on query
async function fetchTVShowData(searchQuery) {
    try {
        const response = await fetch(`https://api.tvmaze.com/${searchQuery}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tv shows data:', error);
        return [];
    }
}

// Create clickable text to represent popular shows
function createClickableText(showName) {
    let text = document.createElement("span");
    text.textContent = showName;
    text.className = "clickable";
    text.addEventListener("click", () => handlePopularShowClick(showName));
    text.addEventListener("mouseenter", () => text.style.fontWeight = "bold"); // bold on hover
    text.addEventListener("mouseleave", () => text.style.fontWeight = "normal");
    return text;
}

// Go to popular show on click
async function handlePopularShowClick(showName) {
    try {
        // Fetch TV show data based on the selected show name
        const showData = await fetchTVShowData(`singlesearch/shows?q=${showName}`);
        // Display the fetched data
        console.log(showData)
        displayShowCard(showData);
    } catch (error) {
        console.error('Error fetching tv show data:', error);
    }
}

// Create the card to display info
function displayShowCard(info) {
    let card = document.getElementById("showCard");
    if (!card) {
        // Create a new card if it doesn't exist
        card = createDivElement("card col-md-8");
        card.id = "showCard";
        const cardContainer = document.getElementById("cardContainer");
        cardContainer.appendChild(card);
    }

    const scheduleDatesArr = Object.values(info.schedule.days).join(', ');
    const genres = Object.values(info.genres).join(', ');
    const country = info.network.country.name;
    const network = info.network.name;
    const cardContent = `
        <img src="${info.image?.medium || ''}" class="card-img-top" alt="${info.name}">
        <div class="card-body">
            <h5 class="card-title">${info.name}</h5>
            <p class="card-text">Genres: ${genres || ''}</p>
            <p class="card-text">Premiered Date: ${info.premiered || ''}</p>
            <p class="card-text">Schedule Days: ${scheduleDatesArr || ''}</p>
            <p class="card-text">Schedule Time: ${info.schedule.time || ''}</p>
            <p class="card-text">Rating: ${info.rating.average || ''}</p>
            <p class="card-text">Country: ${country || ''}</p>
            <p class="card-text">Network: ${network || ''}</p>
            <p class="card-text">Summary: ${info.summary || ''}</p>
        </div>
    `;

    card.innerHTML = cardContent;
}


// Basic element setup
const container = createDivElement("container mt-2");
const row = createDivElement("row");
const formDiv = createDivElement("col-md-12");
formDiv.id = "formDiv";
const title = createDivElement("col-md-12");
title.className = "pageTitle";
title.innerHTML = `
                    <h3>Trending TV Shows</h3>
                    <p>Pick your favourite</p>
`;
const popularPicks = ['Girls', 'The Flash', 'Fall River', 'Debris', 'Innocent'];

// Display popular picks as clickable text items
const popularPicksContainer = createDivElement("col-md-12");
popularPicksContainer.innerHTML = `
    <h4>Popular Picks</h4>
`;
popularPicksContainer.id = "popularPicksContainer";
popularPicks.forEach((showName, index) => {
    const showElement = createClickableText(showName);
    popularPicksContainer.appendChild(showElement);
    if (index < popularPicks.length - 1) {
        // Add separator between show names
        const separator = document.createElement("span");
        separator.textContent = " | ";
        separator.style.margin = "0 5px";
        popularPicksContainer.appendChild(separator);
    }
});

// Create form elements and set up event listeners
function setupForm() {
    let formContainer = document.getElementById("formDiv");
    // Create form element
    const form = document.createElement("form");
    form.id = "searchForm";

    // Create label element
    const label = document.createElement("label");
    label.setAttribute("for", "showsearch");
    label.textContent = "Search by show name";

    // Create input element
    const input = document.createElement("input");
    input.type = "search";
    input.id = "showsearch";

    // Create button element
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Go";
    button.addEventListener("click", handleSearch);

    // Append elements to form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    formContainer.appendChild(form);
}

// Handle search button click
async function handleSearch() {
    const searchInput = document.getElementById("showsearch").value.trim();
    if (searchInput !== "") {
        try {
            const showData = await fetchTVShowData(`singlesearch/shows?q=${searchInput}`);
            displayShowCard(showData);
        } catch (error) {
            console.error('Error fetching tv show data:', error);
        }
    }
}

// Append elements to the container
row.appendChild(title);
row.appendChild(popularPicksContainer);
row.appendChild(formDiv);
const cardContainer = createDivElement("col-md-12 card-container");
cardContainer.id = "cardContainer";
row.appendChild(cardContainer);
container.appendChild(row);

// Append container to the document body
document.body.appendChild(container);

// Call the setupForm function to create the form
setupForm();
