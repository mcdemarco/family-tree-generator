/* base humanoid type/medieval human type */

var homo = new Homo();
var medieval = new Homo();

addRace("medieval", "Human: medieval", medieval, true);

function Homo() {
	this.RATE_remarry_barren = 15;
	this.RATE_remarry_singleChild = 5;
	this.RATE_remarry_multipleHeirs = 3;
	this.RATE_bachelor_ette = 4;  //chance of refusal to marry, both sexes; otherwise married at available spouse rate
	
	this.RATE_male = 51; // Male/female ratio at birth.
	
	this.MIN_fmage = 12; // Minimum age of marriage for females; cut off below this.
	this.MEAN_fmage = 17; // Average age of marriage on a normal curve.
	this.STD_fmage = 2; // Standard deviation in age of marriage.
	this.MIN_mmage = 17; // Minimum age of marriage for males; cut off below this.
	this.MEAN_mmage = 25; // Average age of marriage on a normal curve.
	this.STD_mmage = 4; // Standard deviation in age of marriage.
	
	// http://birthnerd.blogspot.com/2011/07/pre-modern-death-in-childbirth.html
	this.RATE_dchildbirth = 2.5; //Chance of maternal death per childbirth
	this.RATE_dchildhood = 35; //Chance of death in infancy or childhood
	this.RATE_daccident = 0.05; //Chance of accidental death per year

	this.MEAN_dage = 72; // Average age of natural death (post-childhood) on a normal curve.
	this.STD_dage = 15; // Standard deviation in age of death.

	this.MEAN_childDelay = 1.5; // Medieval pregnancy spacing was about 18 months.
	this.STD_childDelay = 0.25; // I made this one up.

	//Medieval Frankish names from Kate Monk's Onomastikon
	this.fnames = ["Adallinda", "Adaltrude", "Adelheid", "Alpaida", "Alpais", "Ansgard",
				   "Aubirge", "Audofleda", "Baldechildis", "Basina", "Begga", "Berenga",
				   "Bertha", "Bertrada", "Burgundefara", "Clothild", "Eadgithu", "Emma",
				   "Engelberga", "Ermengard", "Ermentrudis", "Fara", "Fastrada", "Foy",
				   "Genofeva", "Gersvinda", "Gisela", "Gudula", "Gudule", "Gundrada",
				   "Herleva", "Hildegard", "Hildegarde", "Hildegund", "Hiltrude", "Hodierna",
				   "Ingeltrude", "Ingeltrudis", "Joveta", "Liobsynde", "Liutgarde", "Madelgarde",
				   "Mechtild", "Moschia", "Nantechildis", "Oda", "Ogiva", "Plectrudis",
				   "Radogund", "Rosamund", "Rothaide", "Rotrude", "Rotrudis", "Ruothilde",
				   "Theodelinda", "Theoderada", "Theutberga", "Waldrada"];
	this.mnames = ["Abbo", "Adalbert", "Adaldag", "Adalhard", "Adelard", "Aega",
				   "Agilbert", "Agobard", "Aigulf", "Alberic", "Allowin", "Amalricus",
				   "Amand", "Amator", "Angegisis", "Angilbart", "Angilbert", "Anno",
				   "Ansegisel", "Anskar", "Arbitio", "Arbogast", "Arbogastes", "Arculf",
				   "Arnoul", "Arnulf", "Artaud", "Asselin", "Atacinus", "Audoen",
				   "Audomar", "Audoneus", "Audramnus", "Baugulf", "Bauto", "Bavo",
				   "Benild", "Berchar", "Berengar", "Bernard", "Berno", "Bero",
				   "Bertelis", "Berthaire", "Bertin", "Bertulf", "Besso", "Birinus",
				   "Blutmund", "Boso", "Bovo", "Brice", "Britius", "Brocard",
				   "Bruno", "Burchard", "Butilin", "Carloman", "Cassyon", "Ceufroy",
				   "Charibert", "Charles", "Cheldric", "Childebert", "Childebrand", "Childeric",
				   "Chilperic", "Chlodmer", "Chlodowig", "Chlotar", "Chrodegang", "Clodomir",
				   "Clotaire", "Clothair", "Clovis", "Corbinian", "Cyr", "Cyricus",
				   "Dado", "Dagobert", "Dalfin", "Dodo", "Dreux", "Drogo",
				   "Dudon", "Ebbo", "Ebroin", "Ebrulf", "Einhard", "Emme",
				   "Emmeran", "Engilbert", "Enurchus", "Erchinoald", "Evroul", "Evroult",
				   "Fardulf", "Faro", "Flodoard", "Folcard", "Folmar", "Fredegar",
				   "Fridolin", "Fridugis", "Fulbert", "Fulk", "Fulrad", "Gerbert",
				   "Gereon", "Gerold", "Gifemund", "Giseler", "Giso", "Godobald",
				   "Godun", "Goisfrid", "Goscelin", "Gouzlim", "Gozbert", "Gozolon",
				   "Grifo", "Grimald", "Grimbald", "Gunthar", "Guntramn", "Hagen",
				   "Halinard", "Hartmut", "Helinand", "Helisachar", "Heribert", "Hildebald",
				   "Hildebold", "Hildeprand", "Hilduin", "Hincmar", "Hlodver", "Huebald",
				   "Humbert", "Hunald", "Imbert", "Imninon", "Jocelin", "Lambert",
				   "Lanfranc", "Laudus", "Lebuin", "Ledger", "Leger", "Leodegar",
				   "Letard", "Leufred", "Leufroy", "Leutfrid", "Leuthere", "Liudhard",
				   "Liudolf", "Lo", "Lothar", "Lul", "Lull", "Maiuel",
				   "Maixent", "Majorian", "Mallobaudes", "Mansuetus", "Maraulf", "Marcoul",
				   "Matfrid", "Mauger", "Médard", "Meginhard", "Merobaudes", "Merovech",
				   "Nithard", "Norbert", "Nordbert", "Notker", "Odger", "Odo",
				   "Odulf", "Omer", "Orderic", "Otker", "Ouen", "Ouus",
				   "Pacatian", "Pair", "Pancras", "Panteleon", "Pepin", "Philibert",
				   "Piligrim", "Pippin", "Poppo", "Puvis", "Radigis", "Ragnfred",
				   "Razo", "Reginald", "Reginar", "Remi", "Reolus", "Richomer",
				   "Richomeres", "Riquier", "Rothad", "Samo", "Sergius", "Sicho",
				   "Sigebert", "Sigibert", "Suger", "Suidbert", "Suidger", "Syagrius",
				   "Tassilo", "Taurin", "Tescelin", "Thankmar", "Théodard", "Theodoric",
				   "Theodulf", "Theodulph", "Theudebert", "Theuderic", "Theutgaud", "Thierry",
				   "Thietmar", "Turpin", "Vedast", "Vicelin", "Vigor", "Vulmar",
				   "Waiofar", "Wala", "Walaric", "Waldolanus", "Waltgaud", "Wandregisel",
				   "Wandregisilus", "Wandrille", "Warmann", "Werinbert", "Wibert", "Wichmann",
				   "Willehad", "Willibald", "Willibrord", "Wulfram", "Zwentibold"];

	this.fchain = construct_chain(this.fnames);
	this.mchain = construct_chain(this.mnames);

	this.generateClan = generateClan;
	this.generateFertility = generateFertility;
	this.generateName = generateName;
	this.generatePersonalityType = generatePersonalityType;
	this.generateGrief = generateGrief;
	this.getClan = getClan;
	this.getPTypeName = getPTypeName;
	this.initializeClans = initializeClans;
	this.generateNameTable = generateNameTable;

	// clan generation
	function generateClan() { // random clan
		return 0;
	}

	function getClan(person) {
		//get clan name from clan ID
		return false;
	}

	function generateName(person) {
		return generateRandomName(person.gender);
	}

	function generateFertility(fertyear, girl) { // return fertility based on age
		var chance = 0;
		if (fertyear<14) {chance=10;}
		if (fertyear==14) {chance=20;}
		if (fertyear==15) {chance=40;}
		if (fertyear==16) {chance=60;}
		if (fertyear==17) {chance=80;}
		if (fertyear>17 && fertyear<30) {chance=98;}
		if (fertyear>30 && fertyear<35) {chance=80;}
		if (fertyear>35 && fertyear<40) {chance=50;}
		if (fertyear>40 && fertyear<45) {chance=10;}
		if (fertyear>44) {chance=3;}
		if (fertyear>50) {chance=0;}
		
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

	function initializeClans() {
		$("div#seedUi span.clanForm").hide();
		$("div#seedUi span.generationForm").hide();
	}

	function generateNameTable() {
		//Always refresh.
		$("div#nameTables").html("");
		sampleGeneratedNames();
	}
}
