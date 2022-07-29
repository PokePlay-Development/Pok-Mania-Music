//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = (client, interaction) => {
	const CategoryName = interaction.commandName;
	let command = false;
	try{
    	    if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
      		command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
    	    }
  	}catch{
    	    if (client.slashCommands.has("normal" + CategoryName)) {
      		command = client.slashCommands.get("normal" + CategoryName);
   	    }
	}
	if(command) {
		if (onCoolDown(interaction, command)) {
			  return interaction.reply({ephemeral: true,
				embeds: [new Discord.MessageEmbed()
				  .setColor(ee.wrongcolor)
				  .setFooter(ee.footertext, ee.footericon)
				  .setTitle(replacemsg(settings.messages.cooldown, {
					prefix: prefix,
					command: command,
					timeLeft: onCoolDown(interaction, command)
				  }))]
			  });
			}
		//if Command has specific permission return error
        if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
              .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
                command: command,
                prefix: prefix
              }))]
          });
        }
        //if Command has specific needed roles return error
        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
          return interaction.reply({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command,
              prefix: prefix
			}))]
          })
        }
        //if Command has specific users return error
        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
          return message.channel.send({ ephemeral: true, embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command,
              prefix: prefix
            }))]
          });
        }
		//execute the Command
		command.run(client, interaction, interaction.member, interaction.guild)
	}
  if(interaction.isButton) {
    if(interaction.customId == "skip") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 1) return interaction.reply({ephemeral: true, content: "There is only one song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to skip a song."});

      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:thumbsup: Skipped!`)]});
        queue.skip()
    } else if(interaction.customId == "pause") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to pause a song."});

      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:pause_button: Paused!`)]});
        queue.pause()
    } else if(interaction.customId == "resume") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to resume a song."});

      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:arrow_forward: Resumed!`)]});
        queue.resume()
    } else if(interaction.customId == "volume_up") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to change the volume."});
      if(queue.volume == 100) return interaction.reply({ephemeral: true, content: "The volume is already at 100%."});
      if(queue.volume + 5 > 100) {
        queue.volume = 100;
      } else {
        queue.volume += 5;
      }
      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:arrow_up: Volume increased to ${queue.volume}%`)]});
    } else if(interaction.customId == "volume_down") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to change the volume."});
      if(queue.volume == 5) return interaction.reply({ephemeral: true, content: "The volume is already at 5% which is the minimum volume."});
      if(queue.volume - 5 < 5) {
        queue.volume = 5;
      } else {
        queue.volume -= 5;
      }
      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:arrow_down: Volume decreased to ${queue.volume}%`)]});
    } else if(interaction.customId == "stop") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to stop a song."});
      interaction.channel.send({ embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:stop_button: Stopped The Queue.`)]});

      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:stop_button: Stopped The Queue.`)]});
        queue.stop()
    } else if(interaction.customId == "auto_play") {
      let queue = client.distube.getQueue(interaction.guild.id);
      if(!queue) return;
      if(queue.songs.length <= 0) return interaction.reply({ephemeral: true, content: "There is No Song in the queue."});
      let channel = interaction.member.voice.channel;
      if(!channel) return interaction.reply({ephemeral: true, content: "You must be in a voice channel to change the autoplay."});

      interaction.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setColor(ee.color)
        .setDescription(`:arrow_double_up: Autoplay set to \`${queue.autoplay ? "ON" : "OFF"}\``)]});
        queue.autoplay = !queue.autoplay
    }
  }
}
