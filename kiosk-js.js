// Webapp

let randomNumber = 0;
let recordListUnformatted = "";
let selectedSection, selectedSubject;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const url = "https://amsys-3.vercel.app/api";

console.log("BUY ME A NESCAFE! ;D");

const QRBox = document.getElementById("qrBox");
const recordsList = document.getElementById("recordsList");
const scheduleList = document.getElementById("scheduleList");
const sectionSelect = document.getElementById("sectionSelect");
const subjectSelect = document.getElementById("subjectSelect");
const attendanceDate = document.getElementById("attendanceDate");
const sectionSelected = document.getElementById("sectionSelected");
const attendanceRecordsCount = document.getElementById("attendanceRecords");
const studentAttendanceDate = document.getElementById("studentAttendanceDate");

const localDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

studentAttendanceDate.value = localDate;

// Methods --------------------------------------------------------------------------------------------------------------------

// function updateDateAndTime()
// {
// 	attendanceDate.innerText = new Date().toDateString();
// }

// async function updateAttendanceRecords()
// {
// 	attendanceRecords.innerText = "0";
// 	QRBox.innerHTML = "QR code will appear here";
// 	if ( subjectSelect.value == "null" ) return;
// 	recordsList.innerHTML = previousRecordList;
// 	previousRecordList = "";
// 	const result = await fetch(`${ url }/zAttendance/${ studentAttendanceDate.value }/${ sectionSelect.value }/${ subjectSelect.value }`);
// 	if ( result.status != 200 ) return;
// 	const data = await result.text();
// 	recordListUnformatted = "";
// 	let recordsLength = 0;
// 	if ( Object.keys(data).length > 0 ) {
// 		const newData = data.split(',');
// 		for ( let i = 0; i < letters.length; ++i ) {
// 			for ( let j = 0; j < newData.length; ++j ) {
// 				const dat = newData[j].split('-');
// 				const dl = dat.length;
// 				if ( dat[0][0] != letters[i] || previousRecordList.includes(dat[0]) ) continue;
// 				previousRecordList += `
// 					<tr>
// 						<td>${ dat[0] }</td>
// 						<td>${ dat[1] }</td>
// 						<td>${ sectionSelect.value }</td>
// 						<td>${ subjectSelect.value }</td>
// 						<td>${ dat[2].split('|')[1] } ${ dat[2].split('|')[2] }</td>
// 						<td>${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : '--' } ${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : '--' }</td>
// 						<td><span class="${ ( dl > 3 && dat[3] ) ? 'status' : 'status open' }">${ ( dl > 3 && dat[3] ) ? 'Complete' : 'Time-out pending' }</span></td>
// 					</tr>
// 				`;
// 				const timedOutData1 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : 'xx', timedOutData2 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : 'xx';
// 				if ( recordListUnformatted.length > 0 ) {
// 					recordListUnformatted += ',';
// 				}
// 				recordListUnformatted += dat[0] + '-' + dat[1] + '-' + sectionSelect.value + '-' + subjectSelect.value + '-' + `Timed In:-` + dat[2].split('|')[1] + ' ' + dat[2].split('|')[2] + '-' + 'Timed Out:-' + timedOutData1 + ' ' + timedOutData2;
// 				recordsLength++;
// 			}
// 		}
// 	}
// 	attendanceRecords.innerText = recordsLength;
// }

// async function updateScheduleList()
// {
// 	scheduleList.innerHTML = "";
// 	const result = await fetch(`${ url }/${ sectionSelect.value }`);
// 	if ( result.status != 200 ) {
// 		QRBox.innerHTML = "QR code will appear here";
// 		return;
// 	}
// 	const data = await result.json();
// 	QRBox.innerHTML = "QR code will appear here";
// 	if ( data ) {
// 		randomNumber = parseInt( ( Math.random() % 100 ) * 100000 );
// 		var d = data;
// 		Object.entries(d).forEach(([key, value], index) => {
// 			const schedule = value.split(" | ");
// 			const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
// 			let scheduleTime = "";
// 			for ( var i = 0; i < schedule.length-1; ++i ) {
// 				const a = schedule[i].split(',');
// 				let idx = 0;
// 				// day
// 				for ( d of days ) {
// 					if ( a[0] == d[0] || ( idx == 3 && a[0] == `${ days[3][0] }${ days[3][1] }` ) ) {
// 						scheduleTime += `${ d } `;
// 						break;
// 					}
// 					idx++;
// 				}
// 				// time and room
// 				scheduleTime += `${ a[1] } ${ a[2] } ${ a[3] } ${ a[4] } ${ a[5] } `;
// 				r = ( a[6] == "NULL" ) ? "" : `Room ${ a[6] }`;
// 				scheduleTime += r;
// 				scheduleTime += "<br/>";
// 			}
// 			scheduleList.innerHTML += `
// 				<div class="schedule-item">
// 					<div><strong>${ key.toUpperCase() }</strong><small>${ schedule[schedule.length-1] }</small></div>
// 					<div class="schedule-time">${ scheduleTime }</div>
// 				</div>
// 			`
// 		});
// 	}
// }

// async function generateQRCode()
// {
// 	if ( recordListUnformatted.length == 0 ) return;
// 	const response = await fetch(`https://api.tinyqrc.com/v1/qr?data=https://amsys.wasmer.app/?id=${ randomNumber }`);
// 	if ( response.status != 200 ) return;
// 	const data = await response.text();
// 	if ( data.length != 0 ) {
// 		QRBox.innerHTML = data;
// 		await fetch(`${ url }/zQRInformation`, {
// 			method: "PUT",
// 			headers: { "Content-Type": "text/plain" },
// 			body: recordListUnformatted
// 		});
// 	}
// }

// async function changeQRInformation()
// {
// 	const response = await fetch(`${ url }/zQRInformation`);
// 	if ( response.status != 200 ) return;
// 	const data = await response.text();
// 	if ( data.length > 0 ) {
// 		recordListUnformatted = "";
// 		await fetch(`${ url }/zQRInformation`, {
// 			method: "PUT",
// 			headers: { "Content-Type": "text/plain" },
// 			body: recordListUnformatted
// 		});
// 	}
// }

function updateDateAndTime()
{
	attendanceDate.innerText = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toDateString();
}

async function loadAttendanceList()
{
	if ( sectionSelect.value == "" && subjectSelect.value == "" ) return;
	// load enrolled students
	let enrolledStudents = "", student;
	const r = await fetch(`${url}/${sectionSelect.value}/zNames`);
	if ( !r.ok ) return;
	const d = await r.text();
	if ( d.length == 0 ) return;
	const enrolledStudent = d.split(',');
	for ( int i = 0; i < enrolledStudent.length; ++i ) {
		student = enrolledStudent[i].split('-');
	}
	// display student attendance list first
	recordListUnformatted = "";
	let previousRecordList = "", recordsLength = 0;
	const result = await fetch(`${url}/zAttendance/${studentAttendanceDate.value}/${sectionSelect.value}/${subjectSelect.value}`);
	if ( !result.ok ) return;
	const data = await result.text();
	if ( data.length == 0 ) return;
	const newData = data.split(',');
	for ( let i = 0; i < letters.length; ++i ) {
		for ( let j = 0; j < newData.length; ++j ) {
			const dat = newData[j].split('-');
			const dl = dat.length;
			if ( dat[0][0] != letters[i] || previousRecordList.includes(dat[0]) ) continue;
			previousRecordList += `
				<tr>
					<td>${ dat[0] }</td>
					<td>${ dat[1] }</td>
					<td>${ sectionSelect.value }</td>
					<td>${ subjectSelect.value }</td>
					<td>${ dat[2].split('|')[1] } ${ dat[2].split('|')[2] }</td>
					<td>${ ( dat[0] == student[0] ) ? "&#10003;" : "&#10005;" }</td>
				</tr>
			`;
			// <td>${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : '--' } ${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : '--' }</td>
			// <td><span class="${ ( dl > 3 && dat[3] ) ? 'status' : 'status open' }">${ ( dl > 3 && dat[3] ) ? 'Complete' : 'Time-out pending' }</span></td>
			// const timedOutData1 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : 'xx', timedOutData2 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : 'xx';
			if ( recordListUnformatted.length != 0 ) recordListUnformatted += ',';
			recordListUnformatted += dat[0] + '-' + dat[1] + '-' + sectionSelect.value + '-' + subjectSelect.value + '-' + `Time:-` + dat[2].split('|')[1] + ' ' + dat[2].split('|')[2];
			recordsLength++;
		}
	}
	recordsList.innerHTML = previousRecordList;
	attendanceRecords.innerText = recordsLength;
}

async function loadSections()
{
	// scheduleList.innerHTML = "";
	// subjectSelect.value = "null";
	// QRBox.innerHTML = "QR code will appear here";
	let schedules = "";
	sectionSelected.innerText = ( sectionSelect.value == "" ) ? "N/A" : sectionSelect.value;
	if ( sectionSelect.value == "" ) return;
	const result = await fetch(`${url}/${sectionSelect.value}`);
	if ( !result.ok ) return;
	const data = await result.json();
	Object.entries(data).forEach(([key, value]) => {
		let scheduleTime = "";
		const schedule = value.split(" | ");
		const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		for ( let i = 0; i < schedule.length - 1; ++i ) {
			const scheduleData = schedule[i].split(',');
			for ( let j = 0; j < days.length; ++j ) {
				if ( scheduleData[0] == days[j][0] || ( j == 3 && scheduleData[0] == `${days[j][0]}${days[j][1]}` ) ) {
					scheduleTime += `${days[j]}`;
					break;
				}
			}
			let room = ( scheduleData[6] == "NULL" ) ? '' : `Room ${scheduleData[6]}`;
			scheduleTime += ` ${scheduleData[1]} ${scheduleData[2]} ${scheduleData[3]} ${scheduleData[4]} ${scheduleData[5]} ` + room + "<br/>";
		}
		schedules += `
			<div class="schedule-item">
				<div><strong>${key.toUpperCase()}</strong><small>${schedule[schedule.length-1]}</small></div>
				<div class="schedule-time">${scheduleTime}</div>
			</div>
		`;
	});
	scheduleList.innerHTML = schedules;
}

// Events --------------------------------------------------------------------------------------------------------------------

sectionSelect.addEventListener("change", async () =>
{
	scheduleList.innerHTML = "";
});

subjectSelect.addEventListener("change", async () =>
{
	attendanceRecordsCount.innerText = 0;
	// generate qr-code
	if ( recordListUnformatted.length == 0 ) return;
	randomNumber = parseInt( ( Math.random() % 100 ) * 100000 );
	const response = await fetch(`https://api.tinyqrc.com/v1/qr?data=https://amsys.wasmer.app/?id=${randomNumber}`);
	if ( response.status != 200 ) return;
	const QRData = await response.text();
	if ( QRData.length == 0 ) return;
	QRBox.innerHTML = QRData;
	await fetch(`${ url }/zQRInformation`, {
		method: "PUT",
		headers: { "Content-Type": "text/plain" },
		body: recordListUnformatted
	});
});

// Schedules -----------------------------------------------------------------------------------------------------------------

setInterval(() =>
{
	loadSections();
	loadAttendanceList();
}, 2000);

setInterval(() =>
{
	localDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
	studentAttendanceDate.value = localDate;
	updateDateAndTime();
}, 30 * 1000);

// setInterval(() =>
// {
// 	updateDateAndTime();
// 	localDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
// 	studentAttendanceDate.value = localDate;
// 	const yesterdayDate = new Date(); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
// 	const previousDate = new Date(yesterdayDate.getTime() - yesterdayDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
// 	fetch(`${ url }/zAttendance/${ previousDate }`, { method: "DELETE" })
// }, 600000);

// Callbacks --------------------------------------------------------------------------------------------------------------

updateDateAndTime();

