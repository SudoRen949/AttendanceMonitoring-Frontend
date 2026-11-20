// Webapp

let previousRecordList = null;
let recordListUnformatted = "";
let randomNumber = 0;
let selectedSection, selectedSubject;

const url = "https://amsys-3.vercel.app/api";

console.log("Hello World");

const QRBox = document.getElementById("qrBox");
const recordsList = document.getElementById("recordsList");
const scheduleList = document.getElementById("scheduleList");
const sectionSelect = document.getElementById("sectionSelect");
const subjectSelect = document.getElementById("subjectSelect");
const sectionSelected = document.getElementById("sectionSelected");
const attendanceRecords = document.getElementById("attendanceRecords");
const studentAttendanceDate = document.getElementById("studentAttendanceDate");

const localDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

studentAttendanceDate.value = localDate;

function updateDateAndTime()
{
	const attendanceDate = document.getElementById("attendanceDate");
	attendanceDate.innerText = new Date().toDateString();
}

async function updateAttendanceRecords()
{
	if ( subjectSelect.value == "null" ) return;
	recordsList.innerHTML = previousRecordList;
	previousRecordList = "";
	const result = await fetch(`${ url }/zAttendance/${ studentAttendanceDate.value }/${ sectionSelect.value }/${ subjectSelect.value }`);
	if ( result.status != 200 ) return;
	const data = await result.text();
	let recordsLength = 0;
	// recordsList.innerHTML = null;
	recordListUnformatted = "";
	if ( Object.keys(data).length > 0 ) {
		const newData = data.split(',');
		for ( var d of newData ) {
			const dat = d.split('-');
			const dl = dat.length;
			previousRecordList += `
				<tr>
					<td>${ dat[0] }</td>
					<td>${ dat[1] }</td>
					<td>${ sectionSelect.value }</td>
					<td>${ subjectSelect.value }</td>
					<td>${ dat[2].split('|')[1] } ${ dat[2].split('|')[2] }</td>
					<td>${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : '--' } ${ ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : '--' }</td>
					<td><span class="${ ( dl > 3 && dat[3] ) ? 'status' : 'status open' }">${ ( dl > 3 && dat[3] ) ? 'Complete' : 'Time-out pending' }</span></td>
				</tr>
			`;
			const 	timedOutData1 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[1] : 'xx',
					timedOutData2 = ( dl > 3 && dat[3] ) ? dat[3].split('|')[2] : 'xx';
			recordListUnformatted += dat[0] + '-' + dat[1] + '-' + sectionSelect.value + '-' + subjectSelect.value + '-' + `Timed In:-` + dat[2].split('|')[1] + ' ' + dat[2].split('|')[2] + '-' + 'Timed Out:-' + timedOutData1 + ' ' + timedOutData2;
			if ( recordsLength != newData.length - 1 ) {
				recordListUnformatted += ',';
			}
			recordsLength++;
		}
	}
	// previousRecordList = recordsList.innerHTML;
	attendanceRecords.innerText = recordsLength;
}

async function updateScheduleList()
{
	scheduleList.innerHTML = "";
	const result = await fetch(`${ url }/${ sectionSelect.value }`);
	if ( result.status != 200 ) return;
	const data = await result.json();
	QRBox.innerHTML = "QR code will appear here";
	if ( data ) {
		randomNumber = parseInt( ( Math.random() % 100 ) * 100000 );
		var d = data;
		Object.entries(d).forEach(([key, value], index) => {
			const schedule = value.split(" | ");
			const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
			let scheduleTime = "";
			for ( var i = 0; i < schedule.length-1; ++i ) {
				const a = schedule[i].split(',');
				let idx = 0;
				// day
				for ( d of days ) {
					if ( a[0] == d[0] || ( idx == 3 && a[0] == `${ days[3][0] }${ days[3][1] }` ) ) {
						scheduleTime += `${ d } `;
						break;
					}
					idx++;
				}
				// time and room
				scheduleTime += `${ a[1] } ${ a[2] } ${ a[3] } ${ a[4] } ${ a[5] } `;
				r = ( a[6] == "NULL" ) ? "" : `Room ${ a[6] }`;
				scheduleTime += r;
				scheduleTime += "<br/>";
			}
			scheduleList.innerHTML += `
				<div class="schedule-item">
					<div><strong>${ key.toUpperCase() }</strong><small>${ schedule[schedule.length-1] }</small></div>
					<div class="schedule-time">${ scheduleTime }</div>
				</div>
			`
		});
	}
}

async function generateQRCode()
{
	if ( recordListUnformatted.length == 0 ) return;
	const response = await fetch(`https://api.tinyqrc.com/v1/qr?data=https://amsys.wasmer.app/?id=${ randomNumber }`);
	if ( response.status != 200 ) return;
	const data = await response.text();
	if ( data.length != 0 ) {
		QRBox.innerHTML = data;
		await fetch(`${ url }/zQRInformation`, {
			method: "PUT",
			headers: { "Content-Type": "text/plain" },
			body: recordListUnformatted
		});
	}
	recordListUnformatted = "";
}

async function changeQRInformation()
{
	const response1 = await fetch(`${ url }/zQRInformation`);
	if ( response1.status != 200 ) return;
	const data1 = await response1.text();
	if ( data1.length > 0 ) {
		recordListUnformatted = '';
		const response2 = await fetch(`${ url }/zQRInformation`, {
			method: "PUT",
			headers: { "Content-Type": "text/plain" },
			body: recordListUnformatted
		});
	}
}

sectionSelect.addEventListener("change", () =>
{
	updateScheduleList();
	sectionSelected.innerText = sectionSelect.value;
});

subjectSelect.addEventListener("change", () =>
{
	changeQRInformation();
	QRBox.innerHTML = "QR code will appear here";
});

studentAttendanceDate.addEventListener("change", () =>
{
	changeQRInformation();
	QRBox.innerHTML = "QR code will appear here";
});

// Shows realtime student record and system date and time.
// it has a delay of 2 seconds to give it a time to populate the firebase database and receive data.
setInterval(() =>
{
	updateDateAndTime();
	updateAttendanceRecords();
	if ( sectionSelect.value != "null" && 
		 subjectSelect.value != "null" && 
		 scheduleList.textContent != "" &&
		 recordsList.textContent != "" )
	{
		generateQRCode();
	}
}, 2000);

// Deletes previous attendance ( necessary to prevent unused data to be stuck )
setInterval(() =>
{
	localDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
	studentAttendanceDate.value = localDate;
	const yesterdayDate = new Date(); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
	const previousDate = new Date(yesterdayDate.getTime() - yesterdayDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
	fetch(`${ url }/zAttendance/${ previousDate }`, { method: "DELETE" })
}, 600000);

