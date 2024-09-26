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
                title: movie.title,
                input_message_content: {
                    message_text: `
                    ![Backdrop](${movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : ''})
                    **${movie.title} (${movie.release_date.split('-')[0]})**
                    *Título original:* ${movie.original_title}
                    *Idioma original:* ${movie.original_language}
                    *Géneros:* ${movie.genre_ids.join(', ')}
                    *Sinopsis:* ${movie.overview}
                    `,
                },
                thumb_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                description: `${movie.title} (${movie.release_date.split('-')[0]})\n${movie.original_title}`,
            }));

            ctx.answerInlineQuery(inlineResults);
        }
    });
});

bot.launch();
