const discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");
const ms = require("ms")
const { MessageActionRow, MessageButton } = require("discord.js")
const ee = require('../botconfig/embed.json')
const fetch = require("node-fetch")
module.exports = {
    name: `eval`,
    description: 'eval some code',
    options: [
        {"String": { name: "code", description: "provide the code", required: true }}
    ],
    run: async (client, interaction) => {
        const { options } = interaction;
        let color = ee.color

        if (!client._owners.includes(interaction.user.id)) return interaction.reply(`Only **${client.user.username}** Owner/Developers can use this Command!`)
        
        this.client = client

        let code = options.getString("code")
        let codeArr = code.match(/(.|[\r\n]){1,1980}/g)

        let time = new Date(), ping = new Date() - interaction.createdTimestamp, timeTaken, executed = []

        const embed = new MessageEmbed()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || interaction.user.displayAvatarURL({ dynamic: true }))
            .addField('**📥 Input:**', '```js\n' + code.substr(0, 1024) + '```')
            .setColor(color)

        try {
            let evaled = await eval(`(async() => { ${code} })()`)
            timeTaken = new Date() - time

            let result = evaled
            if (typeof evaled !== 'string') result = require('util').inspect(evaled)
            let resultArr = result.match(/(.|[\r\n]){1,1980}/g)

            if (code.length > 1024) {
                embed.fields[0].value = `\`\`\`Code is longer than 1024 characters.. Do you want the code in DMs?\`\`\``
            } else {
                embed.fields[0].value = `\`\`\`\n${code.substr(0, 1024)}\`\`\``
            }
            executed.push({
                type: 'code',
                code: codeArr
            })

            if (result.length > 1024) {
                embed.addField('**📤 Output: **', `\`\`\`Result is longer than 1024 characters.. Do you want the Result in DMs?\`\`\``)
            } else {
                embed.addField('**📤 Output: **', '```js\n' + result + '```')
            }
            executed.push({
                type: 'evaled',
                evaled: resultArr
            })
            embed.addField('**❗ Output Type: **', '```xl\n' + typeof evaled + '\n```')
        } catch (err) {
            let errArr = err.message.match(/(.|[\r\n]){1,1980}/g)
            timeTaken = new Date() - time

            if (err.length > 1024) {
                embed.addField('**❌ ERROR: **', `\`\`\`Error is longer than 1024 characters.. Do you want the Error in DMs?\`\`\``)
            } else {
                embed.addField('**❌ ERROR: **', `\`\`\`xl\n${err.message}\n\`\`\``)
            }
            executed.push({
                type: 'evaled',
                evaled: errArr
            })
            executed.push({
                type: 'code',
                code: codeArr
            })
        }

        embed.addField("⏰ Execution Time:", `**\`\`\`\nPING: ${ping}ms\nTIME TAKEN: ${((timeTaken / 1000)) < 1 ? `${timeTaken}ms` : `${(timeTaken / 1000).toFixed(2)} Second(s)`}\n\`\`\`**`)

        let row = new MessageActionRow().addComponents(
            new MessageButton().setLabel("📥 DM Code").setStyle("SUCCESS").setCustomId(`code-${interaction.user.id}`),
            new MessageButton().setLabel("📤 DM Results").setStyle("SUCCESS").setCustomId(`result-${interaction.user.id}`),
            new MessageButton().setLabel("❌ Delete").setStyle("DANGER").setCustomId(`delete-${interaction.user.id}`))

        let rowx = new MessageActionRow().addComponents(
            new MessageButton().setLabel("📥 DM Code").setStyle("SUCCESS").setCustomId(`code-${interaction.user.id}`).setDisabled(true),
            new MessageButton().setLabel("📤 DM Results").setStyle("SUCCESS").setCustomId(`result-${interaction.user.id}`).setDisabled(true),
            new MessageButton().setLabel("❌ Delete").setStyle("DANGER").setCustomId(`delete-${interaction.user.id}`).setDisabled(true))
        await interaction.reply({ content: `Processed.`, ephemeral: true })
        let msg = await interaction.channel.send({
            embeds: [embed],
            components: [row],
            allowedMentions: {
                repliedUser: false
            }
        })

        const filter = async (i) => {
            if (i.user.id == interaction.user.id) return true
            if (i.user.id != interaction.user.id) {
                await i.deferUpdate()
                let m = await i.reply({
                    content: "Only **Command Author** can interact with Buttons.",
                    ephemeral: true
                })
                setTimeout(() => m.delete(), 4000)
                return false
            }
        }

        const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000
        })

        collector.on('collect', async i => {
            await i.deferUpdate()
            if (i.customId == `code-${interaction.user.id}`) {
                executed.find(r => r.type === 'code').code.forEach(msg => {
                    interaction.user.send(`\`\`\`js\n${msg}\`\`\``).catch((r) => {
                        if (r.message.includes("Cannot send messages to this user")) return interaction.reply({
                            content: "You have your DMs closed!",
                            allowedMentions: {
                                repliedUser: false
                            }
                        })
                        return
                    })
                })
            } else if (i.customId == `result-${interaction.user.id}`) {
                executed.find(r => r.type === 'evaled').evaled.forEach(msg => {
                    interaction.user.send(`\`\`\`js\n${msg}\`\`\``).catch((r) => {
                        if (r.message.includes("Cannot send messages to this user")) return interaction.reply({
                            content: "You have your DMs closed!",
                            allowedMentions: {
                                repliedUser: false
                            }
                        })
                        return
                    })
                })

            } else if (i.customId === `delete-${interaction.user.id}`) {
                collector.stop()
                try {
                    await msg.delete()
                } catch (e) {
                    return
                }
                return
            }
        })

        collector.on('end', () => {
            return msg.edit({
                components: [rowx]
            })
        })
    }
}