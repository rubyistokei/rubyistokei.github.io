jQuery(document).ready(function() {
  var ViewModel = function() {
    var self = this;

    self.moment = ko.observable(moment());
    setInterval(function() {
      self.moment(moment());
    }, 1000);

    self.hour = ko.computed(function() {
      return self.moment().local().format('HH');
    }, self);

    self.minute = ko.computed(function() {
      return self.moment().local().format('mm');
    }, self);

    self.colonClass = ko.computed(function() {
      return self.moment().local().second() % 2 === 0 ? 'show' : 'hidden';
    }, self);
  };

  var boxWidth = 1024;
  var boxHeight = 768;

  var info = {
    url: "http://farm9.staticflickr.com/8048/8376938968_167939e595_b.jpg",
    tokei: {
      top: 200,
      left: 200,
      size: 96,
      color: '#333'
    }
  };

  $('.tokei').css({
    top: info.tokei.top,
    left: info.tokei.left,
    color: info.tokei.color,
    'font-size': info.tokei.size || 96
  });
  $('.tokei-image').get(0).src = info.url;

  var box = $('.tokei-box');
  box.width(boxWidth).height(boxHeight);

  var img = $('.tokei-image');
  img.imagesLoaded(function() {
    var scaleX = boxWidth / img.width();
    var scaleY = boxHeight / img.height();
    var scale = (scaleX > scaleY) ? scaleY : scaleX;
    var fitX = img.width() * scale;
    var fitY = img.height() * scale;
    img.width(fitX);
    img.height(fitY);
    $('.tokei').show();
  });

  var resized = function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scaleX = windowWidth / boxWidth;
    var scaleY = windowHeight / boxHeight;
    var scale = (scaleX > scaleY) ? scaleY : scaleX;
    var wrapperHeight = boxHeight * scale;
    var wrapperWidth = boxWidth * scale;
    var offsetX = (windowWidth - wrapperWidth) / scale;
    var offsetY = (windowHeight - wrapperHeight) / scale;
    box.css({
      zoom: scale,
      '-moz-transform': 'translate(-50%,-50%) scale(' + scale + ') translate(50%,50%)'
    });
    var top  = (windowHeight - wrapperHeight) / 2;
    var left = (windowWidth  - wrapperWidth ) / 2;
    $('.tokei-wrapper').css({
      top: top,
      left: left,
      height: wrapperHeight,
      width: wrapperWidth
    });
  };

  resized();
  $(window).resize(function() {
    resized();
  });

  ko.applyBindings(new ViewModel());
});
