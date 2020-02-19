'use strict';

const morgan = require('morgan');
const express = require('express');
const {top50} = require('./data/top50');
const {books} = require('./data/books');


const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here
app.get('/top50', (req, res) => {
    res.render('pages/top50', {
        title: "Top 50 Songs Streamed on Spotify",
        top50: top50
    });
});

app.get('/top50/popular-artist', (req, res) => {
    res.render('pages/popular-artist', {
        title: "Songs by popular artist",
        top50: top50
    });
});

app.get('/song/:number', (req, res) => {
    let number = Number(req.params.number)
    if (number > 0 && number <= 50 && number % 1 === 0){
    let song = undefined;
    top50.forEach(element => {
        if (element.rank === Number(number)) {
            song = element;
        }
    });
    res.render('pages/song#', {
        title: `Song #${number}`,
        songNumber: number,
        song: song
    })
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
})


app.get('/books', (req, res) => {
    res.render('pages/books', {
        title: "these are the books",
        books: books
    });
});

app.get('/book/:id', (req, res) => {
    let id = Number(req.params.id)
    if (id > 100 && id <= 125 && id % 1 === 0){
    let book = undefined;
    books.forEach(element => {
        if (element.id === Number(id)) {
            book = element;
        }
    });
    res.render('pages/book#', {
        title: `Book #${id}`,
        bookId: id,
        book: book
    })
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
})

app.get('/books/type-:type', (req, res) => {
    let type = req.params.type;
    console.log(type);
    switch (type) {
        case "fiction":
        case "drama":
        case "graphic-novel":
        case "non-fiction":
        res.render('pages/type', {
            title: `${type}`,
            books: books,
            type: type
        });
        break;
        default:
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        }); 
    }
})

// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
