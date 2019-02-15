import { MsalAuthProvider } from './MsalAuthProvider';

class MsalPopupAuthProvider extends MsalAuthProvider {
  constructor(authProviderConfig) {
    super(authProviderConfig);
    this.checkIfUserAuthenticated();
  }

  login = () => {
    this.clientApplication.loginPopup(this.config.scopes)
      .then((idToken) => {
        this.acquireTokens(idToken);
      }, (error) => {
        console.log(`Login popup failed: ${error}`);
      });
  }
}

export { MsalPopupAuthProvider }