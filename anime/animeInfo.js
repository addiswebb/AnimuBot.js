const {
  gql
} = require('graphql-request');
const {
  title
} = require('process');
const Discord = require("discord.js");

var msgToDelete = "";
const CRSimulcast =['ABCiee Working Diary',
'AzurLane: Slow Ahead!',
'Anime KAPIBARASAN',
'Armor Shop for Ladies & Gentlemen II',
'Attack on Titan Final Season',
'Black Clover',
'Boruto: Naruto Next Generations',
'Bungo Stray Dogs WAN!',
'Case Closed',
'Digimon Adventure:',
'Dr. Ramune -Mysterious Disease Specialist-',
'Dr. STONE: STONE WARS',
'Dragon Quest: The Adventure of Dai',
'EX-ARM',
'Heaven’s Design Team',
"I'm Standing on a Million Lives",
'Idolls!',
'I★CHU',
'JUJUTSU KAISEN',
'Katana Maidens ~ Tomoshibi',
'LAID-BACK CAMP SEASON2',
'Mr. Osomatsu 3rd season',
'Noblesse',
'Non Non Biyori Nonstop',
'One Piece',
'Re:ZERO -Starting Life in Another World- Season 2 Part 2',
'Shadowverse',
"So I'm a Spider, So What?",
'That Time I Got Reincarnated as a Slime Season 2',
'The Hidden Dungeon Only I Can Enter',
'The Quintessential Quintuplets',
'With a Dog AND a Cat, Every Day is Fun',
'WIXOSS DIVA(A)LIVE',
'World Trigger 2nd Season',
'Yashahime: Princess Half-Demon',
'Yatogame-chan Kansatsu Nikki 3']

const err = '[Animu]<Error> ';
const log = '[Animu]<Log> ';
const msg = '[Animu]<Message> ';

class animeInfo {

  constructor(channel) {
    this.fs = require('fs');
    this.channel = channel;
    this.showInfo = this.showInfo.bind(this);
  }
  
  getSubbedTime(){
    const puppeteer = require('puppeteer-extra');
  
    (async () => {
      let browser = await puppeteer.launch();
      let page = await browser.newPage();
  
      await page.goto('https://animeschedule.net/',{waitUntil: 'networkidle2'});
  
      let data = await page.evaluate(() =>{
        let activeDay = document.querySelector('div[id="active-day"]').innerText;
        return activeDay;
      })
      
      var schedule = data.split('\n');
      schedule.shift();
      schedule.shift();
  
      for( var i = 0; i < schedule.length; i++){ 
        if ( schedule[i] === "JPN") { 
          schedule.splice(i,1);
        }else if(schedule[i].includes('Ep')){
          schedule.splice(i,1);
        }
      }
      //for(var j = 1; j < CRSimulcast.length;j++){
        for(var i = 0;i < schedule.length;i+=2){
          if(schedule[i+1].toLowerCase() === "dragon quest: dai no daibouken"){
            console.log("Title: "+ schedule[i+1])
            console.log("   Time of: "+ schedule[i] + "\n");
          }
        }
      //}
      //console.log(schedule);
      await browser.close();
    })();
  }
  apiRequest(name, toDelete) { //get graphql request from anilist api
    msgToDelete = toDelete;
    console.log(" Making Request:")
    console.log("   Name:" +name)
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

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log(" Making Request: "+time);
    console.log("   Title: " + name);
    console.log("   Type: " + type);
    console.log("   ");
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
    console.error(err +error);

    const channel = msgToDelete.channel;
    
    msgToDelete.delete()

    const msg = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setTitle("Couldnt Find What You Were Looking For")
      .setFooter("Make sure that all words are spelled correctly");
    channel.send(msg).
    then(e => setTimeout(() => e.delete(), 8*1000)); //its in milis but first number is in seconds cause mafs
  }
  timeToCountdown(endTime){
    const total = Date.parse(endTime) - Date.parse(new Date())

    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }
  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
   
     if (time.length > 1) { // If time format correct
       time = time.slice (1);  // Remove full string match value
       time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
       time[0] = +time[0] % 12 || 12; // Adjust hours
     }
     return time.join (''); // return adjusted time or original string
   }
  showInfo(data) { //sends embeded message to a channel
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
        description = description.substring(0, 26)+"\n"+description.substring(26,47);
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

      for(i in CRSimulcast ){
        if(CRSimulcast[i] == animeName){
          eb.setColor("fc9803")
          //eb.setFooter(this.getSubbedTime(animeName));
          break;
        }else{
          eb.setColor(6617700)
        }
      }
      eb.setTitle(animeName)
      eb.setURL(crunchyroll)
      eb.setDescription(description)
      eb.setThumbnail(thumbnail)
      eb.addField('Rating:', star);

      if(complete){
        eb.setFooter('Complete Anime Series')
      }else{
        //+Math.floor(timeUntilAiring/24/60) + "d " + Math.floor(timeUntilAiring/60%24) + "h " + Math.floor(timeUntilAiring%60) + "m "
        //const timeUntilAir = this.timeToCountdown('6:00');

        console.log(log + this.tConvert("3:30 AM"))
        eb.setFooter("Next Episode: " +Math.floor(timeUntilAiring/24/60) + "d " + Math.floor(timeUntilAiring/60%24) + "h " + Math.floor(timeUntilAiring%60) + "m ")
      }
      //⭐⭐⭐⭐⭐
      console.log("   Showing Data: " + animeName)
      
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