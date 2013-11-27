/* modern human type */

var modern = new Homo();

addRace("modern", "Human: modern", modern);

//needs divorce!

modern.MIN_fmage = 16; // Minimum age of marriage for females; cut off below modern.
modern.MEAN_fmage = 27; // Average age of marriage on a normal curve.
modern.STD_fmage = 4.6; // Standard deviation in age of marriage.
modern.MIN_mmage = 18; // Minimum age of marriage for males; cut off below modern.
modern.MEAN_mmage = 29; // Average age of marriage on a normal curve.
modern.STD_mmage = 5.3; // Standard deviation in age of marriage.

modern.RATE_dchildhood = 1; //rounded up from us rates of 6 in 1000 under age 1, 26.5 in 100,000 age 1-4, 12.9 in 1000 age 5-14
modern.RATE_daccident = 0.04; //Chance of accidental death per year (39 in 100,000)

modern.MEAN_childDelay = 3;
modern.STD_childDelay = 1;


modern.generateFertility = function(fertyear, girl) {
	var chance = 0;
	if (fertyear>=14 && fertyear <=44) {
		chance = 6.3;
	}
	return chance;
}
