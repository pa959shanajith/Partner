import React from 'react';

const StyleSheet_StatsNumber = {
    fontFamily: 'Helvetica Neue',
    letterSpacing: 0,
    color: '#707070',
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '0',
    fontWeight: '900'
}
const StyleSheet_StatsText = {
    color: '#D45895',
    fontSize: '12px',
    fontWeight: '600'
}

const JobStats = (props) => {
    const { details } = props;
    console.log(details);
    return (
        <section className="row">
            <div className="col" >
                <div className="JobStatsWrapper">
                    <p id="applicants_c" style={StyleSheet_StatsNumber}>{details.Applicants ? details.Applicants : '0'}</p>
                    <span style={StyleSheet_StatsText}>Applicants</span>
                </div>
            </div>
            <div className="col" >
                <div className="JobStatsWrapper">
                    <p id="selected_c" style={StyleSheet_StatsNumber}>{details.Selected ? details.Selected : '0'}</p>
                    <span style={StyleSheet_StatsText}>Selected</span>
                </div>

            </div>
            <div className="col" >
                <div className="JobStatsWrapper">
                    <p id="shortlisted_c" style={StyleSheet_StatsNumber}>{details.Shortlisted ? details.Shortlisted : '0'}</p>
                    <span style={StyleSheet_StatsText}>Shortlisted</span>
                </div>

            </div>
            <div className="col" >
                <div className="JobStatsWrapper">
                    <p id="offered_c" style={StyleSheet_StatsNumber}>{details.Offered ? details.Offered : '0'}</p>
                    <span style={StyleSheet_StatsText}>Offered</span>
                </div>

            </div>
        </section>
    )
}

export default JobStats;