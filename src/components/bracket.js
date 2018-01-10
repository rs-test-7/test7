import React, {Component, PureComponent} from "react";
import _ from "underscore";
import winningPathLength from "../utils/winning-path-length";
import BracketGame from "./bracket-game";
import Tours from "./tours";

const toBracketGames = ({GameComponent, game, tournamentType, countTours, x, y, gameDimensions, roundSeparatorWidth, round,
    lineInfo, homeOnTop, ...rest}) => {
    const {width: gameWidth, height: gameHeight} = gameDimensions;

    //const defY = gameHeight * Math.pow(2, round - 2);
    //const ySep = tournamentType === 1 ? defY / 2 : defY;

    const ySep = gameHeight * Math.pow(2, round - 2);

    const isPaired = number => !(number % 2);

    return [
        <g key={`${game.id}-${y}`}>
            <GameComponent
                {...rest} {...gameDimensions}
                key={game.id} homeOnTop={homeOnTop} tournamentType={tournamentType} game={game} x={x} y={y}/>
        </g>
    ].concat(
        _.chain(game.sides)
            .map((obj, side) => ({...obj, side}))
            .filter(({sourceGame}) => sourceGame !== null)
            .map(
                ({sourceGame, side}) => {

                    const isTop = side === 'teamOwner' ? homeOnTop : !homeOnTop,
                        multiplier = isTop ? -1 : 1;

                    let defM = x - lineInfo.separation,
                        defH1 = x - (roundSeparatorWidth / 2),
                        defH2 = x - roundSeparatorWidth;
                    //    tourWidth = gameDimensions.width,
                    //    M = tournamentType === 0 ? defM : game.isLower ? defM + tourWidth :
                    //        game.tour > 2 && !isPaired(game.tour) ? defM : defM - tourWidth,
                    //    H1 = tournamentType === 0 ? defH1 : game.isLower ? defH1 + tourWidth : defH1 - tourWidth,
                    //    H2 = tournamentType === 0 ? defH2 : game.isLower ? defH2 + tourWidth : defH2 - tourWidth;
                    //
                    //if (game.isFinal && tournamentType === 1) H2 = multiplier === -1 ? defH2 : defH1 + tourWidth - 10;
                    //
                    //const pathInfo = [
                    //    `M${M}
                    //    ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                    //    `H${H1}`,
                    //    `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                    //    `H${H2}`
                    //];

                    const pathInfo = [
                        `M${defM}
                        ${y + gameHeight / 2 + lineInfo.yOffset + multiplier * lineInfo.homeVisitorSpread}`,
                        `H${defH1}`,
                        `V${y + gameHeight / 2 + lineInfo.yOffset + ((ySep / 2) * multiplier)}`,
                        `H${defH2}`
                    ];

                    //линия между матчами
                    return [
                        <path key={`${game.id}-${side}-${y}-path`} d={pathInfo.join(' ')} fill="transparent" stroke="#fff"/>
                    ]
                        .concat(
                            toBracketGames(
                                {
                                    GameComponent,
                                    game: sourceGame,
                                    homeOnTop,
                                    lineInfo,
                                    gameDimensions,
                                    roundSeparatorWidth,
                                    tournamentType,
                                    countTours,
                                    x: x - gameWidth,
                                    y: y + ((ySep / 2) * multiplier),
                                    round: round - 1,
                                    ...rest
                                }
                            )
                        );
                }
            )
            .flatten(true)
            .value()
    );

};

export default class Bracket extends Component {
    static defaultProps = {
        GameComponent: BracketGame,
        homeOnTop: true,
        gameDimensions: {
            height: 80,
            width: 256
        },
        svgPadding: 20, // отступ между сетками (svg)
        roundSeparatorWidth: 15, // отступ до изгиба линии
        lineInfo: {
            yOffset: -6,
            separation: 0,
            homeVisitorSpread: 0
        }
    };

    render() {
        const {GameComponent, game, tournamentType, countTours, gameDimensions, svgPadding, roundSeparatorWidth, ...rest} = this.props;

        const numRounds = winningPathLength(game);

        const svgDimensions = {
            height: (gameDimensions.height * Math.pow(2, numRounds - 1)) + svgPadding * 2,
            width: numRounds * gameDimensions.width
        };

        //TODO закончить для de
        //ширина туров
        //const toursWidth = tournamentType === 1 ? countTours * 510 - 256 - 80 : svgDimensions.width,
        //    svgWidth = tournamentType === 1 ? toursWidth : svgDimensions.width;

        const toursWidth = svgDimensions.width,
            svgWidth = svgDimensions.width;

        return (
            <div className="tours" style={{width: toursWidth}}>
                <Tours count={countTours} svgHeight={svgDimensions.height} tournamentType={tournamentType}/>
                <svg width={svgWidth} height={svgDimensions.height} style={{position: 'absolute', top: '55px', left: 0}}>
                    <g>
                        {
                            toBracketGames(
                                {
                                    GameComponent,
                                    gameDimensions,
                                    roundSeparatorWidth,
                                    game,
                                    tournamentType,
                                    countTours,
                                    round: numRounds,
                                    x: svgDimensions.width - gameDimensions.width,
                                    //y: tournamentType === 1 ?
                                    //((svgDimensions.height / 2) - gameDimensions.height / 2) / 2 :
                                    //svgDimensions.height / 2) - gameDimensions.height / 2, //вертикальное выравнивание
                                    y: (svgDimensions.height / 2) - gameDimensions.height / 2,
                                    ...rest
                                }
                            )
                        }
                    </g>
                </svg>
            </div>
        );
    }
}