const Discord = require('discord.js');
const client = new Discord.Client;

const prefix = '!';

// command manager
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));


for(const file of commandFiles){
  const command = require(`./commands/${file}`)
  client.commands.set(command.name,command);
}


// command manager

client.once('ready', ()=>{
  console.log('Crunchy is online')
});

client.on('message',message =>{ // command manager
    if(!message.content.startsWith(prefix)|| message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ + /);
    const command = args.shift().toLowerCase();

    if(command === 'anime'||command === 'a'){
      client.commands.get('a').execute(message,args);
    }
}); // command manager


client.login('Nzg4NTEyMjcxOTA2NTA0Nzc1.X9klRw.W1XH4Q2ZZ1ElInorZORLp4rH_5A');
