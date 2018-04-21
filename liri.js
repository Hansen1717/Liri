require('dotenv').config();
var sys = require('util');
var exec = require('child_process').exec;
var child;
var keys = require('./keys.js');
var apiToUse = process.argv[2];
var userSearch;
if (apiToUse === 'spotify' && process.argv[3] === undefined) {
  userSearch = 'gold on the ceiling'
}
else if (apiToUse === 'movies' && process.argv[3] === undefined) {
  userSearch = 'Mr.+Nobody'
}
else {
  for (var i = 3; i < process.argv.length; i++) {
    if (i === 3) {
      userSearch = process.argv[3];
    }
    else {
      userSearch = userSearch + '+' + process.argv[i];
    }
  };
};

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
})

var request = require('request');

if (apiToUse === 'twitter') {
  client.get('statuses/user_timeline', { count: '5' }, function (err, tweets, response) {
    for (var x = 0; x < 5; x++) {
      if (x === 0) { console.log('+++++++++++++++++++++++++++++++++++++') };
      console.log(tweets[x].created_at);
      console.log(tweets[x].text);
      console.log('+++++++++++++++++++++++++++++++++++++');

    }
  })
}

if (apiToUse === 'spotify') {
  spotify
    .search({ type: 'track', query: userSearch })
    .then(function (response) {
      console.log('Title: ' + response.tracks.items[0].name);
      console.log('Artist: ' + response.tracks.items[0].album.artists[0].name);
      console.log('Album: ' + response.tracks.items[0].album.name);
      child = exec("start chrome " + response.tracks.items[0].album.external_urls.spotify), function (err, stdout, stderr) {
        util.print('stdout: ' + stdout);
        util.print('stderr: ' + stderr);
        if (error !== null) {
          console.log(err);
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
};

if (apiToUse === 'movies') {
  request("http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy", function (error, response, data) {
    if (!error && response.statusCode === 200) {
      console.log(JSON.parse(data).Title);
      console.log(JSON.parse(data).Year);
      console.log("Ratings:")
      for (var y = 0; y < JSON.parse(data).Ratings.length; y++) {
        console.log('  Source: ' + JSON.parse(data).Ratings[y].Source)
        console.log('  Value: ' + JSON.parse(data).Ratings[y].Value + '\n')
      };
      console.log('Produced By: ' + JSON.parse(data).Production);
      console.log('Language: ' + JSON.parse(data).Language);
      console.log('Plot: ' + JSON.parse(data).Plot);
      console.log('Actors: ' + JSON.parse(data).Actors);
    }
  });
}