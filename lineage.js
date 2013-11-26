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
var isSafari = false;
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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getColor(person) {
	return "color" +  ( (parseInt(person.generation)%13 + 1));
}

function getCurrentAge(person) {
	//test for currentYearMode before calling
	return (person.dyear > currentYear) ? (currentYear - person.byear) : "d." + person.dage;
}

function getGender(person) {
	//Translate gender to a word; e.g. in css class for the tree view
	return (person.gender == "F") ? "female" : "male";
}

function selectRace() {
	//Human type/fantasy race selection.
	homo = raceSpace[$("select#raceSELECT").val()].object;
}

function serializePersonFromForm(form) {
	//Convert a jQuery form object into a partial person object.
	var o = {};
	var a = form.serializeArray();
	$.each(a, function() {
		if (this.value && this.value != "")
			o[this.name] = this.value;
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
	while (tempSiblings.indexOf(tempName) >= 0)
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
	$("a#treep" + pid).html(newname + (currentYearMode ? " (" + person.cage + ")" : "" ));
}

function getSiblingNames(person) {
	//Return sibling names.
	var siblings = [];
	if (!(person.parentId2)) {
		//If we don't have a parent recorded then we won't have any siblings for person.
		return siblings;
	}
	//don't need to start i at zero because child pids are always greater than parent pids.
	for (i=person.parentId2;i<linData.length;i++) {
		if (linData[i].parentId2 == person.parentId2 && linData[i].pid != person.pid) {
			siblings.push(linData[i].name);
		}
	}
	return siblings;
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

function generateDeathAge(myear , mage) { // get age they die at
	var dage;
	if (rollD(100) < homo.RATE_dchildhood) {
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

		yom += 8 + rollD(8);  // delay before trying for another kid.
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
	displayPerson(spouse,true); // display spouse
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
				displayPerson(spouse,true); // display spouse
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
		for (i=person.pid;i<linData.length;i++) {
			if (linData[i].parentId2 == person.pid || linData[i].parentId1 == person.pid) {
				kidCount++;
			}
		}		
		return kidCount;
	}
}

// UI management 

function enableLineageUi() {
	$(".resultsUi").show();
	disableCsvUi();
	disableNamesUi();
	disableTreeUi();
	$("#lineageUi").show();
}

function reseed() {
	setSeedByDate();
	//enableLineageUi();
	populateLineage();
	resetCsvTxt();
}

function enableCsvUi() {
	disableLineageUi();
	disableNamesUi();
	disableTreeUi();
	$("#csvUi").show();
	if ($("#csvtxt").data("headcount") != linData.length)
		populateCsv();
}

function enableNamesUi() {
	disableCsvUi();
	disableLineageUi();
	disableTreeUi();
	homo.generateNameTable();
	$(".namesUi").show();
}

function enableTreeUi() {
	disableCsvUi();
	disableLineageUi();
	disableNamesUi();
	//$("#intro").hide();
	$("#footer").hide();
	//Safari doesn't need hacking.
	if (!isSafari)
		$("#treeUi").css("width",Math.max($(window).width() - 25, linData.length * spaceFactor) + "px");
	$("#treeUi").show();
}

function disableCsvUi() {
	$("#csvUi").hide();
}

function disableLineageUi() {
	$("#lineageUi").hide();
}

function disableNamesUi() {
	$(".namesUi").hide();
}

function disableTreeUi() {
	$("#treeUi").hide();
}

// populateLineage():
//   The big kahuna.  Take the parameters (possibly sparse) and produce a geneology
//   that conforms to the constraints.  Reproducibly.
function populateLineage() {
	// Reset/Update our random sequence based on the (possibly new) seed...
	Math.seedrandom(document.getElementById("seed").value);

	// Clear out the lineage...
	linData = [];
	$("div#person-1").html("");

	//Check the mode.
	if (document.startform.year.value != "" && !(isNaN(parseInt(document.startform.year.value)))) {
		currentYear = parseInt(document.startform.year.value);
		currentYearMode = true;
	} else {
		currentYearMode = false;
	}

	//Clear the CSV?
	resetCsvTxt();

	//Clear the tree
	$("#treeUi").html("");

	// Read in form data for person #1, add them to top of lineage chart.
	var partialPerson = serializePersonFromForm($("form#personForm"));
	var person = finishPerson(partialPerson);
	
	displayPerson(person);
	linData[person.pid] = person;

	// Read in (or produce) person #2, the spouse, and add them to the chart.
	var partialSpouse = serializePersonFromForm($("form#spouseForm"));
	var spouse = finishPerson(partialSpouse);

	displayPerson(spouse, true);
	linData[spouse.pid] = spouse;

	// Generate their direct desendants ...
	generateKids(person, spouse);
}

function finishPerson(person) {
	//Finish a partial person, possibly based on their spouse.
	if ("spouseId" in person)
		var spouse = linData[person.spouseId];
	if ("parentId1" in person) {
		var parent1 = linData[person.parentId1];
		var parent2 = linData[person.parentId1];
	}

	if (!person.gender) {
		if (spouse && spouse.gender) {
			person.gender = getOppositeGender(spouse.gender);
		} else {
			person.gender = randgen();
		}
	}

	if (!("clan" in person) && !parent1) 
		person.clan = homo.generateClan();
	else
		person.clan = (person.gender == parent1.gender) ? parent1.clan : parent2.clan;

	if (!("generation" in person) || isNaN(parseInt(person.generation))) {
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

	if (spouse && (person.myear || spouse.myear)) {//For spouses, birth year is calculated from marriage year.
		if (!person.myear)
			person.myear = spouse.myear;
		if (!("byear" in person) || isNaN(parseInt(person.byear)) ) {
			person.mage = generateMarriageAge(person.gender);
			person.byear = person.myear - person.mage;
		} else {
			person.byear = parseInt(person.byear);
			person.mage = person.myear - person.byear;
		}
	} else {//Otherwise, determine birth year first.
		if (!("byear" in person) || isNaN(parseInt(person.byear))) {
			person.byear = 0;
		} else {
			person.byear = parseInt(person.byear);
		}

		if (!("myear" in person) || isNaN(parseInt(person.myear))) {
			person.mage = generateMarriageAge(person.gender);
			person.myear = person.byear + person.mage;
		} else {
			person.myear = parseInt(person.myear);
			person.mage = person.myear - person.byear;
		}
	}

	if (!("dyear" in person) || isNaN(parseInt(person.dyear))) {
		person.dage = generateDeathAge(person.myear, person.mage);
		person.dyear = person.byear + person.dage;
	} else {
		person.dyear = parseInt(person.dyear);
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

function displayPerson(person,isSpouse) {
	// Add a person to the HTML lineage list and tree

	//Don't display some persons when in currentYearMode.
	if (currentYearMode && person.byear > currentYear)
		return;
	if (currentYearMode && isSpouse && person.myear > currentYear)
		return;

	// List section.
	var personHtml = "";
	personHtml += "<ul id='person" + person.pid + "' class='" + getColor(person) + "'>";
	personHtml += "<li" + ("spouseId" in person ? " class='spouse'>" : ">");
	personHtml += "<input type='text' size=8 onkeyup='if (event.keyCode == 13) {changeName(" + person.pid + ",this.value)};' value=\"" + person.name + "\"/>";
	personHtml += "<button onclick='generateNewName(" + person.pid + ");' title='Rename'>R</button>";
	personHtml += " <span class='infoSpan'>" + person.gender + "</span> <span class='infoSpan'>" + person.byear + "&ndash;" + person.dyear;
	if (currentYearMode)
		personHtml += " (age " +  person.cage + ")";
	if (person.myear)
		personHtml += ", married in " +  person.myear + " at the age of " + person.mage;
	personHtml += ", died at the age of " +  person.dage + ".</span>";
	if (homo.getClan(person))
		personHtml += " <span class='clanSpan'>Clan: " + homo.getClan(person) + "</span>";
	personHtml += " <span title='" + homo.getPTypeName(person.ptype) + "'> MBTI:" + person.ptype + "</span>";
	if (!currentYearMode && person.family)
		personHtml += " <button id='family" + person.pid + "' onclick='generateFamily(" + person.pid + ")' title='Get Family'>Family</button>";
	personHtml += "</li></ul>";

	$("#person" + person.parentNodeId).append(personHtml);

	//Tree section.
	var treepLink = "<a href='#' id='treep" + person.pid + "' class='" + getColor(person) + " " + getGender(person) + "'>" + person.name + ((currentYearMode) ? " (" + person.cage + ")"  : "") + "</a>";
	var treepHtml = "<li>" + treepLink + "</li>";
	if (person.pid == 0)
		$("div#treeUi").append("<ul>" + treepHtml + "</ul>");
	else if ("spouseId" in person)
		$("#treep" + person.spouseId).after(treepLink);
	else if ($("#treep" + person.parentNodeId).siblings("ul").length > 0)
		$("#treep" + person.parentNodeId).siblings("ul").append(treepHtml);
	else
		$("#treep" + person.parentNodeId).after("<ul>" + treepHtml + "</ul>");

}

// Functions for generating the comma-separated value box.

function populateCsv() {
	//Do it the easy way, using the data structure.
	var row = "";
	if ($("#csvtxt").val() == "") 
		$("#csvtxt").val("#pid, name, gender, generation, byear, dyear, dage, myear, mage, ptype, clan, spouse, parent1, parent2\n");
	//Assuming there's no way to trim the tree; if you add one, just regenerate the whole thing instead.
	var lastCount = ($("#csvtxt").data("headcount") > 0) ? $("#csvtxt").data("headcount") : 0;
	for (i=lastCount;i<linData.length;i++) {
		row = buildCsvRow(linData[i]);
		$("#csvtxt").val($("#csvtxt").val() + row + "\n");
	}
	//Note how many people we had when we generated.
	$("#csvtxt").data("headcount",linData.length);

	function buildCsvRow(p) {
		var row = [p.pid, p.name, p.gender, p.generation, p.byear, p.dyear, p.dage, p.myear,
				   p.mage, p.ptype, p.clan, p.spouseId, p.parentId1, p.parentId2].join(',');
		// Adjusting this?  Adjust the header in populateCsv.
		return row;
	}
}

function resetCsvTxt() {
	$("#csvtxt").val("");
}


// And we're ready!

$( document ).ready(function() {
	//initialize the form
	setSeedByDate();
	
	//Race switcher:
	for (i=0; i<raceSpace.length; i++) {
		$("select#raceSELECT").append("<option value='" + i + "'" + (raceSpace[i].isDefault ? "selected=selected" : "") + ">" + raceSpace[i].displayName +  "</option>");
		if (raceSpace[i].isDefault)
			homo = raceSpace[i].object;
	}

	$("select#clan1SELECT").append("<option value=''>Random Clan</option>");
	$("select#clan2SELECT").append("<option value=''>Random Clan</option>");
	var appendage = "";
	for  (var i = 0; i < homo.syllables.length; i++) {
		appendage = "<option value='" + i + "'>" + homo.syllables[i][0];
		$("select#clan1SELECT").append(appendage + "foaf</option>");
		$("select#clan2SELECT").append(appendage + "khaekh</option>");
	}
	$('#startform').submit(function () {
		return false;
	});
	//Browser check for tree display hackery.
	var ua = navigator.userAgent.toLowerCase();
	isSafari = ((ua.indexOf('safari') >= 0) && (ua.indexOf('chrome') < 0));
});
