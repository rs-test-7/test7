const initialState = {
        page: {
            title: ''
        },
        tournament: {
            name: '',
            type: null,
            teams: [],
            counter: 0,
            tours: [],
            bracketModel: []
        }
    },
    toursState = {
        title: '',
        matches: []
    },
    matchState = {
        id: null,
        teamOwner: '',
        teamGuest: ''
    };

export {initialState, toursState, matchState};