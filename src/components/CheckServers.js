import React from "react";
import {Redirect} from "react-router-dom";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

// Simply checks whether a username exists or not.
class CheckServers extends React.Component {

    state = {
        userExists: false,
        noServer: false,
        canJoin: false,
        errorMsg: "",
        full: false
    }

    constructor() {
        super();
        this.socket = socketIOClient(ENDPOINT);
    }

    componentDidMount() {
        // Check if the username and server exists.
        console.log(this.props.server);
        if (!this.props.server) {
            this.socket.emit("check-create", this.props.username);
        } else {
            this.socket.emit("check-join", {username: this.props.username, server: this.props.server});
        }

        this.socket.on("user-exists-error", () => {
            this.setState({userExists: true});
            this.cantJoin();
        });

        this.socket.on("no-server-error", () => {
            this.setState({noServer: true});
            this.cantJoin();
        })

        this.socket.on("can-join", () => {
            this.setState({canJoin: true});
        })

        this.socket.on("server-full", () => {
            console.log("alriight");
            this.setState({full: true})
            this.cantJoin();
        });
    }

    componentWillUnmount() {
        this.socket.disconnect();
        this.setState({userExists: false});
        this.setState({noServer: false});
        this.setState({canJoin: false});
    }

    cantJoin = () => {
        let errorMsg = "";
        if (this.state.noServer) {
            errorMsg = "The Server You Specified Does Not Exist!\n";
        }

        if (this.state.userExists) {
            errorMsg += "The Username Already Exists!\n";
        }

        if (this.state.full){
            errorMsg += "I am afraid the Server is Full!"
        }
        this.setState({errorMsg: errorMsg});
    }


    redirectToGame = () => {
        if (this.state.canJoin){
            return <Redirect to="/gameInstance" />
        }
    }

    render() {
        return (
            <div>
                {this.redirectToGame()}
                <p>{this.state.errorMsg}</p>
            </div>
        )
    }
}

export default CheckServers;