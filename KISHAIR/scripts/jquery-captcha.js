
;
let Captcha;
(function($) {
  'use strict';
  const resourceUpper = ['A','B','C','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'];
  const resourceLower =['A','B','C','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z']; //['a','b','c','e','f','g','h','j','k','l','m','n','p','q','r','s','t','w','x','y','z'];
  const resourceNumber = ['0','1','2','3','4','5','6','7','8','9'];

  Captcha = function(element, options) {
    const self = this;
    const defaults = {
      length: 4,                    
      width: 100,                  
      height: 40,                    
      font: 'bold 23px Arial',     
      resourceType: 'aA0',           
      resourceExtra: [],             
      clickRefresh: true,            
      autoRefresh: true,            
      caseSensitive: false,          
    };

    self.element = element;

    self.options = $.extend(true, defaults, options);

    
    let resource = [];
    if (self.options.resourceType.length > 0) {
      if (self.options.resourceType.indexOf('A') !== -1) {
        resource = resource.concat(resourceUpper);
      }
      if (self.options.resourceType.indexOf('a') !== -1) {
        resource = resource.concat(resourceLower);
      }
      if (self.options.resourceType.indexOf('0') !== -1) {
        resource = resource.concat(resourceNumber);
      }
    }
    if (self.options.resourceExtra.length > 0) {
      resource = resource.concat(self.options.resourceExtra);
    }
    
    if (resource.length === 0) {
      resource = resourceUpper.concat(resourceLower).concat(resourceNumber)
    }
    self.resource = resource;

    if (self.options.clickRefresh) {
      self.element.on('click', function () {
          self.refresh();
      });
    }
    self.refresh();
  };
   
  Captcha.prototype.refresh = function() {
    const self = this;

    const canvas = self.element[0];                     
    canvas.width = self.options.width;
    canvas.height = self.options.height;
    const context = canvas.getContext("2d");             
    context.font = self.options.font;

    const codes = self.randomCode();

    const spaceWidth = canvas.width - context.measureText(codes.join('')).width - 40;
    const wordSpace = Math.floor(spaceWidth / codes.length);

    let left = 10;
    for (let i = 0; i < codes.length; i++) {
      const deg = Math.random() * 30 * Math.PI / 180;     
      const x = left;                                    
      const y = canvas.height / 2 + Math.random()*10;    

      context.translate(x, y);
      context.rotate(deg);

      context.fillStyle = self.randomColor();
      context.fillText(codes[i], 0, 0);

      context.rotate(-deg);
      context.translate(-x, -y);

      left += context.measureText(codes[i]).width + wordSpace + Math.floor(Math.random()*5);
    }
    self.code = codes;

    const strokeLength = codes.length * Math.round(Math.random()+1) + 3;
    for (let i = 0; i < strokeLength; i++) {
      context.strokeStyle = self.randomColor(true);
      context.beginPath();
     
      context.moveTo(Math.random() * self.options.width, Math.random() * self.options.height);
      context.lineTo(Math.random() * self.options.width, Math.random() * self.options.height);
     
      const x = Math.random() * self.options.width;
      const y = Math.random() * self.options.height;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }
  };
  
  Captcha.prototype.getCode = function() {
    return this.code.join('');
  };
   
  Captcha.prototype.valid = function(code) {
    const self = this;
    let ans = false;
    if (!self.options.caseSensitive) {
      ans = code.toLowerCase() === self.getCode().toLowerCase();
    } else {
      ans = code === self.getCode();
    }
    if (!ans && self.options.autoRefresh) {
      self.refresh();
    }
    return ans;
  };
   
  Captcha.prototype.randomCode = function() {
    const self = this;
    const codes = [];
    const resourceLength = self.resource.length;
    for (let i = 0; i < self.options.length; i++) {
      const txt = self.resource[Math.floor(Math.random() * resourceLength)];  
      codes.push(txt);
    }
    return codes;
  };
   
  Captcha.prototype.randomColor = function(alpha) {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    if (!alpha) {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    const a = Math.random();
    return 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
  };
})($);
