var rocky = require('rocky');

rocky.on('secondchange', function() {
  var d = new Date();
  var seconds = d.getSeconds();
  //console.log(seconds);
  //if(seconds % 12 === 0) { // doesn't work as intented at the moment
    rocky.requestDraw();    
  //}
});

rocky.on('minutechange', function() {
  rocky.requestDraw();
});

rocky.on('daychange', function() {
  rocky.requestDraw();
});


rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  var d = new Date();

  // Center align the text
  ctx.textAlign = 'center';
  
  var hours = d.getHours().toString();  
  var minutes = d.getMinutes().toString();
  var seconds = d.getSeconds();
  
    
  // Quintum display
  var colors = ['#AA00FF', '#00AAFF', '#55FF00', '#FFAA00', '#FF0000']; // violet, blue, green, orange, red
  var quintum = Math.ceil(seconds/12);
  if(quintum < 1) quintum = 1;

  for(var i = quintum; i > 0; i--) {
    var quintumWidth = (w/5) * i;
    ctx.fillStyle = colors[i - 1];
    ctx.fillRect(0, h-3, quintumWidth, 3);
  }  
  
  // Display time
  ctx.fillStyle = 'white';
  ctx.font = '42px bold numbers Leco-numbers';
  
  if(hours.length === 1) hours = '0' + hours;
  if(minutes.length === 1) minutes = '0' + minutes;
  
  var timeStr = hours + ':' + minutes;
  ctx.fillText(timeStr, w / 2, (h / 2) - 62, w);

  
  ctx.font = '14px bold Gothic';

  // For the initiates
  if(d.getDay() === 5) { 
    ctx.fillStyle = '#55FF00';
    ctx.fillText("Hot Dog Day", w / 2, (h / 2) - 10, w);  
  }

  // Display discordian date
  ctx.fillStyle = 'white';
  var now = new DDate();
  timeStr = "It's %{%A,%nthe %e of %B%}, %Y. %N%nCelebrate %H :D";
  ctx.fillText(now.format(timeStr), w / 2, (h / 2) + 10, w);
});




// JS port of ddate
// Copypasta'ed from:
// https://github.com/ishmayeck/node-ddate/blob/master/ddate.js

var days = [
    { l: 'Sweetmorn', s: 'SM' },
    { l: 'Boomtime', s: 'BT' },
    { l: 'Pungenday', s: 'PD' },
    { l: 'Prickle-Prickle', s: 'PP' },
    { l: 'Setting Orange', s: 'SO' }
];

var seasons = [
    { l: 'Chaos', s: 'Chs' },
    { l: 'Discord', s: 'Dsc' },
    { l: 'Confusion', s: 'Cfn' },
    { l: 'Bureaucracy', s: 'Bcy' },
    { l: 'The Aftermath', s: 'Afm' }
];

var holydays = {
    'Chaos': {
        5: 'Mungday',
        50: 'Chaoflux'
    },
    'Discord': {
        5: 'Mojoday',
        50: 'Discoflux'
    },
    'Confusion': {
        5: 'Syaday',
        50: 'Confuflux'
    },
    'Bureaucracy': {
        5: 'Zaraday',
        50: 'Bureflux'
    },
    'The Aftermath': {
        5: 'Maladay',
        50: 'Afflux'
    }
};

var minute = 1000 * 60;
var day = minute * 60 * 24;
var year = day * 365;

var DDate = function(epooch) {
    /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */
    this.date = {};

    this.initificate = function(epooch) {
        epooch -= new Date().getTimezoneOffset() * minute;
        var leps = Math.floor(epooch / year / 4);
        epooch -= leps * day;

        var cur = Math.floor((epooch % year) / day);
        var flarf = Math.floor(epooch / (day * 365)) + 3136;
        var ist = ((flarf - 3130) % 4 == 0);
        this.tabby = (ist && cur == 59);
        if(ist && cur > 59) cur -= 1;

        var gwar = Math.floor(cur % 73) + 1;
        var sn = Math.floor(cur / 73);
        var woody = 0;
        for(var i = 1; i <= cur; i++) {
            woody = (woody == 4) ? 0 : woody + 1;
        }
        var hoyl = holydays[seasons[sn].l][gwar] || false;
        this.numricks = [ woody, sn, gwar, flarf, hoyl ];
        if(this.tabby) return { tibs: true, year: flarf };
        return {
            tibs: false,
            day: days[woody],
            season: seasons[sn],
            date: gwar,
            year: flarf,
            holyday: hoyl
        };
    };

    this.numberize = function(num) {
        var thtaghn = (num % 100) > 9 && (num % 100) < 15;
        switch(num % 10) {
            case 1:
                return num + (thtaghn ? 'th' : 'st');
            case 2:
                return num + (thtaghn ? 'th' : 'nd');
            case 3:
                return num + (thtaghn ? 'th' : 'rd');
            case 4:
            default:
                return num + 'th';
        }
    };

    this.toOldImmediateDateFormat = function() {
        return this.date.day.l + ', the ' + this.numberize(this.date.date) + ' day of ' +
            this.date.season.l + ' in the YOLD ' + this.date.year;
    };

    this.toDateString = function() {
        return this.format("%{%A, %B %e%}, %Y YOLD");
    };

    this.getDate = function() {
        return this.date;
    };

    this.format = function(str) {
        if(!str) return;
        var r = '';
        var stopit = false;
        var tibsing = false;
        for(var i = 0; i < str.length; i++) {
            if(stopit) break;
            if(str[i] == '%' && str[i+1] == '}') tibsing = ((i += 2) == Infinity);
            if(tibsing) continue;
            if(str[i] == '%') {
                switch(str[i+1]) {
                    case 'A':
                        r += days[this.numricks[0]].l;
                        break;
                    case 'a':
                        r += days[this.numricks[0]].s;
                        break;
                    case 'B':
                        r += seasons[this.numricks[1]].l;
                        break;
                    case 'b':
                        r += seasons[this.numricks[1]].s;
                        break;
                    case 'd':
                        r += this.numricks[2];
                        break;
                    case 'e':
                        r += this.numberize(this.numricks[2]);
                        break;
                    case 'H':
                        r += this.numricks[4] || '';
                        break;
                    case 'N':
                        stopit = !Boolean(this.numricks[4]);
                        break;
                    case 'n':
                        r += '\n';
                        break;
                    case 't':
                        r += '\t';
                        break;
                    case '{':
                        if(this.tabby) tibsing = ((r += "St. Tib's Day") != Infinity);
                        break;
                    case '.':
                        r += "I've nothing to say to you. (yet)";
                        break;
                    case 'Y':
                        r += this.numricks[3];
                        break;
                    default:
                        r += str[i];
                        break;
                }
                i++;
            } else {
                r += str[i];
            }
        }
        return r;
    };

    this.date = this.initificate(epooch || new Date().getTime());
};