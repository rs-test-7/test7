import React, {PropTypes, PureComponent} from "react";
import controllable from "react-controllables";
import _ from "underscore";
// import moment from "moment";

import {RectClipped} from "./clipped";
import {teamOwner, teamGuest} from "./game-shape";

class BracketGame extends PureComponent {
    //todo propTypes

    static defaultProps = {
        homeOnTop: true,
        styles: {
            backgroundColor: '#484848',
            scoreBackground: '#757575',
            winningScoreBackground: '#ccc',
            teamNameStyle: {fill: '#fff', fontSize: 12, textShadow: '1px 1px 1px #222'},
            teamScoreStyle: {fill: '#23252d', fontSize: 12},
            teamSeparatorStyle: {stroke: '#2c2c2c', strokeWidth: 1}
        }
    };

    render() {
        const {
            game,

            styles: {
                backgroundColor,
                scoreBackground,
                winningScoreBackground,
                teamNameStyle,
                teamScoreStyle,
                teamSeparatorStyle
            },

            homeOnTop,

            ...rest
        } = this.props;

        const {sides} = game;

        const top = sides[homeOnTop ? teamOwner : teamGuest],
            bottom = sides[homeOnTop ? teamGuest : teamOwner];

        const winnerBackground = (top && bottom && top.score && bottom.score && top.score !== bottom.score) ?
            (
                top.score > bottom.score ?
                    <rect x="0" y="12" width="30" height="22.5" style={{fill: winningScoreBackground}} rx="3" ry="3"/> :
                    <rect x="0" y="34.5" width="30" height="22.5" style={{fill: winningScoreBackground}} rx="3" ry="3"/>
            ) :
            null;

        const Side = ({x, y, side}) => {
            const tooltip = side.name ? <title>{side.name}</title> : null;

            return (
                <g>
                    <rect x={x} y={y} height={22.5} width={200} fillOpacity={0}>
                        {tooltip}
                    </rect>

                    <RectClipped x={x} y={y} height={22.5} width={165}>
                        <text x={x + 5} y={y + 16}
                              style={{...teamNameStyle, fontStyle: null}}>
                            {tooltip}
                            {side.name || null}
                        </text>
                    </RectClipped>

                    <text x={x / 2} y={y + 16} style={teamScoreStyle} textAnchor="middle">
                        {side.score ? side.score : null}
                    </text>
                </g>
            );
        };

        return (
            <svg width="200" height="82" viewBox="0 0 200 82" {...rest}>
                {/*фон матча*/}
                <rect x="0" y="12" width="200" height="45" fill={backgroundColor} rx="3" ry="3"/>

                {/*фон верхней команды*/}
                <rect x="0" y="12" width="200" height="22.5" fill={backgroundColor}
                      rx="3"
                      ry="3"/>

                {/*фон нижней команды*/}
                <rect x="0" y="34.5" width="200" height="22.5"
                      fill={backgroundColor}
                      rx="3" ry="3"/>

                {/*фон счета*/}
                <rect x="0" y="12" width="30" height="45" fill={scoreBackground} rx="3" ry="3"/>

                {winnerBackground}

                {
                    top ? (
                        <Side x={30} y={12} side={top}/>
                    ) : null
                }

                {
                    bottom ? (
                        <Side x={30} y={34.5} side={bottom}/>
                    ) : null
                }

                <line x1="0" y1="34.5" x2="200" y2="34.5" style={teamSeparatorStyle}/>
            </svg>
        );
    }
}

export default controllable(BracketGame, ['hoveredTeamId']);