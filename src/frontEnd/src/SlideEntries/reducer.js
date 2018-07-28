import {combineReducers} from 'redux'

import {
    REQUEST_MSGID,
    SUBMIT_MSGSTR,
    REQUEST_DOC_META,
    REQUEST_MSGID_STSTUS_ENUM as ReqENUM,
    SUBMIT_MSGSTR_STATUS_ENUM as SubENUM,
    REQUEST_DOC_META_ENUM as DocMetaEnum,
    EDIT_MSGSTR
} from "./action";

const initRemoteInfoState = {
    meta: {
        success: true,
        isFetching: false,
        TotalEntries: null,
        Untranslated: null,
    },
    fetch: {
        isFetching: false,
        success: false,
        isEnding: false,
        id: null,
        Msgid: null,
    },
    post: {
        isFetching: false,
        success: true,
        response: null,
    }
};

const initLocalState = {
    Msgstr: '',

};

function remoteInfo(state = initRemoteInfoState, action) {
    switch (action.type) {
        case REQUEST_MSGID:
            switch (action.status) {
                case  ReqENUM.request:
                    return {
                        ...state,
                        fetch: {
                            ...state.fetch,
                            isFetching: true,
                        }
                    };
                case  ReqENUM.received:
                    return {
                        ...state,
                        fetch: {
                            ...state.fetch,
                            id: action.response.id,
                            Msgid: action.response.Msgid,
                            isFetching: false,
                        }
                    };
                case  ReqENUM.error:
                    return {
                        ...state,
                        fetch: {
                            ...state.fetch,
                            isFetching: false,
                            success: false,
                            response: action.response
                        }
                    };
                case ReqENUM.end :
                    return {
                        ...state,
                        fetch: {
                            ...state.fetch,
                            isFetching: false,
                            isEnding: true,
                            id: null,
                            Msgid: "文档已翻译完成",
                        }
                    };
                default:
                    return state;
            }
        case SUBMIT_MSGSTR:
            switch (action.status) {
                case SubENUM.post:
                    return {
                        ...state,
                        post: {
                            ...state.post,
                            isFetching: true,
                        }
                    };
                case SubENUM.success:
                    return {
                        ...state,
                        post: {
                            ...state.post,
                            isFetching: false,
                            success: true,
                            response: action.response,
                        }
                    };
                case  SubENUM.error:
                    return {
                        ...state,
                        post: {
                            ...state.post,
                            isFetching: false,
                            success: false,
                            response: action.response,
                        }
                    };
                default:
                    return state;
            }
        case REQUEST_DOC_META:
            switch (action.status) {
                case DocMetaEnum.request:
                    return {
                        ...state,
                        meta: {
                            ...state.meta,
                            isFetching: true,

                        }

                    }
                case DocMetaEnum.received:
                    return {
                        ...state,
                        meta: {
                            ...state.meta,
                            TotalEntries: action.response.TotalEntries,
                            Untranslated: action.response.UntranslatedEntries,
                            success: true,
                            isFetching: false,
                        }
                    }
                case DocMetaEnum.error:
                    return {
                        ...state,
                        meta: {
                            ...state.meta,
                            error: action.response,
                            success: false,
                            isFetching: false,
                        }
                    }
                case DocMetaEnum.localUpdate:
                    return {
                        ...state,
                        meta: {
                            ...state.meta,
                            TotalEntries: state.meta.TotalEntries,
                            Untranslated: state.meta.Untranslated - 1,
                        }
                    };

                default :
                    return state;
            }
        default:
            return state;

    }
}

function local(state = initLocalState, action) {
    switch (action.type) {
        case EDIT_MSGSTR:
            return {
                ...state,
                Msgstr: action.Msgstr
            };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    remoteInfo,
    local,
});

export default rootReducer;
