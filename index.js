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
    const originalTitle = movie.original_title;
    const releaseYear = movie.release_date.split("-")[0];
    const posterPath = movie.poster_path;
    const langCode = movie.original_language;
    const overview = movie.overview;

    return {
     type: 'article',
     id: idMovie,
     title: `${title} (${releaseYear})`,
     input_message_content: {
      message_text: `
      ${title} (${releaseYear})\n
      ${originalTitle}\n
      ${langCode}\n
      ${overview}`
     },
     thumb_url: IMG_92 + posterPath,
     description: `${originalTitle}`,
    };
   });
   ctx.answerInlineQuery(resultsList);
  }
 });
});

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