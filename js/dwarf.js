/* dwarf type */

var dwarf = new Homo();

addRace("dwarf", "Dwarf", dwarf, false);

	dwarf.RATE_remarry_barren = 0; //15;
	dwarf.RATE_remarry_singleChild = 0; //5;
	dwarf.RATE_remarry_multipleHeirs = 0; //3;
	dwarf.RATE_bachelor_ette = 4;  //chance of refusal to marry, both sexes; otherwise married at available spouse rate
	
	dwarf.RATE_male = 75; // Male/female ratio at birth.  Should be 51% for humans.
	
	dwarf.MIN_fmage = 16; // Minimum age of marriage; cut off below dwarf.
	dwarf.MEAN_fmage = 32; // Average age of marriage on a normal curve. % should be 13-21 for medieval human women
	dwarf.STD_fmage = 5; // Standard deviation in age of marriage.
	dwarf.MIN_mmage = 16; // Minimum age of marriage; cut off below this.
	dwarf.MEAN_mmage = 36; // Average age of marriage on a normal curve.
	dwarf.STD_mmage = 10; // Standard deviation in age of marriage.

	dwarf.RATE_dchildbirth = 0.5; //Chance of death in childbirth
	dwarf.RATE_dchildhood = 0.5; //Chance of death in infancy or childhood
	dwarf.RATE_daccident = 0.075; //Chance of accidental death per year
	
	dwarf.MEAN_dage = 256; // Average age of death on a normal curve.
	dwarf.STD_dage = 36; // Standard deviation in age of death.

	dwarf.MEAN_childDelay = 10;
	dwarf.STD_childDelay = 2;

dwarf.fnames = ["Dís", "Dís", "Dís", "Dís", "Dís", "Dís", "Dís", "Dís", "Dís", "Dís"];

dwarf.mnames = ["Azaghâl", "Balin", "Bifur", "Bofur", "Bombur", "Borin", "Dáin ", "Dori", "Durin", "Dwalin", "Farin", "Fíli", "Flói", "Frár", "Frerin", "Frór", "Fundin", "Gamil", "Gimli", "Glóin", "Glóin", "Gróin", "Grór", "Ibûn", "Khîm", "Kíli", "Lóni", "Mîm", "Náin", "Náli", "Nár", "Narvi", "Nori", "Óin", "Ori", "Telchar", "Thorin", "Thráin ", "Thrór"];

dwarf.fchain = construct_chain(dwarf.fnames);
dwarf.mchain = construct_chain(dwarf.mnames);


dwarf.clanList = ["Longbeards", "Firebeards", "Broadbeams", "Ironfists", "Stiffbeards", "Stonefoots", "Blacklocks"];

	// clan generation
dwarf.generateClan = function() { // random clan
	return rollD(dwarf.clanList.length) - 1;
};

dwarf.getClan = function(person) {
	//get clan name from clan ID
	return dwarf.clanList[person.clan];
};

	dwarf.generateFertility = function(fertyear, girl) { // return fertility based on age
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

	dwarf.generateGrief = function() {
		return rollD(2)+rollD(2)+rollD(2)-2;
	};

dwarf.initializeClans = function() {
	$("div#seedUi span.clanForm").show();
	$("div#seedUi span.generationForm").hide();
	var appendage = "";
	for  (var i = 0; i < scot.clanList.length; i++) {
		appendage = "<option value='" + i + "'>" + dwarf.clanList[i] + "</option>";
		$("select#clan1SELECT").append(appendage);
		$("select#clan2SELECT").append(appendage);
	}
};
	
// Functions for showing the name inventory.

dwarf.generateNameTable = function() {
	//Always refresh.
	$("div#nameTables").html("");
	sampleGeneratedNames();
};
