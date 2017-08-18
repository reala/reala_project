<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="java.util.*" %>
<%

	// userLoginInfo
	
	System.out.println("evaluateMain LOAD!");

	Map<String,Object> userLoginInfo = (Map<String,Object>) request.getSession().getAttribute("userLoginInfo");
	System.out.println("userLoginInfo : " + userLoginInfo);
	long LAST_IDX = (Long) userLoginInfo.get("LAST_IDX");
	
%>
<html>
<head>
<title>평가시스템</title>

<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- <link rel="stylesheet" href="../resources/css/style.css">  -->
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
<!--webfonts-->
<link href='http://fonts.googleapis.com/css?family=Open+Sans:600italic,400,300,600,700' rel='stylesheet' type='text/css'>
<!--//webfonts-->
<style type="text/css">

div.container {
    width: 100%;
    border: 1px solid gray;
}

header, footer {
    padding: 1em;
    color: white;
    background-color: black;
    clear: left;
    text-align: center;
}

input {
	width : 100px;
	text-align : right;
}
li {
	font-size : 0.8em;
}

#container {
  margin: 0px auto;
  padding: 20px;
  border: 1px solid #bcbcbc;
}
#header {
  height : 25px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #bcbcbc;
  font-size : 1.5em;
  text-align : center;
  font-weight : bold;
}
#content {
  width: 800px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #bcbcbc;
}
#sidebar {
  width: 90%;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #bcbcbc;
}
#footer {
  height : 15px;
  clear: both;
  padding: 20px;
  border: 1px solid #bcbcbc;
  text-align: center;
}

h2, h3, h4 {
	text-align: center;
}

.button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 43px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.button:focus {
    background-color: yellow; /* Green */
    border: none;
    color: white;
    padding: 15px 43px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.buttonFocus {
    background-color: yellow; /* Green */
    border: none;
    color: white;
    padding: 15px 43px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.buttonRed {
    background-color: #f44336; /* Red */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
    width : 276px;
}
.buttonError {
    background-color: #f44336;
    border: none;
    color: black;
    padding: 5px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.buttonMove {
    background-color: e7e7e7;
    border: none;
    color: black;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.buttonSearch {
    background-color: e7e7e7;
    border: none;
    color: black;
    padding: 5px 30px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
}
.buttonLogout {
    background-color: #f44336; /* Red */
    border: none;
    color: white;
    padding: 10px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 3px;
    float : right;
}
</style>

<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
<script>

	/**
	 * Script Initial
	 */
	$( document ).ready(function() {
		
		var EVAMAIN = (function() {
			
			var initHtmlPath = "107738651.html";
			var currentIDX = <%=LAST_IDX%>;
			
			var currentSelectNumber = 0;
			var _public = {};
			var _private = {};
			
			/**
			 *  조회 실행
			 */
			_private.retrieveNOTAMAction = function(paramIDX) {
				
				var searchIDX = 0;
				if(paramIDX) {
					searchIDX = paramIDX;
					
					console.log('paramIDX : ' + paramIDX);
				} else {
					searchIDX = currentIDX;
					console.log('currentIDX : ' + currentIDX);
				}
				
				var params = {
						idx : searchIDX
				};
				
				$.ajax({
						type : "POST",
						url : "retrieveEvalute",
						data : JSON.stringify(params),
						dataType : 'json',
						processData : true /*querySTring make false*/,
						contentType : "application/json; charset=UTF-8",
						success : function(data, resStatus) {
							console.log(data);
							console.log(resStatus);
							
							if(data.RESCODE == '0000') {
								
								currentIDX = data.notamInfo.idx;
								$('#idx').val(data.notamInfo.idx);
								$('#notam_num').text(data.notamInfo.NOTAM_NUM);
								
								$('#NOTAM_TEXT').text(data.notamInfo.TRIM_NOTAM);
								
								// 기존 점수가 있는 경우
								$('[id*=btn0]').attr('class', 'button');
								if(data.notamInfo.SCORE) {
									
									if(data.notamInfo.SCORE == 9) {
										alert('오류 신고된 NOTAM 입니다.');
										return;
									}
									
									var beforeScore = data.notamInfo.SCORE;
									currentSelectNumber = beforeScore;
									$('#btn0' + beforeScore).attr('class', 'buttonFocus');
								}
								
								_private.drawNOTAM(data.notamInfo.html);
								//_private.drawNOTAM(initHtmlPath);
								
							} else {
								alert(data.RESMSG);
							}						
							
						},
						error : function(e) {
							location.href = 'login';
						}
					});

				};
				
				// 현재 점수 저장				
				_private.saveAction = function() {
					// alert(currentSelectNumber);
					
					if(currentSelectNumber < 1) {
						alert('점수가 선택되지 않았습니다.');
						return;
					}
					
					var params = {
							idx : currentIDX,
							score : currentSelectNumber
					};
					
					$.ajax({
						type : "POST",
						url : "insertEvalute",
						data : JSON.stringify(params),
						dataType : 'json',
						processData : true /*querySTring make false*/,
						contentType : "application/json; charset=UTF-8",
						success : function(data, resStatus) {
							console.log(data);
							console.log(resStatus);
							
							if(data.RESCODE == '0000') {
								
								currentSelectNumber = 0;
								currentIDX  = data.nextNoTAM
								_private.retrieveNOTAMAction();
								
							} else {
								alert(data.RESMSG);
							}						
							
						}
					});
					
					
				}

				// Logout			
				_private.logoutAction = function() {
					
					if(confirm('로그아웃 하시겠습니까?')) {
						$.ajax({
							type : "POST",
							url : "logout",
							data : {},
							dataType : 'json',
							processData : true /*querySTring make false*/,
							contentType : "application/json; charset=UTF-8",
							success : function(data, resStatus) {
								alert('로그아웃')
							}, error : function() {
								location.href = 'login';
							}
						});
					}
					
				}
				
				// 선택된 점수 셋팅
				_private.setNumber = function() {
					// console.log($(this).val());
					$('[id*=btn0]').attr('class', 'button');
					currentSelectNumber = $(this).val();
				}
				
				_private.drawNOTAM = function(PATH) {
					
					var htmlPATH = location.origin + "/NOTAM_Raw_html/" + PATH + '.html';
					
					$("#NOTAM_MAIN").load(htmlPATH, function(a, b, c){
						
						if(b == 'error') {
							$('#NOTAM_MAIN').html('조회된 HTML이 없습니다.');
						} else {
							$('#NOTAM_MAIN base').remove();
							
							// style remove
							$('#NOTAM_MAIN style').remove();
							
							// TITLE remove
							$('#NOTAM_MAIN')[0].childNodes[0].remove();
							$('#NOTAM_MAIN')[0].childNodes[0].remove();
							$('#NOTAM_MAIN')[0].childNodes[0].remove();
							
							// 보고자 삭제
							$('#NOTAM_MAIN p:contains(보고자)').remove();
							
							// 이미지 경로 재설정
							$('#NOTAM_MAIN img').each(function(a, b, c){
								var notamSrc = $(this).attr('src');
								var idx = notamSrc.lastIndexOf('.');
								notamSrc = notamSrc.substr(idx, notamSrc.length-1);
								
								$(this).attr('src', location.origin + "/NOTAM_Raw_html/images/" + PATH + '_' + a + notamSrc);
							});
							
						}
						
					});
					
				}
				
				// 이전 NOTAM 조회
				_private.beforeMove = function() {
					_private.retrieveNOTAMAction(currentIDX-1);
				}

				// 다음 NOTAM 조회
				_private.afterMove = function() {
					_private.retrieveNOTAMAction(currentIDX+1);
				}

				// 선택 NOTAM 조회
				_private.searchMove = function() {
					var idx = $('#idx').val();
					_private.retrieveNOTAMAction(idx);
				}
				
				// 오류 신고
				_private.errorSave = function() {
					if(confirm('오류 신고 하시겠습니까?')) {
						currentSelectNumber = '9';
						_private.saveAction();
					}
				}
				
				_private.tempIDX = 0;
				
				// 초기화 셋팅		
				_private.init = function() {
					$('#btn05').click(_private.setNumber);
					$('#btn04').click(_private.setNumber);
					$('#btn03').click(_private.setNumber);
					$('#btn02').click(_private.setNumber);
					$('#btn01').click(_private.setNumber);
					$('#btnSave').click(_private.saveAction);
					$('#btnLogout').click(_private.logoutAction);

					$('#btnBefore').click(_private.beforeMove);
					$('#btnAfter').click(_private.afterMove);
					$('#btnSearch').click(_private.searchMove);
					$('#btnError').click(_private.errorSave);
					
					// 초기 로드
					_private.retrieveNOTAMAction();
					
				};
				_private.init();

				return _public;
			})();

	});
</script>
</head>
<body>
<center>
	<div id="container">
      <div id="header">
        NOTAM 평가시스템
        <button id="btnLogout" class="buttonLogout">로그아웃</button>
      </div>

      <div id="sidebar">
        <li>만약 정상적으로 보이지 않는 경우 새로고침(F5) 하시기 바랍니다.</li>
        <li>NOTAM이 일치하지 않는 경우 [오류신고]를 하시기 바랍니다.</li><br>
		 <div>
                        <h2>NOTAM TEXT</h2>
                        <div id="NOTAM_TEXT"></div>
                </div> 
		<div id="EVA_MAIN" style="border: 1px solid white;">
			<h2>채점영역</h2> 
			<div>
				<strong>◎ 현재 번호</strong> : <input type="text" id="idx" maxlength="10"/>/ <span id="notam_num">0</span>
				<button id="btnSearch" class="buttonSearch">이동</button>
				<button id="btnError" class="buttonError">오류신고</button> 
			</div>
			<button id="btn01" value="1" class="button">1</button>
			<button id="btn02" value="2" class="button">2</button>
			<button id="btn03" value="3" class="button">3</button>
			<button id="btn04" value="4" class="button">4</button>
			<button id="btn05" value="5" class="button">5</button><br>
			<button id="btnBefore" class="buttonMove"> ◀이전</button>
			<button id="btnSave" class="buttonRed">저장</button>
			<button id="btnAfter" class="buttonMove">다음▶</button><br> 
		</div>
      </div>

      <div id="content">
      	<h2>NOTAM 결재문서 참고자료</h2>
			<div id="NOTAM_MAIN" style="text-align: center;" ></div>
      </div>
      <div id="footer">
        Copyright &copy; 2017
      </div>
    </div>
</center>
</body>
</html>
