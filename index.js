// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;
// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
const request = require('request');

// Definir la API key de TheMovieDB y el token del bot
const API_KEY = '74dc824830c7f93dc61b03e324070886';

const BOT_TOKEN = '8180114783:AAFrGu06UhD3DH0wM6VYDupf177JBKz9uHI';

// Crear el bot
const bot = new Telegraf(BOT_TOKEN);

// Comando para buscar películas
bot.command('pelicula', (ctx) => {
 const query = ctx.message.text.split(' ')[1]; // Obtener la película a buscar

 // Hacer la solicitud a TheMovieDB
 request(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`, (error, response, body) => {
  if (!error && response.statusCode == 200) {
   const data = JSON.parse(body);

   // Enviar lista de resultados al usuario
   data.results.forEach((result, index) => {
    ctx.reply(`${index + 1}. ${result.title} (${result.release_date.split('-')[0]})`);
   });

   // Manejar la selección del usuario
   bot.hears(/^\d+$/, (ctx) => {
    const selectedMovie = data.results[parseInt(ctx.message.text) - 1];

    // Enviar detalles de la película seleccionada
    ctx.reply(`
     🎬 ${selectedMovie.title} (${selectedMovie.release_date.split('-')[0]})
     🌟 ${selectedMovie.original_title}
     🗣️ ${selectedMovie.original_language}
     🎭 ${selectedMovie.genres.map(genre => genre.name).join(', ')}
     📝 ${selectedMovie.overview}
    `);
   });
  } else {
   ctx.reply('¡Ups! Hubo un error al buscar la película. Inténtalo de nuevo más tarde.');
  }
 });
});

// Iniciar el bot 
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