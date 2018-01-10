import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CreateTournament from '../components/tournament-form';
import TournamentBracket from '../containers/bracket';

class MainContent extends Component {
    render() {
        const actions = this.props.actions,
            tournament = this.props.tournament,
            WrappedCreateTournament = function (props) {
                return (<CreateTournament {...props} actions={actions}/>);
            },
            WrappedBracket = function (props) {
                return (<TournamentBracket {...props} tournament={tournament}/>);
            };

        return (
            <section className={'container'}>
                <Route exact={true} path='/' component={WrappedCreateTournament}/>
                <Route exact={true} path='/bracket' component={WrappedBracket}/>
            </section>
        );
    }
}

export default MainContent;