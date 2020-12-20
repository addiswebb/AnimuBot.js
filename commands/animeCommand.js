const Discord = require('discord.js');

module.exports = {
  name: 'a',
  description: '',

  execute(message,args){

    const fs = require('fs');
    const anime = require('E:/GithubRepos/CrunchyBot.js/anime/animeInfo.js');

    let animeInfo = new anime(message.channel);

    animeInfo.showInfo(args);

   //.then(msg => {
   //   msg.delete({timeout:5000})
   // })
   // .catch('no message returned?');

  }
}