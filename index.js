// index.js
const { Telegraf } = require('telegraf')
import fetch from 'node-fetch';

// rest of the code


const API_KEY = '74dc824830c7f93dc61b03e324070886'

const BOT_TOKEN = '8180114783:AAFrGu06UhD3DH0wM6VYDupf177JBKz9uHI'

// Bot initialization
const bot = new Telegraf(BOT_TOKEN)

bot.command('pelicula', async ctx => {
 const query = ctx.message.text.split('/pelicula ')[1]

 // Search movie
 const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
 const data = await response.json()

 // Send list of results
 const movies = data.results
 ctx.replyWithHTML(`Lista de películas encontradas para "${query}":`,
  movies.map(movie => {
   return `
<b>${movie.title} (${movie.release_date})</b>
`
  }).join('\n')
 )

 // Handle click on result
 bot.action('movie', async ctx => {
  const id = ctx.match[1]

  // Get movie details
  const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es`)
  const details = await detailsResponse.json()

  ctx.replyWithHTML(`
<b>${details.title} (${details.release_date})</b>
Título original: ${details.original_title}
Idioma original: ${details.original_language}
Géneros: ${details.genres.map(genre => genre.name).join(', ')}
Sinopsis: ${details.overview}
`)
 })
})

bot.launch()