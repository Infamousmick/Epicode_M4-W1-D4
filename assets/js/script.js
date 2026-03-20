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
        console.log(song);
        createCards(song, author);
      }),
    );
  });
};

createURL();

const createCards = (song, serachedAuthor) => {
  const sectionId = `${serachedAuthor.toLowerCase()}Section`;
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
  songDuration.setAttribute("class", "card-text mb-0 text-light fw-bold");
  songDuration.textContent = parseDuration(song.duration);

  const artistName = song.artist.name;
  const artist = document.createElement("p");
  artist.setAttribute("class", "card-text small text-secondary");
  artist.textContent = artistName;

  songTopContainer.append(title, songDuration);
  cardBody.append(songTopContainer, artist);
  imageContainer.append(image, playButton);
  card.append(imageContainer, cardBody);
  col.appendChild(card);

  if (authorSection) {
    authorSection.append(col);
    authorSection.parentNode.classList.remove("d-none");
  } else {
    console.warn(
      `Attenzione: non ho trovato nessun elemento con ID "${sectionId}" nell'HTML.`,
    );
  }
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
