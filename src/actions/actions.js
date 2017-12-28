import actions from '../constants/action-types';

function displayError(errorText) {
    return {
        type: actions.DISPLAY_ERROR,
        errorLabel: errorText
    };
}

function changeTitle(title) {
    return {
        type: actions.CHANGE_TITLE,
        title: title
    };
}

function createTournament(name, type, teams, tours, bracketModel) {
    const tournamentType = parseInt(type),
        teamsCounter = teams.length;

    return {
        type: actions.CREATE_TOURNAMENT,
        tournamentName: name,
        tournamentType: tournamentType,
        teams: teams,
        counter: teamsCounter,
        tours: tours,
        bracketModel: bracketModel
    };
}

export {changeTitle, createTournament, displayError};