// Based on Random Family Tree Generator v.1.3
// http://code.google.com/p/random-family-tree-generator/
// apparently by Tood Stumpf,
// which in turn was based on Random Family Tree Generator 
// http://partridgez.com/japartridge/lineage2.html
// by Jeff Partridge, which has since been updated to v2.0:
// http://partridgez.com/japartridge/lineage2.html
// All versions under a
// Creative Commons Attribution-Noncommercial-Share Alike-3.0 United States License

// This version by M.C.DeMarco adds parameters for non-human or otherwise non-medieval family trees.
// Tree style from http://thecodeplayer.com/walkthrough/css3-family-tree
// http://thecodeplayer.com/experiments/css3-family-tree-multiple-parents.html.

// Needs a hide family for tree trimming.

var linData = [];//full data structure for genealogy

var currentYear; //determines timing of data output
var currentYearMode = false;

//For spacing issues.  Increase spaceFactor if your trees still wrap.
var spaceFactor = 60;

var raceSpace = [];


// basic functions

function addRace(sName, dName, obj, isDef) {
	var i = raceSpace.length;
	raceSpace[i] = [];
	raceSpace[i].shortName = sName;
	raceSpace[i].displayName = dName;
	raceSpace[i].object = obj;
	if (isDef)
		raceSpace[i].isDefault = true;
}

function selectRace() {
	//Human type/fantasy race selection.
	homo = raceSpace[$("select#raceSELECT").val()].object;
	homo.initializeClans();
	$("div#nameTables").html("");
	homo.generateNameTable();
	//May be dangerous to do this with large fertility swings...
	populateLineage();
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColor(person) {
	return "color" +  ( (parseInt(person.generation)%13 + 1));
}

function getCurrentAge(person,age) {
	//test for currentYearMode before calling
	return (person.dyear > currentYear) ? (currentYear - person.byear) : "d." + (age ? " age " : " ") + person.dage;
}

function getGender(person) {
	//Translate gender to a word; e.g. in css class for the tree view
	return (person.gender == "F") ? "female" : "male";
}

function serializePersonFromForm(form) {
	//Convert a jQuery form object into a partial person object.
	var o = {};
	var a = form.serializeArray();
	$.each(a, function() {
		if (this.value && this.value != "") {
			if (this.name == "parentNodeId" || this.name == "generation" || this.name == "byear" || this.name == "myear" || this.name == "dyear") {
				//validation and typecast for numeric elements in form
				if (!isNaN(parseInt(this.value)))
					o[this.name] = parseInt(this.value);
			} else {
				o[this.name] = this.value;
			}
		}
	});
	return o;
}

function setSeedByDate() {
	$("input#seed").val(new Date().getTime());
}

// Random trait functions

function rollD(sides) {
	// Roll a D-sided dice, resulting in a number from 1 to D.
	return Math.round(Math.random() * (sides-1)) + 1;
}

function rnd(mean, stdev) {
	// Get a normally distributed value from mean and stdev.
	// Source:  http://www.protonfish.com/random.shtml
	return Math.round(rnd_snd()*stdev+mean);

	function rnd_snd() {
		// Simulate a normal distribution with three random numbers:
		return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
	}
}

// *** name manipulation code ***
function generateUniqueName(person) {
	//generateName with a sibling check
	//note that the program will hang here if enough distinct names aren't available
	var tempSiblings = getSiblingNames(person);
	var tempName = homo.generateName(person);
	while (tempName != "Dís" && tempSiblings.indexOf(tempName) >= 0)
		tempName = homo.generateName(person);
	return tempName;
}

function generateNewName(pid) {
	var person = linData[pid];
	var newname = generateUniqueName(person);
	updateName(pid,newname);
}

function changeName(pid,value) {
	if (linData[pid].name != value)
		updateName(pid,value);
}

function updateName(pid,newname) {
	//update data structure and html
	linData[pid].name = newname;
	$("ul#person"+pid).children("li:first").children("input").val(newname);
	$("a#treep" + pid).html(newname + (currentYearMode ? " (" + linData[pid].cage + ")" : "" ));
	updatePersonCSV(linData[pid]);
}

function getSiblingNames(person) {
	//Return sibling names.
	var siblings = [];
	if (!(person.parentId2)) {
		//If we don't have a parent recorded then we won't have any siblings for person.
		return siblings;
	}
	//don't need to start i at zero because child pids are always greater than parent pids.
	for (var i=person.parentId2;i<linData.length;i++) {
		if (linData[i].parentId2 == person.parentId2 && linData[i].pid != person.pid) {
			siblings.push(linData[i].name);
		}
	}
	return siblings;
}

function generateRandomName(gender) {
	var tempName;
	if (gender == "M")
		 tempName = markov_name(homo.mchain);
	else 
		tempName = markov_name(homo.fchain);
	if (tempName.length > 2 && tempName.indexOf('--') < 0) 
		if (tempName.charAt(0) != '-' && tempName.charAt(1) != '-' && tempName.charAt(tempName.length - 1) != '-' && tempName.charAt(tempName.length - 2) != '-')
			return tempName;
	return generateRandomName(gender);
}

function pickRandomName(person) {
	//Instead of applying the name generator to the name list, just pick a name off of it.
	var tempName;
	if (person.gender == "M") 
		 tempName = homo.mnames[rollD(homo.mnames.length)-1];
	else 
		tempName = homo.fnames[rollD(homo.fnames.length)-1];
	return tempName;
}

function listNames(clans) {
	if ($("div#nameTables").html() != "") {
		return;
	}
	$("div#nameTables").html("<p>Names are chosen from the following stored list of names.</p>");
	var limit = Math.max(homo.fnames.length,homo.mnames.length);
	var table = "<table class='nameList' cellpadding=2><tr><th>Male Names</th><th>Female Names</th>";
	if (clans) {
		table += "<th>Clan Names</th>";
		limit = Math.max(limit,homo.clanList.length);
	}
	table += "</tr>";
	for (var i=0; i< limit; i++) {
		table += "<tr><td>" + (homo.mnames[i] ? homo.mnames[i] : "") +  "</td><td>" + (homo.fnames[i] ? homo.fnames[i] : "") + "</td>" + (clans ? "<td>" + (homo.clanList[i] ? homo.clanList[i] : "") + "</td>" : "") + "</tr>";
	}
	table += "</table>";
	$("div#nameTables").append(table);
}

function sampleGeneratedNames(limit) {
	if (!limit) 
		limit = 15;
	if ($("div#nameTables").html() != "") {
		return;
	}
	$("div#nameTables").html("<p>Names are generated randomly.  The following is a sample; click More for more:  <button onclick='moreGeneratedNames()'>More</button></p>");
	var table = "<table class='nameList' cellpadding=2><tr><th>Male Names</th><th>Female Names</th></tr>";
	for (var i=0; i< limit; i++) {
		table += "<tr><td>" + generateRandomName("M") +  "</td><td>" + generateRandomName("F") + "</td></tr>";
	}
	table += "</table>";
	$("div#nameTables").append(table);
}

function moreGeneratedNames(limit) {
	if (!limit) 
		limit = 25;
	for (var i=0; i< limit; i++) {
		$("div#nameTables tr:last").after("<tr><td>" + generateRandomName("M") +  "</td><td>" + generateRandomName("F") + "</td></tr>");
	}
}

// *** end name manipulation **


//Person construction functions

function randgen() { // random gender, weighted for dwarves
	var gen;
	(rollD(100) < homo.RATE_male) ? gen ="M" : gen="F";
	return gen;
}

function getOppositeGender(gender) { // flip gender (for the spouse) if one is given
	var newgen = "";
	switch(gender) {			 // otherwise randomize it
	case "M": newgen = "F";break;
	case "F": newgen = "M";break;
	default:newgen = randgen();
	}
	return newgen;
}

function generateMarriageAge(gender) {
	var mage;
	if (gender=="M") {	 // if male, potentially add a few years
		mage = rnd(homo.MEAN_mmage,homo.STD_mmage);
		if (mage < homo.MIN_mmage) 
			mage = homo.MIN_mmage;
	} else {
		mage = rnd(homo.MEAN_fmage,homo.STD_fmage); // women 
		if (mage < homo.MIN_fmage) 
			mage = homo.MIN_fmage;
	}
	return mage;
}

function generateDeathAge(mage) { // get age they die at
	var dage;
	if (!mage && (rollD(100) < homo.RATE_dchildhood)) {
		if (rollD(2) < 2) {
			dage = 1;
		} else if (rollD(2) < 2) {
			dage = rollD(5);
		} else {
			dage = rollD(15);
		}
	} else {
		dage = rnd(homo.MEAN_dage,homo.STD_dage);
		var accident = dage * homo.RATE_daccident;
		if (rollD(100) < accident) {
			dage = rollD(dage);
		}
	}
	if (dage && mage) {  // Generating spouse, so should be alive when married...
		while (dage < mage) {   // if died before married, set to marriage.
			dage = mage;
		}
	}
	return dage;
}

function generateKids(person, spouse) { // get kids
	var mend;  // year marriage ends -- no divorce for now...
	(person.dyear < spouse.dyear) ? mend=person.dyear : mend=spouse.dyear;

	var mspan; // number of years married
	mspan = mend - person.myear;

	var fertstart; // age of woman at time of marriage
	(person.gender=="F") ? fertstart=person.mage : fertstart=spouse.mage;

	var yom=0;  // years of marriage
	var girl=0;
	while (yom <= mspan) {
	if ( rollD(100) <= homo.generateFertility(fertstart+yom,girl) ) {
		var partialKid = new Object();

		partialKid.parentNodeId = spouse.pid;
		partialKid.parentId1 = person.pid;
		partialKid.parentId2 = spouse.pid;
		partialKid.byear = spouse.myear + yom;
		var kid = finishPerson(partialKid);

		if (kid.gender == 'F')
			girl = girl + 1;

		displayPerson(kid);
		linData[kid.pid] = kid;

		//In currentYearMode, we do depth-first generation of people.
		if (currentYearMode && kid.family && kid.myear <= currentYear) {
			generateFamily(kid.pid);
		}

		//Check for maternal death in childbirth.
		if (rollD(100) < homo.RATE_dchildbirth) {
			if (person.gender == "F") 
				var mother = linData[person.pid];
			else
				var mother = linData[spouse.pid];
			//Backfill death and stop generating kids.
			mother.dyear = kid.byear;
			mother.dage = mother.dyear - mother.byear;
			updatePerson(mother);
			return;
		}

		yom += rnd(homo.MEAN_childDelay, homo.STD_childDelay);  // delay before trying for another kid.
	}
	yom++;
	}
}

function generateFamily(pid) {
	// Generate a person's geneological contribution to the family tree,
	// including children and remarriages (and further children).
	var newparent = linData[pid];
	// As we are generating their descendents, hide their 'generate' button
	$("#family"+pid).hide();

	var partialSpouse = new Object();
	partialSpouse.parentNodeId = pid;
	partialSpouse.spouseId = pid;
	partialSpouse.generation = newparent.generation;
	partialSpouse.myear = newparent.myear;

	var spouse = finishPerson(partialSpouse);
	displayPerson(spouse); // display spouse
	linData[spouse.pid] = spouse;

	generateKids(newparent, spouse); // get kids
	
	var grief = spouse.dyear;
	while (newparent.dyear >= grief) { // check for remarriage until death
		grief += homo.generateGrief(); // delay before remarriage
		if (grief <= newparent.dyear) {
			var offspring = countKids(newparent);
			var newchance;
			switch(offspring) {
			case "0": newchance = (newparent.dyear - grief) * homo.RATE_remarry_barren; break;
			case "1": newchance = (newparent.dyear - grief) * homo.RATE_remarry_singleChild; break;
			default: newchance = (newparent.dyear - grief) * homo.RATE_remarry_multipleHeirs; break;
			}
			if(rollD(100) < newchance) {
				//newparent.myear = grief; // make sure remarriage date is correct
				partialSpouse = [];
				partialSpouse.parentNodeId = newparent.pid;
				partialSpouse.spouseId = newparent.pid;
				partialSpouse.generation = newparent.generation;
				partialSpouse.myear = grief;

				var spouse = finishPerson(partialSpouse);
				displayPerson(spouse); // display spouse
				linData[spouse.pid] = spouse;

				generateKids(newparent,spouse); // get kids
				grief = spouse.dyear;
			}
		}
	}

	function countKids(person) {
		// Determine current number of kids for parent
		var kidCount = 0;
		// As in getSiblingNames, we don't have to start from 0.
		for (var i=person.pid;i<linData.length;i++) {
			if (linData[i].parentId2 == person.pid || linData[i].parentId1 == person.pid) {
				kidCount++;
			}
		}		
		return kidCount;
	}
}

// UI management 

function generateLineage() {
	populateLineage();
	if ($("div#content div.resultsUi").is(":hidden") || ($("#lineageUi").is(":hidden") && $("#treeUi").is(":hidden") && $("#csvUi").is(":hidden"))) {
		$("div.tab").hide();
		$(".resultsUi").show();
		$("#lineageUi").show();
	}
}

function reseedLineage() {
	setSeedByDate();
	populateLineage();
}

function enableTab(buttonId) {
	$("div.tab").hide();
	$("#footer").show();
	switch (buttonId) {
		case "listTab":
			$("#lineageUi").show();
			break;
		case "treeTab":
			$("#footer").hide();
			//Tree display hack.
			$("#treeUi").css("width",Math.max($(window).width() - 25, linData.length * spaceFactor) + "px");
			$("#treeUi").show();
			break;
		case "csvTab":
			$("#csvUi").show();
			break;
		case "namesTab":
			$("#nameTables").show();
			break;
		case "instructionsTab":
			$("#instructionsUi").show();
			break;
	}
}

function populateLineage() {
	//Main function populates the lineage data structure and also fills in the list, tree, and CSV.

	// Reset/Update our random sequence based on the (possibly new) seed...
	Math.seedrandom(document.getElementById("seed").value);

	// Clear out the lineage, list, tree, and CSV.
	linData = [];
	$("ul#person-1").html("");
	$("#treeUi").html("");
	$("#csvtxt").val("#pid, name, gender, generation, byear, dyear, dage, myear, mage, ptype, clan, spouseId, parentId1, parentId2, parentNodeId\n");

	//Check the mode.
	if (document.startform.year.value != "" && !(isNaN(parseInt(document.startform.year.value)))) {
		currentYear = parseInt(document.startform.year.value);
		currentYearMode = true;
	} else {
		currentYearMode = false;
	}

	// Read in form data for person #1, add them to top of lineage chart.
	var partialPerson = serializePersonFromForm($("form#personForm"));
	var person = finishPerson(partialPerson,true);
	
	displayPerson(person);
	linData[person.pid] = person;

	// Read in (or produce) person #2, the spouse, and add them to the chart.
	var partialSpouse = serializePersonFromForm($("form#spouseForm"));
	var spouse = finishPerson(partialSpouse);

	displayPerson(spouse);
	linData[spouse.pid] = spouse;

	// Generate their direct desendants ...
	generateKids(person, spouse);

}

function finishPerson(person,mustLive) {
	//Finish a partial person, possibly based on their spouse.
	if ("spouseId" in person)
		var spouse = linData[person.spouseId];
	if ("parentId1" in person) {
		var parent1 = linData[person.parentId1];
		var parent2 = linData[person.parentId2];
	}

	if (!person.gender) {
		if (spouse && spouse.gender) {
			person.gender = getOppositeGender(spouse.gender);
		} else {
			person.gender = randgen();
		}
	}

	if (!("clan" in person)) {
		if (!parent1) 
			person.clan = homo.generateClan();
		else
			person.clan = (person.gender == parent1.gender) ? parent1.clan : parent2.clan;
	}

	if (!("generation" in person)) {
		if (spouse && spouse.generation) {
			person.generation = spouse.generation;
		} else {
			if (parent1)
				person.generation = parseInt(parent1.generation) + 1;
			else 
				person.generation = 0;
		}
	}

	if (!person.name)
		person.name = (parent1) ? generateUniqueName(person) : homo.generateName(person);

	if (spouse && (person.myear || spouse.myear)) {
		//For spouses, birth year is calculated from marriage year.
		if (!person.myear)
			person.myear = spouse.myear;
		if (!("byear" in person)) {
			person.mage = generateMarriageAge(person.gender);
			person.byear = person.myear - person.mage;
		} else {
			person.byear = parseInt(person.byear);
			person.mage = person.myear - person.byear;
		}
	} else {//Otherwise, determine birth year first.
		if (!("byear" in person))
			person.byear = 0;
		if (!("myear" in person)) {
			//here we determine a death age first so there's no assumption the person lives to marriage
			if (!mustLive && !("dyear" in person)) {
				person.dage = generateDeathAge();
				person.dyear = person.byear + person.dage;
			}
			person.mage = generateMarriageAge(person.gender);
			person.myear = person.byear + person.mage;
		} else {
			person.mage = person.myear - person.byear;
		}
	}

	if (!("dyear" in person)) {
		person.dage = generateDeathAge(person.mage);
		person.dyear = person.byear + person.dage;
	} else {
		person.dage = person.dyear - person.byear;
	}

	if (parent1) {
		//When there's a parent, we need to determine whether this kid really has a family.
		if ((person.myear > person.dyear) || (rollD(100) <= homo.RATE_bachelor_ette)) {
			//voluntary or accidental non-marriage
			person.family = false;
		} else if (person.gender == 'M') {
			if (homo.RATE_male > 50) {
				person.family = (rollD(100) <= (100 - homo.RATE_male));
			} else {
				person.family = true;
			}
		} else {//gender is F
			if (homo.RATE_male < 50) {
				person.family = (rollD(100) <= (homo.RATE_male));
			} else {
				person.family = true;
			}
		}
		if (person.family == false) {
			//retroactively null out the keys we used for calculation
			person.family = null;
			person.mage = null;
			person.myear = null;
		}
	}

	person.ptype = homo.generatePersonalityType();

	//In currentYearMode, we save the current age.
	if (currentYearMode)
		person.cage = getCurrentAge(person);

	if (!person.pid)
		person.pid = linData.length;

	return person;
}

function displayPerson(person,noCSV) {
	// Add a person to the HTML lineage list, tree, and CSV text box.

	//Don't display some persons when in currentYearMode.
	if (currentYearMode && person.byear > currentYear)
		return;
	if (currentYearMode && ("spouseId" in person) && person.myear > currentYear)
		return;

	// List section.
	var personHtml = "";
	personHtml += "<li><ul id='person" + person.pid + "' class='" + getColor(person) + "'>";
	personHtml += "<li id='personRow" + person.pid + "'" + ("spouseId" in person ? " class='spouse'>" : ">");
	personHtml += "<input type='text' size=12 onkeyup='if (event.keyCode == 13) {changeName(" + person.pid + ",this.value)};' value=\"" + person.name + "\"/>";
	personHtml += "<button onclick='generateNewName(" + person.pid + ");' title='Rename'>R</button>";
	personHtml += " " + person.gender + " <span class='lifeSpan'>" + person.byear + "&ndash;" + person.dyear + "</span>";
	if (currentYearMode)
		personHtml += " (<span class='currentAge'>" + getCurrentAge(person,true) + "</span>)";
	if (person.myear)
		personHtml += ", married in " +  person.myear + " at the age of " + person.mage;
	personHtml += ", died at the age of <span class='deathAge'>" +  person.dage + ".</span>";
	if (homo.getClan(person))
		personHtml += " <span class='clanSpan'>Clan: " + homo.getClan(person) + "</span>";
	personHtml += " <span title='" + homo.getPTypeName(person.ptype) + "'> MBTI:" + person.ptype + "</span>";
	if (!currentYearMode && person.family)
		personHtml += " <button id='family" + person.pid + "' onclick='generateFamily(" + person.pid + ")' title='Get Family'>Family</button>";
	personHtml += "</li></ul></li>";
	$("#person" + person.parentNodeId).append(personHtml);

	//Tree section.
	var treepLink = "<a href='#' id='treep" + person.pid + "' class='" + getColor(person) + " " + getGender(person) + "'>" + person.name + ((currentYearMode) ? " (<span class='currentAge'>" + getCurrentAge(person) + "</span>)"  : "") + "</a>";
	var treepHtml = "<li>" + treepLink + "</li>";
	if (person.pid == 0)
		$("div#treeUi").append("<ul>" + treepHtml + "</ul>");
	else if ("spouseId" in person)
		$("#treep" + person.spouseId).after(treepLink);
	else if ($("#treep" + person.parentNodeId).siblings("ul").length > 0)
		$("#treep" + person.parentNodeId).siblings("ul").append(treepHtml);
	else
		$("#treep" + person.parentNodeId).after("<ul>" + treepHtml + "</ul>");

	//CSV section.
	if (!noCSV) {
		var row = buildCsvRow(person);
		$("#csvtxt").val($("#csvtxt").val() + row + "\n");
	}
}

function updatePerson(person) {
	//Update display of person for premature death in childbirth.
	$("#personRow" + person.pid + " span.lifeSpan").html(person.byear + "&ndash;" + person.dyear);
	$("#personRow" + person.pid + " span.deathAge").html(person.dage + ".");
	$("#personRow" + person.pid + " span.currentAge").html(getCurrentAge(person,true));
	$("#treep" + person.pid + " span.currentAge").html(getCurrentAge(person));
	updatePersonCSV(person);
}

// Functions for generating the comma-separated value box.

function buildCsvRow(p) {
	var row = [p.pid, p.name, p.gender, p.generation, p.byear, p.dyear, p.dage, p.myear,
			   p.mage, p.ptype, p.clan, p.spouseId, p.parentId1, p.parentId2, p.parentNodeId].join(',');
	// Adjusting this?  Adjust the header in populateLineage.
	return row;
}

function loadCsv() {
	//Update other data from the CSV text box (presumably after editing).
	readCsv();
	$("ul#person-1").html("");
	$("#treeUi").html("");
	for (var i = 0; i < linData.length; i++)
		displayPerson(linData[i],true);

	function readCsv() {
		//Read csv from the text box back into the linData array.
		var lines = $("#csvtxt").val().replace(/\r\n/g, "\n").split("\n");
		//var firstIndex = 1;
		var personRow = new Array();
		var indexRow = lines[0].split(",");
		linData = [];
		for (var i = 1; i < lines.length; i++) {
			personRow = lines[i].split(',');
			linData[personRow[0]] = {};
			for (var j = 0; j < indexRow.length; j++) {
				if (personRow[j] != "") {
					switch (j) {
					case 0: 
						linData[personRow[0]].pid = parseInt(personRow[j]);
						break;
					case 1: 
						linData[personRow[0]].name = personRow[j];
						break;
					case 2: 
						linData[personRow[0]].gender = personRow[j];
						break;
					case 3: 
						linData[personRow[0]].generation = parseInt(personRow[j]);
						break;
					case 4: 
						linData[personRow[0]].byear = parseInt(personRow[j]);
						break;
					case 5: 
						linData[personRow[0]].dyear = parseInt(personRow[j]);
						break;
					case 6: 
						linData[personRow[0]].dage = parseInt(personRow[j]);
						break;
					case 7: 
						linData[personRow[0]].myear = parseInt(personRow[j]);
						break;
					case 8: 
						linData[personRow[0]].mage = parseInt(personRow[j]);
						break;
					case 9: 
						linData[personRow[0]].ptype = personRow[j];
						break;
					case 10: 
						linData[personRow[0]].clan = parseInt(personRow[j]);
						break;
					case 11: 
						linData[personRow[0]].spouseId = parseInt(personRow[j]);
						break;
					case 12: 
						linData[personRow[0]].parentId1 = parseInt(personRow[j]);
						break;
					case 13: 
						linData[personRow[0]].parentId2 = parseInt(personRow[j]);
						break;
					case 14: 
						linData[personRow[0]].parentNodeId = parseInt(personRow[j]);
						break;
					}
				}
			}
		}
	}
}

function updatePersonCSV(person) {
	var lines = $("#csvtxt").val().replace(/\r\n/g, "\n").split("\n");
	lines[person.pid + 1] = buildCsvRow(person);
	var revisedCSV = lines.join("\n");
	$("#csvtxt").val(revisedCSV);
}

// And we're ready!

$( document ).ready(function() {
	//initialize the form
	setSeedByDate();
	$("select#clan1SELECT").append("<option value=''>Random Clan</option>");
	$("select#clan2SELECT").append("<option value=''>Random Clan</option>");
	
	//Race switcher:
	for (var i=0; i<raceSpace.length; i++) {
		$("select#raceSELECT").append("<option value='" + i + "'" + (raceSpace[i].isDefault ? "selected=selected" : "") + ">" + raceSpace[i].displayName +  "</option>");
		if (raceSpace[i].isDefault) {
			var homo = raceSpace[i].object;
			homo.initializeClans();
			homo.generateNameTable();
		}
	}
	$('#startform').submit(function () {
		return false;
	});
});


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// name_generator.js
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/
// Some edits by mcdemarco for use in Random Family Tree Generator v3.0.

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct markov chain from list of names

  function construct_chain (list) {
    var chain = {};

    for (var i = 0; i < list.length; i++) {
      var names = list[i].split(/\s+/);
      chain = incr_chain(chain,'parts',names.length);

      for (var j = 0; j < names.length; j++) {
        var name = names[j];
        chain = incr_chain(chain,'name_len',name.length);

        var c = name.substr(0,1);
        chain = incr_chain(chain,'initial',c);

        var string = name.substr(1);
        var last_c = c;

        while (string.length > 0) {
          var c = string.substr(0,1);
          chain = incr_chain(chain,last_c,c);

          string = string.substr(1);
          last_c = c;
        }
      }
    }
    return scale_chain(chain);
  }
  function incr_chain (chain, key, token) {
    if (chain[key]) {
      if (chain[key][token]) {
        chain[key][token]++;
      } else {
        chain[key][token] = 1;
      }
    } else {
      chain[key] = { token: 1 };
    }
    return chain;
  }
  function scale_chain (chain) {
    var table_len = {};

    for (key in chain) {
      table_len[key] = 0;

      for (var token in chain[key]) {
        var count = chain[key][token];
        var weighted = Math.floor(Math.pow(count,1.3));

        chain[key][token] = weighted;
        table_len[key] += weighted;
      }
    }
    chain['table_len'] = table_len;
    return chain;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// construct name from markov chain

  function markov_name (chain) {
    var parts = select_link(chain,'parts');
    var names = [];

    for (var i = 0; i < parts; i++) {
      var name_len = select_link(chain,'name_len');
      var c = select_link(chain,'initial');
      var name = c;
      var last_c = c;

      while (name.length < name_len) {
        c = select_link(chain,last_c);
        name += c;
        last_c = c;
      }
      names.push(name);
    }
    return names.join(' ');
  }
  function select_link (chain, key) {
    var len = chain['table_len'][key];
    var idx = Math.floor(Math.random() * len);

    var t = 0;
	for (var token in chain[key]) {
		if (token != "token") {
			t += chain[key][token];
			if (idx < t) { return token; }
		}
    }
    return '-';
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
