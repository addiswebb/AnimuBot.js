const {
  gql
} = require('graphql-request');
const {
  title
} = require('process');



class animeInfo {

  constructor(channel) {
    this.fs = require('fs');
    this.channel = channel;

    this.showInfo = this.showInfo.bind(this);
  }


  apiRequest(name) { //get graphql request from anilist api
    console.log("got request");
    const query = gql `
    query($search: String){
      Media(search: $search ,type:ANIME){
        title{
          english
        }
        description
        episodes
        meanScore
        coverImage{
          medium
        }
        nextAiringEpisode{
          timeUntilAiring
        }
      }  
    }`;

    var variables = {
      search: name
    }

    var url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

    const fetch = require('node-fetch');

    fetch(url, options)
      .then(this.handleResponse)
      .then(this.showInfo)
      .catch(this.handleError);
  }
  handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  // handleData(data) { //no longer used
  //     this.showInfo(title,description,episodes,rating,thumbnail,status,timeUntilAiring);
  // }
  handleError(error) {
    console.error(error);
  }
  showInfo(data) { //sends embeded message to a channel
    const Discord = require("discord.js");
    console.log("showing info");
    const crunchyroll = 'https://crunchyroll.com/';
    const path = data.data.Media;
    var animeName = path.title.english;
    //console.log("Title: " + animeName);

    var description = path.description;

    description = description.split(' ').slice(1, 5);

    description += "...";
    //console.log("Description: " + description);
    var episodes = "";
    try {
      if (path.episodes === null) {
        episodes = "*Episodes are still airing*";
      } else {
        episodes = path.episodes;
      }
      console.log("Episodes: " + episodes);
    } catch {
      episodes = "*Episodes are still airing*";
      console.log(episodes);
    }

    var rating = path.meanScore;
    //console.log("Rating: "+ rating);

    var thumbnail = path.coverImage.medium;
    //console.log("Thumbnail: " + thumbnail);

    var status = path.status;
    //console.log("Status: " + status);      
    var timeUntilAiring = "";
    try {

      timeUntilAiring = path.nextAiringEpisode.timeUntilAiring;
      timeUntilAiring /= 60;

      //console.log("TimeUntilAiring: " +  Math.floor(timeUntilAiring/24/60) + "d " + Math.floor(timeUntilAiring/60%24) + 'h ' + Math.floor(timeUntilAiring % 60) + 'm ');
    } catch {
      //console.log("Complete Anime");
      timeUntilAiring = "Complete Series";
    }
    //this.apiRequest(name);
    //console.log(animeName)
    var stars = Math.round(rating / 25);
    var star = '';
    for (var i = 0; i < stars; i++) {
      star += '⭐';
    }

    const eb = new Discord.MessageEmbed()
      .setColor(6617700)
      .setTitle(animeName)
      .setURL(crunchyroll + "naruto")
      .setDescription(description)
      .setThumbnail(thumbnail)
      .addField('Episodes:', episodes)
      .addField('Rating:', star);
    //⭐⭐⭐⭐⭐
    if (episodes === 'Complete Series') {
      eb.setFooter('Complete Series');
    } else {
      if (timeUntilAiring === "Complete Series") {
        eb.setFooter(timeUntilAiring);
      } else {
        eb.setFooter('Next Episode: ' + Math.round(timeUntilAiring / 24 / 60) + "d " + Math.round(timeUntilAiring / 60 % 24) + 'h ' + Math.round(timeUntilAiring % 60) + 'm ');
      }
    }
    this.channel.send(eb);
  }
}

module.exports = animeInfo;