var VirtualKeyboard = {
    generate: function(target, matrix, language, uppercase = false) {
      var owner = this;
      
      for(var i = 0; i < matrix.length; i++) {
        var position = matrix[i];
        
        var vkr = document.createElement('div');
        vkr.setAttribute('class', 'virtual-keyboard-row');
        
        var vkc = document.createElement('div');
        vkc.setAttribute('class', 'virtual-keyboard-column');
        
        for (var j = 0; j < position.length; j++) {
          var button = document.createElement('button');
          
          switch(matrix[i][j]) {
            case '+backspace': 
              button.innerHTML = '&larr;';
              button.setAttribute('data-trigger', 'backspace');
              button.setAttribute('title', 'Backspace');
              /* the slicing using timer */
              var mouseTimerHandler = null;
              button.addEventListener("mousedown", function(event) {
  
                mouseTimerHandler = setInterval(function(){
                  if (event.which == 1) {
                    _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                  }
                }, 200);
              }, false);
              button.addEventListener("mouseup", function() {
                clearTimeout(mouseTimerHandler);
              });
              break;
              
            default: 
              button.innerText = uppercase ? (matrix[i][j]).toUpperCase() : matrix[i][j]; 
              break;
          }
          
          button.setAttribute('class', 'virtual-keyboard-button');
          button.addEventListener('click', function () {
            _lastElementFocused.focus();
            var x = this.getAttribute('data-trigger');
            if (x != null) {
              switch(x) {
                case 'backspace':
                  _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                  break;
                case 'international':
                  var reversed = language === 'en'? 'ru' : 'en';
                  target.innerHTML = '';
                  owner.generate(target,owner.getMatrix(reversed), reversed);
                  break;
                case 'space':
                  _lastElementFocused.value = _lastElementFocused.value + ' ';
                  break;
                case 'shift':
                  var u = uppercase === true ? false : true;
                  target.innerHTML = '';
                  owner.generate(target,owner.getMatrix(language), language, u);
                  break;
                      }
            }
            else {
              _lastElementFocused.value = _lastElementFocused.value + this.innerText;
            }
          });
          vkc.appendChild(button);
  
          vkr.appendChild(vkc);
          target.appendChild(vkr);
        }
      }
    },
    getMatrix: function(language) {
      var matrix = {en: [
        ['1','2','3','4','5','6','7','8','9','0','+backspace'],
        ['q','w','e','r','t','y','u','i','o','p','-'],
        ['a','s','d','f','g','h','j','k','l','+'],
        ['@','z','x','c','v','b','n','m','.','_'],
      ]}
      return matrix[language];
    },
    init: function(args) {
      if (args != undefined && args != null) {
        if (Object.keys(args).length > 0) {
          var owner = this;
  
          window._lastElementFocused = null;
  
          var target = document.getElementById(args['targetId']);
          var language = args['defaultLanguage'];
          var elements = document.querySelectorAll(args['inputSelector']);
  
          _lastElementFocused = elements[0];
  
          for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('focus', function () {
              _lastElementFocused = this;
              //console.log(_lastElementFocused);
            });
          }
          owner.generate(target,owner.getMatrix(language), language, args['uppercase']);
        }
      }
    }
  }
  
  // window.onload = () => {
  //   VirtualKeyboard.init({targetId: 'tabular-virtual-keyboard', defaultLanguage: 'en', inputSelector: '[data-virtual-element]'});
  // }