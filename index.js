// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;

// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
// Importar las bibliotecas requeridas
const request = require('request');
const xml2js = require('xml2js');

const BOT_TOKEN = '7723354766:AAF1LFQ2r2Ti870zZvzyab3DD-bASUrUL4s';


const bot = new Telegraf(BOT_TOKEN);

const RSS_URL = 'https://www.cinemascomics.com/cine/feed/';

const fetchNews = () => {
 request(RSS_URL, (error, response, body) => {
  if (!error && response.statusCode == 200) {
   xml2js.parseString(body, (err, result) => {
    if (!err) {
     const items = result.rss.channel[0].item;
     items.forEach(item => {
      const title = item.title[0];
      const link = item.link[0];
      const description = item.description[0];
      const hashtags = ['#Cine', '#Noticias', '#Películas', '#Estrenos', '#Cultura', '#Entretenimiento'];

      const message = `
⟨📰⟩ #Noticia
▬▬▬▬▬▬▬▬▬
⟨🍿⟩ ${title}
▬▬▬▬▬▬▬▬▬
⟨💭⟩ Resumen: ${description.substring(0, 1000)}...
▬▬▬▬▬▬▬▬▬
${hashtags.join(' ')}

⟨🗞️⟩ Noticia ⟨🗞️⟩ - ${link}
                        `;
      bot.telegram.sendMessage('6839704393', message);
     });
    }
   });
  }
 });
};

bot.start((ctx) => {
 const username = ctx.from.username ? `@${ctx.from.username}` : '';
 const firstName = ctx.from.first_name ? ctx.from.first_name : '';
 const userId = ctx.from.id;

 console.log(`"Nombre: ${firstName}, Usuario: ${username}, con el id: ${userId} uso : /start"`);


 ctx.reply('¡Hola! Estoy aquí para traerte las últimas noticias de cine.')
});

bot.command('news', (ctx) => {
 const username = ctx.from.username ? `@${ctx.from.username}` : '';
 const firstName = ctx.from.first_name ? ctx.from.first_name : '';
 const userId = ctx.from.id;

 console.log(`"Nombre: ${firstName}, Usuario: ${username}, con el id: ${userId} uso : /news"`);
 fetchNews()
});

setInterval(fetchNews, 60000); // Mantiene el bot vivo

bot.launch();


//=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=•=\\

// Ruta "/ping"
app.get('/ping', (req, res) => {
 // Enviar una respuesta vacía
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/ping`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" }).replace(' a. m.', ' am')
    replace(' p. m.', ' pm');
    const formattedTime = currentDate;
    console.log(`Sigo vivo 🎉 (${formattedTime})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de ping:', error);
   });
 }, 5 * 60 * 1000); // 5 m * 60 s * 1000 ms
});