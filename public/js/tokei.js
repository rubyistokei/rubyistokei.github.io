jQuery(document).ready(function() {
  var TokeiViewModel = function(data) {
    var self = this;

    self.url = ko.observable();
    self.tokei = ko.observable();
    self.bio = ko.observable()
    self.name = ko.observable();
    self.title = ko.observable()

    self.fontSize = ko.computed(function() {
      return self.tokei().size() + 'px';
    }, self);

    self.top = ko.computed(function() {
      return self.tokei().top() + 'px';
    }, self);

    self.left = ko.computed(function() {
      return self.tokei().left() + 'px';
    }, self);

    self.color = ko.computed(function() {
      return self.tokei().color();
    }, self);

    ko.mapping.fromJS(data, {}, self);
  };

  var ViewModel = function() {
    var self = this;
    var mapping = {
      info: {
        create: function(options) {
          return new TokeiViewModel(options.data);
        },
        key: function(data) {
          return ko.utils.unwrapObservable(data.id);
        }
      }
    };

    self.moment = ko.observable(moment());
    setInterval(function() {
      self.moment(moment());
    }, 1000);

    self.local = ko.computed(function() {
      return self.moment().local();
    }, self);

    self.hour = ko.computed(function() {
      return self.local().format('HH');
    }, self);

    self.minute = ko.computed(function() {
      return self.local().format('mm');
    }, self);

    self.colonVisibility = ko.computed(function() {
      return self.local().second() % 2 === 0 ? 'visible' : 'hidden';
    }, self);

    self.info = ko.observableArray();

    self.current = ko.computed(function() {
      if (self.info().length === 0) {
        return null;
      }
      var number = self.local().minute() % self.info().length;
      return self.info()[number];
    }, self);

    self.refreshInfo = function() {
      $.get('/data.json').done(function(data) {
        ko.mapping.fromJS({info: data}, mapping, self);
      });
    };
    self.refreshInfo();
    setInterval(self.refreshInfo, 30 * 1000);
  };

  var boundingWidth = 1024;
  var boundingHeight = 1024;

  var resize = function(element) {
    var box = $('.tokei-box', element);

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scaleX = windowWidth / box.width();
    var scaleY = windowHeight / box.height();
    var scale = Math.min(scaleX, scaleY);
    var fitWidth = box.width() * scale;
    var fitHeight = box.height() * scale;
    var top  = (windowHeight - fitHeight) / scale / 2;
    var left = (windowWidth  - fitWidth ) / scale / 2;
    box.css({
      zoom: scale,
      '-moz-transform': 'translate(-50%,-50%) scale(' + scale + ') translate(50%,50%)',
      marginTop: top,
      marginLeft: left
    });
  };

  ko.bindingHandlers['tokei'] = {
    init: function(element, valueAccesor, allBindingsAccessor) {
      resize(element);
      $(window).resize(function() {
        resize(element);
      });
    },
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      var img = $('img.tokei-image', element).eq(0);
      if (value) {
        var url = value.url();
        var src = img.attr('src');
        if (url !== src) {
          var image = new Image();
          image.src = url;
          image.onload = function() {
            $('img.tokei-image', element).remove();

            var originalWidth = image.width;
            var originalHeight = image.height;
            var scaleX = boundingWidth / originalWidth;
            var scaleY = boundingHeight / originalHeight;
            var scale = Math.min(scaleX, scaleY);
            var fitWidth = originalWidth * scale;
            var fitHeight = originalHeight * scale;
            $(image).css({
              width: fitWidth,
              height: fitHeight
            });
            $(image).addClass('tokei-image');
            $('.tokei-box', element).append(image);
            $('.tokei-box', element).width(fitWidth).height(fitHeight);
            resize();
          };
        }
      }
    }
  };

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);
});
