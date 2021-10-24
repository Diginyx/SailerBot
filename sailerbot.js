const Discord = require('discord.js');
require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS],
    partials: ['MESSAGE', 'REACTION', 'CHANNEL'],
});

client.on('ready', () => {
    console.log('Bot is ready');
  });

client.login(process.env.BOT_TOKEN)

const Twit = require('twit');

const T = new Twit({
    consumer_key: process.env.API_TOKEN,
    consumer_secret: process.env.API_SECRET,
    access_token: process.env.ACCESS_KEY,
    access_token_secret: process.env.ACCESS_SECRET,
    bearer_token: process.env.BEARER_TOKEN,
    timeout_ms: 60 * 1000,
  }); 

function isReply(tweet) {
  if ( tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name )
    return true
} 

let twitterChannel = '382670158692614144'; // shitposting_channel 

// Create a stream to follow tweets
const stream = T.stream('statuses/filter', {
    follow: '1204118236918435843', // @RiseMonday 1204118236918435843 
  });  

stream.on('tweet', (tweet) => {
    if(isReply)
    {
       const twitterMessage = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
       client.channels.cache.get(twitterChannel).send(twitterMessage);
       return;
    }
});

// Adding jokes function

// Jokes from dcslsoftware.com/20-one-liners-only-software-developers-understand/
// www.journaldev.com/240/my-25-favorite-programming-quotes-that-are-funny-too
const jokes = [
    'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
    '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
    'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
    'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
    'If you listen to a UNIX shell, can you hear the C?',
    'Why do Java programmers have to wear glasses? Because they don’t C#.',
    'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
    'When Apple employees die, does their life HTML5 in front of their eyes?',
    'Without requirements or design, programming is the art of adding bugs to an empty text file.',
    'Before software can be reusable it first has to be usable.',
    'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
    'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
    'There are two ways to write error-free programs; only the third one works.',
  ];

// Tell a joke
client.on('messageCreate', (msg) => {
    if (msg.content === 's!joke') {
      msg.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
  });

//Change channel where tweets are sent
client.on('messageCreate', (msg) => {
  if (msg.content.substring(0, 12) == 's!setchannel') {
    channelResult = msg.guild.channels.cache.find(channel => channel.name === msg.content.substring(13, msg.content.length));
    if (channelResult)
    {
      twitterChannel = channelResult.id
      msg.channel.send(`Tweets have been redirected to Channel name: ${channelResult.name} Channel ID: ${channelResult.id}`);
    }
    else
    {
      msg.channel.send(`Channel not found`);
    }
  }
});

//Check channel where tweets are being currently sent
client.on('messageCreate', (msg) => {
  if (msg.content == 's!checksetchannel') {
    channelResult = client.channels.cache.get(twitterChannel)
    if (channelResult)
    {
      msg.channel.send(`Tweets are being sent to Channel name: ${channelResult.name} Channel ID: ${twitterChannel}`);
    }
    else
    {
      msg.channel.send(`No channel set`);
    }
  }
});

//Help Command
client.on('messageCreate', (msg) => {
  if (msg.content == 's!help') {
    msg.channel.send(`s!joke to tell a joke \ns!setchannel [channelName] to redirect tweets \ns!checksetchannel to check where tweets are currently being sent`);
  }
});

// Adding messageReaction-role function
client.on('messageReactionAdd', async (messageReaction, user) => {
    if (messageReaction.message.partial) await messageReaction.message.fetch();
    if (messageReaction.partial) await messageReaction.fetch();
    if (user.bot) return;
    if (!messageReaction.message.guild) return;
    if (messageReaction.message.channel.id == '901371807469281290') {
        if (messageReaction.emoji.name === '🧪') {
          await messageReaction.message.guild.members.cache
            .get(user.id)
            .roles.add('901371172485222470');
        }
    } else return;
  });
  
// Removing messageReaction roles
client.on('messageReactionRemove', async (messageReaction, user) => {
    if (messageReaction.message.partial) await messageReaction.message.fetch();
    if (messageReaction.partial) await messageReaction.fetch();
    if (user.bot) return;
    if (!messageReaction.message.guild) return;
    if (messageReaction.message.channel.id == '901371807469281290') {
        if (messageReaction.emoji.name === '🧪') {
          await messageReaction.message.guild.members.cache
            .get(user.id)
            .roles.remove('901371172485222470');
        }
    } else return;
  });
