import React from "react";
import "../stylesheets/CreateOrJoin.css";
import { Link } from 'react-router-dom';


class CreateOrJoin extends React.Component {

    render() {
        return(
            <div className="center">
                <Link to="/create" className="button">Create Game</Link>
                <Link to="/join" className="button">Join Game</Link>
            </div>
        );
    }
}

export default CreateOrJoin;