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
var RATE_remarry_single = 0; //5;
var RATE_remarry_heirs = 0; //3;
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

var pid = 0;     // keeps track of each persons ID

var linData = [];//full data structure for genealogy

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

// Roll a D-sided dice, resulting in a number from 1 to D.
function rollD(sides) {
    return Math.round(Math.random() * (sides-1)) + 1;
}

// Get a normally distributed value from mean and stdev.
// Source:  http://www.protonfish.com/random.shtml
function rnd(mean, stdev) {
	return Math.round(rnd_snd()*stdev+mean);

	// Simulate a normal distribution with three random numbers:
	function rnd_snd() {
		return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
	}
}

// *** begin personality type generation code ***
function generatePersonalityType() {
    var EI=typeEI();
    var SN=typeSN();
    var TF=typeTF();
    var JP=typeJP();
    var pType=EI+SN+TF+JP;
    return pType;
}

function typeEI() { // these are the 4 axis of the Myers-Briggs personality types
    var EI="";
    var roll=""; // their distribution should approximate the frequency they
    roll = rollD(4);	// occur in real life.
    (roll>1) ? EI="E" :	EI="I";
    return EI;
}
function typeSN() {
    var SN="";
    var roll="";
    roll = rollD(4);
    (roll>1) ? SN="S" : SN="N";
    return SN;
}
function typeTF() {
    var TF="";
    var roll="";
    roll = rollD(2);
    (roll==2) ?	TF="T" : TF="F";
    return TF;
}

function typeJP() {
    var JP="";
    var roll="";
    roll = rollD(2);
    (roll==2) ? JP="J":	JP="P";
    return JP;
}

function getPTypeName(pType) { //apply label to personality type
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
    var person = linData[pid-1];
	var newname = generateUniqueName(person);
	//update data structure and html
	linData[pid-1].name = newname;
    $("ul#person"+pid).children("li:first").children("input").val(newname);
	$("a#treep" + pid).html(newname);
}

function getSiblingNames(person) {
	//Return sibling names (and spouse name in some cases)
	var siblings = [];
	//don't need to start i at zero because of the structure of the data
	for (i=person.parentId;i<linData.length;i++) {
		if (linData[i].parentId == person.parentId) {
			siblings.push(linData[i].name);
		}
	}
	return siblings;
}
// *** end name generation **


// Random number functions

function randgen() { // random gender, weighted for dwarves
    var gen;
    (rollD(100)<RATE_male) ? gen ="M" : gen="F";
    return gen;
}

function randclan() { // random clan
    return rollD(syllables.length) - 1;
}

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

	    kid.parentId = spouse.pid;
	    pid++;
	    kid.pid = pid;

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

	    displayPerson(kid);
		linData[pid-1] = kid;

	    yom += 8 + rollD(8);  // delay before trying for another kid.
	}
	yom++;
    }
}

// Recover a 'person' node from HTML based on its pid
function getNodeFromPid(pid) {
    return document.getElementById("person" + pid);
}

// Recover a 'person' object from the data structure
function getPersonFromPid(pid) {
    return linData[pid-1];
}

function getPidFromNode(node) {
    return node.id.slice(("person").length); 
}

function getPersonFromNode(personnode, pid) {
    if (!pid) {
		pid = getPidFromNode(personnode);
    }
	return linData[pid - 1];
}

function generateSpouse(person) { // generateFamily calls this
    var spouse = new Object();

    spouse.parentId = person.pid;
    spouse.spouseId = person.pid;

    pid++;
    spouse.pid = pid;

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

	linData[pid-1] = spouse;
    return spouse;
}

// Determine current number of kids for parent
function countKids(pid) {
    var node = document.getElementById("person" + pid);
    return (node.childNodes.length - 5);
}

// Generate a person's geneological contribution to the family tree,
// including children and remarriages (and further children).
function generateFamily(pid) {
    // As we are generating their descendents, hide their 'generate' button
    document.getElementById("family"+pid).style.display="none";

    var newparent = getPersonFromPid(pid);

    //if( rollD(100) > (100-RATE_married)) { // already did a marriage check to generate the family button
		var spouse = generateSpouse(newparent); // get spouse
		displayPerson(spouse); // display spouse
		generateKids(newparent, spouse); // get kids
		
		var grief = spouse.dyear;
		while (newparent.dyear >= grief) { // check for remarriage until death
			grief += rollD(2)+rollD(2)+rollD(2)-2; // delay before remarriage
			newparent.myear = grief; // make sure remarriage date is correct
			
			if (newparent.myear <= newparent.dyear) {
				var offspring = countKids(pid);
				var newchance;
				switch(offspring) {
				case "0": newchance = (newparent.dyear - grief) * RATE_remarry_barren; break;
				case "1": newchance = (newparent.dyear - grief) * RATE_remarry_single; break;
				default: newchance = (newparent.dyear - grief) * RATE_remarry_heirs; break;
				}
				if(rollD(100) < newchance) {
					console.log("Remarried!");
					spouse = generateSpouse(newparent); // get spouse
					displayPerson(spouse); // display spouse
					generateKids(newparent,spouse); // get kids
					grief = spouse.dyear;
				}
			}
		}
    //}
}

function enableLineageUi() {
	$(".resultsUi").show();
    disableCsvUi();
	disableNamesUi();
	disableTreeUi();

    $("#lineageUi").show();
}

function reseed() {
	setSeedByDate();
	enableLineageUi();
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
// that conforms to the constraints.  Reproducibly.
function populateLineage() {
    // Reset/Update our random sequence based on the (possibly new) seed...
    Math.seedrandom(document.getElementById("seed").value);

    // Clear out the lineage...
    pid = 0;
	linData = [];
    var oldLineage = getNodeFromPid(pid);
    var newLineage = document.createElement("div");
    newLineage.id =  "person" + pid;
    oldLineage.parentNode.replaceChild(newLineage, oldLineage);

	//Clear the CSV?
	resetCsvTxt();

	//Clear the tree
	$("#treeUi").html("");

    // Read in form data for person #1, add them to top of lineage chart.
    var person = new Object();
    person.parentId = pid;

    pid++;
    person.pid = pid;

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
    
    displayPerson(person);
	linData[pid-1] = person;

    // Read in (or produce) person #2, their spouse, and add them to the chart.
    var spouse = new Object();
    spouse.parentId = pid;
    spouse.spouseId = pid;
    pid++;
    spouse.pid = pid;

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
    displayPerson(spouse);
	linData[pid-1] = spouse;

    // Generate their direct desendants ...
    generateKids(person, spouse);
}

function appendColumn(colclass, colname, colvalue) {
    var moniker = document.createElement('span');
    moniker.appendChild(document.createTextNode(colname));
    moniker.className = 'moniker';

    var value = document.createTextNode(colvalue);

    var item = document.createElement('li');
    item.appendChild(moniker);
    item.appendChild(value);

    if (colvalue == null) {
	item.style.display="none";
    }

    item.className = colclass;
    return item;
}

function getColor(person) {
	return "color" +  ( (parseInt(person.generation)%13 + 1));
}

// Add a person to the HTML lineage tree
function displayPerson(person) { // create and append nodes with person info
    var goeshere = document.getElementById("person" + person.parentId);

    // Create a new element (a <UL/>, as it turns out) for the person.
    var personHtml = document.createElement("ul");
    personHtml.setAttribute("id","person" + person.pid);
    personHtml.className=getColor(person);

    // Create the name (and rename UI)
    var namebox = document.createElement("input");
    namebox.setAttribute("type","text");
    namebox.setAttribute("size","8");
    namebox.value = person.name;
    var rename = document.createElement("button");
    rename.setAttribute("onclick","generateNewName(\""+person.pid+"\");");
    var atext=document.createTextNode("Rename");
    rename.appendChild(atext);
    var colName = document.createElement("li");
    colName.appendChild(namebox);
    colName.appendChild(rename);
    personHtml.appendChild(colName);

    // Add in the attributes for the person
    var colGender = appendColumn('gender', '',  person.gender);
    var colGener = appendColumn('generation', 'Gen: ', person.generation);
    var colClan = appendColumn('clan', 'Clan: ' + syllables[parseInt(person.clan)][0] + (person.gender == 'M' ? "foaf" : "khaekh") + " -", person.clan);
    var colBorn = appendColumn('byear', 'lived ', person.byear);
    var colDied = appendColumn('dyear', '- ', person.dyear);
    var colWed = appendColumn('myear', '- married in the year ', person.myear);
    var colPop = appendColumn('mage', 'at the age of ', person.mage);
    var colRip = appendColumn('dage', ' died at the age of ', person.dage);
    var colPType = appendColumn('ptype', '- MBTI: ', person.ptype);
    var colGoals = appendColumn('goals', '', getPTypeName(person.ptype));

    personHtml.appendChild(colGender);
    personHtml.appendChild(colGener);
    personHtml.appendChild(colClan);
    personHtml.appendChild(colBorn);
    personHtml.appendChild(colDied);
    personHtml.appendChild(colWed);
    personHtml.appendChild(colPop);
    personHtml.appendChild(colRip);
    personHtml.appendChild(colPType);
    personHtml.appendChild(colGoals);

    if (person.family) {
	var getfam = document.createElement("button");
	getfam.setAttribute("onclick","generateFamily(\""+person.pid+"\");");
	getfam.setAttribute("id","family"+person.pid);
	var getfamtext = document.createTextNode("Get Family");
	getfam.appendChild(getfamtext);
	personHtml.appendChild(getfam);
    }

    goeshere.appendChild(personHtml);

	//Tree section.
	var treepLink = "<a href='#' id='treep" + person.pid + "' class='" + getColor(person) + "'>" + person.name + "</a>";
	var treepHtml = "<li>" + treepLink + "</li>";
	if (person.pid == 1) 
		$("div#treeUi").append("<ul>" + treepHtml + "</ul>");
	else if (person.spouseId)
		$("#treep" + person.spouseId).after(treepLink);
	else if ($("#treep" + person.parentId).siblings("ul").length > 0)
		$("#treep" + person.parentId).siblings("ul").append(treepHtml);
	else
		$("#treep" + person.parentId).after("<ul>" + treepHtml + "</ul>");

}

function populateCsv() {
	//Do it the easy way, using the data structure.
	var row = "";
	if ($("#csvtxt").val() == "") 
		$("#csvtxt").val("# pid, name, gender, generation, clan, byear, myear, mage, dage, ptype, parent\n");
	//Assuming there's no way to trim the tree; if you add one, just regenerate the whole thing instead.
	var lastCount = ($("#csvtxt").data("headcount") > 0) ? $("#csvtxt").data("headcount") : 0;
	for (i=lastCount;i<linData.length;i++) {
		row = buildCsvRow(linData[i]);
		$("#csvtxt").val($("#csvtxt").val() + row + "\n");
	}
	//Note how many people we had when we generated.
	$("#csvtxt").data("headcount",linData.length);

	function buildCsvRow(p) {
		var row = [p.pid, p.name, p.gender, p.generation, p.clan, p.byear, p.dyear, p.myear,
				   p.mage, p.dage, p.ptype, p.parentId].join(',');
		// Adjusting this?  Adjust the header in populateCsv.
		return row;
	}
}

function resetCsvTxt() {
	$("#csvtxt").val("");
}

function setSeedByDate() {
	$("input#seed").val(new Date().getTime());
}

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

