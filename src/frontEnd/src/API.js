var API_URL = {
    production: 'http://future.cnworkshop.xyz/api',
    development: 'http://192.168.25.215:8000/api'
}

var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const BaseURL = API_URL[environment]
const APIList = {
    fetchUntranslated: BaseURL + "/listentry/cvpcb?untranslated=true",
    ListEntries: (docName, page, settings) => BaseURL + "/listentry/" + docName + "?page=" + page + '&' + Object.entries(settings).map(e => e.join('=')).join('&'),
    submitMsgstr: (docname, id) => BaseURL + "/entry/" + docname + "/" + id.toString(),
    getSingleEntry: (docname, id) => BaseURL + "/entry/" + docname + "/" + id.toString(),
    FetchdocMeta: (docname) => BaseURL + "/docMeta/" + docname,
    getDocList: BaseURL + "/listdocs/",
};
export default APIList;