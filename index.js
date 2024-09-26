// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;
// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
const request = require('request');


const BOT_TOKEN = '8180114783:AAESz1YJIeFeyRjoEFe5HvHc--7Ck-EE5vg';

// BASE
const BASE_URL = 'https://api.themoviedb.org/3';
// API key TMDB
const API_KEY = 'api_key=74dc824830c7f93dc61b03e324070886';

// Resolución de imagenes
const IMG_ORI = 'https://image.tmdb.org/t/p/original';
const IMG_500 = 'https://image.tmdb.org/t/p/w500';
const IMG_300 = 'https://image.tmdb.org/t/p/w300';
const IMG_185 = 'https://image.tmdb.org/t/p/w185';
const IMG_92 = 'https://image.tmdb.org/t/p/w92';
// Lenguajes
const LANG_ES = 'language=es-MX';
const LANG_EN = 'language=en-US';

const bot = new Telegraf(BOT_TOKEN);

bot.on('inline_query', async (ctx) => {
 const query = ctx.inlineQuery.query;
 const url = `${BASE_URL}/search/movie?${API_KEY}&${LANG_ES}&query=${encodeURIComponent(query)}`;

 request(url, (error, response, body) => {
  if (!error && response.statusCode === 200) {
   const results = JSON.parse(body).results;
   const resultsList = results.map(movie => {

    const idMovie = movie.id;
    const title = movie.title;
    const initial = movie.title.substring(1, 0);
    const originalTitle = movie.original_title;
    const releaseYear = movie.release_date.split("-")[0];
    const posterPath = movie.poster_path;
    const langCode = movie.original_language;
    const overview = movie.overview;
    const genre = movie.genre_ids;


    const langComplete = await getLanguage(langCode);
    const durationTime = await getDurationMovie(id);
    const genreEs = await getGenres(genre);
    const actors = await getActorsMovie(id);

    return {
     type: 'article',
     id: idMovie,
     title: `${title} (${releaseYear})`,
     input_message_content: {
      message_text: `⟨🔠⟩ #${initial}\n▬▬▬▬▬▬▬▬▬\n⟨🍿⟩ ${title} (${releaseYear})\n⟨🎥⟩ ${originalTitle}\n▬▬▬▬▬▬▬▬▬\n⟨⭐⟩ Tipo : #Pelicula\n⟨🎟⟩ Estreno: #Año${releaseYear}\n⟨🗣️⟩ Idioma Original: ${langComplete}\n⟨🔊⟩ Audio: 🇲🇽 #Dual_Latino\n⟨📺⟩ Calidad: #HD\n⟨⏳⟩ Duración: ${durationTime}\n⟨🎭⟩ Género: ${genreEs}\n⟨👤⟩ Reparto: ${actors}\n▬▬▬▬▬▬▬▬▬\n⟨💭⟩ Sinopsis: ${overview}\n▬▬▬▬▬▬▬▬▬`
     },
     thumb_url: IMG_92 + posterPath,
     description: `${originalTitle}`,
    };
   });
   ctx.answerInlineQuery(resultsList);
  }
 });
});

// Funcion: Traducir el lenguaje.
async function getLanguage(languageCode) {
 const languages = {
  en: "🇺🇸 #Ingles",
  ca: "🇪🇸 #Catalan",
  fr: "🇫🇷 #Frances",
  de: "🇩🇪 #Aleman",
  it: "🇮🇹 #Italiano",
  ja: "🇯🇵 #Japones",
  ru: "🇷🇺 #Ruso",
  zh: "🇨🇳 #Chino",
  pl: "🇵🇱 #Polaco",
  ko: "🇰🇷 / 🇰🇵 #Coreano",
  es: "🇲🇽 / 🇪🇸 #Español",
 };
 return languages[languageCode] || languageCode;
}

// Funcion: Obtener la duración de la película.
async function getDurationMovie(movieId) {
 try {
  const response = await $.ajax({
   url: `${BASE_URL}/movie/${movieId}?${API_KEY}&${LANG_ES}`,
   async: false
  });
  const duracion = response.runtime;
  const horas = Math.floor(duracion / 60);
  const minutos = duracion % 60;
  return `${horas}h ${minutos}m`;
 } catch (error) {
  console.log(error);
  return "";
 }
}

async function getGenres(genreIds) {
 var genres = {
  28: "#Accion",
  12: "#Aventura",
  16: "#Animacion",
  35: "#Comedia",
  80: "#Crimen",
  99: "#Documental",
  18: "#Drama",
  10751: "#Familiar",
  14: "#Fantasia",
  36: "#Historia",
  27: "#Terror",
  10402: "#Musica",
  9648: "#Misterio",
  10749: "#Romance",
  878: "#Ciencia_Ficcion",
  10770: "#Película_de_la_Television",
  53: "#Suspenso",
  10752: "#Belica",
  37: "#Oeste",
  10759: "#Accion_y_Aventura",
  10762: "#Infantil",
  10763: "#Noticias",
  10764: "#Realidad",
  10765: "#Ciencia_Ficcion_y_Fantasia",
  10766: "#Serial",
  10767: "#Conversacion",
  10768: "#Politico",
  10769: "#Opcion_Interactiva"
 };

 var genreList = [];

 genreIds.forEach(function(genreId) {
  if (genres[genreId]) {
   genreList.push(genres[genreId]);
  }
 });

 return genreList.join(" ");
}


// Funcion: Obtener actores.
async function getActorsMovie(movieId) {
 try {
  const response = await $.ajax({
   url: `${BASE_URL}/movie/${movieId}/credits?${API_KEY}&${LANG_ES}`,
   async: false
  });
  const relevantActors = response.cast.filter(actor => actor.order <= 4);
  const actorNames = relevantActors.map(actor => `#${actor.name.replace(/\s/g, '_').replace(/'/g, '').replace(/-/g, '')} (${actor.character.replace(' (voice)', '').replace(' (hiccups)', '').replace(' (uncredited)', '')})`);
  return actorNames.join("</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
 } catch (error) {
  console.log('Ay, mi amor, algo salió mal:', error);
  return "";
 }
}


bot.launch();

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/tamosVivos"
app.get('/tamosVivos', (req, res) => {
 // Enviar una respuesta vacía
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/tamosVivos`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
    const formattedTime = currentDate;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de tamosVivos:', error);
   });
 }, 5 * 60 * 1000);
 // 30 minutos * 60 segundos * 1000 milisegundos
});