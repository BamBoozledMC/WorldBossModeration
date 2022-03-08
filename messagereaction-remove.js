const db = require('quick.db');
const config = require('./config.json');

module.exports = (reaction, user, bot) => {
  let checkifsuggestion = db.get(`suggestions.${reaction.message.id}`)
  if (checkifsuggestion) {
    if (reaction.emoji.id == '934930260070371389') {
    console.log(`${user.tag} upvoted ${reaction.message.id}`)
    db.add(`suggestions.${reaction.message.id}.upvotes`, -1)
  } else if (reaction.emoji.id == '934930252713586688') {
    console.log(`${user.tag} downvoted ${reaction.message.id}`)
    db.add(`suggestions.${reaction.message.id}.downvotes`, -1)
  }
  }
}
