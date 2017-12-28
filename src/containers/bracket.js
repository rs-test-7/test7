import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import JSOG from 'jsog';

import * as BracketGame from '../components/bracket-game';
import BracketGenerator from '../components/bracket-generator';

const gameComponent = props => {
    return (
        <BracketGame
            {...props}
        />
    );
};

class TournamentBracket extends Component {
    render() {
        const tournament = this.props.tournament;
        const {gameComponent: GameComponent} = this;

        return tournament.tours.length === 0 ?
            <Redirect to='/'/> :
            <div>
                <BracketGenerator GameComponent={GameComponent} games={JSOG.decode(tournament.bracketModel)}/>
            </div>
    }
}

export default TournamentBracket;
