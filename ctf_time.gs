function myFunction() {
  //カレンダーID
  var calId = "ctftime@gmail.com";
  //LINE Notifyのアクセストークン
  var key = ""; //this need to secret
  
  var url = "https://notify-api.line.me/api/notify";
  
  var cal = CalendarApp.getCalendarById(calId);
  var now = new Date();
  
  var dayOfTheWeek = ['日', '月', '火', '水', '木', '金', '土'];
  
  var msg = "";
  
  dayOfTheWeek.forEach( function(dayOf, index){
  
    var dayOfWeek = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + (index+1));
    var dayOfWeekEvent = cal.getEventsForDay(dayOfWeek);
    
    
    //LINE Notifyに送るメッセージ
    //予定がない場合
    if(dayOfWeekEvent.length === 0) {
      msg += "\n" +dayOf + "曜日開催のCTFはありません\n";
    }
    else {
      msg += " \n" + dayOf + "曜日開催のCTFは" + String(dayOfWeekEvent.length) + "件あります\n";
      msg += allPlanToMsg(dayOfWeekEvent);
    }
  });
  
  var jsonData = {
    message: msg
  }
  
    var options =
  {
    "method" : "post",
    "contentType" : "application/x-www-form-urlencoded",
    "payload" : jsonData,
    "headers": {"Authorization": "Bearer " + key}
  };

  var res = UrlFetchApp.fetch(url, options);
}

// イベントの配列をテキストにして返す
function allPlanToMsg(events/* array */){
  var msg = "";
  events.forEach( function(event, index){
    var title = event.getTitle();
    var start = event.getStartTime().getHours() + ":" + ("0" + event.getStartTime().getMinutes()).slice(-2);
    var end = event.getEndTime().getHours() + ":" + ("0" + event.getEndTime().getMinutes()).slice(-2);
    // 予定が終日の時
    if( event.isAllDayEvent() ){
      msg += String(index + 1) + "件目: " + title + " 終日の予定です。\n";
      return;
    }
    msg += String(index + 1) + "件目: " + title + " " + start + "~" + end + "\n";
  });
  return msg;
}
