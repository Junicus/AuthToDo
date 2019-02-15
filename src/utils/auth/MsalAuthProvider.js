import * as Msal from 'msal';

const IDTokenKey = "msal.idtoken";

const StorageLocations = {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage'
}

class MsalAuthProvider {
  constructor(authProviderConfig) {
    this.config = authProviderConfig;

    this.clientApplication = new Msal.UserAgentApplication(
      authProviderConfig.clientID,
      authProviderConfig.authority ? authProviderConfig.authority : null,
      this.tokenRedirectCallback,
      {
        cacheLocation: authProviderConfig.persistLoginPassSession ? StorageLocations.localStorage : StorageLocations.sessionStorage,
        redirectUri: authProviderConfig.redirectUri
      }
    );
  }

  userInfoChangedCallback = (userInfo) => { }
  
  login = () => { }

  logout = () => {
    this.clientApplication.logout();
  }

  getUserInfo = () => {
    return this.userInfo;
  }

  tokenRedirectCallback = (errorDesc, idToken, error, tokenType) => {
  }

  checkIfUserAuthenticated = () => {
    if (this.isLoggedIn()) {
      const idToken = this.getCacheItem(this.clientApplication.cacheLocation, IDTokenKey);
      this.acquireTokens(idToken);
    }
  }

  acquireTokens = (idToken) => {
    this.clientApplication.acquireTokenSilent(this.config.scopes)
      .then((accessToken) => {
        this.saveUserInfo(accessToken, idToken, this.clientApplication.getUser());
      }, (tokenSilentError) => {
        console.log(`token silent error: ${tokenSilentError}`);
        this.clientApplication.acquireTokenPopup(this.config.scopes)
          .then((accessToken) => {
            this.saveUserInfo(accessToken, idToken, this.clientApplication.getUser());
          }, (tokenPopupError) => {
            console.log(`token popup error: ${tokenPopupError}`);
          });
      });
  }

  saveUserInfo = (accessToken, idToken, msalUser) => {
    const user = {
      jwtAccessToken: accessToken,
      jwtIdToken: idToken,
      user: msalUser
    };

    this.userInfo = user;
    if (this.userInfoChangedCallback) {
      this.userInfoChangedCallback(user);
    }
  }

  isLoggedIn = () => {
    const potentialLoggedInUser = this.clientApplication.getUser();
    if (potentialLoggedInUser) {
      const idToken = this.getCacheItem(this.clientApplication.cacheLocation, IDTokenKey);
      const oldIdToken = potentialLoggedInUser.idToken;
      if (oldIdToken.exp && idToken) {
        const expirationInMs = oldIdToken.exp * 1000;
        if (Date.now() < expirationInMs) {
          return true;
        }
      }
    }
    return false;
  }

  getCacheItem = (storageLocation, itemKey) => {
    if (storageLocation === StorageLocations.localStorage) {
      return localStorage.getItem(itemKey);
    } else if (storageLocation === StorageLocations.sessionStorage) {
      return sessionStorage.getItem(itemKey);
    } else {
      throw new Error("unrecognized storage location");
    }
  }
}

export { MsalAuthProvider }