// Importar las bibliotecas requeridas
const express = require('express');
// Crea una aplicación en Express
const app = express();
const port = 8225;

// Importar las dependencias necesarias
const { Telegraf } = require('telegraf');
const request = require('request');
const xml2js = require('xml2js');

const BOT_TOKEN = '7723354766:AAFlbfzZWUnQ7rAed69_yF0g2U-g2bMjAmg';

const bot = new Telegraf(BOT_TOKEN);

const RSS_cine = 'https://www.cinemascomics.com/cine/feed/';
const RSS_serie = 'https://www.cinemascomics.com/series-de-television/feed/';

const extractImage = (content) => {
 const match = content.match(/<img[^>]+src="([^">]+)"/);
 return match ? match[1] : null; // Retorna la URL de la primera imagen
};

const isValidImageUrl = (url, callback) => {
 request.head(url, (err, res) => {
  if (!err && res.statusCode === 200) {
   callback(true);
  } else {
   callback(false);
  }
 });
};

const fetchCine = (ctx = null) => {
 request(RSS_cine, (error, response, body) => {
  if (!error && response.statusCode === 200) {
   xml2js.parseString(body, (err, result) => {
    if (!err) {
     const items = result.rss.channel[0].item;
     const randomArticles = items.sort(() => 0.5 - Math.random()).slice(0, 3); // Artículos aleatorios

     if (ctx) {
      randomArticles.forEach(item => {
       const title = item.title[0];
       const link = item.link[0];
       const description = item.description[0];
       const content = item['content:encoded'][0];
       const imageUrl = extractImage(content); // Obtener la imagen
       const hashtags = ['#Cine', '#Noticias', '#Películas', '#Estrenos', '#Cultura', '#Entretenimiento'];

       // Obtener categorías como texto plano
       const categoriesText = item.category ? item.category : [];
       const catReplace = categoriesText.join(' ').replace(/\s/g, '_'); // Reemplaza espacios por guiones bajos
       const hashtagCat = `#` + catReplace.split('_').join(' #'); // Agrega el símbolo de hashtag

       // Crear un conjunto de hashtags únicos
       const uniqueHashtags = new Set(hashtags);

       // Comparar y eliminar los que ya están en hashtags
       hashtagCat.split(' ').forEach(cat => {
        if (cat) {
         uniqueHashtags.delete(cat); // Elimina si ya existe
        }
       });

       // Unir los hashtags únicos de nuevo en una cadena
       const finalHashtags = Array.from(uniqueHashtags).join(' ');

       const message = `
⟨📰⟩ #Noticia
▬▬▬▬▬▬▬▬▬
⟨🍿⟩ ${title}
▬▬▬▬▬▬▬▬▬
⟨💭⟩ Resumen: ${description.substring(0, 1500)}...
▬▬▬▬▬▬▬▬▬
${finalHashtags}
▬▬▬▬▬▬▬▬▬
`;

       // Verificar si la URL de la imagen es válida
       isValidImageUrl(imageUrl, (isValid) => {
        if (isValid) {
         // Crear un botón para el enlace
         const button = [{ text: '⟨🗞️⟩ Leer más ⟨🗞️⟩', url: link }];
         ctx.replyWithPhoto(imageUrl, { caption: message, reply_markup: { inline_keyboard: [button] } })
          .catch(err => console.error('Error al enviar el mensaje:', err));
        } else {
         console.error('URL de imagen no válida:', imageUrl);
        }
       });
      });
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

const fetchSerie = (ctx = null) => {
 request(RSS_serie, (error, response, body) => {
  if (!error && response.statusCode === 200) {
   xml2js.parseString(body, (err, result) => {
    if (!err) {
     const items = result.rss.channel[0].item;
     const randomArticles = items.sort(() => 0.5 - Math.random()).slice(0, 3); // Artículos aleatorios

     if (ctx) {
      randomArticles.forEach(item => {
       const title = item.title[0];
       const link = item.link[0];
       const description = item.description[0];
       const content = item['content:encoded'][0];
       const imageUrl = extractImage(content); // Obtener la imagen
       const hashtags = ['#Cine', '#Noticias', '#Películas', '#Estrenos', '#Cultura', '#Entretenimiento'];

       // Obtener categorías como texto plano
       const categoriesText = item.category ? item.category : [];
       const catReplace = categoriesText.join(' ').replace(/\s/g, '_'); // Reemplaza espacios por guiones bajos
       const hashtagCat = `#` + catReplace.split('_').join(' #'); // Agrega el símbolo de hashtag

       // Crear un conjunto de hashtags únicos
       const uniqueHashtags = new Set(hashtags);

       // Comparar y eliminar los que ya están en hashtags
       hashtagCat.split(' ').forEach(cat => {
        if (cat) {
         uniqueHashtags.delete(cat); // Elimina si ya existe
        }
       });

       // Unir los hashtags únicos de nuevo en una cadena
       const finalHashtags = Array.from(uniqueHashtags).join(' ');

       const message = `
⟨📰⟩ #Noticia
▬▬▬▬▬▬▬▬▬
⟨🍿⟩ ${title}
▬▬▬▬▬▬▬▬▬
⟨💭⟩ Resumen: ${description.substring(0, 1500)}...
▬▬▬▬▬▬▬▬▬
${finalHashtags}
▬▬▬▬▬▬▬▬▬
`;

       // Verificar si la URL de la imagen es válida
       isValidImageUrl(imageUrl, (isValid) => {
        if (isValid) {
         // Crear un botón para el enlace
         const button = [{ text: '⟨🗞️⟩ Leer más ⟨🗞️⟩', url: link }];
         ctx.replyWithPhoto(imageUrl, { caption: message, reply_markup: { inline_keyboard: [button] } })
          .catch(err => console.error('Error al enviar el mensaje:', err));
        } else {
         console.error('URL de imagen no válida:', imageUrl);
        }
       });
      });
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

bot.start((ctx) => ctx.reply('¡Hola! Estoy aquí para traerte artículos de cine y series.\n\nPuedes usar el comando /cine para obtener 3 artículos de cine aleatorias.\n\nPuedes usar el comando /serie para obtener 3 artículos de series aleatorias'));

// Enviar artículos aleatorios
bot.command('cine', (ctx) => fetchCine(ctx));

// Enviar artículos aleatorios
bot.command('serie', (ctx) => fetchSerie(ctx));

// Mantiene el bot vivo y envía solo el último artículo
setInterval(() => fetchCine(), 60000);

// Mantiene el bot vivo y envía solo el último artículo
setInterval(() => fetchSerie(), 60000);

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