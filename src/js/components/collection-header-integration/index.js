const {
  getSharedCollectionHeaderIntegrationRuntime,
} = require('./runtime.js');

export default class CollectionHeaderIntegration {
  constructor(options = {}) {
    this.runtime = getSharedCollectionHeaderIntegrationRuntime(options);
  }
}
