import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import MainContent from '../containers/main-content';
import Header from '../components/header';
import * as actions from '../actions/actions'

import '../styles/main.css';

class App extends Component {
    render() {
        const title = this.props.page.title,
            actions = this.props.actions,
            tournament = this.props.tournament;

        return (
            <div>
                <Header title={title}/>
                <MainContent actions={actions} tournament={tournament}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        page: state.page,
        tournament: state.tournament
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
