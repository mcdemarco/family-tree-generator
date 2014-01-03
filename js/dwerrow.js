/* variant dwarf type */

var dwerrow = new Homo();

addRace("dwerrow", "Dwerrow", dwerrow, false);

	dwerrow.RATE_remarry_barren = 0; //15;
	dwerrow.RATE_remarry_singleChild = 0; //5;
	dwerrow.RATE_remarry_multipleHeirs = 0; //3;
	dwerrow.RATE_bachelor_ette = 4;  //chance of refusal to marry, both sexes; otherwise married at available spouse rate
	
	dwerrow.RATE_male = 75; // Male/female ratio at birth.  Should be 51% for humans.
	
	dwerrow.MIN_fmage = 16; // Minimum age of marriage; cut off below dwerrow.
	dwerrow.MEAN_fmage = 32; // Average age of marriage on a normal curve. % should be 13-21 for medieval human women
	dwerrow.STD_fmage = 5; // Standard deviation in age of marriage.
	dwerrow.MIN_mmage = 16; // Minimum age of marriage; cut off below this.
	dwerrow.MEAN_mmage = 36; // Average age of marriage on a normal curve.
	dwerrow.STD_mmage = 10; // Standard deviation in age of marriage.

	dwerrow.RATE_dchildbirth = 0.5; //Chance of death in childbirth
	dwerrow.RATE_dchildhood = 0.5; //Chance of death in infancy or childhood
	dwerrow.RATE_daccident = 0.075; //Chance of accidental death per year
	
	dwerrow.MEAN_dage = 256; // Average age of death on a normal curve.
	dwerrow.STD_dage = 36; // Standard deviation in age of death.

	dwerrow.MEAN_childDelay = 10;
	dwerrow.STD_childDelay = 2;

	dwerrow.syllables = [
	["'Au","'au","'"],
	["Ko","ko","k"],
	["Tai","tai","t"],
	["Sa","sa","s"],
	["Pi","pi","p"],
	["Qou","qou","q"],
	["Ce","cte","ct"],
	["Tsu","tsu","ts"],
	["Ha","ha","h"],
	["Gou","gou","g"],
	["Di","di","d"],
	["Ze","ze","z"],
	["Bu","bu","b"],
	["Rau","rgau","rg"],
	["Dai","dgai","dg"],
	["Dzo","dzo","dz"],
	["He","hhe","hh"],
	["Xau","xau","x"],
	["Thu","thu","th"],
	["Shai","shai","sh"],
	["Fo","fo","f"],
	["Kha","kha","kh"],
	["Kli","kli","kl"],
	["Chou","tchou","tch"],
	["`Ai","`ai","`"],
	["Gha","gha","gh"],
	["Dho","dho","dh"],
	["Zhi","zhi","zh"],
	["Vou","vou","v"],
	["Ghe","rghe","rgh"],
	["Glu","glu","gl"],
	["Jau","djau","dj"],
	["Mi","hmi","hm"],
	["Nge","nge","ng"],
	["Nou","nou","n"],
	["Snu","snu","sn"],
	["Mau","mau","m"],
	["Nai","nhai","nh"],
	["Nlo","nlo","nl"],
	["Mba","mba","mb"],
	["Rhu","rrhu","rrh"],
	["Lai","ltai","lt"],
	["Rrau","rrau","rr"],
	["Ro","rdo","rd"],
	["Bra","bra","br"],
	["Rhi","rhi","rh"],
	["Rlou","rlou","rl"],
	["Tre","tre","tr"],
	["Hro","hro","hr"],
	["Gwi","gwi","gw"],
	["Ra","ra","r"],
	["Swou","swou","sw"],
	["Bhe","bhe","bh"],
	["Whu","whu","wh"],
	["Yau","yau","y"],
	["Tlai","tlai","tl"],
	["Hwou","hwou","hw"],
	["Llu","llu","ll"],
	["Le","le","l"],
	["Zlau","zlau","zl"],
	["Yai","yyai","yy"],
	["Wo","wo","w"],
	["Hla","hla","hl"],
	["Dzli","dzli","dzl"]
];

	// clan generation
	dwerrow.generateClan = function() { // random clan
		return rollD(dwerrow.syllables.length) - 1;
	};

	dwerrow.getClan = function(person) {
		//get clan name from clan ID
		return dwerrow.syllables[parseInt(person.clan)][0] + (person.gender == 'M' ? "fouf" : "khakh");
	};

	// *** begin cool dwerrow name generation ***
	dwerrow.generateName = function(person) {
		var roll1 = rollD(dwerrow.syllables.length) - 1;
		return dwerrow.syllables[roll1][0] + dwerrow.syllables[parseInt(person.clan)][1] + ((person.gender == "M") ? dwerrow.syllables[parseInt(person.generation)%dwerrow.syllables.length][2] : "");
	};
	
	dwerrow.generateFertility = function(fertyear, girl) { // return fertility based on age
		var chance = 0;
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
		
		if (girl > 0)
			return chance/(8 * girl);
		else
			return chance;
	};

	dwerrow.generateGrief = function() {
		return rollD(2)+rollD(2)+rollD(2)-2;
	};

dwerrow.initializeClans = function() {
	$("div#seedUi span.clanForm").show();
	$("div#seedUi span.generationForm").show();
	var appendage = "";
	for  (var i = 0; i < dwerrow.syllables.length; i++) {
		appendage = "<option value='" + i + "'>" + dwerrow.syllables[i][0];
		$("select#clan1SELECT").append(appendage + "fouf</option>");
		$("select#clan2SELECT").append(appendage + "khakh</option>");
	}
};
	
// Functions for showing the name inventory.

dwerrow.generateNameTable = function() {
	if ($("div#nameTables").html() != "") {
		$("div#nameTables table table").hide();
		return;
	}
	var table = "<p><button onclick='$(\"div#nameTables table table\").hide();'>Reset</button><table>";
	for (var i=0; i<dwerrow.syllables.length; i++) {
		if (i%8 == 0) table = table + "<tr>";
		table = table + "<td><div onclick='$(this).siblings().show();'>Clan " + dwerrow.syllables[i][0] + "khakh</div><table style='display:none;'>";
		for (var j=0; j<dwerrow.syllables.length; j++) {
			if (j%8 == 0) table = table + "<tr>";
			var tableId = "table-" + i + "-" + j;
			table = table + "<td><span onclick='$(\"#" + tableId + "\").show()" + "' title='Clan " + dwerrow.syllables[i][0] + "foaf'>" + dwerrow.syllables[j][0] + dwerrow.syllables[i][1] + "</span><table id = '" + tableId + "' style='display:none;'>";
			for (k=0; k<dwerrow.syllables.length; k++) {
				if (k%8 == 0) table = table + "<tr>";
				table = table + "<td>" + dwerrow.syllables[j][0] + dwerrow.syllables[i][1] + dwerrow.syllables[k][2] + "</td>";
				if (k%8 == 7) table = table + "</tr>";
			}
			table = table + "</table></td>";
			if (j%8 == 7) table = table + "</tr>";
		}
		table = table + "</table></td>";
		if (i%8 == 7) table = table + "</tr>";
	}
	$("div#nameTables").append(table);
};
