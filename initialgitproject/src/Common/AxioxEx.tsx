import axios from 'axios';

export const PerformGetRequest =(url : string ,sucessCallBack : any, errorCallBack :any ,  params : any = null) => {
    axios.get(url,{
      headers : {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Cache-Control": "no-cache, must-revalidate",
        Pragma: 'no-cache',
        Accept: "application/json",    
      },
      params
      
    })
  .then(function (response) {
    return sucessCallBack(response)
  })
  .catch(function (error) {
    errorCallBack(error);
  })
  .finally(function () {
  });
}

export const PerformPostRequest = (url : string ,sucessCallBack : any, errorCallBack :any ,  data : any = null)=>
{
  axios.post(url, data)
  .then(function (response) {
    sucessCallBack(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

export const PerformMultipleRequest = (endpoints : any , successCallback:any,errorCallBack : any) =>{
  let promises: Array<any> = [];
  endpoints.forEach((req, index) => {
    let config  = {
      method: "get",
      url : req.url,
      params : {},
      headers : {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Cache-Control": "no-cache, must-revalidate",
        Pragma: 'no-cache',
        Accept: "application/json",    
      }
    }
    let url = req.url
    promises.push(axios.get(url, config))
})
  axios.all(promises).then(
    (data) => {
      let processedResponse: any[] = [];
      endpoints.forEach((val, index) => {
            processedResponse.push(data[index]);
    });
    return successCallback(processedResponse);
    },

  );
}