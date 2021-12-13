import React from 'react';
import { Menu, Layout, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
// import {UserOutlined} from '@ant-design/icons'
import ProfileSubmissionsTable from './profile-submission-table/profileSubmissionsTable'

const { SubMenu } = Menu;
class profileSubmissionWrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showProfileSubmissions: true
        }
    }

    showProfileSubmissions = () => {
        this.setState({ showProfileSubmissions: true })
    }

    handleClick = () => {
        console.log(this.props)
        this.props.history.push('dashboard')
    }

    render() {
        const { showProfileSubmissions } = this.state
        return (
            <div className="container-fluid">
                {/* <Button style={{ marginBottom: '20px' }} onClick={this.handleClick}> Go Back to Dashboard</Button> */}
                <h5 onClick={this.handleClick} style={{
                    fontSize: '14px',
                    // maxWidth: '1000px',
                    marginTop: '30px',
                    cursor: 'pointer'
                }}><Icon type="left" />Go to dashboard</h5>
                <Layout style={{ padding: '24px 0' }}>
                    {/* <Sider width={200}> */}
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ width: '200px' }}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="user" />Reports</span>}>
                            <Menu.Item key="1" onClick={this.showProfileSubmissions}>
                                Net New Profiles
                            </Menu.Item>
                            {/* <Menu.Item key="2">Report 2</Menu.Item> */}
                            {/* <Menu.Item key="3">Report 3</Menu.Item>                            */}
                        </SubMenu>
                    </Menu>
                    {/* </Sider> */}
                    {showProfileSubmissions ? <ProfileSubmissionsTable></ProfileSubmissionsTable> : ''}

                </Layout>
                {/*  */}
            </div>
        )
    }
}

export default withRouter(profileSubmissionWrapper)