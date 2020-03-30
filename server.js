const express = require('express');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey)

const app = express();
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/store', (req, res) => {
    fs.readFile('items.json', (err, data) => {
        if (err) {
            res.status(500).end();
        }

        res.render('store.ejs', {
            stripePublicKey: stripePublicKey,
            items: JSON.parse(data)
        })

    })
})

app.post('/purchase', (req, res) => {
    fs.readFile('items.json', (err, data) => {
        if (err) {
            res.status(500).end();
        }

        const itemsJson = JSON.parse(data)
        const itemsArray = itemsJson.music.concat(itemsJson.merch)

        let total = 0

        req.body.items.forEach((item) => {
            const itemJson = itemsArray.find( (i) => i.id == item.id)
            total = total + itemJson.price * item.quantity
        })

        stripe.charges.create({
            amount: total,
            source: req.body.stripeTokenId,
            currency: 'usd',
        }).then(function() {
                console.log('charge succesful');
                res.json({message: 'Successfully purchased items'})
            })
            .catch(function(err) {
                console.log('Charge fail')
                res.status(500).end()
            })

        res.render('store.ejs', {
            stripePublicKey: stripePublicKey,
            items: JSON.parse(data)
        })

    })
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
});
