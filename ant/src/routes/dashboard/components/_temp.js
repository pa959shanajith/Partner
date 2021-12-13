<div className="row">
            <div className="col-8">
              <div className="mt-3 col-12 mb-4">
                 { this.state.eventTableShow === false && this.state.showJobDetails === false ?
                    (<JobStats details={this.state.ApplicantStats}></JobStats>) : ''
                 }
            
                {
                    this.state.eventTableShow ?
                    (
                    <div>
                        <EventDetailsCard clickedEventData={this.state.clickedEventData} ></EventDetailsCard>
                        <EnrolledEventsCandidatesListTable data={this.state.listofApplicants} isSubscribed={this.state.isSubscribed} Reload={this.reload} onChangeTable={this.showTable.bind(this)} />
                    </div>
                    ) : (<div></div>)
                }
            
                {this.state.showJobDetails ? (
                  <div>
                    <JobDetailsCard clickedEventData={this.state.jobsData} ></JobDetailsCard>
                    <JobCandidatesList jobData={this.state.jobsData} data={this.state.listofApplicants} Reload={this.reloadList} onChangeTable={this.showDefaultTable.bind(this)} />
                  </div>
                ) : (<div></div>)
                }

                </div>
        
            <div className="mt-3 col-12 mb-4">
                {
                  this.state.table === 'recruiters' ?
                    <RecruitersTable recruitersCount={this.state.SubscribedRecruiters} showRecruiterDetails={this.showRecruiterDetailsView} onChangeTable={this.backToDashboard.bind(this)}></RecruitersTable>
                    : (
                      this.state.table === 'jobs' ?
                        <JobsTable isPartnerAdmin={this.state.partnerAdmin} showDetails={this.showJobDetails.bind(this)} onChangeTable={this.showDefaultTable.bind(this)}></JobsTable>
                        : (
                          this.state.table === 'events' ?
                            <EnrolledEvents arrData={this.state.enrolledEvents} clickEvent={this.eventDetails} editJobCB={this.jobEditRedirect} deleteJobCB={this.jobDelete}></EnrolledEvents>
                            : ("")
                        )
                    )
                }
            </div>
        
            </div>

            <div className="col-4">
              <div className="mt-3 col-12 mb-4">
                <UpcomingEvents showAllEvents={this.state.partnerAdmin} enrollEventList={this.enrollEventCallback.bind(this)}></UpcomingEvents>
              </div>
            </div>

          </div>