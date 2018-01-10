import actions from '../constants/action-types';

const initialState = {
    title: 'Создайте турнирную сетку',
    errorLabel: ''
};

export default function page(state = initialState, action) {
    switch (action.type) {
        case actions.CHANGE_TITLE:
            return {...state, title: action.title};

        case actions.DISPLAY_ERROR:
            return {...state, errorLabel: action.errorLabel};

        default:
            return state;
    }
};