export default {
	exportExcel(header,data, file_name, comment){
		let excel = '<table>';
		//设置表头
		let header_str = ""
		let header_arr = [];
		if (comment) {
			header_str += "<tr><th colspan='"+header.length+"'>"+comment+"</td></tr>"
		}
		for (let i of header) {
			header_arr.push('<th>' + i + '</th>')
		}
		header_str += "<tr>" + header_arr.join('') + '</tr>';
		let body_str = '';
		let body_arr = [];
		for (let i of data) {
			for (let j of i) {
				body_arr.push('<td><span>&nbsp;</span>' + (j === null ? '' : j) + '</td>')
			}
			body_str += '<tr>' + body_arr.join('') + '</tr>';
			body_arr = [];
		}

		excel += header_str + body_str + "</table>";

		let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
		excelFile += '; charset=UTF-8">';
		excelFile += "<head>";
		excelFile += "<!--[if gte mso 9]>";
		excelFile += "<xml>";
		excelFile += "<x:ExcelWorkbook>";
		excelFile += "<x:ExcelWorksheets>";
		excelFile += "<x:ExcelWorksheet>";
		excelFile += "<x:Name>";
		excelFile += "{worksheet}";
		excelFile += "</x:Name>";
		excelFile += "<x:WorksheetOptions>";
		excelFile += "<x:DisplayGridlines/>";
		excelFile += "</x:WorksheetOptions>";
		excelFile += "</x:ExcelWorksheet>";
		excelFile += "</x:ExcelWorksheets>";
		excelFile += "</x:ExcelWorkbook>";
		excelFile += "</xml>";
		excelFile += "<![endif]-->";
		excelFile += "</head>";
		excelFile += "<body>";
		excelFile += excel;
		excelFile += "</body>";
		excelFile += "</html>";


		let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

		let link = document.createElement("a");
		link.href = uri;

		link.style = "visibility:hidden";
		link.download = (file_name ? file_name : (new Date).getTime()) + ".xls";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},
	exportExcelOther(header,data, file_name){
		let excel = '<table>';
		// 设置表头
		let header_str = ""
		let header_arr = [];
		// for (let i of header) {
		// 	header_arr.push('<th>' + i + '</th>')
		// }
		// header.forEach(element => {
		// 	console.log(element)
		// });
		// var obj = {'0':'a','1':'b','2':'c'};
 
		Object.keys(header).forEach(function(key){
		
			// console.log(key,header[key]);
			header_arr.push('<th>' + (header[key] === null ? '' : header[key]) + '</th>')
		
		});
		console.log(header_arr, "header_arr")
		header_str += "<tr>" + header_arr.join('') + '</tr>';
		let body_str = '';
		let body_arr = [];
		console.log(data, "datall")
		for (let i of data) {
			Object.keys(i).forEach(function(key){
				body_arr.push('<td><span>&nbsp;</span>' + (i[key] === null ? '' : i[key]) + '</td>')
			});
			body_str += '<tr>' + body_arr.join('') + '</tr>';
			body_arr = [];
		}
		excel += body_str + "</table>";
		let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
		excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
		excelFile += '; charset=UTF-8">';
		excelFile += "<head>";
		excelFile += "<!--[if gte mso 9]>";
		excelFile += "<xml>";
		excelFile += "<x:ExcelWorkbook>";
		excelFile += "<x:ExcelWorksheets>";
		excelFile += "<x:ExcelWorksheet>";
		excelFile += "<x:Name>";
		excelFile += "{worksheet}";
		excelFile += "</x:Name>";
		excelFile += "<x:WorksheetOptions>";
		excelFile += "<x:DisplayGridlines/>";
		excelFile += "</x:WorksheetOptions>";
		excelFile += "</x:ExcelWorksheet>";
		excelFile += "</x:ExcelWorksheets>";
		excelFile += "</x:ExcelWorkbook>";
		excelFile += "</xml>";
		excelFile += "<![endif]-->";
		excelFile += "</head>";
		excelFile += "<body>";
		excelFile += excel;
		excelFile += "</body>";
		excelFile += "</html>";


		let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

		let link = document.createElement("a");
		link.href = uri;

		link.style = "visibility:hidden";
		link.download = (file_name ? file_name : (new Date).getTime()) + ".xls";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}