import axios from 'axios';

class Api {
  constructor() { }

  /*
   * @returns {Promise}
   */
  testApi() {
    return axios.get('/test');
  }

  /*
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