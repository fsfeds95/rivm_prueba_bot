// Importar las bibliotecas requeridas
const express = require('express'); // Para crear el servidor web
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const fetch = require('node-fetch'); // Asegúrate de tener esta dependencia

// Crear una aplicación en Express
const app = express();
// Puerto donde se ejecutará el servidor
const port = 8225;

// Reemplaza con el ID del usuario permitido
const ALLOWED_USER_ID = 6839704393;
const BOT_TOKEN = '7723354766:AAHrjbwxDvxZemQ3Joa7RE_5Yjvhq2Hx3vk';

// Conexión a MongoDB
mongoose.connect('mongodb+srv://alphayomegafilms:ggZsnCHGTEvoDkZF@introcinemaclub.ulfcq.mongodb.net/introCinemaClub?retryWrites=true&w=majority', {});

// Esquema de la base de datos
const movieSchema = new mongoose.Schema({
 titleEsp: { type: String, required: true },
 titleOrg: { type: String, required: true },
 anio: { type: Number, required: true },
 genreEsp: { type: String, required: true },
 sinopsisEsp: { type: String, required: true },
 urlImg: { type: String, required: true },
 urlMovie: { type: String, required: true },
 votos: {
  meEncanta: { type: Number, default: 0 },
  buena: { type: Number, default: 0 },
  meh: { type: Number, default: 0 },
  mala: { type: Number, default: 0 },
  noMeGusto: { type: Number, default: 0 }
 }
});

const Movie = mongoose.model('Movie', movieSchema);

// Inicializa el bot
const bot = new Telegraf(BOT_TOKEN);

let step = 0;
let movieData = {};

bot.start((ctx) => ctx.reply('¡Hola! Soy tu asistente de cine.'));

bot.command('addmovie', (ctx) => {
 if (ctx.from.id === ALLOWED_USER_ID) { // Verifica si el usuario es el administrador
  step = 0; // Reinicia el paso
  movieData = {}; // Reinicia los datos
  ctx.reply('Envia el Título de la película en español.');
 } else {
  ctx.reply('Lo siento, solo el administrador puede usar este comando.');
 }
});

bot.on('text', (ctx) => {
 if (step === 0) {
  // Si el paso es 0, no hacemos nada, ya que no se ha iniciado el proceso
  return;
 }

 if (ctx.from.id !== ALLOWED_USER_ID) {
  ctx.reply('Lo siento, solo el administrador puede usar este comando.');
  return;
 }

 if (step === 1) {
  movieData.titleEsp = ctx.message.text;
  step++;
  ctx.reply('Envia el Título en su idioma original de la película.');
 } else if (step === 2) {
  movieData.titleOrg = ctx.message.text;
  step++;
  ctx.reply('Envia el Año de estreno (4 números).');
 } else if (step === 3) {
  if (/^\d{4}$/.test(ctx.message.text)) {
   movieData.anio = parseInt(ctx.message.text);
   step++;
   ctx.reply('Enviame los Géneros en Español (usa #genero).');
  } else {
   ctx.reply('Por favor, envía un año válido (4 números).');
  }
 } else if (step === 4) {
  if (ctx.message.text.startsWith('#')) {
   movieData.genreEsp = ctx.message.text;
   step++;
   ctx.reply('Enviame la Sinopsis en Español de la película.');
  } else {
   ctx.reply('Recuerda usar un hashtag para los géneros, como #acción.');
  }
 } else if (step === 5) {
  movieData.sinopsisEsp = ctx.message.text;
  step++;
  ctx.reply('Enviame la url de la imagen de la película (POSTER, BACKDROP).');
 } else if (step === 6) {
  movieData.urlImg = ctx.message.text;
  step++;
  ctx.reply('Enviame la url de la película (TERABOX, MEGA, DRIVE).');
 } else if (step === 7) {
  movieData.urlMovie = ctx.message.text;
  // Aquí guardamos la película en la base de datos
  const newMovie = new Movie(movieData);
  newMovie.save()
   .then(() => {
    ctx.reply('¡Película agregada correctamente! 🎉');
    step = 0; // Reinicia el paso
    movieData = {}; // Limpia los datos
   })
   .catch(err => ctx.reply('Error al agregar la película.'));
 } else {
  ctx.reply('¡Ups! Algo salió mal. Usa /addmovie para empezar de nuevo.');
  step = 0; // Reinicia el paso
 }
});

bot.command('movie', async (ctx) => {
 const movies = await Movie.find();
 if (movies.length === 0) {
  ctx.reply('¡Ups! No se ha encontrado ninguna película.');
  return;
 }

 const randomMovie = movies[Math.floor(Math.random() * movies.length)];
 ctx.replyWithPhoto(randomMovie.urlImg, {
  caption: `${randomMovie.titleEsp}\n${randomMovie.titleOrg}\nAño: ${randomMovie.anio}\nGéneros: ${randomMovie.genreEsp}\nSinopsis: ${randomMovie.sinopsisEsp}`,
  reply_markup: {
   inline_keyboard: [
    [
     { text: '❤️ ' + randomMovie.votos.meEncanta, callback_data: 'me_encanta_' + randomMovie._id },
     { text: '👍 ' + randomMovie.votos.buena, callback_data: 'buena_' + randomMovie._id },
     { text: '😐 ' + randomMovie.votos.meh, callback_data: 'meh_' + randomMovie._id },
     { text: '💩 ' + randomMovie.votos.mala, callback_data: 'mala_' + randomMovie._id },
     { text: '💔 ' + randomMovie.votos.noMeGusto, callback_data: 'no_me_gusto_' + randomMovie._id }
    ],
    [{ text: 'Ver película', url: randomMovie.urlMovie }],
    [{ text: 'Canal oficial', url: 'https://t.me/introCinemaClub' }]
   ]
  }
 });
});


bot.on('callback_query', async (ctx) => {
 const [reaction, movieId] = ctx.callbackQuery.data.split('_');
 const movie = await Movie.findById(movieId);

 switch (reaction) {
  case 'me_encanta':
   movie.votos.meEncanta++;
   break;
  case 'buena':
   movie.votos.buena++;
   break;
  case 'meh':
   movie.votos.meh++;
   break;
  case 'mala':
   movie.votos.mala++;
   break;
  case 'no_me_gusto':
   movie.votos.noMeGusto++;
   break;
 }

 await movie.save();
 ctx.answerCbQuery('¡Gracias por reaccionar!');
});

bot.launch(); // Inicia el bot

// Ruta "/ping" para verificar que el servidor está funcionando
app.get('/ping', (req, res) => {
 const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
 console.log(`Sigo vivo 🎉 (${currentDate})`);
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Mantiene la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/ping`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
    console.log(`Sigo vivo 🎉 (${currentDate})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de ping:', error);
   });
 }, 5 * 60 * 1000); // Cada 5 minutos
});