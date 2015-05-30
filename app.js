var menu;
var clickedEls = [];
var appliedStyles = [];

var elementFactory = {
  element: function (tagName, style) {
    return $(document.createElement(tagName)).css(style || {});
  },
  button: function (text, onClick) {
    return this.element('button').text(text).on('click', onClick);
  },
  section: function () {
    var SECTION_STYLE = {
      borderBottom: '1px solid #000',
      padding: '1em'
    };

    return this.element('div', SECTION_STYLE);
  },
  menu: function () {
    var MENU_STYLE = {
      position: 'absolute',
      width: 200,
      border: '1px solid #000',
      backgroundColor: '#ccc',
      zIndex: 666
    };
    
    return this.element('div', MENU_STYLE);
  },
  toolbar: function () {
    var TOOLBAR_STYLE = {
      borderBottom: '1px solid',
      backgroundColor: 'rgba(255,255,255,0.5)'
    };

    return this.element('div', TOOLBAR_STYLE);
  },
  closeButton: function () {
    var CLOSE_STYLE = {
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'inline-block',
      margin: 'auto 4px'
    };

    return this.element('span', CLOSE_STYLE).html('x');
  }
};

var createMenu = function () {
  var menu = elementFactory.menu();

  var createToolbar = function () {
    var toolbar = elementFactory.toolbar();

    var createCloseBtn = function () {
      return elementFactory.closeButton().on('click', function (e) {
        e.preventDefault();
        menu.hide();
        removeHighlight();
      });
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

  var context = elementFactory.section().css({ backgroundColor: '#fff' });

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

  var section = elementFactory.section().append(elementFactory.button('clicker', function () {
    console.log('clicked!');
  }));

  menu.append(createToolbar());
  menu.append(context);
  menu.append(section);
  menu.append(elementFactory.section().html('red text').on('click', function () {
    applyStyle({ color: 'red' });
  }));
  menu.append(elementFactory.section().html('purple text').on('click', function () {
    applyStyle({ color: 'purple' });
  }));
  menu.append(elementFactory.section().append(createAttributeDropdown('backgroundColor', [
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
