import { combineReducers } from 'redux'
import page from './page'
import tournament from './tournament'

export default combineReducers({
    page,
    tournament
});