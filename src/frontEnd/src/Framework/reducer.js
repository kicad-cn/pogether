import {FETCH_DOCS_ENUM as fetchENUM,FETCH_DOCS} from './action'

import update from 'immutability-helper'

const initState = {
    loading: false,
    docs: []

}


const  Framework = function(state = initState, action) {
    switch (action.type) {
        case FETCH_DOCS:
                switch (action.status) {
                    case fetchENUM.fetch:
                        return update(state, {
                            $merge: {
                                loading: true
                            }
                        })

                    case fetchENUM.receive:
                        return update(state, {
                            $merge: {
                                docs: action.response.results,
                                loading:false,
                            }
                        })
                    default:
                        return state;


                }
        default:
            return state;
    }
};


export  default Framework;






