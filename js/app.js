var in_lesson = false;
var score = 0;
var score_to_pass = 7;
var expected_answer = '';
var current_lesson = 0;
var pass = false;

var current_year = new Date().getYear() + 1970; 
var current_doomsday = doomsday(current_year);

var LESSON_MATERIALS = [{
	content: sprintf('%+rBÀI 1%-r%n%nTrong bài khởi động này, nhiệm vụ của bạn là tính nhẩm thứ trong tuần của một ngày, biết thứ của một ngày khác trong cùng tháng. Điều bạn cần làm là cộng/trừ bội số của 7 vào ngày cho trước, từ đó tìm ra thứ trong tuần của ngày cần tính.%n%nHãy thử tài với loạt câu hỏi được đưa ra bằng cách nhập số tương ứng với đáp án của bạn, 2 - thứ hai, 3 - thứ ba,... 7 - thứ bảy, 8 - chủ nhật. Để qua bài học này bạn cần %d điểm.%n%n', score_to_pass),
	qa: day_of_week_from_2_dates_in_same_month,
	tip: 'Nhập thứ dưới dạng số (2 - thứ hai, 8 - chủ nhật)'
}, {
	content: sprintf('%+rBÀI 2%-r%n%nĐiều đầu tiên bạn phải nhớ trong bài học này là: Trong một năm, ngày chúng ta quan tâm nhất là ngày cuối cùng của tháng 2 - %+iNgày tận thế (Doomsday)%-i. Với năm thường, đó là ngày 28; năm nhuận - ngày 29.%n%nLấy ví dụ, năm nay (%d) tháng 2 có %d ngày. Ngày cuối cùng của tháng là %s. Từ đó, bạn tính được thứ của tất cả các ngày khác trong tháng 2.%n%nĐiều thú vị hơn là, ngày 4/4, 6/6, 8/8, 10/10, 12/12 trong năm nay cũng là %s - trùng với %+iNgày tận thế%-i. Hơn thế, nó đúng với tất cả các năm. Thứ của các ngày 4/4, 6/6, 8/8, 10/10, 12/12 luôn trùng với thứ của %+iNgày tận thế%-i của năm đó.%n%nGiờ bạn hãy dùng kiến thức vừa học để áp dụng vào việc tìm thứ của các ngày trong tháng chẵn. Bạn cần %d điểm để qua bài 2.%n%n', current_year, current_doomsday, human_day_of_week({day: current_doomsday, month: 2, year: current_year}), human_day_of_week({day: current_doomsday, month: 2, year: current_year}), score_to_pass),
	qa: day_of_week_from_date_in_even_months,
	tip: '28(29)/2, 4/4, 6/6, 8/8, 10/10, 12/12 cùng thứ trong tuần'
}];

function $(id) {
	return document.getElementById(id);
}

function start() {
	term = new Terminal({
		x: 0, 
		y: 0, 
		framewidth: 0, 
		bgColor: '#DEDAC5', 
		frameColor: '#A2A2A2',
		wrapping: true,
		handler: termHandler, 
		initHandler: termInitHandler
	});
	term.open();
	repo();
}

function termInitHandler() {
	this.write(
		[
		this.globals.center('####################################################', 80),
		this.globals.center('#                                                  #', 80),
		this.globals.center('#             Thuật toán Ngày tận thế              #', 80),
		this.globals.center('#      Xác định thứ trong tuần của ngày bất kỳ     #', 80),
		this.globals.center('#                                                  #', 80),
		this.globals.center('#                                                  #', 80),
		this.globals.center('#  Bạn hãy gõ "intro" để biết thêm chi tiết.       #', 80),
		this.globals.center('#                                                  #', 80),
		this.globals.center('####################################################', 80),
		'%n'
		]
	);
	this.statusLine('', 8, 2);
	this.statusLine('Bạn có thể chọn bài mình muốn học bằng lệnh "lesson <n>" (n - số thứ tự).');
	this.maxLines -= 2;
	this.prompt();
}

function termHandler() {
	var line = this.lineBuffer;
	this.newLine();
	if (line == 'help') {
		this.write('Lorem ipsum dolor sit amet');
		this.prompt();
	} else if ((line == 'exit' || line == 'quit') && !in_lesson) {
		this.close();
		return;
	} else if (line == 'clear') {
		this.clear();
		this.prompt();
	} else if (line.match(/^lesson [0-9]+$/)) {
		var no = line.match(/^lesson ([0-9]+)$/)[1] || 0;
		startLesson(no);
	} else if (in_lesson) {
		if (score == score_to_pass) {
			back_to_main();
		} else {
			check_answer(line);
		}
	} else if (line != '') {
		this.write(sprintf('Lệnh "%s" không tồn tại. Bạn có thể gõ "help" để xem danh sách các lệnh.', line));
		this.prompt();
	} else {
		this.prompt();
	}
}

function startLesson(no) {
	if (no > LESSON_MATERIALS.length) {
		term.write(sprintf('Bài học không tồn tại. Bạn có thể gõ "list" để xem danh sách các bài học.', no));
		term.prompt();
		return;
	}
	
	term.clear();
	current_lesson = parseInt(no, 10) - 1;
	score = 0;
	in_lesson = true;
	pass = false;
	score_to_pass = LESSON_MATERIALS[current_lesson].score_to_pass || 7;
	
	term.write(LESSON_MATERIALS[current_lesson].content);
	term.statusLine(sprintf('Bạn có thể gõ "quit" để thoát khỏi bài học bất kỳ lúc nào.', score_to_pass));
	
	nextQuestion();
}

function back_to_main() {
	in_lesson = false;
	term.clear();
	term.statusLine('Bạn có thể chọn bài mình muốn học bằng lệnh "lesson <n>" (n - số thứ tự)');
	term.prompt();
}

function nextQuestion() {
	var qa = LESSON_MATERIALS[current_lesson].qa.call();
	term.write(qa.question);
	expected_answer = qa.answer;
	term.prompt();
}

function check_answer(line) {
	if (line == 'quit' || line == 'q') {
		back_to_main();
		return;
	}
	
	answer = parseInt(line, 10);
	// sunday
	answer = (answer == 0) ? 8 : answer;
	
	if (answer == expected_answer) {
		score++;
	}
	term.statusLine(sprintf('Điểm: %d/%d - %s', score, score_to_pass, LESSON_MATERIALS[current_lesson].tip));
	
	if (score < score_to_pass) {
		nextQuestion();
	} else {
		term.write(sprintf('Bạn đã hoàn thành xuất sắc Bài %d. Gõ Enter để thoát.', current_lesson + 1));
		term.statusLine(sprintf('Điểm: %d/%d - Gõ Enter để thoát bài học', score, score_to_pass));
		term.prompt();
	}
}

function repo() {
	$('terminal').style.left = (window.innerWidth - term.getDimensions().width) / 2 + 'px';
}

window.onresize = repo;