const roleForReactionData = require("../data/role-for-reactions");

const findInMap = (messageId, emojiId) =>
    Array.from(roleForReactionData.keys()).find(key =>
        key.messageId === messageId && key.emojiId === emojiId
    )

module.exports = findInMap