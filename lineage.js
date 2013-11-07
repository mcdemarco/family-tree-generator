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

var RATE_married = 97;
var RATE_remarry_barren = 15;
var RATE_remarry_single = 5;
var RATE_remarry_heirs = 3;
var RATE_bachelor = 4;  // %chance refuse to marry -- applies to both men and women.

var RATE_male = 75; // Male/female ratio at birth.  Should be 51% for humans.

var MEAN_dage = 256; // Average age of death on a normal curve.
var STD_dage = 36; // Standard deviation in age of death.

//To do: incorporate odds of premature death:
// 50% dies as a child or teenager
// 25% die in their 20-30's
// 12.5% die in their 40-50's
// 12.5% die in their 60-70's

var pid = 0;     // keeps track of each persons ID
var lcolor = 0;	 // background color for each generation

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
	["Ra","rra","rr"],
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
function goGetPType() {
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
function getname(person) {
    if (person.gender == "M") {
		return getMname(person);
    }
    return getFname(person);
}

function getMname(person) {
	var roll1 = rollD(syllables.length) - 1;
	return syllables[roll1][0] + syllables[parseInt(person.clan)][1] + syllables[0][2];
}

function getFname(person) {
	var roll1 = rollD(syllables.length) - 1;
	return syllables[roll1][0] + syllables[parseInt(person.clan)][1];
}

function getJalname() {
	//return random masculine name
	var roll1 = rollD(syllables.length) - 1;
	var roll2 = rollD(syllables.length) - 1;
	var roll3 = rollD(syllables.length) - 1;
	return syllables[roll1][0] + syllables[roll2][1] + syllables[roll3][2];
}

function getEffname() {
	//return random feminine name
	var roll1 = rollD(syllables.length) - 1;
	var roll2 = rollD(syllables.length) - 1;
	return syllables[roll1][0] + syllables[roll2][1];
}

function getNewName(pid) {
    var node = getNodeFromPid(pid);
    var person = getPersonFromNode(node);
    node.firstChild.firstChild.value = getname(person);
}
// *** end name generation **

function getOppositeGender(gender) { // flip gender (for the spouse) if one is given
    var newgen = "";
    switch(gender) {			 // otherwise randomize it
    case "M": newgen = "F";break;
    case "F": newgen = "M";break;
    default:newgen = randgen();
    }
    return newgen;
}

function randgen() { // random gender, weighted for dwarves
    var gen;
    (rollD(100)<RATE_male) ? gen ="M" : gen="F";
    return gen;
}

// Determine birth year based on year of marriage and person's gender
function getbyear(married, gender) {
    var mage;

    mage = rollD(9)+12; // women (who are likely to produce progeny) marry from age 13-21

    if (gender=="M") {	 // if male, potentially add a few years
	for (var i=0; i < 5; i++) {
	    mage += rollD(4)-1;
	}
    }

    var birth = married - mage;

    return birth;
}

function getmage(gender) {
    return Math.abs(getbyear(0,gender));
}

function getdage(myear , mage) { // get age they die at
    var dage;
	dage = rnd(MEAN_dage,STD_dage);

    if (dage && mage) {  // Generating spouse, so should be alive when married...
	while (dage < mage) {   // if died before married, set to marriage.
	    dage = mage;
	}
    }

    var death = dage;
    return death;
}

function getfert(fertyear) { // return fertility based on age
    var chance = 0;
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

    return chance;
}

function getKids(person, spouse) { // get kids
    var mend;  // year marriage ends -- no divorce for now...
    (person.dyear < spouse.dyear) ? mend=person.dyear : mend=spouse.dyear;

    var mspan; // number of years married
    mspan = mend - person.myear;

    var fertstart; // age of woman at time of marriage
    (person.gender=="F") ? fertstart=person.mage : fertstart=spouse.mage;

    var newcolor=parseInt(spouse.generation)+1;
    if (newcolor==14){newcolor=1;}

    var yom=0;  // years of marriage
    while (yom <= mspan) {
	if ( rollD(100) <= getfert(fertstart+yom) ) {
	    var kid = new Object();

	    kid.parentId = formNodeId(spouse.pid);
	    pid++;
	    kid.pid = pid;

	    kid.gender=randgen();
		if (kid.gender == person.gender)
			kid.clan = person.clan;
		else 
			kid.clan = spouse.clan;
	    kid.name=getname(kid);

	    kid.byear=spouse.myear + yom;
	    kid.dage=getdage();
	    kid.dyear = kid.byear + kid.dage;

	    kid.mage = getmage(kid.gender);
	    kid.myear = kid.byear + kid.mage;

	    kid.family = true;

	    if ((kid.myear > kid.dyear) || (rollD(100) <= RATE_bachelor)) {
		kid.mage =null;
		kid.myear =null;
		kid.family =null;
	    }

	    kid.ptype=goGetPType();
	    kid.generation=newcolor;

	    debug("kid.pid:" + kid.pid);
	    displayPerson(kid);

	    yom += rollD(2)+rollD(2)+rollD(2)-2;  // delay before trying for kid.
	}
	yom++;
    }
}

// Recover a 'person' node from HTML based on its pid
function getNodeFromPid(pid) {
    return document.getElementById(formNodeId(pid));
}

// Recover a 'person' object from the HTML properties/attributes/elements.
function getPersonFromPid(pid) { // recreate person info from text nodes
    var personnode = getNodeFromPid(pid);
    return getPersonFromNode(personnode, pid);
}

function getPidFromNode(node) {
    return node.id.slice(formNodeId("").length); 
}

function getPersonFromNode(personnode, pid) {
    if (personnode.nodeName != "UL"  ) {
	debug("person built from node that wasn't UL ..." + personnode.nodeName);
    }
    if (!pid) {
	pid = getPidFromNode(personnode);
    }

    debug('gPFN:' + pid);
    var newperson = new Object();
    newperson.pid = pid;
    newperson.generation = personnode.className.substring(personnode.className.indexOf("r")+1,
							personnode.className.length);

    var node = personnode.firstChild;
    newperson.name = node.firstChild.value;
    node = node.nextSibling;

    newperson.gender = node.firstChild.nextSibling.nodeValue;
    node = node.nextSibling;

    newperson.byear = parseInt(node.firstChild.nextSibling.nodeValue);
    node = node.nextSibling;

    newperson.dyear = parseInt(node.firstChild.nextSibling.nodeValue);
    node = node.nextSibling;

    newperson.myear = parseInt(node.firstChild.nextSibling.nodeValue);
    node = node.nextSibling;

    newperson.mage = parseInt(node.firstChild.nextSibling.nodeValue);
    node = node.nextSibling;

    newperson.dage = parseInt(node.firstChild.nextSibling.nodeValue);
    node = node.nextSibling;

    newperson.ptype = node.firstChild.nextSibling.nodeValue;
    // We don't try and parse this ... just use a string
    
    return newperson;
}

function getSpouse(person) { // getFamily calls this
    var spouse = new Object();

    spouse.parentId = formNodeId(person.pid);

    pid++;
    spouse.pid = pid;

    spouse.gender=getOppositeGender(person.gender);
	spouse.clan=rollD(syllables.length) - 1;
    spouse.name=getname(spouse);

    spouse.myear=person.myear;
    spouse.byear=getbyear(spouse.myear,spouse.gender);

    spouse.mage=spouse.myear-spouse.byear;

    spouse.dage=getdage(spouse.myear,spouse.mage);
    spouse.dyear=spouse.byear+spouse.dage;

    spouse.ptype=goGetPType();
    spouse.generation=person.generation;
    return spouse;
}

// Determine current number of kids for parent
function countKids(pid) {
    var node = document.getElementById(formNodeId(pid));
    return (node.childNodes.length - 5);
}

// Generate a person's geneological contribution to the family tree,
// including children and remarriages (and further children).
function getFamily(pid) {
    debug("getFamily:"+ pid);
    // As we are generating their descendents, hide their 'generate' button
    document.getElementById("family"+pid).style.display="none";

    var newparent = getPersonFromPid(pid);
    debug("newparent:" + newparent);

    if( rollD(100) > (100-RATE_married)) { // need to make sure marriage isn't automatic
	var spouse = getSpouse(newparent); // get spouse
	debug("new spouse");
	debug("spouse.pid:" + spouse.pid);
	displayPerson(spouse); // display spouse
	getKids(newparent, spouse); // get kids

	var grief = spouse.dyear;
	while (newparent.dyear >= grief) { // check for remarriage until death
	    grief += rollD(2)+rollD(2)+rollD(2)-2; // delay before remarriage
	    newparent.myear = grief; // make sure remarriage date is correct

	    if (newparent.myear <= newparent.dyear) {
		var offspring = countKids(pid)
		debug("offspring:" + offspring);
		var newchance;
		switch(offspring) {
		case "0": newchance = (newparent.dyear - grief) * RATE_remarry_barren; break;
		case "1": newchance = (newparent.dyear - grief) * RATE_remarry_single; break;
		default: newchance = (newparent.dyear - grief) * RATE_remarry_heirs; break;
		}
		if(rollD(100) < newchance) {
		    debug("Remarried!");
		    spouse = getSpouse(newparent); // get spouse
		    debug("spouse.pid:" + spouse.pid);
		    displayPerson(spouse); // display spouse
		    getKids(newparent,spouse); // get kids
		    grief = spouse.dyear;
		}
	    }
	}
    }
}

function toggleDebugTxt() {
    var debugtxt = document.getElementById("debugtxt");
    var style = debugtxt.style.display;
    if (style == "block") {
	debugtxt.style.display = "none";
    } else {
	debugtxt.style.display ="block";	
    }
}

function getRequestParameter(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
	return "";
    else
	return results[1];
}

var do_DEBUG = getRequestParameter("debug");
var do_BFS = getRequestParameter("bfs");

function debug(output) {
    if (do_DEBUG) {
	var debugtxt = document.getElementById("debugtxt");
	var line = document.createTextNode(output + "\n");
	debugtxt.appendChild(line);
	debugtxt.appendChild(document.createElement("br"));
    }
}

function enableDebugUi() {
    if (do_DEBUG) {
	document.getElementById("debuglog").style.display="block";
    }
}

function enableLineageUi() {
    enableDebugUi();

    debug("enableLineageUI()");
    disableSeedUi();
    disableCsvUi();

    document.getElementById("lineageUi").style.display="block";
}

function enableSeedUi() {
    debug("enableSeedUi()");
    disableLineageUi();
    disableCsvUi();

    document.getElementById("seedUi").style.display="block";
	setSeedByDate();
}

function enableCsvUi() {
    enableDebugUi();

    debug("enableCsvUi()");
    disableLineageUi();
    disableSeedUi();

    document.getElementById("csvUi").style.display="block";
}

function disableCsvUi() {
    document.getElementById("csvUi").style.display="none";
}

function disableLineageUi() {
    document.getElementById("lineageUi").style.display="none";
}

function disableSeedUi() {
    document.getElementById("seedUi").style.display="none";
    document.getElementById("intro").style.display="none";
    document.getElementById("footer").style.display="none";
}

// populateLineage():
//   The big kahuna.  Take the parameters (possibly sparse) and produce a geneology
// that conforms to the constraints.  Reproducibly.
function populateLineage() {
    // Reset/Update our random sequence based on the (possibly new) seed...
    Math.seedrandom(document.getElementById("seed").value);

    // Clear out the lineage...
    pid = 0;
    var oldLineage = getNodeFromPid(pid);
    var newLineage = document.createElement("div");
    newLineage.id =  formNodeId(pid);
    oldLineage.parentNode.replaceChild(newLineage, oldLineage);

    // Read in form data for person #1, add them to top of lineage chart.
    var person = new Object();
    person.parentId = formNodeId(pid);

    pid++;
    person.pid = pid;

	person.clan = document.startform.clan1.value;
    (document.startform.gender1.value != "x") ?
	person.gender = document.startform.gender1.value : person.gender = randgen();
    (document.startform.name1.value) ?
	person.name = document.startform.name1.value : person.name=getname(person);
    (document.startform.married1.value) ?
	person.myear = parseInt(document.startform.married1.value) : person.myear = 0;
    (document.startform.born1.value) ?
	person.byear = parseInt(document.startform.born1.value) : person.byear = getbyear(person.myear,
											  person.gender);
    person.mage = person.myear - person.byear;
    if (document.startform.died1.value) {
	person.dyear = parseInt(document.startform.died1.value);
	person.dage = person.dyear - person.byear;
    } else {
	person.dage = getdage(person.myear, person.mage);
	person.dyear = person.byear + person.dage;
    }

    person.ptype = goGetPType();
    person.generation = 1;
    
    displayPerson(person);

    // Read in (or produce) person #2, their spouse, and add them to the chart.
    var spouse = new Object();
    spouse.parentId = formNodeId(pid);
    pid++;
    spouse.pid = pid;

	spouse.clan = document.startform.clan2.value;

    spouse.gender = getOppositeGender(person.gender);
    (document.startform.name2.value) ?
	spouse.name=document.startform.name2.value : spouse.name = getname(spouse);
    spouse.myear = person.myear;
    (document.startform.born2.value) ?
	spouse.byear=parseInt(document.startform.born2.value) : spouse.byear = getbyear(spouse.myear,
											spouse.gender);
    spouse.mage = spouse.myear - spouse.byear;
    if (document.startform.died2.value) {
	spouse.dyear = parseInt(document.startform.died2.value);
	spouse.dage = spouse.dyear - spouse.byear;
    } else {
	spouse.dage = getdage(spouse.myear, spouse.mage);
	spouse.dyear = spouse.byear + spouse.dage;
    }

    spouse.ptype=goGetPType();
    spouse.generation=1;
    displayPerson(spouse);

    // Generate their direct desendants ...
    getKids(person, spouse);
}

function appendColumn(colclass, colname, colvalue) {
    var moniker = document.createElement('span');
    moniker.appendChild(document.createTextNode(colname));
    moniker.className = 'moniker';

    var value = document.createTextNode(colvalue);

    var item = document.createElement('li');
    item.appendChild(moniker)
    item.appendChild(value)

    if (colvalue == null) {
	item.style.display="none";
    }

    item.className = colclass;
    return item;
}

// Add a person to the HTML lineage tree
function displayPerson(person) { // create and append nodes with person info
    var goeshere = document.getElementById(person.parentId);

    // Create a new element (a <UL/>, as it turns out) for the person.
    var personHtml = document.createElement("ul");
    personHtml.setAttribute("id",formNodeId(person.pid));
    personHtml.className="color" + ( (parseInt(person.generation) - 1)%13 + 1);

    // Create the name (and rename UI)
    var namebox = document.createElement("input");
    namebox.setAttribute("type","text");
    namebox.setAttribute("size","8");
    namebox.value = person.name;
    var rename = document.createElement("a");
    rename.setAttribute("href","javascript:getNewName(\""+person.pid+"\");");
    var atext=document.createTextNode(" Rename ");
    rename.appendChild(atext);
    var colName = document.createElement("li");
    colName.appendChild(namebox);
    colName.appendChild(rename);
    personHtml.appendChild(colName);

    // Add in the attributes for the person
    var colGender = appendColumn('gender', '',  person.gender);
    var colBorn = appendColumn('byear', 'lived ', person.byear);
    var colDied = appendColumn('dyear', '-', person.dyear);
    var colWed = appendColumn('myear', ', married in the year ', person.myear);
    var colPop = appendColumn('mage', 'at the age of ', person.mage);
    var colRip = appendColumn('dage', ', passed away at the age of ', person.dage);
    var colPType = appendColumn('ptype', '. Personality:', person.ptype);
    var colGoals = appendColumn('goals', ' ', getPTypeName(person.ptype));

    personHtml.appendChild(colGender);
    personHtml.appendChild(colBorn);
    personHtml.appendChild(colDied);
    personHtml.appendChild(colWed);
    personHtml.appendChild(colPop);
    personHtml.appendChild(colRip);
    personHtml.appendChild(colPType);
    personHtml.appendChild(colGoals);

    if (person.family) {
	var getfam = document.createElement("a");
	getfam.setAttribute("href","javascript:getFamily(\""+person.pid+"\");");
	getfam.setAttribute("id","family"+person.pid);
	var getfamtext = document.createTextNode(" Get Family ");
	getfam.appendChild(getfamtext);
	personHtml.appendChild(getfam);
    }

    goeshere.appendChild(personHtml);
}

function formNodeId(pid) {
    return "person" + pid;
}

// Take the current tree and produce a CSV file that represents it.
// We have a choice -- BFS or DFS.
function populateCsv() {
    resetCsvTxt();

    if (do_BFS) {
	debug('Bredth First');
	var queue = Array();
	crawlTreeBf(queue, 1);
    } else {
	debug('Depth First');
	crawlTreeDf(1);		
    }
}

function crawlTreeDf(pid, bloodline, spouse) {
    debug("crawlTreeDf(" + pid + ")");
    var node = getNodeFromPid(pid);
    var person = getPersonFromNode(node, pid);

    // bloodline != null, spouse != null -> child of bloodline
    // bloodline != null, spouse == null -> spouse of one of bloodline
    addCsvRow(person, bloodline, spouse);

    // Do Depth-First traversal of lineage tree.
    debug('node.childNodes = ' + node.childNodes);
    debug('node.childNodes.length = ' + node.childNodes.length);
    var nextKin;
    for (var kin = node.firstChild; kin != null; kin = nextKin) {
	nextKin = kin.nextSibling;
	if (kin.nodeName == "UL") {
	    debug('kin:' + kin);
	    var kith = getPersonFromNode(kin, getPidFromNode(kin));
	    if (bloodline != null && spouse == null) {
		// Spouse: add self as other parent
		crawlTreeDf(kith.pid, bloodline, pid);
	    } else if (bloodline != null && spouse != null) {
		// Child: of the bloodline. Start next generation.
		crawlTreeDf(kith.pid, pid);
	    } else if (bloodline == null && spouse == null) {
		// Root: kicking the whole thing off...
		crawlTreeDf(kith.pid, pid);
		// NOTE: could combine Root&Child using diff boolean logic .. but who cares.
	    } else {
		debug("Whoa! Orphan in the bloodline!");
	    }
	}
    }
}

function crawlTreeBf(queue, pid, bloodline, spouse) {
    debug("crawlTreeBf(" + queue + "," + pid + "" + bloodline + "," + spouse + ")");
    var node = getNodeFromPid(pid);
    var person = getPersonFromNode(node, pid);

    addCsvRow(person, bloodline, spouse);

    // Do Breadth-First traversal of lineage tree.
    debug('BF.person.childNodes = ' + node.childNodes);
    debug('BF.person.childNodes.length = ' + node.childNodes.length);
    if (node.childNodes && node.childNodes.length > 0) {
	var nextKith;
	for (var kith = node.firstChild; kith != null; kith = nextKith) {
	    debug('kith:' + kith);
	    nextKith = kith.nextSibling;
	    debug('kith.nodeName:' + kith.nodeName);
	    if (kith.nodeName == "UL") {
		var lineage = new Object();
		lineage.pid = getPidFromNode(kith);

		if (spouse == null) {
		    // Spouse: add self as other parent.
		    lineage.bloodline = bloodline;
		    lineage.spouse = pid;
		} else if (bloodline != null && spouse != null) {
                    // Child: set self as bloodline.
		    lineage.bloodline = pid;
		    lineage.spouse = null;
		} else if (bloodline == null && spouse == null) {
		    // Root: kick off the whole thing!
		    lineage.bloodline = pid;		
		    lineage.spouse = null;
		} else {
		    debug("Whoa! Orphan in the bloodline!");
		}
		debug('queue:' + lineage);
		queue.push(lineage);
	    }
	}
    }
    debug('queue.length:' + queue.length);
    
    // Pull off head element and recurse...
    if (queue.length > 0) {
	debug('pop!');
	var relative = queue.shift();
	debug('relative: ' + relative);
	crawlTreeBf(queue, relative.pid, relative.bloodline, relative.spouse);
    }
}

var families = 1;

function resetCsvTxt() {
    var csvtxt = document.getElementById('csvtxt');
    csvtxt.value = '';
    families = 1;    
}

function buildCsvRow(person, peer, parent) {
    debug("buildCsvRow(" + person + ")");
    var pid = person.pid;
    var name = person.name;
    var gender = person.gender;
    var byear = person.byear;
    var dyear = person.dyear;
    var myear = person.myear;
    var mage = person.mage;
    var dage = person.dage;
    var ptype = person.ptype;

    var family = 1;  // The main line we are generating...
    if (parent == null) {
	// Ooops.  A spouse...
	family = families++;
    }

    var row = [pid, name, gender, byear, dyear, myear,
	       mage, dage, ptype, peer, parent, family].join(',');
    // Adjusting this?  Adjust addCsvRow() below...

    return row;
}

function addCsvRow(person, bloodline, spouse) {
    debug("addCsvRow(" + person + ")");
    var csvtxt = document.getElementById('csvtxt');
    if (csvtxt.value.length == 0) {
	// Adjust this?  Adjust buildCsvRow() above...
	csvtxt.value = "# pid, name, gender, byear, myear, mage, dage, ptype, peer, parent, family\n";
    } else {
	csvtxt.value += "\n";
    }

    var rowtxt = buildCsvRow(person, bloodline, spouse);
    csvtxt.value += rowtxt;
}

function setSeedByDate() {
	$("input#seed").val(new Date().getTime());
}

$( document ).ready(function() {
	//initialize the form
	setSeedByDate();
	var appendage = "";
	for  (var i = 0; i < syllables.length; i++) {
		appendage = "<option value='" + i + "'>" + syllables[i][0];
		$("select#clan1SELECT").append(appendage + "foaf</option>");
		$("select#clan2SELECT").append(appendage + "khaekh</option>");
	}
});

