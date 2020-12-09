const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require("path");
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
let request = require(`request`);
const sts = require('strict-transport-security');

var generator = require('generate-password');

const Discord = require('discord.js');
const client = new Discord.Client();
const app = express();
const PORT = 4000;
const globalSTS = sts.getSTS({'max-age':{'days': 3}});

app.use(globalSTS);


client.on('ready', async () => {
  console.log(chalk.yellow(figlet.textSync('DevsHub', { horizontalLayout: 'full' })));
  console.log(chalk.red(`Bot started!\n---\n`
  + `> Users: ${client.users.cache.size}\n`
  + `> Channels: ${client.channels.cache.size}\n`
  + `> Servers: ${client.guilds.cache.size}`));
});


app.use(cors());


app.listen(PORT, () => {
	console.log(`Server Works !!! At port ${PORT}`);
});



app.use('/', express.static(__dirname + '/public/'));


var errorPg = path.join(__dirname, "/public/404.html"); //this is 

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.sendFile(errorPg);
});

const r = "RANDOM";
const prefix = ".";

client.on("ready", () => {
  console.log(`${client.user.tag} successfully logged in!`);
  client.user.setActivity("s:help", { type: "LISTENING" });
  client.user.setStatus('dnd');
});

client.on('message', async (message) => {

  if(message.author.bot) return;
  
  let msg = message;


  if (message.content.includes("s:file")) {
    if(!message. attachments. size > 0) {
      return msg.channel.send("Please send your attachments together next time.\nJust send a attachment with the text \`file\` inside.").then(i => i.delete({timeout: 15000}));
    }

    var password = generator.generate({
      length: 4,
      numbers: true
    });

    let jimage = message.attachments.first()

    
    download(msg.attachments.first().url)    

    function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(`public/attachments/${password}${jimage.name}`));
    }

    var k = msg.attachments.first().url
	  var j = msg.attachments.first().name


    const embed = new Discord.MessageEmbed()
      .setTitle("__**File Upload**__")
      .setColor(0xff0000)
      .setDescription(`**Your file link is**\nhttps://s.devs-hub.xyz/attachments/${password}${j}\nFile Name : ${j}\nUnique ID : ${password}\n[Original Link](${k})`)
      .setFooter('Made by Cloudflare#0001', 'https://cdn.discordapp.com/avatars/428437981238657025/a_ff463b622c49b204630db8fb5630a00f.png')
      .setTimestamp();

    msg.channel.send(embed)

    if(message.channel.type === "dm") return;

    await message.delete({ timeout: 5000 });

    msg.author.send(embed);
  }
});



client.on('message', async (message) => {

  if(message.author.bot) return;
  
  let msg = message;

  if (message.content.startsWith("s:help")) {
    const helpe = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setTitle('DevsHub Storage Bot')
    .setThumbnail('https://s.devs-hub.xyz/icon.png')
    .setDescription(`**You can use me to upload you images, videos and whatever attachments on s.devs-hub.xyz!**\n__Commands:__\n> \`s:file\` \n> \`s:embed\` \n> \`s:videoembed\``)
    .setFooter('Created by Cloudflare#0001');
    msg.channel.send(helpe);
  };

  if (message.content.startsWith("s:embed")) {
    if(!message. attachments. size > 0) {
      return msg.channel.send("Please send your attachments together next time.\nJust send a attachment with the text \`embed\` inside.").then(i => i.delete({timeout: 5000}));
    }

    let args = msg.content.slice(prefix.length).split(/ +/);

    let descriptionembed = args.slice(1).join(" ");
    if (!descriptionembed) descriptionembed = "Powered by Developers Hub"


    var password = generator.generate({
      length: 4,
      numbers: true
    });

    let jimage = message.attachments.first()
    
    var k = msg.attachments.first().url
	  var j = msg.attachments.first().name

    var data = `<!DOCTYPE html><html><head><!-- Primary Meta Tags --><title></title><meta name="title" content="${jimage.name}"><meta property="og:site_name" content="${message.author.username}"><meta name="description" content="${descriptionembed}"><meta property="image" content="${k}"><meta http-equiv="refresh" content="30; url=https://s.devs-hub.xyz/invite.html"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://s.devs-hub.xyz/"><meta property="og:title" content="${jimage.name}"><meta property="og:description" content="${descriptionembed}"><meta property="og:image" content="${k}"><meta name="theme-color" content="#b1b3f7"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://s.devs-hub.xyz"><meta property="twitter:title" content="${jimage.name}"><meta property="twitter:description" content="${descriptionembed}"><meta property="twitter:image" content="${k}"><link href="https://s.devs-hub.xyz/dev.css" rel="stylesheet" type="text/css" /></head><body><p><img src="${k}" alt="${jimage.name}"/></p><h2>Click <a title="Here to join Developers Hub!!" href="https://s.devs-hub.xyz/invite.html" id="white">Here Now!</a></h2></body></html>`;

    if (!fs.existsSync(`public/embed/${password}`)){
        fs.mkdirSync(`public/embed/${password}`);
    }


    fs.writeFile(`public/embed/${password}/index.html`, data, err => {
				if (err) {
					return console.log(err);
				}
	  });
	

    const embed = new Discord.MessageEmbed()
      .setTitle("__**Embed Upload**__")
      .setColor(0xff0000)
      .setDescription(`**Your Embed link is**\nhttps://s.devs-hub.xyz/embed/${password}\nFile Name : ${j}\nUnique ID : ${password}`)
      .setFooter('Made by Cloudflare#0001', 'https://cdn.discordapp.com/avatars/428437981238657025/a_ff463b622c49b204630db8fb5630a00f.png')
      .setTimestamp();

    msg.channel.send(embed)

    if(message.channel.type === "dm") return;

    msg.author.send(embed);
  }

  if (message.content.includes("s:videoembed")) {
    if(!message. attachments. size > 0) {
      return msg.channel.send("Please send your attachments together next time.\nJust send a attachment with the text \`videoembed\` inside.").then(i => i.delete({timeout: 5000}));
    }

    var password = generator.generate({
      length: 4,
      numbers: true
    });

    let args = msg.content.slice(prefix.length).split(/ +/);

    let descriptionembed = args.slice(1).join(" ");
    if (!descriptionembed) descriptionembed = "Powered by Developers Hub"

    let jimage = message.attachments.first()
    
    var k = msg.attachments.first().url
	  var j = msg.attachments.first().name

    var data = `<!DOCTYPE html><html><head><!-- Primary Meta Tags --><title></title><meta name="title" content="${jimage.name}"><meta property="og:site_name" content="${message.author.username}"><meta name="description" content="${descriptionembed}"><meta property="og:title" content="${j}"><meta property="og:image" content="http://s.devs-hub.xyz/icon.png"><meta property="og:description" content="${descriptionembed}"><meta property="og:type" content="video.other"><meta property="og:video:url" content="${k}"><meta property="og:video:secure_url" content="${k}"><meta property="og:video:type" content="text/html"><meta property="og:video:width" content="1280"><meta property="og:video:height" content="720"><meta property="og:video:tag" content="${j}"><meta property="fb:app_id" content="87741124305"><meta name="twitter:card" content="player"><meta name="twitter:site" content="@DevsHub"><meta name="twitter:url" content="${k}"><meta name="twitter:title" content="${j}"><meta name="twitter:description" content="${descriptionembed}"><meta name="twitter:image" content="http://s.devs-hub.xyz/icon.png"><meta name="twitter:app:name:iphone" content="DevsHub Storage"><meta name="twitter:app:id:iphone" content="${j}"><meta name="twitter:app:name:ipad" content="DevsHub Storage"><meta name="twitter:app:id:ipad" content="${j}"><meta name="twitter:app:url:iphone" content="${k}"><meta name="twitter:app:url:ipad" content="${k}"><meta name="twitter:app:url:googleplay" content="${k}"><meta name="twitter:player" content="${k}"><meta name="twitter:player:width" content="1280"><meta name="twitter:player:height" content="720"><meta name="theme-color" content="#b1b3f7"><link href="https://s.devs-hub.xyz/dev.css" rel="stylesheet" type="text/css" /></head><body><p><video controls="controls"><source src="${k}" /></video></p><h2>Click <a title="Here to join Developers Hub!" href="https://s.devs-hub.xyz/invite.html" id="white">Here Now!</a></h2></body></html>`;

    if (!fs.existsSync(`public/embed/${password}`)){
        fs.mkdirSync(`public/embed/${password}`);
    }


    fs.writeFile(`public/embed/${password}/index.html`, data, err => {
				if (err) {
					return console.log(err);
				}
	  });
	

    const embed = new Discord.MessageEmbed()
      .setTitle("__**Video Embed Upload**__")
      .setColor(0xff0000)
      .setDescription(`**Your Embed link is**\nhttps://s.devs-hub.xyz/embed/${password}\nFile Name : ${j}\nUnique ID : ${password}`)
      .setFooter('Made by Cloudflare#0001', 'https://cdn.discordapp.com/avatars/428437981238657025/a_ff463b622c49b204630db8fb5630a00f.png')
      .setTimestamp();

    msg.channel.send(embed)

    if(message.channel.type === "dm") return;

    msg.author.send(embed);
  }

});


client.login(process.env.TOKEN);