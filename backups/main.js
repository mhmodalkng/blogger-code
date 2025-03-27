function fetchNewsWithImages() {
  // استبدل هذا برابط RSS للموقع الإخباري الذي تريده
  var rssUrl = "https://aawsat.com/feed";
  var blogId = "9042105251967340748"; // استبدل بمعرف مدونتك
  var apiKey = "AIzaSyDMbwLivfPER3e3rFMNEzbhzCmw_Tnotq0"; // استبدل بمفتاح API الخاص بك
  // var apiKey = "AIzaSyCVrMyb-5aVHslGxeszuqxCyrvkTlXBtZI"; // استبدل بمفتاح API الخاص بك

  try {
    // جلب محتوى RSS
    var response = UrlFetchApp.fetch(rssUrl);
    var xmlContent = response.getContentText();
    var document = XmlService.parse(xmlContent);
    var root = document.getRootElement();
    var channel = root.getChild("channel");
    var items = channel.getChildren("item");

    // معالجة كل منشور
    items.slice(0, 5).forEach(function (item) {
      // جلب آخر 5 منشورات فقط
      var title = item.getChild("title").getText();
      var link = item.getChild("link").getText();
      var description = item.getChild("description").getText();
      var pubDate = item.getChild("pubDate").getText();

      // استخراج الصورة الأولى من المحتوى
      var imageUrl = "";
      var contentElement =
        item.getChild("content:encoded") || item.getChild("description");
      if (contentElement) {
        var content = contentElement.getText();
        var imgRegex = /<img[^>]+src="([^">]+)"/g;
        var match = imgRegex.exec(content);
        if (match && match[1]) {
          imageUrl = match[1];
        }
      }

      // إنشاء محتوى المنشور مع التنسيق الاحترافي
      var postContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h1 style="color: #2a5885; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${title}</h1>
            ${
              imageUrl
                ? `<img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 15px 0; border-radius: 5px;" alt="${title}">`
                : ""
            }
            <div style="line-height: 1.6; font-size: 16px; color: #333;">
              ${description}
            </div>
            <div style="margin-top: 20px; font-style: italic; color: #666;">
              <p>المصدر: <a href="${link}" style="color: #2a5885; text-decoration: none;">رابط الخبر الأصلي</a></p>
              <p>تاريخ النشر: ${new Date(pubDate).toLocaleDateString(
                "ar-EG"
              )}</p>
            </div>
          </div>
        `;

      // إنشاء المنشور في بلوجر
      createBloggerPost(blogId, apiKey, title, postContent);

      Utilities.sleep(2000); // تأخير بين كل منشور لتجنب حدوث أخطاء
    });
  } catch (e) {
    Logger.log("حدث خطأ: " + e.toString());
  }
}

// دالة مساعدة لإنشاء المنشور في بلوجر
function createBloggerPost(blogId, apiKey, title, content) {
  var url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;

  var headers = {
    Authorization: "Bearer " + ScriptApp.getOAuthToken(),
    "Content-Type": "application/json",
  };

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
