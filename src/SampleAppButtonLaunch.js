import React from 'react';
import { AzureAD } from './utils/auth/AzureAd';
import { MsalAuthProviderFactory, LoginTypes } from './utils/auth/MsalAuthProviderFactory';


class SampleAppButtonLaunch extends React.Component {
  unauthenticatedFunction = loginFunction => {
    return (
      <button className="Button" onClick={loginFunction}>Login</button>
    );
  }

  userJustLoggedIn = receivedUserInfo => {
    this.props.userInfoCallback(receivedUserInfo);
  }

  authenticatedFunction = (logout) => {
    return (<div>
      You're logged in!
            <br />
      <br />
      <button onClick={logout} className="Button">Logout</button>
      <br />
    </div>);
  }

  render() {
    return (
      <AzureAD
        provider={new MsalAuthProviderFactory({
          authority: process.env.REACT_APP_AUTH_AUTHORITY,
          clientID: process.env.REACT_APP_AUTH_CLIENTID,
          scopes: ["openid"],
          type: LoginTypes.Popup,
          persistLoginPastSession: true,
        })}
        unauthenticatedFunction={this.unauthenticatedFunction}
        authenticatedFunction={this.authenticatedFunction}
        userInfoCallback={this.userJustLoggedIn} />
    );
  }
}

export default SampleAppButtonLaunch;
