/* base humanoid type */

var homo = new Homo();

addRace("homo", "Homo sapiens", homo);

function Homo() {
	this.RATE_remarry_barren = 15;
	this.RATE_remarry_singleChild = 5;
	this.RATE_remarry_multipleHeirs = 3;
	this.RATE_bachelor_ette = 4;  //chance of refusal to marry, both sexes; otherwise married at available spouse rate
	
	this.RATE_male = 51; // Male/female ratio at birth.  Should be 51% for humans.
	
	this.MIN_fmage = 16; // Minimum age of marriage; cut off below this.
	this.MEAN_fmage = 32; // Average age of marriage on a normal curve. % should be 13-21 for medieval human women
	this.STD_fmage = 5; // Standard deviation in age of marriage.
	this.MIN_mmage = 16; // Minimum age of marriage; cut off below this.
	this.MEAN_mmage = 36; // Average age of marriage on a normal curve.
	this.STD_mmage = 10; // Standard deviation in age of marriage.
	
	this.MEAN_dage = 256; // Average age of death on a normal curve.
	this.STD_dage = 36; // Standard deviation in age of death.

//To do: incorporate odds of human premature death:
// 50% dies as a child or teenager
// 25% die in their 20-30's
// 12.5% die in their 40-50's
// 12.5% die in their 60-70's

	this.generateClan = generateClan;
	this.generateFertility = generateFertility;
	this.generateName = generateName;
	this.generatePersonalityType = generatePersonalityType;
	this.generateGrief = generateGrief;
	this.getClan = getClan;
	this.getPTypeName = getPTypeName;

	// clan generation
	function generateClan() { // random clan
		return 0;
	}

	function getClan(person) {
		//get clan name from clan ID
		return false;
	}

// *** begin lame name generation ***
	function generateName(person) {
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
		return capitalize(jname);
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
				vanna=vanna+getvowels();     //no more than 2 vowels or consonants together
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
		var roll=0;                          // occurance in the English language.
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

	// *** end lame name generation ***

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

	function generateGrief() {
		return rollD(2)+rollD(2)+rollD(2)-2;
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

}
