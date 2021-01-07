const request = require('request-promise')
const cheerio = require('cheerio')
const json2csv = require('json2csv').Parser
const fs = require('fs')
const path = require('path')


const movies = ["https://www.imdb.com/title/tt6723592/?ref_=hm_fanfav_tt_2_pd_fp1",
    "https://www.imdb.com/title/tt0451279/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt2975590/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt1477834/?ref_=tt_sims_tti"
];


//Method Without name

(async() => {
    let imdbData = []

    for (movie of movies) {
        const response = await request({
            uri: movie,
            headers: {
                //?Header Information  
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en - GB,en - US;q = 0.9,en;q = 0.8 "
            },
            gzip: true
        })

        const $ = cheerio.load(response);

        let rating = $('div[class="ratingValue"] > strong > span').text();
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let summary = $('div[class="summary_text"]').text().trim();
        let releaseDate = $('a[title="See more release dates"]').text().trim();

        imdbData.push({
            title,
            rating,
            summary,
            releaseDate
        })

    }
    const csvParser = new json2csv();
    const csv = csvParser.parse(imdbData);

    fs.writeFileSync(path.join(__dirname, 'imdb.csv'), csv, 'utf-8')


})()