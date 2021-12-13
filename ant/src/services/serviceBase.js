import axios from 'axios';
import errorHandler from "../ErrorHandler/ErrorHandler";

var errorHand = new errorHandler();
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // We need to Insert The AuthToken and Email in Headers Todo
    var Bearer = "Bearer ";
    var token = localStorage.getItem('authToken');
    var head = {
      Authorization: Bearer + token,
      Accept: "application/json, text/plain, */*",
      ClientType:"react"
    }
    config.headers = head;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log(response,' its res');
    
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log(error);
    if(error.response.status === 401)
    {
      errorHand.customErrorCheck(error);
      localStorage.clear();
      // error.response.redirect(301,'/user/login');
    }
    return Promise.reject(error);
  });

export default axios