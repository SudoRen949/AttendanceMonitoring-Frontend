// Webapp

let randomNumber = 0;
let selectedSchedule = "";
let recordListUnformatted = "";
let selectedSection, selectedSubject;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const url = "https://amsys-3.vercel.app/api";

console.log("BUY ME A NESCAFE! ;D");

const QRBox = document.getElementById("qrBox");
const pinInput = document.getElementById("pinInput");
const pinKeypad = document.getElementById("pinKeypad");
const recordsList = document.getElementById("recordsList");
const scheduleList = document.getElementById("scheduleList");
const pinLoginForm = document.getElementById("pinLoginForm");
const logoutButton = document.getElementById("logoutButton");
const sectionSelect = document.getElementById("sectionSelect");
const subjectSelect = document.getElementById("subjectSelect");
const attendanceDate = document.getElementById("attendanceDate");
const sectionSelected = document.getElementById("sectionSelected");
const attendanceRecordsCount = document.getElementById("attendanceRecords");
const studentAttendanceDate = document.getElementById("studentAttendanceDate");

let localNewDate = new Date();
let localDate = new Date(localNewDate.getTime() - localNewDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

studentAttendanceDate.value = localDate;

// Methods --------------------------------------------------------------------------------------------------------------------

function updateDateAndTime()
{
	// const newDate = new Date();
	// attendanceDate.innerText = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000).toDateString();
	attendanceDate.innerText = new Date().toDateString();
}

function clearThings()
{
	QRBox.innerText = "";
	attendanceRecordsCount.innerText = 0;
	recordsList.innerHTML = "<tr><td>Student attendance record can be viewed here.</td></tr>";
}

async function loadAttendanceList()
{
	if ( sectionSelect.value == "" || subjectSelect.value == "" ) {
		clearThings();
		return;
	}
	// load enrolled students
	const r = await fetch(`${url}/${sectionSelect.value}/zNames`);
	if ( !r.ok ) {
		clearThings();
		return;
	}
	const d = await r.text();
	if ( d.length == 0 ) return;
	const enrolledStudent = d.split(',');
	// load student attendance
	recordListUnformatted = "";
	const result = await fetch(`${url}/zAttendance/${studentAttendanceDate.value}/${sectionSelect.value}/${subjectSelect.value}`);
	if ( !result.ok ) {
		clearThings();
		return;
	}
	const data = await result.text();
	if ( data.length == 0 ) return;
	let previousRecordList = "", recordsLength = 0;
	const newData = data.split(',');
	for ( let es of enrolledStudent ) {
		if ( !newData.includes(es) ) {
			newData.push(es)
		}
	}
	for ( let i = 0; i < letters.length; ++i ) {
		for ( let j = 0; j < newData.length; ++j ) {
			const dat = newData[j].split('-');
			if ( dat[0][0] != letters[i] || previousRecordList.includes(dat[0]) ) continue;
			previousRecordList += `
				<tr>
					<td>${ dat[0] }</td>
					<td>${ dat[1] }</td>
					<td>${ sectionSelect.value }</td>
					<td>${ subjectSelect.value }</td>
					<td>${ ( dat.length > 2 ) ? dat[2].split('|')[1] : "--" } ${ ( dat.length > 2 ) ? dat[2].split('|')[2] : "--" }</td>
					<td class="${ ( dat.length > 2 ) ? "present" : "absent" }">${ ( dat.length > 2 ) ? "&#10004;" : "&#10005;" }</td>
				</tr>
			`;
			const aa = ( dat.length > 2 ) ? dat[2].split('|')[1] : "--";
			const bb = ( dat.length > 2 ) ? dat[2].split('|')[2] : "--";
			if ( recordListUnformatted.length != 0 ) recordListUnformatted += ',';
			recordListUnformatted += dat[0] + '-' + dat[1] + '-' + sectionSelect.value + '-' + subjectSelect.value + '-' + `Time:-` + aa + ' ' + bb;
			recordsLength++;
		}
	}
	recordListUnformatted += `-CPE_${ sectionSelect.value }-` + 'Computer Engineering Office-' + `${ subjectSelect.value }-` + `${ studentAttendanceDate.value.replaceAll('-','/') }-` + `${ selectedSchedule }`;
	recordsList.innerHTML = previousRecordList;
	attendanceRecords.innerText = recordsLength;
}

async function loadSections()
{
	let schedules = "";
	sectionSelected.innerText = ( sectionSelect.value == "" ) ? "N/A" : sectionSelect.value;
	if ( sectionSelect.value == "" ) return;
	const result = await fetch(`${url}/${sectionSelect.value}`);
	if ( !result.ok ) return;
	const data = await result.json();
	const [ month, day, year ] = studentAttendanceDate.value.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	const formattedDate = new Intl.DateTimeFormat("en-PH", { weekday: 'long' }).format(date);
	console.log(studentAttendanceDate.value);
	console.log(formattedDate);
	Object.entries(data).forEach(([key, value]) => {
		if ( key == "zNames" ) return;
		let scheduleTime = "";
		const schedule = value.split(" | ");
		const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		for ( let i = 0; i < schedule.length - 1; ++i ) {
			const scheduleData = schedule[i].split(',');
			for ( let j = 0; j < days.length; ++j ) {
				if ( formattedDate == days[j] ) {
					let _room = ( scheduleData[6] == "NULL" ) ? '' : `Room ${scheduleData[6]}`;
					selectedSchedule = `${scheduleData[1]} ${scheduleData[2]} ${scheduleData[3]} ${scheduleData[4]} ${scheduleData[5]} ` + _room;
				}
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

async function clearRecordedList()
{
	recordListUnformatted = "";
	await fetch(`${ url }/zQRInformation`, {
		method: "PUT",
		headers: { "Content-Type": "text/plain" },
		body: ""
	});
}

// Events --------------------------------------------------------------------------------------------------------------------

sectionSelect.addEventListener("change", async () =>
{
	scheduleList.innerText = "Your class schedule will appear here.";
	recordsList.innerHTML = "<tr><td>Student attendance record can be viewed here.</td></tr>";
	clearRecordedList();
});

subjectSelect.addEventListener("change", async () =>
{
	recordsList.innerHTML = "<tr><td>Student attendance record can be viewed here.</td></tr>";
	clearRecordedList();
});

pinLoginForm.addEventListener("submit", async (e) =>
{
	e.preventDefault();
	const pin = document.getElementById("pinInput").value;
	const errorMessage = document.getElementById("loginError");
	errorMessage.hidden = true;
	try {
		const response = await fetch(`${url}/login`, {
			method: "POST",
			headers: { "Content-Type": "text/plain" },
			body: pin
		});
		if ( !response.ok ) throw new Error("Invalid PIN. Please try again.");
		document.getElementById("loginScreen").hidden = true;
		document.getElementById("dashboard").hidden = false;
	} catch (error) {
		errorMessage.textContent = error.message || "Login failed. Please try again.";
		errorMessage.hidden = false;
	}
});

logoutButton.addEventListener("click", () =>
{
	document.getElementById("loginScreen").hidden = false;
	document.getElementById("dashboard").hidden = true;
	document.getElementById("pinInput").value = '';
	sectionSelect.value = "";
	subjectSelect.value = "";
	recordsList.innerText = "";
	scheduleList.innerText = "";
});

pinInput.addEventListener("focus", () => {
    pinKeypad.hidden = false;
});

pinKeypad.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-key]");
    if (!button) return
    const key = button.dataset.key;
    const maxLength = Number(pinInput.maxLength);
    if (key === "clear") pinInput.value = "";
    else if (key === "backspace") pinInput.value = pinInput.value.slice(0, -1);
    else if (!maxLength || pinInput.value.length < maxLength) pinInput.value += key;
    pinInput.dispatchEvent(new Event("input", { bubbles: true }));
});

// Schedules -----------------------------------------------------------------------------------------------------------------

setInterval(async () =>
{
	loadSections();
	loadAttendanceList();
	// generate qr-code
	if ( recordListUnformatted.length == 0 || QRBox.textContent != "" || attendanceRecordsCount.textContent == "0" ) return;
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
}, 2 * 1000);

setInterval(() =>
{
	localNewDate = new Date()
	localDate = new Date(localNewDate.getTime() - localNewDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
	studentAttendanceDate.value = localDate;
	updateDateAndTime();
}, 5 * 60 * 1000);

// Callbacks --------------------------------------------------------------------------------------------------------------

updateDateAndTime();

