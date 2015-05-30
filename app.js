var cssHelper = (function () {
  var menu;
  var clickedEls = [];
  var appliedStyles = [];

  var createMenu = function () {
    var MENU_STYLE = {
      position: 'absolute',
      width: 200,
      border: '1px solid #000',
      backgroundColor: '#ccc',
      zIndex: 666
    };

    var menu = $(document.createElement('div')).css(MENU_STYLE);

    var createSection = function () {
      var SECTION_STYLE = {
        borderBottom: '1px solid #000',
        padding: '1em'
      };

      var section = $(document.createElement('div')).css(SECTION_STYLE);

      return section;
    };

    var createToolbar = function () {
      var TOOLBAR_STYLE = {
        borderBottom: '1px solid',
        backgroundColor: 'rgba(255,255,255,0.5)'
      };

      var toolbar = $(document.createElement('div')).css(TOOLBAR_STYLE);

      var createCloseBtn = function () {
        var CLOSE_STYLE = {
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'inline-block',
          margin: 'auto 4px'
        };

        var close = $(document.createElement('span')).css(CLOSE_STYLE).
          html('x').on('click', function (e) {
            e.preventDefault();
            menu.hide();
            removeHighlight();
          });

        return close;
      };

      toolbar.append(createCloseBtn());

      return toolbar;
    };

    var lastTarget;
    var lastTargetBoxShadow;
    var currentTarget;
    var currentTargetIndex;

    var removeHighlight = function () {
      $(lastTarget).css({ boxShadow: lastTargetBoxShadow });
    };

    var setTarget = function (target) {
      var highlight = { boxShadow: '0px 0px 9px 2px blueviolet' };

      removeHighlight();

      lastTargetBoxShadow = $(target).css('boxShadow');

      $(target).css(highlight);

      lastTarget = target;

      context.text(target.tagName);

      if (clickedEls.indexOf(target) === -1) {
        clickedEls.push(target);
      }

      currentTarget = target;
      currentTargetIndex = clickedEls.indexOf(target);
    };

    var move = function (left, top) {
      menu.offset({
        left: left,
        top: top
      });
    };

    var context = createSection().css({ backgroundColor: '#fff' });

    var applyStyle = function (style) {
      $(currentTarget).css(style);
      recordAppliedStyle(style);
    };

    var recordAppliedStyle = function (style) {
      appliedStyles[currentTargetIndex] = appliedStyles[currentTargetIndex] || {};
      appliedStyles[currentTargetIndex] = $.extend(appliedStyles[currentTargetIndex], style);
    };

    var createDropdown = function (options) {
      var select = $(document.createElement('select'));

      (options || []).forEach(function (optionConfig) {
        var option = document.createElement('option');
        option.setAttribute('value', optionConfig.value);
        option.innerText = optionConfig.text;
        select.append(option);
      });

      return select;
    };

    var createAttributeDropdown = function (attr, values) {
      var dropDown = createDropdown(values).on('change', function (e) {
        var style = {};
        style[attr] = this.value;
        applyStyle(style);
      });
      return dropDown;
    };

    menu.append(createToolbar());
    menu.append(context);
    menu.append(createSection().html('red text').on('click', function () {
      applyStyle({ color: 'red' });
    }));
    menu.append(createSection().html('purple text').on('click', function () {
      applyStyle({ color: 'purple' });
    }));
    menu.append(createSection().append(createAttributeDropdown('backgroundColor', [
      { text: 'red', value: 'red' },
      { text: 'orange', value: 'orange' },
      { text: 'yellow', value: 'yellow' },
      { text: 'green', value: 'green' },
      { text: 'blue', value: 'blue' },
      { text: 'indigo', value: 'indigo' },
      { text: 'violet', value: 'violet' },
    ])));

    return {
      el: menu,
      setTarget: setTarget,
      move: move
    };
  };

  var onRightClick = function (e) {
    menu = menu || createMenu();

    menu.setTarget(e.target);
    menu.el.appendTo(document.body);
    menu.el.show();
    menu.move(e.pageX, e.pageY);
  };

  document.oncontextmenu = function () {
    return false;
  };

  $(document).mousedown(function (e) { 
    if (e.which === 3) { 
      e.preventDefault();
      onRightClick(e);
    }
  });
}());
