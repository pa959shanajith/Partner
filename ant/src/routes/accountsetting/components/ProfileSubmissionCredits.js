import { Table,Button } from 'antd';
import React from 'react';
import moment from "moment";
import partnerService from "../../../services/partnerService";
import FilterComponent from '../../dashboard/components/filterComponent';
class ProfileSubmissionCredits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profileSubmissionCredits: [],
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            selectRow: [{ "Month": "month","type":"month" }, { "Total Profiles": "totalProfiles","type":"number"  }, { "Net New Profiles": "NetNewProfiles","type":"number"  },{ "Email Verified": "NNPEmailVerified","type":"number"  },{ "Credits Due": "creditsDue","type":"number"  }],
            columns: [
                {
                    title: 'Month',
                    dataIndex: 'month',
                    ellipsis: true,
                    sorter: (a, b) => moment(a.month) - moment(b.month),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: <div style={{ paddingLeft: "25px" }}>Total Profiles</div>,
                    dataIndex: 'totalProfiles',
                    ellipsis: true,
                    sorter: (a, b) => a.totalProfiles -b.totalProfiles,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: <div style={{ paddingLeft: "65px" }}>Net New Profiles</div>,
                    dataIndex: 'NetNewProfiles',
                    ellipsis: true,
                    sorter: (a, b) => a.NetNewProfiles -b.NetNewProfiles,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: <div style={{ paddingLeft: "65px" }}> Email Verified</div>,
                    // render:()=><p>0</p>,
                    dataIndex: 'NNPEmailVerified',
                    ellipsis: true,
                    render:(text) =>(<>{text ? "True" : "False"}</>)
                },
                {
                    title: <div style={{ paddingLeft: "65px" }}>Credits Due</div>,
                    dataIndex: 'creditsDue',
                    // render:(text, record)=>(<Button>Calculate</Button>),
                    ellipsis: true,
                    sorter: (a, b) => a.creditsDue -b.creditsDue,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: <div style={{ paddingLeft: "40px" }}>Payout Details</div>,
                    dataIndex: 'payoutDetails',
                    // render:(text) =>(<>{moment(text).format('MMMM Do YYYY')}</>),
                    ellipsis: true
                }
            ]
        }
        this.partnerService = new partnerService();
    }

    componentDidMount() {
        var companyName = localStorage.getItem('companyName')
        this.partnerService.getProfilesubmissioncreditsDetails(companyName)
            .then((response) => {
                console.log("PARTNER D", response.data.data)
                this.setState({ profileSubmissionCredits: response.data.data.ProfileSubmissionCredits })
            })
            .catch((err) => {
                console.log("ERROR IN FETCHING", err)
            })
    }

    openModal = () => {
        this.setState({ visible: true})
    }
    
    closeModal() {
        this.setState({ visible: false });
    }

    sendDataToParent = (data, value,bol) => {
        // console.log("from",data,"value",value);
        this.setState({ filteredData: data, noData: value,click:bol })
    }

    changeButton = (btnName) => {
        // console.log("btnName",btnName);
        this.setState({ btnValue: btnName })
    }

    cancleFilter = () => {
        this.setState({ filteredData: [], btnValue: false, noData: true})
    }

    render() {
        return (
            <div>
                  <FilterComponent visible={this.state.visible} 
                    userData={this.state.profileSubmissionCredits} closeModal={this.closeModal.bind(this)} 
                    sendDataToParent={this.sendDataToParent.bind(this)} 
                    showSelectedRow={this.state.selectRow} 
                    changeButton={this.changeButton.bind(this)} />
                      <div className="justify-content-between" style={{
                        borderRadius: '6px 6px 0 0',
                        display: 'flex', padding: '25px', width: '100%',
                        background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                    }}>
                    <div style={{ position:"absolute",right:"25px",top:"70px" }}>
                    <Button onClick={this.state.btnValue?this.cancleFilter:this.openModal}>{this.state.btnValue ? "Clear Filter":"Filter"}</Button>
                    </div>
                    </div>
                <Table columns={this.state.columns} dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : this.state.profileSubmissionCredits : []} />
                {/* <div className="card w-50 pd-10">
                <h4>0-3000 email verified NNP – 1 INR/Profile</h4>
            </div>
            <div className="card w-50 pd-10">
                <h4>3000-9000 email verified NNP – 2 INR/Profile</h4>
            </div>
            <div className="card w-50 pd-10">
                <h4>9000 and above email verified NNP – 3 INR/Profile</h4>
            </div> */}
            </div>
        )
    }
}

export default ProfileSubmissionCredits