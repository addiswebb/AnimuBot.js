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
    const crunchyroll = 'https://crunchyroll.com/';
    const path = data.data.Media;
    var animeName = " ";
    animeName = path.title.english;
    var description = " ";
    description = path.description;

    description = description.substring(0, 26);
    description += "...";

    var rawName = animeName.replace(' ', '-');
    rawName = rawName.toLocaleLowerCase();
    rawName = animeName.replace(' ', '-');

    var rating = path.meanScore;
    var thumbnail = path.coverImage.medium;
    var complete = false;
    var episodes = "";

    try {
      if (path.episodes === null) {
        episodes = "*Episodes are still airing*";
      } else {
        episodes = path.episodes;
      }
    } catch {
      episodes = "*Episodes are still airing*";
    }

    var timeUntilAiring = "";
    try {
      timeUntilAiring = path.nextAiringEpisode.timeUntilAiring;
      timeUntilAiring /= 60;
      complete = true;
    } catch {
      timeUntilAiring = "Complete Series";
      complete = true;
    }

    var stars = Math.round(rating / 20);
    var star = '';
    for (var i = 0; i < stars; i++) {
      star += '⭐';
    }

    const eb = new Discord.MessageEmbed()
      .setColor(6617700)
      .setTitle(animeName)
      .setURL(crunchyroll + rawName)
      .setDescription(description)
      .setThumbnail(thumbnail)
      .addField('Episodes:', episodes)
      .addField('Rating:', star);
    //⭐⭐⭐⭐⭐
    //
    if (episodes === 'Complete Series') {
      eb.setFooter(episodes);
    } else {
      if (timeUntilAiring === "Complete Series") {
        eb.setFooter(timeUntilAiring);
        complete = true;
      } else {
        eb.setFooter('Next Episode: ' + Math.round(timeUntilAiring / 24 / 60) + "d " + Math.round(timeUntilAiring / 60 % 24) + 'h ' + Math.round(timeUntilAiring % 60) + 'm ');
        complete = false;
      }
    }
    this.channel.send(eb).then(message => {
      console.log(complete);
      if (!complete) {
        console.log("Not Complete Series");

        message.react('🔔');
        message.react('🔕');
      }else{
        console.log("Complete Series");
      }
    });
    //🔔
    //🔕

    //console.log(crunchyroll + rawName);
  }
}

module.exports = animeInfo;