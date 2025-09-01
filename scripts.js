// scripts.js

// --------------------
// Global Variables
// --------------------
let aboutMeData = {};
let projectsData = [];
let currentSpotlightIndex = 0;

// --------------------
// Fetch Data Functions
// --------------------
async function fetchAboutMe() {
    try {
        const res = await fetch('./data/aboutMeData.json');
        aboutMeData = await res.json();
        populateAboutMe();
    } catch (error) {
        console.error('Error fetching About Me data:', error);
    }
}

async function fetchProjects() {
    try {
        const res = await fetch('./data/projectsData.json');
        projectsData = await res.json();
        populateProjects();
        setDefaultSpotlight();
    } catch (error) {
        console.error('Error fetching Projects data:', error);
    }
}

// --------------------
// Populate About Me
// --------------------
function populateAboutMe() {
    const aboutMeDiv = document.getElementById('aboutMe');

    // Create paragraph for bio
    const bioP = document.createElement('p');
    bioP.textContent = aboutMeData.aboutMe || "Bio not available.";
    aboutMeDiv.appendChild(bioP);

    // Create headshot container
    const headshotContainer = document.createElement('div');
    headshotContainer.classList.add('headshotContainer');

    const img = document.createElement('img');
    img.src = aboutMeData.headshot || './images/headshot_placeholder.webp';
    img.alt = "Headshot";
    headshotContainer.appendChild(img);

    aboutMeDiv.appendChild(headshotContainer);
}

// --------------------
// Populate Projects
// --------------------
function populateProjects() {
    const projectList = document.getElementById('projectList');
    const fragment = document.createDocumentFragment();

    projectsData.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('projectCard');
        card.id = project.project_id || `project-${index}`;

        // Set background image
        const cardImage = project.card_image || './images/card_placeholder_bg.webp';
        card.style.backgroundImage = `url('${cardImage}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';

        // Title
        const title = document.createElement('h4');
        title.textContent = project.project_name || "Untitled Project";
        card.appendChild(title);

        // Short description
        const shortDesc = document.createElement('p');
        shortDesc.textContent = project.short_description || "";
        card.appendChild(shortDesc);

        // Click listener to update spotlight
        card.addEventListener('click', () => {
            updateSpotlight(index);
        });

        fragment.appendChild(card);
    });

    projectList.appendChild(fragment);
}

// --------------------
// Spotlight Section
// --------------------
function setDefaultSpotlight() {
    updateSpotlight(0);
}

function updateSpotlight(index) {
    const project = projectsData[index] || {};
    currentSpotlightIndex = index;

    const spotlight = document.getElementById('projectSpotlight');
    const spotlightTitles = document.getElementById('spotlightTitles');

    // Update background image
    const bgImage = project.spotlight_image || './images/spotlight_placeholder_bg.webp';
    spotlight.style.backgroundImage = `url('${bgImage}')`;
    spotlight.style.backgroundSize = 'cover';
    spotlight.style.backgroundPosition = 'center';

    // Clear existing content
    spotlightTitles.innerHTML = '';

    // Project Name
    const title = document.createElement('h3');
    title.textContent = project.project_name || "Untitled Project";
    spotlightTitles.appendChild(title);

    // Long description
    const desc = document.createElement('p');
    desc.textContent = project.long_description || "";
    spotlightTitles.appendChild(desc);

    // External link
    if (project.url) {
        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = "Click here to see more...";
        link.target = "_blank";
        spotlightTitles.appendChild(link);
    }
}

// --------------------
// Scroll Project List
// --------------------
function setupProjectScrolling() {
    const leftArrow = document.querySelector('.arrow-left');
    const rightArrow = document.querySelector('.arrow-right');
    const projectList = document.getElementById('projectList');

    // Determine scroll direction based on screen width
    const mq = window.matchMedia('(min-width: 1024px)'); // Desktop vertical

    function scrollLeft() {
        if (mq.matches) projectList.scrollBy({ top: -200, behavior: 'smooth' });
        else projectList.scrollBy({ left: -200, behavior: 'smooth' });
    }

    function scrollRight() {
        if (mq.matches) projectList.scrollBy({ top: 200, behavior: 'smooth' });
        else projectList.scrollBy({ left: 200, behavior: 'smooth' });
    }

    leftArrow.addEventListener('click', scrollLeft);
    rightArrow.addEventListener('click', scrollRight);
}

// --------------------
// Form Validation
// --------------------
function setupFormValidation() {
    const form = document.getElementById('formSection');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const charCount = document.getElementById('charactersLeft');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const illegalChars = /[^a-zA-Z0-9@._-]/;

    // Live character count
    messageInput.addEventListener('input', () => {
        const length = messageInput.value.length;
        charCount.textContent = `Characters: ${length}/300`;

        if (length > 300) charCount.classList.add('error');
        else charCount.classList.remove('error');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Reset errors
        emailError.textContent = '';
        messageError.textContent = '';

        const emailValue = emailInput.value.trim();
        const messageValue = messageInput.value.trim();

        // Email validation
        if (!emailValue) {
            emailError.textContent = 'Email cannot be empty.';
            valid = false;
        } else if (!emailRegex.test(emailValue)) {
            emailError.textContent = 'Email format is invalid.';
            valid = false;
        } else if (illegalChars.test(emailValue)) {
            emailError.textContent = 'Email contains illegal characters.';
            valid = false;
        }

        // Message validation
        if (!messageValue) {
            messageError.textContent = 'Message cannot be empty.';
            valid = false;
        } else if (illegalChars.test(messageValue)) {
            messageError.textContent = 'Message contains illegal characters.';
            valid = false;
        } else if (messageValue.length > 300) {
            messageError.textContent = 'Message exceeds 300 characters.';
            valid = false;
        }

        if (valid) {
            alert('Form submitted successfully!');
            form.reset();
            charCount.textContent = 'Characters: 0/300';
        }
    });
}

// --------------------
// Initialize
// --------------------
document.addEventListener('DOMContentLoaded', () => {
    fetchAboutMe();
    fetchProjects();
    setupProjectScrolling();
    setupFormValidation();
});
