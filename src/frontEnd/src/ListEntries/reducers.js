import {
    AJAX_ENUM as AjaxENUM,
    SET_PAGE_META,
    TOGGLE_EDIT_STATUS,
    TWEAK_OOPERATIONS_ENUM as TweakENUM,
    TWEAK_SINGLE_ENTRY,
    SET_PAGE_FILTER,
} from './action'
import {SHORTCUT} from  './shortcutAction'
import {handleShortCut} from "./shortcutReducers";
import {combineReducers} from 'redux'
import {message} from 'antd'
import update from 'immutability-helper'

const dataInitState = [];
const pageMetaInitState = {
    loading: false,
    count: 0,
    untranslated:false,
}

function data(state = dataInitState, action) {
    switch (action.type) {
        case TWEAK_SINGLE_ENTRY:
            switch (action.operation) {
                case TweakENUM.create:
                    return update(state, {
                        $push: [{
                            ...action,
                            originMsgstr: action.Msgstr,
                            editing: false,
                            changed: false,
                        }]
                    });
                case TweakENUM.update:
                    let v = state.findIndex(e => e.id === action.id);
                    if(v===-1)return state;
                    let t = update(state, {
                        [v]: {
                            $merge: {
                                needToPush:false,  //to achive push shortcut
                                ...action,
                            }
                        }
                    });

                    let changed = !(t.find(e => e.id === action.id).originMsgstr=== action.Msgstr);
                    return update(t, {
                        [v]: {
                            $merge: {
                                changed,
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
        case SHORTCUT:
            return handleShortCut(state,action);
        default:
            return state;
    }
}

function pageMeta(state = pageMetaInitState, action) {
    switch (action.type) {
        case SET_PAGE_META:
            switch (action.status) {
                case AjaxENUM.fetch:
                    return {
                        ...state,
                        loading: true,
                    }
                case AjaxENUM.receive:
                    return {
                        ...state,
                        count: action.response.count,
                        currentPage: action.response.currentPage,
                        loading: false,
                    }
                case AjaxENUM.error:
                    message.error(action.response.message)
                    return state;

                default:
                    return state;
            }
        case SET_PAGE_FILTER:
            return update(state,{
                $merge:{
                    ...action.payload

                }
            })
        default:
            return state;
    }
}

const ListEntries = combineReducers({
    data,
    pageMeta,
})

export default ListEntries;
