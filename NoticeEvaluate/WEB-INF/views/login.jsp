<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<title>로그인</title>

<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../nes/resources/css/style.css">
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
<!--webfonts-->
<link href='http://fonts.googleapis.com/css?family=Open+Sans:600italic,400,300,600,700' rel='stylesheet' type='text/css'>
<!--//webfonts-->

<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
<script>

/**
 * Script Initial
 */
$( document ).ready(function() {
	
	var LOGIN = (function() {
		var _public = {};
		var _private = {};
		

		/**
		 *  로그인 실행
		 */
		_private.loginAction = function() {
			
			var userId = $('#userId').val();
			var password = $('#password').val();
			
			var params = {
					userId : userId,
					password : password
			};
			
			$.ajax({
					type : "POST",
					url : "loginProcess",
					data : JSON.stringify(params),
					dataType : 'json',
					processData : true /*querySTring make false*/,
					contentType : "application/json; charset=UTF-8",
					success : function(data, resStatus) {
						console.log(data);
						console.log(resStatus);
						
						if(data.RESCODE == '0000') {
							alert(data.userLoginInfo.USER_ID + " 님 환영 합니다.");
							// TODO 평가페이지 접속
							
							var url = "evaluateMain";    
							$(location).attr('href',url);

						} else {
							alert(data.RESMSG);
						}						
						
					},
					error : function(e) {
						alert(e.responseText);
					}
				});

			};

			// 초기화 셋팅		
			_private.init = function() {
				$('#btnLogin').click(_private.loginAction);
			};
			_private.init();

			return _public;
		})();

	});
</script>
</head>
<body>
	<!-----start-main---->
	<div class="main">
		<div class="login-form">
			<h1>평가 시스템 로그인</h1>
			<div class="head">
				<img src="../nes/resources/images/user.png" alt="" />
			</div>
			<form>
				<input type="text" class="text" id="userId" value="사용자ID"
					onfocus="this.value = '';"
					onblur="if (this.value == '') {this.value = 'USERNAME';}">
				<input type="password" value="" id="password"
					onfocus="this.value = '';"
					onblur="if (this.value == '') {this.value = 'Password';}">
				<div class="submit">
					<input type="button" id="btnLogin" value="LOGIN">
				</div>
				<!-- <p><a href="#">Forgot Password ?</a></p> -->
			</form>
		</div>
		<!--//End-login-form-->
	</div>
	<!-----//end-main---->
</body>
</html>