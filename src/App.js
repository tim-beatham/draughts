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
  }

  setUsername = (username) => {
      this.setState({userName: username});
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
                  <GameInstance username={this.state.userName} />
                </React.Fragment>
            )}/>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
