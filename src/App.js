import React from 'react';
import './App.css';
import Header from "./components/Header";
import CreateOrJoin from "./components/CreateOrJoin";
import {BrowserRouter, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import CreateServer from "./components/CreateServer";
import Join from "./components/Join";
import GameInstance from "./components/GameInstance";

class App extends React.Component{

  state = {
    userName: "",
    serverID: ""
  }

  constructor() {
      super();
      document.title = "Online Draughts"
  }

  setUsername = (username) => {
      this.setState({userName: username});
  }

  setServerID = (serverID) => {
      this.setState({serverID: serverID})
  }

  render(){
    return (
      <BrowserRouter>
          <div className="App">
            <Header />
            <Route exact path="/" component={CreateOrJoin} />
            <Route path="/create" render={props => (
                <React.Fragment>
                  <CreateServer setUsername={this.setUsername} />
                </React.Fragment>
            )} />
            <Route exact path="/gameInstance" render={props => (
                <React.Fragment>
                  <GameInstance username={this.state.userName} server={this.state.serverID} />
                </React.Fragment>
            )}/>
            <Route exact path="/join" render={props => (
                <React.Fragment>
                    <Join setUsername={this.setUsername} setServerID={this.setServerID}/>
                </React.Fragment>
            )}/>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
