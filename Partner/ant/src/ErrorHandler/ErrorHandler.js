import { message } from 'antd';
// import DEMO from 'constants/demoData';
import React from "react";


export default class error extends React.Component {
    customErrorCheck(err) {
        // Todo Add More Error Handlers Switch Cases if Face new Errors
        // console.log(err.message);
        // console.log(err.response);
        switch (err.message) {
            case 'Request failed with status code 400': //400 error
                if (err.response && err.response.data.message) {
                    message.warn(err.response.data.message);
                    break;
                }
                else
                    message.error('Oops ....!!!! Bad request');
                break;
            // case 'Request failed with status code 401': // 401 error
            //     localStorage.clear();
            //     // window.location.replace('locahost:3000/#/user/login')
            //     // err.response.redirect(301, '/user/login');
            //     Modal.warning({
            //         //   title: 'This is a warning message',
            //         content: (
            //             <div>
            //                 <p>Your Session Expired; Please Login Again!</p>
            //             </div>
            //         ),
            //         onOk: () => {
            //             // console.log(window.location.hostname,' its hostname');
            //             if(window.location.hostname.includes("localhost")){
            //                 window.location = DEMO.localUrl;
            //             }
            //             else if(window.location.hostname.includes("stage")){
            //                 window.location = DEMO.stageUrl;
            //             }
            //             else{
            //                 window.location = DEMO.prodUrl;
            //             }
            //             // window.location = DEMO
            //         }
            //     });
            //     // message.warn('Session Expired');
            //     break;
            case 'Request failed with status code 401': // 401 error
                localStorage.clear();
                // err.response.redirect(301, '/user/login');
                // this.props.history.push('/user/login');
                // message.warn('Session Expired');
                break;

            case 'Network Error': // 500 error
                message.error('Oops.... Please Check Your Network !!!!');
                break;
            case 'Request failed with status code 500': // 500 error
                message.error(err.response.data.message);
                break;
            // case 'Request failed with status code 404': // 404 error
            //     message.error('404 NOT FOUND');
            //     break;
            default:
                break;
        }

        if (err.error) {
            message.warn('You Have Closed the Popup');
        }


    }
    customSuccessCheck(status, messagetoShow) {
        switch (status) {
            case 200:
                message.success(messagetoShow)
                break;

            default:
                break;
        }

    }

}