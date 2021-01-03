const {
  gql
} = require('graphql-request');
const {
  title
} = require('process');

var msgToDelete = "";
var type = "";
class animeInfo {

  constructor(channel) {
    this.fs = require('fs');
    this.channel = channel;
    this.showInfo = this.showInfo.bind(this);
  }


  apiRequest(name, toDelete) { //get graphql request from anilist api
    msgToDelete = toDelete;
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
  apiRequest(name, toDelete, type) { //get graphql request from anilist api
    this.type = type;
    msgToDelete = toDelete;
    var query = "";
    if (type === "ANIME") {
      query = gql `
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
    } else if (type === "MANGA") {
      query = gql `
    query($search: String){
      Media(search: $search ,type:MANGA){
        title{
          english
          native
        }
        description
        chapters
        meanScore
        coverImage{
          medium
        }
        
      }  
    }`;
    } else if (type === "ANIME_LIST") {
      query = gql `
    query ($search: String) {
      Page (page:1, perPage: 5) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description
          episodes
        }
      }
    }
    `;
    } else if (type === "MANGA_LIST") {
      query = gql `
      query ($search: String) {
        Page (page:1, perPage: 5) {
          media(search: $search, type: MANGA) {
            title {
              romaji
              english
            }
            description
          }
        }
      }`;
    }
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

  handleError(error) {
    console.error(error);
  }
  showInfo(data) { //sends embeded message to a channel
    const Discord = require("discord.js");
    const crunchyroll = 'https://crunchyroll.com/';
    if (this.type === "ANIME" || this.type === "MANGA") {
      var animeName = " ";
      var timeUntilAiring = "";
      var episodes = "";
      const path = data.data.Media;

      var complete = false;

      if (this.type === "ANIME") {
        animeName = path.title.english;
        try {
          if (path.episodes === null) {
            episodes = "*Episodes are still airing*";
          } else {
            episodes = path.episodes;
          }
        } catch {
          episodes = "*Episodes are still airing*";
        }
        try {
          timeUntilAiring = path.nextAiringEpisode.timeUntilAiring;
          timeUntilAiring /= 60;
          complete = false;
        } catch {
          timeUntilAiring = "Complete Anime Series";
          complete = true;
        }
      } else if (this.type === "MANGA") {
        animeName = path.title.native;
        try {
          if (path.chapters === null) {
            episodes = "*Chapters are still getting released*";
          } else {
            episodes = path.chapters;
          }
        } catch {
          episodes = "*Chapters are still getting released*";
        }
        complete = true;
      }
      var description = " ";
      description = path.description;
      try {
        description = description.substring(0, 26);
        description += "...";
      } catch {
        description = "No Description";
      }
      var rating = path.meanScore;
      var thumbnail = path.coverImage.medium;

      var stars = Math.round(rating / 20);
      var star = '';
      for (var i = 0; i < stars; i++) {
        star += '⭐';
      }
      const eb = new Discord.MessageEmbed()
      if (this.type === "ANIME") {
        eb.addField('Episodes:', episodes)
      } else if (this.type === "MANGA") {
        eb.addField('Chapters:', episodes)
      }
      eb.setColor(6617700)
      eb.setTitle(animeName)
      eb.setURL(crunchyroll)
      eb.setDescription(description)
      eb.setThumbnail(thumbnail)
      eb.addField('Rating:', star);
      if(complete){
        eb.setFooter('Complete Anime Series')
      }else{
        eb.setFooter("Next Episode: "+Math.floor(timeUntilAiring/24/60) + "d " + Math.floor(timeUntilAiring/60%24) + "h " + Math.floor(timeUntilAiring%60) + "m ")
      }
      //⭐⭐⭐⭐⭐
      this.channel.send(eb).then(e =>{
        if(!complete){
          e.react("🔔");
          e.react("🔕");
        }
      });
    } else if (this.type === "ANIME_LIST" || this.type === "MANGA_LIST") {
      const path = data.data.Page.media;
      const eb = new Discord.MessageEmbed()
      var searchingFor = msgToDelete.embeds[0].title;
      searchingFor = searchingFor.replace("Searching For: ", "");
      eb.setTitle("Showing Results For: " + searchingFor);
      eb.setColor('#00FFFF');
      if (this.type === "ANIME_LIST") {
        for (var i = 0; i < path.length; i++) {
          var description = " ";
          description = path[i].description;
          try {
            description = description.substring(0, 26);
            description += "...";
          } catch {
            description = "No Description";
          }
          var iPlus = i;
          iPlus++;
          eb.addField(iPlus + ": " + path[i].title.romaji, description);
        }
      } else if (this.type === "MANGA_LIST") {
        for (var i = 0; i < path.length; i++) {
          var description = " ";
          description = path[i].description;
          try {
            description = description.substring(0, 26);
            description += "...";
          } catch {
            description = "No Description";
          }
          var iPlus = i;
          iPlus++;
          eb.addField(iPlus + ": " + path[i].title.romaji, description);
        }
      }
      this.channel.send(eb);
    }
    msgToDelete.delete();

    //🔔
    //🔕    
  }
}

module.exports = animeInfo;