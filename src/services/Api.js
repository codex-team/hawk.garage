import axios from 'axios';

/**
 * Class for working with api
 *
 * @class Api
 */
class Api {
  /**
   * Test api call
   *
   * @returns {Promise}
   */
  testApi() {
    return axios.get('/test');
  }

  /**
   * Stub for test api call
   *
   * @returns {Promise}
   */
  testStub() {
    let testPromise = new Promise((resolve, reject) => {
      resolve({
        projects: ['a1', 'a2', 'a3']
      });
    });

    return testPromise;
  }
}

export default new Api();