const { request, gql } = require('graphql-request')

class animeInfo{
  
  constructor(channel){
    
    this.fs = require('fs');
    this.channel = channel;
  }
  handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
  }
  handleData(data) {
      console.log(data);
  }
  handleError(error) {
      alert('Error, check console');
      console.error(error);
  }

  apiRequest(name){
      const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'
      const variables = {
        search: name
      }
      const query = gql`
      query ($search: String) {
        Media(search: $String ,type:ANIME){
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
      }`

  // Define the config we'll need for our Api request
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
  
    // Make the HTTP Api request
  const fetch = require('node-fetch');
  
  fetch(url, options)
    .then(this.handleResponse)
    .then(this.handleData)
    .catch(this.handleError);
  }

  

  showInfo(name){
    this.apiRequest(name);
    const Discord = require("discord.js");

    console.log("showing embeded")
    const eb = new Discord.MessageEmbed()
    .setColor(6617700)
    .setTitle('Naruto')
    .setURL('https://crunchyroll.com/naruto')
    .setDescription('Naruto is yes, noruto is no')
    .setThumbnail('https://img1.ak.crunchyroll.com/i/spire2/0145388e3ecfdb5a63ce1e9feaeef44a1279141923_full.jpg')
    .addField('Episodes:','220')
    .addField('Rating:',  '⭐⭐⭐⭐⭐');
    this.channel.send(eb);
  }
}

module.exports = animeInfo;
// animeInfo.prototype.parse = function(json){
//   const response = JSON.parse(json);

//   for(key in response){
//     console.log("Key: "+key);
//   }
// }