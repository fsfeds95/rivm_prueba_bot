// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;

// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
const jimp = require('jimp-compact');
const request = require('request');

const BOT_TOKEN = '7224464210:AAFDVRgN1KEfkPkpVtjGbXEtS3oU96YpUu0';

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
  userIds.push(userId);
 }

 ctx.reply(`¡Hola ${firstName} bienvenido, este es tu usuario ${username}!`);
});

// Comando para buscar backdrops
bot.command('backdrop', (ctx) => {
 const idMovie = ctx.message.text.split(' ')[1]; // Obtiene el ID de la película del mensaje
 if (!idMovie) {
  ctx.reply('Por favor, proporciona un ID de película válido.');
  return;
 }

 const url = `${BASE_URL}/movie/${idMovie}/images?${API_KEY}`;

 request(url, (error, response, body) => {
  if (error || response.statusCode !== 200) {
   console.log('Ay, mi amor, algo salió mal:', error);
   ctx.reply('Ocurrió un error al buscar los backdrops. Intenta de nuevo más tarde.');
   return;
  }

  const data = JSON.parse(body);
  const backdrops = data.backdrops;

  if (!backdrops || backdrops.length === 0) {
   ctx.reply('Lo siento, no se encontraron backdrops para esta película.');
   return;
  }

  backdrops.forEach(backdrop => {
   const backdropUrl = IMG_ORI + backdrop.file_path; // Genera la URL de cada backdrop
   ctx.replyWithPhoto(backdropUrl); // Envía la imagen
  });
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
});