// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;
// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
const request = require('request');

const API_KEY = '74dc824830c7f93dc61b03e324070886';
const BOT_TOKEN = '8180114783:AAFrGu06UhD3DH0wM6VYDupf177JBKz9uHI';

const bot = new Telegraf(BOT_TOKEN);

bot.on('inline_query', async (ctx) => {
 const query = ctx.inlineQuery.query;
 if (!query) return;

 const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;

 request(url, (error, response, body) => {
  if (!error && response.statusCode === 200) {
   const results = JSON.parse(body).results;
   const inlineResults = results.map(movie => ({
    type: 'article',
    id: movie.id,
    title: `${movie.title} (${movie.release_date.split('-')[0]}))`,
    input_message_content: {
     message_text: `![Backdrop](${movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : ''})\n**${movie.title} (${movie.release_date.split('-')[0]})**\n**Título original:** ${movie.original_title}\n**Idioma original:** ${movie.original_language}\n**Géneros:** ${movie.genre_ids.join(', ')}\n**Sinopsis:** ${movie.overview}`,
     parse_mode: 'MarkdownV2',
    },
    thumb_url: `https://image.tmdb.org/t/p/w92${movie.poster_path}`,
    description: `${movie.original_title}\n1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16-17-18-19-20-21-22-23-24-25-26-27-28-29-30`,
   }));

   ctx.answerInlineQuery(inlineResults);
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