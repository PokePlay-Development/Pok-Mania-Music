const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js")
const colors = require("colors");
const { color, wrongcolor } = require("./botconfig/embed.json")
const Distube = require("distube").default;
const client = new Discord.Client({
    //fetchAllMembers: false,
    //restTimeOffset: 0,
    //restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
      parse: [ ],
      repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [ 
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        //Discord.Intents.FLAGS.GUILD_BANS,
        //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        //Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        //Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        //Discord.Intents.FLAGS.DIRECT_MESSAGES,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
    presence: {
      activity: {
        name: `Music`, 
        type: "LISTENING", 
      },
      status: "online"
    }
});
//Define some Global Collections
client.commands = new Discord.Collection();
client._owners = new Array("988684837659488306", "821240924653748234", "681152993361788928")
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "slashCommands", "antiCrash"]
    .filter(Boolean)
    .forEach(h => {
        require(`./handlers/${h}`)(client);
    })
//Start the Bot
client.login(config.token || process.env.token)



client.distube = new Distube(client, {
  emitNewSongOnly: false,
  searchSongs: 0,
});
client.distube.on("playSong", async (queue, song) => {
	let skip = new MessageButton().setStyle("SECONDARY").setCustomId("skip").setLabel(`skip`).setEmoji("⏭️")
	let pause = new MessageButton().setStyle("SECONDARY").setCustomId("pause").setLabel(`pause`).setEmoji("⏸️")
	let resume = new MessageButton().setStyle("SECONDARY").setCustomId("resume").setLabel(`resume`).setEmoji("⏯️")
	let stop = new MessageButton().setStyle("PRIMARY").setCustomId("stop").setLabel(`stop`).setEmoji("❌")
  let volume_up = new Discord.MessageButton().setStyle("SECONDARY").setCustomId("volume_up").setLabel(`up`).setEmoji("🔊")
  let volume_down = new Discord.MessageButton().setStyle("SECONDARY").setCustomId("volume_down").setLabel(`down`).setEmoji("🔉")
  let auto_play = new Discord.MessageButton().setStyle("SECONDARY").setCustomId("auto_play").setLabel(`auto play`).setEmoji("<a:E_AutoPlay:1002537474075152434>")
	const allbuttons = new MessageActionRow().addComponents([skip, pause, resume, stop, auto_play])
  const allbuttons2 = new MessageActionRow().addComponents([volume_up, volume_down])
  let playembed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`NOW PLAYING`)
    .setThumbnail(song.thumbnail)
    .setDescription(`<a:playing:1002534222977839145>[\`${song.name}\`](${song.url})`)
    .addField("<:peoples:1002534674591129641> Requested By", `${song.user}`, true)
    .addField("<a:Duration:1002534446618124318> Duration", `${song.formattedDuration.toString()}`, true)
  await queue.textChannel.send({ embeds: [playembed], components: [allbuttons, allbuttons2]});
});
client.distube.on("addSong", async (queue, song) => {
  await queue.textChannel.send({ content: `<a:playing:1002534222977839145> **Added \`${song.name}\` to The Queue.**` });
});
client.distube.on('addList', async (queue, plalist) => {
  await queue.textChannel.send({ content: `<a:playing:1002534222977839145> **\`${playlist.name}\` to The Queue.**` });
})