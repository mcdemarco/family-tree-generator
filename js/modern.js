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

modern.fnames = ["Елена", "Наталья", "Екатерина", "Ольга", "Анастасия", "Татьяна", "Анна", "Юлия", "Ирина", "Мария", "Светлана", "Ксения", "Оксана", "Марина", "Виктория", "Дарья", "Дарина", "Александра", "Кристина", "Надежда", "Евгения", "Алина", "Людмила", "Галина", "Валерия", "Любовь", "Олеся", "Валентина", "Елизавета", "Полина", "Маргарита", "Лариса", "Диана", "Вера", "Лилия", "Софья", "София", "Алиса", "Алла", "Ангелина", "Жанна", "Лидия", "Тамара", "Ульяна", "Кира", "Василиса", "Варвара"];

modern.mnames = ["Александр", "Сергей", "Дмитрий", "Алексей", "Андрей", "Максим", "Евгений", "Владимир", "Иван", "Михаил", "Денис", "Всеволод", "Николай", "Павел", "Роман", "Артём", "Антон", "Игорь", "Владислав", "Никита", "Олег", "Илья", "Юрий", "Василий", "Виктор", "Константин", "Кирилл", "Станислав", "Тимофей", "Даниил", "Виталий", "Руслан", "Степан", "Анатолий", "Вячеслав", "Вадим", "Валерий", "Артур", "Пётр", "Егор", "Святослав", "Тимур", "Фёдор", "Вадим", "Борис", "Семен",];

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
