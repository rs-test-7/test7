import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Redirect} from 'react-router-dom';

import * as actions from '../actions/actions';
import {removeEmptyElements} from '../utils';
import {bracket as bracketConsts, teams as teamsConsts, tournament as tournamentConsts} from '../constants/bracket';

let redirect = false;

class CreateTournament extends Component {
    render() {
        const actions = this.props.actions,
            error = this.props.page.errorLabel;

        console.log('props', this.props);

        let tournamentName = '',
            tournamentType = null,
            teams = '',
            errorLabel = '',
            teamsArr = [],
            teamsCount = null,
            bracketTeamsLimit = null;

        /**
         * @name checkTeams - проверка минимального / максимального количества команд
         * @param {String} teams - список команд
         * @returns {boolean}
         */
        function checkTeams(teams) {
            teamsArr = removeEmptyElements(teams.split('\n'));

            bracketLimit(teamsArr);

            return teamsConsts.MIN_TEAMS_COUNTER <= teamsArr.length && teamsConsts.MAX_TEAMS_COUNTER >= teamsArr.length;
        }

        /**
         * @name bracketLimit - получение размера турнирной сетки по количеству команд
         * @param {Array} teamsArr - список команд
         * @returns {number}
         */
        function bracketLimit(teamsArr) {
            teamsCount = teamsArr.length;
            bracketTeamsLimit = bracketConsts.BRACKET_LIMITS.find((element) => element >= teamsCount);

            return bracketTeamsLimit;
        }

        /**
         * @name drawTeams - распределение команд
         * @return {Array}
         */
        function drawTeams() {
            const emptyTeams = bracketTeamsLimit - teamsCount;

            if (emptyTeams > 0) {
                const firstEmptyPosition = bracketTeamsLimit / 2 - emptyTeams + 2;

                return addEmptyTeams(emptyTeams, firstEmptyPosition);
            } else {
                return teamsArr;
            }
        }

        /**
         * @name addEmptyTeams - добавление команд-пустышек
         * @param emptyTeams
         * @param firstEmptyPosition
         * @return {Array}
         */
        function addEmptyTeams(emptyTeams, firstEmptyPosition) {
            for (let i = 0; i < emptyTeams; i++) {
                teamsArr.splice(firstEmptyPosition, 0, teamsConsts.EMPTY_TEAM_NAME);

                firstEmptyPosition = firstEmptyPosition + 2;
            }

            return teamsArr;
        }

        /**
         * @name generateMatches - генерируем начальные матчи
         * @param teamsList
         * @return {Array}
         */
        function generateMatches(teamsList) {
            console.log('teamsList', teamsList);

            const matches = [],
                teams = teamsList.slice(),
                tba = teamsConsts.EMPTY_TEAM_NAME;

            for (let i = 0; i < teamsList.length / 2; i++) {
                const firstTeam = teams[0],
                    secondTeam = teams[1];

                matches.push({
                    id: i,
                    sides: {
                        teamOwner: {
                            name: firstTeam,
                            score: firstTeam === tba ? '0' : secondTeam === tba ? '1' : null,
                            sourceGame: null
                        },
                        teamGuest: {
                            name: secondTeam,
                            score: secondTeam === tba ? '0' : firstTeam === tba ? '1' : null,
                            sourceGame: null
                        }
                    }
                });

                teams.splice(0, 2);
            }

            return matches;
        }

        /**
         * @name generateTours - разделение на туры
         * @param matches - список начальных матчей
         * @return {Array}
         */
        function generateTours(matches) {
            //TODO se de зависимость
            const tours = [matches],
                countMatches = matches.length;

            let matchIdIncrement = countMatches,
                toursDecrement = countMatches,
                i = 1;

            while (toursDecrement / 2 >= 1) {
                const lastTour = tours[i - 1],
                    lastTourMatches = lastTour.length;

                let t = 0;

                tours[i] = [];

                for (let n = 0; n < lastTourMatches / 2; n++) {
                    const firstMatch = lastTour[t],
                        secondMath = lastTour[t + 1],
                        firstMatchWinner = getMatchWinner(firstMatch),
                        secondMatchWinner = getMatchWinner(secondMath),
                        firstMatchSource = firstMatch.id,
                        secondMatchSource = secondMath.id,
                        winnersId = tours[i].length > 0 ?
                            tours[i][tours[i].length - 1].id + 1 : lastTour[lastTourMatches - 1].id + 1,
                        winners = {
                            id: winnersId,
                            sides: {
                                teamOwner: {
                                    name: firstMatchWinner,
                                    score: null,
                                    sourceGame: {
                                        '@ref': firstMatchSource
                                    }
                                },
                                teamGuest: {
                                    name: secondMatchWinner,
                                    score: null,
                                    sourceGame: {
                                        '@ref': secondMatchSource
                                    }
                                }
                            }
                        };

                    if (firstMatchWinner === teamsConsts.EMPTY_TEAM_NAME) {
                        winners.sides.teamOwner.score = 0;
                        winners.sides.teamGuest.score = 1;
                    } else if (secondMatchWinner === teamsConsts.EMPTY_TEAM_NAME) {
                        winners.sides.teamOwner.score = 1;
                        winners.sides.teamGuest.score = 0;
                    }

                    tours[i].push(winners);

                    t = t + 2;
                    matchIdIncrement++;
                }

                toursDecrement /= 2;
                i++;
            }

            console.log('tours', tours);

            return tours;
        }

        /**
         * @name createMatch - создание матча
         * @param obj
         * @returns {{id: (number|null), sides: {teamOwner: {name: (String|null), score: (*|null), sourceGame: (ownerSource|{@ref}|null)},
          * teamGuest: {name: (String|*|null), score: (*|null), sourceGame: (guestSource|{@ref}|null)}}}}
         */
        function createMatch(obj) {
            return {
                id: obj.id || null,
                sides: {
                    teamOwner: {
                        name: obj.ownerName || null,
                        score: obj.ownerScore || null,
                        sourceGame: obj.ownerSource || null,
                    },
                    teamGuest: {
                        name: obj.guestName || null,
                        score: obj.guestScore || null,
                        sourceGame: obj.guestSource || null,
                    }
                }
            }
        }

//         function lowerBracket(tours) {
//             console.log('tours', tours);
//
//             const countTours = tours.upper.length,
//                 lastTour = tours.upper[countTours - 1],
//                 countLastTour = lastTour.length,
//                 lower = [];
//
//             let matchIdIterator = lastTour[countLastTour - 1].id + 1,
//                 temp = [];
//
//             for (let i = 0; i < countTours; i++) {
//                 let x = 2;
// debugger;
//                 while (x > 0) {
//                     const countTour = tours.upper[i].length;
// debugger;
//                     for (let n = 0; n < countTour; countTour > 2 ? n++ : n += 2) {
//                         const guest = x === 2 ? tours.upper[i][n] : lower.find((el) => {el.id === matchIdIterator}),
//                             owner = x === 2 ? tours.upper[i][n + 1] : tours.upper[i + 1][n],  //todo
//                             guestSource = i === 0 ? null : x === 2 ? {'@ref': guest.id} : null,
//                             ownerSource = i === 0 ? null : x === 2 ? {'@ref': owner.id} : {'@ref': owner.id},
//                             guestName = i === 0 ? getMatchLoser(guest) : x === 2 ? getMatchWinner(guest) : getMatchLoser(tours.upper[i][n]),
//                             ownerName = i === 0 ? getMatchLoser(owner) : x === 2 ? getMatchWinner(owner) : getMatchWinner(tours.upper[i][n + 1]),
//                             match = createMatch(
//                                 {
//                                     id: matchIdIterator,
//                                     guestName: guestName,
//                                     ownerName: ownerName,
//                                     guestSource: guestSource,
//                                     ownerSource: ownerSource
//                                 }
//                             );
//
//                         lower.push(match);
//                         temp.push(match);
//
//                         matchIdIterator++;
//                     }
//
//                     temp = [];
//                     x--;
//                 }
//             }
//
//             (function final() {
//                 const countLower = lower.length,
//                     guest = lastTour[countLastTour - 1],
//                     owner = lower[countLower - 1],
//                     guestName = getMatchWinner(guest),
//                     ownerName = getMatchWinner(owner),
//                     finalMatch = createMatch(
//                     {
//                         id: matchIdIterator,
//                         guestName: guestName,
//                         ownerName: ownerName,
//                         guestSource: guest.id,
//                         ownerSource: owner.id
//                     }
//                 );
//
//                 lower.push(finalMatch);
//             }());
//
//             tours.lower = lower;
//         }

        /**
         * @name lowerBracket - построение нижней сетки
         * @param tours
         */
        function lowerBracket(tours) {
            const upper = tours.upper,
                lower = tours.lower;

            let matchIdIncrement;

            for (let i = 0; i < upper.length; i++) {
                const currentUpperTourCount = upper[i].length;

                if (currentUpperTourCount > 1) {
                    if (i === 0) {
                        for (let n = 0; n < currentUpperTourCount; n += 2) {
                            const firstLoser = upper[i][n],
                                secondLoser = upper[i][n + 1],
                                firstLoserName = getMatchLoser(firstLoser),
                                secondLoserName = getMatchLoser(secondLoser),
                                lastUpperTour = upper[upper.length - 1],
                                lastUpperTourCount = lastUpperTour.length;

                            matchIdIncrement = matchIdIncrement ? matchIdIncrement : lastUpperTour[lastUpperTourCount - 1].id + 1;

                            if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                            tours.lower[i + 1].push(createMatch({
                                id: matchIdIncrement,
                                ownerName: firstLoserName,
                                guestName: secondLoserName
                            }));

                            matchIdIncrement++;
                        }
                    } else {
                        for (let n = 0; n < currentUpperTourCount; n++) {
                            const upperLoser = upper[i][n],
                                lowerWinner = lower[i][n],
                                upperLoserName = getMatchLoser(upperLoser),
                                lowerWinnerName = getMatchWinner(lowerWinner);

                            if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                            tours.lower[i + 1].push(createMatch({
                                id: matchIdIncrement,
                                ownerName: upperLoserName,
                                guestName: lowerWinnerName,
                                guestSource: {'@ref': lowerWinner.id}
                            }));

                            matchIdIncrement++;
                        }
                    }
                } else {
                    const lastLowerTour = lower[lower.length - 1].length;
                    debugger;

                    if (lastLowerTour > 1) {
                        const lastLowerTour = lower[lower.length - 1],
                            firstWinner = lastLowerTour[0],
                            secondWinner = lastLowerTour[1],
                            firstWinnerName = getMatchWinner(firstWinner),
                            secondWinnerName = getMatchWinner(secondWinner);

                        if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                        tours.lower[i + 1].push(createMatch({
                            id: matchIdIncrement,
                            ownerName: firstWinnerName,
                            guestName: secondWinnerName,
                            ownerSource: {'@ref': firstWinner.id},
                            guestSource: {'@ref': secondWinner.id}
                        }));

                        matchIdIncrement++;
                    }

                    //финал лузеров
                    const lastUpperTour = upper[upper.length - 1],
                        upperLoser = lastUpperTour[0],
                        upperWinner = lastUpperTour[0],
                        lastTour = lower[lower.length - 1],
                        lastTourCount = lastTour.length,
                        lowerWinner = lastTour[lastTourCount - 1],
                        upperLoserName = getMatchLoser(upperLoser),
                        upperWinnerName = getMatchWinner(upperWinner),
                        lowerWinnerName = getMatchWinner(lowerWinner);
                    debugger;
                    const losersFinal = createMatch({
                        id: matchIdIncrement,
                        ownerName: upperLoserName,
                        guestName: lowerWinnerName,
                        guestSource: {'@ref': lowerWinner.id}
                    });

                    if (!tours.lower[i + 1]) tours.lower[i + 1] = [];

                    tours.lower[i + 1].push(losersFinal);

                    matchIdIncrement++;

                    //финал
                    if (!tours.lower[i + 2]) tours.lower[i + 2] = [];

                    tours.lower[i + 2].push(createMatch({
                        id: matchIdIncrement,
                        ownerName: upperWinnerName,
                        guestName: getMatchWinner(losersFinal),
                        ownerSource: {'@ref': upperWinner.id},
                        guestSource: {'@ref': losersFinal.id}
                    }));
                }
            }
        }

        /**
         * @name getMatchWinner - получение победителя в матче
         * @param match - матч
         * @return {String}
         */
        function getMatchWinner(match) {
            const notEmpty = {
                    teamGuest: 'teamOwner',
                    teamOwner: 'teamGuest'
                },
                tba = teamsConsts.EMPTY_TEAM_NAME,
                sides = match.sides,
                teamGuest = sides.teamGuest,
                teamOwner = sides.teamOwner;

            console.log('winners match', match);

            if (teamGuest && teamOwner) {
                return teamGuest.name === tba ? sides[notEmpty['teamGuest']].name : teamOwner.name === tba ?
                    sides[notEmpty['teamOwner']].name : teamsConsts.MATCH_WINNER.toValue(match.id);
            }
        }

        /**
         * @name getMatchLoser - получение проигравшего в матче
         * @param match
         * @returns {*}
         */
        function getMatchLoser(match) {
            console.log('getMatchLoser', match);
            const tba = teamsConsts.EMPTY_TEAM_NAME,
                sides = match.sides,
                teamGuest = sides.teamGuest,
                teamOwner = sides.teamOwner;

            if (teamGuest && teamOwner) {
                return teamGuest.name === tba ? sides['teamGuest'].name : teamOwner.name === tba ?
                    sides['teamOwner'].name : teamsConsts.MATCH_LOSER.toValue(match.id);
            }
        }

        /**
         * @name modelToGraph - преобразование модели в граф
         * @param tours
         * @return {Array}
         */
        function modelToGraph(tours) {
            const model = [];

            for (const bracket in tours) {
                if (Object.prototype.hasOwnProperty.call(tours, bracket)) {
                    for (let i = 0; i < tours[bracket].length; i++) {
                        for (const key in tours[bracket][i]) {
                            if (Object.prototype.hasOwnProperty.call(tours[bracket][i], key)) {
                                const obj = {
                                    '@id': tours[bracket][i][key].id,
                                    'tour': i
                                };

                                model.push(Object.assign(obj, tours[bracket][i][key]));
                            }
                        }
                    }
                }
            }

            return model;
        }

        function handleSubmit(e) {
            e.preventDefault();

            //todo проверку на заполненость полей
            if (checkTeams(teams.value)) {
                const teamsList = drawTeams(),
                    matches = generateMatches(teamsList),
                    upper = generateTours(matches),
                    tours = {
                        upper: upper,
                        lower: []
                    };

                if (tournamentConsts[tournamentType.value] === 'Double Elimination') lowerBracket(tours);

                actions.changeTitle(tournamentName.value);
                actions.createTournament(tournamentName.value, tournamentType.value, teamsList, tours, modelToGraph(tours));
                actions.displayError('');

                redirect = true;
            } else {
                actions.displayError(`Укажите правильное количество команд! 
                Минимальное количество - ${teamsConsts.MIN_TEAMS_COUNTER}, 
                максимальное - ${teamsConsts.MAX_TEAMS_COUNTER}`);
            }
        }

        return redirect ?
            <Redirect to='/bracket'/>
            : (<form onSubmit={handleSubmit}>
                    <input
                        className='tournament-name'
                        name="name"
                        type="text"
                        placeholder="Название турнира"
                        ref={(input) => {
                            tournamentName = input
                        }}
                    />
                    <select className='tournament-type' name="type" ref={(input) => {
                        tournamentType = input
                    }}>
                        <option value={0}>Single Elimination</option>
                        <option value={1}>Double Elimination</option>
                    </select>
                    <label htmlFor="team-list" className='error' ref={(input) => {
                        errorLabel = input
                    }}>
                        {error}
                    </label>
                    <textarea
                        id='team-list'
                        className='teams-list'
                        name="teams"
                        placeholder="Введите участников турнира (каждый участник с новой строки)"
                        ref={(input) => {
                            teams = input
                        }}
                    />
                    <button>Генерировать</button>
                </form>
            );
    }
}

const mapStateToProps = state => ({
    page: state.page,
    tournament: state.tournament
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateTournament);
