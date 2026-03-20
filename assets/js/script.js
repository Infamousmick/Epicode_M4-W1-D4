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
  const songTitle = song.title;
  const title = document.createElement("h2");
  title.textContent = songTitle;

  const artist = song.artist.name;
  const artistP = document.createElement("p");
  artistP.textContent = artist;

  const albumCover = song.album.cover_xl;
  const image = document.createElement("img");
  image.src = albumCover;

  const songDuration = parseDuration(song.duration);
  console.log(songDuration);

  const sectionId = `${serachedAuthor.toLowerCase()}Section`;
  const authorSection = document.getElementById(sectionId);

  if (authorSection) {
    authorSection.append(title, artistP, songDuration, image);
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
