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

const extractImage = (content) => {
 const match = content.match(/<img[^>]+src="([^">]+)"/);
 return match ? match[1] : null; // Retorna la URL de la primera imagen
};

const fetchNews = (ctx = null) => {
 request(RSS_URL, (error, response, body) => {
  if (!error && response.statusCode === 200) {
   xml2js.parseString(body, (err, result) => {
    if (!err) {
     const items = result.rss.channel[0].item;
     const randomArticles = items.sort(() => 0.5 - Math.random()).slice(0, 5); // Artículos aleatorios

     if (ctx) {
      randomArticles.forEach(item => {
       const title = item.title[0];
       const link = item.link[0];
       const description = item.description[0];
       const content = item['content:encoded'][0];
       const imageUrl = extractImage(content); // Obtener la imagen
       const hashtags = ['#Cine', '#Noticias', '#Películas', '#Estrenos', '#Cultura', '#Entretenimiento'];

       // Obtener categorías como texto plano
       const categoriesText = item.category ? item.category.join(', #') : '';

       const message = `
⟨📰⟩ #Noticia
▬▬▬▬▬▬▬▬▬
⟨🍿⟩ ${title}
▬▬▬▬▬▬▬▬▬
⟨💭⟩ Resumen: ${description.substring(0, 1000)}...
▬▬▬▬▬▬▬▬▬
${hashtags.join(' ')}
#${categoriesText}
                            `;

       // Crear un botón para el enlace
       const button = [{ text: 'Leer Noticia', url: link }];
       ctx.replyWithPhoto(imageUrl, { caption: message, reply_markup: { inline_keyboard: [button] } })
        .catch(err => console.error('Error al enviar el mensaje:', err));
      });
     } else {
      const latestItem = randomArticles[0]; // Solo el primer artículo aleatorio
      const title = latestItem.title[0];
      const link = latestItem.link[0];
      const description = latestItem.description[0];
      const content = latestItem['content:encoded'][0];
      const imageUrl = extractImage(content); // Obtener la imagen
      const hashtags = ['#Cine', '#Noticias', '#Películas', '#Estrenos', '#Cultura', '#Entretenimiento'];

      // Obtener categorías como texto plano
      const categoriesText = latestItem.category ? latestItem.category.join(', #') : '';

      const message = `
⟨📰⟩ #Noticia
▬▬▬▬▬▬▬▬▬
⟨🍿⟩ ${title}
▬▬▬▬▬▬▬▬▬
⟨💭⟩ Resumen: ${description.substring(0, 1000)}...
▬▬▬▬▬▬▬▬▬
${hashtags.join(' ')}
#${categoriesText}
                        `;

      // Crear un botón para el enlace
      const button = [{ text: 'Leer Noticia', url: link }];
      bot.telegram.sendPhoto('6839704393', imageUrl, { caption: message, reply_markup: { inline_keyboard: [button] } })
       .catch(err => console.error('Error al enviar el mensaje:', err));
     }
    } else {
     console.error('Error al parsear el RSS:', err);
    }
   });
  } else {
   console.error('Error al obtener el RSS:', error);
  }
 });
};

bot.start((ctx) => ctx.reply('¡Hola! Estoy aquí para traerte las últimas noticias de cine. 🎬'));

bot.command('news', (ctx) => fetchNews(ctx)); // Enviar cinco artículos aleatorios

setInterval(() => fetchNews(), 60000); // Mantiene el bot vivo y envía solo el último artículo

bot.launch();

// Ruta "/ping"
app.get('/ping', (req, res) => {
 res.send('');
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
 console.log(`Servidor iniciado en http://localhost:${port}`);

 // Código del cliente para mantener la conexión activa
 setInterval(() => {
  fetch(`http://localhost:${port}/ping`)
   .then(response => {
    const currentDate = new Date().toLocaleString("es-VE", { timeZone: "America/Caracas" });
    console.log(`Sigo vivo 🎉 (${currentDate})`);
   })
   .catch(error => {
    console.error('Error en la solicitud de ping:', error);
   });
 }, 5 * 60 * 1000); // 5 m * 60 s * 1000 ms
});