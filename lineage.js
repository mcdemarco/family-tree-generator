// Grabbed off of http://ja.partridgez.com/lineage.html
// apparently (C) Jeff Partridge,
// from a Create Commons Attribution-Noncommercial-Share Alike-3.0 United States License
// ...
// Then I fixed a lot of bugs, added code to give Females names that are more
// asian (appropriate to my campaign), and made use of a seedable rand so trees can
// be consistently regenerated.  Saves on printing them out and wasting paper.
// -- Todd Stumpf 2010, Feb 20

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

var RATE_married = 97;
var RATE_remarry_barren = 15;
var RATE_remarry_single = 5;
var RATE_remarry_heirs = 3;
var RATE_bachelor = 4;  // %chance refuse to marry -- applies to both men and women.

var pid = 0;     // keeps track of each persons ID
var lcolor = 0;	 // background color for each generation

// Roll a D-sided dice, resulting in a number from 1 to D.
function rollD(sides) {
    return Math.round(Math.random() * (sides-1)) + 1;
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

// *** begin lame name generation ***
function getname(person) {
    if (person.gender == "M") {
	return getEffname();
    }
    return getJalname();
}

function getJalname() {
    var syl = rollD(2) + rollD(2) + rollD(2) - 2;
    var count = 0;
    var jname = "";
    while (count < syl) {
	jname = jname + getSyl();
	count++;
    }
    return jname;
}

function getSyl() {
    var roll = rollD(75)-1;
    var sylabs=["ka", "ki", "ku", "ke", "ko",
		"a", "i", "u", "e", "o",
		"ta", "chi", "tsu", "te", "to",
		"ra", "ri", "ru", "re", "ro",
		"sa", "shi", "su", "se", "so",
		"ma", "mi", "mu", "me", "mo",
		"ya", "ya", "yu", "yo", "yo",
		"na", "ni", "nu", "ne", "no",
		"ha", "hi", "hu", "he", "ho",
		"ta", "chi", "tsu", "te", "to",
		"ra", "ri", "ru", "re", "ro",
		"sa", "shi", "su", "se", "so",
		"ma", "mi", "mu", "me", "mo",
		"wa", "wi", "wu", "we", "wo",
		"n", "n", "n", "n", "n" ];
    return sylabs[roll];
}

function getEffname() {
    var ccount = 0;
    var vcount = 0;
    var vanna = "";
    var roll=0;
    roll=rollD(6);
    if (roll<4) {
	vanna=get1vowel(); //does the name start with a vowel or a consonant?
	vcount++;
    }
    else {
	vanna=get1con();
	ccount++;
    }
    var count = 0;
    var letLength=rollD(6)+1; //sets length of name from 3 to 8 letters.
    while (count < letLength)
    {
	if (ccount>1) {
	    vanna=vanna+getvowels();	 //no more than 2 vowels or consonants together
	    ccount=0;vcount++;
	}
	else if (vcount>1) {
	    vanna=vanna+getcons();
	    vcount=0;ccount++;
	}
	else {
	    roll=0;
	    roll=rollD(6);
	    if (roll<4) {
		vanna=vanna+getvowels();
		vcount++;
	    }
	    else {
		vanna=vanna+getcons();
		ccount++;
	    }
	}
	count++;
    }
    return(vanna);
}

function get1vowel() { // The frequency of letters should roughly approximate their
    var roll=0;				 // occurance in the English language.
    roll=rollD(10)-1;
    var firstvowel=["A","A","A","E","E","I","I","O","U","Y"];
    return firstvowel[roll];
}
function get1con() {
    var roll=0;
    roll=rollD(30)-1;
    var firstcon=["B","C","D","F","G","H","J","K","L","L","L","L","M","N","P","Q","R","R","R","R","S","S","S","T","V","W","X","Y","Y","Z"];
    return firstcon[roll];
}
function getvowels() {
    var roll=0;
    roll=rollD(10)-1;
    var vowels=["a","a","a","e","e","i","i","o","u","y"];
    return vowels[roll];
}
function getcons() {
    var roll=0;
    roll=rollD(30)-1;
    var cons=["b","c","d","f","g","h","j","k","l","l","l","l","m","n","p","q","r","r","r","r","s","s","s","t","v","w","x","y","y","z"];
    return cons[roll];
}
function getNewName(pid) {
    var node = getNodeFromPid(pid);
    var person = getPersonFromNode(node);
    node.firstChild.firstChild.value = getname(person);
}
// *** end lame name generation **

function getOppositeGender(gender) { // flip gender (for the spouse) if one is given
    var newgen = "";
    switch(gender) {			 // otherwise randomize it
    case "M": newgen = "F";break;
    case "F": newgen = "M";break;
    default:newgen = randgen();
    }
    return newgen;
}

function randgen() { // random gender
    var gen;
    (rollD(6)<4) ? gen ="M" : gen="F";
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
    return Math.abs(getbyear(0,gender))
}

function getdage(myear , mage) { // get age they die at
    var temp1a = rollD(20);
    var temp1b = rollD(20);
    var temp1;
    (temp1a < temp1b) ? temp1=temp1a : temp1=temp1b; // temp1 is the low of 2d20

    var temp2=rollD(8);

    var dage;
    if (temp2<5) {  // 50% dies as a child or teenager
	dage=temp1;
    } // this is to shape the prob curve of deaths
    else if (temp2<7) {
	dage=temp1a+20;  // 25% die in their 20-30's
    }
    else if (temp2==7) { // 12.5% die in their 40-50's
	dage=temp1a+40;
    }
    else if (temp2==8) { // 12.5% die in their 60-70's
	dage=temp1a+60;
    }

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

    var newcolor=parseInt(spouse.gencolor)+1;
    if (newcolor==14){newcolor=1;}

    var yom=0;  // years of marriage
    while (yom <= mspan) {
	if ( rollD(100) <= getfert(fertstart+yom) ) {
	    var kid = new Object();

	    kid.parentId = formNodeId(spouse.pid);
	    pid++;
	    kid.pid = pid;

	    kid.gender=randgen();
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
	    kid.gencolor=newcolor;

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
    newperson.gencolor = personnode.className.substring(personnode.className.indexOf("r")+1,
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

    spouse.name=getname(spouse);

    spouse.myear=person.myear;
    spouse.byear=getbyear(spouse.myear,spouse.gender);

    spouse.mage=spouse.myear-spouse.byear;

    spouse.dage=getdage(spouse.myear,spouse.mage);
    spouse.dyear=spouse.byear+spouse.dage;

    spouse.ptype=goGetPType();
    spouse.gencolor=person.gencolor;
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
    person.gencolor = 1;
    
    displayPerson(person);

    // Read in (or produce) person #2, their spouse, and add them to the chart.
    var spouse = new Object();
    spouse.parentId = formNodeId(pid);
    pid++;
    spouse.pid = pid;
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
    spouse.gencolor=1;
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
    personHtml.className="color"+person.gencolor;

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
    var colWed = appendColumn('myear', ', married in year ', person.myear);
    var colPop = appendColumn('mage', 'at age of ', person.mage);
    var colRip = appendColumn('dage', ', passed at the age of ', person.dage);
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

