const BaseURL = "http://localhost:8000"
const APIList={
    fetchUntranslated:BaseURL+"/api/listentry/cvpcb?untranslated=true",
    submitMsgstr:function (docname,id) {
        return BaseURL+"/api/entry/"+docname+"/"+id.toString();
    },
    FetchdocMeta: function (docname) {
        return BaseURL+"/api/docMeta/"+docname;
    }





};
export  default  APIList;