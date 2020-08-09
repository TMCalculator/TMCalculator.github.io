console.log("Page opened @ "+new Date());
var global = {};
var subCampList = [], campList = [];

global.timeFormat = "";
var pageHighMe = true;
var alerted = false;
var recalced = false;
//var campForm, subCampForm, varek, result, reffy, st2, alertString;

//Color page depending on user's website height.
var initH = window.innerHeight;
document.querySelector('body').style.height = initH+"px";

function pint(str){return parseInt(str);} //Shortening Parse Int function

//Process all radio choices and put it into variables... [?]
var forms = window.document.forms;
function radioBasicAll(){ //function to draw next radio buttons, depending on choice in the game
	forms = window.document.forms; //Update forms...
	for ( let j = 0; j < forms.length; j++ )
	{
		var rad = forms[j];
		var name = forms[j].name.replace('Form', '');	
		var form = document.querySelectorAll('form')[j];
		
		for ( var i = 0; i < rad.length; i++ ) {
			if ( form[i].checked === true )
			{
				global[name] = form[i].value;
			}
		}

		
		if ( forms[j].name === "gameTypeForm" )
		{
			campaignDraw(global.gameType); //Draw choices for campaigns...
			subCampaignDraw(null); //Do not draw subcampaign choice...
			global.SubCampaignType = undefined; //Change this to empty, so it doesn't take category from different group if you were switching games.
		}
	}
	attachListener(); //function that allows interactions on click...
}
radioBasicAll(); //Apply function immediately...

function radioCampaign(){ //draws subcategories depending on current category (campaign)
	campForm = window.document.forms[2]; //Category form... 
	for ( var i = 0; i < campForm.length; i++ ) {
		if ( campForm[i].checked === true )
		{
			global.CampaignType = campForm[i].value;
		}
	}
	subCampaignDraw(global.CampaignType);	
}

function radioFormat(){
	var formatForm;
	if ( window.document.forms[4].name === "formatTypeForm" ) 
	{
		formatForm = window.document.forms[4]; //Category form... 
	}
	else { formatForm = window.document.forms[3]; }
	
	//for ( var i = 0; i < formatForm.length-1; i++ ) {
	for ( var i = 0; i < formatForm.length; i++ ) {
		if ( formatForm[i].checked === true )
		{
			global.formatType = formatForm[i].value;
			global.timeFormat = formatForm[i].nextSibling.textContent.trim(); //hhmmssxx
			if ( global.timeFormat === "hh" ) { global.timeFormat = "hhhmm'ss\"xx"; }
		}
	}
}

function radioSubCampaign(){
	subCampForm = window.document.forms[3]; //SubCategory form... 
	for ( var i = 0; i < subCampForm.length; i++ ) {
		if ( subCampForm[i].checked === true )
		{
			global.SubCampaignType = subCampForm[i].value;
		}
	}
	//drawTable(subCampForm[i].value);
}

function toggleMode(input){
	if ( input === true ){
		document.querySelector('#tableDrawButton').style.visibility = "";
		document.querySelector('#Cbutton').style.visibility = "hidden";
		document.querySelector('#Cbutton').style.float = "right";
	}
	else if ( input === false ){
		document.querySelector('#tableDrawButton').style.visibility = "hidden";
		document.querySelector('#Cbutton').style.visibility = "";
		document.querySelector('#Cbutton').style.float = "left";
	}
	else { console.log("Wrong input in toggleMode function"); }
}

var radiotm2 = document.querySelectorAll('.radiotm2');
var tm2guidelink = "https://www.speedrun.com/tm2stadium/guide/ktact";
for ( let i = 0; i < radiotm2.length; i++ )
{
	radiotm2[i].addEventListener('click', function(){ location.href = tm2guidelink; });
}

var inputs = document.querySelectorAll('input');
function attachListener(){
	inputs = document.querySelectorAll('input');
	for ( let i = 0; i < inputs.length; i++ )
	{
		if ( inputs[i].name === "gametype" && inputs[i].eventedTB !== true ) {
			if ( inputs[i].id === "customtracks" ) {
				inputs[i].addEventListener('click', function(){ showTracklistBox(); } );
				}
			else {
				inputs[i].addEventListener('click', function(){ hideTracklistBox(); } );
			}
			inputs[i].eventedTB = true;
		}
		if ( inputs[i].evented !== true )
		{
			if ( inputs[i].value === "realtime" )
			{
				inputs[i].addEventListener('change', function(){ toggleMode(true); });
			}
			else if ( inputs[i].value === "separate" )
			{
				inputs[i].addEventListener('change', function(){ toggleMode(false); });
			}
				
			if ( inputs[i].name !== "format" ) 
			{
				inputs[i].addEventListener('change', function(){ radioBasicAll(); });
			}
			else {
				inputs[i].addEventListener('change', function(){ radioFormat(); });
			}
			inputs[i].evented = true;
		}
		else {
			console.log("Else from line 121");
		}

	}
}

//From chosen form in document, it puts value of Radio choice, into variable
function radioProcess(formData, variable){
	var rad = window.document.forms[formData];
	var prev = null;
	for (var i = 0; i < rad.length; i++) {
		rad[i].addEventListener('change', function() {
		(prev) ? prev.value : null;     
		if (this !== prev) {
			prev = this;
			varek = variable+"Prev";
			varek = prev;
		}
		variable = this.value;
		});
	}
}
//radioProcess("gameTypeForm", gameType)
//document.gameTypeForm.gametype;

function toggleTextBox(status){
	if ( status === "on" ) { document.querySelector('#separateMode').style.display = "block"; } 
	else if ( status === "off" ) {
		document.querySelector('#separateMode').style.display = "none";
		localStorage.setItem('customTracklistMode', true);
	} 
}

function textSave1(){
	global.separator = document.querySelector('#separator').value;
}

function textSave2(){
	global.timeZone = document.querySelector('#timeZone').value;
}

function textSave3(){
	global.customTracklist = document.querySelector('#customTracklist').value;
}


/*
tableData = [ [title1, title2, title3], [resultA1, resultA2, resultA3], [resultB1, resultB2, resultB3] ]
tableData = [ ["title1", "title2", "title3"], ["resultA1", "resultA2", "resultA3"], ["resultB1", "resultB2", "resultB3"] ]
*/
function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
	
	table.id = "scoreTable";
	table.cellPadding = "7";
    table.cellSpacing = "2";
    table.border = "2";
    table.setAttribute('style', 'float:left');
    table.appendChild(tableBody);
    //document.body.appendChild(table);
    document.querySelector('#fillMe').innerHTML = table.outerHTML;
	
	/*
	var tableLength = document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1)').childElementCount
	for ( let i = 1; i < tableLength; i++)
	{
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child('+i+') > td:nth-child(3)').style = "text-align: right"
	}
	*/
}

//createTable(dataOfPlayers);

document.querySelector('#separator').onkeyup = textSave1();
document.querySelector('#timeZone').onkeyup = textSave2();
document.querySelector('#customTracklist').onkeyup = textSave3();

document.querySelector('#separateMode').style.display = "none"; //Hide the textArea, it will be revealed later, when option is chosen.

if ( document.querySelector('#calculatorMode > form:nth-child(1) > input:nth-child(2)').checked === true ) { toggleTextBox("on"); }
else { toggleTextBox("off"); }
document.querySelector('#calculatorMode > form:nth-child(1) > input:nth-child(2)').addEventListener('click', function(){ toggleTextBox("on"); });
document.querySelector('#calculatorMode > form:nth-child(1) > input:nth-child(3)').addEventListener('click', function(){ toggleTextBox("off"); });

function showTracklistBox(){
	//document.querySelector('#customList').style = "visibility:visible; float:left;";
	document.querySelector('#customList').style = "visibility:visible;";
	//document.querySelector('#customTracklist').value = localStorage.getItem('customTracklist')
}

function hideTracklistBox(){
	//document.querySelector('#customList').style = "visibility:hidden; float:right;";
	document.querySelector('#customList').style = "visibility:hidden;";
}

function campaigns(type){ //type = gameType
	if ( type === "tmr" ) { campList = ["Training", "Summer2020", "Autumn2020", "Winter2021", "Spring2021", "Summer2021", "Autumn2021", "Winter2022", "Spring2022", "Summer2022", "Autumn2022", "Winter2023", "Spring2023", "Summer2023", "Autumn2023", "Winter2024", "Spring2024", "Summer2024", "Autumn2024"]; }
	//if ( type === "tmr" ) { campList = ["Training", "2020", "2021", /* "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030" */ ]}
	if ( type === "turbo" ) { campList = ["Canyon Grand Drift", "Valley Down & Dirty", "Rollercoaster Lagoon", "International Stadium", "All Environments"]; }
	if ( type === "wii" ) { campList = ["Race", "Stadium", "Island", "Desert", "Snow", "Rally", "Coast"]; }
	if ( type === "turbods" ) { campList = ["Race", "Stadium", "Island", "Snow", "Coast", "StadiumPractice"]; }
	if ( type === "ds" ) { campList = ["Race", "Stadium", "Desert", "Rally", "Stadium Practice"]; }
	if ( type === "tmnf" ) { campList = ["White", "Green", "Blue", "Red", "Black", "All Flags", "All Flags (No E5)", "All Flags (1-Lap)"]; }
	if ( type === "tmuf" ) { campList = ["Race", "Platform", "Stunts", "Puzzle", "StarTrack", "Stadium", "Island", "Desert", "Rally", "Bay", "Coast", "Snow", "All Tracks", "Start (A tracks)"]; }
	if ( type === "tmu" ) { campList = ["Stadium", "Island", "Desert", "Rally", "Bay", "Coast", "Snow", "All Tracks", "Start (A tracks)"]; }
	if ( type === "tmn" ) { campList = ["Beginner", "Advanced", "Expert", "Pro", "Bonus", "All Tracks"]; }
	if ( type === "tmse" ) { campList = ["Race", "Platform", "Puzzle", "Stunts", "Extreme Race"]; }
	if ( type === "tmo" ) { campList = ["Race", "Platform", "Puzzle", "Stunts", "Survival", "SuperSurvival"]; }
	if ( type === "other" ) { campList = [true]; }
}

function subcampaign(type){ //type = campType
	var c = type;
	if ( global.gameType === "tmr" ) {
		subCampList = [true];
		//if ( c === "2020" ) { subCampList = ["Summer", "Autumn"] }
		//if ( c === "Training" ) { subCampList = [true] };
		//if ( c !== "2020" && c !== "Training" ) { subCampList = ["Winter", "Spring", "Summer", "Autumn"] }
	}
	
	if ( global.gameType === "turbo" ) //applies to all campaigns
		{ subCampList = ["White", "Green", "Blue", "Red", "Black", "All Flags"]; }

	if ( global.gameType === "ds" || global.gameType === "turbods" || global.gameType === "wii" ) {
		if ( c === "Race" )
		{ subCampList = ["Practice", "Easy", "Medium", "Hard", "Extreme", "Bonus", "All Tracks"]; }
		
		if ( c !== "Race" )
		{ subCampList = [true]; } 
	}
	if ( global.gameType === "tmo" ) {
		if ( c === "Survival" || c === "Super Survival" )
			{ subCampList = ["(category not supported)"]; } 
		else { subCampList = [true]; } 
	}
		
	if ( global.gameType === "tmuf" ) {
		if ( c === "Star Track" || c === "Race" )
		{ subCampList = ["White", "Green", "Blue", "Red", "Black", "All Flags"]; }

		if ( c === "Puzzle" )
		{ subCampList = ["White", "Green", "Blue", "Red", "All Flags"]; }
	
		if ( c !== "Platform" && c !== "Stunts" && c !== "Puzzle" && c !== "Race" && c !== "Star Track" )
		{ subCampList = ["United", "Star Track"]; }
	
		if ( c === "Platform" || c === "Stunts" )
		{ subCampList = [true]; }
	}		
	if ( c === null ) { subCampList = [true]; }
}

var trackList = {
	tmr : {
		// training : "Training 01,Training 02,Training 03,Training 04,Training 05,Training 06,Training 07,Training 08,Training 09,Training 10,Training 11,Training 12,Training 13,Training 14,Training 15,Training 16,Training 17,Training 18,Training 19,Training 20,Training 21,Training 22,Training 23,Training 24,Training 25",
		training : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		summer2020 : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		autumn2020 : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		winter2021 : 
		"01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		2020 : {
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2021 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2022 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2023 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2024 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2025 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2026 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2027 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2028 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2029 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
		2030 : {
			spring : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			summer : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			autumn : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
			winter : "01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
		},
	},
	turbo : {
        canyon : {
            white : "#01,#02,#03,#04,#05,#06,#07,#08,#09,#10",
            green : "#41,#42,#43,#44,#45,#46,#47,#48,#49,#50",
            blue : "#81,#82,#83,#84,#85,#86,#87,#88,#89,#90",
            red : "#121,#122,#123,#124,#125,#126,#127,#128,#129,#130",
            black : "#161,#162,#163,#164,#165,#166,#167,#168,#169,#170", 
            all : "#01,#02,#03,#04,#05,#06,#07,#08,#09,#10,#41,#42,#43,#44,#45,#46,#47,#48,#49,#50,#81,#82,#83,#84,#85,#86,#87,#88,#89,#90,#121,#122,#123,#124,#125,#126,#127,#128,#129,#130,#161,#162,#163,#164,#165,#166,#167,#168,#169,#170", 	
        },
        valley : {
            white : "#11,#12,#13,#14,#15,#16,#17,#18,#19,#20",
            green : "#51,#52,#53,#54,#55,#56,#57,#58,#59,#60",
            blue : "#91,#92,#93,#94,#95,#96,#97,#98,#99,#100",
            red : "#131,#132,#133,#134,#135,#136,#137,#138,#139,#140",
            black : "#171,#172,#173,#174,#175,#176,#177,#178,#179,#180", 
            all : "#11,#12,#13,#14,#15,#16,#17,#18,#19,#20,#51,#52,#53,#54,#55,#56,#57,#58,#59,#60,#91,#92,#93,#94,#95,#96,#97,#98,#99,#100,#131,#132,#133,#134,#135,#136,#137,#138,#139,#140,#171,#172,#173,#174,#175,#176,#177,#178,#179,#180",	
        },
		//lagoon
        rollercoaster : {
            white : "#21,#22,#23,#24,#25,#26,#27,#28,#29,#30",
            green : "#61,#62,#63,#64,#65,#66,#67,#68,#69,#70",
            blue : "#101,#102,#103,#104,#105,#106,#107,#108,#109,#110",
            red : "#141,#142,#143,#144,#145,#146,#147,#148,#149,#150",
            black : "#181,#182,#183,#184,#185,#186,#187,#188,#189,#190", 
            all : "#21,#22,#23,#24,#25,#26,#27,#28,#29,#30,#61,#62,#63,#64,#65,#66,#67,#68,#69,#70,#101,#102,#103,#104,#105,#106,#107,#108,#109,#110,#141,#142,#143,#144,#145,#146,#147,#148,#149,#150,#181,#182,#183,#184,#185,#186,#187,#188,#189,#190",	
        },
		//stadium
        international : {
            white : "#31,#32,#33,#34,#35,#36,#37,#38,#39,#40",
            green : "#71,#72,#73,#74,#75,#76,#77,#78,#79,#80",
            blue : "#111,#112,#113,#114,#115,#116,#117,#118,#119,#120",
            red : "#151,#152,#153,#154,#155,#156,#157,#158,#159,#160",
            black : "#191,#192,#193,#194,#195,#196,#197,#198,#199,#200", 
            all : "#31,#32,#33,#34,#35,#36,#37,#38,#39,#40,#71,#72,#73,#74,#75,#76,#77,#78,#79,#80,#111,#112,#113,#114,#115,#116,#117,#118,#119,#120,#151,#152,#153,#154,#155,#156,#157,#158,#159,#160,#191,#192,#193,#194,#195,#196,#197,#198,#199,#200", 
        },
        all : {
            white : "#01,#02,#03,#04,#05,#06,#07,#08,#09,#10,#11,#12,#13,#14,#15,#16,#17,#18,#19,#20,#21,#22,#23,#24,#25,#26,#27,#28,#29,#30,#31,#32,#33,#34,#35,#36,#37,#38,#39,#40",
            green : "#41,#42,#43,#44,#45,#46,#47,#48,#49,#50,#51,#52,#53,#54,#55,#56,#57,#58,#59,#60,#61,#62,#63,#64,#65,#66,#67,#68,#69,#70,#71,#72,#73,#74,#75,#76,#77,#78,#79,#80",
            blue : "#81,#82,#83,#84,#85,#86,#87,#88,#89,#90,#91,#92,#93,#94,#95,#96,#97,#98,#99,#100,#101,#102,#103,#104,#105,#106,#107,#108,#109,#110,#111,#112,#113,#114,#115,#116,#117,#118,#119,#120",
            red : "#121,#122,#123,#124,#125,#126,#127,#128,#129,#130,#131,#132,#133,#134,#135,#136,#137,#138,#139,#140,#141,#142,#143,#144,#145,#146,#147,#148,#149,#150,#151,#152,#153,#154,#155,#156,#157,#158,#159,#160",
            black : "#161,#162,#163,#164,#165,#166,#167,#168,#169,#170,#171,#172,#173,#174,#175,#176,#177,#178,#179,#180,#181,#182,#183,#184,#185,#186,#187,#188,#189,#190,#191,#192,#193,#194,#195,#196,#197,#198,#199,#200", 
            all : "#01,#02,#03,#04,#05,#06,#07,#08,#09,#10,#11,#12,#13,#14,#15,#16,#17,#18,#19,#20,#21,#22,#23,#24,#25,#26,#27,#28,#29,#30,#31,#32,#33,#34,#35,#36,#37,#38,#39,#40,#41,#42,#43,#44,#45,#46,#47,#48,#49,#50,#51,#52,#53,#54,#55,#56,#57,#58,#59,#60,#61,#62,#63,#64,#65,#66,#67,#68,#69,#70,#71,#72,#73,#74,#75,#76,#77,#78,#79,#80,#81,#82,#83,#84,#85,#86,#87,#88,#89,#90,#91,#92,#93,#94,#95,#96,#97,#98,#99,#100,#101,#102,#103,#104,#105,#106,#107,#108,#109,#110,#111,#112,#113,#114,#115,#116,#117,#118,#119,#120,#121,#122,#123,#124,#125,#126,#127,#128,#129,#130,#131,#132,#133,#134,#135,#136,#137,#138,#139,#140,#141,#142,#143,#144,#145,#146,#147,#148,#149,#150,#151,#152,#153,#154,#155,#156,#157,#158,#159,#160,#161,#162,#163,#164,#165,#166,#167,#168,#169,#170,#171,#172,#173,#174,#175,#176,#177,#178,#179,#180,#181,#182,#183,#184,#185,#186,#187,#188,#189,#190,#191,#192,#193,#194,#195,#196,#197,#198,#199,#200",
        },
	},
	wii : {
		race : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Island E1,Island E2,Island E3,Island E4,Island E5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Island F1,Island F2,Island F3,Island F4,Island F5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Island E1,Island E2,Island E3,Island E4,Island E5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Island F1,Island F2,Island F3,Island F4,Island F5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
		},
		puzzle : "Puzzle A1,Puzzle A2,Puzzle A3,Puzzle A4,Puzzle A5,Puzzle B1,Puzzle B2,Puzzle B3,Puzzle B4,Puzzle B5,Puzzle C1,Puzzle C2,Puzzle C3,Puzzle C4,Puzzle C5,Puzzle D1,Puzzle D2,Puzzle D3,Puzzle D4,Puzzle D5,Puzzle E1",
		
		platform : "Platform A1,Platform A2,Platform A3,Platform A4,Platform A5,Platform B1,Platform B2,Platform B3,Platform B4,Platform B5,Platform C1,Platform C2,Platform C3,Platform C4,Platform C5,Platform D1,Platform D2,Platform D3,Platform D4,Platform D5,Platform E1",
		
		stadium : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
		},
		island : {
			practice : "Island A1,Island A2,Island A3,Island A4,Island A5",
			easy : "Island B1,Island B2,Island B3,Island B4,Island B5",
			medium : "Island C1,Island C2,Island C3,Island C4,Island C5",
			hard : "Island D1,Island D2,Island D3,Island D4,Island D5",
			extreme : "Island E1,Island E2,Island E3,Island E4,Island E5",
			bonus : "Island F1,Island F2,Island F3,Island F4,Island F5",
			all : "Island A1,Island A2,Island A3,Island A4,Island A5,Island B1,Island B2,Island B3,Island B4,Island B5,Island C1,Island C2,Island C3,Island C4,Island C5,Island D1,Island D2,Island D3,Island D4,Island D5,Island E1,Island E2,Island E3,Island E4,Island E5,Island F1,Island F2,Island F3,Island F4,Island F5",
		},
		desert : {
			practice : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5",
			easy : "Desert B1,Desert B2,Desert B3,Desert B4,Desert B5",
			medium : "Desert C1,Desert C2,Desert C3,Desert C4,Desert C5",
			hard : "Desert D1,Desert D2,Desert D3,Desert D4,Desert D5",
			extreme : "Desert E1,Desert E2,Desert E3,Desert E4,Desert E5",
			bonus : "Desert F1,Desert F2,Desert F3,Desert F4,Desert F5",
			all : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5",
		},
		snow : {
			practice : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5",
			easy : "Snow B1,Snow B2,Snow B3,Snow B4,Snow B5",
			medium : "Snow C1,Snow C2,Snow C3,Snow C4,Snow C5",
			hard : "Snow D1,Snow D2,Snow D3,Snow D4,Snow D5",
			extreme : "Snow E1,Snow E2,Snow E3,Snow E4,Snow E5",
			bonus : "Snow F1,Snow F2,Snow F3,Snow F4,Snow F5",
			all : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5",
		},
		rally : {
			practice : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5",
			easy : "Rally B1,Rally B2,Rally B3,Rally B4,Rally B5",
			medium : "Rally C1,Rally C2,Rally C3,Rally C4,Rally C5",
			hard : "Rally D1,Rally D2,Rally D3,Rally D4,Rally D5",
			extreme : "Rally E1,Rally E2,Rally E3,Rally E4,Rally E5",
			bonus : "Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
			all : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
		},
		coast : {
			practice : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
			easy : "Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
			medium : "Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
			hard : "Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
			extreme : "Coast E1,Coast E2,Coast E3,Coast E4,Coast E5",
			bonus : "Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
			all : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
		},
		
	},
	turbods : {
		race : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Island E1,Island E2,Island E3,Island E4,Island E5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Island F1,Island F2,Island F3,Island F4,Island F5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Island E1,Island E2,Island E3,Island E4,Island E5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Island F1,Island F2,Island F3,Island F4,Island F5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
		},
		puzzle : "Puzzle A1,Puzzle A2,Puzzle A3,Puzzle A4,Puzzle A5,Puzzle B1,Puzzle B2,Puzzle B3,Puzzle B4,Puzzle B5,Puzzle C1,Puzzle C2,Puzzle C3,Puzzle C4,Puzzle C5,Puzzle D1,Puzzle D2,Puzzle D3,Puzzle D4,Puzzle D5,Puzzle E1",
		
		platform : "Platform A1,Platform A2,Platform A3,Platform A4,Platform A5,Platform B1,Platform B2,Platform B3,Platform B4,Platform B5,Platform C1,Platform C2,Platform C3,Platform C4,Platform C5,Platform D1,Platform D2,Platform D3,Platform D4,Platform D5,Platform E1",
		
		stadium : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
		},
		island : {
			practice : "Island A1,Island A2,Island A3,Island A4,Island A5",
			easy : "Island B1,Island B2,Island B3,Island B4,Island B5",
			medium : "Island C1,Island C2,Island C3,Island C4,Island C5",
			hard : "Island D1,Island D2,Island D3,Island D4,Island D5",
			extreme : "Island E1,Island E2,Island E3,Island E4,Island E5",
			bonus : "Island F1,Island F2,Island F3,Island F4,Island F5",
			all : "Island A1,Island A2,Island A3,Island A4,Island A5,Island B1,Island B2,Island B3,Island B4,Island B5,Island C1,Island C2,Island C3,Island C4,Island C5,Island D1,Island D2,Island D3,Island D4,Island D5,Island E1,Island E2,Island E3,Island E4,Island E5,Island F1,Island F2,Island F3,Island F4,Island F5",
		},
		snow : {
			practice : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5",
			easy : "Snow B1,Snow B2,Snow B3,Snow B4,Snow B5",
			medium : "Snow C1,Snow C2,Snow C3,Snow C4,Snow C5",
			hard : "Snow D1,Snow D2,Snow D3,Snow D4,Snow D5",
			extreme : "Snow E1,Snow E2,Snow E3,Snow E4,Snow E5",
			bonus : "Snow F1,Snow F2,Snow F3,Snow F4,Snow F5",
			all : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Snow E1,Snow E2,Snow E3,Snow E4,Snow E5,Snow F1,Snow F2,Snow F3,Snow F4,Snow F5",
		},
		coast : {
			practice : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
			easy : "Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
			medium : "Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
			hard : "Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
			extreme : "Coast E1,Coast E2,Coast E3,Coast E4,Coast E5",
			bonus : "Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
			all : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Coast E1,Coast E2,Coast E3,Coast E4,Coast E5,Coast F1,Coast F2,Coast F3,Coast F4,Coast F5",
		},
		stadiumpractice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
	},
	ds : {
		race : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
		},
		puzzle : "Puzzle A1,Puzzle A2,Puzzle A3,Puzzle A4,Puzzle A5,Puzzle B1,Puzzle B2,Puzzle B3,Puzzle B4,Puzzle B5,Puzzle C1,Puzzle C2,Puzzle C3,Puzzle C4,Puzzle C5,Puzzle D1,Puzzle D2,Puzzle D3,Puzzle D4,Puzzle D5,Puzzle E1,Puzzle E2,Puzzle E3",
		
		platform : "Platform A1,Platform A2,Platform A3,Platform A4,Platform A5,Platform B1,Platform B2,Platform B3,Platform B4,Platform B5,Platform C1,Platform C2,Platform C3,Platform C4,Platform C5,Platform D1,Platform D2,Platform D3,Platform D4,Platform D5,Platform E1,Platform E2,Platform E3",
		
		stadium : {
			practice : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
			easy : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5",
			medium : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5",
			hard : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5",
			extreme : "Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5",
			bonus : "Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Stadium E1,Stadium E2,Stadium E3,Stadium E4,Stadium E5,Stadium F1,Stadium F2,Stadium F3,Stadium F4,Stadium F5",
		},
		desert : {
			practice : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5",
			easy : "Desert B1,Desert B2,Desert B3,Desert B4,Desert B5",
			medium : "Desert C1,Desert C2,Desert C3,Desert C4,Desert C5",
			hard : "Desert D1,Desert D2,Desert D3,Desert D4,Desert D5",
			extreme : "Desert E1,Desert E2,Desert E3,Desert E4,Desert E5",
			bonus : "Desert F1,Desert F2,Desert F3,Desert F4,Desert F5",
			all : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Desert E1,Desert E2,Desert E3,Desert E4,Desert E5,Desert F1,Desert F2,Desert F3,Desert F4,Desert F5",
		},
		rally : {
			practice : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5",
			easy : "Rally B1,Rally B2,Rally B3,Rally B4,Rally B5",
			medium : "Rally C1,Rally C2,Rally C3,Rally C4,Rally C5",
			hard : "Rally D1,Rally D2,Rally D3,Rally D4,Rally D5",
			extreme : "Rally E1,Rally E2,Rally E3,Rally E4,Rally E5",
			bonus : "Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
			all : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Rally E1,Rally E2,Rally E3,Rally E4,Rally E5,Rally F1,Rally F2,Rally F3,Rally F4,Rally F5",
		},
	},
	tmnf : {
		white : "A01 Race,A02 Race,A03 Race,A04 Acrobatic,A05 Race,A06 Obstacle,A07 Race,A08 Endurance,A09 Race,A10 Acrobatic,A11 Race,A12 Speed,A13 Race,A14 Race,A15 Speed",
		green : "B01 Race,B02 Race,B03 Race,B04 Acrobatic,B05 Race,B06 Obstacle,B07 Race,B08 Endurance,B09 Acrobatic,B10 Speed,B11 Race,B12 Race,B13 Obstacle,B14 Speed,B15 Race",
		blue : "C01 Race,C02 Race,C03 Acrobatic,C04 Race,C05 Endurance,C06 Speed,C07 Race,C08 Obstacle,C09 Race,C10 Acrobatic,C11 Race,C12 Obstacle,C13 Race,C14 Endurance,C15 Speed",
		red : "D01 Endurance,D02 Race,D03 Acrobatic,D04 Race,D05 Race,D06 Obstacle,D07 Race,D08 Speed,D09 Obstacle,D10 Race,D11 Acrobatic,D12 Speed,D13 Race,D14 Endurance,D15 Endurance",
		black : "E01 Obstacle,E02 Endurance,E03 Endurance,E04 Obstacle,E05 Endurance",
		all : "A01 Race,A02 Race,A03 Race,A04 Acrobatic,A05 Race,A06 Obstacle,A07 Race,A08 Endurance,A09 Race,A10 Acrobatic,A11 Race,A12 Speed,A13 Race,A14 Race,A15 Speed,B01 Race,B02 Race,B03 Race,B04 Acrobatic,B05 Race,B06 Obstacle,B07 Race,B08 Endurance,B09 Acrobatic,B10 Speed,B11 Race,B12 Race,B13 Obstacle,B14 Speed,B15 Race,C01 Race,C02 Race,C03 Acrobatic,C04 Race,C05 Endurance,C06 Speed,C07 Race,C08 Obstacle,C09 Race,C10 Acrobatic,C11 Race,C12 Obstacle,C13 Race,C14 Endurance,C15 Speed,D01 Endurance,D02 Race,D03 Acrobatic,D04 Race,D05 Race,D06 Obstacle,D07 Race,D08 Speed,D09 Obstacle,D10 Race,D11 Acrobatic,D12 Speed,D13 Race,D14 Endurance,D15 Endurance,E01 Obstacle,E02 Endurance,E03 Endurance,E04 Obstacle,E05 Endurance",
		allnoe05 : "A01 Race,A02 Race,A03 Race,A04 Acrobatic,A05 Race,A06 Obstacle,A07 Race,A08 Endurance,A09 Race,A10 Acrobatic,A11 Race,A12 Speed,A13 Race,A14 Race,A15 Speed,B01 Race,B02 Race,B03 Race,B04 Acrobatic,B05 Race,B06 Obstacle,B07 Race,B08 Endurance,B09 Acrobatic,B10 Speed,B11 Race,B12 Race,B13 Obstacle,B14 Speed,B15 Race,C01 Race,C02 Race,C03 Acrobatic,C04 Race,C05 Endurance,C06 Speed,C07 Race,C08 Obstacle,C09 Race,C10 Acrobatic,C11 Race,C12 Obstacle,C13 Race,C14 Endurance,C15 Speed,D01 Endurance,D02 Race,D03 Acrobatic,D04 Race,D05 Race,D06 Obstacle,D07 Race,D08 Speed,D09 Obstacle,D10 Race,D11 Acrobatic,D12 Speed,D13 Race,D14 Endurance,D15 Endurance,E01 Obstacle,E02 Endurance,E03 Endurance,E04 Obstacle",
		all1lap : "A01 Race,A02 Race,A03 Race,A04 Acrobatic,A05 Race,A06 Obstacle,A07 Race,A08 (1 Lap),A09 Race,A10 Acrobatic,A11 Race,A12 Speed,A13 Race,A14 Race,A15 Speed,B01 Race,B02 Race,B03 Race,B04 Acrobatic,B05 Race,B06 Obstacle,B07 Race,B08 (1 Lap),B09 Acrobatic,B10 Speed,B11 Race,B12 Race,B13 Obstacle,B14 Speed,B15 Race,C01 Race,C02 Race,C03 Acrobatic,C04 Race,C05 (1 Lap),C06 Speed,C07 Race,C08 Obstacle,C09 Race,C10 Acrobatic,C11 Race,C12 Obstacle,C13 Race,C14 (1 Lap),C15 Speed,D01 (1 Lap),D02 Race,D03 Acrobatic,D04 Race,D05 Race,D06 Obstacle,D07 Race,D08 Speed,D09 Obstacle,D10 Race,D11 Acrobatic,D12 Speed,D13 Race,D14 (1 Lap),D15 (1 Lap),E01 Obstacle,E02 (1 Lap),E03 (1 Lap),E04 Obstacle,E05 (1 Lap)",
	},
	tmuf : {
		race : {
			white : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Bay A1,Bay A2,Bay A3,Bay A4,Bay A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5",
			green : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Bay B1,Bay B2,Bay B3,Bay B4,Bay B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5",
			blue : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Bay C1,Bay C2,Bay C3,Bay C4,Bay C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5",
			red : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Bay D1,Bay D2,Bay D3,Bay D4,Bay D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5",
			black : "Stadium E,Island E,Desert E,Rally E,Bay E,Coast E,Snow E",
			all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Island A1,Island A2,Island A3,Island A4,Island A5,Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Bay A1,Bay A2,Bay A3,Bay A4,Bay A5,Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Island B1,Island B2,Island B3,Island B4,Island B5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Bay B1,Bay B2,Bay B3,Bay B4,Bay B5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Island C1,Island C2,Island C3,Island C4,Island C5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Bay C1,Bay C2,Bay C3,Bay C4,Bay C5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Island D1,Island D2,Island D3,Island D4,Island D5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Bay D1,Bay D2,Bay D3,Bay D4,Bay D5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Stadium E,Island E,Desert E,Rally E,Bay E,Coast E,Snow E",
		},
		
		platform : "Platform A1,Platform A2,Platform A3,Platform A4,Platform A5,Platform B1,Platform B2,Platform B3,Platform B4,Platform B5,Platform C1,Platform C2,Platform C3,Platform C4,Platform C5,Platform D1,Platform D2,Platform D3,Platform D4,Platform D5,Platform E",
		
		stunts : "Stunt A1,Stunt A2,Stunt A3,Stunt A4,Stunt A5,Stunt B1,Stunt B2,Stunt B3,Stunt B4,Stunt B5,Stunt C1,Stunt C2,Stunt C3,Stunt C4,Stunt C5,Stunt D1,Stunt D2,Stunt D3,Stunt D4,Stunt D5,Stunt E1",
		
		puzzle : {
			white : "Puzzle A1,Puzzle A2,Puzzle A3,Puzzle A4,Puzzle A5",
			green : "Puzzle B1,Puzzle B2,Puzzle B3,Puzzle B4,Puzzle B5",
			blue : "Puzzle C1,Puzzle C2,Puzzle C3,Puzzle C4,Puzzle C5",
			red : "Puzzle D1,Puzzle D2,Puzzle D3,Puzzle D4,Puzzle D5",	
			all : "Puzzle A1,Puzzle A2,Puzzle A3,Puzzle A4,Puzzle A5,Puzzle B1,Puzzle B2,Puzzle B3,Puzzle B4,Puzzle B5,Puzzle C1,Puzzle C2,Puzzle C3,Puzzle C4,Puzzle C5,Puzzle D1,Puzzle D2,Puzzle D3,Puzzle D4,Puzzle D5,Puzzle E",
		},
		
		startrack : {
			white : "StarStadium A1,StarStadium A2,StarStadium A3,StarStadium A4,StarStadium A5,StarIsland A1,StarIsland A2,StarIsland A3,StarIsland A4,StarIsland A5,StarDesert A1,StarDesert A2,StarDesert A3,StarDesert A4,StarDesert A5,StarRally A1,StarRally A2,StarRally A3,StarRally A4,StarRally A5,StarBay A1,StarBay A2,StarBay A3,StarBay A4,StarBay A5,StarCoast A1,StarCoast A2,StarCoast A3,StarCoast A4,StarCoast A5,StarSnow A1,StarSnow A2,StarSnow A3,StarSnow A4,StarSnow A5",
			green : "StarStadium B1,StarStadium B2,StarStadium B3,StarStadium B4,StarStadium B5,StarIsland B1,StarIsland B2,StarIsland B3,StarIsland B4,StarIsland B5,StarDesert B1,StarDesert B2,StarDesert B3,StarDesert B4,StarDesert B5,StarRally B1,StarRally B2,StarRally B3,StarRally B4,StarRally B5,StarBay B1,StarBay B2,StarBay B3,StarBay B4,StarBay B5,StarCoast B1,StarCoast B2,StarCoast B3,StarCoast B4,StarCoast B5,StarSnow B1,StarSnow B2,StarSnow B3,StarSnow B4,StarSnow B5",
			blue : "StarStadium C1,StarStadium C2,StarStadium C3,StarStadium C4,StarStadium C5,StarIsland C1,StarIsland C2,StarIsland C3,StarIsland C4,StarIsland C5,StarDesert C1,StarDesert C2,StarDesert C3,StarDesert C4,StarDesert C5,StarRally C1,StarRally C2,StarRally C3,StarRally C4,StarRally C5,StarBay C1,StarBay C2,StarBay C3,StarBay C4,StarBay C5,StarCoast C1,StarCoast C2,StarCoast C3,StarCoast C4,StarCoast C5,StarSnow C1,StarSnow C2,StarSnow C3,StarSnow C4,StarSnow C5",
			red : "StarStadium D1,StarStadium D2,StarStadium D3,StarStadium D4,StarStadium D5,StarIsland D1,StarIsland D2,StarIsland D3,StarIsland D4,StarIsland D5,StarDesert D1,StarDesert D2,StarDesert D3,StarDesert D4,StarDesert D5,StarRally D1,StarRally D2,StarRally D3,StarRally D4,StarRally D5,StarBay D1,StarBay D2,StarBay D3,StarBay D4,StarBay D5,StarCoast D1,StarCoast D2,StarCoast D3,StarCoast D4,StarCoast D5,StarSnow D1,StarSnow D2,StarSnow D3,StarSnow D4,StarSnow D5",
			black : "StarStadium E,StarIsland E,StarDesert E,StarRally E,StarBay E,StarCoast E,StarSnow E",
			all : "StarStadium A1,StarStadium A2,StarStadium A3,StarStadium A4,StarStadium A5,StarIsland A1,StarIsland A2,StarIsland A3,StarIsland A4,StarIsland A5,StarDesert A1,StarDesert A2,StarDesert A3,StarDesert A4,StarDesert A5,StarRally A1,StarRally A2,StarRally A3,StarRally A4,StarRally A5,StarBay A1,StarBay A2,StarBay A3,StarBay A4,StarBay A5,StarCoast A1,StarCoast A2,StarCoast A3,StarCoast A4,StarCoast A5,StarSnow A1,StarSnow A2,StarSnow A3,StarSnow A4,StarSnow A5,StarStadium B1,StarStadium B2,StarStadium B3,StarStadium B4,StarStadium B5,StarIsland B1,StarIsland B2,StarIsland B3,StarIsland B4,StarIsland B5,StarDesert B1,StarDesert B2,StarDesert B3,StarDesert B4,StarDesert B5,StarRally B1,StarRally B2,StarRally B3,StarRally B4,StarRally B5,StarBay B1,StarBay B2,StarBay B3,StarBay B4,StarBay B5,StarCoast B1,StarCoast B2,StarCoast B3,StarCoast B4,StarCoast B5,StarSnow B1,StarSnow B2,StarSnow B3,StarSnow B4,StarSnow B5,StarStadium C1,StarStadium C2,StarStadium C3,StarStadium C4,StarStadium C5,StarIsland C1,StarIsland C2,StarIsland C3,StarIsland C4,StarIsland C5,StarDesert C1,StarDesert C2,StarDesert C3,StarDesert C4,StarDesert C5,StarRally C1,StarRally C2,StarRally C3,StarRally C4,StarRally C5,StarBay C1,StarBay C2,StarBay C3,StarBay C4,StarBay C5,StarCoast C1,StarCoast C2,StarCoast C3,StarCoast C4,StarCoast C5,StarSnow C1,StarSnow C2,StarSnow C3,StarSnow C4,StarSnow C5,StarStadium D1,StarStadium D2,StarStadium D3,StarStadium D4,StarStadium D5,StarIsland D1,StarIsland D2,StarIsland D3,StarIsland D4,StarIsland D5,StarDesert D1,StarDesert D2,StarDesert D3,StarDesert D4,StarDesert D5,StarRally D1,StarRally D2,StarRally D3,StarRally D4,StarRally D5,StarBay D1,StarBay D2,StarBay D3,StarBay D4,StarBay D5,StarCoast D1,StarCoast D2,StarCoast D3,StarCoast D4,StarCoast D5,StarSnow D1,StarSnow D2,StarSnow D3,StarSnow D4,StarSnow D5,StarStadium E,StarIsland E,StarDesert E,StarRally E,StarBay E,StarCoast E,StarSnow E",
		},
		
		stadium : {
			united : {
				white : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
				green : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5",
				blue : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5",
				red : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5",
				all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Stadium E",
			},
			star : "StarStadium A1,StarStadium A2,StarStadium A3,StarStadium A4,StarStadium A5,StarStadium B1,StarStadium B2,StarStadium B3,StarStadium B4,StarStadium B5,StarStadium C1,StarStadium C2,StarStadium C3,StarStadium C4,StarStadium C5,StarStadium D1,StarStadium D2,StarStadium D3,StarStadium D4,StarStadium D5,StarStadium E",
		},
		island : {
			united : {
				white : "Island A1,Island A2,Island A3,Island A4,Island A5",
				green : "Island B1,Island B2,Island B3,Island B4,Island B5",
				blue : "Island C1,Island C2,Island C3,Island C4,Island C5",
				red : "Island D1,Island D2,Island D3,Island D4,Island D5",
				all : "Island A1,Island A2,Island A3,Island A4,Island A5,Island B1,Island B2,Island B3,Island B4,Island B5,Island C1,Island C2,Island C3,Island C4,Island C5,Island D1,Island D2,Island D3,Island D4,Island D5,Island E",
			},
			star : "StarIsland A1,StarIsland A2,StarIsland A3,StarIsland A4,StarIsland A5,StarIsland B1,StarIsland B2,StarIsland B3,StarIsland B4,StarIsland B5,StarIsland C1,StarIsland C2,StarIsland C3,StarIsland C4,StarIsland C5,StarIsland D1,StarIsland D2,StarIsland D3,StarIsland D4,StarIsland D5,StarIsland E",
		},
		desert : {
			united : {
				white : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5",
				green : "Desert B1,Desert B2,Desert B3,Desert B4,Desert B5",
				blue : "Desert C1,Desert C2,Desert C3,Desert C4,Desert C5",
				red : "Desert D1,Desert D2,Desert D3,Desert D4,Desert D5",
				all : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Desert E",
			},
			star : "StarDesert A1,StarDesert A2,StarDesert A3,StarDesert A4,StarDesert A5,StarDesert B1,StarDesert B2,StarDesert B3,StarDesert B4,StarDesert B5,StarDesert C1,StarDesert C2,StarDesert C3,StarDesert C4,StarDesert C5,StarDesert D1,StarDesert D2,StarDesert D3,StarDesert D4,StarDesert D5,StarDesert E",
		},
		rally : {
			united : {
				white : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5",
				green : "Rally B1,Rally B2,Rally B3,Rally B4,Rally B5",
				blue : "Rally C1,Rally C2,Rally C3,Rally C4,Rally C5",
				red : "Rally D1,Rally D2,Rally D3,Rally D4,Rally D5",
				all : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Rally E",
			},
			star : "StarRally A1,StarRally A2,StarRally A3,StarRally A4,StarRally A5,StarRally B1,StarRally B2,StarRally B3,StarRally B4,StarRally B5,StarRally C1,StarRally C2,StarRally C3,StarRally C4,StarRally C5,StarRally D1,StarRally D2,StarRally D3,StarRally D4,StarRally D5,StarRally E",
		},
		bay : {
			united : {
				white : "Bay A1,Bay A2,Bay A3,Bay A4,Bay A5",
				green : "Bay B1,Bay B2,Bay B3,Bay B4,Bay B5",
				blue : "Bay C1,Bay C2,Bay C3,Bay C4,Bay C5",
				red : "Bay D1,Bay D2,Bay D3,Bay D4,Bay D5",
				all : "Bay A1,Bay A2,Bay A3,Bay A4,Bay A5,Bay B1,Bay B2,Bay B3,Bay B4,Bay B5,Bay C1,Bay C2,Bay C3,Bay C4,Bay C5,Bay D1,Bay D2,Bay D3,Bay D4,Bay D5,Bay E",
			},
			star : "StarBay A1,StarBay A2,StarBay A3,StarBay A4,StarBay A5,StarBay B1,StarBay B2,StarBay B3,StarBay B4,StarBay B5,StarBay C1,StarBay C2,StarBay C3,StarBay C4,StarBay C5,StarBay D1,StarBay D2,StarBay D3,StarBay D4,StarBay D5,StarBay E",
		},
		coast : {
			united : {
				white : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
				green : "Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
				blue : "Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
				red : "Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
				all : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Coast E",
			},
			star : "StarCoast A1,StarCoast A2,StarCoast A3,StarCoast A4,StarCoast A5,StarCoast B1,StarCoast B2,StarCoast B3,StarCoast B4,StarCoast B5,StarCoast C1,StarCoast C2,StarCoast C3,StarCoast C4,StarCoast C5,StarCoast D1,StarCoast D2,StarCoast D3,StarCoast D4,StarCoast D5,StarCoast E",
		},
		snow : {
			united : {
				white : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5",
				green : "Snow B1,Snow B2,Snow B3,Snow B4,Snow B5",
				blue : "Snow C1,Snow C2,Snow C3,Snow C4,Snow C5",
				red : "Snow D1,Snow D2,Snow D3,Snow D4,Snow D5",
				all : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Snow E",
				},
			star :  "StarSnow A1,StarSnow A2,StarSnow A3,StarSnow A4,StarSnow A5,StarSnow B1,StarSnow B2,StarSnow B3,StarSnow B4,StarSnow B5,StarSnow C1,StarSnow C2,StarSnow C3,StarSnow C4,StarSnow C5,StarSnow D1,StarSnow D2,StarSnow D3,StarSnow D4,StarSnow D5,StarSnow E",
		},
	},
	tmu : {
        stadium : {
            white : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5",
            green : "Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5",
            blue : "Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5",
            red : "Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5",
            all : "Stadium A1,Stadium A2,Stadium A3,Stadium A4,Stadium A5,Stadium B1,Stadium B2,Stadium B3,Stadium B4,Stadium B5,Stadium C1,Stadium C2,Stadium C3,Stadium C4,Stadium C5,Stadium D1,Stadium D2,Stadium D3,Stadium D4,Stadium D5,Stadium E",
        },
        island : {
            white : "Island A1,Island A2,Island A3,Island A4,Island A5",
            green : "Island B1,Island B2,Island B3,Island B4,Island B5",
            blue : "Island C1,Island C2,Island C3,Island C4,Island C5",
            red : "Island D1,Island D2,Island D3,Island D4,Island D5",
            all : "Island A1,Island A2,Island A3,Island A4,Island A5,Island B1,Island B2,Island B3,Island B4,Island B5,Island C1,Island C2,Island C3,Island C4,Island C5,Island D1,Island D2,Island D3,Island D4,Island D5,Island E",
        },
        desert : {
            white : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5",
            green : "Desert B1,Desert B2,Desert B3,Desert B4,Desert B5",
            blue : "Desert C1,Desert C2,Desert C3,Desert C4,Desert C5",
            red : "Desert D1,Desert D2,Desert D3,Desert D4,Desert D5",
            all : "Desert A1,Desert A2,Desert A3,Desert A4,Desert A5,Desert B1,Desert B2,Desert B3,Desert B4,Desert B5,Desert C1,Desert C2,Desert C3,Desert C4,Desert C5,Desert D1,Desert D2,Desert D3,Desert D4,Desert D5,Desert E",
        },
        rally : {
            white : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5",
            green : "Rally B1,Rally B2,Rally B3,Rally B4,Rally B5",
            blue : "Rally C1,Rally C2,Rally C3,Rally C4,Rally C5",
            red : "Rally D1,Rally D2,Rally D3,Rally D4,Rally D5",
            all : "Rally A1,Rally A2,Rally A3,Rally A4,Rally A5,Rally B1,Rally B2,Rally B3,Rally B4,Rally B5,Rally C1,Rally C2,Rally C3,Rally C4,Rally C5,Rally D1,Rally D2,Rally D3,Rally D4,Rally D5,Rally E",
        },
        bay : {
            white : "Bay A1,Bay A2,Bay A3,Bay A4,Bay A5",
            green : "Bay B1,Bay B2,Bay B3,Bay B4,Bay B5",
            blue : "Bay C1,Bay C2,Bay C3,Bay C4,Bay C5",
            red : "Bay D1,Bay D2,Bay D3,Bay D4,Bay D5",
            all : "Bay A1,Bay A2,Bay A3,Bay A4,Bay A5,Bay B1,Bay B2,Bay B3,Bay B4,Bay B5,Bay C1,Bay C2,Bay C3,Bay C4,Bay C5,Bay D1,Bay D2,Bay D3,Bay D4,Bay D5,Bay E",
        },
        coast : {
            white : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5",
            green : "Coast B1,Coast B2,Coast B3,Coast B4,Coast B5",
            blue : "Coast C1,Coast C2,Coast C3,Coast C4,Coast C5",
            red : "Coast D1,Coast D2,Coast D3,Coast D4,Coast D5",
            all : "Coast A1,Coast A2,Coast A3,Coast A4,Coast A5,Coast B1,Coast B2,Coast B3,Coast B4,Coast B5,Coast C1,Coast C2,Coast C3,Coast C4,Coast C5,Coast D1,Coast D2,Coast D3,Coast D4,Coast D5,Coast E",
        },

        snow : {
            white : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5",
            green : "Snow B1,Snow B2,Snow B3,Snow B4,Snow B5",
            blue : "Snow C1,Snow C2,Snow C3,Snow C4,Snow C5",
            red : "Snow D1,Snow D2,Snow D3,Snow D4,Snow D5",
            all : "Snow A1,Snow A2,Snow A3,Snow A4,Snow A5,Snow B1,Snow B2,Snow B3,Snow B4,Snow B5,Snow C1,Snow C2,Snow C3,Snow C4,Snow C5,Snow D1,Snow D2,Snow D3,Snow D4,Snow D5,Snow E",
        },
    },
	tmse : {
		race : {
			holidays : "SkidOrDie,CarPark,ParadiseIsland,NightFlight,GoodMorning",
			shopping : "Downtown,CrossOver,FollowTheLeader,TrickyTrack,OnTheRoofAgain",
			excursion : "QuietRide,GrandPrix,Snake,JumpOnBrakes,Village",
			surfing : "SpeedWave,Antigrav,BeautifulDay,Midnight,RampRage",
			nightlife:  "HighStreet,TunnelEffect,SubUrbs,Deviation,BuildingRider",
			evasion : "Magnitude,GrandPrix2,HomeRun,AquaSchemes,NightRider",
			pointbreak : "Orbital,HappyBay,GrandPrix30",
			all : "SkidOrDie,CarPark,ParadiseIsland,NightFlight,GoodMorning,Downtown,CrossOver,FollowTheLeader,TrickyTrack,OnTheRoofAgain,QuietRide,GrandPrix,Snake,JumpOnBrakes,Village,SpeedWave,Antigrav,BeautifulDay,Midnight,RampRage,HighStreet,TunnelEffect,SubUrbs,Deviation,BuildingRider,Magnitude,GrandPrix2,HomeRun,AquaSchemes,NightRider,Orbital,HappyBay,GrandPrix30",
		},
		platform : {
			lagoon : "AirControl,OverTheTop,OldSchool,CityAirport,Gravity",
			docks : "DockOfTheBay,UrbanStyle,TheCage,NiceShot,LittleWalk",
			cliffs : "Stop!,FullTurtle,StepByStep,Spiral,MissingBridge",
			peak : "LandingArea,DoubleLoop,TrialTime,HitTheRamp,ThinkForward",
			summit : "TamTam,Goal!,Vertigo",
			all : "AirControl,OverTheTop,OldSchool,CityAirport,Gravity,DockOfTheBay,UrbanStyle,TheCage,NiceShot,LittleWalk,Stop!,FullTurtle,StepByStep,Spiral,MissingBridge,LandingArea,DoubleLoop,TrialTime,HitTheRamp,ThinkForward,TamTam,Goal!,Vertigo"
		}, 
		puzzle : {
			brainteaser : "BayStarter,BuildingsAhead,Ideal265,TightBudget,DoubleJump",
			question : "TiltedCurves,Trident,TheRightSpeed,SmoothSlopes,DeadendCheckpoints",
			riddle : "4Roads,Tangram,HighsAndLows,Undulate,Tangram2",
			brainstorm : "MeteorCrash,MiniG3,Tunneling,HarborRamps,AimForTheTop",
			enigma : "BigBowl,WorkAround,DrunkenTunnel,TheLeftSpeed,PillarOfSummer",
			mystery : "PlotHoles,SimpleLine,WaterPillar,StrangeMotif,RabbitHoles",
			koan : "FinalSpeed,MixedLine,PyramidOfDoom",
			all : "BayStarter,BuildingsAhead,Ideal265,TightBudget,DoubleJump,TiltedCurves,Trident,TheRightSpeed,SmoothSlopes,DeadendCheckpoints,4Roads,Tangram,HighsAndLows,Undulate,Tangram2,MeteorCrash,MiniG3,Tunneling,HarborRamps,AimForTheTop,BigBowl,WorkAround,DrunkenTunnel,TheLeftSpeed,PillarOfSummer,PlotHoles,SimpleLine,WaterPillar,StrangeMotif,RabbitHoles,FinalSpeed,MixedLine,PyramidOfDoom",
		},
		stunts : {
			jumprope : "WarmUp,Rock'n'Roll,ChaosTheory",
			trampoline : "StuntPark,Aquaplanning,BoatRide",
			bungiejumping : "RocketJump,WatchTheStep,FlipFlop",
			parachute : "HeadOrTails,Medallion,SpinHell",
			atmosphericreentry : "Backyard,Satellite,GiantPinball",
			all : 			"WarmUp,Rock'n'Roll,ChaosTheory,StuntPark,Aquaplanning,BoatRide,RocketJump,WatchTheStep,FlipFlop,HeadOrTails,Medallion,SpinHell,Backyard,Satellite,GiantPinball",
		},
		extremerace : {
			serie1 : "XRace01,XRace02,XRace03",
			serie2 : "XRace04,XRace05,XRace06",
			serie3 : "XRace07,XRace08,XRace09",
			all : "XRace01,XRace02,XRace03,XRace04,XRace05,XRace06,XRace07,XRace08,XRace09",
		},
		crazy : {
			carnival : "SmallRing,SecretCaves,TrainingCircuit,StraightAhead,ForestJump,UpAndDown,DangerousDescent",
			circus : "AerialLights,ChaosArea,FiveRows,HighTide,BouncyAlley",
			all : "SmallRing,SecretCaves,TrainingCircuit,StraightAhead,ForestJump,UpAndDown,DangerousDescent,AerialLights,ChaosArea,FiveRows,HighTide,BouncyAlley",
		},
		bonus : {
			microlaps : "CentralPark,Crazy8,DarkRuin,NightRound,SeeYouSoon,ShoppingCenter,SicilianArena,TwoMountains,VulcanRing", 
			microtracks : "EmperorRoof,Kangourou,OutOfTheDock,RomanRuin,RuinByNight,RuinOfTheSun,VulcanBird,VulcanHarbor",
			minilaps : "CoteD'Azur,CrazyBridge,EnterTheWorm,GateOfTheSun,LateAfter8,RabbitHill,Toscany,WestSide", 
			minitracks : "Anaconda,BeachTime,BipBopSound,CleanLanding,ClimbTheHill,GoingHome,LoopN'Roof,TownToTown",
			all : "CentralPark,Crazy8,DarkRuin,NightRound,SeeYouSoon,ShoppingCenter,SicilianArena,TwoMountains,VulcanRing,EmperorRoof,Kangourou,OutOfTheDock,RomanRuin,RuinByNight,RuinOfTheSun,VulcanBird,VulcanHarbor,CoteD'Azur,CrazyBridge,EnterTheWorm,GateOfTheSun,LateAfter8,RabbitHill,Toscany,WestSide,Anaconda,BeachTime,BipBopSound,CleanLanding,ClimbTheHill,GoingHome,LoopN'Roof,TownToTown,"
		},
	},
	tmo : {
		race : {
			a : "RaceA1,RaceA2,RaceA3,RaceA4,RaceA5,RaceA6,RaceA7,RaceA8",
			b : "RaceB1,RaceB2,RaceB3,RaceB4,RaceB5,RaceB6,RaceB7,RaceB8",
			c : "RaceC1,RaceC2,RaceC3,RaceC4,RaceC5,RaceC6,RaceC7,RaceC8",
			d : "RaceD1,RaceD2,RaceD3,RaceD4,RaceD5,RaceD6,RaceD7,RaceD8",
			e : "RaceE1,RaceE2,RaceE3,RaceE4,RaceE5,RaceE6,RaceE7,RaceE8",
			f : "RaceF1,RaceF2,RaceF3,RaceF4,RaceF5,RaceF6,RaceF7,RaceF8",
			g : "RaceG1,RaceG2,RaceG3",
			all : "RaceA1,RaceA2,RaceA3,RaceA4,RaceA5,RaceA6,RaceA7,RaceA8,RaceB1,RaceB2,RaceB3,RaceB4,RaceB5,RaceB6,RaceB7,RaceB8,RaceC1,RaceC2,RaceC3,RaceC4,RaceC5,RaceC6,RaceC7,RaceC8,RaceD1,RaceD2,RaceD3,RaceD4,RaceD5,RaceD6,RaceD7,RaceD8,RaceE1,RaceE2,RaceE3,RaceE4,RaceE5,RaceE6,RaceE7,RaceE8,RaceF1,RaceF2,RaceF3,RaceF4,RaceF5,RaceF6,RaceF7,RaceF8,RaceG1,RaceG2,RaceG3",
		},
		platform : {
			a : "PlatformA1,PlatformA2,PlatformA3",
			b : "PlatformB1,PlatformB2,PlatformB3",
			c : "PlatformC1,PlatformC2,PlatformC3",
			d : "PlatformD1,PlatformD2,PlatformD3",
			e : "PlatformE1,PlatformE2,PlatformE3",
			all : "PlatformA1,PlatformA2,PlatformA3,PlatformB1,PlatformB2,PlatformB3,PlatformC1,PlatformC2,PlatformC3,PlatformD1,PlatformD2,PlatformD3,PlatformE1,PlatformE2,PlatformE3", 
		},
		puzzle : {
			a : "PuzzleA1,PuzzleA2,PuzzleA3,PuzzleA4,PuzzleA5,PuzzleA6,PuzzleA7,PuzzleA8",
			b : "PuzzleB1,PuzzleB2,PuzzleB3,PuzzleB4,PuzzleB5,PuzzleB6,PuzzleB7,PuzzleB8",
			c : "PuzzleC1,PuzzleC2,PuzzleC3,PuzzleC4,PuzzleC5,PuzzleC6,PuzzleC7,PuzzleC8",
			d : "PuzzleD1,PuzzleD2,PuzzleD3,PuzzleD4,PuzzleD5,PuzzleD6,PuzzleD7,PuzzleD8",
			e : "PuzzleE1,PuzzleE2,PuzzleE3,PuzzleE4,PuzzleE5,PuzzleE6,PuzzleE7,PuzzleE8",
			f : "PuzzleF1,PuzzleF2,PuzzleF3,PuzzleF4,PuzzleF5,PuzzleF6,PuzzleF7,PuzzleF8",
			g : "PuzzleG1,PuzzleG2,PuzzleG3",
			all : "PuzzleA1,PuzzleA2,PuzzleA3,PuzzleA4,PuzzleA5,PuzzleA6,PuzzleA7,PuzzleA8,PuzzleB1,PuzzleB2,PuzzleB3,PuzzleB4,PuzzleB5,PuzzleB6,PuzzleB7,PuzzleB8,PuzzleC1,PuzzleC2,PuzzleC3,PuzzleC4,PuzzleC5,PuzzleC6,PuzzleC7,PuzzleC8,PuzzleD1,PuzzleD2,PuzzleD3,PuzzleD4,PuzzleD5,PuzzleD6,PuzzleD7,PuzzleD8,PuzzleE1,PuzzleE2,PuzzleE3,PuzzleE4,PuzzleE5,PuzzleE6,PuzzleE7,PuzzleE8,PuzzleF1,PuzzleF2,PuzzleF3,PuzzleF4,PuzzleF5,PuzzleF6,PuzzleF7,PuzzleF8,PuzzleG1,PuzzleG2,PuzzleG3",
		},
		stunts : {
			a : "StuntsA1,StuntsA2,StuntsA3",
			b : "StuntsB1,StuntsB2,StuntsB3",
			c : "StuntsC1,StuntsC2,StuntsC3",
			d : "StuntsD1,StuntsD2,StuntsD3",
			all : "StuntsA1,StuntsA2,StuntsA3,StuntsB1,StuntsB2,StuntsB3,StuntsC1,StuntsC2,StuntsC3,StuntsD1,StuntsD2,StuntsD3",
		},
		survival : "Survival01,Survival02,Survival03,Survival04,Survival05,Survival06,Survival07,Survival08,Survival09,Survival10,Survival11,Survival12,Survival13,Survival14,Survival15,Survival16,Survival17,Survival18",
		supersurvival : "Survival01,Survival02,Survival03,Survival04,Survival05,Survival06,Survival07,Survival08,Survival09,Survival10,Survival11,Survival12,Survival13,Survival14,Survival15,Survival16,Survival17,Survival18",
	},
	tmn : {
		beginner : "A-0,A-1,A-2,A-3,A-4,A-5,A-6,A-7,A-8,A-9,B-0,B-1,B-2,B-3,B-4,B-5,B-6,B-7,B-8,B-9,C-0,C-1,C-2,C-3,C-4,C-5,C-6,C-7,C-8,C-9",
		advanced : "D-0,D-1,D-2,D-3,D-4,D-5,D-6,D-7,D-8,D-9,E-0,E-1,E-2,E-3,E-4,E-5,E-6,E-7,E-8,E-9,F-0,F-1,F-2,F-3,F-4,F-5,F-6,F-7,F-8,F-9",
		expert : "G-0,G-1,G-2,G-3,G-4,G-5,G-6,G-7,G-8,G-9,H-0,H-1,H-2,H-3,H-4,H-5,H-6,H-7,H-8,H-9,I-0,I-1,I-2,I-3,I-4,I-5,I-6,I-7,I-8,I-9",
		pro : "Pro A-0,Pro A-1,Pro A-2,Pro A-3,Pro A-4,Pro A-5,Pro A-6,Pro A-7,Pro A-8,Pro A-9",
		bonus : "Bonus A-0,Bonus A-1,Bonus A-2,Bonus A-3,Bonus A-4,Bonus A-5,Bonus A-6,Bonus A-7,Bonus A-8,Bonus A-9,Bonus B-0,Bonus B-1,Bonus B-2,Bonus B-3,Bonus B-4,Bonus B-5,Bonus B-6,Bonus B-7,Bonus B-8,Bonus B-9",
		all : "A-0,A-1,A-2,A-3,A-4,A-5,A-6,A-7,A-8,A-9,B-0,B-1,B-2,B-3,B-4,B-5,B-6,B-7,B-8,B-9,C-0,C-1,C-2,C-3,C-4,C-5,C-6,C-7,C-8,C-9,D-0,D-1,D-2,D-3,D-4,D-5,D-6,D-7,D-8,D-9,E-0,E-1,E-2,E-3,E-4,E-5,E-6,E-7,E-8,E-9,F-0,F-1,F-2,F-3,F-4,F-5,F-6,F-7,F-8,F-9,G-0,G-1,G-2,G-3,G-4,G-5,G-6,G-7,G-8,G-9,H-0,H-1,H-2,H-3,H-4,H-5,H-6,H-7,H-8,H-9,I-0,I-1,I-2,I-3,I-4,I-5,I-6,I-7,I-8,I-9,Pro A-0,Pro A-1,Pro A-2,Pro A-3,Pro A-4,Pro A-5,Pro A-6,Pro A-7,Pro A-8,Pro A-9,Bonus A-0,Bonus A-1,Bonus A-2,Bonus A-3,Bonus A-4,Bonus A-5,Bonus A-6,Bonus A-7,Bonus A-8,Bonus A-9,Bonus B-0,Bonus B-1,Bonus B-2,Bonus B-3,Bonus B-4,Bonus B-5,Bonus B-6,Bonus B-7,Bonus B-8,Bonus B-9",
	},
	other : "",
};

///////////////////////////////////////
// this was used for creating tracklist
/*
function merge(obj, color){
	var string = "";
	for ( let i = 0; i < 7; i++ )
	{
	string += Object.values(obj)[i][color]+",";
	}
	return string;
}

function merge2(obj, counter){
	var string = "";
	for ( let i = 0; i < counter; i++ )
	{
	string += Object.values(obj)[i]+",";
	}
	return string;
}
*/
// this was used for creating tracklist
///////////////////////////////////////

function subType(string){
	result = string.toLowerCase().split(' ')[0];
	if ( global.gameType === "tmnf" )
	{
		if ( string === "All Flags" ) { result = "all"; }
		else if ( string === "All Flags (No E5)" ) { result = "allnoe05"; }
		else if ( string === "All Flags (1-Lap)" ) { result = "all1lap"; }
		else { } //nothing
	}
	return result;
}


function campaignDraw(type){
	campaigns(type);
	attachListener();
	 //Avoid non campaign choices
	var campL = campList.length;
	var html = '<STRONG>Select Speedrun Category...</STRONG><br><form name="categoryTypeForm">';
	for ( let i = 0; i < campL; i++ )
	{
		html += '<INPUT TYPE="radio" NAME="campaign" VALUE="'+campList[i]+'">'+campList[i];
	}
	html += "</form>";
	if ( campList[0] === true ) {
		html = '<STRONG>No Speedrun Category...</STRONG>';
	}
	document.querySelector('#campaign').innerHTML = html;
	var refLen = document.querySelector('#campaign').children.length;
	if ( refLen > 1 )
	{
		var ref = document.querySelector('#campaign').children[2]; //Form part of DIV
		for ( let j = 0; j < ref.length; j++ )
		{
			ref[j].addEventListener('change', function(){ radioCampaign(); });
			ref[j].evented = true;
		}
	}
}

function subCampaignDraw(type){
	subcampaign(type);
	var subcampL = subCampList.length;
	var html = '<STRONG>Select Subcategory (Campaign)</STRONG><form name="subcategoryTypeForm">';
	for ( let i = 0; i < subcampL; i++ )
	{
		html += '<INPUT TYPE="radio" NAME="subcampaign" VALUE="'+subCampList[i]+'">'+subCampList[i];
	}
	html += "</form>";
	//undefined
	if ( subCampList[0] === true ) {
		html = '<STRONG>No Speedrun Subcategory...</STRONG>';
	}
	document.querySelector('#subcampaign').innerHTML = html;
	var ref = document.querySelector('#subcampaign').children.length;
	if ( ref > 1 )
	{
		reffy = document.querySelector('#subcampaign').children[1]; //Form part of DIV
		for ( let j = 0; j < reffy.length; j++ )
		{
			reffy[j].addEventListener('change', function(){ radioSubCampaign(); });
			reffy[j].evented = true;
		}
	}
}

function formatChange(string){
	if ( !isNaN(string) === true ) { string = string.toString(); } //if data is number, convert to String...
	
	if ( hasNumber(string) === false ) {
		if ( global.noraw !== true ) {
			if ( alerted === false )
			{
				alert("Are you sure you put correct times?");
				alerted = true;
			}
		}
	}
	
	if ( string.length > 12 ) {
		alert("Did you forget about separator? Or made mistake there?");
	}

	if ( formatTypeForm[3].checked === true ) //xxxxx
	{
		//var sl = string.length;
		//var ld = pint(string.substring(s-1,s)) //Last Digit
		//if ( ld !== "0" || ld !== 0 ) { console.log("Last digit millisecond might be wrong!"); }
		//no need for change...
		return string;
	}
	
	else if ( formatTypeForm[2].checked === true ) //hh[h]mm'ss"xx 
	{
		var s = string.length;
		var x1 = string.split("\"");
		var xx = x1[1];
		var s1 = x1[0].split("'");
		var ss = s1[1] || x1[0]; //if value exists it takes from another split, if not, read from first split (aka only ss and xx)
		var m1 = s1[0];
		var mm = 0;
		var hh = 0;
		if ( m1.indexOf('h') > -1 || s > 11 )
		{
			var h1 = m1.split('h');
			mm = h1[1];
			hh = h1[0];
		}
		else if ( s > 3 && s <= 5 )
		{
			/* do nothing */
		}
		else 
		{
			mm = s1[0];
			hh = 0;
		}
		var tm = pint(hh)*60+pint(mm); 
		var ts = pint(tm)*60+pint(ss);
		var tx = ( global.gameType === "tmr") ? pint(ts)*1000+pint(xx) : pint(ts)*100+pint(xx);
		return tx;
	}
	
	else if ( formatTypeForm[0].checked === true ) //hhmmssxx
	{
		var s = string.length; //e.g. 5-9
		if ( global.gameType !== "tmr" ) {
			var xx = pint(string.substring(s-2, s));
			var ss = pint(string.substring(s-4, s-2));
			var mm = 0;
			if ( s > 4 && s <= 6 ) {
				mm = pint(string.substring(0, s-4));
			}
			var hh = 0;
			if ( s > 6 ) {
				mm = pint(string.substring(s-6, s-4));
				hh = pint(string.substring(0, s-6));
			}
		}
		
		else { //to get 3 digits for newest title (TM2020)
			var xx = pint(string.substring(s-3));
			var ss = 0;
			if ( s > 3 ) {
				ss = pint(string.substring(s-5, s-3));
			}
			var mm = 0;
			if ( s > 5 && s <= 7 ) {
				mm = pint(string.substring(0, s-5));
			}
			var hh = 0;
			if ( s > 7 ) {
				mm = pint(string.substring(s-7, s-5));
				hh = pint(string.substring(0, s-7));
			}
		}
		// console.log(s, xx, ss, mm, hh)
		//Totals
		var tm = hh*60+mm; 
		var ts = tm*60+ss;
		var tx = ( global.gameType === "tmr") ? ts*1000+xx : ts*100+xx;
		return tx;
	}
	else if ( formatTypeForm[4].checked === true ) //sss.xx
	{
		var s = string.split('.'); //split data with dot.
        var xt = s[1]; //xxxx
        var xx = pint(xt.substring(0, 2)); //xx (get only two numbers after dot)
		
		if ( global.gameType === "tmr" ) { xx = pint(xt.substring(0,3)); } //to get 3 digits for newest title (TM2020)
        var ss = pint(s[0]); //sss
		
		//Totals
		var tx = ( global.gameType === "tmr") ? ss*1000+xx : ss*100+xx;
		return tx;		
	}
	else if ( formatTypeForm[1].checked === true )	// hh:mm:ss.xxx
	{
		var stringi = string.split(":"); //[ "hh", "mm", "ss.xxx" ]
		var SL = stringi.length-1;
		var strings = stringi[SL].split('.');
		
        var xt = strings[1]; //xxxx
        var xx = pint(xt.substring(0, 2)); //xx (get only two numbers after dot)
		if ( global.gameType === "tmr" ) { xx = pint(xt.substring(0,3)); } //to get 3 digits for newest title (TM2020)
		var ss = pint(strings[0]);
		var hh, mm;
		if ( SL === 2 )
		{
			mm = pint(stringi[1]);
			hh = pint(stringi[0]);
		}
		else if ( SL === 1 ) {
			hh = 0;
			mm = pint(stringi[0]);
		}
		else if ( SL === 0 ) {
			hh = 0;
			mm = 0;
		}
		else { 
			console.log("Problem with string length. SL equal to..."+SL);
		}
		
		//Totals
		var tm = hh*60+mm; 
		var ts = tm*60+ss;
		var tx = ( global.gameType === "tmr") ? ts*1000+xx : ts*100+xx;
		return tx;		
	}
	else {
		alert("Select formatting of your times!");
	}
}

function formatReverse(time, mode){
	var h2ms = 360000;
	var m2ms = 6000;
	var s2ms = 100;
	if ( global.gameType === "tmr" )
	{
		h2ms = 3600000;
		m2ms = 60000;
		s2ms = 1000;
	}
	
	//Final...
	var fh = Math.floor(time / h2ms);
	var time2 = time % h2ms;
	var fm = Math.floor(time2 / m2ms);
	var time3 = time2 % m2ms;
	var fs = Math.floor(time3 / s2ms);
	var fx = time3 % s2ms;
	
	var formatting = '';
	if ( fh > 0 || mode === "full" )
	{
		if ( fh.toString().length === 1 ) { fh = "0"+fh; }
		if ( fm.toString().length === 1 ) { fm = "0"+fm; }
		if ( fs.toString().length === 1 ) { fs = "0"+fs; }
		if ( global.gameType === "tmr" ) {
			if ( fx.toString().length === 1 ) { fx = "00"+fx; }
			else if ( fx.toString().length === 2 ) { fx = "0"+fx; }
			}
		else if ( fx.toString().length === 1 ) { fx = "0"+fx; }
		if ( mode === "igt" )
		{
			formatting = fh+":"+fm+":"+fs+"."+fx;
		}
		else if ( global.gameType === "tmr" ) {
			formatting = fh+"h "+fm+"m "+fs+"s "+fx+"ms";
		}
		else { 
			formatting = fh+"h "+fm+"m "+fs+"s "+fx+"0ms";
		}
	}
	else if ( fm > 0 )
	{
		if ( fm.toString().length === 1 && fm === 0 ) { fm = "0"+fm; }
		if ( fs.toString().length === 1 ) { fs = "0"+fs; }
		if ( global.gameType === "tmr" ) {
			if ( fx.toString().length === 1 ) { fx = "00"+fx; }
			else if ( fx.toString().length === 2 ) { fx = "0"+fx; }
			}
		else if ( fx.toString().length === 1 ) { fx = "0"+fx; }
		if ( mode === "igt" )
		{
			formatting = fm+":"+fs+"."+fx;
		}
		else if ( global.gameType === "tmr" ) {
			formatting = fm+"m "+fs+"s "+fx+"ms";
		}
		else { 
			formatting = fm+"m "+fs+"s "+fx+"0ms";
		}
	}
	else
	{
		if ( fs.toString().length === 1 ) { fs = "0"+fs; }
		if ( global.gameType === "tmr" ) {
			if ( fx.toString().length === 1 ) { fx = "00"+fx; }
			else if ( fx.toString().length === 2 ) { fx = "0"+fx; }
			}
		else if ( fx.toString().length === 1 ) { fx = "0"+fx; }
		if ( mode === "igt" )
		{
			formatting = "0:"+fs+"."+fx;
		}
		else if ( global.gameType === "tmr" ) {
			formatting = fs+"s "+fx+"ms";
		}
		else { 
			formatting = fs+"s "+fx+"0ms";
		}
		
	}
	return formatting;
}

function hasNumber(myString) {
	return /\d/.test(myString);
}

function separatorCheck(){
	var sep2Check = global.separator;
	if ( document.querySelector('#separator').value === "" ) { global.separator = ","; }

	if ( hasNumber(sep2Check) === true )
	{
		alert("Don't use digit in separator!");
	}
	
	if ( sep2Check.indexOf(":") > -1 || sep2Check.indexOf(".") > -1 || sep2Check.indexOf("'") > -1 || sep2Check.indexOf('"') > -1 )
	{
		st2 = '"';
		alertString = "Don't use colons (:), dots (.), single or double quotation marks (' or "+st2+") as separator sign!";
		alert(alertString);
	}
}

function clipboard(){
	//var copyText = document.getElementById("clipboardZone");
	var copyText = document.querySelector("#clipboardZone");
	copyText.select();
	copyText.setSelectionRange(0, 999999); /*For mobile devices*/
	document.execCommand("copy");
}

//Prevent double clicking on calculation button...
var clicked = false;
function Calculation(){
	if ( clicked === true ) { console.log("Preventing double click..."); }
	else {
		Calculations();
		clicked = true;
		setTimeout(() => { clicked = false; }, 500); //after 2 seconds release the block...
	}
}

//function taken from: https://stackoverflow.com/a/442474
//to check position of element in site;...
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
//Usage: var x = getOffset( document.getElementById('yourElId') ).left; 


function Calculations(){
	//makes bug with recalculation...
	
	var subCatExisting = document.querySelector('#subcampaign').children.length;
	saveInputs(subCatExisting); //Puts stuff into memory...
	separatorCheck();

	var cateExist = document.querySelector('#campaign').children.length;
	if ( global.CampaignType === undefined && global.gameType !== "other" ) { alert("You did not choose category!"); }
	if ( global.SubCampaignType === undefined && cateExist === 2 ) { alert("You did not choose subcategory!"); }
	 //unify variable to address trakclist object in TL variable
	if ( global.gameType !== "other" ) {
		global.CampType = subType(global.CampaignType);
	}
	if ( subCatExisting >= 2 ) {
		global.SubType = subType(global.SubCampaignType);
	}
	
	var TLraw;
	if ( subCatExisting >= 2 ) {
		TLraw = trackList[global.gameType][global.CampType][global.SubType]; //unformatted tracklist
	}
	else if ( global.gameType === "other" )
	{
		TLraw = customTracklist.value;
	}
	else { 
		if ( trackList[global.gameType][global.CampType].all === undefined )
		{
			TLraw = trackList[global.gameType][global.CampType];
		} 
		else {
			TLraw = trackList[global.gameType][global.CampType].all;
		}
	}
	var TL = TLraw.split(',');

	var labels = ["Track", "Time (raw)", "Time (ms)", "Time (IGTF)", "Sum of Time"];
	if ( global.noraw === true ) { labels = ["Track", "Time (ms)", "Time (IGTF)", "Sum of Time"]; }
	var rawTimeValues = document.querySelector('#timeZone').value.split(global.separator);
	document.querySelector('#clipboardDiv').style.visibility = "";
	/*
	rawTimeValues
	if ( global.timeZone === undefined )
	{
		rawTimeValues = global.timeZone.split(global.separator)
	}
	else { 
		rawTimeValues = document.querySelector('#timeZone').value.split(global.separator)
	}
	*/
	var timeValues = [];
	var array2Print = [];
	var pass2Clipboard = "Ascending TimeSum,CurrentTrack Time,TrackName\n";

	var sumOfTime = 0;
	var lastSum = localStorage.getItem("lastSum");
	var leng = rawTimeValues.length;
	if ( global.noraw === true ) { leng = TL.length; }
	//var lengMinusTrackList = leng-TL.length;
	// if ( leng === TL.length ) //is okay, number of given times
	
	if ( TL.length > leng ) {
		alert("You did not gave enough times, to fill all data to chosen campaign.");
	}
	
	var j = 1;
	for ( let i = 0; i < leng; i++ )
	{
		if ( rawTimeValues[i] === "" && global.noraw !== true ) {}
		else
		{ 
			if ( global.noraw === true ) { timeValues[i] = 0; }
			else { timeValues[i] = formatChange(rawTimeValues[i]); }
			
			sumOfTime += pint(timeValues[i]);
			
			array2Print[i] = [];
			array2Print[i][0] = TL[i]; //trackname

			if ( global.gameType === "tmr" ) {
				array2Print[i][0] = global.SubCampaignType+global.CampaignType+" "+TL[i];
				if ( global.CampType === "training" || global.SubCampaignType === undefined ) {
					array2Print[i][0] = global.CampaignType+" "+TL[i];
				}
			}
			
			if ( global.noraw !== true ) {
				array2Print[i][1] = rawTimeValues[i]; //tracktime... raw
			}
			array2Print[i][2] = timeValues[i]+"0"; //tracktime...milliseconds
			if ( global.gameType === "tmr" ) { array2Print[i][2] = timeValues[i]; } //tracktime...milliseconds 
			array2Print[i][2] = pint(array2Print[i][2]);
			
			array2Print[i][3] = formatReverse(timeValues[i], "igt"); //display data in standard format
			if ( global.gameType === "tmr" ) { array2Print[i][3] = formatReverse(timeValues[i]); } //display data in standard format
			//array2Print[i][5] = formatReverse(timeValues[i]); //display data in standard format
			array2Print[i][4] = formatReverse(sumOfTime); //tracktime summed up
			
			if ( i >= TL.length ) {
				array2Print[i][0] = "Penalty "+j; //trackname
				j++;
			}
			
			pass2Clipboard += formatReverse(sumOfTime, "full")+","+formatReverse(timeValues[i], "full")+","+array2Print[i][0]+'\n';
			//console.log(pass2Clipboard)
		}
	}
	var sumFormatted = formatReverse(sumOfTime);
	var sumDiff = sumOfTime-lastSum;
	//var sumDiffFormatted = formatReverse(sumDiff);
	var a = "-"+formatReverse(-sumDiff);
	var b = "+"+formatReverse(sumDiff);
	var c = "no difference";
	var sumDiffFormatted = ( sumDiff < 0 ) ? a : b;
	sumDiffFormatted = ( sumDiff === 0 ) ? c : sumDiffFormatted;
	array2Print.unshift(labels); //Puts labels as first element of Array...
	
	localStorage.setItem("lastSum", sumOfTime);
	document.querySelector('#totalTime').innerText = sumFormatted;
	document.querySelector('#sumDifference').innerText = " ("+sumDiffFormatted+")";
	//document.querySelector('#totalTime').style.color = "white";
	if ( sumDiff < 0 ) { document.querySelector('#sumDifference').style.color = "green"; }
	else if ( sumDiff > 0 ) { document.querySelector('#sumDifference').style.color = "red"; }
	else { document.querySelector('#sumDifference').style.color = ""; } 
	
	createTable(array2Print);
	if ( global.noraw !== true ) {
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)').title = "Track name from chosen campaign";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').title = "Time seen in format as you entered";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)').title = "Time calculated to pure miliseconds (smallest unit to measure)";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)').title = "Time seen as game formats it with colons (:) and dots (.)";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5)').title = "Time summed up, including current track + all above current track.";
	}
	else {
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)').title = "Track name from chosen campaign";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').title = "Time calculated to pure miliseconds (smallest unit to measure)";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)').title = "Time seen as game formats it with colons (:) and dots (.)";
		document.querySelector('#fillMe > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(4)').title = "Time summed up, including current track + all above current track.";		
	}
	
	document.querySelector('#clipboardZone').value = pass2Clipboard;
	
	//Adjust coloring page to height
	var bodyH = document.body.scrollHeight+16;
	document.querySelector('body').style.height = bodyH+"px";
}

function drawTable(){
	radioFormat();
	global.noraw = true;
	//localStorage.getItem("customTracklistMode")
	
	Calculation();
	//code portion taken from: https://www.redips.net/javascript/adding-table-rows-and-columns/
	// create DIV element and append to the table cell
	function createCell(cell, text, style) {
		var div = document.createElement('div'), // create DIV element
			txt = document.createTextNode(text); // create text node
		div.appendChild(txt);                    // append text node to the DIV
		div.setAttribute('class', style);        // set DIV class attribute
		div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
		cell.appendChild(div);                   // append DIV to the table cell
	}
	
	// append column to the HTML table
	function appendColumn() {
		var tbl = document.getElementById('scoreTable'), // table reference
			i;
		// open loop for each row and append cell
		for (i = 0; i < tbl.rows.length; i++)
		{
		createCell(tbl.rows[i].insertCell(1), "replaceMe"+i, 'col');
		}
	}
	
	appendColumn(); 
	
	var leng = document.querySelectorAll('.col').length;
	document.querySelectorAll('.col')[0].innerHTML = "Insert Times";
	for ( let i = 1; i < leng; i++ )
	{
		document.querySelectorAll('.col')[i].innerHTML = '<textarea id="customTracklist'+i+'" class="customList" name="customList" rows="1" cols="'+global.timeFormat.length+'" style="resize:none;height:1.5em;text-align:right;" placeholder='+global.timeFormat+'></textarea>';
	}
	
	/*
	var columnCount = document.querySelector('#scoreTable > tbody').children.length
	for ( let j = 1; j < columnCount; j++ )
	{
		document.querySelector('#scoreTable > tbody:nth-child(1) > tr:nth-child('+j+') > td:nth-child(3)').outerHTML = "";
	}
	*/
	
	document.querySelector('#RECbutton').style.visibility = "visible";
	//document.querySelectorAll('.customList')[0].value; // "98775"
	//document.querySelector('#scoreTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)').textContent //raw
	//document.querySelector('#scoreTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(4)').textContent //ms
	//document.querySelector('#scoreTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(5)').textContent //IGTF
	//document.querySelector('#scoreTable > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(6)').textContent //SUM
	
	//if ( recalced = true ) { //Why do it only after Recalc? Do it always...
		var Arrtimes = localStorage.lastTimes.split(','); //Create times into array from last calculation...
		for ( let i = 0; i < Arrtimes.length; i++ )
		{
			var j=i+1;
			document.querySelector('#customTracklist'+j).value = Arrtimes[i];
		}
	//}
	//Adjust coloring page to height
	var bodyH = document.body.scrollHeight+16;
	document.querySelector('body').style.height = bodyH+"px";
}

function recalculate(){
	radioFormat(); //to update value of  global.timeFormat [?]
	var count = document.querySelectorAll('.customList').length;
	var passOutput = "";
	for ( let i = 0; i < count; i++ )
	{
		passOutput += document.querySelectorAll('.customList')[i].value;
		if ( i+1 < count ) { passOutput += global.separator; } //Do not include separator in last element;
	}
	document.querySelector('#timeZone').value = passOutput;
	global.noraw = false;
	document.querySelector('#calculatorMode > form:nth-child(1) > input:nth-child(2)').click();
	//timeZone
	Calculation();
	recalced = true;
}

function saveInputs(subcat){
	var lastEntryTimes = document.querySelector('#timeZone').value;
	localStorage.setItem('lastTimes', lastEntryTimes);
	var separator = document.querySelector('#separator').value;
	localStorage.setItem('separator', separator);
	var tracklist = document.querySelector('#customTracklist').value;
	localStorage.setItem('customTracklist', tracklist);
	
	forms = window.document.forms;
	function saveForm(formName){
		//console.log(formName);
		var form2Change = document.forms.namedItem(formName);
		var fL = form2Change.length;
		for ( let i = 0; i < fL; i++)
		{
			var formNameC = form2Change[i].name; //formName
			var optionName = form2Change[i].value; // tmr / tmturbo, and so on...
			var state = form2Change[i].checked; //true or false
			if ( state === true ) 
			{
				localStorage.removeItem(formName); //Saves data to local memory.
				localStorage.setItem(formName, optionName); //Saves data to local memory.
			}
		}
	}
	saveForm("gameTypeForm");
	if ( global.gameType !== "other" ) { saveForm("categoryTypeForm"); }
	saveForm("formatTypeForm");
	if ( subcat === 2 ) { saveForm("subcategoryTypeForm"); }
	//saveForm("timeZoneForm");
	//saveForm("customTracklistForm");
}

(function restoreInputs(){
	document.querySelector('#timeZone').value = localStorage.getItem('lastTimes');
	document.querySelector('#separator').value = localStorage.getItem('separator');
	document.querySelector('#customTracklist').value = localStorage.getItem('customTracklist');
	global.separator = localStorage.getItem('separator');
	inputs = document.querySelectorAll('input');
	
	var LSlength = Object.keys(localStorage).length;
	function loadForm(formName){
		var form2Change = document.forms.namedItem(formName);
		var fL = form2Change.length;
		var read = localStorage.getItem(formName);
		
		for ( let i = 0; i < fL; i++)
		{
			if ( form2Change[i].value === read )
			{
				//form2Change[i].checked = true;
				form2Change[i].click();
			}
		}
	}
	loadForm("gameTypeForm");
	loadForm("categoryTypeForm");
	loadForm("formatTypeForm");
	loadForm("subcategoryTypeForm");
	loadForm("timeZoneForm");
})();

//document.querySelector('#Cbutton')


/*
allStr = "StarStadium A1,StarStadium A2,StarStadium A3,StarStadium A4,StarStadium A5,StarIsland A1,StarIsland A2,StarIsland A3,StarIsland A4,StarIsland A5,StarDesert A1,StarDesert A2,StarDesert A3,StarDesert A4,StarDesert A5,StarRally A1,StarRally A2,StarRally A3,StarRally A4,StarRally A5,StarBay A1,StarBay A2,StarBay A3,StarBay A4,StarBay A5,StarCoast A1,StarCoast A2,StarCoast A3,StarCoast A4,StarCoast A5,StarSnow A1,StarSnow A2,StarSnow A3,StarSnow A4,StarSnow A5,StarStadium B1,StarStadium B2,StarStadium B3,StarStadium B4,StarStadium B5,StarIsland B1,StarIsland B2,StarIsland B3,StarIsland B4,StarIsland B5,StarDesert B1,StarDesert B2,StarDesert B3,StarDesert B4,StarDesert B5,StarRally B1,StarRally B2,StarRally B3,StarRally B4,StarRally B5,StarBay B1,StarBay B2,StarBay B3,StarBay B4,StarBay B5,StarCoast B1,StarCoast B2,StarCoast B3,StarCoast B4,StarCoast B5,StarSnow B1,StarSnow B2,StarSnow B3,StarSnow B4,StarSnow B5,StarStadium C1,StarStadium C2,StarStadium C3,StarStadium C4,StarStadium C5,StarIsland C1,StarIsland C2,StarIsland C3,StarIsland C4,StarIsland C5,StarDesert C1,StarDesert C2,StarDesert C3,StarDesert C4,StarDesert C5,StarRally C1,StarRally C2,StarRally C3,StarRally C4,StarRally C5,StarBay C1,StarBay C2,StarBay C3,StarBay C4,StarBay C5,StarCoast C1,StarCoast C2,StarCoast C3,StarCoast C4,StarCoast C5,StarSnow C1,StarSnow C2,StarSnow C3,StarSnow C4,StarSnow C5,StarStadium D1,StarStadium D2,StarStadium D3,StarStadium D4,StarStadium D5,StarIsland D1,StarIsland D2,StarIsland D3,StarIsland D4,StarIsland D5,StarDesert D1,StarDesert D2,StarDesert D3,StarDesert D4,StarDesert D5,StarRally D1,StarRally D2,StarRally D3,StarRally D4,StarRally D5,StarBay D1,StarBay D2,StarBay D3,StarBay D4,StarBay D5,StarCoast D1,StarCoast D2,StarCoast D3,StarCoast D4,StarCoast D5,StarSnow D1,StarSnow D2,StarSnow D3,StarSnow D4,StarSnow D5,StarStadium E,StarIsland E,StarDesert E,StarRally E,StarBay E,StarCoast E,StarSnow E"
all = allStr.split(',');

//Enviroment filter
function envifil(string){
	var leng = all.length;
	var result = [];
	for ( let i = 0; i < leng; i++ )
	{
		if ( all[i].indexOf(string) > -1 )
		{
			result.push(all[i]);
		}
	}
	trueResult = result.join(',');
	return trueResult
}
*/
