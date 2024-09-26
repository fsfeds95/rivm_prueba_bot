// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;
// Importar la biblioteca telegraf
const { Telegraf } = require('telegraf');
// Importar las bibliotecas requeridas
const jimp = require('jimp-compact');
const request = require('request');

// el API TOKEN del bot
const BOT_TOKEN = '8180114783:AAHQuvWCUFo98JjMK5NeAX_AQkawBy7xHec';
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
bot.command('backdrops', (ctx) => {
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