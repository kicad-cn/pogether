import axios from 'axios'
import APIList from '../API'

export const TWEAK_SINGLE_ENTRY = "TWEAK_SINGLE_ENTRY";
export const TOGGLE_EDIT_STATUS = "TOGGLE_EDIT_STATUS";
export const SET_PAGE_META = "SET_PAGE_META";
export const SET_PAGE_FILTER="SET_PAGE_FILTER";

export const AJAX_ENUM = {
    fetch: "FETCH",
    receive: "RECEIVE",
    error: "ERROR"
};

export const TWEAK_OOPERATIONS_ENUM = {
    update: "UPDATE",
    create: "CREATE",
    clear: "CLEAR",
};
export const SUBMIT_MSGSTR = "SUBMIT_MSGSTR";

function submitMsgstr(status, response) {
    return {
        type: SUBMIT_MSGSTR,
        status: status,
        response: response
    }
}

function fetchSingleEntry(docName,id) {
    return function (dispatch) {
        dispatch(tweakEntry({id,loading:true},TWEAK_OOPERATIONS_ENUM.update))
        return axios.get(APIList.getSingleEntry(docName,id))
            .then(
                response =>{
                    dispatch(tweakEntry({...response.data,loading:false,originMsgstr:response.data.Msgstr},TWEAK_OOPERATIONS_ENUM.update))
                }
            )
        }
}

export function pushAndrefetch(docName,id,payload ,settings = {disableAutoNext: false}) {
    return function (dispatch) {
        dispatch(tweakEntry({id,loading:true},TWEAK_OOPERATIONS_ENUM.update))
        return axios.patch(APIList.submitMsgstr(docName,id), {
            ...payload,
            Translated: true,
        }).then(
                response => {
                    console.log(response)
                  dispatch(fetchSingleEntry(docName,id))
                },
                error => {
                    dispatch(submitMsgstr(AJAX_ENUM.error, error))
                }
            )
    };
}

export function tweakEntry(payload, opertions = TWEAK_OOPERATIONS_ENUM.create) {
    switch (opertions) {
        case TWEAK_OOPERATIONS_ENUM.clear:
            return {
                type: TWEAK_SINGLE_ENTRY,
                operation: opertions,
            }
        case TWEAK_OOPERATIONS_ENUM.update:
        case TWEAK_OOPERATIONS_ENUM.create:
        default:
            return {
                type: TWEAK_SINGLE_ENTRY,
                operation: opertions,
                ...payload,
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

export function setPageFilter(payload) {
    return {
        type:SET_PAGE_FILTER,
        payload,
    }
}

export function fetchPageData(docName, page, settings={pageSize :5,untranslated:false}) {
    return function (dispatch) {
        dispatch(setPageMeta(AJAX_ENUM.fetch))
        return axios.get(APIList.ListEntries(docName, page,settings))
            .then(
                response => {
                    if (response > 400)
                        dispatch(setPageMeta(AJAX_ENUM.error,response))
                    else
                    {
                        dispatch(tweakEntry({}, TWEAK_OOPERATIONS_ENUM.clear));
                        dispatch(setPageMeta(AJAX_ENUM.receive, {
                            count: response.data.count,
                            currentPage: page
                        }))
                        response.data.results.map(e => dispatch(tweakEntry({
                            ...e
                        }, TWEAK_OOPERATIONS_ENUM.create)))
                    }

                },
                error => dispatch(setPageMeta(AJAX_ENUM.error, error))
            )
    }
}