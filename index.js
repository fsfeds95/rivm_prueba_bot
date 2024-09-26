// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;

// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
// Importar las bibliotecas requeridas
const jimp = require('jimp-compact');
const request = require('request');

const BOT_TOKEN = '7723354766:AAEbGlT2-Mru3sFRENZ_0Kted-uvgPipwW0';

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

// Array para almacenar los IDs de los usuarios
const userIds = [];



//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\
//                        COMANDOS                       \\

// Respuesta de Bienvenida al comando /start
bot.start((ctx) => {
 const username = ctx.from.username ? `@${ctx.from.username}` : '';
 const firstName = ctx.from.first_name ? ctx.from.first_name : '';
 const userId = ctx.from.id;

 console.log(`"Nombre: ${firstName}, Usuario: ${username}, con el id: ${userId} uso : /start"`);

 if (!userIds.includes(userId)) {
  // Agregar el ID si no está ya en el array
  userIds.push(userId);
 }

 ctx.reply(`¡Hola ${firstName} bienvenido, este es tu usuario ${username}!`);
});


// Comando para buscar backdrops
bot.command('backdrop', (ctx) => {
 const idMovie = ctx.message.text.split(' ')[1]; // Obtiene el ID de la película del mensaje
 const url = `${BASE_URL}/movie/${idMovie}/images?${API_KEY}`;

 request(url, (error, response, body) => {
  if (error) {
   console.log('Ay, mi amor, algo salió mal:', error);
   ctx.reply('Ocurrió un error al buscar los backdrops. Intenta de nuevo más tarde.');
   return;
  }

  const backdrops = JSON.parse(body).backdrops;

  if (backdrops.length === 0) {
   ctx.reply('Lo siento, no se encontraron backdrops para esta película.');
   return;
  }

  // Filtrar backdrops por idioma
  const filteredBackdrops = backdrops.filter(backdrop => {
   return backdrop.iso_639_1 === 'es' || backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null;
  });

  // Agrupar backdrops por idioma
  const groupedBackdrops = filteredBackdrops.reduce((acc, backdrop) => {
   const lang = backdrop.iso_639_1 || 'null'; // Usa 'null' si no hay idioma
   if (!acc[lang]) acc[lang] = [];
   if (acc[lang].length < 2) acc[lang].push(backdrop);
   return acc;
  }, {});

  // Enviar solo dos backdrops por idioma
  for (const lang in groupedBackdrops) {
   groupedBackdrops[lang].forEach(backdrop => {
    const backdropUrl = IMG_ORI + backdrop.file_path; // Genera la URL de cada backdrop
    ctx.replyWithPhoto(backdropUrl); // Envía la imagen
   });
  }

  if (Object.keys(groupedBackdrops).length === 0) {
   ctx.reply('No se encontraron backdrops en los idiomas deseados.');
  }
 });
});


//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\
//                        EVENTOS                        \\

// Repite todoo lo que le escribas
bot.on('text', (ctx) => {
 const username = ctx.from.username ? `@${ctx.from.username}` : '';
 const firstName = ctx.from.first_name ? ctx.from.first_name : '';
 const userId = ctx.from.id;

 console.log(`"Nombre: ${firstName}, Usuario: ${username}, con el id: ${userId} envio un texto"`);

 ctx.reply('' + ctx.message.text);
});

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

bot.launch();

//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/keep-alive"
app.get('/keep-alive', (req, res) => {
 // Enviar una respuesta vacía
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/keep-alive`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
    const formattedTime = currentDate;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de keep-alive:', error);
   });
 }, 5 * 60 * 1000);
 // 30 minutos * 60 segundos * 1000 milisegundos
});