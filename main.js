const BLOG_ID = '9042105251967340748';
const CLIENT_ID = '1031694725285-4obt0undmsfdrshqs70n0ugmh0tbteep.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

function fetchNewsWithImages() {
    // استبدل هذا برابط RSS للموقع الإخباري الذي تريده
    var rssUrl = "https://aawsat.com/feed";

    try {
        // جلب محتوى RSS
        var response = fetch(rssUrl);
        console.log(response);
        // var xmlContent = response.getContentText();
        // var document = XmlService.parse(xmlContent);
        // var root = document.getRootElement();
        // var channel = root.getChild("channel");
        // var items = channel.getChildren("item");

        // // معالجة كل منشور
        // items.slice(0, 5).forEach(function (item) {
        //     Logger.log(item);exit();
        //     // جلب آخر 5 منشورات فقط
        //     var title = item.getChild("title").getText();
        //     var link = item.getChild("link").getText();
        //     var description = item.getChild("description").getText();
        //     var pubDate = item.getChild("pubDate").getText();

        //     // استخراج الصورة الأولى من المحتوى
        //     var imageUrl = "";
        //     var contentElement =
        //         item.getChild("content:encoded") || item.getChild("description");
        //     if (contentElement) {
        //         var content = contentElement.getText();
        //         var imgRegex = /<img[^>]+src="([^">]+)"/g;
        //         var match = imgRegex.exec(content);
        //         if (match && match[1]) {
        //         imageUrl = match[1];
        //         }
        //     }
            
    
        //     // إنشاء محتوى المنشور مع التنسيق الاحترافي
        //     var postContent = `
        //         <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        //             <h1 style="color: #2a5885; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${title}</h1>
        //             ${
        //                 imageUrl
        //                 ? `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 15px 0; border-radius: 5px;" alt="${title}">`
        //                 : ""
        //             }
        //             <div style="line-height: 1.6; font-size: 16px; color: #333;">
        //                 ${description}
        //             </div>
        //             <div style="margin-top: 20px; font-style: italic; color: #666;">
        //                 <p>المصدر: <a href="${link}" style="color: #2a5885; text-decoration: none;">رابط الخبر الأصلي</a></p>
        //                 <p>تاريخ النشر: ${new Date(pubDate).toLocaleDateString(
        //                 "ar-EG"
        //                 )}</p>
        //             </div>
        //         </div>
        //     `;
    
        //     // إنشاء المنشور في بلوجر
        //     // createBloggerPost(title, postContent);
    
        //     Utilities.sleep(2000); // تأخير بين كل منشور لتجنب حدوث أخطاء
        // });
    } catch (e) {
        // Logger.log("حدث خطأ: " + e.toString());
        console.log("حدث خطأ: " + e.toString());
    }
}
// إعداد OAuth2
function getOAuthService() {
    var service = OAuth2.createService('Blogger')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://oauth2.googleapis.com/token')
      .setClientId(CLIENT_ID) // استبدل بـ Client ID الخاص بك
      .setClientSecret(CLIENT_SECRET) // استبدل بـ Client Secret الخاص بك
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
function publishBloggerPost(title, content) {
    var service = getOAuthService();

    if (!service.hasAccess()) {
        var authorizationUrl = service.getAuthorizationUrl();
        Logger.log('⚠️ انتقل إلى هذا الرابط للمصادقة: ' + authorizationUrl);
        return;
    }

    var accessToken = service.getAccessToken();

    var url = 'https://www.googleapis.com/blogger/v3/blogs/' + BLOG_ID + '/posts/';

    var postData = {
        "title": title,
        "content": content,
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

fetchNewsWithImages();