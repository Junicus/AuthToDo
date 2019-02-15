import { MsalPopupAuthProvider } from './MsalPopupAuthProvider';
import { MsalRedirectAuthProvider } from './MsalRedirectAuthProvider';

const LoginTypes = {
  Popup: 'POPUP',
  Redirect: 'REDIRECT'
}

class MsalAuthProviderFactory {
  constructor(config) {
    this.config = config
  }

  getAuthProvider = () => {
    if (this.config.type === LoginTypes.Popup) {
      return new MsalPopupAuthProvider(this.config);
    } else {
      return new MsalRedirectAuthProvider(this.config);
    }
  }
}

export { LoginTypes, MsalAuthProviderFactory };