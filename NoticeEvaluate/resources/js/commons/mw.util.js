/* ============================================================================
 * LIFEPLANET Mobile Web Marketing System
 * 
 * Copyright ⓒ KYOBO LIFEPLANET INSURANCE COMPANY All Rights Reserved.
 * ============================================================================
 * AUTHOR      : 기존 홈페이지 시스템
 * FILE INFO   : mw.util.js, /resources/js/
 * DESCRIPTION : 페이지 전역에서 사용되는 util 함수 집합
 * ============================================================================
 * Revision History
 * Author   Date            Description
 * ------   ----------      ---------------------------------------------------
 * 홈페이지 2014-11-20	 	initial version
 * 시스템
 * 권대준	2014-12-11		KDIMW에 맞도록 구조 수정  			
 * ========================================================================== */

/******************************************************************************
 * [NOTE] : 기존 홈페이지 시스템에서 사용하던 util.js를 기반으로 KDIMW에서 사용하는
 * 		    구조로 수정을 진행함. 한가지 파일에 너무 많은 util이 산재되어 있어서 
 *		    검색이 용이하지 않아 목적에 맞는 util 별로 구조를 분산함.
 *		  
 *		    - mw.util.js 		: util의 메인으로 object를 생성한다.		  
 *		    - mw.util.date.js 	: date 관련 유틸의 집합		  
 *		    - mw.util.mask.js 	: masking, formatter 관련 집합		  
 *		    - mw.util.object.js : object 관련 함수의 집합		  
 *		    - mw.util.string.js : string 관련 함수의 집합		  
 *		    - mw.util.event.js 	: event 관련 함수의 집합		  
 *
 ******************************************************************************/

/**
 * Util성 함수 정의
 * 
 * @author	권대준, djkwon@kico.co.kr
 */
var util = (function() {
    var _public = {};
    
    /**
     * Object의 Null 여부 체크
     * @param obj
     * @returns {Boolean}
     */
    _public.isNull = function(obj) {
    	
    	if (typeof obj == 'undefined' || obj == null || obj == '') {
    		return true;
    	} else {
    		return false;
    	}
    	
    };
    
    /**
     * 브라우저 종류를 리턴한다.
     * @returns	- String - 문자열 리턴 - ie:익스프로러,ff:파이어폭스,sf:사파리,op:오페라,cr:크롬
     */
    _public.getBw = function () {
    	if ($.browser.msie){
    		return "ie";
    	} else if ($.browser.mozilla){
    		return "ff";
    	} else if ($.browser.safari){
    		return "sf";
    	} else if ($.browser.opera){
    		return "op";
    	} else if ($.browser.chrome){
    		return "cr";
    	} else {
    		return "";
    	}
    	
    	return "";
    };

    /**
     * 브라우저 버전을 리턴한다.
     * @returns
     */
    _public.getBwVr = function () {
    	return $.browser.version;
    };

    
    /**
     * 파일 다운로드 기능
     * 
     * @param :
     *            fileName 다운로드 받을 파일명
     * 
     * downloadPathType는 다음을 참고하여 입력할 것 미입력 : /shrd001/homepage 0 보험약관 :
     * /shrd001/insuManual - 1 상품설명서 : /shrd001/goodsManual - 2 사업방법서 :
     * /shrd001/busiManual - 3 신청서류(마이페이지) : /shrd001/myApplyManual
     * 
     */
    _public.fileDownload = function(fileName, downloadPathType) {
    	Main.offDisableBack('fileDownload');
    	downloadPathType = util.chkReturn(downloadPathType,"s");
    	// 공통 다운로드 cmd
    	var downloadCmd = "/common/file/FileDownload";
    	// 화면에 추가할 html text를 만든다.
    	var strHtml = "";
    	
    	// IOS 의 경우 pdf 뷰가 사파리를 통해 가능 하기 때문에 별도의 새창을 연다.
    	var osName = MXP_PLUGIN.getOSInfo().name;
    	var iframe = '';
    	if(osName == "WEB_IOS") {
    		iframe	= '<div id="downloadIFrameArea" style="display:none"><iframe id="downloadIFrameId" name="downloadIFrameIdExt" title="다운로드용 프레임"></iframe></div>';
    	}
    	else {
    		iframe	= '<div id="downloadIFrameArea" style="display:none"><iframe id="downloadIFrameId" name="downloadIFrameId" title="다운로드용 프레임"></iframe></div>';
    	}

    	// 화면에 다운로드 폼이 있을경우
    	if ($("#downloadForm").length > 0) {
    		downloadCmd += ".dev";
    		$("#downloadForm").attr("action",downloadCmd);
    		$("#fileName").val(fileName);
    		$("#downloadPathType").val(downloadPathType);
    	}
    	// 화면에 다운로드 폼이 없을경우
    	else {
    		
    		if (osName != "APP_IOS") {
				
    			strHtml += "<form id=\"downloadForm\" name=\"downloadForm\" method=\"POST\" action=\"" + downloadCmd + ".dev\" target=\"downloadIFrameId\">";
				strHtml += "<input name=\"fileName\" id=\"fileName\" type=\"hidden\" value=\"" + fileName + "\" />";
				strHtml += "<input name=\"downloadPathType\" id=\"downloadPathType\" type=\"hidden\" value=\"" + downloadPathType + "\" />";
				strHtml += "</form>";
    			
    			$("body").append(iframe);	// 화면에 form 등 생성
    			$("#downloadIFrameArea").append(strHtml);	// 화면에 form 등 생성
    		} else {
    			
    			strHtml += "<form id=\"downloadForm\" name=\"downloadForm\" method=\"POST\" action=\"" + downloadCmd + ".dev\">";
    			strHtml += "<input name=\"fileName\" id=\"fileName\" type=\"hidden\" value=\"" + fileName + "\" />";
    			strHtml += "<input name=\"downloadPathType\" id=\"downloadPathType\" type=\"hidden\" value=\"" + downloadPathType + "\" />";
    			strHtml += "</form>";
    			
    		}
    	}
    	
    	if (osName != "APP_IOS") {
    	
    		$("#downloadForm").submit();	// submit
    	
    	} else {
    		
    		localStorage.setItem('downStrHtml', strHtml);
    		var param = {
				location : 'new',
				htmlTag : ''
    		};
    		PageUtil.openPopup(param);
    	
    	}

    };
        
    return _public;
})();