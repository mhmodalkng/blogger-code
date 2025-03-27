function testBloggerAPI() {
    var BLOG_ID = "9042105251967340748"; // ضع Blog ID هنا
    var API_KEY = "AIzaSyDMbwLivfPER3e3rFMNEzbhzCmw_Tnotq0"; // ضع API Key هنا
  
    var postUrl = "https://www.googleapis.com/blogger/v3/blogs/" + BLOG_ID + "/posts/?key=" + API_KEY;
  
    var headers = {
        "Authorization": "Bearer " + ScriptApp.getOAuthToken(),
        "Content-Type": "application/json"
      };
    var postData = {
      "kind": "blogger#post",
      "title": "📌 منشور اختبار",
      "content": "<p>🔥 إذا رأيت هذا المنشور في مدونتك، فهذا يعني أن API يعمل بشكل صحيح!</p>"
    };
  
    var options = {
      "method": "post",
      "headers": headers,
      "contentType": "application/json",
      "payload": JSON.stringify(postData),
      "muteHttpExceptions": true // ✅ هذا يجعلنا نرى الاستجابة الفعلية حتى لو كان هناك خطأ
    };
  
    var response = UrlFetchApp.fetch(postUrl, options);
    Logger.log(response.getContentText()); // ✅ طباعة الاستجابة لرؤية الخطأ الحقيقي
  }
  