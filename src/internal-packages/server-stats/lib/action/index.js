const Reflux = require('reflux');

/**
 * The actions used by the server stats components.
 */
const Actions = Reflux.createActions([
  'pause',
  'dbError',
  'showOperationDetails',
  'hideOperationDetails',
  'suppressTop',
  'restart'
]);

module.exports = Actions;
