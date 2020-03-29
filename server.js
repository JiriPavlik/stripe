const express = require('express');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/store', (req, res) => {
    fs.readFile('items.json', (err, data) => {
        if (err) {
            res.status(500).end();
        }

        res.render('store.ejs', {
            items: JSON.parse(data)
        })

    })
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
});
