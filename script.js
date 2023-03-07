function generatePokemon(pokeNum, pokeName) {
  const article = document.createElement("article");
  article.className = "wrapper";

  const wrapper = document.createElement("div");
  wrapper.className = "pokemon";
  article.appendChild(wrapper);

  const image = document.createElement("img");
  image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeNum}.png`;
  image.alt = pokeName;
  image.width = 96;
  image.height = 96;
  wrapper.appendChild(image);

  const paragraph = document.createElement("p");
  paragraph.innerText = pokeName;
  wrapper.appendChild(paragraph);

  const container = document.querySelector(".pokemonsContainer");
  container.appendChild(article);
}

async function getData(url) {
  const response = await axios.get(url);
  return response.data;
}

function getPokeNum(url) {
  const niz = url.split("/");
  return niz[niz.length - 2];
}

function clearAllChildren() {
  const container = document.querySelector(".pokemonsContainer");
  container.innerHTML = "";
}

async function initPokemons(url) {
  clearAllChildren();
  const pokemons = await getData(url);

  pokemons.results.forEach((element) => {
    const pokeNum = getPokeNum(element.url);
    generatePokemon(pokeNum, element.name);
  });

  const nextButton = document.getElementById("next");
  if (pokemons.next !== null) {
    nextButton.onclick = () => initPokemons(pokemons.next);
    nextButton.disabled = false;
  } else {
    nextButton.onclick = () => null;
    nextButton.disabled = true;
  }

  const prevButton = document.getElementById("prev");
  if (pokemons.previous !== null) {
    prevButton.onclick = () => initPokemons(pokemons.previous);
    prevButton.disabled = false;
  } else {
    prevButton.onclick = () => null;
    prevButton.disabled = true;
  }
}
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const pokemonContainer = document.getElementById("pokemon-container");

searchButton.addEventListener("click", () => {
  const pokemonName = searchInput.value.toLowerCase().trim();
  if (!pokemonName) {
    alert("Please enter a Pokemon name.");
    return;
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((pokemon) => {
      let abilitiesHTML = "";
      pokemon.abilities.forEach((ability) => {
        abilitiesHTML += `<li>${ability.ability.name}</li>`;
      });

      const pokemonHTML = `
				<div>
					<h2>${pokemon.name}</h2>
					<img src="${pokemon.sprites.front_default}">
					<p>Height: ${pokemon.height}</p>
					<p>Weight: ${pokemon.weight}</p>
					<ul>Abilities:
						${abilitiesHTML}
					</ul>
				</div>
			`;
      pokemonContainer.innerHTML = pokemonHTML;
    })
    .catch((error) => {
      alert("Pokemon not found.");
      console.error(error);
    });
});

initPokemons("https://pokeapi.co/api/v2/pokemon");
