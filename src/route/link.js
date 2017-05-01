/**
 * object required to jump to category
 * @param {object} category - the category to jump
 * @return {object} - object used to jump
 */
function categoryLink(category) {
  return {
    name: 'channel',
    params: {
      category: category['Name'],
    },
  };
}

/**
 * object required to jump to channel
 * @param {object} channel - the channel to jump
 * @return {object} - object used to jump
 */
function channelLink(channel) {
  return {
    name: 'play',
    params: {
      channel: channel['Vid'],
    },
  };
}

export {channelLink, categoryLink};
