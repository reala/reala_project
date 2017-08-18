/* ============================================================================
 * LIFEPLANET Mobile Web Marketing System
 * 
 * Copyright ⓒ KYOBO LIFEPLANET INSURANCE COMPANY All Rights Reserved.
 * ============================================================================
 * AUTHOR      : 박경서, Kyungseo.Park@gmail.com
 * FILE INFO   : mw.util.prevent-form-double-submit.js, /resources/js/
 * DESCRIPTION : Form의 중복 서브밋(double submission)을 방지하기 위한 
 *               jQuery plugin (참고: http://goo.gl/j7RmtF)
 * ============================================================================
 * Revision History
 * Author   Date            Description
 * ------   ----------      ---------------------------------------------------
 * 박경서   2013-03-06      initial version (KICO Framework)
 * 박경서   2014-12-11      MW 프로젝트용으로 추가
 * ========================================================================== */

(function($) {
	$.fn.preventDoubleSubmission = function() {
		$(this).bind('submit', function(e) {
			var $form = $(this);
			if ($form.data('submitted') === true) {
				// 이전에 이미 submit 되었다면, 다시 subit하지 않는다.
				e.preventDefault();
			} else {
				// 다음 submit이 무시되도록 마킹한다.
				$form.data('submitted', true);
			}
		});
		// chainability 지원
		return this;
	};
})(jQuery);