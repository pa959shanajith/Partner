import {saveAs} from 'file-saver';
//import ExcelJS from 'exceljs';
import ExcelJS from 'exceljs/dist/exceljs';

class ExcelUtils {
    exportToExcel(props){
        const {sheetName, columns, data, fileName} = props;
        try{
            const excelFileName = fileName + this.appendTimeStamp(); 
            const excelWorkbook = new ExcelJS.Workbook();
            const worksheet = excelWorkbook.addWorksheet(sheetName ? sheetName : 'sheet1');
            worksheet.columns = columns;
            var row = null;
            for(var i = 0; i < data.length; i++){
                row = worksheet.addRow(data[i]);
                row.alignment = {'wrapText' : true, 'vertical': 'middle', 'horizontal': 'left'};
                row.font = {bold: false}
            }
            excelWorkbook.xlsx.writeBuffer().then((buf) => {
                saveAs(
                    new Blob([buf], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
                    excelFileName
                );
            });
        }
        catch(err){
            console.log(err);
        }

    }
    appendTimeStamp(){
        const d = new Date();
        const dd = d.getDate();
        const mm = d.getMonth()+1;
        const yy = d.getFullYear();
        const hh = d.getHours();
        const mi = d.getMinutes();
        const ss = d.getSeconds();
        const suffix = '_'+ yy +'_'+mm+'_'+dd+'_'+hh+'_'+mi+'_'+ss+'.xlsx';
        return suffix;
        
    }
}
export default ExcelUtils;