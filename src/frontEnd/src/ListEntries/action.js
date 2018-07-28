import axios from 'axios'
import APIList from './API'

export const TWEAK_SINGLE_ENTRY = "ALTER_SINGLE_ENTRY";
export const TOGGLE_EDIT_STATUS = "TOGGLE_EDIT_STATUS"
export const SET_PAGE_META = "SET_PAGE_META"


export const SET_PAGE_META_ENUM = {
    fetch: "FETCH",
    receive: "RECEIVE",
    error: "ERROR"
};
export const TWEAK_OOPERATIONS_ENUM = {
    update: "UPDATE",
    create: "CREATE",
    clear: "CLEAR",
};


export function tweakEntry(payload, opertions = TWEAK_OOPERATIONS_ENUM.create) {
    switch(opertions){
        case TWEAK_OOPERATIONS_ENUM.update:
        case TWEAK_OOPERATIONS_ENUM.create:
            return {
                type: TWEAK_SINGLE_ENTRY,
                operation: opertions,
                id: payload.id,
                Msgid: payload.Msgid,
                Msgstr: payload.Msgstr,
            }
        case TWEAK_OOPERATIONS_ENUM.clear:
            return {
                type: TWEAK_SINGLE_ENTRY,
                operation: opertions,
            }
    }
}

export function toggleEntryEditStatus(id) {
    return {
        type: TOGGLE_EDIT_STATUS,
        id: id,
    }
}

/**
 *
 * @param status
 * @param response[count,currentPage]
 * @returns {{type: string, operations: *, response: *}}
 */
export function setPageMeta(status, response) {
    return {
        type: SET_PAGE_META,
        status,
        response,
    }
}


export function fetchPageData(docName, page, pageSize = 5) {
    return function (dispatch) {
        dispatch(setPageMeta(SET_PAGE_META_ENUM.fetch))
        return axios.get(APIList.ListEntries(docName, page))
            .then(
                response => {
                    dispatch(tweakEntry({},TWEAK_OOPERATIONS_ENUM.clear));
                    dispatch(setPageMeta(SET_PAGE_META_ENUM.receive, {
                        count: response.data.count,
                        currentPage: page
                    }))
                    response.data.results.map(e => dispatch(tweakEntry({
                        ...e
                    }, TWEAK_OOPERATIONS_ENUM.create)))
                },
                error=> dispatch(setPageMeta(SET_PAGE_META_ENUM.error, error))
            )
    }
}