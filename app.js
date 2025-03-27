
// إعداد OAuth2
function getOAuthService() {
    var service = OAuth2.createService('Blogger')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://oauth2.googleapis.com/token')
      .setClientId('1031694725285-4obt0undmsfdrshqs70n0ugmh0tbteep.apps.googleusercontent.com') // استبدل بـ Client ID الخاص بك
      .setClientSecret('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') // استبدل بـ Client Secret الخاص بك
      .setCallbackFunction('authCallback') // الدالة التي تستقبل رمز التفويض
      .setPropertyStore(PropertiesService.getUserProperties()) // تخزين بيانات المصادقة
      .setScope('https://www.googleapis.com/auth/blogger'); // نطاق الصلاحيات
  
    return service;
}
  
// دالة المصادقة عند الطلب الأول
function authCallback(request) {
    var service = getOAuthService();
    var isAuthorized = service.handleCallback(request);
    if (isAuthorized) {
        return HtmlService.createHtmlOutput('✅ تمت المصادقة بنجاح! يمكنك إغلاق هذه الصفحة.');
    } else {
        return HtmlService.createHtmlOutput('❌ فشلت المصادقة. حاول مرة أخرى.');
    }
}

// دالة نشر مقال في Blogger
function publishBloggerPost() {
    var service = getOAuthService();

    if (!service.hasAccess()) {
        var authorizationUrl = service.getAuthorizationUrl();
        Logger.log('⚠️ انتقل إلى هذا الرابط للمصادقة: ' + authorizationUrl);
        return;
    }

    var accessToken = service.getAccessToken();
    var blogId = '9042105251967340748'; // استبدل بـ معرف مدونتك في Blogger

    var url = 'https://www.googleapis.com/blogger/v3/blogs/' + blogId + '/posts/';

    var postData = {
        "title": "عنوان المقال التجريبي",
        "content": "<p>هذا مقال تجريبي تم نشره بواسطة Google Apps Script باستخدام OAuth2.</p>",
        "labels": ["أخبار", "تقنية"]
    };

    var options = {
        "method": "POST",
        "headers": {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
        },
        "payload": JSON.stringify(postData)
    };

    var response = UrlFetchApp.fetch(url, options);
    Logger.log("✅ تم نشر المقال بنجاح: " + response.getContentText());
}
  