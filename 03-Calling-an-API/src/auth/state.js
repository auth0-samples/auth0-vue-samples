export default {
  /*
   * Generates a secure string using the Cryptography API
   */
  generateSecureString() {
    const validChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let array = new Uint8Array(40);

    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));

    return String.fromCharCode.apply(null, array);
  },

  /*
   * Encodes the specified custom state along with a secure string,
   * then base64-encodes the result.
   */
  encodeState(customState) {
    const state = {
      secureString: this.generateSecureString(),
      customState: customState || {}
    };

    return btoa(JSON.stringify(state));
  },

  /*
   * Decodes the state variable from the authentication result, then
   * returns the custom state within
   */
  decodeState(authResult) {
    let parsedState = {};

    try {
      parsedState = JSON.parse(atob(authResult.state));
    } catch (e) {
      parsedState = {};
    }

    return parsedState.customState;
  }
};
