import React, { Component } from 'react';
import { LoginTypes } from './utils/auth/MsalAuthProviderFactory';
import SampleAppButtonLunch from './SampleAppButtonLaunch';
import SampleAppRedirectOnLaunch from './SampleAppRedirectOnLaunch';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      sampleType: null
    }
  }

  componentWillMount = () => {
    if (localStorage.getItem('sampleType')) {
      this.setState({ sampleType: localStorage.getItem('sampleType') })
    }
  }

  userInfoCallback = (userInfo) => {
    this.setState({ userInfo });
  }

  handleClick = (sampleType) => {
    this.setState({ sampleType });
    localStorage.setItem('sampleType', sampleType);
  }

  render() {
    let sampleBox;
    let sampleButton;

    if (this.state.sampleType === LoginTypes.Popup) {
      sampleBox =
        <div>
          <h2>Button Login</h2>
          <SampleAppButtonLunch userInfoCallback={this.userInfoCallback} />
        </div>
    } else if (this.state.sampleType === LoginTypes.Redirect) {
      sampleBox =
        <div>
          <h2>Automatic Redirect</h2>
          <SampleAppRedirectOnLaunch userInfoCallback={this.userInfoCallback} userInfo={this.state.userInfo} />
        </div>
    }

    if (!this.state.userInfo) {
      sampleButton =
        <div>
          <button onClick={() => this.handleClick(LoginTypes.Popup)}>Popup Sample</button>
          {" "}
          <button onClick={() => this.handleClick(LoginTypes.Redirect)}>Redirect Sample</button>
        </div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Test App</h1>
        </header>
        {sampleButton}
        <div>
          {sampleBox}
          <div>
            <h2>Authenticated Values</h2>
            {
              this.state.userInfo &&
              <div>
                <span>User Information:</span><br />
                <span>ID Token:</span> {this.state.userInfo.jwtIdToken}<br />
                <span>Access Token:</span>{this.state.userInfo.jwtAccessToken}<br />
                <span>Username:</span>{this.state.userInfo.user.name}<br />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
