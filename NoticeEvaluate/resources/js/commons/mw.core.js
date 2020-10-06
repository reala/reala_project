/* ============================================================================
 * LIFEPLANET Mobile Web Marketing System
 * 
 * Copyright ⓒ KYOBO LIFEPLANET INSURANCE COMPANY All Rights Reserved.
 * ============================================================================
 * AUTHOR      : 권대준, djkwon@kico.co.kr
 * FILE INFO   : mw.core.js, /resources/js/
 * DESCRIPTION : 페이지 전역에서 사용되는 main 함수 집합
 * ============================================================================
 * Revision History
 * Author   Date            Description
 * ------   ----------      ---------------------------------------------------
 * 권대준  	2014-11-20		initial version
 * ========================================================================== */

// test description

/**
 * 어플리케이션의 경우에만 mxp.js를 로딩 한다.
 * 이외의 상황에서 mxp.js가 로딩되는 경우, mxp.js자체에서 재정의 하는 html모듈이 있기 때문에, 정상적으로
 * 작동하지 않는 오류가 발생하였다.(LG CNS 답변)
 */
MXP_PLUGIN.getAccessPath();

/**
 * mxp.js가 정상적으로 로드 된 이후 실행 되는 소스
 */
function onDeviceReady() {
	
	/**
	 * 모바일 웹 / 앱 / 판단 필요
	 * 
	 * 1. APP / preview 판단
	 * 
	 * 2.1 APP (기기+버전 획득 가능)
	 * 	> ios ( APP_IOS)
	 *  > android (APP_ANDROID)
	 *  
	 * 2.2 PREVIEW (OS 획득 가능)
	 *  > iphone (WEB_IOS)
	 *  > android (WEB_ANDROID)
	 *  > window (WEB_PC)
	 *  
	 */
	
	/**
	 * 1. 접속 정보 셋팅
	 */
	MXP_PLUGIN_CONST.setConfiguration(MXP_PLUGIN.getOSInfo().name);
	
	/**
	 * 2. 버전 체크
	 */
	MXP_PLUGIN.checkUpdateNative();
	
	/**
	 * 3. 보안 모듈 호출
	 */
	if(MXP_PLUGIN.getOSInfo().name.indexOf('APP') > -1 && !sessionStorage.getItem('isSecurityRun')) {
		
		MXP_PLUGIN.securityRun(function(data) {
			
			// 성공
			if(data.statusMsg =="fail"){
				navigator.notification.alert(data.errorMsg, function(number){
					if(number == 0){
						device.exitApp();
					}
				}, "알림", "확인");
			} else {
				sessionStorage.setItem('isSecurityRun', true);
				
				/**
				 * 4. Ace Counter 웹로그 적재
				 */
				MXP_PLUGIN.webLogRun();
				
				/**
				 * 5. Push 사용자 등록
				 */
				if(sessionStorage.getItem('alreadyRegist') != true){
					MXP_PLUGIN.pushLoginRun(function(){
						sessionStorage.setItem('alreadyRegist', true);
					}, function() {
						
					});
				}
	
			}
			
		}, function(data) {
			// 실패
			message.alert('COM105');
			device.exitApp();
		});
		
	} else {
	  /**
		 * 4. Ace Counter 웹로그 적재
		 */
		MXP_PLUGIN.webLogRun();
	}

	// iOS의 경우 디바이스 back 버튼이 없기 때문에 화면상 back 버튼을 추가한다. 
	if(MXP_PLUGIN.getOSInfo().name == MXP_PLUGIN_CONST.ACCESS_PATH.APP_IOS){
		$('#iosBackBtn').show();
	}
	
}

/******************************************************************************
 *  [화면 onLoad시 jQuery Ready 부분]										  
 *  - js가 화면에 로딩되는 경우 해당 부분에서부터 로직이 시작된다.
 *****************************************************************************/
$(document).ready(function() {
	
	logger.log('[READY] Now Use jQuery --------------------------------------');
	
	// 로딩 유틸 실행
	preloader = new GSPreloader();
	Main.onLoading();
	
	/**
	 * [[[앱 구동과 동시에 체크 되는 영역]]]
	 * 1. V3 (android WEB, APP 구분하여 동작)
	 * - 앱 구동시 V3 설치여부 / 동작여부체크
	 */  
	MXP_PLUGIN_CONST.setConfiguration(MXP_PLUGIN.getOSInfo().name);

	if (MXP_PLUGIN.getOSInfo().name == MXP_PLUGIN_CONST.ACCESS_PATH.WEB_ANDROID && navigator.userAgent.indexOf('MXP') < 0) {
		var v3IframeStr = '<iframe src="/commons/3rd-party/v3vaccine/sandbox.html" id="sandbox" sandbox="allow-scripts" frameborder="0" style="width:0px; height:0px;" onload="{try {MXP_PLUGIN.v3forWEB.fnRunSecureApp();} catch(e){}}"></iframe>';
		$('body').append(v3IframeStr);
	} 
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// COSEM 유입 스크립트
	webLog.runCosemInflow();
	// AceCounter 호출
	webLog.runAceCounterWEB();
	// Criteo 호출
	webLog.runCriteo();
	// GA 호출
	webLog.runGA();
	// GA 셋팅
	webLog.setGA();
	
	// 초기화 이벤트 호출
	Main.readyEvent();
	
	/**
	 * 에러 발생시 에러 처리기 등록
	 */
	window.onerror = function ( msg, url, lines )
	{
	    logger.log('>>> Catch Error Log Start >>>');

	    logger.log('* message : ' + msg);
	    logger.log('* path    : ' + url);
	    logger.log('* line    : ' + lines);
	    
	    logger.log('<<< Catch Error Log END <<<');
	};
	
	Main.onDisableBack();
	
	window.onpopstate = function(D) {
		if (D) {
			if (!D.state) {
				// _public.closePopup(option.id);
				$('.b-close' ).trigger('click');
			} 
		}
	};
});

/**
 * Config에 등록된 환경변수 취득
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var environment = (function() {
    var _public = {};
    
    /**
     * 환경변수 Named으로 값 취득
     * @param envName
     * @returns
     */
    _public.getEnv = function(envName) {
    	
    	return config[envName];
    	
    };
    
    /**
     * 브라우저 정보 취득
     */
    _public.getBrowserInfo = function() {
		
		// Chrome >> Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36
		// IE	  >> Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)
		
		var userAgent = navigator.userAgent;
		var returnInfo = '';
		
		if (userAgent.indexOf('MSIE') > -1) {
			returnInfo = 'IE';
		} else if (userAgent.indexOf('Chrome') > -1) {
			returnInfo = 'CHROME';
		} 
		
		return returnInfo;
		
	};
    
    return _public;
})();


/**
 * 페이지전역에서 사용되는 공통함수
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var Main = (function() {
	var _public = {};
	
	/**
	 * Form 객체를 Object 형태로 변환해주는 함수 구현
	 * NOTE : Form 의 Name Attribute를 Key로 사용하기 때문에 Name을 반드시 
	 * 		  입력해야 한다.
	 */
	(function($) {
	    $.fn.serializeObject = function() {

	        var self = this,
	            json = {},
	            push_counters = {},
	            patterns = {
	                'validate': /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
	                'key':      /[a-zA-Z0-9_]+|(?=\[\])/g,
	                'push':     /^$/,
	                'fixed':    /^\d+$/,
	                'named':    /^[a-zA-Z0-9_]+$/
	            };


	        this.build = function(base, key, value) {
	            base[key] = value;
	            return base;
	        };

	        this.push_counter = function(key) {
	            if (push_counters[key] === undefined) {
	                push_counters[key] = 0;
	            }
	            return push_counters[key]++;
	        };

	        $.each($(this).serializeArray(), function() {

	            // skip invalid keys
	            if ( ! patterns.validate.test(this.name)) {
	                return;
	            }

	            var k,
	                keys = this.name.match(patterns.key),
	                merge = this.value,
	                reverse_key = this.name;

	            while((k = keys.pop()) !== undefined) {

	                // adjust reverse_key
	                reverse_key = reverse_key.replace(new RegExp('\\[' + k + '\\]$'), '');

	                // push
	                if (k.match(patterns.push)) {
	                    merge = self.build([], self.push_counter(reverse_key), merge);
	                }

	                // fixed
	                else if (k.match(patterns.fixed)) {
	                    merge = self.build([], k, merge);
	                }

	                // named
	                else if (k.match(patterns.named)) {
	                    merge = self.build({}, k, merge);
	                }
	            }

	            json = $.extend(true, json, merge);
	        });

	        return json;
	    };
	})(jQuery);
	
	/**
	 * [Push메세지 수신 함수]
	 * push메세지를 확인하는 경우 native단에서 해당 함수를 호출한다.
	 * 호출된 이후 각 업무에 맞는 분기 처리를 진행한다.
	 * 
	 * @param jsonMessage
	 * @param psId
	 * @param message
	 */
	_public.recievePush = function(jsonMessage, psId, message) {
		
		console.debug(jsonMessage);
		console.debug(psId);
		console.debug(message);
		
	};
	
	_public.readyEvent = function (paramPath, param, popupId) {
		
		/***************************************************************************
		 * TODO - 2014/11/24 권대준
		 * 페이지 로딩시 JSP가 랜더링 된 후 jquery가 로딩되는 부분을 이용하여, jsp에 문자열
		 * 형태로 남아 있는 response 부분을 삭제 한다. 추후 보다 나은 방법을 찾는다면 개선
		 * 해야 할 부분 이다.
		 **************************************************************************/
		$('head script[id=resultOutDataArea]').remove(); // script영역 삭제
		
		/***************************************************************************
		 * INFO : 페이지 로딩시 호출된 페이지와 동일한 js를 로딩한다. 이로 인해 페이지별로 
		 * 		  js를 include하는 수고를 덜 수 있다.  
		 **************************************************************************/
		
		var path = '';

		if(util.isNull(paramPath)) {
			path = globalVar.getParam('_CUR_URI').split('.')[0];
		} else {
			// path = paramPath.replace('.dev', '');
			path = paramPath.split('.')[0];
		}
		
		var jsPath	= '';
		var pathArr	= path.split('/');
		for ( var i = 1; i < pathArr.length; i++) {
			
			if (i == 1 && pathArr[i] != 'views' && $.inArray('error', pathArr) < 0) {
				// 에러 페이지가 아닌경우 앞자리가 view가 아닌경우 생성한다.
				jsPath += '/views/'+pathArr[i];
			} else if (i == pathArr.length-1) {
				// path arr의 마지막 자리 앞은 js path 를 추가 한다.
				jsPath += '/js/'+pathArr[i];
			} else {
				// 이외의 경우 url을 생성한다.
				jsPath += '/'+pathArr[i];
			}
			
		}
		jsPath = jsPath + '.js';
		
		PageUtil.loadJavascript(jsPath, param, popupId);
		
	};
	
	/**
	 * 공통 코드 취득 함수
	 * @param typeId
	 */
	_public.getCommonCode = function(typeId) {
		
		var commonCode = null;

		var xhr = new XMLHttpRequest();
		var url = location.protocol + "//" + location.host + 
				  "/common/cc/RetrieveCommonCode.ajax?" +
				  "typeId=" + typeId + "&tradeKey=" + constants.getVal('RETRIEVE');
		
		xhr.open("POST",url, false);
		xhr.send(null);
		
		commonCode = JSON.parse(xhr.responseText);
		
		if (util.isNull(commonCode)) {
			return new Array();
		} else {
			return commonCode.result.outData;
		}
		
	};
	
	/**
	 * 공통 함수 취득 후 Select box 셋팅
	 * @param typeId
	 * @param nodeId
	 */
	_public.drawSelBoxCommonCode = function (typeId, nodeId) {
		
		// 공통 코드 취득 함수 실행
		var codeDatas = Main.getCommonCode(typeId);
		
		if (codeDatas.length < 1) {
			message.alert('COM106');
			return;
		}
		
		var strHtml = '';
		for ( var i = 0; i < codeDatas.length; i++) {
			strHtml += '<option id="'+ codeDatas[i].cmnnCd +'">' + codeDatas[i].cmnnCdHanNm + '</option>';
		};
		
		strHtml = '<select>' + strHtml + '</select>';
		$('#' + nodeId).html(strHtml);
		
	};
	
	/**
	 * 로그아웃 로직
	 */
	_public.logout = function() {
		
		if(confirm(message.getMsg('COM011'))){
			location.href = '/common/cc/LogOut.dev';
		}
		return;
		
	};
	
	/**
	 * 청약단계 진행시 back 버튼 제어
	 * @param msg
	 */
	_public.onDisableBack = function(type){
		
		if(location.pathname.indexOf('MWPA010') > -1 || location.pathname.indexOf('MWPA100') > -1){

			$(window).unbind('beforeunload').bind('beforeunload', function(){
		    
		   		setTimeout(function() {
			        setTimeout(function() {
			        	Main.offLoading();
			        }, 100);
			    },1);
		        return '현재 청약단계 진행중 입니다. 지금 나가시면 정보는 저장되지 않습니다.'; 
		    });
		    
		}
		
	};
	
	/**
	 * 청약단계 종료 후 back 버튼 이벤트 재실행
	 */
	_public.offDisableBack = function(type){
		
		$(window).unbind('beforeunload');
		
	};
	
	/**
	 * 기본 로딩창을 생성한다.
	 */
	_public.onLoading = function(id){
		
		if (id) {
	        $('#' + id + ' .loading_img ').diagram({'width':8, 'dimension':160, 'gap':-15, "bgcolor":"#9eb1b7", "fgcolor":"#fcc900", "loop":true, "timenum":10});
	        $('#' + id + ' .loading_img ').diagram.start();
	        $('#' + id).show();
	        $('body').css('position', 'fixed');
	        
		} else {
			//$('#loadingArea').show();
			preloader.active(true);
		}
		
	};
	
	/**
	 * 기본 로딩창을 제거한다.
	 */
	_public.offLoading = function(id){
		
		if (id) {
			
			setTimeout(function(){
				$('body').css('position', 'static');
				$('#' + id).hide();
				$('#' + id + ' .loading_img ').diagram.stop();
			}, 3000);
			
		} else {
			//$('#loadingArea').hide();
			preloader.active(false);
		}
		
	};
	
	/**
	 * 전화걸기 함수
	 */
	_public.callDirect = function(num){
		
		Main.offDisableBack();

		var dialNum;
		
		if(num.indexOf('-') > 0) {
			
			dialNum = util.replaceAll( num, '-', '' );
			
		}else {
			dialNum = num;
		}
		
		if( dialNum.length == 11 || dialNum.length == 10 || dialNum.length == 8 ) {
			alert(dialNum)
			location.href = 'tel:' + dialNum;
			
		}else {
			message.alert('COM107');
			return;
		}
		
	};
	
	
	/**
	 * PDF 다운로드
	 */
	_public.pdfDownload = function(path, pdfName) {
		Main.offDisableBack();
		
		var origin = location.origin;
		var filePath = '/commons/slink/';
		var addPath = '';
		
		if (path == '0') {
			// 보험약관
			addPath = 'insuManual';
		}
		else if (path == '1') {
			// 상품설명서
			addPath = 'goodsManual';
		}
		else if (path == '2') {
			// 사업방법서
			addPath = 'busiManual';
		}
		else if (path == '3') {
			// 신청서류
			addPath = 'myApplyManual';
		}
		else if (path == '4') {
			// 공시
			addPath = 'managers/disclosure';
		}
		else if (path == '5') {
			// 공시 관리자 템플릿
			addPath = 'managers/templet';
		}
		else if (path == '6') {
			// 공지사항 첨부파일
			addPath = 'notifile';
		}
		else if (path == '61') {
			// 공지사항 첨부파일
			addPath = 'contact/notiImg';
		}
		else if (path == '7') {
			// 관리자(마음의 소리)
			addPath = 'contact/opin';
		}
		else if (path == '8') {
			// 개별약관 첨부파일
			addPath = 'etcManual';
		}
		else if (path == '9') {
			// 홍보자료
			addPath = 'pr';
		}
		else if (path == '12') {
			// 모바일웹 공지사항 첨부파일
			addPath = 'contact/mw_notiFile';
		}
		
		
		var realName = origin + filePath + addPath + '/' + pdfName;
		
		if (MXP_PLUGIN.getOSInfo().name.indexOf('IOS') > 0) {
			
			var param = {
					location : 'url',
					url : realName
			};
			PageUtil.openPopup(param);
			
		} else {
			location.href = realName;
		}
		
		
		
	};
	
	
	return _public;
})();

/**
 * 메세지 호출을 위한 함수
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var message = (function() {
	var _public = {};
	
	/**
	 * Message ID, Arguments 를 전달 받아서 공통 메세지를 리턴해주는 함수
	 * @param msgId
	 * @param args
	 * @returns {String}
	 */
	_public.getMsg = function(msgId, args) {
		
		
		// 인자값 validate
		if (arguments.length  < 1 || typeof msgId != 'string') {
			message.alert('COM009');
			return
		}
		
		var returnMsg = ''; // 리턴 메세지 정의
		if (arguments.length == 1 || util.isNull(args)) {

			// arguments가 존재 하지 않는 경우 : 단순 메세지 출력
			returnMsg = mwMessageDefine.getMsg(msgId);
			
		} 
		else {
			
			// arguments가 존재 하는 경우
			var tmpMsg = mwMessageDefine.getMsg(msgId);
			
			if(typeof args == 'string') {
				
				//인자값이 하나인 문자열인 경우
				tmpMsg = tmpMsg.replace('[@]', args);
			} else {
				
				//인자값이 여러개인 배열인 경우 (스크립트에서 예) message.alert('VLD007', ['100','200']) 형식으로 사용한다 )
				for ( var i = 0; i < args.length; i++) {
					tmpMsg = tmpMsg.replace('[@]', args[i]);
				}
			}
			returnMsg = tmpMsg;
		}
		
		return returnMsg;
		
	};
	
	/**
	 * Message ID, Arguments 를 전달 받아서 공통 메세지를 alert 하는 함수
	 * @param msgId
	 * @param args
	 */
	_public.alert = function(msgId, args) {
		
		var msg = message.getMsg(msgId, args);
		if ( ! util.isNull(msg)) {
			
			logger.alert(msg);
			return;
			
		} else {
			return;
		}
		
	};
	
	return _public;
})();

/**
 * 로그와 관련된 공통 함수. console.log의 관리를 위하여 반드시 아래 함수를 사용한다.
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var logger = (function() {
	var _public = {};
	
	_public.logEnabled = function() {
		return config.getEnv('loggerEnable');
	};
	
	_public.errorEnabled = function() {
		return config.getEnv('errorLoggerEnable');
	};
	
	/**
	 *  console.log 관리 함수
	 * @param obj
	 */
	_public.log = function(obj) {
		
		// IE의 경우 console 사용 불가
		if(environment.getBrowserInfo() !== 'IE' && logger.logEnabled()){
			console.log(obj);
		} else {
			
		}
	};

	/**
	 *  console.error 관리 함수
	 * @param obj
	 */
	_public.error = function(obj) {
		// IE의 경우 console 사용 불가
		if(environment.getBrowserInfo() !== 'IE' && logger.logEnabled()){
			console.error(obj);
		} else {
			
		}
	};
	
	/**
	 *  console.info 관리 함수
	 * @param obj
	 */
	_public.info = function(obj) {
		// IE의 경우 console 사용 불가
		if(environment.getBrowserInfo() !== 'IE' && logger.logEnabled()){
			console.info(obj);
		} else {
			
		}
	};
	
	/**
	 *  console.warn 관리 함수
	 * @param obj
	 */
	_public.warn = function(obj) {
		// IE의 경우 console 사용 불가
		if(environment.getBrowserInfo() !== 'IE' && logger.logEnabled()){
			console.warn(obj);
		} else {
			
		}
	};

	/**
	 *  alert 관리 함수
	 * @param obj
	 */
	_public.alert = function(obj) {
		alert(obj);
	};
	
	return _public;
})();

/**
 * 페이지전역에서 사용되는 공통함수
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var transaction = (function() {
	var _public = {};
	var _private = {
		
		GLOBAL_VAR : '',
		
		/**
		 * 거래를 실행하고 AJAX 거래처리 경우 성공여부에 따른 콜백을 호출해주고 결과를 반환해준다.
		 * 
		 * @param tranProp {Object} 거래처리속성
		 * @return {Object} AJAX 거래처리 경우에만 결과가 반환된다.
		 */
		execute : function(tranProp) {
			
			var makeUrl = tranProp.url + '.ajax';

			// ----------------------------------------------------------------
			// Parameter 전처리 셋팅
			// ----------------------------------------------------------------
			
			// 1. Trade Key 병합
			var concatParams = {'tradeKey' : tranProp.tradeKey};
			tranProp.params = util.concat(concatParams, typeof tranProp.params === 'object' ? tranProp.params : {});
			
			// 2. 파라메터에 폼요소들을 합친다.
			if (typeof tranProp.dataForm != 'undefined') {
				tranProp.params = util.concat(tranProp.params, tranProp.dataForm.serializeObject());
			}
			
			// 3. 거래 AJAX전송 전 출력
			if (logger.logEnabled()) {
				logger.log('mw.core.js in transaction.execute');
				logger.log('tranProp URL[' + tranProp.url+ '] params : ' + JSON.stringify(tranProp.params));
			}
			
			// 4. DATA 형식에 맞도록 수정
			tranProp.params = {
				JSON_DATA : JSON.stringify(tranProp.params)
			};
			
			/******************************************************************
			 * NOTE : data는 json 형태와 key,value 형태 두가지 모두 지원한다.
			 *        주의할 점은 두가지 형태를 섞어서 사용할 수는 없다.
			 * 		  MW에서는 json형태를 권장하고, 사용한다.
			 *        ex) {ver:'1.0', 'loginYn':'Y'} -> 가능
			 *            ver=1.0&loginYn=Y			 -> 가능
			 *            {ver:'1.0'}&loginYn=Y		 -> 불가능
			 ******************************************************************/
			
			// 4. 거래 시작
			var resData = jQuery.ajax({
				type    : tranProp.method ,
				url     : makeUrl,
				data    : tranProp.params,
				dataType: 'text',
				async   : tranProp.asyncFlag,
				success : function(data, resStatus) {
					
					Main.offLoading(tranProp.blockingId);
					Main.offDisableBack();	
					globalVar.setParam('nowTransaction', true);
					
					var resultData = '';
					try {
						
						try {
							resultData = JSON.parse(data);
						}
						catch(jsonError) {
							throw {
								name : 'JsonError', 
								message : '데이터 파싱을 실패하였습니다.', 
								cause : jsonError
							};
						}
					}
					catch(tError) {
						//응답 형식이 올바르지 않습니다
						resultData = JSON.parse(
								"{\"ERROR_CODE\":\"9999\",\"prcSts\":\"F\",\"ERROR_MSG\":\"" 
									+ tError.name + " : " + tError.message + "\"}");
						
						if (logger.errorEnabled()) {
							logger.error('basic.js in transaction.execute');
							logger.error(tError);
							logger.error(resultData);
						}
					}
					
					resultMessageFunc(resultData);
				},
				error : function(xhr, resStatus, err) {
					
					Main.offLoading(tranProp.blockingId);
					Main.offDisableBack();	
					globalVar.setParam('nowTransaction', true);
					
					xhr.abort();

					var recvTranData = JSON.parse(
							"{\"ERROR_CODE\":\"" + resStatus + "\"" + "\"ERROR_MSG\":\"서버와의 통신이 원활하지 않습니다.\"}");
					
					if (recvTranData.ERROR_CODE == 404) {
						recvTranData.ERROR_MSG = '서버에서 페이지를 찾을 수 없습니다.';
							recvTranData.ERROR_MSG += '\nURL이 올바른 확인하십시오!';
					}
					else {
						if (recvTranData.ERROR_CODE == 500) {
							recvTranData.ERROR_MSG = '네트워크 통신이 원활하지 않습니다.';
						}
						else {
							recvTranData.ERROR_MSG += '\n' + '9999';
						}
						
						recvTranData.ERROR_MSG += '\n' + '지속적인 문제발생시 시스템 관리자에게 문의하시기 바랍니다. ';
					}
					
					var returnObj = {
							result : {
								outData : recvTranData
							}
					};
					
					/**
					 * TODO: 404, 500 에러등에 대해서 처리 여부 결정 필요
					 * 		 현재는 alert으로 처리.
					 */
					resultMessageFunc(returnObj);
				}
			});   
			
			
			//성공 또는 실패에 대한 결과메시지를 작성하여, 콜백함수를 호출한다.
			var resultMessageFunc = function(recvTranData) {
				
				Main.onDisableBack();
				
				// Transaction 이후 iOS 키보드 Hide
				document.activeElement.blur();
				
				recvTranData = recvTranData.result;
				
				// 성공여부 판단
				var isSuccess = false; 
				var message = '';
				
				if(!util.isNull(recvTranData.outData)){
					
					if(util.isNull(recvTranData.outData.ERROR_CODE)){
						isSuccess = true;
					}
					
				}
				
				logger.log('[LOG] START [[ recvTranData ]] ===>');
				logger.log(recvTranData);
				logger.log('[LOG] END   [[ recvTranData ]] ===>');
				
				if (isSuccess) {
					
					if (tranProp.success) {
						tranProp.success(recvTranData, message);
					}
				}
				else {						
					
					message = recvTranData.outData.ERROR_MSG;
					
					if (tranProp.failure) {
						// Failure Callback 이 지정된 경우
						
						// Error 관련 정의된 코드/메세지 전달
						tranProp.failure(recvTranData, message);
						
					} else {
						// Failure Callback 이 지정되지 않은 경우
						
						logger.alert(message);
						
					}
				}
			};
		
		}, 
		
		/**
		 * 거래 처리가 성공할 경우 호출되어 지는 함수이다.
		 * 
		 * @param recvTranData {Object} 응답거래 데이터
		 */
		recvTranForSuccess : function(recvTranData) {
		},

		/**
		 * 거래 처리가 성공할 경우 호출되어 지는 함수이다.
		 * 
		 * @param recvTranData {Object} 응답거래 데이터
		 */
		recvTranForFailure : function(recvTranData) {
		}
			
	};
	
	/** 
	 * 거래공통 기본 오브젝트이다.
	 * 
	 * [선택] 거래방식 		 - ajaxFlag : true,
	 * [선택] 화면잠금여부 	 - blockingFlag : true or false,
	 * [필수] 거래주소 		 - url : undefined,
	 * [필수] 거래식별자	 - tradeKey : undefined,
	 * [선택] 비동기여부 	 - asyncFlag : true,
	 * [선택] 데이터파라메터 - params : '',
	 * [선택] 데이터폼 		 - dataForm : undefined,
	 * [선택] 성공처리콜백 	 - success : _private.recvTranForSuccess,
	 * [선택] 실패처리콜백 	 - failure : _private.recvTranForFailure
	 */
	_public.TRAN_COMM_PROP = {
		method      : 'POST',
		ajaxFlag 	: true,
		blockingFlag : true,
		url         : undefined,
		tradeKey    : undefined,
		asyncFlag   : true,
		params      : '',
		dataForm    : undefined,
		success     : _private.recvTranForSuccess,
		failure     : _private.recvTranForFailure,
		blockingId  : undefined
	};
	
	_public.callTran = function (tranProp) {
		try {
			
			//화면이 잠겨있지 않으면 화면을 잠근다.
			if (tranProp.blockingFlag) {
				Main.onLoading(tranProp.blockingId);
				globalVar.setParam('nowTransaction', false);
			}

			//비동기 거래처리을 요청한다.
			return _private.execute(tranProp);
		}
		catch(e) {
			// alert(e);
			(function(causeErr) {
				var thrown = {
					name : 'TransactionError', 
					message : '거래 처리를 실패하였습니다.', 
					cause : causeErr
				};
				
				if (logger.errorEnabled()) {
					logger.error('basic.js in transaction.callTran');
					logger.error(JSON.stringify(thrown));
				}
				
				throw thrown;
			}(e));
		}
	};
	
	_public.addReqTime = function(url) {

		// IOS에서 동일한 url request에 대해 캐싱을 하기에 url_time stamp를 이용하여 캐싱이 안되도록 방지.
		if (url.indexOf('jsp') < 0) {
			url = (url + "&url_time=" + new Date().getTime() + "");
		} else {
			if (url.indexOf('.jsp?') < 0) {
				url = (url + "?url_time=" + new Date().getTime() + "");
			} else {
				url = (url + "&url_time=" + new Date().getTime() + "");
			}
		}
		return url;
		
		
	};
	
	return _public;
})();

/**
 * Picker 관련 Wrapper 함수. 
 * KDIMW는 Mobiscroll의 Picker를 기본적으로 사용하며, 다양한 옵션 적용을 편리하게
 * 하도록 하기 위하여 수정 하였다. 
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var Picker = (function() {
	var _public = {};
	

	/**
	 * Array를 Picker.select 에 맞도록 수정한다.
	 * 
	 * @param inputArr
	 * @param key
	 * @param value
	 * @returns {Array}
	 */
	_public.makeTVArray = function(inputArr, key, value){
		var returnArray = [];
		
		
		for ( var i = 0; i < inputArr.length; i++) {
			var tempObj = {};
			tempObj.text = inputArr[i][key];
			tempObj.value = inputArr[i][value];
			
			returnArray.push(tempObj);
		}
		
		return returnArray;
	};
	
	/**
	 * MobiScroll을 사용한 select Picker.
	 * 선언된 DIV영역에 SELECT 박스를 자동 생성한 후 Picker 이벤트를 바인딩 한다.
	 * 
	 * [Option Attribute]
	 * id 		: 셋팅 될 ID
	 * title 	: picker 타이틀
	 * data 	: 그려질 Data (Array)
	 *			  예제) [{text: '010',value: '1'},{text: '011',value: '2'}] 
	 * 
	 * onChange : chage시 작동할 function
	 * onSelect : select시 작동할 function 
	 */
	_public.select = function(option) {
		
		if (util.chkReturn(option.id, "s") == ""){
			// ID가 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.title, "s") == ""){
			// 타이틀이 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.data, "s") == ""){
			// 데이터가 올바르지 않습니다.		
			return;
		}
		
		$('#' + option.id).mobiscroll().select({
			
			// *** 고정영역 *** Start
	        theme: 'ios',
	        display: 'modal',
	        mode: 'scroller',
	        inputClass: 'mobipick ' + option.inputClass,
	        animate: 'slideup',	
	        cancelText: '취소',
	        setText: '확인',
	        focusOnClose: false,
	        // *** 고정영역 *** END
	        
	        // *** 가변영역 *** Start
	        headerText: option.title,
	        //Init Data
	        data: option.data,
	        
	        //Call onChange function
	        onChange: function (valueText, inst) {
	        	
	            // logger.log(inst.getVal()); //selected value
	            // logger.log(valueText); //selected text
	            
	            if (!util.chkReturn(option.onChange, "s") == ""){
	            	option.onChange(valueText, inst);
	    		}
	            
	        },
	        //Call onSelect function
	        onSelect: function (valueText, inst) {
	        	
	        	// logger.log(inst.getVal()); //selected value
	        	// logger.log(valueText); //selected text
	            
	        	if (!util.chkReturn(option.onSelect, "s") == ""){
	        		option.onSelect(valueText, inst);
		    	}
	        }
	        // *** 가변영역 *** End
	    });
		
		// inputbox에 readonly를 추가한다.
		if (util.isNull($('#' + option.id).attr('readonly'))) {
			$('#' + option.id).attr('readonly', 'readonly');
		}
		
	};
	
	/**
	 * Picker.select로 선언된 Select Picker의 값을 취득하는 함수.
	 * 
	 * @param id
	 * @returns
	 */
	_public.getVal = function(id) {
		
		return $('#' + id ).mobiscroll('getVal');
		
	};
	
	/**
	 * MobiScroll을 사용한 Multi Select Picker.
	 * 선언된 DIV영역에 SELECT 박스를 자동 생성한 후 Picker 이벤트를 바인딩 한다.
	 * 
	 * [Option Attribute]
	 * id 		: 셋팅 될 ID
	 * title 	: picker 타이틀
	 * data 	: 그려질 Data (Array)
	 *			  예제) [{text: '010',value: '1'},{text: '011',value: '2'}] 
	 * formatter : 각 값들이 format 될 데이터
	 */
	_public.multiSelect = function(option) {
		
		if (util.chkReturn(option.placeholder, "s") == ""){
			option.placeholder = '값을 선택해 주세요.';
		}
		
    	$('#' + option.id).mobiscroll({
           theme: 'ios',
           display: 'modal',
           mode: 'scroller',
           animate: 'slideup',	
           showLabel: true,	
           headerText: option.title,
           wheels: option.data,
           placeholder: option.placeholder,
           onSelect: function (valueText, inst) {
        	   
               var values = inst.getArrayVal();
               if (values.length != option.formatter.length) {
            	   return;
               }
               
               var formatted = '';
               for ( var i = 0; i < values.length; i++) {
            	   var key = inst.settings.wheels[0][i].keys;
            	   var value = inst.settings.wheels[0][i].values;
            	   
            	   if(value[key.indexOf(values[i])] != '0'){
            		   formatted += value[key.indexOf(values[i])] + option.formatter[i] + ' ';
            	   }
            	   
               }
               
               if(formatted.length == 0) formatted = option.placeholder;
               
               $(this).val(formatted);
                
           },
	       formatResult: function (values) {
	           
	           var formatted = '';
               for ( var i = 0; i < values.length; i++) {
            	   var key = option.data[0][i].keys;
            	   var value = option.data[0][i].values;
            	   
            	   if (value[key.indexOf(values[i])] != '0') {
            		   formatted += value[key.indexOf(values[i])] + option.formatter[i] + ' ';
            	   }
            	   
               }
	           
               if(formatted.length == 0) formatted = option.placeholder;
               
	           return formatted;
	       }
		 
       });
		
	};
	
	/**
	 * Picker.select로 선언된 Select Picker의 값을 취득하는 함수.
	 * 
	 * @param id
	 * @returns
	 */
	_public.getArrayVal = function(id) {
		
		return $('#' + id ).mobiscroll('getArrayVal');
		
	};
	
	/**
	 * MobiScroll을 사용한 Date Picker.
	 * 선언된 Input Field에 날짜 선택과 관련된 Picker를 제공 한다. 아래 선언된
	 * 옵션을 사용하여 Picker를 생성한다.
	 * 
	 * Option Attribute
	 * 
	 * id 		: 셋팅 될 ID
	 * title 	: picker 타이틀
	 * date 	: 셋팅될 Date (ex] 2010122)
	 * foramt 	: 날짜 선택 후 input field에 셋팅될 포맷 (yyyy년 mm월 dd일) 
	 * startYear : picker 시작년도 (기본:2000년)
	 * endYear  : picker 마지막년도 (기본:현재+3년)
	 * defaultVal : option.date로 전달한 값을 기본 선택 값으로 선언 할지 여부 (기본: false)
	 */
	_public.date = function(option) {
		
		var now = new Date();
		
		if (util.chkReturn(option.id, "s") == ""){
			// ID가 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.title, "s") == ""){
			// 타이틀이 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.format, "s") == ""){
			// 형태가 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.date, "s") == "" || !util.isDate(option.date)){
			option.date = util.getDate();
		}
		if (util.chkReturn(option.startYear, "s") == ""){
			option.startYear = '2000';
		}
		if (util.chkReturn(option.endYear, "s") == ""){
			option.endYear = now.getFullYear()+3;
		}

		if (util.chkReturn(option.dateOrder, "s") == ""){
			option.dateOrder = 'yymmdd';
		}
		
	    $('#' + option.id).mobiscroll().date({
	        theme: 'ios',
	        display: 'modal',
	        mode: 'scroller',
	        animate: 'slideup',	
            showLabel: true,
            inputClass: 'birth mobipick',
            endMonth: now.getMonth(),
	        endDate: now.getDate(),
	        rtl: true,
	        
	        startYear: option.startYear,
	        endYear: option.endYear,
	        dateOrder: option.dateOrder,
	        headerText: option.title,
	        dateFormat: option.format
	    });
	    
	    var year  = option.date.substr(0, 4);
	    var month = option.date.substr(4, 2);
	    var day   = option.date.substr(6, 2);
	    
	    //Date set
	    $('#' + option.id).mobiscroll('setDate', new Date(year, month-1, day));
	    
	    // inputbox에 readonly를 추가한다.
		if (util.isNull($('#' + option.id).attr('readonly'))) {
			$('#' + option.id).attr('readonly', 'readonly');
		}
		
		// option.date로 선택한 값을 기본값으로 선택
		if (option.defaultVal == true) {
			_public.setVal('date', option.id, _public.getDate(option.id, 'yyyymmdd', true));
		}
	    
	};
	
	/**
	 * MobiScroll을 사용한 Calendar.
	 * 선언된 Input Field에 날짜 선택과 관련된 Calendar를 제공 한다. 아래 선언된
	 * 옵션을 사용하여 Calendar를 생성한다.
	 * 
	 * Option Attribute
	 * 
	 * id 		: 셋팅 될 ID
	 * date 	: 셋팅될 Date (ex] 2010122) (기본: 오늘)
	 * foramt 	: 날짜 선택 후 input field에 셋팅될 포맷 (yyyy년 mm월 dd일) 
     * defaultVal : option.date로 전달한 값을 기본 선택 값으로 선언 할지 여부 (기본: false)
	 */
	_public.calendar = function(option) {
		
		if (util.chkReturn(option.id, "s") == ""){
			// ID가 입력되지 않았습니다.		
			return;
		}
		if (util.chkReturn(option.date, "s") == "" || !util.isDate(option.date)){
			option.date = util.getDate();
		}
		
		$('#' + option.id).mobiscroll().calendar({
            theme: 'mobiscroll',
            display: 'modal',
	        animate: 'slideup',	
            controls: ['calendar'],
            swipeDirection: 'vertical',
            dateOrder: 'ddmmyy',
            dateFormat: option.format
        });
		
		var year  = option.date.substr(0, 4);
		var month = option.date.substr(4, 2);
		var day   = option.date.substr(6, 2);
		    
		//Date set
		$('#' + option.id).mobiscroll('setDate', new Date(year, month-1, day));
		
		// inputbox에 readonly를 추가한다.
		if (util.isNull($('#' + option.id).attr('readonly'))) {
			$('#' + option.id).attr('readonly', 'readonly');
		}
		
		// 달력버튼 생성
		var calendarButtonTag = '<button type="button" id="'+ option.id +'_button" class="icon50 icon_calendar">달력</button>';
		$('#' + option.id).after(calendarButtonTag);
		
		// 생성된 버튼의 터치 이벤트 삽입
     	$('#' + option.id + '_button').on('tap, mousedown', function(e){
     	   $('#' + option.id).mobiscroll('show');
        });
     	
        // option.date로 선택한 값을 기본값으로 선택
		if (option.defaultVal == true) {
			_public.setVal('date', option.id, _public.getDate(option.id, 'yyyymmdd', true));
		}
	    
	};
	
	/**
	 * Picker.date, Picker.calendar 로 셋팅된 값을 취득하는 함수
	 * format args는 yyyy,mm,dd를 자유롭게 조합하여 사용 가능 하다.

	 * @param id
	 * @param format
	 * @returns {String}
	 */
	_public.getDate = function(id, format, esc) {

		var returnDate = '';
		
		// 입력이 되지 않은 경우 빈 string 반환
		if($('#' + id ).val() == '' && !esc) {
			return returnDate;
		}
		
		if (format.indexOf('yyyy') > -1) {
			
			returnDate += new Date($('#' + id ).mobiscroll('getVal')).getFullYear();
			
		} else if(format.indexOf('yy') > -1) {
			
			returnDate += new Date($('#' + id ).mobiscroll('getVal')).getFullYear();

		}
		
		if (format.indexOf('mm') > -1) {
		
			var getMonth = (new Date($('#' + id ).mobiscroll('getVal')).getMonth())+1;
			if (String(getMonth).length == 1) {getMonth = "0" + getMonth;}
			
			returnDate += getMonth;
			
		}
		
		if (format.indexOf('dd') > -1) {
			
			var getDate = new Date($('#' + id ).mobiscroll('getVal')).getDate();
			if (String(getDate).length == 1) {getDate = "0" + getDate;}
			
			returnDate += getDate;
		
		}
		
		return returnDate;
		
	};
	
	/**
	 * mobiscroll 을 사용하여 생성된 select 의 enable
	 * @param id
	 */
	_public.enable = function(id) {
		
		$('#' + id).mobiscroll('enable');
		
	};

	/**
	 * mobiscroll 을 사용하여 생성된 select 의 disable
	 * @param id
	 */
	_public.disable = function(id) {
		
		$('#' + id).mobiscroll('disable');
		
	};
	
	/**
	 * mobiscroll 을 사용하여 생성된 Picker의 값을 Setting  한다.
	 * 
	 * type : select / date / calendar
	 * 
	 * @param type
	 * @param id
	 * @param value
	 */
	_public.setVal = function(type, id, value) {
		
		if(type == 'select') {
			
			$('#' + id).mobiscroll('setVal', value, true);
			
		} else if (type == 'date' || type == 'calendar') {
			
			var year  = value.substr(0, 4);
			var month = value.substr(4, 2);
			var day   = value.substr(6, 2);
			var nowDate = new Date(year, month-1, day);
			
			$('#' + id).mobiscroll('setVal', nowDate, true);
			
		}
		
	};
	
	return _public;
})();

/**
 * Footer 관련 함수
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var footerCore = (function() {
    var _public = {};
    
    /**
     * 페이지 호출
     * @param _this
     */
    _public.callPage = function(_this) {
    	
    	var _pageId = $(_this).attr('id');
    	
    	var path = '/common/ce/' + _pageId;
		var paramObj = {};
		PageUtil.movePage(path, paramObj);
    };
    
    /**
     * 팝업 오픈
     */
    _public.openPage = function(_this) {
    	
    	var _pageId = $(_this).attr('id');
    	var moveUrl = '';
    	
    	if ( _pageId == 'HPDA01S0') {
    		// 상품공시실
    		moveUrl = 'https://www.lifeplanet.co.kr/disclosure/good/HPDA01S0.dev';
    	} else if ( _pageId == 'HPDD21S0') {
    		// 보호금융상품등록부
    		moveUrl = 'https://www.lifeplanet.co.kr/disclosure/sfgr/HPDD21S0.dev';
    	}
    	
    	var option = {
    		location : 'url',
    		url : moveUrl
    	};
    	
    	PageUtil.openPopup(option);
    	
    };
    
    return _public;
})();

/**
 * 청약 header 관련 함수
 * 
 * @author	조정훈, 513176@lifeplanet.co.kr
 */
var paHeaderCore = (function() {
    var _public = {};
    
    /**
     * 
     * @param envName
     * @returns
     */
    _public.callPage = function(_this) {
    	
    	var _pageId = $(_this).attr('id');
    	
    	if( _pageId == "BACK" ) {
    		
    		var backUrl = '';
    		var insSbsn = globalVar.getParam('spb_data').spb_insSbsnGoodSmclCd;
    		
    		// 정기보험
    		if ( insSbsn == "11" ) {
    			backUrl = '/products/pd/MWPD110S1';
    			
    		// 종신보험
    		} else if ( insSbsn == "12" ) {
    			backUrl = '/products/pd/MWPD210S1';
    			
    		// 연금보험
    		} else if ( insSbsn == "21" ) {
    			backUrl = '/products/pd/MWPD310S1';
    			
    		// 연금저축보험
    		} else if ( insSbsn == "31" ) {
    			backUrl = '/products/pd/MWPD410S1';
    			
    		// 플러스어린이보험
    		} else if ( insSbsn == "42" ) {
    			backUrl = '/products/pd/MWPD510S1';
    			
    		// 에듀케어저축보험
    		} else if ( insSbsn == "32" ) {
    			backUrl = '/products/pd/MWPD610S1';
    			
    		// 꿈꾸는e저축보험
    		} else if ( insSbsn == "33" ) {
    			backUrl = '/products/pd/MWPD710S1';
    			
    		} else {
    			return;
    		}
    		
    		var spb_data    = new Object();
    		spb_data["spb_data"]     = globalVar.getParam('spb_data');
    		
    		PageUtil.movePage(backUrl, spb_data);
    		
    	} else {
    		
    		if ( globalVar.getParam('spb_data').spb_nwcReiScCd == "02" ) {
				return;
			}
    	
			var option = {
				id : 'popupwrap',
				location : 'external',
				content : 'content1',
				url : '/products/pa/' + _pageId + '.dev',
				pageParam : ''
			};
			PageUtil.openPopup(option);
    	}
    };
    
    
    return _public;
})();
