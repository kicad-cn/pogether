import {DUPLICATE, EDIT_NEXT, PUSH_ENTRY} from "./shortcutAction"
import update from 'immutability-helper'

export function handleShortCut(state, action) {
    switch (action.shortcut) {
        case EDIT_NEXT:
            return handleEditNext(state);
        case DUPLICATE:
            return handleDuplicate(state);
        case PUSH_ENTRY:
            return handlePushEntry(state);
        default:
            return state;
    }
}

function handleEditNext(state){
    let firstIndex = state.findIndex(e => e.editing === true)
    let soloEdit=state;
    for (let i = 0; i < state.length; i++)
        soloEdit = update(soloEdit, {
            [i]: {
                $merge: {
                    editing: false
                }
            }
        })
    if (firstIndex === state.length-1)
        return update(soloEdit, {
            [firstIndex]: {
                $merge: {
                    needChangePage: true
                }
            }
        })
    else
        return update(soloEdit, {
            [firstIndex+1]: {
                $merge: {
                    editing: true
                }
            }
        })

}


function handleDuplicate(state) {
    let activate = state.findIndex(e => e.editing === true)
    if(activate!==-1){
        return update(state,{
            [activate]:{
                $merge:{
                    Msgstr:state[activate].Msgid
                }
            }
        })
    }
    return state;

}

function handlePushEntry(state) {
    let activate = state.findIndex(e => e.editing === true)
    if(activate!==-1){
        return update(state,{
            [activate]:{
                $merge:{
                    needToPush:true
                }
            }
        })
    }
    return state;
}
