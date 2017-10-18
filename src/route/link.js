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
 * @param {String} from - jump from which route
 * @return {object} - object used to jump
 */
function channelLink(channel, from) {
  console.warn(channel);
  return {
    name: 'play',
    params: {
      channel: channel,
      from: from,
    },
  };
}

export {channelLink, categoryLink};
