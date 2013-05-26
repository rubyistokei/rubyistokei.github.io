jQuery(document).ready(function() {
  var TokeiViewModel = function(data) {
    var self = this;

    self.url = ko.observable();
    self.tokei = ko.observable();
    self.bio = ko.observable();
    self.name = ko.observable();
    self.title = ko.observable();
    self.taken_by = ko.observable();

    self.fontSize = ko.observable('128px');

    self.top = ko.computed(function() {
      return self.tokei().top() + 'px';
    }, self);

    self.left = ko.computed(function() {
      return self.tokei().left() + 'px';
    }, self);

    self.color = ko.computed(function() {
      return self.tokei().color();
    }, self);

    self.fontFamily = ko.computed(function() {
      if (self.tokei().font) {
        var fontName = self.tokei().font();
        WebFont.load({
          google: {
            families: [fontName]
          }
        });
        return fontName;
      } else {
        return 'Open Sans';
      }
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

    self.id = ko.observable();

    self.moment = ko.observable(moment());
    setInterval(function() {
      self.moment(moment());
    }, 1000);

    self.local = ko.computed(function() {
      return self.moment().local();
    }, self);

    self.hour = ko.computed(function() {
      return self.local().format('HH');
    }, self).extend({notifyOnlyChanged: true});

    self.minute = ko.computed(function() {
      return self.local().format('mm');
    }, self).extend({notifyOnlyChanged: true});

    self.colonVisibility = ko.computed(function() {
      return self.local().second() % 2 === 0 ? 'visible' : 'hidden';
    }, self);

    self.info = ko.observableArray();

    self.current = ko.computed(function() {
      var list = self.info();
      if (list.length === 0) {
        return null;
      }
      var number = Math.floor(self.moment().unix() / 60) % list.length;

      if (self.id()) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].id() === self.id()) {
            number = i;
            break;
          }
        }
      }

      return list[number];
    }, self).extend({notifyOnlyChanged: true});

    self.refreshInfo = function() {
      $.get('/data.json').done(function(data) {
        ko.mapping.fromJS({info: data}, mapping, self);
      });
    };
    self.refreshInfo();
    setInterval(self.refreshInfo, 60 * 1000);
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
      $(window).resize(function() {
        resize(element);
      });
      return ko.bindingHandlers['with'].init.apply(this, arguments);
    },
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var returnValue = ko.bindingHandlers['with'].update.apply(this, arguments);

      if (value) {
        var image = new Image();
        image.src = value.url();
        image.onload = function() {
          $('img.tokei-image', element).remove();

          var originalWidth = image.width;
          var originalHeight = image.height;

          var cropTop = 0;
          var cropLeft = 0;
          var cropWidth = originalWidth;
          var cropHeight = originalHeight;
          if (value.cropbox) {
            if (value.cropbox.top) {
              cropTop = value.cropbox.top();
            }
            if (value.cropbox.left) {
              cropLeft = value.cropbox.left();
            }
            if (value.cropbox.width) {
              cropWidth = value.cropbox.width();
            }
            if (value.cropbox.height) {
              cropHeight = value.cropbox.height();
            }
          }

          var scaleX = boundingWidth / cropWidth;
          var scaleY = boundingHeight / cropHeight;
          var scale = Math.min(scaleX, scaleY);
          var fitWidth = cropWidth * scale;
          var fitHeight = cropHeight * scale;

          $(image).css({
            top: -cropTop,
            left: -cropLeft,
            width: fitWidth * originalWidth / cropWidth,
            height: fitHeight * originalHeight / cropHeight
          });
          $(image).addClass('tokei-image');
          $('.tokei-box', element).append(image);
          $('.tokei-box', element).width(fitWidth).height(fitHeight);
          resize();
        };
      }
      return returnValue;
    }
  };

  ko.extenders.notifyOnlyChanged = function(target) {
    var lastValue = ko.observable();
    var result = ko.computed(function() {
      return lastValue();
    });

    lastValue(target());
    target.subscribe(function() {
      if (target() !== lastValue()) {
        lastValue(target());
      }
    });

    return result;
  };

  var viewModel = new ViewModel();
  var id = location.hash.replace(/^#/, '');
  viewModel.id(id);
  ko.applyBindings(viewModel);
});
