// PlutoCore - src/bot/modules/listeners/error/commanderror.ts
// Written by Quinn Lane - https://quinnlane.dev/

import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { genEmbed } from '../../utilities/EmbedGenerator'
import config from '../../../../configuration/config'
import { existsSync, readFileSync } from 'fs'

export default class ErrorHandlerListener extends Listener {
  constructor () {
    super('errorhandler', {
      emitter: 'client',
      event: 'commanderror',
      category: 'Error Handling'
    })
  }

  async exec (message: Message, command: Command, error: string, docFile: string) {
		let embed = genEmbed({
			title: ':x: Error!',
			description: error,
			color: config.bot.personalization.embed.defaultColors.error,
			author: {
				name: config.bot.personalization.embed.name,
				image: config.bot.personalization.embed.image,
				link: config.bot.personalization.embed.link
			},
			footer: {
				text: `Generated by ${message.author.tag}`,
				image: message.author.displayAvatarURL({ dynamic: true })
			}
		})

		if (config.bot.personalization.detailedErrorMessages) {
			embed.addField('Syntax', `${config.bot.prefix}${command.description.usage}`)
			if (existsSync(`${__dirname}/../../../../messages/documentation/${docFile}`)) {
        embed.addField('Documentation', `\`\`\`${readFileSync(`${__dirname}/../../../../messages/documentation/${docFile}`)}\`\`\``)
			} else {
        embed.addField('Documentation', 'No documentation specified or documentation file is missing!')
      }
		}

    return message.channel.send(embed)
  }
}