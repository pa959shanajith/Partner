import { Modal } from 'antd';
import React from "react";
import queryString from 'query-string';

export function requireAuthentication(Component) {
    return class AuthenticatedComponent extends React.Component {

        constructor(props) {
            super(props)
            this.state = {
                visible: false
            }
            this.isAuthenticated = this.isAuthenticated.bind(this);
            this.warning = this.warning.bind(this);
        }
        /**
         * Need to Call the Api For Token Expiration Checking.
         */
        isAuthenticated() {
            const values = queryString.parse(this.props.location.search);
            if (values.email && values.jwt_token) {
                localStorage.setItem('email', values.email);
                localStorage.setItem('authToken', values.jwt_token);
                localStorage.setItem('name', values.name);
            }
            var authToken = localStorage.getItem('authToken');
            var email = localStorage.getItem('email');
            if (!authToken || authToken === '' || !email || email === '') {
                return false;
            }
            return true;
        }

        warning() {
            Modal.warning({
                //   title: 'This is a warning message',
                content: (
                    <div>
                        <p>Your Session Expired; Please Login Again!</p>
                    </div>
                ),
                onOk: () => {
                    this.props.history.push('/user/login')
                }
            });

        }

        /**
         * Render
         */
        render() {
            return (
                <div>
                    {
                        this.isAuthenticated() === true ? <Component {...this.props} /> : this.warning()
                    }

                </div>
            );
        }
    };
}

export default requireAuthentication;