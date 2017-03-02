const key = 'favoriteChannels';

let favorites = new Set(JSON.parse(localStorage[key] || null) || []);

/**
 * Save `favorites` to the localStorage
 */
function saveFavorite() {
  localStorage[key] = JSON.stringify(favorites);
}

/**
 * Add favorite channel
 * @param {String} channelId - The ID of the channel
 */
function addFavorite(channelId) {
  favorites.add(channelId);
  saveFavorite();
}

/**
 * Delete favorite channel
 * @param {String} channelId - The ID of the channel
 */
function delFavorite(channelId) {
  favorites.delete(channelId);
  saveFavorite();
}

/**
 * Check favorite channel
 * @param {String} channelId - The ID of the channel
 * @return {Boolean}
 */
function hasFavorite(channelId) {
  return favorites.has(channelId);
}

export {addFavorite, delFavorite, hasFavorite};
