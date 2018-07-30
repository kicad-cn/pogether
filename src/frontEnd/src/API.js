const BaseURL = 'http://localhost:8000/api'
const APIList = {
    fetchUntranslated: BaseURL + "/listentry/cvpcb?untranslated=true",
    ListEntries: (docName, page, settings) => BaseURL + "/listentry/" + docName + "?page=" + page + '&' + Object.entries(settings).map(e => e.join('=')).join('&'),
    submitMsgstr: (docname, id) => BaseURL + "/entry/" + docname + "/" + id.toString(),
    getSingleEntry: (docname, id) => BaseURL + "/entry/" + docname + "/" + id.toString(),
    FetchdocMeta: (docname) => BaseURL + "/docMeta/" + docname,
    getDocList : BaseURL + "/listdocs/",
};
export default APIList;