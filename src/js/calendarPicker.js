/* плагин для кадендаря в афише */
jQuery.fn.calendarPicker = function(options) {
  // --------------------------  start default option values --------------------------
  if (!options.date) {
    options.date = new Date();
  }

  if (typeof(options.years) == "undefined")
    options.years=1;

  if (typeof(options.months) == "undefined")
    options.months=3;

  if (typeof(options.days) == "undefined")
    options.days=4;

  if (typeof(options.showDayArrows) == "undefined")
    options.showDayArrows=true;

  if (typeof(options.useWheel) == "undefined")
    options.useWheel=true;

  if (typeof(options.callbackDelay) == "undefined")
    options.callbackDelay=500;

  if (typeof(options.monthNames) == "undefined")
    options.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (typeof(options.dayNames) == "undefined")
    options.dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


  // --------------------------  end default option values --------------------------

  var calendar = {currentDate: options.date};
  calendar.options = options;

  //build the calendar on the first element in the set of matched elements.
  var theDiv = this.eq(0);//$(this);
  theDiv.addClass("calBox");

  //empty the div
  theDiv.empty();


  var divYears = $("<div>").addClass("calYear");
  var divMonths = $("<div>").addClass("calMonth");
  var divDays = $("<div>").addClass("calDay");

  theDiv.append(divMonths).append(divDays);
  // не добавляем блок с названиями годов, но он нам нужне для вычисления даты и поиска соответсвующего файла

  calendar.changeDate = function(date) {
    calendar.currentDate = date;

    var fillYears = function(date) {
      var year = date.getFullYear();
      var t = new Date();
      divYears.empty();
      var nc = options.years*2+1;
      var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px";
      for (var i = year - options.years; i <= year + options.years; i++) {
        var d = new Date(date);
        d.setFullYear(i);
        var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).html(i).css("width",w);
        if (d.getYear() == t.getYear())
          span.addClass("today");
        if (d.getYear() == calendar.currentDate.getYear())
          span.addClass("selected");
        divYears.append(span);
      }
    }

    var fillMonths = function(date) {
      var month = date.getMonth();
      var t = new Date();
      divMonths.empty();
      var oldday = date.getDay();
      // var nc = options.months*2+1;
      // var w = parseInt((theDiv.width()-4-(nc)*4)/nc)+"px"; в нашем варианте элементы в блоке месяца занимают 100% ширины
      var w = 100 + '%' ;
      for (var i = -options.months; i <= options.months; i++) {
        var d = new Date(date);
        var oldday = d.getDate();
        d.setMonth(month + i);

        if (d.getDate() != oldday) {
          d.setMonth(d.getMonth() - 1);
          d.setDate(28);
        }
        var span = $("<span>").addClass("calElement").attr("millis", d.getTime()).html(options.monthNames[d.getMonth()]).css("width",w);
        if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth())
          span.addClass("today");
        if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth())
          span.addClass("selected");
        divMonths.append(span);

      }
    }

    // определение текущего месяца
    Date.prototype.daysInMonth = function() {
      return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
    };
    var monthNow = new Date().daysInMonth() ;


    var fillDays = function(date) {
      var day = date.getDate();
      var t = new Date();
      var dayUntil = (monthNow - day);
      divDays.empty();
      var nc = options.days*2+1;
      // var w = parseInt((theDiv.width()-4-(options.showDayArrows?12:0)-(nc)*4)/(nc-(options.showDayArrows?2:0)))+"px";
      var w = parseInt((theDiv.width()-(theDiv.width()*0.07)-(10*nc))/(nc))+"px";
      //  от ширины блока отнимаем ширину равную margin с левой стороны и отнимаем margin умноженный на количество дней, это все делим на количество дней
      for (var i = -options.days; i <= options.days; i++) {
        var d = new Date(date);
        d.setDate(day + i);
        var span = $("<span>").addClass("calElement").attr({
                                                            "millis": d.getTime(),
                                                            'date-on': (d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear())
                                                          });
        var month,
          currentSpan;

        if (i == -options.days && options.showDayArrows) {
          span.addClass("prev");
        } else if (i == options.days && options.showDayArrows) {
          span.addClass("next");
        } else {
          span.html("<span class=dayNumber>" + d.getDate() + "</span><br>" + options.dayNames[d.getDay()]).css("width",w);
          if (d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() == t.getDate())
            span.addClass("today");
          if (d.getYear() == calendar.currentDate.getYear() && d.getMonth() == calendar.currentDate.getMonth() && d.getDate() == calendar.currentDate.getDate())
            span.addClass("selected");
          if (dayUntil > 0 && d.getYear() == t.getYear() && d.getMonth() == t.getMonth() && d.getDate() > t.getDate() && d.getDate() <= (t.getDate() + dayUntil))
              span.addClass("until");
          if ( d.getDate() == 1 ){
              span.addClass("first");
              currentSpan = span.filter('.first');
              month = $("<span>").addClass("before").html(options.monthNames[d.getMonth()]);
            };
        }
        divDays.append(span);
      }
      currentSpan.before(month);
      // вставляем название месяца перед спаном первого дня месяца
    }

    var deferredCallBack = function() {
      if (typeof(options.callback) == "function") {
        if (calendar.timer)
          clearTimeout(calendar.timer);

        calendar.timer = setTimeout(function() {
          options.callback(calendar);
        }, options.callbackDelay);
      }
    }

    fillYears(date);
    fillMonths(date);
    fillDays(date);

    deferredCallBack();

  }

  theDiv.click(function(ev) {
    var el = $(ev.target).closest(".calElement");
    if (el.hasClass("calElement")) {
      calendar.changeDate(new Date(parseInt(el.attr("millis"))));
    }
  });

  calendar.changeDate(options.date);

  return calendar;
};

/* end of file calendarPicker */
