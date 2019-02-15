import React from 'react';
import { AzureAD } from './utils/auth/AzureAd';
import { MsalAuthProviderFactory, LoginTypes } from './utils/auth/MsalAuthProviderFactory';


class SampleAppRedirectOnLaunch extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
    let redirectEnabled = sessionStorage.getItem('redirectEnabled') || false;
    this.state = {
      counter: 5,
      redirectEnabled
    }
  }

  handleCheck = () => {
    this.setState(
      (prevState) => ({ redirectEnabled: !prevState.redirectEnabled }),
      () => {
        if (!this.state.redirectEnabled) {
          this.clearRedirectInterval();
        } else {
          sessionStorage.setItem('redirectEnabled', true);
        }
      }
    )
  }

  unauthenticatedFunction = loginFunction => {
    if (this.state.redirectEnabled && !this.interval) {
      this.interval = setInterval(() => {
        if (this.state.counter > 0) {
          this.setState((prevState) => ({ counter: prevState.counter - 1 }));
        } else {
          this.clearRedirectInterval();
          this.setState({ redirectEnabled: false });
          loginFunction();
        }
      }, 1000);
    }

    if (this.state.redirectEnabled) {
      return (<div>Redirecting in {this.state.counter} seconds...</div>)
    }

    return (<div />);
  }

  clearRedirectInterval = () => {
    clearInterval(this.interval);
    this.setState({ counter: 5 });
    sessionStorage.removeItem('redirectEnabled');
    this.interval = null;
  }

  userJustLoggedIn = receivedUserInfo => {
    this.props.userInfoCallback(receivedUserInfo);
  }

  authenticatedFunction = (logout) => {
    return (
      <div>
        <button onClick={logout} className="Button">Logout</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {!this.props.userInfo ?
          (
            <div>
              <input type="checkbox" value={this.state.redirectEnabled} onChange={this.handleCheck} /> Enable redirect
            </div>
          ) : (<div />)
        }
        <AzureAD
          provider={new MsalAuthProviderFactory({
            authority: process.env.REACT_APP_AUTH_AUTHORITY,
            clientID: process.env.REACT_APP_AUTH_CLIENTID,
            scopes: ["openid"],
            type: LoginTypes.Redirect,
            persistLoginPastSession: true,
          })}
          unauthenticatedFunction={this.unauthenticatedFunction}
          authenticatedFunction={this.authenticatedFunction}
          userInfoCallback={this.userJustLoggedIn} />
      </div >
    );
  }
}

export default SampleAppRedirectOnLaunch;
