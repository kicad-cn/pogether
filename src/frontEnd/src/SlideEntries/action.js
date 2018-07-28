import axios from 'axios';
import APIList from "./API"
import {message} from 'antd'

export const REQUEST_MSGID = "REQUEST_MSGID"
export const REQUEST_MSGID_STSTUS_ENUM = {
    request: "REQUEST",     //发起请求
    received: "RECEIVED",   //收到Response
    error: "ERROR",         //出现错误
    end: "END"              //收到终止Response
};
export const SUBMIT_MSGSTR = "SUBMIT_MSGSTR";
export const SUBMIT_MSGSTR_STATUS_ENUM = {
    post: "REQUEST",        //发起请求
    success: "SUCCESS",     //收到正常Response
    error: "ERROR",         //收到错误Response
};
export const REQUEST_DOC_META = "REQUEST_DOC_META"
export const REQUEST_DOC_META_ENUM= {
    request: "REQUEST",     //发起请求
    received: "RECEIVED",   //收到Response
    error: "ERROR",         //出现错误
    localUpdate: "LOCAL_UPDATE"              //本地更新
};




export const EDIT_MSGSTR = "EDIT_MSGSTR";


function requestMsgid(status, response) {
    return {
        type: REQUEST_MSGID,
        status: status,
        response: response
    }
}

function submitMsgstr(status, response) {
    return {
        type: SUBMIT_MSGSTR,
        status: status,
        response: response
    }
}

export function requestDocMeta(status,response){
    return{
        type:REQUEST_DOC_META,
        status:status,
        response:response,
    }
}

/**
 * 取回一条未翻译内容
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function fetchMsgid() {
    return function (dispatch) {
        dispatch(requestMsgid(REQUEST_MSGID_STSTUS_ENUM.request));
        return axios.get(APIList.fetchUntranslated)
            .then(
                response => {
                    console.log(response.data.count);
                    if (response.data.count === 0) // 如果没有新的待翻译文本, dispatch End状态
                        dispatch(requestMsgid(REQUEST_MSGID_STSTUS_ENUM.end,));
                    else
                        dispatch(requestMsgid(REQUEST_MSGID_STSTUS_ENUM.received, {
                            id: response.data.results[0].id,
                            Msgid: response.data.results[0].Msgid
                        }))
                },
                error => {
                    message.error("加载翻译条目出错");
                    dispatch(requestMsgid(REQUEST_MSGID_STSTUS_ENUM.error, error));
                }
            )
    }
}

/**
 * 提交当前翻译并取回下一条翻译内容
 * @param 当前翻译内容
 * @param settings 可以设置禁用自动取回
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function pushAndfetch(payload, settings = {disableAutoNext: false}) {
    return function (dispatch) {
        let hide = message.loading("提交翻译");
        dispatch(submitMsgstr(SUBMIT_MSGSTR_STATUS_ENUM.post));
        return axios.patch(APIList.submitMsgstr(payload.docName, payload.id), {
            id: payload.id,
            Translated: true,
            Msgstr: payload.Msgstr
        })
            .then(
                response => {
                    hide();
                    message.success("成功提交");
                    dispatch(submitMsgstr(SUBMIT_MSGSTR_STATUS_ENUM.success, response))
                    if (settings.disableAutoNext === true) ;
                    else {
                        dispatch(fetchMsgid());
                        dispatch(editMsgstr(""))
                    }
                },
                error => {
                    hide()
                    message.error("远程服务器出错,提交失败." + error, 2);
                    dispatch(submitMsgstr(SUBMIT_MSGSTR_STATUS_ENUM.error, error))
                }
            )
    };
}


export  function fetchMeta(docName) {
    return function (dispatch) {
        dispatch(requestDocMeta(REQUEST_DOC_META_ENUM.request));
        return axios.get(APIList.FetchdocMeta(docName))
            .then(
                response => dispatch(requestDocMeta(REQUEST_DOC_META_ENUM.received,response.data)),
                error =>dispatch(requestDocMeta(REQUEST_DOC_META_ENUM.error,error))
            )
    }
}


export function editMsgstr(msgstr) {
    return {
        type: EDIT_MSGSTR,
        Msgstr: msgstr,
    }
}


