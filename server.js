const express = require('express');
const app = express();
const fetch = require('node-fetch');
const url = 'https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices';
const cors = require('cors');

app.use(cors());

app.get('/data', async (req, res) => {
    try {
        const apiResponse = await fetch(url)
        const apiResponseJson = await apiResponse.json()

        return res.send(apiResponseJson);
    } catch (err) {
        console.log(err)
        res.status(500).send('Something went wrong')
    }
})

app.listen(5555, () => console.log('Listening on 5555'));
