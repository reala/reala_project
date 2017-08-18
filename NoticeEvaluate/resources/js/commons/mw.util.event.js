/* ============================================================================
 * LIFEPLANET Mobile Web Marketing System
 * 
 * Copyright ⓒ KYOBO LIFEPLANET INSURANCE COMPANY All Rights Reserved.
 * ============================================================================
 * AUTHOR      : 기존 홈페이지 시스템
 * FILE INFO   : mw.util.event.js, /resources/js/
 * DESCRIPTION : 페이지 전역에서 사용되는 이벤트 관련 함수 집합
 * ============================================================================
 * Revision History
 * Author   Date            Description
 * ------   ----------      ---------------------------------------------------
 * 홈페이지 2014-11-20	 	initial version
 * 시스템
 * 권대준	2014-12-11		KDIMW에 맞도록 구조 수정  			
 * ========================================================================== */

/*******************************************************************************
 * Function List
 *******************************************************************************
 * 
 * *** 페이지 오픈/이동 관련 함수 *********************************************
 * 
 * util.movePage	: form 방식으로 화면을 이동한다.
 * util.ajaxPage	: ajax 통신을한다.
 * util.wPopPage	: window 팝업을 띄운다.
 * util.modalPage	: modal 팝Date업을 띄운다.
 * util.closeModal		: modal 팝업을 닫는다. 
 * util.ErrorModal	: Object에 ERROR_CODE와 ERROR_MSG가 있는지 판단하여 처리중 실패안내 페이지를 모달로 띄우고 false리턴한다.
 * util.wPopCkPage	: cookie key을 받아 저장된 날짜 이후에만 window 팝업을 연다.
 * 
 * *** 이벤트 처리 함수 ********************************************************
 * 
 * util.intDateValid	(조회화면 기간 조회 입력 필드 이벤트바인드)			: 날짜 조회시 시작일과 종료일 사이의 유효성을 체크한다
 * util.inputName 		(입력화면 이름입력 필드 이벤트바인드)				: 이름입력필드 초기화
 * util.inputEngName	(입력화면 영문이름입력 필드 이벤트바인드)			: 영문이름입력필드 초기화
 * util.inputNum 		(입력화면 숫자입력 필드 이벤트바인드)				: 숫자입력필드 초기화
 * util.inputAmt 		(입력화면 금액입력 필드 이벤트바인드)				: 금액입력필드 초기화
 * util.inputJumin1 	(입력화면 주민번호앞자리입력 필드 이벤트바인드)		: 주민번호앞자리입력필드 초기화
 * util.inputJumin2 	(입력화면 주민번호뒷자리입력 필드 이벤트바인드)		: 주민번호뒷자리입력필드 초기화 
 * util.inputEmail1 	(입력화면 이메일아이디입력 필드 이벤트바인드)		: 이메일앞자리입력필드 초기화
 * util.inputEmail2 	(입력화면 이메일도메인입력 필드 이벤트바인드)		: 이메일뒷자리입력필드 초기화
 * util.inputTel2 		(입력화면 전화번호중간자리입력 필드 이벤트바인드)	: 전화번호중간자리입력필드 초기화
 * util.inputTel3 		(입력화면 전화번호뒷자리입력 필드 이벤트바인드)		: 전화번호뒷자리입력필드 초기
 * util.inputCardNum	(입력화면 신용카드번호입력 필드 이벤트바인드)		: 신용카드번호입력필드 초기
 * util.inputSecCard	(입력화면 보안카드번호입력 필드 이벤트바인드)		: 보안카드번호입력필드 초기
 * 
 ******************************************************************************/

/*******************************************************************************
 * 페이지 오픈/이동 관련 함수
 ******************************************************************************/

/**
 * form 방식으로 화면을 이동한다.
 * 화면에 자동으로 form 및 input hidden을 생성하여 submit까지 실행한다.
 * @param strUrl	- String	- url을 입력한다. .dev등의 확장자는 입력하지 않는다.
 * @param objParam	- Object	- 파라메터로 넘길 Object, 함 수 호출시 입력하지 않으면 페이지 이동만 한다. 
 *                                파라메터 Object 예 
 *                                var obj = new Object();
 *                                obj.a = 1;
 *                                obj.b = 2;
 * @param strTarget	- String	- form의 타겟을 지정한다.
 *                                _blank : 새로운 창에 표시
 */


/**
 * @param strUrl
 * @param objParam
 * @param strTarget
 */
util.movePage = function (strUrl, objParam, strTarget){
	if (util.chkReturn(strUrl, "s") == ""){
		message.alert('COM015');
		return;
	}
	if (util.chkReturn(objParam, "s") == ""){
		objParam = new Object;
	}
	if (util.chkReturn(strTarget, "s") != ""){
		strTarget = "target=\"" + strTarget + "\"";
	} else {
		strTarget = "";
	}
	
	// 객체 파라메터화
	/*
	 * var paramObj = new Object(); var objCnt = 0; for(var key in objParam){
	 * if(typeof(objParam[key]) == 'object'){ paramObj[key] = objParam[key];
	 * objCnt ++; } }
	 */
	
	// 스크린ID만들기
	// var startPoint = strUrl.lastIndexOf("/") + 1, endPoint = strUrl.length;
	// objParam["NAVI_ID"] = strUrl;
	
	// 화면에 추가할 html text를 만든다.
	$("#nextForm").remove();	
	var strHtml = "";
	strHtml += "<form id=\"nextForm\" name=\"nextForm\" method=\"POST\" " + strTarget + " action=\"" + strUrl + ".dev\">";
	strHtml += PageUtil.makeInputTag(objParam, "");// 데이터의 일반, 객체, 배열의 모든 종류의 타입
												// 체크하여 입력태그에 동적 추가
	// if(objCnt > 0) strHtml += "<input name=\"[paramObj]\" id=\"[paramObj]\"
	// type=\"hidden\" value=\'" + jQuery.stringify(paramObj) + "\' />";//배열이나
	// 오브젝트 파라메터 전송
	strHtml += "</form>";
	
	$("body").append(strHtml);	// 화면에 form 등 생성
	$("#nextForm").submit();	// submit
};


/**
 * ajax통신을 한다. Object data를 받아 처리하고 통신 성공시 특정 펑션을 호출하여 Object를 리턴한다.
 * 
 * @param strUrl -
 *            String - 이동할 URL 주소, .ajax는 생략한다
 * @param objParam -
 *            Object - 파라메타 오브젝트, 파라메타가 없을경우 빈스트링 처리 objParam.noLoading 값을 true로
 *            주면 로딩 이미지 안나타남
 * @param strCallBack -
 *            String - 통신성공시 호출할 펑션명, 미입력시 callAjaxData 펑션을 무조건 호출한다.
 * @bNoLoadingChk - Boolean - ture 일경우 로딩 안나타남
 */
util.ajaxPage = function (strUrl, objParam, strCallBack){
	
	if (util.chkReturn(strUrl, "s") == ""){
		message.alert('COM015');
		return;
	}
	
	if (util.chkReturn(objParam) == false){
		objParam = "";
	}
	
	$.ajax({
		"type"	: "POST" ,
		"url"	: strUrl + ".ajax", 
		"data"	: objParam,
		"success" : function (data){
			// 2013.01.25 박태양 - ajax인 경우 결과가 text/html이기 때문에 Object로 변환한다.
			data = jQuery.parse(data);
			// Ajax 권한체크(2013.05.14 김상종)
			var error_code =((typeof data.result.outData)=="undefined"?false:data.result.outData.ERROR_CODE);
			if(error_code == "-HP00W0008"){
				logger.alert(data.result.outData.ERROR_MSG);
			}
			
			var outData = data.result;
			// 정상처리후 strCallBack 값이 있을경우 해당 펑션호출 없을경우 callAjaxData펑션 호출
			if (util.chkReturn(strCallBack, "s") != ""){
				closeLoading();	// 모달 로딩 종료
				
				if(typeof strCallBack === 'function'){
					strCallBack(outData);
				}else if(typeof strCallBack === 'string'){
					eval(strCallBack + '(data)');
				}
			} else {
				closeLoading();	// 모달 로딩 종료
				callAjaxData(data);
			}
		}
		,"error" : function (data){
			
			closeLoading();	// 모달 로딩 종료
			
		}
	});
};

/**
 * 팝업을 띄워 새로운 페이지를 연다. objOption의 width와 height 값은 필수 이다. objOption의 값을 세팅해주고자
 * 하면 함수에 해당 처리부분 추가 필요 단순 컨텐츠성을 jsp로 띄울때는 확장자를 붙인다. 확장자를 붙이면 서버를 타지 않고 바로 팝업을
 * 띄운다. objOption 예) var objPopOption = new Object(); objPopOption.width =
 * "400"; objPopOption.height = "200";
 * 
 * @param strUrl -
 *            String - 팝업에서 띄울 URL, .dev의 확장자는 붙이지 않는다. 단순 컨텐츠성을 jsp로 띄울때는 확장자를
 *            붙인다.
 * @param objOption -
 *            Object - width, height 등의 팝업 옵션값
 * @param objParam -
 *            Object - 전달할 파라메타
 */
util.wPopPage = function (strUrl, objOption,  objParam){
	if (util.chkReturn(strUrl, "s") == ""){
		message.alert('COM016');
		return ;
	}
	
	var arrUrl = strUrl.split("/");
	if (arrUrl.length == 0) {
		message.alert('COM016');
		return ;
	}
	
	if (util.chkReturn(objOption, "s") == ""){
		objOption = {};
	}
	
	// 화면 ID
	var strId = "pop" + arrUrl[arrUrl.length - 1];
	var strEndText = ".dev";
	
	if (strId.substring(strId.length -4, strId.length) == ".jsp"){
		strId = strId.substring(0, strId.length -4);
		strEndText = ".jsp";
	}
	
	var strFlag = "";
	var popWidth = 850;
	var popHeight = 630;
	
	// 가로크기
	if(util.chkReturn(objOption.width, "s") == "") {
		// strFlag += "width=850";
		strFlag += "width=" + getPopW(strUrl);
	} else {
		strFlag += "width=" + objOption.width;
		popWidth = objOption.width;
	}
	
	// 세로크기
	if(util.chkReturn(objOption.height, "s") == "") {
		strFlag += ",height=" + getPopH(strUrl);
	} else {
		strFlag += ",height=" + objOption.height;
		popHeight = objOption.height;
	}
	
// var winHeight = $(window).height(); // // 현재창의 높이
// var winWidth = $(window).width(); // 현재창의 너비
	var winHeight =  window.outerHeight;	// 현재창의 높이
	var winWidth = window.outerWidth;	// 현재창의 너비
// var winHeight = window.screen.height; // 현재창의 높이
// var winWidth = window.screen.width; // 현재창의 너비
	
	
	var winX = window.screenX;// 현재창의 x좌표
	var winY = window.screenY; // 현재창의 y좌표
	var popX = winX + (winWidth - popWidth)/2; 
	var popY = (winY + (winHeight - popHeight)/2);
	
	// 주소창이 활성화 (기본yes)
	if(util.chkReturn(objOption.location, "s") != "") {
		strFlag += ",location=" + objOption.location;
	} else {
		strFlag += ",location=yes";	
	}
	
	// 사이즈 변경 (기본yes)
	if(util.chkReturn(objOption.resizable, "s") != "") {
		strFlag += ",resizable=" + objOption.resizable;
	} else {
		strFlag += ",resizable=yes";
	}
	
	// 스크롤바 (기본yes)
	if(util.chkReturn(objOption.scrollbars, "s") != "") {
		strFlag += ",scrollbars=" + objOption.scrollbars;
	} else {
		strFlag += ",scrollbars=yes";
	}
	
	// 상단위치
	if(util.chkReturn(objOption.top, "s") != "") {
		strFlag += ",top=" + objOption.top;
	}else{
		// strFlag += ",top=" + ((screen.height-objOption.height)/2);
		strFlag += ",top=" + popY;
	}
	  
	// 좌측위치
	if(util.chkReturn(objOption.left, "s") != "") {
		strFlag += ",left=" + objOption.left;
	}else{
		// strFlag += ",left=" + ((screen.width-objOption.width)/2) ;
		strFlag += ",left=" + popX;
	}

	var popWin;
	if (strEndText == ".jsp"){	// .jsp 확장자가 붙은경우 서버를 통하지 않고 바로 팝업 돌출
		popWin = window.open(strUrl, strId, strFlag) ;
	} else {	// 폼을 동적 생성항 서버를 통한 팝업 돌출
		popWin = window.open("", strId, strFlag) ;

		// 객체 파라메터화
		/*
		 * var paramObj = new Object(); var objCnt = 0; for(var key in
		 * objParam){ if(typeof(objParam[key]) == 'object'){ paramObj[key] =
		 * objParam[key]; objCnt ++; } }
		 */
		
		// 화면에 추가할 html text를 만든다.
		var strHtml = "";
		strHtml += "<form id=\"popForm\" name=\"popForm\" method=\"POST\" target=\"" + strId + "\" action=\"" + strUrl + strEndText + " \">";
		strHtml += PageUtil.makeInputTag(objParam, "");// 데이터의 일반, 객체, 배열의 모든 종류의
													// 타입 체크하여 입력태그에 동적 추가
		// if(objCnt > 0) strHtml += "<input name=\"[paramObj]\"
		// id=\"[paramObj]\" type=\"hidden\" value=\'" +
		// jQuery.stringify(paramObj) + "\' />";//배열이나 오브젝트 파라메터 전송
		strHtml += "</form>";

		$("body").append(strHtml);	// 화면에 form 등 생성
		$("#popForm").submit();	// submit
		// $("#popForm").remove(); // 자동생성한 form등을 삭제한다.
		// IE 구버전에서 .remove가 정상 작동 안할 수 있으므로 스크립트 방식으로 삭제
		jQuery.remove("popForm");
	}
	
	if (popWin == null){
		message.alert('COM017');
	}
	return popWin;
};

/**
 * cookie key을 받아 저장된 날짜 이후에만 window 팝업을 연다.
 */
util.wPopCkPage = function (strCookieKey, strUrl, objOption,  objParam){
	var strCkValue = "";
	strCkValue = util.getCookie(util.chkReturn(strCookieKey, "s"));
	
	if (strCkValue == ""){
		util.wPopPage(strUrl, objOption,  objParam);
	} else if (parseInt(strCkValue, 10) <= parseInt(util.getDate(), 10)){
		util.wPopPage(strUrl, objOption,  objParam);
	}
		
};

var u_context_ERROR_flag = false;	// 에러 여부
var u_context_ERROR_CODE = "";	// 에러 코드
var u_context_ERROR_MSG = "";	// 에러 메세지
/**
 * Object에 ERROR_CODE와 ERROR_MSG가 있는지 판단하여 처리중 실패안내 페이지를 모달로 띄우고 false리턴한다.
 * ERROR시 true를 리턴하고 모달팝업을 띄운다, 정상시 false를 리턴한다.
 * 사용예)
	if(util.ErrorModal(objCutData, "/mypage/conr/HPMB01S0")){	// 오류메세지 모달팝업화면 처리
		// 에러처리
		return ;
	}
	// 정상처리
 * @param objData	- Object	- 체크할 data
 * @param reUrl	- String	- 실패안내 페이지의 확인 버튼 클릭시 이동할 이동할 페이지 주소
 *                            미입력시 로그인시 각 서브매인, 비로그인시 시작화면으로 이동
 * @returns {Boolean}	error 이경우 true, 정상일 경우 false
 */
util.ErrorModal = function (objData, reUrl){
	u_context_ERROR_flag = false;
	u_context_ERROR_CODE = "";
	u_context_ERROR_MSG = "";
	
	if (objData == null || objData == undefined || objData.length == 0){
		message.alert('COM010');
		return true;
	}
	
	reUrl = util.chkReturn(reUrl, "s");
	
	util.chkObjKeyValue(objData);
	
	if (u_context_ERROR_flag == true && u_context_ERROR_MSG == ""){
		u_context_ERROR_MSG == "처리중 오류가 발생하였습니다.";
	}
	
	if (u_context_ERROR_flag){
		var u_objModealData = new Object();
		u_objModealData.strERROR_CODE = u_context_ERROR_CODE;
		u_objModealData.strERROR_MSG = util.setHtmlParsing(u_context_ERROR_MSG);
		u_objModealData.reUrl = reUrl;
		
		util.modalPage("/common/view/HPTA05P3", "", u_objModealData);
	}
	
	return u_context_ERROR_flag;
};

/**
 * 팝업닫기 호출함수(modal || window)
 * 
 * @param event객체(고정값)
 */
util.closeModal = function (e){
	if($('#modal_ifrmWrap iframe',window.parent.document).length){		
		$(parent.modalLauncher).focus();
		parent.modalLauncher = null;
		$('#modal_ifrmWrap iframe',window.parent.document).attr('src','');
		$('#modal_back',window.parent.document).remove();
		$('#modal_ifrmWrap',window.parent.document).remove();		
	} else {
		$(window.parent).focus();
		window.close();
	}
// e.preventDefault();
// fn_preventDefaultHelper(e);
};

/* 팝업닫기에 해당하는 event.preventDefault 가 ie에 서 작동되지 않는점 보완한 함수 */
function fn_preventDefaultHelper(event){
	var browerVersion = window.navigator.userAgent;
	if( browerVersion.indexOf('Mozilla/4.0') >= 0 ){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}
}

/**
 * 팝업을 띄워 새로운 페이지를 연다. objOption의 width(default:800px)와 height(default:700px) 값은
 * 선택 이다. objOption의 값을 세팅해주고자 하면 함수에 해당 처리부분 추가 필요 objOption 예) var objOption =
 * new Object(); objOption.type = "window";//(default:modal) objOption.width =
 * "850"; objOption.height = "630";
 * 
 * @param strUrl -
 *            String - 팝업에서 띄울 URL + parameter
 * @param objOption -
 *            Object - width, height 등의 팝업 옵션값
 * @param objData -
 *            Object - objData 값이 있을 경우 parameter를 자동 세팅한다.
 */
util.modalPage = function (strUrl, objOption, objData) {
	if(util.chkReturn(strUrl, "s") == "") {
		message.alert('COM016');
		return ;
	}
	/*
	 * if (strUrl.substring(strUrl.length -4, strUrl.length) != ".jsp" &&
	 * strUrl.substring(strUrl.length -4, strUrl.length) != ".dev"){ strUrl =
	 * strUrl + ".dev"; }
	 */
	
	if(strUrl.indexOf("?")>=0){
		
	} else if (strUrl.indexOf(".dev") >=0) {
		
	}else{
		if((strUrl.indexOf(".dev")>=0)||((strUrl.indexOf(".jsp")>=0))){
		}else{
			strUrl = strUrl + ".dev";
		}
	}
	
	// objData로 동적 parameter 생성
	if(util.chkReturn(objData, "s") != "") {
		/*
		var keys = [];
		
		for(var k in objData){	// object의 키값을 구한다.
			keys.push(k);
		}
		
		var nCountI = keys.length;
		var chkCount = 0;
		
		for (var i = 0; i<nCountI; i++){
			var strGetValue = eval("objData." + keys[i]);
			
			if (chkCount == 0){
				strUrl = strUrl + "?" +  keys[i] + "=" + strGetValue;
				chkCount = 1;
			} else {
				strUrl = strUrl + "&" +  keys[i] + "=" + strGetValue;
			}
		}
		*/
	}
	
	if (util.chkReturn(objOption, "s") == ""){
		objOption = {};
	}
	
	if(util.chkReturn(objOption.type, "s") == "") {
		objOption.type = "modal";
	}
	
	// 가로크기
	if(util.chkReturn(objOption.width, "s") == "") {
		objOption.width = getPopW(strUrl);
	}
	
	// 세로크기
	if(util.chkReturn(objOption.height, "s") == "") {
		objOption.height =  getPopH(strUrl);
	}
	
	// 로딩시 이미지 URL
	if(util.chkReturn(objOption.loadingImgUrl, "s") == "") {
		objOption.loadingImgUrl = "";
	}
	
	// 배경 투명도
	if(util.chkReturn(objOption.opacityBg, "s") == "") {
		objOption.opacityBg = 0.3;
	}
	
	// 청약 로딩 유무
	if(util.chkReturn(objOption.loadType, "s") == "") {
		objOption.loadType = false;
	}
	
	jQuery(this).JQmodal({
		popUrl:strUrl
		,type: objOption.type
		,width: objOption.width
		,height: objOption.height
		,loadingImgUrl: objOption.loadingImgUrl
		,opacityBg: objOption.opacityBg
		,loadType: objOption.loadType
		,closeBtnClass: objOption.closeBtnClass
		,bgColor: objOption.bgColor
		,objValue: objData
	});
};

/**
 * 날짜 조회 입력시 유효성 체크 날짜가 입력될경우 조회시작일이 현재일보다 이후이면 현재일 종료일보다 이후이면 종료일을 조회시작일로 맞춘다.
 * 조회종료일이 현재일보다 이후이면 현재일 시작일보다 이전이면 시작일을 조회종료일로 맞춘다.
 * 
 * 
 * ex ) util.intDateValid("sDate", "eDate");
 */
util.intDateValid = function (startDateId, endDateId){
	if(util.chkReturn(startDateId,"s")==""){
		startDateId = "startDate";
	}
	if(util.chkReturn(endDateId,"s")==""){
		endDateId 	= "endDate";
	}
	$startDate 	= $("#"+startDateId);
	$endDate 	= $("#"+endDateId);
	// 조회시작일 유효성 체크
	$startDate.unbind('change').bind("change", function(){
		if(!util.isValidDate($(this).val())){
			message.alert('VLD029');
			$(this).val(util.getDate('-'));
		}
		if(!util.isValidDate($(this).val(), $endDate.val())){
			$endDate.val($(this).val());
		}
	});
	// 조회종료일
	$endDate.unbind('change').bind("change", function(){
		if(!util.isValidDate($(this).val())){
			message.alert('VLD029');
			$(this).val(util.getDate('-'));
		}
		if(!util.isValidDate($startDate.val(), $(this).val())){
			$startDate.val($(this).val());
		}
	});
};

/**
 * 이름입력 필드에대한 함수 영역아이디
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputName("areaId01", "areaId02", "areaId03", ... );
 */
util.inputName = function (){
	var argElmt = util.inputName.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","25");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if(!util.inputKorChk($inpObj,{"msg":true,"num":false})){
				util.inputEventChk($inpObj);
			}
			else if($inpObj.val().length > 25){
				util.inputEventChk($inpObj,"이름의 최대 입력값은 25자입니다.");
			}
		});
	}
};

/**
 * 영문 이름입력 필드에대한 함수 영역아이디
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEngName("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEngName = function (){
	var argElmt = util.inputEngName.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","25");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if(!util.inputEngChk($inpObj,{"msg":true,"num":false,"space":true})){
				util.inputEventChk($inpObj);
			}
			else if($inpObj.val().length > 25){
				util.inputEventChk($inpObj,"이름의 최대 입력값은 25자입니다.");
			}
		});
	}
};
/**
 * 이름입력 필드에대한 함수 영역아이디
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputName("areaId01", "areaId02", "areaId03", ... );
 */
util.inputKor = function (){
	var argElmt = util.inputKor.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if(!util.inputKorChk($inpObj,{"msg":true,"num":true,'space':true})){
				util.inputEventChk($inpObj);
			}
		});
	}
};

/**
 * 영문 이름입력 필드에대한 함수 영역아이디
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEngName("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEng = function (){
	var argElmt = util.inputEng.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if(!util.inputEngChk($inpObj,{"msg":true,"num":true,"space":true})){
				util.inputEventChk($inpObj);
			}
		});
	}
};

/**
 * 주민번호입력 전체 필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputJumin("areaId01", "areaId02", "areaId03", ... );
 */
util.inputJumin = function (){
	var argElmt = util.inputJumin.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","13");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !util.isJuminno($inpObj.val())){
				util.inputEventChk($inpObj,"주민등록번호가 잘못되었습니다.");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 주민번호입력 전필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputJumin1("areaId01", "areaId02", "areaId03", ... );
 */
util.inputJumin1 = function (){
	var argElmt = util.inputJumin1.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","6");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !util.isJuminno($inpObj.val(), "1")){
				util.inputEventChk($inpObj,"주민번호 앞자리가 잘못되었습니다.");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 주민번호입력 후필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputJumin2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputJumin2 = function (){
	var argElmt = util.inputJumin2.arguments;
	var arglen 	= argElmt.length;

	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","7");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !util.isJuminno($inpObj.val(), "2")){
				util.inputEventChk($inpObj,"주민번호 뒷자리가 잘못되었습니다.");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 주민번호입력 후필드에대한 함수 사망보장 보험같은 경우 주민등록번호 6자리만 입력받습니다
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputJumin2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputJumin2_6 = function (){
	var argElmt = util.inputJumin2_6.arguments;
	var arglen 	= argElmt.length;

	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","6");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			//var $inpObj = $(this);

		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 보안카드 입력에대한 체크함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputSecCard("areaId01", "areaId02", "areaId03", ... );
 */
util.inputSecCard = function (){
	var argElmt = util.inputSecCard.arguments;
	var arglen 	= argElmt.length;

	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","2");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(!util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isSecCard($inpObj.val())){
				util.inputEventChk($inpObj,"보안카드번호가 잘못되었습니다.");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 카드번호 입력에대한 체크함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputCardNum("areaId01", "areaId02", "areaId03", ... );
 */
util.inputCardNum = function (){
	var argElmt = util.inputCardNum.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !util.isCrdCard($inpObj.val(),"1")){
				util.inputEventChk($inpObj,"카드 비밀번호가 잘못되었습니다.");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 금액필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputAmt("areaId01", "areaId02", "areaId03", ... );
 */
util.inputAmt = function (){
	var argElmt = util.inputAmt.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		util.inputAmtArea(argElmt[i]);
	}
};


/**
 * 금액필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputAmt("areaId01", {});
 */
util.inputAmtArea = function (areaId, option){
	var numMax = 12;
	var commaMax = 15;
	if(typeof option == "object"){
		if(option.maxlength != undefined && !isNaN(option.maxlength)){
			numMax = Number(option.maxlength);
			commaMax = parseInt(numMax + ((numMax - 1)/3), 10);
		}	
	}

	var $idArea = $("#"+areaId);
	$idArea.attr("maxlength",commaMax);
	$idArea.css("text-align","right");
	$idArea.unbind('focusout').unbind('keydown').unbind('keyup').bind("focusout",function(e){
		var $inpObj = $(this);
		var inpAmt = $inpObj.val().replace(/[^0-9]/g,'');
		if(inpAmt.length > numMax){
			util.inputEventChk($inpObj,"금액은 최대 " + numMax + "자리까지 입력가능합니다.");
			inpAmt = inpAmt.substring(0,numMax);
		}
		if(inpAmt != ""){
			$inpObj.val(util.setCommas(Number(inpAmt)));
		}
	}).bind("keydown",function(e){
		/*
		 * var $inpObj = $(this); var initFlag = false; if($inpObj.val() == ""){
		 * initFlag = true; }
		 */
		return util.keyCodeNumChk(e, false);
	}).bind("keyup",function(e){
		var key = 0;
		if (window.event) key = window.event.keyCode; 
		else if (e) key = e.which;
		
		if(key != 37 && key != 39){// 방향키 예외처리
			var $inpObj = $(this);
			util.inputNumChk($inpObj,{"msg":true,"type":"amt"});
		}
	});

};

/**
 * 숫자필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputNum("areaId01", "areaId02", "areaId03", ... );
 */
util.inputNum = function (){
	var argElmt = util.inputNum.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		util.inputNumArea(argElmt[i]);
	}
};

/**
 * 숫자필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputNum("areaId01", {});
 */
util.inputNumArea = function (areaId, option){
	var numMax = 12;
	if(typeof option == "object"){
		if(option.maxlength != undefined && !isNaN(option.maxlength)){
			numMax = Number(option.maxlength);
		}	
	}
	
	var $idArea = $("#"+areaId);
	//$idArea.attr("maxlength",numMax);
	// 2015-02-13 숫자는 기본적으로 왼쪽에서 부터 입력되도록 수정
	//$idArea.css("text-align","right");
	$idArea.unbind('focusout').unbind('keydown').unbind('keyup').bind("focusout",function(e){
		var $inpObj = $(this);
		if(isNaN($inpObj.val())){
			util.inputEventChk($inpObj,"올바른 숫자가 아닙니다.");
		}
		else if($inpObj.val().length > numMax){
			// util.inputEventChk($inpObj,"숫자는 최대 " + numMax + "자리까지 입력가능합니다.");
		}else{
			// $inpObj.val(util.Number($inpObj.val()));
			
		}
	}).bind("keydown",function(e){
		return util.keyCodeNumChk(e, true);
	}).bind("keyup",function(e){
		var key = 0;
		if (window.event) key = window.event.keyCode; 
		else if (e) key = e.which;

		if(key != 37 && key != 39){// 방향키 예외처리
			var $inpObj = $(this);
			util.inputNumChk($inpObj,{"msg":true,"type":"float"});
		}
	});

};

/**
 * 이메일 전체 필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEmail("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEmail = function (){
	var argElmt = util.inputEmail.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","30");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !validate.isEmail($inpObj.val())){
				util.inputEventChk($inpObj,"잘못된 이메일 주소입니다.");
			}
			else if($inpObj.val().length > 30){
				util.inputEventChk($inpObj,"이메일의 최대 입력값은 30자입니다.");
			}
		});
	}
};

/**
 * 이메일 앞자리 필드에대한 함수
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEmail1("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEmail1 = function (){
	var argElmt = util.inputEmail1.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","30");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !validate.isEmail($inpObj.val(),"1")){
				util.inputEventChk($inpObj,"잘못된 이메일 주소입니다.");
			}
			else if($inpObj.val().length > 30){
				util.inputEventChk($inpObj,"이메일의 최대 입력값은 30자입니다.");
			}
		});
	}
};

/**
 * 이메일 뒷자리 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEmail2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEmail2 = function (){
	var argElmt = util.inputEmail2.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","30");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !validate.isEmail($inpObj.val(),"2")){
				util.inputEventChk($inpObj,"잘못된 이메일 주소입니다.");
			}
			else if($inpObj.val().length > 30){
				util.inputEventChk($inpObj,"이메일의 최대 입력값은 30자입니다.");
			}else if($inpObj.val().toLowerCase().indexOf("yahoo.co.kr") != -1){
				util.inputEventChk($inpObj,"정확한 메일 전송을 위해 yahoo.co.kr도메인 계정은 사용하실 수 없습니다.");
			}
		});
	}
};

/**
 * 이메일 뒷자리 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputEmail2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputEmail3 = function (){
	var argElmt = util.inputEmail3.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","30");
		$idArea.unbind('focusout').bind("focusout",function(e){
			var $inpObj = $(this);
			if($inpObj.val()!="" && !validate.isEmail($inpObj.val(),"2")){
				message.alert('VLD013');
				$inpObj.val("");
				$inpObj.focus();
			}
			else if($inpObj.val().length > 30){
				message.alert('VLD031');
				$inpObj.val("");
				$inpObj.focus();
			}
		});
	}
};

/**
 * 팩스번호 지역번호 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputFax1 = function (){
	var argElmt = util.inputFax1.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"1")){
				util.inputEventChk($inpObj,"팩스번호 지역번호를 확인해주세요");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 팩스번호 중간자리 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputFax2 = function (){
	var argElmt = util.inputFax2.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"2")){
				util.inputEventChk($inpObj,"팩스번호 앞자리를 확인해주세요");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 팩스번호 뒷자리 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputFax3 = function (){
	var argElmt = util.inputFax3.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"3")){
				util.inputEventChk($inpObj,"팩스번호 뒷자리를 확인해주세요");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};


/**
 * 전화번호 첫번째 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel1("areaId01", "areaId02", "areaId03", ... );
 */
util.inputTel1 = function (){
	var argElmt = util.inputTel1.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","3");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"1")){
				util.inputEventChk($inpObj,"전화번호 국번이 잘못입력되었습니다.");
				$inpObj.val("");
//				$("#"+argElmt[i]).val("");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 전화번호 가운데 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputTel2 = function (){
	var argElmt = util.inputTel2.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"2")){
				util.inputEventChk($inpObj,"전화번호 중간자리가 잘못입력되었습니다.");
				$inpObj.val("");
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 전화번호 마지막 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel3("areaId01", "areaId02", "areaId03", ... );
 */
util.inputTel3 = function (){
	var argElmt = util.inputTel3.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","4");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !util.isTelno($inpObj.val(),"3")){
				util.inputEventChk($inpObj,"전화번호 마지막자리가 잘못 입력되었습니다.");
				$inpObj.val("");
				
			}
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * 전화번호 국번제외 필드에대한 함수 (직접입력)
 * 
 * @param input영역에
 *            대한 id
 * @ex) util.inputTel2("areaId01", "areaId02", "areaId03", ... );
 */
util.inputTel2and3 = function (){
	var argElmt = util.inputTel2and3.arguments;
	var arglen 	= argElmt.length;
	
	for(var i=0; i<arglen; i++){
		var $idArea = $("#"+argElmt[i]);
		$idArea.attr("maxlength","8");
		$idArea.unbind('focusout').unbind('keydown').bind("focusout",function(e){
			var $inpObj = $(this);
			/*
			 * if(util.inputNumChk($inpObj,{"msg":true, "evt":e})){
			 * util.inputEventChk($inpObj); } else
			 */if($inpObj.val()!="" && !validate.isHpno2and3($inpObj.val())){
				 util.inputEventChk($inpObj,"전화번호가 잘못입력되었습니다.");
				 $inpObj.val("");
			 }
		}).bind("keydown",function(e){
			return util.keyCodeNumChk(e, false);
		});
	}
};

/**
 * Function : 숫자 Check 이벤트
 * 
 * @param option
 *            ├─type : 입력숫자타입 ├─evt : 이벤트 처리시 ├─rep : 잘못된값 치환 └─msg : 입력체크시 메시지
 *            알림 설정 Note : 입력한 데이터의 숫자유효성 체크
 */
util.inputNumChk = function ($inpObject, option) {
	var chkFlag = true;
	var inpText = $inpObject.val() + '';
	var chkPattern = '';
	var replacePattern = '';
	
	if(typeof option != "object")	option 			= {};
	if(undefined==option.type)		option.type 	= "natural";
	if(undefined==option.rep)		option.rep 		= true;
	if(undefined==option.msg)		option.msg 		= false;
	
	/*
	 * if(option.evt != undefined){ return util.keyCodeNumChk(option.evt,
	 * chkFlag); //return chkFlag; }
	 */
	// 자연수
	if("natural" == option.type){
		chkPattern		= /[^0-9]/;
		replacePattern	= /[^0-9]/g;
	}
	// 금액
	else if("amt" == option.type){
		chkPattern		= /[^0-9,]/;
		replacePattern	= /[^0-9]/g;
	}
	// 정수
	else if("integer" == option.type){
		chkPattern		=  /^[+-]?\d*$/;
		// replacePattern = /[^0-9]/g;
	}
	// 실수
	else if("float" == option.type){
		// chkPattern = /^[+-]?\d+(\.?\d+)*$/;
		chkPattern		= /[^0-9\.\-]/;
		replacePattern	= /[^0-9\.\-]/g;
		// replacePattern = /[^0-9\-\.]/g;
	}


	if(chkPattern.test(inpText)){
		if(true == option.msg && utilChkInputAlertFlag){
			utilChkInputAlertFlag = false;
			message.alert('VLD010');
			utilChkInputAlertFlag = true;
		}
		chkFlag = false;
	}
	if(chkFlag&&option.rep){
		inpText = inpText.replace(replacePattern,'');
		// 자연수
		if("natural" == option.type){
		}
		// 금액
		else if("amt" == option.type){
			inpText = util.setCommas(inpText);
		}
		// 정수
		else if("integer" == option.type){
		}
		// 실수
		else if("float" == option.type){
		}
		$inpObject.val(inpText);
		return chkFlag;
	}
	
	// 자연수
	if("natural" == option.type){
	}
	// 금액
	else if("amt" == option.type){
		inpText = inpText.replace(replacePattern,'');
		inpText = util.setCommas(inpText);
		$inpObject.val(inpText);
	}
	// 정수
	else if("integer" == option.type){
	}
	// 실수
	else if("float" == option.type){
	}

	return chkFlag;
};

/**
 * 숫자만 입력 처리 ex) $("#id").bind("keydown",function(event){ return
 * util.inputNumChk(event, false); });
 */
util.keyCodeNumChk = function (e, decimal, initFlag) {
 
   var key;
   var keychar;
   if (window.event) {  // 익스와 파폭 체크 !
       key = window.event.keyCode;
   } else if (e) {
       key = e.which;
   } else {
       return true;
   }
   keychar = String.fromCharCode(key);
   if(initFlag && (key == 48 || key == 96)){
	   return false;
   }
   else if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 13) || (key == 27) || (key == 37) || (key == 39) || key == 46) {// 괄호
       return true;
   } 
   else if(96 <= key && key <= 105) {// Num Key pad
  	 return true;
   }
   else if ((("0123456789").indexOf(keychar) > -1)) {// 키보드 자판 숫자. 단 특수문자도 같은
														// 키캐릭터라 입력됨
       return true;
   } 
   else if (decimal && (key == 109 || key == 189 ||key == 110 || key == 190)) {// -
																				// .입력
       return true;
   } 
   else
       return false;
};
//입력체크 알림 플래그. 중복 알림 방지용
var utilChkInputAlertFlag = true;
/**
 * Function : 한글영문 Check 이벤트
 * 
 * @param option
 *            ├─symbol : 특수문자입력 ├─num : 숫자입력 ├─rep : 잘못된값 치환 └─msg : 입력체크시 메시지
 *            알림 설정 Note : 입력한 데이터의 한글및영문유효성 체크
 */
util.inputKorEngChk = function ($inpObject, option) {
	var chkFlag = true;
	var inpText = $inpObject.val() + '';

	if(typeof option != "object")	option 			= {};
	if(undefined==option.symbol)	option.symbol 	= false;
	if(undefined==option.num)		option.num 		= false;
	if(undefined==option.rep)		option.rep 		= true;
	if(undefined==option.msg)		option.msg 		= false;
	if(undefined==option.space)		option.space 	= false;
	
	// 천지인 키패드로 인해 [ᆞ] 추가
	var chkPatternStr		= "ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Zᆞ";
	
	if( option.num == true)		chkPatternStr += "0-9";
	if( option.symbol == true)	chkPatternStr += "!@#$%^&?*\\\-_+=`~()\"';:,.|<>{}\\\/";
	if( option.space == true)	chkPatternStr += "\\\s";
	
	chkPatternStr = "[^" + chkPatternStr + "]";
	
	var chkPattern = new RegExp(chkPatternStr,['']);
	var replacePattern = new RegExp(chkPatternStr,['g']);


	if(chkPattern.test(inpText)){
		if(true == option.msg && utilChkInputAlertFlag){
			utilChkInputAlertFlag = false;
			message.alert('VLD030');
			utilChkInputAlertFlag = true;
		}
		if(true == option.rep){
			inpText = inpText.replace(replacePattern,'');
		}
		chkFlag = false;
	}
	$inpObject.val(inpText);
	return chkFlag;
};

/**
 * Function : 한글 Check 이벤트
 * 
 * @param option
 *            ├─symbol : 특수문자입력 ├─num : 숫자입력 ├─rep : 잘못된값 치환 └─msg : 입력체크시 메시지
 *            알림 설정 Note : 입력한 데이터의 한글유효성 체크
 */
util.inputKorChk = function ($inpObject, option) {
	var chkFlag = true;
	var inpText = $inpObject.val() + '';
	var chkPattern;
	var replacePattern;
	
	if(typeof option != "object")	option 			= {};
	if(undefined==option.symbol)	option.symbol 	= false;
	if(undefined==option.num)		option.num 		= false;
	if(undefined==option.rep)		option.rep 		= true;
	if(undefined==option.msg)		option.msg 		= false;
	
	// 천지인 키패드로 인해 [ᆞ] 추가
	var chkPatternStr		= "ㄱ-ㅎㅏ-ㅣ가-힣ᆞ";
	
	if( option.num == true)		chkPatternStr += "0-9";
	if( option.symbol == true)	chkPatternStr += "!@#$%^&?*\\\-_+=`~()\"';:,.|<>{}\\\/";
	if( option.space == true)	chkPatternStr += "\\\s";
	
	chkPatternStr = "[^" + chkPatternStr + "]";
	
	chkPattern = new RegExp(chkPatternStr,['']);
	replacePattern = new RegExp(chkPatternStr,['g']);
	

	if(chkPattern.test(inpText)){
		if(true == option.msg && utilChkInputAlertFlag){
			utilChkInputAlertFlag = false;
			message.alert('VLD011');
			utilChkInputAlertFlag = true;
		}
		if(true == option.rep){
			inpText = inpText.replace(replacePattern,'');
		}
		chkFlag = false;
	}
	$inpObject.val(inpText);
	return chkFlag;
};

/**
 * Function : 영문 Check 이벤트
 * 
 * @param option
 *            ├─symbol : 특수문자입력 ├─num : 숫자입력 ├─rep : 잘못된값 치환 └─msg : 입력체크시 메시지
 *            알림 설정 Note : 입력한 데이터의 영문유효성 체크
 */
util.inputEngChk = function ($inpObject, option) {
	var chkFlag = true;
	var inpText = $inpObject.val() + '';
	var chkPattern = '';
	var replacePattern = '';
	
	if(typeof option != "object")	option 			= {};
	if(undefined==option.symbol)	option.symbol 	= false;
	if(undefined==option.num)		option.num 		= false;
	if(undefined==option.rep)		option.rep 		= true;
	if(undefined==option.msg)		option.msg 		= false;
	if(undefined==option.space)		option.space 	= false;
	
	var chkPatternStr		= "a-zA-Z";
	
	if( option.num == true)		chkPatternStr += "0-9";
	if( option.symbol == true)	chkPatternStr += "!@#$%^&?*\\\-_+=`~()\"';:,.|<>{}\\\/";
	if( option.space == true)	chkPatternStr += "\\\s";
	
	chkPatternStr = "[^" + chkPatternStr + "]";
	
	chkPattern = new RegExp(chkPatternStr,['']);
	replacePattern = new RegExp(chkPatternStr,['g']);
	
	if(chkPattern.test(inpText)){
		if(true == option.msg && utilChkInputAlertFlag){
			utilChkInputAlertFlag = false;
			message.alert('VLD012');
			utilChkInputAlertFlag = true;
		}
		if(true == option.rep){
			inpText = inpText.replace(replacePattern,'');
		}
		chkFlag = false;
	}
	$inpObject.val(inpText);
	return chkFlag;
};
/**
 * 주민번호 유효성 체크 (가벼운 유효성) 각 자리수에 들어갈 수 있는 숫자만 체크하여 결과를 반환합니다.
 * 
 * @param juminno
 */
util.isJuminno = function (juminno, position) {
	// 주민번호 유효성 체크
	var regExp = new RegExp();
	if(undefined == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-8][0-9]{6}$/; 
	else if("-" == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/; 
	else if("1" == position)	regExp =  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/; 
	else if("2" == position)	regExp =  /^[1-8][0-9]{6}$/;

	if(!regExp.test(juminno)){
		return false;
	}
	return true;
};

/**
 * 신용카드번호 유효성 체크
 * 
 * @param cardNo
 */
util.isCrdCard = function (cardNo, position) {
	var regExp = /^([0-9]{2})$/;
	if(undefined == position)	regExp = /^([0-9]{16})$/;
	else if("-" == position)	regExp = /^(([0-9]{4})-([0-9]{4})-([0-9]{4})-([0-9]{4}))$/;
	else if("1" == position)	regExp = /^([0-9]{4})$/;
	if(!regExp.test(cardNo)){
		return false;
	}
	return true;
};

/**
 * 숫자의 3자리 자릿수 컴마 표시를 한다.(소수형도 같이 사용 가능) 입력된 값이 null, undefined, 빈스트링일 경우 대체
 * 텍스트를 표시할 수 있다.
 * 
 * @param strNum -
 *            String - 숫자형 문자열
 * @param strReText -
 *            String - 입력된 숫자형 문자열이 null, undefined일경우 대체 텍스트 미입력시 빈스트링 리턴
 * @returns
 */
util.setCommas = function (strNum, strReText) {
	var bCheck = true;
	
	// 입력된 문자열이 숫자와 '.'으로만 이루어져 있는가? 빈스트링은 문자로 본다.
	if (util.isFloat(strNum) == false){
		bCheck = false;
	}
	
	if (bCheck){
		// strNum = String(Number(strNum));//13-
		strNum = strNum + "";
		var strfirstNum = strNum.split(".")[0];
		var strBackNum = "";

		if (strNum.split(".").length != 1){
			strBackNum = "." + strNum.split(".")[1];
		}
		
		var re = /,|\s+/g;
		strfirstNum = strfirstNum.replace(re, "");

	    re = /(-?\d+)(\d{3})/;
	    while (re.test(strfirstNum)) {
	    	strfirstNum = strfirstNum.replace(re, "$1,$2");
	    }
	    
	    return strfirstNum + strBackNum;
	} else {
		if (util.chkReturn(strReText, "s") == ""){
			return "";
		} else {
			return strReText;
		}
	}
};

/**
 * 입력된 문자열이 숫자와 '.'으로만 이루어져 있는가? 빈스트링은 문자로 본다.
 * 
 * @param strNum
 * @returns {Boolean}
 */
util.isFloat = function (strNum) {
	// null, undefined, 빈스트링 체크
	if (util.chkReturn(strNum, "s") == ""){
		return false;
	}
	
	var cnt = 0;
	strNum = strNum + "";
	
	for (var i = 0; i < strNum.length; i++) {
		// Check that current character is number.
		var c = strNum.charAt(i);

		if (!util.isDigit(c)) {
			return true;
			if (c == "."){
				if (cnt > 1){return false;}
				else {cnt++;}
			} else {
				return false;
			}
		}
	}

	return true;
};

/**
 * 입력된 data가 null, undefined 인지 체크 판단하여 key 값에 따른 값을 리턴한다.
 * 
 * @param data
 *            체크할 data
 * @param strReKey
 *            입력안할 경우 : 정상일경우 true, 비정상일 경우 false b : 정상일 경우 true, 비정상일 경우 false
 *            s : 정상일 경우 입력된 data 반환, 비정상일 경우 빈스트링 반환 n : 정상일 경우 입력된 data 반환,
 *            비정상일 경우 0 반환
 * @param returnData
 *            비정상일경우 리턴할 data
 * @param rePlusEnd -
 *            String - 접미어 설정 strReKey 값이 "s"일경우 입력된 값이 정상일 경우 접미어를 붙여서 리턴
 *            비정상이거나 빈스트링일 경우 returnData 값을 리턴
 */
util.chkReturn = function (data, strReKey, returnData, rePlusEnd) {
	
	var strType = jQuery.type(data);
	var bCheck = true;
	var bReturnData = true;
	var bRePlusEnd = false;
	var strRePlusEnd = "";
	
	if (strType == "null" || strType == "undefined") {
			bCheck = false;
	}
	
	if (jQuery.type(returnData) == "null" || jQuery.type(returnData) == "undefined"){
		bReturnData = false;
	}
	
	strType = jQuery.type(strReKey);
	
	if (strType == "null" || strType == "undefined" || strReKey == "b" || strReKey == "") {
		return bCheck;
	}
	
	if (rePlusEnd != null && rePlusEnd != undefined) {
		bRePlusEnd = true;
		strRePlusEnd = rePlusEnd;
	}
	
	if (bCheck == true) {
		if (strReKey == "s"){
			if (bRePlusEnd == true && data == ""){
				return returnData;
			} else if (bRePlusEnd == true){
				return data + strRePlusEnd;
			} else {
				if (data == "" && bReturnData == true){
					return returnData;
				} else {
					return data + "";
				}
				
			}
		} else {
			return data;
		}
	} else {
		if (strReKey == "s") {
			if (bReturnData){
				return returnData;
			} else {
				return "";
			}
		} else if (strReKey == "n") {
			if (bReturnData){
				return returnData;
			} else {
				return 0;
			}
		}
	}
	
	return bCheck;
};

/**
 * 입력된 문자열이 숫자로 이루어져 있는가? 빈스트링은 문자로 본다.
 * 
 * @returns {Boolean}
 */
util.isDigit = function (strNum) {
	// null, undefined, 빈스트링 체크
	if (util.chkReturn(strNum, "s") == ""){
		return false;
	}
	
	var len = strNum.length;
	var c;
	
	for (var i = 0; i < len; i++) {
		c = strNum.charAt(i);
		if ((i == 0 && c == '-') || (c >= '0' && c <= '9')){
			;
		} else{
			return false;
		}
	}
	
	return true;
};

/**
 * 전화번호 유효성 체크
 * 
 * @param telno
 *            숫자 2~4자리 0으로시작 + "-" + 숫자3~4자리 + "-" + 숫자4자리
 */
util.isTelno = function (telno, position) {
	// 전화번호 유효성 체크
	var regExp = new RegExp();
	if(undefined == position)	regExp =  /^(0([0-9]{1,3})([0-9]{3,4})([0-9]{4}))$/; 
	else if("-" == position)	regExp =  /^(0([0-9]{1,3})-([0-9]{3,4})-([0-9]{4}))$/;  
	else if("1" == position)	regExp =  /^(0([0-9]{1,3}))$/; 
	else if("2" == position)	regExp =  /^([0-9]{3,4})$/; 
	else if("3" == position)	regExp =  /^([0-9]{4})$/;
	else if("4" == position)	regExp =  /^([0-9]{2,3})$/;
	
	if(!regExp.test(telno)){
		return false;
	}
	return true;
};

/**
 * 날짜 유효성 체크. 입력날짜가 현재 또는 입력된 기준일보다 후일일 경우 false 기준일 또는 이전일 경우 true반환
 * 
 * @param chkDate
 * @param stdDate
 * @returns {Boolean}
 */
util.isValidDate = function (chkDate, stdDate) {
	if(util.chkReturn(stdDate,"s")==""){
		stdDate = util.getDate();
	}
	stdDate = stdDate.replace(/[^0-9]/g,"");
	chkDate = chkDate.replace(/[^0-9]/g,"");
	if(util.isDate(chkDate) && stdDate >= chkDate ){
		return true;
	}
	return false;
};

/**
 * 입력영역의 이벤트를 체크하는 함수
 * 
 * @param $inpObj
 * @param msg
 */
util.inputEventChk = function ($inpObj, msg){
	if(typeof(msg) == "string"){
		logger.alert(msg); 
	}
	//if($inpObj.attr("type") == "password"){
		$inpObj.val('');
	// }
	$inpObj.focus();
};

