import { reaction } from 'mobx';
import isEqual from 'lodash/isEqual';

/**
 * Sync the history object with the given mst router store
 * @param {object} history - 'History' instance to subscribe and sync to
 * @param {object} store - Router store instance to sync with the history changes
 */
export const syncHistoryWithStore = (history, store) => {
  store._setHistory(history);

  function isLocationEqual(locationA, locationB) {
    return isEqual(locationA, locationB);
  }

  // Handle update from history object
  const handleLocationChange = location => {
    if (!isLocationEqual(store.location, location)) {
      store._updateLocation({ ...location });
    }
  };
  const unsubscribeFromHistory = history.listen(handleLocationChange);
  const unsubscribeFromStoreLocation = reaction(
    () => store.location,
    location => {
      if (!isLocationEqual(history.location, location)) {
        history.replace({ ...location });
      }
    }
  );

  history.unsubscribe = () => {
    unsubscribeFromHistory();
    unsubscribeFromStoreLocation();
  };

  handleLocationChange(history.location);

  return history;
};
