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

modern.RATE_dchildbirth = 2; // Actually, something like 1 in 10,000.
modern.RATE_dchildhood = 0; //rounded up from us rates of 6 in 1000 under age 1, 26.5 in 100,000 age 1-4, 12.9 in 1000 age 5-14
modern.RATE_daccident = 0.04; //Chance of accidental death per year (39 in 100,000)

modern.MEAN_childDelay = 3;
modern.STD_childDelay = 1;

modern.fnames = ["Elena", "Natalya", "Ekaterina", "Olga", "Anastasia", "Tatiana", "Anna", "Yulia", "Irina", "Maria", "Svetlana", "Ksenia", "Oksana", "Marina", "Viktoria", "Darya", "Darina", "Aleksandra", "Kristina", "Nadezhda", "Evgenia", "Alina", "Lyudmila", "Galina", "Valeriya", "Lyubov", "Olesya", "Valentina", "Elizaveta", "Polina", "Margarita", "Larisa", "Diana", "Vera", "Liliya", "Sofia", "Alisa", "Alla", "Anzhelika", "Zhanna", "Lidiya", "Tamara", "Uljana", "Kira", "Vasilisa", "Varvara", "Alyona", "Maya", "Veronika", "Eva", "Nina"];

modern.mnames = ["Aleksander", "Sergei", "Dmitri", "Aleksei", "Andrei", "Maksim", "Evgeniy", "Vladimir", "Ivan", "Mikhail", "Denis", "Vsevolod", "Nikolai", "Pavel", "Roman", "Artem", "Anton", "Igor", "Vladislav", "Nikita", "Oleg", "Ilya", "Yuri", "Vasiliy", "Viktor", "Konstantin", "Kirill", "Stanislav", "Timofey", "Daniil", "Vitaliy", "Boghdan", "Stepan", "Anatoliy", "Vyacheslav", "Vadim", "Valeriy", "Arthur", "Petr", "Egor", "Yaroslav", "Timur", "Fedor", "Matvei", "Boris", "Semen", "Arseniy", "Afanasiy", "Valentin", "Gennadiy", "Georgiy", "Grigoriy", "Gleb", "Iosif", "Kuzma", "Lev", "Leonid", "Mark", "Rostislav", "Ruslan", "Saveliy", "Svytoslav", "Eduard", "Yakov"];

modern.generateFertility = function(fertyear, girl) {
	var chance = 0;
	if (fertyear>=17 && fertyear <=40) {
		chance = 20;
	}
	return chance;
}

modern.generateName = function(person) {
	return pickRandomName(person);
};

modern.generateNameTable = function() {
	listNames();
};
