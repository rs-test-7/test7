import React, {Component, PropTypes, PureComponent} from "react";
import _ from "underscore";
import Bracket from "./bracket";
import winningPathLength from "../utils/winning-path-length";

const makeFinals = ({games}) => {
    const isInGroup = (() => {
        const gameIdHash = _.chain(games).indexBy('id').mapObject(val => 1).value();
        return id => Boolean(gameIdHash[id]);
    })();

    debugger;

    const gamesFeedInto = _.map(
        games,
        game => ({
            ...game,
            feedsInto: _.filter(
                games,
                ({id, sides}) => (
                    isInGroup(id) &&
                    _.any(
                        sides,
                        ({sourceGame}) => sourceGame !== null && sourceGame.id === game.id
                    )
                )
            )
        })
    );

    return _.chain(gamesFeedInto)
    // получаем игры без исходной игры
        .filter(({feedsInto}) => feedsInto.length === 0)
        .map(
            // получаем высоту группы по игре без исходника
            game => ({
                game,
                height: winningPathLength(game)
            })
        )
        // строим от самой высокой (начальная игра без исходника)
        .sortBy(({height}) => height * -1)
        .value();
};

/**
 * Генерация игр осторитированных по высоте
 */
export default class BracketGenerator extends Component {
    //todo propTypes

    state = {
        finals: makeFinals({games: this.props.games})
    };

    componentWillReceiveProps({games}) {
        if (games !== this.props.games) {
            this.setState({finals: makeFinals({games})});
        }
    }

    render() {
        const {games, style, ...rest} = this.props;
        const {finals} = this.state;

        return (
            <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', ...style}}>
                {
                    _.map(
                        finals,
                        ({game, height}) => (
                            <div key={game.id} style={{textAlign: 'center', flexGrow: 1, maxWidth: '100%'}}>
                                <div style={{maxWidth: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch'}}>
                                    <Bracket game={game} {...rest}/>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}