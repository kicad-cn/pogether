import {combineReducers} from 'redux'
import Framework from './Framework/reducer'
import ListEntries from './ListEntries/reducers'



const RootReducers = combineReducers({
    Framework,
    ListEntries ,
})
export  default RootReducers;



