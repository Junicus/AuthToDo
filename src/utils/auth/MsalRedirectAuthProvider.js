import { MsalAuthProvider } from './MsalAuthProvider';

class MsalRedirectAuthProvider extends MsalAuthProvider {
  constructor(authProviderConfig) {
    super(authProviderConfig);
    if (this.redirectLoginInfo) {
      if (this.redirectLoginInfo.idToken) {
        this.acquireTokens(this.redirectLoginInfo.idToken);
      } else if (this.redirectLoginInfo.errorDesc || this.redirectLoginInfo.error) {
        console.log(`Error doing login redirect: errorDescription=${this.redirectLoginInfo.errorDesc}, error=${this.redirectLoginInfo.error}`);
      }
    } else {
      this.checkIfUserAuthenticated();
    }
  }

  login = () => {
    this.clientApplication.loginRedirect(this.config.scopes);
  }

  tokenRedirectCallback = (errorDesc, idToken, error, tokenType) => {
    this.redirectLoginInfo = {
      error,
      errorDesc,
      idToken,
      tokenType
    };
  }
}

export { MsalRedirectAuthProvider }