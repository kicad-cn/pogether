import {
    SET_PAGE_META,
    SET_PAGE_META_ENUM as PageMetaENUM,
    TOGGLE_EDIT_STATUS,
    TWEAK_OOPERATIONS_ENUM as TweakENUM,
    TWEAK_SINGLE_ENTRY,
} from './action'
import {combineReducers} from 'redux'
import update from 'immutability-helper'

const dataInitState = [];
const pageMetaInitState = {
    loading: false,
    count: 0,
}

function data(state = dataInitState, action) {
    switch (action.type) {
        case TWEAK_SINGLE_ENTRY:
            switch (action.operation) {
                case TweakENUM.create:
                    return update(state, {
                        $push: [{
                            id: action.id,
                            Msgstr: action.Msgstr,
                            Msgid: action.Msgid,
                            originMsgstr: action.Msgstr,
                            editing: false,
                            changed: false,
                        }]
                    });
                case TweakENUM.update:
                    let v = state.findIndex(e => e.id === action.id);
                    let changed = !(state[v].originMsgstr === action.Msgstr);

                    return update(state, {
                        [v]: {
                            $merge: {
                                id: action.id,
                                Msgstr: action.Msgstr,
                                Msgid: action.Msgid,
                                changed
                            }
                        }
                    });
                case TweakENUM.clear:
                    return dataInitState;
                default:
                    return state;
            }
        case TOGGLE_EDIT_STATUS:
            let v = state.findIndex(e => e.id === action.id);
            return update(state, {
                [v]: {$toggle: ['editing']}
            });
        default:
            return state;
    }
}

function pageMeta(state = pageMetaInitState, action) {
    switch (action.type) {
        case SET_PAGE_META:
            switch (action.status) {
                case PageMetaENUM.fetch:
                    return {
                        ...state,
                        loading: true,


                    }
                case PageMetaENUM.receive:
                    return {
                        ...state,
                        count: action.response.count,
                        currentPage: action.response.currentPage,
                        loading: false,
                    }
                default:
                    return state;
            }
        default:
            return state;
    }
}

const RootReducers = combineReducers({
    data,
    pageMeta,
})

export default RootReducers;
