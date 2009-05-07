var RANGE = {from: 1500, to: 2500};
var DAY = ['thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy', 'chủ nhật'];

// http://en.wikipedia.org/wiki/Zeller%27s_congruence
function day_of_week(date) {
	var q, k, j, h;
	var day = date.day || 27;
	var month = date.month || 10;
	var year = date.year || 1989;
	
	q = day;
	m = (month >= 3) ? month : month + 12;
	year = (month >= 3) ? year : year - 1;
	k = year % 100;
	j = Math.floor(year / 100);
	
	h = (q + Math.floor((m + 1) * 2.6) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j) % 7;
	return ((h + 5) % 7) + 2; // [2 -> Monday, 8 -> Sunday]
}

function human_day_of_week(date) {
	var dow = day_of_week(date);
	return human_number(dow);
}

function human_number(number) {
	return DAY[number - 2];
}

function leap_year(year) {
    return (year % 400 == 0) || (year % 4 == 0) && (year % 100 != 0);
}

function doomsday(year) {
	return leap_year(year) ? 29 : 28;
}

function random_date(options) {
	var max = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	var from = options.from || RANGE.from;
	var to = options.to || RANGE.to;
	var year = options.year || random_number_between(from, to);
	max[1] = doomsday(year);
	var month = options.month || random_number_between(1, 12);
	var day = random_number_between(1, max[month - 1]);
	
	return {
		day: day,
		month: month,
		year: year
	};
}

function random_number_between(small, large) {
	return Math.floor(Math.random() * (large - small + 1)) + small;
}

function human(date) {
	return sprintf('%d/%d/%d', date.day, date.month, date.year);
}

function are_the_same(obj1, obj2) {
	same = true;
	for (p in obj1) {
		if (obj1[p] != obj2[p]) {
			same = false;
			break;
		}
	}
	return same;
}

function day_of_week_from_2_dates_in_same_month() {
	var year = random_number_between(RANGE.from, RANGE.to);
	var month = random_number_between(1, 12);
	var date1 = random_date({year: year, month: month});
	var date2 = random_date({year: year, month: month});
	while (are_the_same(date1, date2)) date2 = random_date({year: year, month: month});
	
	return {
		question: sprintf('Nếu ngày %s là %s thì ngày %s là thứ mấy?', human(date1), human_day_of_week(date1), human(date2)),
		answer: day_of_week(date2)
	};
}

function day_of_week_from_date_in_even_months() {
	var year = random_number_between(RANGE.from, RANGE.to);
	var month = random_number_between(1, 12);
	while (month % 2 == 1) month = random_number_between(1, 12);
	var dday = doomsday(year);
	var date = random_date({year: year, month: month});
	
	return {
		question: sprintf('Biết %s là %s, ngày %s là thứ mấy?', human({day: dday, month: 2, year: year}), human_day_of_week({day: dday, month: 2, year: year}), human(date)),
		answer: day_of_week(date)
	};
}

function day_of_week_from_date_in_odd_months() {
	var year = random_number_between(RANGE.from, RANGE.to);
	var month = random_number_between(1, 12);
	while (month % 2 == 0) month = random_number_between(1, 12);
	var dday = doomsday(year);
	var date = random_date({year: year, month: month});
	
	return {
		question: sprintf('Biết %s là %s, ngày %s là thứ mấy?', human({day: dday, month: 2, year: year}), human_day_of_week({day: dday, month: 2, year: year}), human(date)),
		answer: day_of_week(date)
	};
}

function day_of_week_from_date_in_any_months() {
	var year = random_number_between(RANGE.from, RANGE.to);
	var month = random_number_between(1, 12);
	var dday = doomsday(year);
	var date = random_date({year: year, month: month});
	
	return {
		question: sprintf('Biết %s là %s, ngày %s là thứ mấy?', human({day: dday, month: 2, year: year}), human_day_of_week({day: dday, month: 2, year: year}), human(date)),
		answer: day_of_week(date)
	};
}

function doomsday_from_any_years() {
	var year = random_number_between(1901, 1999);
	var dday = doomsday(year);
	
	return {
		question: sprintf('%+iNgày tận thế%-i năm %s là thứ mấy?', year),
		answer: day_of_week({day: dday, month: 2, year: year})
	};
}

function day_of_week_from_date_in_21th_century() {
	var year = random_number_between(2001, 2099);
	var month = random_number_between(1, 12);
	var date = random_date({year: year, month: month});
	
	return {
		question: sprintf('Ngày %s là thứ mấy?', human(date)),
		answer: day_of_week(date)
	};
}