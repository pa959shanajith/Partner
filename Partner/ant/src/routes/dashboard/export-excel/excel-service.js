import React from 'react'
import { Icon,Tooltip } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const filterArray = (data) => {
    var arr = []
    const userEmail = localStorage.getItem('email');
    if(data.length > 0){
        data.forEach((el) => {
            if(userEmail === el.profileSubmittedBy){
                arr.push({
                    applicantName:el.applicantName,
                    applicantEmailId:el.applicantEmailId,
                    applicantPhone:el.applicantPhone,
                    applicantExpectedCTC:el.applicantExpectedCTC,
                    applicantExperience:el.applicantExperience,
                    applicantNoticePeriod:el.applicantNoticePeriod,
                    resumeUplodedUrl:el.resumeUplodedUrl,
                    status:el.status[0]
                })
            }
           
        });
    }
    return arr; 
}
 const ExportCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        // console.log(csvData,' its csvData');
        // console.log(fileName,' its fileName');

        var wscols = [
            {wch:25},
            {wch:30},
            {wch:20},
            {wch:20},
            {wch:15},
            {wch:15},
            {wch:110},
            {wch:15}
        ];
        var filterData = filterArray(csvData);
        var ws = XLSX.utils.json_to_sheet(filterData);
        // console.log(ws,' its ws');
        filterData.forEach((el,i) => {
                XLSX.utils.cell_set_hyperlink(ws[`G${i+2}`],el.resumeUplodedUrl,'Click to Download Resume');
                
                
        })
        // ws['A1'].s ={bgcolor:'Black'}; 
        ws['!cols'] = wscols;
        
        var wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        var excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        var data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        // <Button variant="warning" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>

        <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
        <Tooltip title="Download Candidates List"><Icon onClick={(e) => exportToCSV(csvData,fileName)} type="download" /></Tooltip>
    </span>
    )
}
export default ExportCSV;