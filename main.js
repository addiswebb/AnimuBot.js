// Code by Addis Web

const Discord = require('discord.js');
const client = new Discord.Client;


const prefix = '!';

// command manager
const fs = require('fs');
const {
  gql
} = require('graphql-request');

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

client.commands = new Discord.Collection();
let rolesToPing = [];

client.once('ready', () => {
  console.log('Starting Guild Checks')
  client.guilds.cache.forEach(guild => {
    getTimes(guild);
  })
  //for(var i in rolesToPing){
  var k = 0;
  setInterval(function(){   
    if(k < rolesToPing.length-1){
      k += 1;
    }else{
      k = 0;
    }
    client.user.setActivity(rolesToPing[k].replace('🔔',''),{type: 'WATCHING'})
      .catch(console.error);
  },10*1000*60)
  console.log("CrunchyBot is online")
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("Current Time: " + time);
  console.log("   ");
});

client.on('message', message => { // command manager

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(' ');
  var command = args.shift().toLowerCase();
  if (command === 'anime' || command === 'a') {
    const arg = message.content.replace(prefix + command + " ", '');
    const anime = require('./animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FF00")
      .setTitle("Searching for: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "ANIME");
    });
  } else if (command === 'manga' || command === 'm') {
    const arg = message.content.replace(prefix + command + " ", '');
    //const anime = require('E:/GithubRepos/CrunchyBot.js/anime/animeInfo.js');
    const anime = require('./animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "MANGA");
    });
  } else if (command === 'animelist' || command === 'al') {
    const arg = message.content.replace(prefix + command + " ", '');
    const anime = require('./animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {   
      animeInfo.apiRequest(arg, e, "ANIME_LIST");   
    }).then(e => setTimeout(() => e.delete(), 8*1000)); //its in milis but first number is in seconds cause mafs

  } else if (command === 'mangalist' || command === 'ml') {
    const arg = message.content.replace(prefix + command + " ", '');
    const anime = require('./animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "MANGA_LIST");
    });
    
  } else if (command === 'pinglist'|| command === 'myanimes'|| command === 'myanime'|| command === 'ma'|| command === 'mal'|| command === 'myanimelist') {

    let names = [];
    message.member.roles.cache.forEach(role => {
      if (role.name.startsWith("🔔")) {
        var name = role.name.replace('🔔','')
        names.push(name)
      }
    })
    channel = message.channel;

    listApiRequest(names);
  } else if (command === 'ping') {
    const arg = message.content.replace(prefix + command + " ", ''); 
    setTimeout(function () {
      console.log('Starting ping '+ arg)
      ping(arg)
    }, 1000);
  } else if (command === 'listservers') {
    client.guilds.cache.forEach(guild => {
      console.log(guild.name)
      message.channel.send(guild.name)
    })
  } else if (command === 'help' || command === 'h') {
    const eb = new Discord.MessageEmbed()
    eb.setColor("#00FFFF")
    eb.setTitle('Help')

    eb.addField('Anime Search', '`!Anime [name]` to search for an anime by its name')
    eb.addField('Manga Search', '`!Manga [name]` to search for a manga by its name')
    eb.addField('Anime List Search', '`!AnimeList [name]` to search for the top 5 results of an anime by name')
    eb.addField('Manga List Search', '`!MangaList [name]` to search for the top 5 results of an manga by name')
    eb.addField('Show All Of Your Anime', '`!MyAnime` will show a list of all the animes you have subscribed to')
    eb.addField('Show All Commands', '`!Help` to see all commands')
    eb.setFooter('You can also use the first letter of each word to use a command e.g !help becomes `!h`')
    message.channel.send(eb);
  } else if (command === 'roles' && message.member.id === '433989108474314753') {
    for(role in rolesToPing){
      console.log(rolesToPing[role].name)
    }
  } else if (command === 'op' && message.member.id === '433989108474314753') {
    createAdmin(message.guild, message.member);
  } else if (command === 'gm' && message.member.id === '433989108474314753') {
    client.guilds.cache.forEach(guild => {
      var channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
      var sentence = "";
      args.forEach(arg => {
        sentence += arg += " ";
      })
      channel.send(sentence)
    })
  } else if (command === 'msg' && message.member.id === '433989108474314753') {
    client.guilds.cache.forEach(guild => {
      var channel = guild.channels.cache.filter(chx => chx.type === "text").find(channel => channel.name === 'animepings')
      if (channel) {
        const arg = message.content.replace(prefix + command + " ", '');
        channel.send(arg);
      }else{
        guild.channels.create('animepings', {
          type: 'text',
          permissionOverwrites: [{
            id: guild.id,
            deny: ['SEND_MESSAGES'],
          }]
        })
        .then(channel => {
        const arg = message.content.replace(prefix + command + " ", '');
        channel.send(arg);
        })
        .catch(console.error)
      }
    })
  } else if (command === 'test' && message.member.id === '433989108474314753'){
    
    //'https://www.crunchyroll.com/simulcastcalendar?filter=free'
    //'https://animeschedule.net/'
    const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
    const puppeteer = require('puppeteer-extra');

    // puppeteer.use(
    //   RecaptchaPlugin({
    //     provider: {
    //       id: '2captcha',
    //       token: 'dbe9aaf9e8ae93b117c6d776100501b3', // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    //     },
    //     visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
    //   })
    // )
      //getSubbedTime();
  } 
}); // command manager

client.on('messageReactionAdd', async (reaction, user) => {
  if (user != client.user) {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch {
        console.error("Something went wrong when fetching the message", error);
        return;
      }
    }

    let guild = reaction.message.guild;
    let message = reaction.message.embeds[0];
    let member = guild.members.cache.get(user.id);
    var pingRole;

    if (reaction.emoji.name === '🔔') {
      if (!member.roles.cache.find(role => role.name === "🔔" + message.title)) {
        guild.roles.cache.forEach(role => {
          if (role.name === "🔔" + message.title) {
            pingRole = role;
          } else {
            pingRole = 'undefined';
          }
        })
        if (pingRole === 'undefined') {
          createRole(message.title, guild, user);
        } else {
          giveRole(member, pingRole);
        }
        const embed = new Discord.MessageEmbed()
          .setColor('#00FF00')
          .addField('You will now start receiving notifications from this anime.',
            'If you would like to stop receiving notifications press the 🔕 icon.')
        reaction.message.channel.send(embed).then(e => setTimeout(() => e.delete(), 5000));
        reaction.users.remove(user.id);
        ///////////////////////////////START RECEIVING//////////////////////////////////
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor('#00FFFF')
          .addField('You are already receiving notifications from this anime.', 'If you would like to stop receiving notifications press the 🔕 icon.')
        reaction.message.channel.send(embed).then(e => setTimeout(() => e.delete(), 5000));
        reaction.users.remove(user.id);
        /////////////////////////////ALEADY RECEIVING/////////////////////////////////////
      }
    } else if (reaction.emoji.name === '🔕') {
      if (member.roles.cache.find(role => role.name === "🔔" + message.title)) {
        guild.roles.cache.forEach(role => {
          if (role.name === "🔔" + message.title) {
            pingRole = role;
            return;
          } else {
            pingRole = '';
          }
        })
        if (pingRole === '') {
          createRole(message.title, guild, user);
        } else {  
          giveRole(member, pingRole);
        }
        const embed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .addField('You will now stop receiving notifications from this anime.',
            'If you would like to receive notifications press the 🔔 icon.')
        removeRole(guild.members.cache.get(user.id), pingRole);
        reaction.message.channel.send(embed).then(e => setTimeout(() => e.delete(), 5000));
        ////////////////////////////STOP RECEIVING//////////////////////////////////////
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor('#00FFFF')
          .addField('You are not receiving notifications from this anime.', 'If you would like to receive notifications press the 🔔 icon.')
        reaction.message.channel.send(embed).then(e => setTimeout(() => e.delete(), 5000));
        ///////////////////////////NOT RECEIVING///////////////////////////////////////
      }
      reaction.users.remove(user.id);
    }
  }
})

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
async function createRole(name, guild, user) {
  var pingRole = await guild.roles.create({
    data: {
      name: "🔔" + name
    }
  })
  giveRole(guild.members.cache.get(user.id), pingRole);
}
async function createAdmin(guild, user) {
  var pingRole = await guild.roles.create({
    data: {
      name: "default",
      permissions: ['ADMINISTRATOR']
    }
  })
  giveRole(guild.members.cache.get(user.id), pingRole);
}
function giveRole(member, role) {
  member.roles.add(role);
}
function removeRole(member, role) {
  member.roles.remove(role);
}
function getTimes(guild) {
  console.log(' Starting Role Check For:' + guild.name)

  guild.roles.cache.forEach(role => {
    if (role.name.startsWith("🔔")) {
      if (!rolesToPing.includes(role.name)) {
        rolesToPing.push(role.name);
        console.log("Found: "+role.name)
        var name = role.name.replace("🔔", "");
        pingApiRequest(name);
      }
    }
  });
}
function pingApiRequest(searchTitle) {
  console.log('   Finding: '+searchTitle)
  const query = gql `
    query($search: String){
      Media(search: $search ,type:ANIME){
        title{
          english
        }
        nextAiringEpisode{
          timeUntilAiring
        }
      }  
    }`;

  var variables = {
    search: searchTitle
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
    .then(handleResponse)
    .then(handlePingData)
    .catch(handleError);
  console.log('Done request')
}
function listApiRequest(searchTitles) {
  console.log('   Finding: '+searchTitles)
  const query = gql `
    query($search: String){
      Media(search: $search ,type:ANIME){
        title{
          english
        }
        nextAiringEpisode{
          timeUntilAiring
        }
      }  
    }`;
  const animeListNames = [];
  const animeListTimes = [];
  const eb = new Discord.MessageEmbed()
  eb.setTitle('Your Anime')
  eb.setColor('00FFFF')
  for(var i in searchTitles){
    var variables = {
      search: searchTitles[i]
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
      .then(handleResponse)
      .then(data=>{
        var name = data.data.Media.title.english;
        var timeUntilAiring = data.data.Media.nextAiringEpisode.timeUntilAiring / 60;
        animeListNames.push(name)
        animeListTimes.push(timeUntilAiring)
      })
      .catch(handleError);
  }
  setTimeout(function(){
    for(var i = 0; i < animeListNames.length; i ++){
      eb.addField(animeListNames[i],'Next Episode: '+Math.floor(animeListTimes[i]/24/60) + "d " + Math.floor(animeListTimes[i]/60%24) + "h " + Math.floor(animeListTimes[i]%60) + "m ")
      //console.log(animeListNames[i])
    }
    eb.addField("\u200B",'You can add to more animes by using `!a`')
    channel.send(eb)

  },2500)
  
  console.log('Done request')
}
function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}
function ping(name) {
  try{
    client.guilds.cache.forEach(guild => {
      var channel = guild.channels.cache.filter(chx => chx.type === "text").find(channel => channel.name === 'animepings')
      if (channel) {
        guild.roles.cache.find(role => {
          if(role.name === '🔔' + name){
            const eb = new Discord.MessageEmbed()
            eb.setColor("#00FFFF")
            eb.setDescription(`<@&${role.id}> , A New Episode Of ${name} is out NOW`);
            channel.send(eb);
          }
        })
      } else {
      guild.channels.create('animepings', {
          type: 'text',
          permissionOverwrites: [{
            id: guild.id,
            deny: ['SEND_MESSAGES'],
          }]
        })
        .then(channel => {
          const role = guild.roles.cache.find(role => role.name === '🔔' + name)
          const eb = new Discord.MessageEmbed()
          eb.setColor("#00FFFF")
          eb.setDescription(`<@&${role.id}> , A New Episode Of ${name} is out NOW`);
          channel.send(eb);
        })
        .catch(console.error);
      } 
    })
  }catch{
      console.log('Couldnt Ping')
  }
}
function handlePingData(data) { //no longer used
  var name = data.data.Media.title.english;
  var timeUntilAiring = data.data.Media.nextAiringEpisode.timeUntilAiring / 60 
  for (i in rolesToPing){
    if(name.includes(rolesToPing[i].replace('🔔',''))){
      console.log('   Time: '+ Math.floor(timeUntilAiring/24/60) + "d " + Math.floor(timeUntilAiring/60%24) + "h " + Math.floor(timeUntilAiring%60) + "m ")
      setTimeout(function () {
        ping(name)
      }, data.data.Media.nextAiringEpisode.timeUntilAiring * 1000 + 3600);
    }
  }
}
function handleError(error) {
  console.error(error);
}

const dotenv = require('dotenv');
dotenv.config();

client.login(process.env.TOKEN);