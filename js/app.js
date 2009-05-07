var in_lesson = false;
var score = 0;
var score_to_pass = 7;
var expected_answer = '';
var current_lesson = 0;
var pass = false;

var current_year = new Date().getYear() + 1970; 
var current_doomsday = doomsday(current_year);

var LESSON_MATERIALS = [{
	description: 'Tìm thứ trong tuần của một ngày, biết ngày khác trong cùng tháng',
	content: sprintf('%+rBÀI 1%-r%n%nTrong bài khởi động này, nhiệm vụ của bạn là tính nhẩm thứ trong tuần của một ngày, biết thứ của một ngày khác trong cùng tháng. Điều bạn cần làm là cộng/trừ bội số của 7 vào ngày cho trước, từ đó tìm ra thứ trong tuần của ngày cần tính.%n%nHãy thử tài với loạt câu hỏi được đưa ra bằng cách nhập số tương ứng với đáp án của bạn, 2 - thứ hai, 3 - thứ ba,... 7 - thứ bảy, 8 - chủ nhật. Để qua bài học này bạn cần %d điểm.%n%n', 5),
	qa: day_of_week_from_2_dates_in_same_month,
	tip: 'Nhập thứ dưới dạng số (2 - thứ hai, 8 - chủ nhật)',
	score_to_pass: 5
}, {
	description: 'Tìm thứ của một ngày trong tháng chẵn',
	content: sprintf('%+rBÀI 2%-r%n%nĐiều đầu tiên bạn phải nhớ trong bài học này là: Trong một năm, ngày chúng ta quan tâm nhất là ngày cuối cùng của tháng 2 - "%+iNgày tận thế (Doomsday)%-i". Với năm thường, đó là ngày 28; năm nhuận - ngày 29.%n%nLấy ví dụ, năm nay (%d) tháng 2 có %d ngày. Ngày cuối cùng của tháng là %s. Từ đó, bạn tính được thứ của tất cả các ngày khác trong tháng 2.%n%nĐiều thú vị hơn là, ngày 4/4, 6/6, 8/8, 10/10, 12/12 trong năm nay cũng là %s - trùng với %+iNgày tận thế%-i. Hơn thế, nó đúng với tất cả các năm. Thứ của các ngày 4/4, 6/6, 8/8, 10/10, 12/12 luôn trùng với thứ của %+iNgày tận thế%-i của năm đó.%n%nGiờ bạn hãy dùng kiến thức vừa học để áp dụng vào việc tìm thứ của các ngày trong tháng chẵn. Bạn cần %d điểm để qua bài 2.%n%n', current_year, current_doomsday, human_day_of_week({day: current_doomsday, month: 2, year: current_year}), human_day_of_week({day: current_doomsday, month: 2, year: current_year}), 5),
	qa: day_of_week_from_date_in_even_months,
	tip: '28(29)/2, 4/4, 6/6, 8/8, 10/10, 12/12 cùng thứ trong tuần',
	score_to_pass: 5
}, {
	description: 'Tìm thứ của một ngày trong tháng lẻ',
	content: sprintf('%+rBÀI 3%-r%n%nTrong bài 3, chúng ta sẽ xét đến những tháng lẻ. Coi ngày cuối tháng 2 là ngày "mùng 0" của tháng 3 - ta có %+iNgày tận thế%-i thứ nhất: 7/3.%n%nNhớ %+iNgày tận thế%-i trong những tháng lẻ khác (5, 7, 9, 11) - trừ tháng 1 - cần bạn thuộc "câu thần chú": %+iTôi làm việc từ 9 đến 5 ở 7-11 (I work 9-5 at the 7-11).%-i 9h đến 5h là giờ đi làm ở một số nước, và 7-Eleven là tên một chuỗi cửa hàng có tiếng trên thế giới. Với "câu thần chú" này, bạn biết thêm 4 %+iNgày tận thế%-i: 5/9, 9/5, 7/11, 11/7.%n%nGiờ đến tháng 1. Nếu năm đang xét là năm thường,  %+iNgày tận thế%-i là 3/1, nếu năm nhuận (chia hết cho 4) - 4/1.%n%nKhá rắc rối và khó nhớ, tuy nhiên một khi nắm được bạn sẽ thấy mọi chuyện thật đơn giản. Hãy cố gắng qua bài này với %d điểm.%n%n', 5),
	qa: day_of_week_from_date_in_odd_months,
	tip: '3(4)/1, 0(7)/3, 5/9, 9/5, 7/11, 11/7 cùng thứ trong tuần',
	score_to_pass: 5
}, {
	description: 'Ôn tập',
	content: sprintf('%+rBÀI 4%-r%%n%nĐây là bài ôn tập, yêu cầu bạn sử dụng kiến thức của 2 bài trước. Mục tiêu của bạn là %d điểm.%n%n', 7),
	qa: day_of_week_from_date_in_any_months,
	tip: '3(4)/1, 0(7)/3, 5/9, 9/5, 7/11, 11/7, 28(29)/2, 4/4',
	score_to_pass: 7
}, {
	description: 'Tìm Ngày tận thế của năm trong thế kỷ 20',
	content: sprintf('%+rBÀI 5%-r%n%nẮt hẳn sau 4 bài học vừa qua, bạn rút ra kết luận: Biết thứ trong tuần của %+iNgày tận thế%-i trong một năm sẽ giúp ta nhẩm được thứ của một ngày bất kỳ trong năm đó. %+iNgày tận thế%-i năm nay là %s, còn các năm khác thì sao?%n%nXét đến thế kỷ 20 với mốc là năm 1900 - %+iNgày tận thế%-i là thứ tư. Để biết %+iNgày tận thế%-i của các năm 19YY khác (ví dụ 1929) rơi vào hôm nào, bạn làm như sau:%n%n- Xét số tạo bởi 2 chữ số cuối của năm (29)%n- Đem số đó chia 12, lấy thương (29/12=2) và số dư (5)%n- Đem số dư chia 4, lấy thương (5/4=1)%n- Cộng tất cả lại (2+5+1=8)%n- Bỏ bội của 7 khỏi kết quả(8-7=1)%n- Cuối cùng đem kết quả cộng với 4 (tương ứng với thứ tư) => Đáp áp là thứ năm%n%nỞ đây coi 2 - thứ hai, 3 - thứ 3,... 1 - chủ nhật.%n%nRắc rối nhỉ? Thử xem nhé. %d điểm và bạn qua được bài này.%n%n', human_day_of_week(current_doomsday), 5),
	qa: doomsday_from_any_years_in_20th_century,
	tip: 'Thương + Số dư khi chia 12 + Thương khi lấy số dư chia 4 + 4',
	score_to_pass: 5
}, {
	description: 'Ôn tập',
	content: sprintf('%+rBÀI 6%-r%%n%nThêm một bài ôn tập nữa, áp dụng tất cả những gì bạn đã học để tìm thứ trong tuần của một ngày bất kỳ trong thế kỷ 21. Biết %+iNgày tận thế%-i của năm 2000 là thứ 3. Đây là mốc để cộng với kết quả thu được sau phép toán: Thương + Số dư khi chia 12 + Thương khi lấy số dư chia 4.%n%nBạn qua bài này với %d điểm.%n%n', 7),
	qa: day_of_week_from_date_in_21st_century,
	tip: 'Thương + Số dư khi chia 12 + Thương khi lấy số dư chia 4 + 3',
	score_to_pass: 7
}, {
	description: 'Tìm Ngày tận thế của năm bất kỳ',
	content: sprintf('%+rBÀI 7%-r%%n%nTrong Bài 7 bạn sẽ học cách tính %+iNgày tận thế%-i của một năm bất kỳ. Nhiệm vụ của bạn là xác định %+iNgày tận thế%-i của năm đầu thế kỷ đó, từ đó suy ra %+iNgày tận thế%-i của năm cần tìm.%n%nBạn cần nhớ:%n%n- %+iNgày tận thế%-i của năm 2100 là chủ nhật (Sun)%n- %+iNgày tận thế%-i của năm 2000 là thứ ba (Tue)%n- %+iNgày tận thế%-i của năm 1900 là thứ tư (Wed)%n- %+iNgày tận thế%-i của năm 1800 là thứ sáu (Fri)%n%nGhi nhớ bằng cách ghép các thứ lại thành câu: %+iSun-Tue-Wed-Fri%-i (Son to wed Friday - Con trai sẽ cưới vợ vào thứ sáu)%n%nChu kỳ này lặp mỗi 4 năm, nghĩa là %+iNgày tận thế%-i của 1700, 1600, 1500, 1400 lần lượt là chủ nhật, thứ ba, thứ tư, thứ sáu. Hãy thử áp dụng nhé - bạn cần %d điểm.%n%n', 5),
	qa: doomsday_from_any_years,
	tip: '2100-2000-1900-1800: Sun-Tue-Wed-Fri',
	score_to_pass: 5
}, {
	description: 'Ôn tập',
	content: sprintf('%+rBÀI 8%-r%n%nBài 8 là bài ôn tập và cũng là bài cuối cùng. Bạn sẽ xác định %+ithứ trong tuần của một ngày bất kỳ%-i. Mục tiêu của bạn là %d điểm.%n%n', score_to_pass),
	qa: day_of_week_from_any_dates,
	tip: 'Sử dụng tất cả kiến thức bạn từng học',
	score_to_pass: 7
}, {
	content: sprintf('%+rBÀI 8%-r%n%nChỉ có 8 bài học thôi bạn ạ.%n%n'),
	qa: one_plus_one,
	tip: 'Tắt máy đi chơi thôi',
	score_to_pass: 1
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
	this.statusLine('Gõ "lesson <n>" để học bài <n>, "list" - xem danh sách bài học.');
	this.maxLines -= 2;
	this.prompt();
}

function termHandler() {
	var line = this.lineBuffer;
	this.newLine();
	if ((line == 'exit' || line == 'quit' || line == 'q') && !in_lesson) {
		this.close();
		$('terminal').style.display = 'none';
		document.location = 'http://tr.im/doomsday';
		return;
	} else if (line == 'clear') {
		this.clear();
		this.prompt();
	} else if (line.match(/^(intro|help|list|about)$/)) {
		show_page(line);
	} else if (line.match(/^lesson [0-9]+$/)) {
		var no = line.match(/^lesson ([0-9]+)$/)[1] || 0;
		start_lesson(no);
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

function show_page(name) {
	term.clear();
	
	switch (name) {
		case 'intro':
			term.write('%+rGiới thiệu%-r%n%nĐã bao nhiêu lần bạn đặt câu hỏi: Ngày mm/dd/yyyy là thứ mấy? Chắc chắn không dưới 10 lần, thậm chí là 100 lần. Vậy bạn có muốn tự mình trả lời câu hỏi quen thuộc đó bằng cách tính nhẩm, thay vì sử dụng máy tính/điện thoại/lịch? Cách tính nghe qua có vẻ phức tạp, nhưng khi đã quen bạn sẽ thấy rất dễ dàng.%n%nCác bài học, cũng như bài tập, được trình bày trong giao diện dòng lệnh này. Bạn có thể gõ "help" để xem danh sách các lệnh.%n%n');
			break;
		case 'help':
			term.write(sprintf('%+rDanh sách lệnh%-r%n%n- help: Hiển thị màn hình này%n- quit: Thoát khỏi terminal%n- clear: Xóa màn hình%n- intro: Giới thiệu%n- lesson <n>: Bắt đầu bài học <n> (n từ 1 - %d)%n- list: Danh sách các bài học%n- about: Về trang web này%n%n', LESSON_MATERIALS.length - 1));
			break;
		case 'list':
			var out = '%+rDanh sách bài học%-r%n%n';
			for (var i = 0; i < LESSON_MATERIALS.length - 1; i++) {
				out += sprintf('- Bài %d: %s%n', i + 1, LESSON_MATERIALS[i].description);
			}
			out += '%n';
			term.write(out);
			break;
		case 'about':
			term.write('%+rThông tin%-r%n%nTrang web này được viết bằng JavaScript và thư viện termlib (http://www.masswerk.at/termlib/)%n%nCác bài học được tổng hợp dựa trên bài viết Doomsday Algorithm (http://rudy.ca/doomsday.html)%n%n(c) Bản quyền 2009 QAD (http://onetruebrace.com)%n%n');
			break;
	}
	
	term.prompt();
}

function start_lesson(no) {
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
	term.statusLine('Gõ "quit" - thoát khỏi bài học, "review" - xem lại bài học');
	
	next_question();
}

function back_to_main() {
	in_lesson = false;
	term.clear();
	term.statusLine('Gõ "lesson <n>" để học bài <n>, "list" - xem danh sách bài học.');
	term.prompt();
}

function next_question() {
	var qa = LESSON_MATERIALS[current_lesson].qa.call();
	term.write(qa.question);
	expected_answer = qa.answer;
	term.prompt();
}

function check_answer(line) {
	if (line == 'quit' || line == 'q' || line == 'exit') {
		back_to_main();
		return;
	} else if (line == 'review') {
		term.clear();
		term.write(LESSON_MATERIALS[current_lesson].content);
		return next_question();
	}
	
	answer = parseInt(line, 10);
	// sunday
	answer = (answer == 0) ? 8 : answer;
	
	if (answer == expected_answer) {
		term.write('Chính xác.%n%n');
		score++;
	} else {
		term.write(sprintf('Sai. Đáp án là %s.%n%n', human_number(expected_answer)));
	}
	term.statusLine(sprintf('Điểm: %d/%d - %s', score, score_to_pass, LESSON_MATERIALS[current_lesson].tip));
	
	if (score < score_to_pass) {
		next_question();
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