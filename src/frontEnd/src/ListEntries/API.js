const BaseURL = 'http://localhost:8000/api'
const APIList={
    ListEntries:(docName,page)=>BaseURL+"/listentry/"+docName+"?page="+page,


};
export  default APIList;