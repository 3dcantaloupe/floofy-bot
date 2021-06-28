import { CachedMap } from './utils/CachedMap.js'
import { select } from './utils/select.js'

const pollChannels = new CachedMap('./data/poll-reactions.json')

export const onReady = pollChannels.read

function isPollChannel (message) {
  return pollChannels.get(message.channel.id, false)
}

const ok = ['👌', '🆗', '👍', '✅']

export async function handleMessage ({ parsed, message }) {
  if (parsed === 'poll channel') {
    if (isPollChannel(message)) {
      await message.lineReply(select([
        'this is already a poll channel though',
        'didn\'t you already do `poll channel`',
        'that doesn\'t do anything if this channel already is a poll channel'
      ]))
    } else {
      pollChannels.set(message.channel.id, true).save()
      await message.react(select(ok))
    }
    return true
  } else if (parsed === 'not poll channel') {
    if (isPollChannel(message)) {
      pollChannels.set(message.channel.id, false).save()
      await message.react(select(ok))
    } else {
      await message.lineReply(select([
        'this isn\'t a poll channel though',
        'that doesn\'t do anything if this channel already isn\'t a poll channel'
      ]))
    }
    return true
  }
  if (isPollChannel(message)) {
    console.log(message.content)
  }
}
