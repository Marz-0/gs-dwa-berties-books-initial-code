const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/", function (req, res, next) {
    res.render("weather.ejs");
});

router.post('/', function (req, res, next) {
    try {
        let city = req.sanitize(req.body.city || '');
        return res.redirect(`/weather/result?city=${encodeURIComponent(city)}`);
    } catch (err) {
        return next(err);
    }
});

router.get("/result", function (req, res, next) {
    let apiKey = "fda7b7c7fbf03549ceae9e08eccf7c8e";
    let city = req.sanitize(req.query.city);
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            var weather = JSON.parse(body);
            if (weather !== undefined && weather.main !== undefined) {
                res.render("./weather-result.ejs", { weather: weather });
            } else {
                res.send("No data found");
            }
        }
    });
});

module.exports = router;