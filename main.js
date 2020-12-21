const Discord = require('discord.js');
const client = new Discord.Client;

const prefix = '!';

// command manager
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Crunchy is online')
});

client.on('message', message => { // command manager
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(' ');
  var command = args.shift().toLowerCase();
  

  if (command === 'anime' || command === 'a') {
    const arg = message.content.replace(prefix+'a ','');
    console.log("arg: "+arg);
    //client.commands.get('a').execute(message, arg);    
    const anime = require('E:/GithubRepos/CrunchyBot.js/anime/animeInfo.js');
    let animeInfo = new anime(message.channel);
    console.log("send request");
    animeInfo.apiRequest(arg);
  }else if(command === 'test'){
    const arg = message.content.replace(prefix+'a ','');
    const query = gql`
      {
        Media(search: `+arg+` ,type:ANIME){
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
      console.log("query"+query.toString());
  }
}); // command manager


client.login('Nzg4NTEyMjcxOTA2NTA0Nzc1.X9klRw.W1XH4Q2ZZ1ElInorZORLp4rH_5A');