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

var RATE_remarry_barren = 0; //15;
var RATE_remarry_singleChild = 0; //5;
var RATE_remarry_multipleHeirs = 0; //3;
var RATE_bachelor_ette = 4;  //chance of refusal to marry, both sexes; otherwise married at available spouse rate

var RATE_male = 75; // Male/female ratio at birth.  Should be 51% for humans.

var MIN_fmage = 16; // Minimum age of marriage; cut off below this.
var MEAN_fmage = 32; // Average age of marriage on a normal curve. % should be 13-21 for medieval human women
var STD_fmage = 5; // Standard deviation in age of marriage.
var MIN_mmage = 16; // Minimum age of marriage; cut off below this.
var MEAN_mmage = 36; // Average age of marriage on a normal curve.
var STD_mmage = 10; // Standard deviation in age of marriage.

var MEAN_dage = 256; // Average age of death on a normal curve.
var STD_dage = 36; // Standard deviation in age of death.

//To do: incorporate odds of human premature death:
// 50% dies as a child or teenager
// 25% die in their 20-30's
// 12.5% die in their 40-50's
// 12.5% die in their 60-70's

var globalPID = 0;//keeps track of each persons ID

var linData = [];//full data structure for genealogy

var currentYear; //determines timing of data output
var currentYearMode = false;

var syllables = [
	["'A","'a","'"],
	["Ko","ko","k"],
	["Te","te","t"],
	["Sae","sae","s"],
	["Pi","pi","p"],
	["Qoa","qoa","q"],
	["Cea","ctea","ct"],
	["Tsu","tsu","ts"],
	["Hae","hae","h"],
	["Goa","goa","g"],
	["Di","di","d"],
	["Zea","zea","z"],
	["Bu","bu","b"],
	["Ra","rga","rg"],
	["De","dge","dg"],
	["Dzo","dzo","dz"],
	["Hea","hhea","hh"],
	["Xa","xa","x"],
	["Thu","thu","th"],
	["She","she","sh"],
	["Fo","fo","f"],
	["Khae","khae","kh"],
	["Kli","kli","kl"],
	["Choa","tchoa","tch"],
	["`E","`e","`"],
	["Ghae","ghae","gh"],
	["Dho","dho","dh"],
	["Zhi","zhi","zh"],
	["Voa","voa","v"],
	["Ghea","rghea","rgh"],
	["Glu","glu","gl"],
	["Ja","dja","dj"],
	["Mi","hmi","hm"],
	["Ngea","ngea","ng"],
	["Noa","noa","n"],
	["Snu","snu","sn"],
	["Ma","ma","m"],
	["Ne","nhe","nh"],
	["Nlo","nlo","nl"],
	["Mbae","mbae","mb"],
	["Rhu","rrhu","rrh"],
	["Le","lte","lt"],
	["Rra","rra","rr"],
	["Ro","rdo","rd"],
	["Brae","brae","br"],
	["Rhi","rhi","rh"],
	["Rlo","rlo","rl"],
	["Trea","trea","tr"],
	["Hro","hro","hr"],
	["Gwi","gwi","gw"],
	["Rae","rae","r"],
	["Swoa","swoa","sw"],
	["Bhea","bhea","bh"],
	["Whu","whu","wh"],
	["Ya","ya","y"],
	["Tle","tle","tl"],
	["Hwoa","hwoa","hw"],
	["Llu","llu","ll"],
	["Lea","lea","l"],
	["Zla","zla","zl"],
	["Ye","yye","yy"],
	["Wo","wo","w"],
	["Hlae","hlae","hl"],
	["Dzli","dzli","dzl"]
];

// basic functions

function getPersonFromPid(pid) {
	// Recover a 'person' object from the data structure by pid
    return linData[pid-1];
}

function getColor(person) {
	return "color" +  ( (parseInt(person.generation)%13 + 1));
}

function getCurrentAge(person) {
	//test for currentYearMode before calling
	return (person.dyear > currentYear) ? (currentYear - person.byear) : "d." + person.dage;
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

// *** begin cool dwarf name generation ***
function generateName(person) {
	var roll1 = rollD(syllables.length) - 1;
	return syllables[roll1][0] + syllables[parseInt(person.clan)][1] + ((person.gender == "M") ? syllables[parseInt(person.generation)%syllables.length][2] : "");
}

function generateUniqueName(person) {
	//generateName with a sibling check
	//note that the program will hang here if enough distinct names aren't available
	var tempSiblings = getSiblingNames(person);
	var tempName = generateName(person);
	while (tempSiblings.indexOf(tempName) >= 0)
		tempName = generateName(person);
	return tempName;
}

function generateNewName(pid) {
    var person = getPersonFromPid(pid);
	var newname = generateUniqueName(person);
	//update data structure and html
	linData[pid-1].name = newname;
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
// *** end name generation **

function randgen() { // random gender, weighted for dwarves
    var gen;
    (rollD(100)<RATE_male) ? gen ="M" : gen="F";
    return gen;
}

function randclan() { // random clan
    return rollD(syllables.length) - 1;
}

// *** begin personality type generation code ***
function generatePersonalityType() {
    var EI=typeEI();
    var SN=typeSN();
    var TF=typeTF();
    var JP=typeJP();
    var pType=EI+SN+TF+JP;
    return pType;

	// these are the 4 axis of the Myers-Briggs personality types
	// their distribution should approximate their real life frequency
	function typeEI() { 
		var EI="";
		var roll = rollD(4);
		(roll>1) ? EI="E" :	EI="I";
		return EI;
	}
	function typeSN() {
		var SN="";
		var roll = rollD(4);
		(roll>1) ? SN="S" : SN="N";
		return SN;
	}
	function typeTF() {
		var TF="";
		var roll = rollD(2);
		(roll==2) ?	TF="T" : TF="F";
		return TF;
	}
	function typeJP() {
		var JP="";
		var roll = rollD(2);
		(roll==2) ? JP="J":	JP="P";
		return JP;
	}
}

function getPTypeName(pType) {
	// Apply label to personality type.
    var typeName = "";
    switch (pType) {
    case "ISFP": typeName="(Artisan/Composer)"; break;
    case "ISTP": typeName="(Artisan/Crafter)"; break;
    case "ESFP": typeName="(Artisan/Performer)"; break;
    case "ESTP": typeName="(Artisan/Promoter)"; break;
    case "ISFJ": typeName="(Guardian/Protector)"; break;
    case "ISTJ": typeName="(Guardian/Inspector)"; break;
    case "ESFJ": typeName="(Guardian/Provider)"; break;
    case "ESTJ": typeName="(Guardian/Supervisor)"; break;
    case "INFP": typeName="(Idealist/Healer)"; break;
    case "INFJ": typeName="(Idealist/Counselor)"; break;
    case "ENFP": typeName="(Idealist/Champion)"; break;
    case "ENFJ": typeName="(Idealist/Teacher)"; break;
    case "INTP": typeName="(Rational/Architect)"; break;
    case "INTJ": typeName="(Rational/Mastermind)"; break;
    case "ENTP": typeName="(Rational/Inventor)"; break;
    case "ENTJ": typeName="(Rational/Field Marshal)"; break;
    default: typeName=" --Oops! I didn't get the type";
    }
    return typeName;
}
// *** end personality type generation code ***

//Person construction functions

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
		mage = rnd(MEAN_mmage,STD_mmage);
		if (mage < MIN_mmage) 
			mage = MIN_mmage;
    } else {
		mage = rnd(MEAN_fmage,STD_fmage); // women 
		if (mage < MIN_fmage) 
			mage = MIN_fmage;
	}
	return mage;
}

function generateDeathAge(myear , mage) { // get age they die at
    var dage;
	dage = rnd(MEAN_dage,STD_dage);

    if (dage && mage) {  // Generating spouse, so should be alive when married...
		while (dage < mage) {   // if died before married, set to marriage.
			dage = mage;
		}
    }
    return dage;
}

function generateFertility(fertyear, girl) { // return fertility based on age
    var chance = 0;
/* humans
    if (fertyear<14) {chance=10;}
    if (fertyear==14) {chance=20;}
    if (fertyear==15) {chance=40;}
    if (fertyear==16) {chance=60;}
    if (fertyear==17) {chance=80;}
    if (fertyear>17 && fertyear<30) {chance=98;}
    if (fertyear>30 && fertyear<35) {chance=80;}
    if (fertyear>35 && fertyear<40) {chance=40;}
    if (fertyear>40 && fertyear<45) {chance=20;}
    if (fertyear>44) {chance=3;}
    if (fertyear>52) {chance=1;}  // Only non-zero because of magic.
*/

/* dwarves */
	if (fertyear > 16 && fertyear <= 20) chance = 10;
	if (fertyear > 20 && fertyear <= 24) chance = 20;
	if (fertyear > 24 && fertyear <= 28) chance = 30;
	if (fertyear > 28 && fertyear <= 30) chance = 60;
	if (fertyear > 30 && fertyear <= 32) chance = 80;
	if (fertyear > 32 && fertyear <= 48) chance = 98;
	if (fertyear > 48 && fertyear <= 64) chance = 80;
	if (fertyear > 64 && fertyear <= 96) chance = 60;
	if (fertyear > 96 && fertyear <= 110) chance = 40;
	if (fertyear > 110 && fertyear <= 128) chance = 30;
	if (fertyear > 128 && fertyear <= 146) chance = 20;
	if (fertyear > 146 && fertyear <= 164) chance = 10;
	if (fertyear > 164 && fertyear <= 200) chance = 5;
	if (fertyear > 200 && fertyear <= 236) chance = 3;
	if (fertyear > 236) chance = 1;

/* test low fertility - trouble with tree display
	if (fertyear > 48 && fertyear <= 52) chance = 25;
*/

	if (girl > 0)
		return chance/(8 * girl);
	else
		return chance;
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
	if ( rollD(100) <= generateFertility(fertstart+yom,girl) ) {
	    var kid = new Object();

	    kid.parentNodeId = spouse.pid;
	    kid.parentId1 = person.pid;
	    kid.parentId2 = spouse.pid;
	    globalPID++;
	    kid.pid = globalPID;

	    kid.gender=randgen();
		if (kid.gender == 'F')
			girl = girl + 1;
		if (kid.gender == person.gender) {
			kid.clan = person.clan;
			kid.generation = parseInt(person.generation) + 1;
		} else { 
			kid.clan = spouse.clan;
			kid.generation = parseInt(spouse.generation) + 1;
		}
	    kid.name=generateUniqueName(kid);

	    kid.byear=spouse.myear + yom;
	    kid.dage=generateDeathAge();
	    kid.dyear = kid.byear + kid.dage;

	    kid.mage = generateMarriageAge(kid.gender);
	    kid.myear = kid.byear + kid.mage;

	    //kid.family = true;
	    if ((kid.myear > kid.dyear) || (rollD(100) <= RATE_bachelor_ette)) {
			//voluntary or accidental non-marriage
			kid.family = false;
	    } else if (kid.gender == 'M') {
			if (RATE_male > 50) {
				kid.family = (rollD(100) <= (100 - RATE_male));
			} else {
				kid.family = true;
			}
		} else {//gender is F
			if (RATE_male < 50) {
				kid.family = (rollD(100) <= (RATE_male));
			} else {
				kid.family = true;
			}
		}

		if (kid.family == false) {
			kid.family = null;
			kid.mage = null;
			kid.myear = null;
		}

	    kid.ptype=generatePersonalityType();
		//In currentYearMode, we save the current age.
		if (currentYearMode)
			kid.cage = getCurrentAge(kid);

	    displayPerson(kid);
		linData[kid.pid-1] = kid;

		//In currentYearMode, we do depth-first generation of people.
		if (currentYearMode && kid.family && kid.myear <= currentYear)
			generateFamily(kid.pid);

	    yom += 8 + rollD(8);  // delay before trying for another kid.
	}
	yom++;
    }
}

function generateFamily(pid) {
	// Generate a person's geneological contribution to the family tree,
	// including children and remarriages (and further children).
    var newparent = getPersonFromPid(pid);

    // As we are generating their descendents, hide their 'generate' button
    $("#family"+pid).hide();

	var spouse = generateSpouse(newparent); // get spouse
	displayPerson(spouse,true); // display spouse
	generateKids(newparent, spouse); // get kids
	
	var grief = spouse.dyear;
	while (newparent.dyear >= grief) { // check for remarriage until death
		grief += rollD(2)+rollD(2)+rollD(2)-2; // delay before remarriage
		newparent.myear = grief; // make sure remarriage date is correct
		
		if (newparent.myear <= newparent.dyear) {
			var offspring = countKids(newparent);
			var newchance;
			switch(offspring) {
			case "0": newchance = (newparent.dyear - grief) * RATE_remarry_barren; break;
			case "1": newchance = (newparent.dyear - grief) * RATE_remarry_singleChild; break;
			default: newchance = (newparent.dyear - grief) * RATE_remarry_multipleHeirs; break;
			}
			if(rollD(100) < newchance) {
				console.log("Remarried!");
				spouse = generateSpouse(newparent); // get spouse
				displayPerson(spouse,true); // display spouse
				generateKids(newparent,spouse); // get kids
				grief = spouse.dyear;
			}
		}
	}

	//console.log("Person " + newparent.name + " has " + countKids(newparent) + " kids.");

	function generateSpouse(person) {
		var spouse = new Object();
		
		spouse.parentNodeId = person.pid;
		spouse.spouseId = person.pid;
		
		globalPID++;
		spouse.pid = globalPID;

		spouse.gender = getOppositeGender(person.gender);
		spouse.clan = randclan();
		spouse.generation = person.generation;
		spouse.name = generateName(spouse);

		spouse.myear = person.myear;
		spouse.mage = generateMarriageAge(spouse.gender);
		spouse.byear = spouse.myear - spouse.mage;
		spouse.dage = generateDeathAge(spouse.myear,spouse.mage);
		spouse.dyear = spouse.byear+spouse.dage;
		
		spouse.ptype = generatePersonalityType();

		//In currentYearMode, we save the current age.
		if (currentYearMode)
			spouse.cage = getCurrentAge(spouse);
		
		linData[globalPID-1] = spouse;
		return spouse;
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
	generateNameTable();
	$(".namesUi").show();
}

function enableTreeUi() {
    disableCsvUi();
    disableLineageUi();
	disableNamesUi();
    //$("#intro").hide();
    $("#footer").hide();
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
    globalPID = 0;
	linData = [];
	$("div#person0").html("");

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
    var person = new Object();
    person.parentNodeId = globalPID;

    globalPID++;
    person.pid = globalPID;

	person.clan = (document.startform.clan1.value > -1) ? document.startform.clan1.value : randclan();
	person.gender = (document.startform.gender1.value != "x") ? document.startform.gender1.value : randgen();
    person.generation = (document.startform.generation1.value != "" && !(isNaN(parseInt(document.startform.generation1.value)))) ? parseInt(document.startform.generation1.value) : 0;
    person.name = (document.startform.name1.value) ? document.startform.name1.value : generateName(person);
    person.byear = (document.startform.born1.value) ? parseInt(document.startform.born1.value) : 0;

	if (document.startform.married1.value) {
		person.myear = document.startform.married1.value;
		person.mage = person.myear - person.byear;
	} else {
		person.mage = generateMarriageAge(person.gender);
		person.myear = person.byear + person.mage;
	}

    if (document.startform.died1.value) {
		person.dyear = parseInt(document.startform.died1.value);
		person.dage = person.dyear - person.byear;
    } else {
		person.dage = generateDeathAge(person.myear, person.mage);
		person.dyear = person.byear + person.dage;
    }

    person.ptype = generatePersonalityType();

	//In currentYearMode, we save the current age.
	if (currentYearMode)
		person.cage = getCurrentAge(person);
    
	displayPerson(person);
	linData[person.pid-1] = person;

    // Read in (or produce) person #2, the spouse, and add them to the chart.
    var spouse = new Object();
    spouse.parentNodeId = globalPID;
    spouse.spouseId = globalPID;
    globalPID++;
    spouse.pid = globalPID;

	spouse.clan = (document.startform.clan2.value > -1) ? document.startform.clan2.value : randclan();
    spouse.generation = (document.startform.generation2.value != "" && !(isNaN(parseInt(document.startform.generation2.value)))) ? parseInt(document.startform.generation2.value) : person.generation;

    spouse.gender = getOppositeGender(person.gender);
    spouse.name = (document.startform.name2.value) ? document.startform.name2.value : generateName(spouse);
    spouse.myear = person.myear;

	if (document.startform.born2.value) {
		spouse.byear = parseInt(document.startform.born2.value);
		spouse.mage = spouse.myear - spouse.byear;
	} else {
		spouse.mage = generateMarriageAge(spouse.gender);
		spouse.byear = spouse.myear - spouse.mage;
	}
    if (document.startform.died2.value) {
		spouse.dyear = parseInt(document.startform.died2.value);
		spouse.dage = spouse.dyear - spouse.byear;
    } else {
		spouse.dage = generateDeathAge(spouse.myear, spouse.mage);
		spouse.dyear = spouse.byear + spouse.dage;
    }

    spouse.ptype=generatePersonalityType();
	//In currentYearMode, we save the current age.
	if (currentYearMode)
		spouse.cage = getCurrentAge(spouse);

	displayPerson(spouse, true);
	linData[spouse.pid-1] = spouse;

    // Generate their direct desendants ...
    generateKids(person, spouse);
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
	personHtml += "<li><input type='text' size=8 value=\"" + person.name + "\"/>";
	personHtml += "<button onclick='generateNewName(" + person.pid + ");' title='Rename'>R</button>";
	personHtml += " <span class='infoSpan'>" + person.gender + "</span> <span class='infoSpan'>" + person.byear + "&ndash;" + person.dyear;
	if (currentYearMode)
		personHtml += " (age " +  person.cage + ")";
	if (person.myear)
		personHtml += ", married in " +  person.myear + " at the age of " + person.mage;
	personHtml += ", died at the age of " +  person.dage + ".</span>";
	personHtml += " <span class='clanSpan'>Clan: " + syllables[parseInt(person.clan)][0] + (person.gender == 'M' ? "foaf" : "khaekh") + "</span>";
	personHtml += " <span title='" + getPTypeName(person.ptype) + "'> MBTI:" + person.ptype + "</span>";
	if (!currentYearMode && person.family)
		personHtml += " <button id='family" + person.pid + "' onclick='generateFamily(" + person.pid + ")' title='Get Family'>Family</button>";
	personHtml += "</li></ul>";

	$("#person" + person.parentNodeId).append(personHtml);

	//Tree section.
	var treepLink = "<a href='#' id='treep" + person.pid + "' class='" + getColor(person) + "'>" + person.name + ((currentYearMode) ? " (" + person.cage + ")"  : "") + "</a>";
	var treepHtml = "<li>" + treepLink + "</li>";
	if (person.pid == 1)
		$("div#treeUi").append("<ul>" + treepHtml + "</ul>");
	else if (person.spouseId)
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

// Down to a single seeding function.

function setSeedByDate() {
	$("input#seed").val(new Date().getTime());
}

// Functions for showing the name inventory.

function generateNameTable() {
	if ($("div#nameTables").html() != "") {
		return;
	}
	var table = "<table>";
	for (i=0; i<syllables.length; i++) {
		if (i%8 == 0) table = table + "<tr>";
		table = table + "<td><div onclick='$(this).siblings().show();'>Clan " + syllables[i][0] + "khaekh</div><table style='display:none;'>";
		for (j=0; j<syllables.length; j++) {
			if (j%8 == 0) table = table + "<tr>";
			var tableId = "table-" + i + "-" + j;
			table = table + "<td><span onclick='$(\"#" + tableId + "\").show()" + "' title='Clan " + syllables[i][0] + "foaf'>" + syllables[j][0] + syllables[i][1] + "</span><table id = '" + tableId + "' style='display:none;'>";
			for (k=0; k<syllables.length; k++) {
				if (k%8 == 0) table = table + "<tr>";
				table = table + "<td>" + syllables[j][0] + syllables[i][1] + syllables[k][2] + "</td>";
				if (k%8 == 7) table = table + "</tr>";
			}
			table = table + "</table></td>";
			if (j%8 == 7) table = table + "</tr>";
		}
		table = table + "</table></td>";
		if (i%8 == 7) table = table + "</tr>";
	}
	$("div#nameTables").append(table);
}

function resetNameTable() {
	$("div#nameTables table table").hide();
}

// And we're ready!

$( document ).ready(function() {
	//initialize the form
	setSeedByDate();
	$("select#clan1SELECT").append("<option value='-1'>Random Clan</option>");
	$("select#clan2SELECT").append("<option value='-1'>Random Clan</option>");
	var appendage = "";
	for  (var i = 0; i < syllables.length; i++) {
		appendage = "<option value='" + i + "'>" + syllables[i][0];
		$("select#clan1SELECT").append(appendage + "foaf</option>");
		$("select#clan2SELECT").append(appendage + "khaekh</option>");
	}
	$('#startform').submit(function () {
		return false;
	});
});

