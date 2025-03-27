var CLIENT_ID =
  "1031694725285-60prba5b7smik9s6sbcd6lj7t8v0kb67.apps.googleusercontent.com"; // ضع هنا Client ID الخاص بك
var CLIENT_SECRET = "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"; // ضع هنا Client Secret الخاص بك
var BLOG_ID = "9042105251967340748"; // ضع هنا Blog ID الخاص بمدونتك

function fetchNewsWithImages() {
  // استبدل هذا برابط RSS للموقع الإخباري الذي تريده
  var rssUrl = "https://aawsat.com/feed";
  var blogId = "9042105251967340748"; // استبدل بمعرف مدونتك
  var apiKey = "AIzaSyDMbwLivfPER3e3rFMNEzbhzCmw_Tnotq0"; // استبدل بمفتاح API الخاص بك
  // var apiKey = "AIzaSyCVrMyb-5aVHslGxeszuqxCyrvkTlXBtZI"; // استبدل بمفتاح API الخاص بك

  try {
    createBloggerPost(blogId, "title", "postContent");
  } catch (e) {
    Logger.log("حدث خطأ: " + e.toString());
  }
}

// دالة مساعدة لإنشاء المنشور في بلوجر
function createBloggerPost(blogId, title, content) {
  var url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`;

  var service = getOAuthService();
  if (service.hasAccess()) {
    var accessToken = service.getAccessToken();
    var headers = {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    };
  } else {
    Logger.log("يجب المصادقة أولًا!");
  }

  // let service = getService();
  // var headers = {
  //   "Authorization": "Bearer " + service.getAccessToken(),
  //   "Content-Type": "application/json"
  // };

  var payload = {
    title: title,
    content: content,
    labels: ["أخبار", "مستوردة"],
  };

  var options = {
    method: "POST",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  Logger.log("تم إنشاء المنشور: " + title);
  Logger.log(response.getContentText());
}
function getOAuthService() {
  var service = OAuth2.createService("Blogger")
    .setAuthorizationBaseUrl("https://accounts.google.com/o/oauth2/auth")
    .setTokenUrl("https://oauth2.googleapis.com/token")
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction("authCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("https://www.googleapis.com/auth/blogger");

  return service;
}

function authCallback(request) {
  var service = getOAuthService();
  var isAuthorized = service.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput("تمت المصادقة بنجاح!");
  } else {
    return HtmlService.createHtmlOutput("فشلت المصادقة!");
  }
}
