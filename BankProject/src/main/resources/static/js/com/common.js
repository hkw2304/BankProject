
/*******************************************************************************
* 업     무    명 :  공통 Java Script(기능성 함수 제공)!
* 
* 서브   업 무 명 :  전체 공통 기능성 함수 정의
* 
* 설           명 :  날짜, 시간, String 변환, Input Check, 포맷 Check 등 기능 제공
* 
* 작     성    자 :  XXXX
* 
* 작     성    일 :  XXXX.XX.XX 
* 
* 변  경   이  력: 
* 
* Version   작성자    업   무    일    자          내        용            요 청 자 
* --------   -------   ---------   ----------      ----------------      -------- 
*   1.1      박종식   기능공통   2012.11.05     웹접근성 관련 수정
*
*******************************************************************************/

/*******************************************************************************
 * 성능측정 - 소스 맨 하단에 결과 출력
 *******************************************************************************/
if(typeof wbUI !== 'undefined') var perfCommon = perf();



/*******************************************************************************
 * 데이터타입에서 사용하는 옵션 설정
 *******************************************************************************/

var datToday = new Date();

/*******************************************************************************
 * 커서의 값을 얻기 위하나 설정
 * @param e
 * @returns {Boolean}
 *******************************************************************************/
function WM_getCursorHandler(e) {
try{
  // set event properties to global vars (add or subtract as desired)
  window.event.clientX = e.pageX;
  window.event.clientY = e.pageY;
  window.event.x = e.layerX;
  window.event.y = e.layerY;
  window.event.screenX = e.screenX;
  window.event.screenY = e.screenY;
  // route the event back to the intended function
  if (window.routeEvent && typeof(window.routeEvent)==="function") {
	  if ( window.routeEvent(e) === false ) {
	    return false;
	  } else {
	    return true;
	  }
  }
}catch(e){}
}

/*******************************************************************************
 * check 한 개수를 리턴한다.
 * @param aElem
 * @returns {Number}
 *******************************************************************************/
function getCheckedCount( aElem ) {
	var elem = document.getElementsByName(aElem);
    var cnt = 0;
    for ( var i=0; i<elem.length; i++ ) {
        if ( ( elem[i].type == "checkbox" ) && ( elem[i].checked ) && ( elem[i].name == aElem ) )	cnt = cnt + 1;
    }
    return cnt;
}

/*******************************************************************************
 * Time이 현재시각 이후(미래)인지 체크
 * @param time
 * @returns {Boolean}
 *******************************************************************************/
function isFutureTime(time) {
    return (toTimeObject(time) > new Date());
}

/*******************************************************************************
 * Time이 현재시각 이전(과거)인지 체크
 * @param time
 * @returns {Boolean}
 *******************************************************************************/
function isPastTime(time) {
    return (toTimeObject(time) < new Date());
}

/*******************************************************************************
 * 검색날짜 체크
 * @param obj
 * @param yy
 * @param mm
 * @param dd
 * @returns {Boolean}
 *******************************************************************************/

function isVaildTerm(obj,yy,mm,dd)
{
    var datestr = obj.value;


    //널인지?
    if(isEmpty(datestr)){
        return null;
    }

    // 날짜 포맷제거
    //obj_removeformat(obj);

    //8자리인지?
    if (getByteLength(datestr) != 8) {
		if(ML_LCL.indexOf("EN")>-1)
			alert("Please enter date without ‘-’ in 8 digit figures.");
		else
			alert("날짜는 '-'를 제외한 8자리 숫자로 입력하십시오.");
		
        return false;
    }

    // yy,mm,dd,fromto가 없을 경우
    if (yy == null) yy = 0;
    if (mm == null) mm = 0;
    if (dd == null) dd = 0;

    // 검색날짜 유효기간 가져오기
    var boundDate = getBoundDate(yy,mm,dd);

    if (yy < 0  || mm < 0  || dd < 0) {
        if ( boundDate > datestr) {
			if(ML_LCL.indexOf("EN")>-1)
				alert('Unavailable inquiry date. Available inquiry date is from ' + boundDate.substring(4,6) + "/" + boundDate.substring(6) + "/" + boundDate.substring(0,4));
			else
				alert("유효하지 않은 검색날짜입니다.\n유효한 날짜는" + boundDate.substring(0,4) + "년 " + boundDate.substring(4,6) + "월 " + boundDate.substring(6) + "일부터 입니다.");
            
            obj.select();
            return false;
        }
    } else {
        if ( boundDate < datestr) {
			if(ML_LCL.indexOf("EN")>-1)
				alert('Unavailable inquiry date. Available inquiry date is until ' + boundDate.substring(4,6) + "/" + boundDate.substring(6) + "/" + boundDate.substring(0,4));
			else
				alert("유효하지 않은 검색날짜입니다.\n유효한 날짜는" + boundDate.substring(0,4) + "년 " + boundDate.substring(4,6) + "월 " + boundDate.substring(6) + "일까지 입니다.");
            obj.select();
            return false;
        }
    }


    return true;

}

/*******************************************************************************
 * 유효한(존재하는) 일(日)인지 체크
 * @param yyyy
 * @param mm
 * @param dd
 * @returns {Boolean}
 *******************************************************************************/
function isValidDay(yyyy, mm, dd) {
    var m = parseInt(mm,10) - 1;
    var d = parseInt(dd,10);

    var end = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
        end[1] = 29;
    }

    return (d >= 1 && d <= end[m]);
}

/*******************************************************************************
 * 유효한(존재하는) 시(時)인지 체크
 * @param hh
 * @returns {Boolean}
 *******************************************************************************/
function isValidHour(hh) {
    var h = parseInt(hh,10);
    return (h >= 1 && h <= 24);
}

/*******************************************************************************
 * 유효한(존재하는) 분(分)인지 체크
 * @param mi
 * @returns {Boolean}
 *******************************************************************************/
function isValidMin(mi) {
    var m = parseInt(mi,10);
    return (m >= 1 && m <= 60);
}

/*******************************************************************************
 * Time 형식인지 체크(느슨한 체크)
 * @param time
 * @returns {Boolean}
 *******************************************************************************/
function isValidTimeFormat(time) {
    return (!isNaN(time) && time.length == 12);
}

/*******************************************************************************
 * 유효하는(존재하는) Time 인지 체크
 * ex) var time = form.time.value; //'200102310000'
 *     if (!isValidTime(time)) {
 *         alert("올바른 날짜가 아닙니다.");
 *     }
 * @param time
 * @returns {Boolean}
 *******************************************************************************/
function isValidTime(time) {
    var year  = time.substring(0,4);
    var month = time.substring(4,6);
    var day   = time.substring(6,8);
    var hour  = time.substring(8,10);
    var min   = time.substring(10,12);

    if (parseInt(year,10) >= 1900  && isValidMonth(month) &&
        isValidDay(year,month,day) && isValidHour(hour)   &&
        isValidMin(min)) {
        return true;
    }
    return false;
}


/*******************************************************************************
 * 유효한(존재하는) 월(月)인지 체크
 * @param mm
 * @returns {Boolean}
 *******************************************************************************/
function isValidMonth(mm) {
    var m = parseInt(mm,10);
    return (m >= 1 && m <= 12);
}

/*******************************************************************************
 * 선택된 체크박스가 있는지 체크
 * @param input
 * @returns
 *******************************************************************************/
function hasCheckedBox(input) {
	if(input.checked){
		return true;
	}
	 return false;
}

/*******************************************************************************
 * 선택된 라디오버튼이 있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function hasCheckedRadio(input) {
	//input = typeof input =="string"?input:input.value;
    if (input.length > 1) {
        for (var inx = 0; inx < input.length; inx++) {
            if (input[inx].checked) return true;
        }
    } else {
        if (input.checked) return true;
    }
    return false;
}

/*******************************************************************************
 * 선택된 체크박스가  몇개인지  그 개수를 반환
 * @param input
 * @returns {Number}
 *******************************************************************************/
function hasMultiCheckedRadio(input) {
var kkkk = 0;
    if (input.length > 1) {
        for (var inx = 0; inx < input.length; inx++) {
            if (input[inx].checked) {
			kkkk++;
			}
        }
    } else {
		 if (input.checked) kkkk=1;
	}
    return kkkk;
}

/*******************************************************************************
 * Time 스트링을 자바스크립트 Date 객체로 변환
 * parameter time: Time 형식의 String
 * @param time
 * @returns {Date}
 *******************************************************************************/
function toTimeObject(time) { //parseTime(time)
    var year  = time.substr(0,4);
    var month = time.substr(4,2) - 1; // 1월=0,12월=11
    var day   = time.substr(6,2);
    var hour  = time.substr(8,2);
    var min   = time.substr(10,2);

    return new Date(year,month,day,hour,min);
}

/*******************************************************************************
 * 자바스크립트 Date 객체를 Time 스트링으로 변환
 * parameter date: JavaScript Date Object
 * @param date
 * @returns {String}
 *******************************************************************************/
function toTimeString(date) { //formatTime(date)
    var year  = date.getFullYear();
    var month = date.getMonth() + 1; // 1월=0,12월=11이므로 1 더함
    var day   = date.getDate();
    var hour  = date.getHours();
    var min   = date.getMinutes();

    if (("" + month).length == 1) { month = "0" + month; }
    if (("" + day).length   == 1) { day   = "0" + day;   }
    if (("" + hour).length  == 1) { hour  = "0" + hour;  }
    if (("" + min).length   == 1) { min   = "0" + min;   }

    return ("" + year + month + day + hour + min);
}

/*******************************************************************************
 * 입력받은 값이 지정된 콥보박스에 있는지 검사
 * @param targt
 * @param optValue
 * @returns {Boolean}
 *******************************************************************************/
function isExistsComboBoxValue(targt, optValue)
{
    last = targt.length;
    for(var i=0; i<last; i++){
        if(targt.options[i].value == optValue){
            return true;
        }
    }
    return false;
}
/*******************************************************************************
 * 입력값에 특정 문자(chars)가 있는지 체크
 * 특정 문자를 허용하지 않으려 할 때 사용
 * ex) if (containsChars(form.name,"!,*&^%$#@~;")) {
 *         alert("이름 필드에는 특수 문자를 사용할 수 없습니다.");
 *     }
 * @param input
 * @param chars
 * @returns {Boolean}
 *******************************************************************************/
function containsChars(input,chars) {
    for (var inx = 0; inx < input.value.length; inx++) {
       if (chars.indexOf(input.value.charAt(inx)) != -1)
           return true;
    }
    return false;
}

/*******************************************************************************
 *  입력값이 특정 문자(chars)만으로 되어있는지 체크
 * 특정 문자만 허용하려 할 때 사용
 * ex) if (!containsCharsOnly(form.blood,"ABO")) {
 *         alert("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
 *     }
 * @param input
 * @param chars
 * @returns {Boolean}
 *******************************************************************************/
function containsCharsOnly(input,chars) {
    for (var inx = 0; inx < input.value.length; inx++) {
       if (chars.indexOf(input.value.charAt(inx)) == -1)
           return false;
    }
    return true;
}

/*******************************************************************************
 * 입력값이 알파벳인지 체크
 * 아래 isAlphabet() 부터 isNumComma()까지의 메소드가
 * 자주 쓰이는 경우에는 var chars 변수를
 * global 변수로 선언하고 사용하도록 한다.
 * ex) var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 *     var lowercase = "abcdefghijklmnopqrstuvwxyz";
 *     var number    = "0123456789";
 *     function isAlphaNum(input) {
 *         var chars = uppercase + lowercase + number;
 *         return containsCharsOnly(input,chars);
 *     }
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isAlphabet(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 알파벳 대문자인지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isUpperCase(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 알파벳 소문자인지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isLowerCase(input) {
    var chars = "abcdefghijklmnopqrstuvwxyz ";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값에 숫자만 있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isNumber(input) {
    var chars = "0123456789";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 알파벳,숫자로 되어있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isAlphaNum(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 알파벳대문자,숫자로 되어있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isBigAlphaNum(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 숫자,대시(-)로 되어있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isNumDash(input) {
    var chars = "-0123456789";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값에 스페이스 이외의 의미있는 값이 있는지 체크
 * ex) if (isEmpty(form.keyword)) {
 *         alert("검색조건을 입력하세요.");
 *     }
 * @param input
 * @returns {Boolean} 
 *******************************************************************************/
function isEmpty(input) {
    //if (input.value == null || input.value.replace(/ /gi,"") == "") {
	input+="";
	if (input == null || input.replace(/ /gi,"") == "") {
        return true;
    }
    return false;
}

/*******************************************************************************
 * 한글검증
 * @param str
 * @returns {Boolean}
 *******************************************************************************/
function isHangul(str){
    if(isEmpty(str)) return false;
    for(var idx=0;idx < str.length;idx++){
      var c = escape(str.charAt(idx));
      if ( c.indexOf("%u") == -1 ) {
            return false;
        }
    }
    return true;
}

/*******************************************************************************
 * 입력값이 NULL인지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isNull(input) {
    if (input.value == null || input.value == "") {
        return true;
    }
    return false;
}

/*******************************************************************************
 * 입력값이 숫자,콤마(,)로 되어있는지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/
function isNumComma(input) {
    var chars = ",0123456789";
    return containsCharsOnly(input,chars);
}

/*******************************************************************************
 * 입력값이 사용자가 정의한 포맷 형식인지 체크
 * 자세한 format 형식은 자바스크립트의 'regular expression'을 참조
 * @param input
 * @param format
 * @returns {Boolean}
 *******************************************************************************/
function isValidFormat(input,format) { 
	if (input.search(format) != -1) {
        return true; //올바른 포맷 형식
    }
    return false;
}


/*******************************************************************************
 * 입력값이 전화번호 형식(숫자-숫자-숫자)인지 체크
 * @param input
 * @returns {Boolean}
 *******************************************************************************/

function isValidPhone(input) {
    var format =/^(\d+)-(\d+)-(\d+)$/;
    input = input.value;
    return isValidFormat(input,format);
}

/*******************************************************************************
 * 시작문자가 입력값인지 체크
 * @param input
 * @param chars
 * @returns {Boolean}
 *******************************************************************************/
function isStartWith(input,chars) {
    for (var inx = 0; inx < chars.length; inx++) {
       if (chars.indexOf(input.value.charAt(0)) == -1)
           return false;
    }
    return true;
}


/*******************************************************************************
 * 대문자변환
 * @param str
 * @returns {String}
 *******************************************************************************/
function toUpperCase(str){
    if(isEmpty(str)) return str;
    str+="";//null 방지를 위하여 추가 국민수 
    return str.toUpperCase();
}

/*******************************************************************************
 * 지정한 이름을 가진 모든 checkbox를 check 한다.
 * @param aElem
 *******************************************************************************/
function checkAll( aElem ) {

    var elem = document.getElementsByName(aElem);
    var cnt = 0;

    for ( var i=0; i<elem.length; i++ ) {
        if ( ( elem[i].type == "checkbox" ) && ( elem[i].name == aElem ) )	elem[i].checked = "checked";
    }
}

/*******************************************************************************
 * 지정한 이름을 가진 모든 checkbox의 checked 값을 반전 한다.
 * @param aElem
 *******************************************************************************/
function invertCheck( aElem ) {

    var elem = document.getElementsByName(aElem);
    var cnt = 0;

    for ( var i=0; i<elem.length; i++ ) {
        if ( ( elem[i].type == "checkbox" ) && ( elem[i].name == aElem ) )	{
            if ( elem[i].checked ) {
                elem[i].checked = "";
            } else {
                elem[i].checked = "checked";
            }
        }
    }
}

/*******************************************************************************
 * 입력받은 값을 지정된 콤보박스에서 선택
 * @param targt
 * @param optValue
 *******************************************************************************/
function selectComboBox(targt, optValue)
{
    last = targt.length;
    for(var i=0; i<last; i++){
        if(targt.options[i].value == optValue){
            targt.selectedIndex = i;
            targt.options[i].selected;
        }
    }
}

/*******************************************************************************
 * selectbox의 option 값을 선택
 * @param input
 * @param str
 *******************************************************************************/
function setSelect(input,str) {
	for(i=0;i<input.options.length;i++){
		if(input.options[i].value == str)
			input.options[i].selected=true;
	}
}

/*******************************************************************************
 * 오늘날짜
 * @returns {String}
 *******************************************************************************/
function getToDay() {

    var date = datToday;

    var year  = date.getFullYear();
    var month = date.getMonth() + 1; // 1월=0,12월=11이므로 1 더함
    var day   = date.getDate();

    if (("" + month).length == 1) { month = "0" + month; }
    if (("" + day).length   == 1) { day   = "0" + day;   }

    return ("" + year + month + day)

}

/*******************************************************************************
 * 날짜에 일정 숫자만큼을 증가/ 감소 시킴
 * function_AddDate(기준날짜 객체명, 결과값을 저장할 객체명, 증가치, 날짜구분);
 * 	 증가치 > 일정일을 감소증가시킬때는 ''를 붙이지 않고 숫자를 넣는다.
 *	 증가일때는 '-'부호 없이 숫자를
 *	 감소일때는 '-'부호를 붙인 숫자를 세팅한다.
 *	 몇 개월단위 증가 일때는 몇 개월후는 'A'를 붙이고 증가시킬 달 수를 입력한다.
 * 	 감소일때는 'B'를 붙이고 감소시킬 달 수를 입력한다.
 * 예제) 일수 증가 function_AddDate(document.frm.maintext, document.frm.subtext, 15, '.')
 * 		 일수 감소 function_AddDate(document.frm.maintext, document.frm.subtext, -15, '.')
 * 		 달   증가 function_AddDate(document.frm.maintext, document.frm.subtext, 'A3', '.')
 * 		 달   감소 function_AddDate(document.frm.maintext, document.frm.subtext, 'B3', '.')
 * @param txtMainDate
 * @param txtSubDate
 * @param AddDays
 * @param gv_Data_Gubn
 *******************************************************************************/
function function_AddDate(txtMainDate, txtSubDate, AddDays, gv_Data_Gubn) {
	
	var     aDate = txtMainDate.value;
	aDate = aDate.replace(/-/gi,"");
	aDate = aDate.replace(/\./gi,"");
	var 	yy 	= aDate.substring(0,4);
	var 	mm 	= parseInt(aDate.substring(4,6),10) - 1;
	var 	dd 	= aDate.substring(6,8);
	var 	TDate 	= new Date(yy,mm,dd);
	var     strDate = AddDays.toString();

	TDay 		= new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
	TMonth 		= new Array('01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12');
	MonthDays 	= new Array('31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31');

	var	loopFlag= 0;
	/*
	 * OK 태그가 TO_BE에서는 없어짐
	if ( typeof(isClick) != "undefined" ) {
		if ( isClick ) {
			//alert("기간설정버튼을 여러번 클릭할 수 없습니다. \n\n조회 버튼을 다시 클릭해 주십시오");
			transferLink = '<a href="javascript:doSubmit();" id="_NOB_SUBMITFLAG_"><img src="/img/common/btnS_inquiry.gif" align="absmiddle"></a>';
			document.getElementById("OK").innerHTML = transferLink;
			return;
		}
	}
	*/
	//기준날짜가 없을 경우에는 리턴
	if( aDate == null || aDate.length == 0) return "";

	CurYear = TDate.getYear();

	if (CurYear < 2000)             // Y2K Fix
		CurYear = CurYear + 1900;
	CurMonth = TDate.getMonth(); 	// 월
	CurDayOw = TDate.getDay(); 		// 요일
	CurDay 	 = TDate.getDate();  	// 일
	month 	 = TMonth[CurMonth];

	if (month == '02')  {
		if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
			MonthDays[1] = 29;
		}
		else {	MonthDays[1] = 28;
   		}
	}

	days 	= MonthDays[CurMonth];

	tCurDay = parseInt(CurDay);

	var icount = parseInt(strDate.substring(1));
	var intAddDays = 0;
	var i = 0;


    // 해당 달에 해당하는 총일수를 구하고 증가와 감소할 값을 세팅
	if (strDate.charAt(0) == "A") {
		var mainDate = new Date();
		var returndate;
		
		
		//mainDate.setYear(txtMainDate.value.substring(0,4));
		//mainDate.setMonth(txtMainDate.value.substring(4,6)-1);
		//mainDate.setDate(txtMainDate.value.substring(6));
		
		mainDate.setYear(aDate.substring(0,4));
		mainDate.setMonth(aDate.substring(4,6)-1);
		mainDate.setDate(aDate.substring(6));
		
		
		var term = AddDays.substring(1);
		
		//var yyyymm = plusMonth((mainDate.getYear()+lpad((mainDate.getMonth()+1), 2, '0')), term);
		var yyyymm = plusMonth((aDate.substring(0,4)+lpad((aDate.substring(4,6)+1), 2, '0')), term);
		
		if (!isValidDay(yyyymm.substring(0,4), yyyymm.substring(4), lpad(mainDate.getDate(), 2, '0'))) {
			returndate = yyyymm + lpad(getEndDate(yyyymm), 2, '0');
		}
		else{
			returndate = yyyymm + lpad(mainDate.getDate(), 2, '0');
		}
		
		var yyyymmdd = returndate;
		returndate = returndate.substring(0,4) + gv_Data_Gubn + returndate.substring(4,6) + gv_Data_Gubn + returndate.substring(6,8);
		
		if(typeof calSetVal != 'undefined'){
			var id = $(txtSubDate).attr('id');
			if(id){ calSetVal( id,  yyyymmdd ); }
		}else{
			txtSubDate.value = returndate;
		}
		
		
		/**************************************************************************
		* 노블을 위해서 추가된 것임 !!
		* 2004.03.24 
		* Kim Young Il
		**************************************************************************/
		if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
			document.getElementById("_NOB_SUBMITFLAG_").click();
		}
			
		return;

	} else if (strDate.charAt(0) == "B") {
		var mainDate = new Date();
		var returndate;
		
		//mainDate.setYear(txtMainDate.value.substring(0,4));
		//mainDate.setMonth(txtMainDate.value.substring(4,6)-1);
		//mainDate.setDate(txtMainDate.value.substring(6));
		
		mainDate.setYear(aDate.substring(0,4));
		mainDate.setMonth(aDate.substring(4,6)-1);
		mainDate.setDate(aDate.substring(6));
		
		var term = AddDays.substring(1);
		
		//var yyyymm = minusMonth((mainDate.getYear()+lpad((mainDate.getMonth()+1), 2, '0')), term);
		var yyyymm = minusMonth((aDate.substring(0,4)+lpad((aDate.substring(4,6)+1), 2, '0')), term);
		
		if (!isValidDay(yyyymm.substring(0,4), yyyymm.substring(4), lpad(mainDate.getDate(), 2, '0'))) {
			returndate = yyyymm + lpad(getEndDate(yyyymm), 2, '0');
		}
		else{
			returndate = yyyymm + lpad(mainDate.getDate(), 2, '0');
		}
		
		var yyyymmdd = returndate;
		returndate = returndate.substring(0,4) + gv_Data_Gubn + returndate.substring(4,6) + gv_Data_Gubn + returndate.substring(6,8);
		
		
		if(typeof calSetVal != 'undefined'){
			var id = $(txtSubDate).attr('id');
			if(id){ calSetVal( id,  yyyymmdd ); }
		}else{
			txtSubDate.value = returndate;
		}
		
		/****************************************************************************
		* 노블을 위해서 추가된 것임 !!
		* 2004.03.24 
		* Kim Young Il
		****************************************************************************/
		if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
			document.getElementById("_NOB_SUBMITFLAG_").click();
		}
			
		return;
	}

	CurDay 	= parseInt(CurDay) + parseInt(AddDays);

	if (AddDays >= 0 ){  // 0이상이면 날짜를 증가
		//날짜증가
		while (CurDay > days) {
			if (CurDay > days) {
				if (CurMonth == 11) {
					CurMonth 	= 0;
					month 		= TMonth[CurMonth];
					CurYear 	= CurYear + 1 ;
					//윤년 검사
					if (month == '02')  {
						if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
							MonthDays[1] = 29;
						}
						else {
							MonthDays[1] = 28;
						}
					}
				}
				else {
					month 		= TMonth[CurMonth+1];
					CurMonth 	= CurMonth+1;

					if (month == '02')  {
						if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
							MonthDays[1] = 29;
						}
						else {
							MonthDays[1] = 28;
						}
					}
				}
				CurDay 	= CurDay - days;
				days 	= MonthDays[CurMonth];
			}
		}
	} else {		// 0미만이면 날짜를 감소시킨다.
		//날자감소
		while (CurDay < 0 ) {
			if (CurMonth == 0) {
				CurMonth 	= 11;
				CurYear 	= CurYear - 1;
				month 		= TMonth[CurMonth];
				//윤년 검사
				if (month == '02' && loopFlag==0)  {
					if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
						MonthDays[1] = 29;
					}
					else {
						MonthDays[1] = 28;
					}
					loopFlag=1;
				}
			} else {
				CurMonth 	= CurMonth-1;
				month 		= TMonth[CurMonth];

				//윤년 검사
				if (month == '02' && loopFlag==0)  {
					if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
						MonthDays[1] = 29;
					}
					else {
						MonthDays[1] = 28;
					}
					loopFlag=1;
				}
			}

			month 	= TMonth[CurMonth];
			days 	= MonthDays[CurMonth];
			CurDay 	= parseInt(CurDay) + parseInt(days);
		}
	}

	// 월말일 경우
	//if (parseInt(CurDay) == 0) {
	if (parseInt(CurDay) == 0 || parseInt(CurDay) < 0) {
		if (month == '01') {
			month = 12;
			CurYear --;
		} else {month --;}

		CurDay = MonthDays[month-1];
		//윤년 검사
		if (month == '2')  {
			if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
				CurDay = 29;
			}else {	CurDay = 28;	}
		}
		if(parseInt(month) < 10) month = "0" + parseInt(month);
	}

	if (parseInt(CurDay) <10)
		CurDay = "0" + parseInt(CurDay);

	if (CurYear<100) CurYear="19" + CurYear;

	TheDate = CurYear+gv_Data_Gubn+month+gv_Data_Gubn+CurDay;

	var stValue = strDate.substring(1);
/*
	if (strDate.charAt(0) == "A") {
		var tempDate = jsAddDate(aDate, 'Month', stValue);
		TheDate = tempDate.substring(0,4) + gv_Data_Gubn + tempDate.substring(4,6) + gv_Data_Gubn + tempDate.substring(6);
	} else if (strDate.charAt(0) == "B") {
		//var tempDate = jsAddDate(aDate, 'Month', eval(-stValue));
		var tempDate = jsAddDate(aDate, 'Month', -stValue);
		TheDate = tempDate.substring(0,4) + gv_Data_Gubn + tempDate.substring(4,6) + gv_Data_Gubn + tempDate.substring(6);
	}
*/
	//txtSubDate.value = TheDate;
    if(typeof calSetVal != 'undefined'){
	   var id = $(txtSubDate).attr('id');
	   if(id){ calSetVal( id,  CurYear+''+month+''+CurDay ); }
	}else{
		txtSubDate.value = TheDate;
	}
	
	/*****************************************************************************
	* 노블을 위해서 추가된 것임 !!
	* 2004.03.24 
	* Kim Young Il
	*****************************************************************************/
	if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
		document.getElementById("_NOB_SUBMITFLAG_").click();
	}
}

/*******************************************************************************
 * 현재 또는 입력받은 날짜에 년월일을 더해서 문자열로 돌려줌
 * @param yy
 * @param mm
 * @param dd
 * @returns {String}
 *******************************************************************************/
function getBoundDate(yy, mm, dd) {
    yy = Number(yy);
    mm = Number(mm);
    dd = Number(dd);

    var date = new Date();
    
    var DAY = 24 * 60 * 60 * 1000;
    if ( yy != 0 ){
        date.setTime(date.getTime() + DAY * 365 * yy);
    }
    if ( mm != 0 ){
        date.setTime(date.getTime() + DAY * 30 * mm);
    }
    if ( dd != 0 ){
        date.setTime(date.getTime() + DAY * dd);
    }
    return lpad(new String(date.getFullYear()),4,'0') + lpad(new String(date.getMonth() + 1),2,'0') + lpad(new String(date.getDate()),2,'0');
}

/*******************************************************************************
 * 현재 시각을 Time 형식으로 리턴
 * @returns {String}
 *******************************************************************************/
function getCurrentTime() {
    return toTimeString(new Date());
}


/*******************************************************************************
 * 두 Time이 며칠 차이나는지 구함
 * time1이 time2보다 크면(미래면) minus(-)
 * @param time1
 * @param time2
 * @returns {Int}
 *******************************************************************************/
function getDayInterval(time1,time2) {
    var date1 = toTimeObject(time1);
    var date2 = toTimeObject(time2);
    var day   = 1000 * 3600 * 24; //24시간

    return parseInt((date2 - date1) / day, 10);
}

/*******************************************************************************
 * 두 Time이 몇 시간 차이나는지 구함
 * time1이 time2보다 크면(미래면) minus(-)
 * @param time1
 * @param time2
 * @returns {Int}
 *******************************************************************************/
function getHourInterval(time1,time2) {
    var date1 = toTimeObject(time1);
    var date2 = toTimeObject(time2);
    var hour  = 1000 * 3600; //1시간

    return parseInt((date2 - date1) / hour, 10);
}


/*******************************************************************************
 * 두 Time이 몇 개월 차이나는지 구함
 * time1이 time2보다 크면(미래면) minus(-)
 * @param time1
 * @param time2
 * @returns
 *******************************************************************************/
function getMonthInterval(time1, time2) { //measureMonthInterval(time1,time2)
    var date1 = toTimeObject(time1);
    var date2 = toTimeObject(time2);

    var years  = date2.getFullYear() - date1.getFullYear();
    var months = date2.getMonth() - date1.getMonth();
    var days   = date2.getDate() - date1.getDate();

    return (years * 12 + months + (days >= 0 ? 0 : -1) );
}


/*******************************************************************************
 * 현재 시각과 y년 m월 d일 h시 차이나는 Time을 리턴
 * @param y
 * @param m
 * @param d
 * @param h
 * @returns
 *******************************************************************************/

function getRelativeTime(y,m,d,h) {

    return shiftTime(getCurrentTime(),y,m,d,h);
}

/*******************************************************************************
 * 현재 年을 YYYY형식으로 리턴
 * @returns {String}
 *******************************************************************************/
function getYear() {

    return getCurrentTime().substr(0,4);
}

/*******************************************************************************
 * 현재 月을 MM형식으로 리턴
 * @returns {String}
 *******************************************************************************/
function getMonth() {

    return getCurrentTime().substr(4,2);
}

/*******************************************************************************
 * 현재 日을 DD형식으로 리턴
 * @returns {String}
 *******************************************************************************/
function getDay() {

    return getCurrentTime().substr(6,2);
}

/*******************************************************************************
 * 현재 時를 HH형식으로 리턴
 * @returns {String}
 *******************************************************************************/
function getHour() {

    return getCurrentTime().substr(8,2);
}


/*******************************************************************************
 * 특정날짜의 요일을 구한다.
 * @param time
 * @returns
 *******************************************************************************/

function getDayOfWeek(time) {
    var now = toTimeObject(time);

    var day = now.getDay(); //일요일=0,월요일=1,...,토요일=6
    var week = new Array('일','월','화','수','목','금','토');

    return week[day];
}


/*******************************************************************************
 * YYYYMM 형태의 값에 지정되니 숫자만큼 달을 빼준다
 * @param yyyymm
 * @param term
 * @returns {String}
 *******************************************************************************/
function minusMonth(yyyymm, term) {
	var yyyy 	= yyyymm.substring(0,4);
	var mm		= yyyymm.substring(4,6);
	
	for(i=0; i<term; i++) {
		--mm;
		if (mm < 1) {
			mm = 12;
			--yyyy;
		}	
	}
	
	return lpad(yyyy, 4, '0') + lpad(mm, 2, '0');
	
}

/*******************************************************************************
 * YYYYMM 형태의 값에 지정되니 숫자만큼 달을 더해준다
 * @param yyyymm
 * @param term
 * @returns {String}
 *******************************************************************************/
function plusMonth(yyyymm, term) {
	var yyyy 	= yyyymm.substring(0,4);
	var mm		= yyyymm.substring(4,6);
	
	for(i=0; i<term; i++) {
		++mm;
		if (mm > 12) {
			mm = 1;
			++yyyy;
		}	
	}
	
	return lpad(yyyy, 4, '0') + lpad(mm, 2, '0');
	
}

/*******************************************************************************
 * 주어진 Time 과 y년 m월 d일 h시 차이나는 Time을 리턴
 * ex) var time = form.time.value; //'2000 01 01 000'
 *     alert(shiftTime(time,0,0,-100,0));
 *     => 2000/01/01 00:00 으로부터 100일 전 Time
 * @param time
 * @param y
 * @param m
 * @param d
 * @param h
 * @returns
 *******************************************************************************/

function shiftTime(time,y,m,d,h) { //moveTime(time,y,m,d,h)
    var date = toTimeObject(time);
    y=parseInt(y);
    m=parseInt(m);
    d=parseInt(d);
    h=parseInt(h);
    date.setFullYear(date.getFullYear() + y); //y년을 더함
    date.setMonth(date.getMonth() + m);       //m월을 더함
    date.setDate(date.getDate() + d);         //d일을 더함
    date.setHours(date.getHours() + h);       //h시를 더함

    return toTimeString(date);
}

/*******************************************************************************/
/*******************************************************************************
 * Cookie 구하기
 * @param uName
 * @returns {String}
 *******************************************************************************/
function getCookie(uName) {

	var flag = document.cookie.indexOf(uName+'=');
	if (flag != -1) {
		flag += uName.length + 1;
		end = document.cookie.indexOf(';', flag);

		if (end == -1) end = document.cookie.length;
		return unescape(document.cookie.substring(flag, end));
	}
}


/*******************************************************************************
 * Cookie설정하기
 * @param name
 * @param value
 * @param expire
 *******************************************************************************/
function setCookie(name, value, expire) {
          document.cookie = name + "=" + escape(value) + ( (expire) ? "; expires=" + expire.toGMTString() : "");
}

/*******************************************************************************
 * Cookie설정하기-wooribank.com 전체
 * @param name
 * @param value
 * @param expire
 *******************************************************************************/
function setCookieforAll(name, value, expire) {
          document.cookie = name + "=" + escape(value) + "; domain=.wooribank.com; path=/; expires=" + expire.toGMTString() +";";
}

/*******************************************************************************
 * 캐릭터 타입 검증 'H'-한글, 'E'-영문, 'N'-숫자, 'Z'-기타
 * @param pValue
 * @returns {String}
 *******************************************************************************/
function getCharType(pValue){
	var bHan = false;
	var bAlp = false;
	var bNum = false;
	var bEtc = false;

	var retStr="";

	if(isEmpty(pValue)){
		return "";
	}

	for(var idx=0; idx < pValue.length; idx++){
		if (isAlpha(pValue[idx])) {
			bAlp = true;
		}
		else if (isNum(pValue[idx])) {
			bNum = true;
		}
		else if (isHangul(pValue[idx])) {
			bHan = true;
		}
		else {
			bEtc = true;
		}

		if (bHan) retStr = retStr + "H";
		if (bAlp) retStr = retStr + "E";
		if (bNum) retStr = retStr + "N";
		if (bEtc) retStr = retStr + "Z";
	}

	return retStr;
}


/*******************************************************************************
 * 월의 끝 일자 얻기
 * @param datestr
 * @returns {String}
 *******************************************************************************/
function getEndDate(datestr){

    //널인지?
    if(isEmpty(datestr)){
        return null;
    }

    //숫자인지?
    if(!isNum(datestr)){
        return null;
    }

    //길이가 8자리?
    if(datestr.length != 6){
        return null;
    }

    var yy = Number(datestr.substring(0,4));
    var mm = Number(datestr.substring(4,6));

    //윤년 검증
    var boundDay = "";

    if(mm != 2){
        var mon=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        boundDay = mon[mm-1];
    }
    else{
        if (yy%4 == 0 && yy%100 != 0 || yy%400 == 0){
            boundDay = 29;
        }
        else{
            boundDay = 28;
        }
    }

    return boundDay;
}


/*******************************************************************************
 * 문자열의 오른쪽 끝에서 부터 지정된 개수만큼의 문자들을 리턴한다.
 * @param str
 * @param num
 * @returns {String}
 *******************************************************************************/
function substrInverse(str, num)
{
	var len;

	len = str.length;

	return str.substr(len - num, num);
}

/*******************************************************************************
 * 문자열로의 특정위치로부터 지정된 개수의 문자들을 리턴한다.
 * @param str
 * @param idx
 * @param num
 * @returns {String}
 *******************************************************************************/
function substrMid(str, idx, num)
{
	return str.substr( idx-1, num);
}


/*******************************************************************************
 * Left 빈자리 만큼 padStr 을 붙인다.
 * @param src
 * @param len
 * @param padStr
 * @returns {String}
 *******************************************************************************/
function lpad(src, len, padStr){
    var retStr = "";
    var padCnt = Number(len) - String(src).length;
    for(var i=0;i<padCnt;i++) retStr += String(padStr);
    return retStr+src;
}


/*******************************************************************************
 * 입력값에서 콤마를 없앤다.(object)
 * @param input
 * @returns {String}
 *******************************************************************************/
function removeComma(input) {
    return input.value.replace(/,/g,"");
}

/*******************************************************************************
 * 입력값에서 콤마를 없앤다.(String)
 * @param input
 * @returns {String}
 *******************************************************************************/
function removeCommaString(input) {
    return input.replace(/,/g,"");
}


/*******************************************************************************
 * Right 빈자리 만큼 padStr 을 붙인다.
 * @param src
 * @param len
 * @param padStr
 * @returns {String}
 *******************************************************************************/
function rpad(src, len, padStr){
    var retStr = "";
    var padCnt = Number(len) - String(src).length;
    for(var i=0;i<padCnt;i++) retStr += String(padStr);
    return src+retStr;
}

/*******************************************************************************
 * 입력받은 문자열에서 dot(.)를  Dath(-)로 변경 후 리턴
 * @param input
 *******************************************************************************/
function chFrmDateDash(input){

	//input.value =input.value.replace(/-/g,"");
	input.value = replace(input.value,".","-");
}

/*******************************************************************************
 * 외환에서 특정 통화일때 소수점이하 금액없애기
 * @param str1
 * @param str2
 *******************************************************************************/
/*
function Curr(str1, str2){
	obj1 = eval("frm."+str1+".value");
	obj2 = eval("frm."+str2+".style");
	if(obj1=="JPY"||obj1=="ITL"||obj1=="BEF"||obj1=="KRW"){
		obj2.display = "none";
	}else{
		obj2.display = "";
	}
}
*/
/*******************************************************************************
 * 12345678901234 형태의 문자열을 입력받아 123-456789-01234 형태로 리턴
 * @param input
 *******************************************************************************/
function frmAcct(input){
	input.value = input.value.substring(0,3) + "-" + input.value.substring(3,9) + "-" + input.value.substring(9,14);
}

/*******************************************************************************
 * YYYYMMDD 형태의 문자열을 입력받아 YYYY-MM-DD 형태로 리턴
 * @param input
 *******************************************************************************/
function frmDate(input){
	if(input.value=="") return
	input.value = input.value.substring(0,4) + "-" + input.value.substring(4,6) + "-" + input.value.substring(6,8);
}

/*******************************************************************************
 * YYYYMMDD 형태의 문자열을 입력받아 YYYY-MM-DD 형태로 리턴
 * @param input
 *******************************************************************************/
function frmDateDot(input){
	if(input.value=="") return
	input.value = input.value.substring(0,4) + "." + input.value.substring(4,6) + "." + input.value.substring(6,8);
}

/*******************************************************************************
 * 숫자를 입력받아 3자리마다 콤마를 삽입하여 금액 형태 포멧으로 리턴
 * @param input
 *******************************************************************************/
function frmMoney(input){
	input.value = putComma(input.value);
}

/*******************************************************************************
 * 콤마가 있는 금액 형태의 문자열을 입력받아 콤마 제거후 숫자만 리턴
 * @param input
 *******************************************************************************/
function unFrmMoney(input){
	input.value = input.value.replace(/,/g,"");
}

/*******************************************************************************
 * YYYY-MM-DD 형태의 문자열을 입력받아 YYYYMMDD 형태로 리턴
 * @param input
 *******************************************************************************/
function unFrmDate(input){
	input.value = input.value.replace(/-/g,"");
}

/*******************************************************************************
 * YYYY.MM.DD 형태의 문자열을 입력받아 YYYYMMDD 형태로 리턴
 * @param input
 *******************************************************************************/
function unFrmDateDot(input){
	input.value = input.value.replace(/\./g,"");
}

/*******************************************************************************
 * HHMMSS 형태의 문자열을 입력받아 HH:MM:SS 형태로 리턴
 * @param input
 *******************************************************************************/
function frmTime(input){
	input.value = input.value.substring(0,2) + ":" + input.value.substring(2,4) + ":" + input.value.substring(4,6);
}

/*******************************************************************************
 * HH:MM:SS 형태의 문자열을 입력받아 HHMMSS 형태로 리턴
 * @param input
 *******************************************************************************/
function unFrmTime(input){
	input.value = input.value.replace(/:/g,"");
}

/*******************************************************************************
 * 123-456789-01234형태의 문자열을 입력받아 12345678901234  형태로 리턴
 * @param input
 *******************************************************************************/
function unFrmAcct(input){
	input.value = input.value.replace(/-/g,"");
}

/*******************************************************************************
 * 사업자번호 유효성 검증 
 * @param strNumb
 * @returns {Boolean}
 * 주석처리 : wbCheck.js에 존재함
 *******************************************************************************/
/*
function isValidCustNo(strNumb)
{
	//널인지?
	strNumb = strNumb.value;
	if(wfcb_isEmpty(strNumb)){
		return null;
	}
	// 10자리 숫자인가?
	if((wfcb_getByteLength(strNumb) != 10) || (!isNum(strNumb)) ) {
		ERR_MSG = "사업자등록번호는 10자리 숫자입니다.";
		return false;
	}
	sumMod	=	0;
	sumMod	+=	Number(strNumb.substring(0,1));
	sumMod	+=	Number(strNumb.substring(1,2)) * 3 % 10;
	sumMod	+=	Number(strNumb.substring(2,3)) * 7 % 10;
	sumMod	+=	Number(strNumb.substring(3,4)) * 1 % 10;
	sumMod	+=	Number(strNumb.substring(4,5)) * 3 % 10;
	sumMod	+=	Number(strNumb.substring(5,6)) * 7 % 10;
	sumMod	+=	Number(strNumb.substring(6,7)) * 1 % 10;
	sumMod	+=	Number(strNumb.substring(7,8)) * 3 % 10;
	sumMod	+=	Math.floor(Number(strNumb.substring(8,9)) * 5 / 10);
	sumMod	+=	Number(strNumb.substring(8,9)) * 5 % 10;
	sumMod	+=	Number(strNumb.substring(9,10));
	if	(sumMod % 10	!=	0) {
		ERR_MSG = "올바르지 않은 사업자등록번호입니다.";
		return false;
	}
	return	true;
}
*/
/*******************************************************************************
 * Spec      : 금액을 한글로 표시한다.
 * @param  obj(입력받는 필드 Obj)
 * @param  type(화폐단위)
 * @Returns  {String}
 * 주석처리 : wbCommon.js에 있음
 *******************************************************************************/

hanNumber   = new Array ('영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구' );
fourFour    = new Array ('일', '만', '억', '조' );
fourDigit   = new Array ('일', '십', '백', '천' );


/*
//수정
//DIV 태그입력에서 input box로 수정
function jsPutHanAmt(obj, type) {
	
	num = obj.value;
	str = "";
	strr = num.split(",");
	for ( var i=0; i<strr.length; i++){
		str += strr[i];
	}
	num = str;
	
	// 한글금액 처리
	delimiter = ' ';
	var endValue = ' 원';
	var endZValue= ' 영';

	bPos = 0; // 만, 억, 조
	sPos = 0; // 십, 백, 천
	digit = 0;
	if (type==null){		// 원단위
		bPos = 0; // 만, 억, 조
		sPos = 0; // 십, 백, 천
		endValue = " 원";
		endZValue = "영 원";
	} else if (type=='1'){	//만단위
		bPos = 1; // 만, 억, 조
		sPos = 0; // 십, 백, 천
		endValue = " 원";
		endZValue = "영 만원";
	} else if (type=='2') {	//십만단위
		bPos = 1; // 만, 억, 조
		sPos = 1; // 십, 백, 천
		endValue = "만 원";
		endZValue = "영 십만원";
	} else if (type=='3') {	//백만단위
		bPos = 1; // 만, 억, 조
		sPos = 2; // 십, 백, 천
		endValue = "만 원";
		endZValue = "영 백만원";
	}	

	szDigit = '';
	is_start = false;
	appendFF = false;
	len = num.length;
	szHan = '';
	
	for (i=len-1 ;i>=0 ;i--) {
		szDigit = num.substring(i,i+1);
		digit = parseInt(szDigit);
		if (digit!=0) {
			if (bPos!=0 && sPos==0) {
				if (is_start==true) szHan += delimiter;
				szHan += fourFour[bPos]; // 만, 억
				appendFF=false;
			}
			if (bPos!=0 && appendFF==true) {
				if (is_start==true) szHan += delimiter;
				szHan += fourFour[bPos]; // 만, 억
				appendFF=false;
			}
			if (sPos!=0) szHan += fourDigit[sPos]; // 십, 백, 천
			szHan += hanNumber[digit]; // 일, 이, 삼
			is_start=true;

		}
		else if (sPos==0 && bPos!=0) appendFF = true;
		sPos++;
		if (sPos%4==0) {
			sPos=0;
			bPos++;
			if (bPos>=4) return "(범위초과)";
		}
	}

	if (is_start==false)
	{
		rslt = '';
        if( document.getElementById(obj.name+"_KorAmt") != null)
        	document.getElementById(obj.name+"_KorAmt").value = rslt + endZValue;

	}
	else
	{
		rslt = '';
		for(i = szHan.length - 1; i >= 0; i--) {
			rslt += szHan.substring(i, i + 1);
		}

		rslt = rslt + endValue;
		if (type=='2' || type=='3'){	//만단위
			rslt = rslt.replace("억만 원","억 원");
			rslt = rslt.replace("조만 원","조 원");
		}
		if( document.getElementById(obj.name+"_KorAmt") != null)
        	document.getElementById(obj.name+"_KorAmt").value = rslt;
	}
}
*/
/*******************************************************************************
 * 주민등록번호 유효성 검증
 * @param regno
 * @returns {Boolean}
 * 주석처리 : wbCheck.js에 존재함
 *******************************************************************************/
/*
function isValidRegNo(regno){
	//널인지?
	regno = regno.value;
	if(wfcb_isEmpty(regno)){
		return null;
	}
	// 13자리 숫자인가? -> 주민번호
	if((wfcb_getByteLength(regno) != 13) || (!isNum(regno)) ) {
		ERR_MSG = "주민등록번호는 13자리 숫자입니다.";
		return false;
	}
	//올바른 주민등록번호인지 검증
	var ju = regno.substring(0,6);
	var ju1 = regno.substring(6);
	juid = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0);
	for(var i = 0; i<6;i++)
		juid[i] = ju.substring(i,i+1);
	for(i=0;i<7;i++)
		juid[i+6] = ju1.substring(i,i+1);
	for(var sum = 0, i = 0;i<12;i++)
		sum += juid[i] * ((i >7) ? (i-6) : (i+2));
	var mod = 11 - sum%11;
	if(mod >= 10)
		mod -= 10;
	if(mod != juid[12]) {
		 ERR_MSG = "올바르지 않은 주민등록번호입니다.";
		 return false;
	}
	else {
		  return true;
	}
}
*/
/*******************************************************************************
*  문자열에서 좌우 공백제거
*  @param str
*  @returns {String}
*******************************************************************************/
function trim(str)
{
	return replace(str," ","");
}


/*******************************************************************************
 * 입력값의 바이트 길이를 리턴
 * ex) if (getByteLength(form.title.value) > 100) {
 *         alert("제목은 한글 50자(영문 100자) 이상 입력할 수 없습니다.");
 *     }
 * @param s
 * @returns {int}
 *******************************************************************************/
function getByteLength(s){

	   var len = 0;
	   if ( s == null ) return 0;
	   for(var i=0;i<s.length;i++){
	      var c = escape(s.charAt(i));
	      if ( c.length == 1 ) len ++;
	      else if ( c.indexOf("%u") != -1 ) len += 2;
	      else if ( c.indexOf("%") != -1 ) len += c.length/3;
	   }
	   return len;
	}

/*******************************************************************************
*	콤마설정.
* @param input
* @returns {String}
*******************************************************************************/
function putComma(input) {
	
	
	var num = trim(input.toString() );
	if (num < 0) {
		num *= -1;
		var minus = true
	}else{
		var minus = false
	}


	var dotPos = (num+"").split(".")
	var dotU = dotPos[0]
	var dotD = dotPos[1]
	var commaFlag = dotU.length%3
	if(commaFlag) {
		var out = dotU.substring(0, commaFlag)
		if (dotU.length > 3) out += ","
	}
	else var out = ""

	for (var i=commaFlag; i < dotU.length; i+=3) {
		out += dotU.substring(i, i+3)
		if( i < dotU.length-3) out += ","
	}

	if(minus) out = "-" + out
	if(dotD) return out + "." + dotD
	else return out
}

/*******************************************************************************
*	숫자검증
* @param str
* @returns {Boolean}
*******************************************************************************/
function isNum(str){

	if(wfcb_isEmpty(str)) return false;

	for(var idx=0;idx < str.length;idx++){
		if(str.charAt(idx) < '0' || str.charAt(idx) > '9'){
			return false;
		}
	}
	return true;
}

/*******************************************************************************
*	영문자검증
* @param str
* @returns {Boolean}
*******************************************************************************/
function isAlpha(str){

	if(wfcb_isEmpty(str)) return false;

	for(var idx=0;idx < str.length;idx++){
		if(!((str.charAt(idx) >='a' && str <= 'z') || (str.charAt(idx) >= 'A' && str <= 'Z'))){
			return false;
		}
	}
	return true;
}

/*******************************************************************************
*	빈값인지 리턴한다.
* @param pValue
* @returns {Boolean}
*******************************************************************************/
function wfcb_isEmpty(pValue){

	if( (pValue == "") || (pValue == null) ){
		return true;
	}
	return false;
}

/*******************************************************************************
*	실제길이 반환( 한글 2byte 계산 )
* @param s
* @returns {int}
*******************************************************************************/
function wfcb_getByteLength(s){

   var len = 0;
   if ( s == null ) return 0;
   for(var i=0;i<s.length;i++){
      var c = escape(s.charAt(i));
      if ( c.length == 1 ) len ++;
      else if ( c.indexOf("%u") != -1 ) len += 2;
      else if ( c.indexOf("%") != -1 ) len += c.length/3;
   }
   return len;
} 	

/*******************************************************************************
 * 비밀번호 검증
 * @param pwd
 * @returns {Boolean}
 *******************************************************************************/
function isValidPassword(pwd){
    var alpaBig= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var alpaSmall= "abcdefghijklmnopqrstuvwxyz";
    var num = "01234567890";
    //널인지?
    if(isEmpty(pwd)){
        return null;
    }
    // 비밀번호는 6자리이상 8자리 이하 .. maxLength=10로 변경 할것
    if(getByteLength(pwd)<6 || getByteLength(pwd) > 10 ){
        ERR_MSG = "비밀번호는 반드시 6자 이상 8자이내로 입력해야 합니다.";
        return false;
    }
    if(isNum(pwd)){
        ERR_MSG = "비밀번호는 반드시 알파벳을 하나 이상 포함해야 합니다.";
        return false;
    }
    for(var i=0;i < alpaBig.length - pwd.length+1;i++){
        if(alpaBig.substring(i,i+pwd.length) == pwd)
        {
            ERR_MSG = "ABCDEF처럼 연속된 문자는 사용할 수 가 없습니다.";
            return false;
        }
    }
    if (pwd.indexOf(' ') > -1) {
        ERR_MSG = "공백은 입력할 수 없습니다.";
        return false;
    }
    for(i=0;i < alpaSmall.length - pwd.length+1;i++){
        if(alpaSmall.substring(i,i+pwd.length) == pwd)
        {
            ERR_MSG = "abcdef처럼 연속된 문자는 사용할 수 가 없습니다.";
            return false;
        }
    }
    for(i=1;i < pwd.length;i++){
        if(pwd.substring(0,1) != pwd.substring(i,i+1) )
            return true;
    }
    ERR_MSG = "비밀번호는 같은 문자만 연속해서 입력할 수 없습니다";
    return false;
}

/*******************************************************************************
 * 전화번호 국번검증
 * @param dddphonenum
 * @returns {Boolean}
 *******************************************************************************/
function isValidDDDPhoneNum(dddphonenum)
{
    // 널인가?
    if (isEmpty(dddphonenum)) {
        return null;
    }


    if ( dddphonenum != "02" && dddphonenum != "031" && dddphonenum != "032" && dddphonenum != "033" && dddphonenum != "041" &&
         dddphonenum != "042" && dddphonenum != "043" && dddphonenum != "044" && dddphonenum != "051" && dddphonenum != "052" && dddphonenum != "053" &&
         dddphonenum != "054" && dddphonenum != "055" && dddphonenum != "061" && dddphonenum != "062" && dddphonenum != "063" &&
         dddphonenum != "064" && dddphonenum != "011" && dddphonenum != "016" && dddphonenum != "017" && dddphonenum != "018" && dddphonenum != "019" )
    {

        ERR_MSG = "잘못된 전화번호 국번입니다.";
        return false;
    }

    return true;

}


/*******************************************************************************
* 반각을 전각으로 변환
* @param HalfVal
* @returns {String}
*******************************************************************************/
function Half2Full(HalfVal) {
        var arg;
        arg = myHalf2Full(HalfVal);
    return arg;
}

/*******************************************************************************
* 반각을 전각으로 변환
* @param HalfVal
* @returns {String}
*******************************************************************************/
function myHalf2Full(HalfVal) {
    var FullChar = [
           "　", "！","＂","＃","＄","％","＆","＇","（",    	//33~
    "）","＊","＋","，","－","．","／","０","１","２",      //41~
    "３","４","５","６","７","８","９","：","；","＜",      //51~
    "＝","＞","？","＠","Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ",      //61~
    "Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ",      //71~
    "Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ",      //81~
    "［","￦","］","＾","＿","｀","Ａ","Ｂ","Ｃ","Ｄ",      //91~
    "Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ",      //101~
    "Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ",      //111~
    "Ｙ","Ｚ","｛","｜","｝","～"                        	//121~
    ];
var stFinal = "";
    var ascii;
    for( i = 0; i < HalfVal.length; i++) {
            ascii = HalfVal.charCodeAt(i);
            if( (31 < ascii && ascii < 128)) {
              stFinal += FullChar[ascii-32];
            } else {
              stFinal += HalfVal.charAt(i);
            }
    }
    return stFinal;
}

/*******************************************************************************
* 반각을 전각으로 변환
* @param HalfVal
* @returns {String}
*******************************************************************************/
function Half2Full2(HalfVal) {
    var FullChar = [
           "　", "！","＂","＃","＄","％","＆","＇","（",    	//33~
    "）","＊","＋","，","－","．","／","０","１","２",      //41~
    "３","４","５","６","７","８","９","：","；","＜",      //51~
    "＝","＞","？","＠","Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ",      //61~
    "Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ","Ｎ","Ｏ","Ｐ",      //71~
    "Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ",      //81~
    "［","￦","］","＾","＿","｀","ａ","ｂ","ｃ","ｄ",      //91~
    "ｅ","ｆ","ｇ","ｈ","ｉ","ｊ","ｋ","ｌ","ｍ","ｎ",      //101~
    "ｏ","ｐ","ｑ","ｒ","ｓ","ｔ","ｕ","ｖ","ｗ","ｘ",      //111~
    "ｙ","ｚ","｛","｜","｝","～"                        	//121~
    ];
    
    var stFinal = "";
    var ascii;
    for( i = 0; i < HalfVal.length; i++) {
            ascii = HalfVal.charCodeAt(i);
            if( (31 < ascii && ascii < 128)) {
              stFinal += FullChar[ascii-32];
            } else {
              stFinal += HalfVal.charAt(i);
            }
    }
    return stFinal;
}

/*-------------------------------------------------------------------------
	Spec      : Open Window의 스크린 중앙 위치 처리
	Parameter : url    -> 해당 페이지
Parameter : name   -> 해당 Window Name
Parameter : width  -> Window Width Size
Parameter : height -> Window Heigth Size
Parameter : scroll -> Window Scroll
Parameter : loc    -> Window Location(null이 아니면 Center)
Example   : a href="jsOpenWindow()";
-------------------------------------------------------------------------*/
function jsOpenWindow(url, name, width, height, scroll, loc){
	var top, left;
	if(scroll === null || scroll === '')	scroll='0';
	if(loc !== null) {
		top = screen.height/2 - height/2 - 50;
		left = screen.width/2 - width/2 ;
	} else {
		top = 10;
		left = 10;
	}
	
	
	var option = 'width='+width+',height='+height+',top='+top+',left='+left+',resizable=no,status=no,toolbar=no,menubar=no,scrollbars=' + scroll;
	var win = window.open(url, name, option);
	if(win) win.focus();
	return win;
}

/*-------------------------------------------------------------------------
Spec      : Open Window의 스크린 중앙 위치 처리
Parameter : url    -> 해당 페이지
Parameter : name   -> 해당 Window Name
Parameter : width  -> Window Width Size
Parameter : height -> Window Heigth Size
Parameter : scroll -> Window Scroll
Parameter : loc    -> Window Location(null이 아니면 Center)
Example   : a href="jsOpenWindow()";
-------------------------------------------------------------------------*/
function jsComOpenWindow(url, name){
	
	var width = "650";
	var height = "700";
	var scroll = "1";
	var loc = "1";
	var bstatus = "no";
	var bresize = "no";
	
	var top, left;
	if(scroll === null || scroll === '')	scroll='0';
	if(loc !== null) {
		top = screen.height/2 - height/2 - 50;
		left = screen.width/2 - width/2 ;
	} else {
		top = 10;
		left = 10;
	}
	
	if(bstatus === null || bstatus === '')	bstatus='no';
	
	if(bresize === null || bresize === '')	bresize='no';
	
	var option = 'width='+width+',height='+height+',top='+top+',left='+left+',resizable='+bresize+',status='+bstatus+',toolbar=no,menubar=no,scrollbars=' + scroll;
	var win = window.open(url, name, option);
	if(win) win.focus();
	return win;
}


/*******************************************************************************
* EMAIL 유효성 검증
* @param emai
* @returns {Boolean}
* 삭제처리 : wbCheck.js에 존재함
*******************************************************************************/


/*******************************************************************************
*  문자열에 있는 특정문자패턴을 다른 문자패턴으로 바꾸는 함수.
*  @param targetStr
*  @param searchStr
*  @param replaceStr
*  @returns {String}  
*******************************************************************************/

function replace(targetStr, searchStr, replaceStr)
{
	var i=0;
	var j=0;
	if (targetStr == null || searchStr == null || replaceStr == null) return "";
	
	var tmpStr = "";

	var tlen = targetStr.length;
	var slen = searchStr.length;
	
 
    var i=0;
	var j=0;
	
	while (i < tlen - slen+1)
	{
		j = i + slen;
		
		if (targetStr.substring(i,j) == searchStr)
		{
			tmpStr += replaceStr;
		    i += slen;
		
		}
		else
		{
		    tmpStr += targetStr.substring(i, i + 1);
		    i++;
		}
		


    }

	if(typeof targetStr == 'string'){
		tmpStr +=  targetStr.substring(i);
	}
    
	return tmpStr;
	
		
}

/******************************************************************************
* 조회사용자 이체 업무조회시 미출금 메시지 출력 
* @param obj
* @returns {Boolean}
*******************************************************************************/
function inqUserChk(obj) {
    if ( obj.value == "" ) {
		if(ML_LCL.indexOf("EN")>-1)
			alert("No withdrawal account registered. Cannot proceed the transaction.");
		else
			alert("출금계좌가 없습니다. 거래를 더 이상 진행할 수 없습니다.");
        
        return false;
    }
    return true;
}

/*******************************************************************************
 * 조회기간 설정하고 거래내역 자동실행 !!
 * 2006.01.04 new 
 * @param txtMainDate
 * @param txtSubDate
 * @param AddDays
 * @param gv_Data_Gubn
 *******************************************************************************/
function function_AddDate_new(txtMainDate, txtSubDate, AddDays, gv_Data_Gubn) {
	
	var     aDate = txtMainDate.value;
	var 	yy 	= aDate.substring(0,4);
	var 	mm 	= parseInt(aDate.substring(5,7),10) - 1;
	var 	dd 	= aDate.substring(8,10);
	var 	TDate 	= new Date(yy,mm,dd);
	var     strDate = AddDays.toString();

	TDay 		= new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
	TMonth 		= new Array('01', '02', '03', '04', '05','06', '07', '08', '09', '10', '11', '12');
	MonthDays 	= new Array('31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31');

	var	loopFlag= 0;
	/* OK 태그가 TO_BE에서는 없어짐
	//if ( typeof(isClick) != "undefined" ) {
		//if ( isClick ) {
			//alert("기간설정버튼을 여러번 클릭할 수 없습니다. \n\n조회 버튼을 다시 클릭해 주십시오");
			//transferLink = '<a href="javascript:doSubmit();" id="_NOB_SUBMITFLAG_"><img src="/img/common/btnS_inquiry.gif" align="absmiddle"></a>';
			//document.all["OK"].innerHTML = transferLink;
			//document.getElementById("OK").innerHTML = transferLink;
		//	return;
		//}
	//}
		*******************************************************************************/
	//기준날짜가 없을 경우에는 리턴
	if( aDate == null || aDate.length == 0) return "";

	CurYear = TDate.getYear();

	if (CurYear < 2000)             // Y2K Fix
		CurYear = CurYear + 1900;
	CurMonth = TDate.getMonth(); 	// 월
	CurDayOw = TDate.getDay(); 		// 요일
	CurDay 	 = TDate.getDate();  	// 일
	month 	 = TMonth[CurMonth];

	if (month == '02')  {
		if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
			MonthDays[1] = 29;
		}
		else {	MonthDays[1] = 28;
   		}
	}

	days 	= MonthDays[CurMonth];

	tCurDay = parseInt(CurDay);

	var icount = parseInt(strDate.substring(1));
	var intAddDays = 0;
	var i = 0;


    // 해당 달에 해당하는 총일수를 구하고 증가와 감소할 값을 세팅
	if (strDate.charAt(0) == "A") {
		var mainDate = new Date()
		var returndate;
		
		mainDate.setYear(txtMainDate.value.substring(0,4));
		mainDate.setMonth(txtMainDate.value.substring(5,7)-1);
		mainDate.setDate(txtMainDate.value.substring(8));
		
		var term = AddDays.substring(1);
		
		var yyyymm = plusMonth((lpad(mainDate.getYear(), 4, '0')+lpad((mainDate.getMonth()+1), 2, '0')), term);
		
		if (!isValidDay(yyyymm.substring(0,4), yyyymm.substring(4), lpad(mainDate.getDate(), 2, '0'))) {
			returndate = yyyymm + lpad(getEndDate(yyyymm), 2, '0');
		}
		else{
			returndate = yyyymm + lpad(mainDate.getDate(), 2, '0');
		}
		
		returndate = returndate.substring(0,4) + gv_Data_Gubn + returndate.substring(4,6) + gv_Data_Gubn + returndate.substring(6,8);
		
		txtSubDate.value = returndate;
		
		/******************************************************************************
		* 노블을 위해서 추가된 것임 !!
		* 2004.03.24 
		* Kim Young Il
		*******************************************************************************/
		if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
			document.getElementById("_NOB_SUBMITFLAG_").click();
		}
			
		return;

	} else if (strDate.charAt(0) == "B") {
		var mainDate = new Date()
		var returndate;
		
		mainDate.setYear(txtMainDate.value.substring(0,4));
		mainDate.setMonth(txtMainDate.value.substring(5,7)-1);
		mainDate.setDate(txtMainDate.value.substring(8));
		
		
		var term = AddDays.substring(1);
		
		var yyyymm = minusMonth((lpad(mainDate.getYear(), 4, '0')+lpad((mainDate.getMonth()+1), 2, '0')), term);
		
		if (!isValidDay(yyyymm.substring(0,4), yyyymm.substring(4), lpad(mainDate.getDate(), 2, '0'))) {
			returndate = yyyymm + lpad(getEndDate(yyyymm), 2, '0');
		}
		else{
			returndate = yyyymm + lpad(mainDate.getDate(), 2, '0');
		}
		
		returndate = returndate.substring(0,4) + gv_Data_Gubn + returndate.substring(4,6) + gv_Data_Gubn + returndate.substring(6,8);
		
		txtSubDate.value = returndate;
		
		/****************************************************************************
		* 노블을 위해서 추가된 것임 !!
		* 2004.03.24 
		* Kim Young Il
		*******************************************************************************/
		if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
			document.getElementById("_NOB_SUBMITFLAG_").click();
		}
			
		return;
	}

	CurDay 	= parseInt(CurDay) + parseInt(AddDays);

	if (AddDays >= 0 ){  // 0이상이면 날짜를 증가
		//날짜증가
		while (CurDay > days) {
			if (CurDay > days) {
				if (CurMonth == 11) {
					CurMonth 	= 0;
					month 		= TMonth[CurMonth];
					CurYear 	= CurYear + 1 ;
					//윤년 검사
					if (month == '02')  {
						if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
							MonthDays[1] = 29;
						}
						else {
							MonthDays[1] = 28;
						}
					}
				}
				else {
					month 		= TMonth[CurMonth+1];
					CurMonth 	= CurMonth+1;

					if (month == '02')  {
						if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
							MonthDays[1] = 29;
						}
						else {
							MonthDays[1] = 28;
						}
					}
				}
				CurDay 	= CurDay - days;
				days 	= MonthDays[CurMonth];
			}
		}
	} else {		// 0미만이면 날짜를 감소시킨다.
		//날자감소
		while (CurDay < 0 ) {
			if (CurMonth == 0) {
				CurMonth 	= 11;
				CurYear 	= CurYear - 1;
				month 		= TMonth[CurMonth];
				//윤년 검사
				if (month == '02' && loopFlag==0)  {
					if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
						MonthDays[1] = 29;
					}
					else {
						MonthDays[1] = 28;
					}
					loopFlag=1;
				}
			} else {
				CurMonth 	= CurMonth-1;
				month 		= TMonth[CurMonth];

				//윤년 검사
				if (month == '02' && loopFlag==0)  {
					if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
						MonthDays[1] = 29;
					}
					else {
						MonthDays[1] = 28;
					}
					loopFlag=1;
				}
			}

			month 	= TMonth[CurMonth];
			days 	= MonthDays[CurMonth];
			CurDay 	= parseInt(CurDay) + parseInt(days);
		}
	}

	// 월말일 경우
	//if (parseInt(CurDay) == 0) {
	if (parseInt(CurDay) == 0 || parseInt(CurDay) < 0) {
		if (month == '01') {
			month = 12;
			CurYear --;
		} else {month --;}

		CurDay = MonthDays[month-1];
		//윤년 검사
		if (month == '2')  {
			if (((CurYear % 4)==0) && ((CurYear % 100)!=0) || ((CurYear %400)==0)) {
				CurDay = 29;
			}else {	CurDay = 28;	}
		}
		if(parseInt(month) < 10) month = "0" + parseInt(month);
	}

	if (parseInt(CurDay) <10)
		CurDay = "0" + parseInt(CurDay);

	if (CurYear<100) CurYear="19" + CurYear;

	TheDate = CurYear+gv_Data_Gubn+month+gv_Data_Gubn+CurDay;

	var stValue = strDate.substring(1);
/*
	if (strDate.charAt(0) == "A") {
		var tempDate = jsAddDate(aDate, 'Month', stValue);
		TheDate = tempDate.substring(0,4) + gv_Data_Gubn + tempDate.substring(4,6) + gv_Data_Gubn + tempDate.substring(6);
	} else if (strDate.charAt(0) == "B") {
		//var tempDate = jsAddDate(aDate, 'Month', eval(-stValue));
		var tempDate = jsAddDate(aDate, 'Month', -stValue);
		TheDate = tempDate.substring(0,4) + gv_Data_Gubn + tempDate.substring(4,6) + gv_Data_Gubn + tempDate.substring(6);
	}
*******************************************************************************/
	txtSubDate.value = TheDate;
	
	/*******************************************************************************
	* 노블을 위해서 추가된 것임 !!
	* 2004.03.24 
	* Kim Young Il
	*******************************************************************************/
	if ( document.getElementById("_NOB_SUBMITFLAG_") != null ) {
		document.getElementById("_NOB_SUBMITFLAG_").click();
	}
}

////////////////////////////////////////////////////////////////////////////////
//기    능 : PASSWD 자릿수가 4 - 10이며 한글, 영문혼합 입력인가 첵크한다
//파라미터 : obj (Object)
//파라미터 :msg(String)  
//파라미터 : emptyOk( {Boolean}) 
//리 턴 값 :  {Boolean}
//

/*******************************************************************************
 * PASSWD 자릿수가 4 - 10이며 한글, 영문혼합 입력인가 첵크한다 !!
 * 2006.01.04 new 
 * @param obj
 * @param msg
 * @param emptyOk
 *******************************************************************************/
function checkPassword(obj, msg, emptyOk) {
var len = obj.value.length;
var alcnt=0;
var dicnt=0;
var res = true;

	//NBS 6.0
 //if( len >= 4 && len <= 8 ) {
if( len >= 4 && len <= 10 ) {
  for(var i=0; i<len; i++) {
	     var c = obj.value.charAt(i);
		  if(isAlpha(c))
		      alcnt++;
		  else if(isNum(c))
         dicnt++;
  }
  if(alcnt ==0 || dicnt ==0 || len != (alcnt+dicnt)) {
		   alert(msg);
			obj.focus();
		   res = emptyOk;
   }
	} else {
		if(!emptyOk)
		{
			alert(msg);
			obj.focus();
		}
		res = emptyOk;
	}
	return res;
}


/*******************************************************************************
 * 조건에 해당하는 년, 월, 일을 더한다.
 * 2006.01.04 new 
 * @param stDate
 * @param stType
 * @param stValue
 *******************************************************************************/
function jsAddDate(stDate, stType, stValue) {

var CurYear  = stDate.substring(0,4);
var CurMonth = stDate.substring(4,6);
var CurDate  = stDate.substring(6);

var TDate = new Date();

if (stType == 'Year') {
	CurYear = eval(CurYear) + eval(stValue);
	TDate.setFullYear(CurYear);
} else if (stType == 'Month') {
	CurMonth = eval(CurMonth) + eval(stValue-1);
	TDate.setMonth(CurMonth);
} else {
	CurDate = eval(CurDate) + eval(stValue);
	TDate.setDate(CurDate);
}

CurYear = TDate.getFullYear();
CurMonth = TDate.getMonth()+1;
CurDate = TDate.getDate();
if (CurMonth<10) CurMonth = '0' + CurMonth;
if (CurDate<10) CurDate = '0' + CurDate;

return  (CurYear.toString() + CurMonth.toString() + CurDate.toString());
}

/*******************************************************************************
 * 설명 : 대상 form을 ajax submit한다.
 * @param	method		: post/get 방식구분
 * @param	frm			: 대상 form object
 * @param	onresult		: ajax처리 성공시 callback function
 * @param	onfault		: ajax처리 실패시 callback function
 * @예제 
 * 		cmnAjaxSubmit( 'POST', $('#sec_frm'), success_function, fail_function );
 * @returns {없음}
 *******************************************************************************/
function cmnAjaxSubmit( method, frm, onresult, onfault ){
	if( $.trim(method).toUpperCase()!=='GET' ){ method = 'POST'; }
	if( $( frm ).length == 0 ){ alert('[function cmnAjaxSubmit] form 이 존재하지 않습니다. '); return; }
	
	var pageUrl = $( frm ).attr('action');
	var params = $( frm ).serialize();
	var d='';
	$.ajax({
		url : pageUrl,
		type : method,
		data : params,
		dataType : 'html',
		async: false,
		success : function(data) {
			d = data;
		},
		complete : function(xhr, r_msg){
			/* alert('error: ' + xhr.status + ' ' + xhr.statusText); */
			var isSuccess = false;
			if(r_msg === 'success'){ isSuccess = true; }
			if(isSuccess){
				if( typeof onresult === 'function' ){ onresult( d, xhr ); }
			}else{
				if( typeof onfault === 'function' ){ onfault( d, xhr ); }
			}
		}
	});
}

/*******************************************************************************
 * 설명 : 대상 form을 url로 ajax POST submit한다.
 * @param	frm			: 대상 form object
 * @param	url				: url
 * @param	onresult		: ajax처리 성공시 callback function
 * @param	onfault		: ajax처리 실패시 callback function
 * @예제 
 * 		cmnAjaxSubmit_a( $('#sec_frm'), url, success_function, fail_function );
 * @returns {없음}
 *******************************************************************************/
function cmnAjaxSubmit_a( frm, url, onresult, onfault ){
	var bk_action = !!$( frm ).attr('action')?$( frm ).attr('action'):''; 
	$( frm ).attr('action', url);
	cmnAjaxSubmit( 'POST', frm, onresult, onfault );
	$( frm ).attr('action', bk_action);
}




/*******************************************************************************
 * 공통 파일다운로드 메니저
 * 2006.01.04 new 
 * @param sdiv 업무구분
 * @param filepath 상대경로
 * @param filename 파일명
 *******************************************************************************/
function cmnFileDownload(sdiv, filepath, filename)
{
	//jcc?withyou=CMCOM0072&__ID=c007279&sdiv=SD_PIB&fileName=test.txta&filePath=%2Fnode%2F&
	
	if(sdiv == null || sdiv == "")
	{
		alert("해당파일이 존재하지 않습니다.(errcode:-100)");
		return;
	}
	
	if(filepath == null || filepath == "")
	{
		alert("해당파일이 존재하지 않습니다.(errcode:-200)");
		return;
	}
	
	if(filename == null || filename == "")
	{
		alert("해당파일이 존재하지 않습니다.(errcode:-300)");
		return;
	}
	
	var url = "";
	
	url = "jcc?withyou=CMCOM0072&__ID=c007279&sdiv=";
	url += sdiv;
	
	url += "&fileName=";
	url += filename;
	
	url += "&filePath=";
	url += filepath;
 
	window.open(url , "win_cmnFileDownload" , "toolbar=no,overflower=hidden,menubar=no,scrollbars=no,resizable=yes,width=0,height=0,left=999999,top=999999");
    	
}


var telcode		= new Array ('','02','031','032','033','041','042','043','044','051','052','053','054','055','061','062','063','064','070');
var telvalue	= new Array ('선택','02','031','032','033','041','042','043','044','051','052','053','054','055','061','062','063','064','070');
var mobilcode	= new Array ('','010','011','016','017','018','019');
var mobilvalue	= new Array ('선택','010','011','016','017','018','019');
var telallcode	= new Array ('','010','011','016','017','018','019','02','031','032','033','041','042','043','044','051','052','053','054','055','061','062','063','064','070');
var telallvalue	= new Array ('선택','010','011','016','017','018','019','02','031','032','033','041','042','043','044','051','052','053','054','055','061','062','063','064','070');

/*******************************************************************************
 * 설명 : 전화번호를 Select Box형태로 출력한다
 * @param	mode		: 전화번호 유형
 * @param	name		: element name, id
 * @param	choice	: 기본 선택 값
 * @param	event		: 기타  attribute ( ex: "onchange=alert('test'); title=전화번호 ")
 * @param isNotWrite : document.write 여부 --> false면 string을 return함
 * @returns {없음}
 *******************************************************************************/
function getSelectBoxInfo(mode, name, choice, event, isWrite) {
	isWrite = (isWrite===false)?false:true;

	var selectCnt = 0;
	var temp_code = new Array();
	var temp_value = new Array();
	var formatStr = '';
	var viewCode = '';
	var viewValue = '';
	
	if(mode == "1") {		// 지역번호
		temp_code = telcode;
		temp_value = telvalue;
	} else if (mode=="2") {
		temp_code = mobilcode;
		temp_value = mobilvalue;
	} else if (mode=="3") {
		temp_code = telallcode;
		temp_value = telallvalue;
	}
	
	selectCnt = temp_code.length;
	
	var tmpStr = '';
	tmpStr += "<select id='" + name + "' name='" + name + "' " + event + ">";
	for(i4=0; i4<selectCnt; i4++) {
		if(choice != '' &&  choice==temp_code[i4]) {
			tmpStr += "<option value='" + temp_code[i4] + "' selected >" + temp_value[i4];
		} else {
			tmpStr += "<option value='" + temp_code[i4] + "'>" + temp_value[i4];
		}
	}
	tmpStr += "</select>";
	
	if(isWrite){
		document.write(tmpStr);
	}else{
		return tmpStr;
	}
}
/*******************************************************************************
 * 설명 : 사이즈에서 문자열 길이가 부족한 만큼 빈공간을 주는 함수
 * @param	mode		: 
 * @param	name		: element name, id
 * @param	choice	: 기본 선택 값
 * @param	event		: 
 * @returns str
 *******************************************************************************/
function getANstring(str, len)
{
	if(str==null) return "";
	for (var i = len- str.length; i >0; --i){
		str += " ";
	}
	return str;
}
/*******************************************************************************
 * 설명 : 사이즈에서 문자열 길이가 부족한 만큼 빈공간을 주는 함수의 리턴값을 지정 input에 입력하는 함수
 * @param	mode		: 
 * @param	name		: element name, id
 * @param	choice	: 
 * @param	event		: 
 * @returns {없음}
 *******************************************************************************/
function setANstring(input, len)
{
	input.value =  getANstring(input.value, len);
}


/**
 * Form Submit시 "처리중"으로 버튼 변경
 * btn_ok_id			: 처리중으로 표시할 버튼ID
 * btn_hidden_ids	: 숨길 버튼들 ID [Array]
 * 예) buttonProcessing('OK', ['OK_hidden1','OK_hidden2','OK_hidden3']);
 */
function buttonProcessing(btn_ok_id, btn_hidden_ids){
	var o = $('#'+btn_ok_id);
	if(o.length == 0){ return; }
	//var o_tag = o[0].tagName;
	var btn_name="처리중"
	if(ML_LCL.indexOf("EN")>-1){
		//btn_name = 'Processing';
		btn_name = 'loading';
	}else{
		
		btn_name = '처리중';
	}
	o.before( $('<a/>').attr({ id : 'btn_process_'+btn_ok_id }).text( btn_name ) ).bind('click',function(){ return false; });	// 처리중버튼 추가
	
	// 숨김
	if($.isArray(btn_hidden_ids)){
		btn_hidden_ids.push( btn_ok_id );
		$.each(btn_hidden_ids, function(i,v){ $('#'+v).addClass('hidden'); });
	}else{
		$('#'+btn_ok_id).addClass('hidden');
	}
}

/**
 * Form Submit시 "처리중"으로 버튼 변경 - 원복하기
 * btn_ok_id			: 처리중으로 표시한 버튼ID
 * btn_hidden_ids	: 숨긴 버튼들 ID [Array]
 * 예) buttonRollback('OK', ['OK_hidden1','OK_hidden2','OK_hidden3']);
 */
function buttonRollback(btn_ok_id, btn_hidden_ids){
	//var o = $('#'+btn_ok_id);
	$('#btn_process_'+btn_ok_id).remove();	// 처리중 버튼 제거
	
	// 숨김 해제
	if($.isArray(btn_hidden_ids)){
		btn_hidden_ids.push( btn_ok_id );
		$.each(btn_hidden_ids, function(i,v){ $('#'+v).removeClass('hidden'); });
	}else{
		$('#'+btn_ok_id).removeClass('hidden');
	}
}


/*******************************************************************************
 * 설명 : 모바일(스마트폰, 탭) 환경인지 Check. 모바일 환경이면 true 리턴
 * @param	void		: 
 * @returns {BOOLEAN}
 *******************************************************************************/

function isMobile() {
	var m_IsMobile = getSmartPhoneAgent();

	if (m_IsMobile != "etc") {
			return true; //etc가 아닐경우, 모바일 
	} else {
		return false;
	}
}
/*******************************************************************************
 * 설명 : Agent 환경 리턴
 * @param	void		: 
 * @returns {String} : etc, android, iphone
 *******************************************************************************/
function getSmartPhoneAgent(){
        var agentKind = "etc";
        var agent = navigator.userAgent;

        if (agent.indexOf("AppleWebKit") != -1 || agent.indexOf("Opera") != -1) {
                if (agent.indexOf("Android") != -1 || agent.indexOf("J2ME/MIDP") != -1) {
                        agentKind = "android";
                } else if (agent.indexOf("iPhone") != -1) {
                        agentKind = "iphone";
                } else if (agent.indexOf("iPad") != -1) {
                        agentKind = "iphone";
                }
        } else {
                agentKind = "etc";
        }
        
        return agentKind;
}

/*******************************************************************************
 * 설명 : 시작일, 종료일 체크하는 함수 (기업뱅킹) -  박재풍
 * @param	void		:  formName, 시작일ID, 종료일ID, 국문,영문 구분자
 * @returns {boolean} : true (정상)
 *******************************************************************************/
function checkDate1team(formname, startid, endid, lang){  //시작일과 종료일이 사용될 form Name, 시작일 ID, 종료일 ID, 영문 (영문이면 alert문구를 다르게)
	   //각 name에서의 값을 읽는다.
	   var start_date = "";
	   var end_date = "";
	   
	   if(formname == undefined || formname == null || formname == "" ){  //안에 없는 경우
		   start_date = $("input[name='"+ startid +"']").val();
		   end_date  = $("input[name='"+ endid +"']").val();
	   
	   } else {
		   start_date = $("#"+formname + " input[name='"+ startid +"']").val();
		   end_date  = $("#"+formname + " input[name='"+ endid +"']").val();
	   }
	
	   //특수문자 제거
	   start_date = replace(replace(replace(start_date,'.',''),'/',''),'-','');
	   end_date  = replace(replace(replace(end_date,'.',''),'/',''),'-','');

	   if(start_date.length == 8 && end_date.length == 8){ //공백이 아닐때 체크한다.
		   if(start_date > end_date){
			   if(lang == "ENG" || lang == "eng"){  //영어로 들어온 경우
				   alert("Please select the date earlier than the end date.");

			   } else {  //한글일 경우
				   alert("시작일자를 종료일자보다 이전으로 선택해주십시오.");
			   }//lang
			   
			   if(formname == undefined || formname == null || formname == "" ){  //안에 없는 경우
				   $("select[name='"+ startid +"Y']")[0].focus();		   
			   } else {
				   $("#"+formname + " select[name='"+ startid +"Y']")[0].focus();		  
			   }
			   
			return false;
		   }//start_date > end_date
	   }//공백이 아닐때만 실행 , 공백이 있으면 넘어간다.
	   return true;
	}

/*******************************************************************************
 * 설명 : 원하는 form 안에 이름, 값을 설정하여 hidden 으로 input 태그 생성
 * @param	void		:  formName, input name, input value, 배열선언
 * @returns {boolean} : true (정상)
 *******************************************************************************/
function addHiddenField (form, name, value, isArray) {
	if(typeof form != 'object' && form.indexOf('#') == -1)
		form = '#' + form;

	if(isArray == undefined || isArray == false) {
		$(form).find('[name=' + name + ']').remove;
	}

	var addHiddenField = '<input type="hidden" name="' + name + '" value="' + value + '" />'
	$(form).append(addHiddenField);
	return true;
}


//이 소스 위로 추가해주세요
/*******************************************************************************
 * 성능측정 - 소스 맨 상단에 결과 출력
 *******************************************************************************/
if(typeof wbUI !== 'undefined') wbUI.debug('common.js Load - '+perf(perfCommon)+'ms');

