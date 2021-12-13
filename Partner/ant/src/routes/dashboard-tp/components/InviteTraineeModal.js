import { Icon, Modal, Tooltip, Button, Divider, message, Checkbox, Pagination } from 'antd';
import React from 'react';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';

// var trainingEvent = {};
class InviteTraineeModal extends React.Component {
    constructor(props) {
        super(props);
        var partnerEmail = localStorage.getItem('email');
        var ObjectId = localStorage.getItem('ObjectId');
        var trainingId = localStorage.getItem('trainingId');
        this.state = {
            loading: true,
            visible: false,
            childLoading: true,
            title: '',
            place: '',
            minValue: 0,
            maxValue: 9,
            count: 0,
            currentPage: 1,
            current: 0,
            subscriptionInfo: [],
            btnDisable: false,
            profileData: [],
            selectall: [],
            partnerEmail: partnerEmail,
            ObjectId: ObjectId,
            trainingId: trainingId
        };
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.selectAllparticipant = this.selectAllparticipant.bind(this);
        this.inviteallparticipants = this.inviteallparticipants.bind(this);
        this.inviteparticipant = this.inviteparticipant.bind(this);
    }
    handleCancel = () => {
        this.setState({ title: '', place: '', profileData: [] })
        this.props.onClose();
    };

    SearchTitle = (e) => {
        // if (e) {
            this.setState({
                title: e
            });
        // }

    }
    SearchPlace = (e) => {
        // if (e) {
            this.setState({
                place: e
            });
        // }
    }
    SearchingJob = (e) => {
        e.preventDefault();
        this.setState({ childLoading: true });
        var setValueArray = this.setValue(this.state.title, this.state.place)
        const data = {
            "searchString": setValueArray.title || [],
            "location": setValueArray.place || []
        }
        this.partnerService.getTraineeProfile(data).then((d) => {
            // console.log(d, ' its d');
            this.setState({ profileData: d.data.data, count: d.data.count });
            // this.setState({ filterArr: d.data.data });
            // this.setState({ count: d.data.count });
            this.forceUpdate();
            this.setState({ childLoading: false })
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {

    }

    selectAllparticipant = (e) => {
        // console.log(e.target.checked, ' its e');
        if (e.target.checked) {
            var profiles = this.state.profileData;
            var allparticipant = []
            if (profiles.length > 0) {
                profiles.forEach((el) => {
                    allparticipant.push(el.emailId);
                })
            }
            // console.log(allparticipant, ' its all emails');
            this.setState({ selectall: allparticipant });
        }
        else {
            this.setState({ selectall: [] });
        }


    }
    // inviting all participant
    inviteallparticipants = () => {
        // console.log(' its invite all');
        var emails = this.state.selectall;
        if (emails.length > 0) {

            var getDetailsdata = {
                ObjectId: localStorage.getItem('ObjectId')
            }

            this.partnerService.getClickedTraining(getDetailsdata).then((res) => {
                // console.log(res,' its res of Training Data');
                if (res.data.status === true) {
                    // let trainingEvent = res.data.data;
                    var check = this.inviteAllEmailsValidation(emails, res.data.data);
                    if (check) {
                        message.info({ content: 'Some Profiles Already Invited For This Training', duration: 3 });
                        setTimeout(() => {
                            message.info({ content: 'Please Send Mail Separately', duration: 5 });
                        }, 1500);
                    }
                    else {
                        var data = {
                            emails: emails,
                            trainingId: this.state.trainingId,
                            partnerEmail: this.state.partnerEmail
                        }
                        this.partnerService.inviteallparticipants(data).then((res) => {
                            // console.log(res, ' its res after invited');
                            if (res.data.status === true) {
                                message.success('All Participants are invited');
                            }
                        }).catch((err) => {
                            this.errorHandler.customErrorCheck(err);
                        })
                    }
                }
            }).catch((err) => {
                // onFinishFailed(err.response.data.message)
                message.error("Failed to fetch Training Details.", 5)
            })



        }
        else {
            message.info('Please Click select all participant');
        }
    }
    inviteparticipant = (emailId) => {
        // console.log(emailId, ' its single invite');
        var data = {
            ObjectId: localStorage.getItem('ObjectId')
        }

        this.partnerService.getClickedTraining(data).then((res) => {
            // console.log(res,' its res of Training Data');
            if (res.data.status === true) {
                // let trainingEvent = res.data.data;
                var check = this.inviteValidation(emailId, res.data.data);
                if (check) {
                    message.info('Profile Already Invited For This Training');
                }
                else {
                    var data = {
                        email: emailId,
                        trainingId: localStorage.getItem('trainingId'),
                        partnerEmail: this.state.partnerEmail,
                    }
                    this.partnerService.inviteParticipant(data).then((res) => {
                        // console.log(res, ' its single invite');
                        if (res.data.status === true) {
                            message.success(`Profile Invited for Event`);
                        }
                    }).catch((err) => {
                        this.errorHandler.customErrorCheck(err);
                    })
                }
                // this.setState({ TrainingDetails: res.data.data })
            }
        }).catch((err) => {
            // onFinishFailed(err.response.data.message)
            message.error("Failed to fetch Training Details.", 5)
        })
    }

    inviteValidation = (emailId, data) => {
        var returnValue = false;
        if (data && emailId) {
            // console.log(data.trainingInvites);

            data.trainingInvites.forEach((val) => {
                // console.log(val, ' its val');
                if (val.candidateEmail === emailId) {
                    returnValue = true;
                }
            })
        }
        return returnValue;
    }
    inviteAllEmailsValidation = (emails, data) => {
        var returnValue = false;
        if (emails.length > 0 && data) {
            emails.forEach((e) => {
                data.trainingInvites.forEach((val) => {
                    // console.log(val, ' its val');
                    if (val.candidateEmail === e) {
                        returnValue = true;
                    }
                })
            })
        }
        return returnValue;
    }

    setValue = (title, place) => {
        var titleSplit, placeSplit;
        var titleArr = [], placeArr = [];

        if (title) {
            if (title.includes(',')) {
                titleSplit = title.split(',');
            }
            else if (title.includes(' ')) {
                titleSplit = title.split(' ');
            }
            else {
                titleArr.push(title);
                titleSplit = titleArr;
            }
        }
        if (place) {
            if (place.includes(',')) {
                placeSplit = place.split(',');
            }
            else if (place.includes(' ')) {
                placeSplit = place.split(' ');
            }
            else {
                placeArr.push(place);
                placeSplit = placeArr
            }
        }
        return { title: titleSplit, place: placeSplit }
    }

    handleChangePage = value => {
        if (value <= 1) {
            this.setState({
                minValue: 0,
                maxValue: 9,
                currentPage: value
            });
        } else if (value > this.state.currentPage) {
            let min = (value * 9) - 9;
            this.setState({
                minValue: min,
                maxValue: value * 9,
                currentPage: value
            });
        } else if (value < this.state.currentPage) {
            this.setState({
                minValue: this.state.minValue - 9,
                maxValue: this.state.maxValue - 9,
                currentPage: value
            })
        }
    };

    // componentWillReceiveProps(props) {
    //     // this.setState({
    //     //     postUrl: props.paymentData.postUrl,
    //     //     paymentData: props.paymentData
    //     // })
    //     if (props.txStatus !== this.props.txStatus) {
    //         var txStatus = props.txStatus
    //         if (txStatus === "SUCCESS") {
    //             message.success('You Are Already Subscribed')
    //             this.setState({ btnDisable: true })
    //         }
    //         this.setState({
    //             postUrl: props.paymentData.postUrl,
    //             paymentData: props.paymentData
    //         })
    //     }
    // }

    // already invited
    alreadyInvited = () => {
        message.info('Profile Already invited For This Training');
    }

    render() {
        const visible = this.props.visible;
        // var subscriptionInfo = this.props.subscriptionData;
        // let trainingEvent = this.props.eventData;
        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='50%'
                className="invite-trainee-modal"
            >
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 style={{ marginRight: '15px', fontWeight: '600', color: '#707070', fontSize: '28px' }} >Invite Trainee</h3>
                        </div>
                    </div>
                    <hr />

                    <div class="row">
                        <div className="container pb-5">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-lg-5 col-md-5 col-sm-12 p-0">
                                                <input value={this.state.title} onChange={(e) => this.SearchTitle(e.target.value)} autoComplete="new-password" type="text" className="form-control search-slt" placeholder="Search by Title, Skills, or Keywords" />
                                            </div>
                                            <div className="col-lg-5 col-md-5 col-sm-12 p-0 search-controls">
                                                <input value={this.state.place} onChange={(e) => this.SearchPlace(e.target.value)} autoComplete="new-password" type="text" className="form-control search-slt" placeholder="Location" />
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-12 p-0">
                                                <button type="button" onClick={e => this.SearchingJob(e)} className="btn search-btn">Search</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="">
                        <div className="pb-2">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 px-0"><Checkbox onClick={e => this.selectAllparticipant(e)}>Select all candidates</Checkbox></div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 "><Button onClick={this.inviteallparticipants} icon="mail">Invite Participants</Button></div>
                                    <Divider style={{ margin: '12px 0 10px 0' }}></Divider>
                                </div>
                                {
                                    this.state.profileData && this.state.profileData.length > 0 ? this.state.profileData.slice(this.state.minValue, this.state.maxValue).map((el, index) => (
                                        <div key={index} className="row divider divider-solid mb-1">
                                            <div className="col-lg-3 col-md-1 col-sm-1">
                                                <img style={{ borderRadius: '50px', height: '60px', width: '60px' }} src={el.profilePicture} alt="Profile" />
                                            </div>
                                            <div className="col-lg-5 col-md-5 col-sm-5">
                                                <h6 style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>{el.name}</h6>
                                                <h6>{el.currentLocation}</h6>
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-2 text-center">
                                                <Tooltip title="Invite Participant">
                                                    <Icon onClick={() => this.inviteparticipant(el.emailId)} type="mail" style={{ marginRight: '12px', fontSize: '20px', paddingTop: '20px' }} />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )) : ''
                                }

                            </div>
                            {
                                this.state.profileData.length > 0 ? (
                                    <div>
                                        <Pagination defaultCurrent={1}
                                            current={this.state.currentPage}
                                            defaultPageSize={9}
                                            onChange={this.handleChangePage}
                                            total={this.state.count}
                                        />
                                    </div>
                                ) :
                                    (
                                        <div>

                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </Modal>

        );
    }

}
export default InviteTraineeModal;