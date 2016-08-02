var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    valid = require('url-valid'),
    Url = require('./url.model');
    
var app = express();

//connect to mongodb or mLab
var dbUrl = process.env.DB_URI || 'Your_DB_URI'
var dbOption = {
    db: { safe: true }
}
mongoose.connect(dbUrl, dbOption);

var port = process.env.PORT || 8080;

//server listener
app.listen(port, function(){
    console.log('App listening on port: ' + port)
});

//rendering instructions

app.get('/', function(req, res){
    var file = path.join(__dirname, 'index.html');
    fs.createReadStream(file, 'utf8', function(err){
        if(err){
            console.log('err rendering html');
            res.sendStatus(404)
        } 
    }).pipe(res);
})

//get route for url validation and new url creation
app.get('/new/*', function(req, res){
    return new Promise(function(resolve, reject){
        var original = req.url.replace('/new/', '');
        valid(original, function(err, valid){
            if(err){
                reject(res.json({ error: 'URL invalid'}))
            } else {

//create new url in mongodb using pre-defined model schema
                
                console.log('the url input valid: ' + valid)
                Url.create({ originalUrl: original}, function(err, created){
                    if(err){
                        res.send('schema was not created')
                    } else {
                        resolve(
                            res.json({
                                    originalUrl: created.originalUrl,
                                    shortUrl:  created.shortUrl
                            })
                            )
                    }
                })
            }
        })
    })
})

//retrieve original link from db using shortid redirect using 302 if required

app.get('/search/*', function(req,res){
    return new Promise(function(resolve, reject){
        var final = req.url.replace('/search/','');
        Url.findOne({ shortUrl: final})
            .exec(function(err, docs){
            if(err){
                reject(res.json({error: "No short url found for given input"}))
            } else {
                resolve(res.redirect(docs.originalUrl))
            }
        })
    })
})


