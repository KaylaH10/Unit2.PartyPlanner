const COHORT = "REPLACE_ME!";
const API_URL = `https://fsa-async-await.herokuapp.com/api/${COHORT}/artists`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartiesForm = document.querySelector("#addParty");
addPartiesForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();

/**
 * Update state with artists from API
 */
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render artists from state
 */
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <p>${party.description}</p>
      <p>${party.date}</p>
      <p>${party.time}</p>
      <p>${party.location}</p>

    `;
    return li;
  });

  artistList.replaceChildren(...partyCards);
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartiesForm.name.value,
        description: addPartiesForm.description.value,
        date: addPartiesForm.date.value,
        time: addPartiesForm.time.value,
        location: addPartiesForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}