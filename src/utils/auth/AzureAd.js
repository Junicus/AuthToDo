import { Component } from 'react';


const AuthenticationStates = {
  Unauthenticated: 'UNAUTHENTICATED',
  Authenticating: 'AUTHENTICATING',
  Authenticated: 'AUTHENTICATED'
};

class AzureAD extends Component {
  constructor(props) {
    super(props);

    this.authProvider = this.props.provider.getAuthProvider();
    this.authProvider.userInfoChangedCallback = this.updateState;

    this.state = {
      authenticationState: AuthenticationStates.Unauthenticated
    }
  }

  render() {
    switch (this.state.authenticationState) {
      case AuthenticationStates.Authenticated:
        return this.props.authenticatedFunction(this.logout);
      case AuthenticationStates.Authenticating:
        return null;
      case AuthenticationStates.Unauthenticated:
      default:
        return this.props.unauthenticatedFunction(this.login);
    }
  }

  componentDidMount() {
    this.sendUserInfo();
  }

  sendUserInfo = () => {
    const user = this.authProvider.getUserInfo();
    if (user) {
      this.updateState(user);
    }
  }

  resetUserInfo = () => {
    this.setState({
      authenticationState: AuthenticationStates.Unauthenticated
    });
  }

  updateState = (user) => {
    this.props.userInfoCallback(user);
    this.setState({
      authenticationState: AuthenticationStates.Authenticated
    });
  }

  login = () => {
    this.authProvider.login();
    this.sendUserInfo();
  }

  logout = () => {
    if (this.state.authenticationState !== AuthenticationStates.Authenticated) {
      return;
    }

    this.resetUserInfo();
    this.authProvider.logout();
  }
}

export { AzureAD, AuthenticationStates }