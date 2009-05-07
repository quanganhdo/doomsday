var LESSIONS_MATERIALS = [{
	intro: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	qa: day_of_week_from_2_days_in_same_month
}];

var in_lesson = 0;
var score = 0;
var expected_answer = '';

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
	this.statusLine('Bạn có thể chọn bài mình muốn học bằng lệnh "lesson <n>" (n - số thứ tự)');
	this.maxLines -= 2;
	this.prompt();
}

function termHandler() {
	var line = this.lineBuffer;
	this.newLine();
	if (line == 'help') {
		this.write('Lorem ipsum dolor sit amet');
		this.prompt();
	} else if (line == 'exit' || line == 'quit') {
		this.close();
		return;
	} else if (line == 'clear') {
		this.clear();
		this.prompt();
	} else if (line.match(/^lesson [0-9]*$/) || line.match(/^l [0-9]*$/)) {
		var no = line.match(/^lesson ([0-9]*)$/)[1] || line.match(/^l ([0-9]*)$/)[1] || 0;
		startLesson(no);
	} else if (in_lession == 1) {
		check_answer(line);
	} else if (line != '') {
		this.write('Lệnh "' + line + '" không tồn tại. Bạn có thể gõ "help" để xem danh sách các lệnh.');
		this.prompt();
	}
}

function startLesson(no) {
	var no = parseInt(no, 10) - 1;
	
	score = 0;
	in_lesson = 1;
	term.statusLine(sprintf('Điểm: 0/7', score));
	
	while (in_lesson()) {
		term.write(LESSIONS_MATERIALS[no].qa.question);
		expected_answer = LESSIONS_MATERIALS[no].qa.answer;
		term.prompt();
	}
}

function check_answer(line) {
	answer = parseInt(line, 10);
	// sunday
	answer = (answer == 0) ? 8 : answer;
	if (answer == expected_answer) {
		score++;
	}
	term.statusLine(sprintf('Điểm: %d/7', score));
	term.prompt();
}

function repo() {
	$('terminal').style.left = (window.innerWidth - term.getDimensions().width) / 2 + 'px';
}

window.onresize = repo;