jQuery(document).ready(function() {
  var TokeiViewModel = function(data) {
    var self = this;

    self.url = ko.observable();
    self.tokei = ko.observable();

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

  var boxWidth = 800;
  var boxHeight = 768;

  ko.bindingHandlers['tokei'] = {
    init: function(element, valueAccesor, allBindingsAccessor) {
      var resized = function() {
        var box = $('.tokei-box', element);
        box.width(boxWidth).height(boxHeight);

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
        $('.tokei-wrapper', element).css({
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
    },
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      var img = $('img.tokei-image', element).eq(0);
      if (value) {
        var url = value.url();
        var src = img.attr('src');
        if (url !== src) {
          img.attr('src', url);
          img.imagesLoaded(function() {
            var scaleX = boxWidth / img.width();
            var scaleY = boxHeight / img.height();
            var scale = (scaleX > scaleY) ? scaleY : scaleX;
            var fitWidth = img.width() * scale;
            var fitHeight = img.height() * scale;
            img.width(fitWidth);
            img.height(fitHeight);
          });
        }
      }
    }
  };

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);
});
