// Usa il risultato di queste chiamate per rimpiazzare le canzoni
// che sono già sulla pagina.
// Puoi (e dovresti, per velocizzare il lavoro) usare bootstrap.
// Aggiungi un pulsante "crea lista". Al click, mostra tutti i TITOLI
// degli album sulla pagina.
// (EXTRA facoltativo: falli apparire in un modale di bootstrap).

// https://striveschool-api.herokuapp.com/api/deezer/search?q=INSERISCIQUIUNAQUERY

// Esempi:

// https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem

// https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica

// https://striveschool-api.herokuapp.com/api/deezer/search?q=queen

const URL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=`;
const authorsList = ["eminem", "metallica", "queen"];

const getData = async (url) => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    return err;
  }
};

const createURL = () => {
  authorsList.forEach((author) => {
    const authorURL = `${URL}${author}`;
    getData(authorURL).then((data) =>
      data.data.forEach((song) => {
        clearSections();
        createCards(song, author);
      }),
    );
  });
};

createURL();

const createCards = (song, searchedAuthor) => {
  const sectionId = `${searchedAuthor.toLowerCase()}Section`;
  const authorSection = document.getElementById(sectionId);

  const col = document.createElement("div");
  col.setAttribute("class", "col mb-4");

  const card = document.createElement("div");
  card.setAttribute("class", "card h-100 text-white border-0 p-2");

  const imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "imgContainer");

  const albumCover = song.album.cover_xl;
  const image = document.createElement("img");
  image.setAttribute("class", " shadow-sm w-100");
  image.src = albumCover;

  const playButton = document.createElement("i");
  playButton.setAttribute(
    "class",
    "playBtn fa-solid fa-play bg-success rounded-circle d-flex justify-content-center align-items-center shadow",
  );
  setupPlayButton(playButton);

  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body px-0 py-2");

  const songTopContainer = document.createElement("div");
  songTopContainer.setAttribute(
    "class",
    "d-flex justify-content-between align-items-center gap-2 mb-1 flex-nowrap",
  );

  const songTitle = song.title;
  const title = document.createElement("h5");
  title.setAttribute("class", "card-title text-truncate fw-bold mb-0");
  title.textContent = songTitle;

  const songDuration = document.createElement("p");
  songDuration.setAttribute("class", "card-text mb-0 text-light fw-bold ");
  songDuration.textContent = parseDuration(song.duration);

  const songBottomContainer = document.createElement("div");
  songBottomContainer.setAttribute(
    "class",
    "d-flex justify-content-between align-items-center gap-2 mb-1 flex-nowrap",
  );

  const artistName = song.artist.name;
  const artist = document.createElement("p");
  artist.setAttribute("class", "card-text small text-secondary artist mb-0");
  artist.textContent = artistName;

  const addPref = document.createElement("i");
  addPref.setAttribute("class", "addPref fa-solid fa-plus");
  setupPrefButton(addPref, songTitle);

  songTopContainer.append(title, songDuration);
  songBottomContainer.append(artist, addPref);
  cardBody.append(songTopContainer, songBottomContainer);
  imageContainer.append(image, playButton);
  card.append(imageContainer, cardBody);
  col.appendChild(card);

  if (authorSection) {
    authorSection.append(col);
  }
};

const clearSections = (state) => {
  authorsList.forEach((author) => {
    const sectionId = `${author.toLowerCase()}Section`;
    const authorSection = document.getElementById(sectionId);

    if (state) {
      authorSection.parentNode.classList.add("d-none");
    } else {
      authorSection.parentNode.classList.remove("d-none");
    }
  });
};

const createSection = (searched, searchTitle) => {
  const mainPAge = document.querySelector(".mainPage");

  const row = document.createElement("div");
  row.setAttribute("class", "row search-result-row");

  const col = document.createElement("div");
  col.setAttribute("class", "col-10");

  const searchContainer = document.createElement("div");
  searchContainer.setAttribute("id", "search-result");

  const sectionTitle = document.createElement("h2");
  sectionTitle.textContent = searchTitle;

  const searchedSection = document.createElement("div");
  searchedSection.setAttribute("id", `${searched}Section`);
  searchedSection.setAttribute(
    "class",
    "row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 imgLinks py-3",
  );

  searchContainer.append(sectionTitle, searchedSection);
  col.appendChild(searchContainer);
  row.appendChild(col);
  mainPAge.appendChild(row);
};

const parseDuration = (time) => {
  dateObj = new Date(time * 1000);
  minutes = dateObj.getUTCMinutes();
  seconds = dateObj.getSeconds();
  timeString =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  return timeString;
};

const setupPlayButton = (btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("fa-play");
    btn.classList.toggle("fa-pause");
  });
};

const prefList = [];
const setupPrefButton = (btn, title) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("fa-check")) {
      prefList.splice(prefList.indexOf(title), 1);
    } else {
      const object = { songName: title };
      prefList.push(object);
    }
    btn.classList.toggle("fa-plus");
    btn.classList.toggle("fa-check");
    createModalList();
  });
};

const search = () => {
  const searchInputValue = document
    .querySelector("#searchField")
    .value.toLowerCase();

  const oldSearches = document.querySelectorAll(".search-result-row");
  oldSearches.forEach((row) => row.remove());

  if (searchInputValue !== "") {
    const authorURL = `${URL}${searchInputValue}`;
    getData(authorURL).then((data) => {
      clearSections(true);
      if (data.data.length > 0) {
        createSection(searchInputValue, "Risultato:");
        data.data.forEach((song) => {
          createCards(song, searchInputValue);
        });
      } else {
        console.warn("Nessun risultato trovato");
      }
    });
  } else {
    clearSections(false);
  }
};

const searchInput = document
  .querySelector("#searchField")
  .addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      search();
    }
  });

const createModalList = () => {
  const modalUl = document.querySelector("#preferredListModal .modal-body ul");
  modalUl.innerHTML = "";
  prefList.forEach((pref) => {
    console.log(pref);
    const li = document.createElement("li");
    li.textContent = pref.songName;
    li.setAttribute("class", "list-group-item text-dark");
    modalUl.appendChild(li);
  });
};
