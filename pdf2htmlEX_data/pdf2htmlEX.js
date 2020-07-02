/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab filetype=javascript : */
/**
 * @license pdf2htmlEX.js: Core UI functions for pdf2htmlEX
 * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> and other contributors
 * https://github.com/coolwanglu/pdf2htmlEX/blob/master/share/LICENSE
 */

/*
 * Attention:
 * This files is to be optimized by closure-compiler,
 * so pay attention to the forms of property names:
 *
 * string/bracket form is safe, won't be optimized:
 * var obj={ 'a':'b' }; obj['a'] = 'b';
 * name/dot form will be optimized, the name is likely to be modified:
 * var obj={ a:'b' }; obj.a = 'b';
 *
 * Either form can be used for internal objects,
 * but must be consistent for each one respectively.
 *
 * string/bracket form must be used for external objects
 * e.g. DEFAULT_CONFIG, object stored in page-data
 * property names are part of the `protocol` in these cases.
 *
 */

'use strict';

var pdf2htmlEX = window['pdf2htmlEX'] = window['pdf2htmlEX'] || {};

/**
 * @const
 * @struct
 */
var CSS_CLASS_NAMES = {
  page_frame       : 'pf',
  page_content_box : 'pc',
  page_data        : 'pi',
  background_image : 'bi',
  link             : 'l',
  input_radio      : 'ir',
  __dummy__        : 'no comma'
};

/**
 * configurations of Viewer
 * @const
 * @dict
 */
var DEFAULT_CONFIG = {
  // id of the element to put the pages in
  'container_id' : 'page-container',
  // id of the element for sidebar (to open and close)
  'sidebar_id' : 'sidebar',
  // id of the element for outline
  'outline_id' : 'outline',
  // class for the loading indicator
  'loading_indicator_cls' : 'loading-indicator',
  // How many page shall we preload that are below the last visible page
  'preload_pages' : 3,
  // how many ms should we wait before actually rendering the pages and after a scroll event
  'render_timeout' : 100,
  // zoom ratio step for each zoom in/out event
  'scale_step' : 0.9,
  // register global key handler, allowing navigation by keyboard
  'key_handler' : true,
  // register hashchange handler, navigate to the location specified by the hash
  'hashchange_handler' : true,
  'sidebar_toggle_button_id': 'sidebarToggle',
  // register view history handler, allowing going back to the previous location
  'view_history_handler' : true,
  'maximum_scale': 10,
  'minimum_scale': 0.1,
  'pinch_to_scale': true,
  'cache_view_hash_interval': 3000,
  '__dummy__'        : 'no comma'
};

/** @const */
var EPS = 1e-6;

/************************************/
/* utility function */

/**
 * md5
 */
var MD5 = function (string) {

  function RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
  }

  function AddUnsigned(lX,lY) {
    var lX4,lY4,lX8,lY8,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  function F(x,y,z) { return (x & y) | ((~x) & z); }
  function G(x,y,z) { return (x & z) | (y & (~z)); }
  function H(x,y,z) { return (x ^ y ^ z); }
  function I(x,y,z) { return (y ^ (x | (~z))); }

  function FF(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function GG(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function HH(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function II(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords-1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
  };

  function WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
      lByte = (lValue>>>(lCount*8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
  };

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  var x=Array();
  var k,AA,BB,CC,DD,a,b,c,d;
  var S11=7, S12=12, S13=17, S14=22;
  var S21=5, S22=9 , S23=14, S24=20;
  var S31=4, S32=11, S33=16, S34=23;
  var S41=6, S42=10, S43=15, S44=21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

  for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=AddUnsigned(a,AA);
    b=AddUnsigned(b,BB);
    c=AddUnsigned(c,CC);
    d=AddUnsigned(d,DD);
  }

  var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

  return temp.toLowerCase();
}
/**
 * @param{Array.<number>} ctm
 */
function invert(ctm) {
  var det = ctm[0] * ctm[3] - ctm[1] * ctm[2];
  return [ ctm[3] / det
          ,-ctm[1] / det
          ,-ctm[2] / det
          ,ctm[0] / det
          ,(ctm[2] * ctm[5] - ctm[3] * ctm[4]) / det
          ,(ctm[1] * ctm[4] - ctm[0] * ctm[5]) / det
        ];
};
/**
 * @param{Array.<number>} ctm
 * @param{Array.<number>} pos
 */
function transform(ctm, pos) {
  return [ctm[0] * pos[0] + ctm[2] * pos[1] + ctm[4]
         ,ctm[1] * pos[0] + ctm[3] * pos[1] + ctm[5]];
};

/**
 * @param{Element} ele
 */
function get_page_number(ele) {
  return parseInt(ele.getAttribute('data-page-no'), 16);
};

/**
 * @param{NodeList} eles
 */
function disable_dragstart(eles) {
  for (var i = 0, l = eles.length; i < l; ++i) {
    eles[i].addEventListener('dragstart', function() {
      return false;
    }, false);
  }
};

/**
 * @param{...Object} var_args
 */
function clone_and_extend_objs(var_args) {
  var result_obj = {};
  for (var i = 0, l = arguments.length; i < l; ++i) {
    var cur_obj = arguments[i];
    for (var k in cur_obj) {
      if (cur_obj.hasOwnProperty(k)) {
        result_obj[k] = cur_obj[k];
      }
    }
  }
  return result_obj;
};

/**
 * @constructor
 * @param{Element} page The element for the page
 */
function Page(page) {
  if (!page) return;

  this.loaded = false;
  this.shown = false;
  this.page = page; // page frame element

  this.num = get_page_number(page);

  // page size
  // Need to make rescale work when page_content_box is not loaded, yet
  this.original_height = page.clientHeight;
  this.original_width = page.clientWidth;

  // content box
  var content_box = page.getElementsByClassName(CSS_CLASS_NAMES.page_content_box)[0];

  // if page is loaded
  if (content_box) {
    this.content_box = content_box;
    /*
     * scale ratios
     *
     * original_scale : the first one
     * cur_scale : currently using
     */
    this.original_scale = this.cur_scale = this.original_height / content_box.clientHeight;
    this.page_data = JSON.parse(page.getElementsByClassName(CSS_CLASS_NAMES.page_data)[0].getAttribute('data-data'));

    this.ctm = this.page_data['ctm'];
    this.ictm = invert(this.ctm);

    this.loaded = true;
  }
};
Page.prototype = {
  /* hide & show are for contents, the page frame is still there */
  hide : function(){
    if (this.loaded && this.shown) {
      this.content_box.classList.remove('opened');
      this.shown = false;
    }
  },
  show : function(){
    if (this.loaded && !this.shown) {
      this.content_box.classList.add('opened');
      this.shown = true;
    }
  },
  /**
   * @param{number} ratio
   */
  rescale : function(ratio) {
    if (ratio === 0) {
      // reset scale
      this.cur_scale = this.original_scale;
    } else {
      this.cur_scale = ratio;
    }

    // scale the content box
    if (this.loaded) {
      var cbs = this.content_box.style;
      cbs.msTransform = cbs.webkitTransform = cbs.transform = 'scale('+this.cur_scale.toFixed(3)+')';
    }

    // stretch the page frame to hold the place
    {
      var ps = this.page.style;
      ps.height = (this.original_height * this.cur_scale) + 'px';
      ps.width = (this.original_width * this.cur_scale) + 'px';
    }
  },
  /*
   * return the coordinate of the top-left corner of container
   * in our coordinate system
   * assuming that p.parentNode === p.offsetParent
   */
  view_position : function () {
    var p = this.page;
    var c = p.parentNode;
    return [c.scrollLeft - p.offsetLeft - p.clientLeft
           ,c.scrollTop - p.offsetTop - p.clientTop];
  },
  height : function () {
    return this.page.clientHeight;
  },
  width : function () {
    return this.page.clientWidth;
  }
};

/**
 * @constructor
 * @param{Object=} config
 */
function Viewer(config) {
  this.config = clone_and_extend_objs(DEFAULT_CONFIG, (arguments.length > 0 ? config : {}));
  this.pages_loading = [];
  this.init_before_loading_content();

  var self = this;
  // document.addEventListener('DOMContentLoaded', function(){
  //   self.init_after_loading_content();
  // }, false);
};

Viewer.prototype = {
  scale : 1,
  /*
   * index of the active page (the one with largest visible area)
   * which estimates the page currently being viewed
   */
  cur_page_idx : 0,

  /*
   * index of the first visible page
   * used when determining current view
   */
  first_page_idx : 0,

  init_before_loading_content : function() {
    /* hide all pages before loading, will reveal only visible ones later */
    this.pre_hide_pages();
  },

  initialize_radio_button : function() {
    var elements = document.getElementsByClassName(CSS_CLASS_NAMES.input_radio);

    for(var i = 0; i < elements.length; i++) {
      var r = elements[i];

      r.addEventListener('click', function() {
        this.classList.toggle("checked");
      });
    }
  },

  init_after_loading_content : function() {
    this.sidebar = document.getElementById(this.config['sidebar_id']);
    this.outline = document.getElementById(this.config['outline_id']);
    this.container = document.getElementById(this.config['container_id']);
    this.sidebar_toggle_btn = document.getElementById(this.config['sidebar_toggle_button_id']);
    this.loading_indicator = document.getElementsByClassName(this.config['loading_indicator_cls'])[0];


    {
      // show the toggle sidebar button if outline not empty
      var empty = true;
      var nodes = this.outline.childNodes;
      for (var i = 0, l = nodes.length; i < l; ++i) {
        var cur_node = nodes[i];
        if (cur_node.nodeName.toLowerCase() === 'ul') {
          empty = false;
          break;
        }
      }
      if (!empty){
        this.sidebar_toggle_btn.classList.remove('hide');
        this.sidebar_toggle_btn.classList.add('show');
      }
    }

    this.find_pages();
    // do nothing if there's nothing
    if(this.pages.length == 0) return;

    // disable dragging of background images
    disable_dragstart(document.getElementsByClassName(CSS_CLASS_NAMES.background_image));

    if (this.config['key_handler'])
      this.register_key_handler();

    var self = this;

    if (this.config['hashchange_handler']) {
      window.addEventListener('hashchange', function(e) {
        self.navigate_and_remove_hash();
      }, false);
    }

    if (this.config['view_history_handler']) {
      window.addEventListener('popstate', function(e) {
        if(e.state) self.navigate_to_dest(e.state);
      }, false);
    }
    if (this.config['pinch_to_scale']) {
      this.container.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
          self.scaling = true;
          self.pinchStart(e);
        }
      }, false);
      this.container.addEventListener('touchmove', function(e) {
        if (self.scaling) {
          self.pinchMove(e);
        }
      }, false);
      this.container.addEventListener('touchend', function(e) {
        if (self.scaling) {
          self.pinchEnd(e);
          self.scaling = false;
        }
      }, false);
    }

    // register schedule rendering
    // renew old schedules since scroll() may be called frequently
    this.container.addEventListener('scroll', function() {
      self.update_page_idx();
      self.schedule_render(true);
    }, false);

    // handle links
    [this.container, this.outline].forEach(function(ele) {
      ele.addEventListener('click', self.link_handler.bind(self), false);
    });

    this.initialize_radio_button();
    this.render();
    this.fit_width();
    this.navigate_and_remove_hash();
    this.schedule_cache_current_view_hash();
  },
  navigate_and_remove_hash: function () {
    if(!!document.location.hash.substring(1)) {
      this.navigate_to_dest(document.location.hash.substring(1));
    } else {
      var loc = window.location.href, index = loc.indexOf('#');
      var url = index > 0 ? loc.substring(0, index) : loc;
      var cache_view_hash = localStorage.getItem('pdf2html_view_hash_' + MD5(url));
      this.navigate_to_dest(cache_view_hash);
    }
    window.history.replaceState("", document.title, window.location.pathname);
  },
  /*
   *  save position and scale cache
   */
  cache_current_view_hash: function() {
    var cur_hash = pdf2htmlEX.defaultViewer.get_current_view_hash();
    var loc = window.location.href, index = loc.indexOf('#');
    var url = index > 0 ? loc.substring(0, index) : loc;
    localStorage.setItem('pdf2html_view_hash_' + MD5(url), cur_hash);
    pdf2htmlEX.defaultViewer.schedule_cache_current_view_hash();
  },
  schedule_cache_current_view_hash: function() {
    var self = this;
    setTimeout(self.cache_current_view_hash, this.config['cache_view_hash_interval']);
  },
  /*
   * set up this.pages and this.page_map
   * pages is an array holding all the Page objects
   * page-Map maps an original page number (in PDF) to the corresponding index in page
   */
  find_pages : function() {
    var new_pages = [];
    var new_page_map = {};
    var nodes = this.container.childNodes;
    for (var i = 0, l = nodes.length; i < l; ++i) {
      var cur_node = nodes[i];
      if ((cur_node.nodeType === Node.ELEMENT_NODE)
          && cur_node.classList.contains(CSS_CLASS_NAMES.page_frame)) {
        var p = new Page(cur_node);
        new_pages.push(p);
        new_page_map[p.num] = new_pages.length - 1;
      }
    }
    this.pages = new_pages;
    this.page_map = new_page_map;
  },

  /**
   * @param{number} idx
   * @param{number=} pages_to_preload
   * @param{function(Page)=} callback
   *
   * TODO: remove callback -> promise ?
   */
  load_page : function(idx, pages_to_preload, callback) {
    var pages = this.pages;
    if (idx >= pages.length)
      return;  // Page does not exist

    var cur_page = pages[idx];
    if (cur_page.loaded)
      return;  // Page is loaded

    if (this.pages_loading[idx])
      return;  // Page is already loading

    var cur_page_ele = cur_page.page;
    var url = cur_page_ele.getAttribute('data-page-url');
    if (url) {
      this.pages_loading[idx] = true;       // set semaphore

      // add a copy of the loading indicator if not already present
      var new_loading_indicator = cur_page_ele.getElementsByClassName(this.config['loading_indicator_cls'])[0];
      if (typeof new_loading_indicator === 'undefined'){
        new_loading_indicator = this.loading_indicator.cloneNode(true);
        new_loading_indicator.classList.add('active');
        cur_page_ele.appendChild(new_loading_indicator);
      }

      // load data
      {
        var self = this;
        var _idx = idx;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function(){
          if (xhr.status === 200 || xhr.status === 0) {
            // find the page element in the data
            var div = document.createElement('div');
            div.innerHTML = xhr.responseText;

            var new_page = null;
            var nodes = div.childNodes;
            for (var i = 0, l = nodes.length; i < l; ++i) {
              var cur_node = nodes[i];
              if ((cur_node.nodeType === Node.ELEMENT_NODE)
                  && cur_node.classList.contains(CSS_CLASS_NAMES.page_frame)) {
                new_page = cur_node;
                break;
              }
            }

            // replace the old page with loaded data
            // the loading indicator on this page should also be destroyed
            var p = self.pages[_idx];
            self.container.replaceChild(new_page, p.page);
            p = new Page(new_page);
            self.pages[_idx] = p;

            p.hide();
            p.rescale(self.scale);

            // disable background image dragging
            disable_dragstart(new_page.getElementsByClassName(CSS_CLASS_NAMES.background_image));

            self.schedule_render(false);

            if (callback){ callback(p); }
          }

          // Reset loading token
          delete self.pages_loading[_idx];
        };
        xhr.send(null);
      }
    }
    // Concurrent prefetch of the next pages
    if (pages_to_preload === undefined)
      pages_to_preload = this.config['preload_pages'];

    if (--pages_to_preload > 0) {
      var self = this;
      setTimeout(function() {
        self.load_page(idx+1, pages_to_preload);
      },0);
    }
  },

  /*
   * Hide all pages that have no 'opened' class
   * The 'opened' class will be added to visible pages by JavaScript
   * We cannot add this in the default CSS because JavaScript may be disabled
   */
  pre_hide_pages : function() {
    /* pages might have not been loaded yet, so add a CSS rule */
    var s = '@media screen{.'+CSS_CLASS_NAMES.page_content_box+'{display:none;}}';
    var n = document.createElement('style');
    if (n.styleSheet) {
      n.styleSheet.cssText = s;
    } else {
      n.appendChild(document.createTextNode(s));
    }
    document.head.appendChild(n);
  },

  /*
   * show visible pages and hide invisible pages
   */
  render : function () {
    var container = this.container;
    /*
     * show the pages that are 'nearly' visible -- it's right above or below the container
     *
     * all the y values are in the all-page element's coordinate system
     */
    var container_min_y = container.scrollTop;
    var container_height = container.clientHeight;
    var container_max_y = container_min_y + container_height;
    var visible_min_y = container_min_y - container_height;
    var visible_max_y = container_max_y + container_height;

    var cur_page_fully_visible = false;
    var cur_page_idx = this.cur_page_idx;
    var max_visible_page_idx = cur_page_idx;
    var max_visible_ratio = 0.0;

    var pl = this.pages;
    for (var i = 0, l = pl.length; i < l; ++i) {
      var cur_page = pl[i];
      var cur_page_ele = cur_page.page;
      var page_min_y = cur_page_ele.offsetTop + cur_page_ele.clientTop;
      var page_height = cur_page_ele.clientHeight;
      var page_max_y = page_min_y + page_height;
      if ((page_min_y <= visible_max_y) && (page_max_y >= visible_min_y))
      {
        // cur_page is 'nearly' visible, show it or load it
        if (cur_page.loaded) {
          cur_page.show();
        } else {
          this.load_page(i);
        }
      } else {
        cur_page.hide();
      }
    }
  },
  /*
   * update cur_page_idx and first_page_idx
   * normally called upon scrolling
   */
  update_page_idx: function () {
    var pages = this.pages;
    var pages_len = pages.length;
    // there is no chance that cur_page_idx or first_page_idx is modified
    if (pages_len < 2) return;

    var container = this.container;
    var container_min_y = container.scrollTop;
    var container_max_y = container_min_y + container.clientHeight;

    // binary search for the first page
    // whose bottom border is below the top border of the container
    var first_idx = -1;
    var last_idx = pages_len;
    var rest_len = last_idx - first_idx;
    // TODO: use current first_page_idx as a hint?
    while(rest_len > 1) {
      var idx = first_idx + Math.floor(rest_len / 2);
      var cur_page_ele = pages[idx].page;
      if (cur_page_ele.offsetTop + cur_page_ele.clientTop + cur_page_ele.clientHeight >= container_min_y) {
        last_idx = idx;
      } else {
        first_idx = idx;
      }
      rest_len = last_idx - first_idx;
    }

    /*
     * with malformed settings it is possible that no page is visible, e.g.
     * - the container is to thin, which lies in the margin between two pages
     * - all pages are completely above or below the container
     * but we just assume that they won't happen.
     */
    this.first_page_idx = last_idx;

    // find the page with largest visible area
    var cur_page_idx = this.cur_page_idx;
    var max_visible_page_idx = cur_page_idx;
    var max_visible_ratio = 0.0;

    for(var i = last_idx; i < pages_len; ++i) {
      var cur_page_ele = pages[i].page;
      var page_min_y = cur_page_ele.offsetTop + cur_page_ele.clientTop;
      var page_height = cur_page_ele.clientHeight;
      var page_max_y = page_min_y + page_height;
      if (page_min_y > container_max_y) break;

      // check the visible fraction of the page
      var page_visible_ratio = ( Math.min(container_max_y, page_max_y)
                                 - Math.max(container_min_y, page_min_y)
                               ) / page_height;

      // stay with the current page if it is still fully visible
      if ((i === cur_page_idx) && (Math.abs(page_visible_ratio - 1.0) <= EPS)) {
        max_visible_page_idx = cur_page_idx;
        break;
      }

      if (page_visible_ratio > max_visible_ratio) {
        max_visible_ratio = page_visible_ratio;
        max_visible_page_idx = i;
      }
    }

    this.cur_page_idx = max_visible_page_idx;
  },

  /**
   * @param{boolean} renew renew the existing schedule instead of using the old one
   */
  schedule_render : function(renew) {
    if (this.render_timer !== undefined) {
      if (!renew) return;
      clearTimeout(this.render_timer);
    }

    var self = this;
    this.render_timer = setTimeout(function () {
      /*
       * render() may trigger load_page(), which may in turn trigger another render()
       * so delete render_timer first
       */
      delete self.render_timer;
      self.render();
    }, this.config['render_timeout']);
  },

  /*
   * Handling key events, zooming, scrolling etc.
   */
  register_key_handler: function () {
    /*
     * When user try to zoom in/out using ctrl + +/- or mouse wheel
     * handle this and prevent the default behaviours
     *
     * Code credit to PDF.js
     */
    var self = this;

    // Firefox specific event, so that we can prevent browser from zooming
    window.addEventListener('DOMMouseScroll', function(e) {
      if (e.ctrlKey) {
        e.preventDefault();
        var container = self.container;
        var rect = container.getBoundingClientRect();
        var fixed_point = [e.clientX - rect['left'] - container.clientLeft
                          ,e.clientY - rect['top'] - container.clientTop];
        self.rescale(Math.pow(self.config['scale_step'], e.detail), true, fixed_point);
      }
    }, false);

    window.addEventListener('keydown', function(e) {
      var handled = false;
      /*
      var cmd = (e.ctrlKey ? 1 : 0)
                | (e.altKey ? 2 : 0)
                | (e.shiftKey ? 4 : 0)
                | (e.metaKey ? 8 : 0)
                ;
                */
      var with_ctrl = e.ctrlKey || e.metaKey;
      var with_alt = e.altKey;
      switch (e.keyCode) {
        case 61: // FF/Mac '='
        case 107: // FF '+' and '='
        case 187: // Chrome '+'
          if (with_ctrl){
            self.rescale(1.0 / self.config['scale_step'], true);
            handled = true;
          }
          break;
        case 173: // FF/Mac '-'
        case 109: // FF '-'
        case 189: // Chrome '-'
          if (with_ctrl){
            self.rescale(self.config['scale_step'], true);
            handled = true;
          }
          break;
        case 48: // '0'
          if (with_ctrl){
            self.rescale(0, false);
            handled = true;
          }
          break;
        case 33: // Page UP:
          if (with_alt) { // alt-pageup    -> scroll one page up
            self.scroll_to(self.cur_page_idx - 1);
          } else { // pageup        -> scroll one screen up
            self.container.scrollTop -= self.container.clientHeight;
          }
          handled = true;
          break;
        case 34: // Page DOWN
          if (with_alt) { // alt-pagedown  -> scroll one page down
            self.scroll_to(self.cur_page_idx + 1);
          } else { // pagedown      -> scroll one screen down
            self.container.scrollTop += self.container.clientHeight;
          }
          handled = true;
          break;
        case 35: // End
          self.container.scrollTop = self.container.scrollHeight;
          handled = true;
          break;
        case 36: // Home
          self.container.scrollTop = 0;
          handled = true;
          break;
      }
      if (handled) {
        e.preventDefault();
        return;
      }
    }, false);
  },

  /**
   * @param{number} ratio
   * @param{boolean} is_relative
   * @param{Array.<number>=} fixed_point preserve the position (relative to the top-left corner of the viewer) after rescaling
   */
  rescale : function (ratio, is_relative, fixed_point) {
    var old_scale = this.scale;
    var new_scale = old_scale;
    // set new scale
    if (ratio === 0) {
      new_scale = 1;
      is_relative = false;
    } else if (is_relative)
      new_scale *= ratio;
    else
      new_scale = ratio;

    this.scale = new_scale;
    var max_scale = this.config['maximum_scale'];
    var min_scale = this.config['minimum_scale'];
    this.scale = this.scale > max_scale ? max_scale : this.scale < min_scale ? min_scale : this.scale;

    if (!fixed_point)
      fixed_point = [0,0];

    // translate fixed_point to the coordinate system of all pages
    var container = this.container;
    fixed_point[0] += container.scrollLeft;
    fixed_point[1] += container.scrollTop;

    // find the visible page that contains the fixed point
    // if the fixed point lies between two pages (including their borders), it's contained in the first one
    var pl = this.pages;
    var pl_len = pl.length;
    for (var i = this.first_page_idx; i < pl_len; ++i) {
      var p = pl[i].page;
      if (p.offsetTop + p.clientTop >= fixed_point[1])
        break;
    }
    var fixed_point_page_idx = i - 1;

    // determine the new scroll position
    // each-value consists of two parts, one inside the page, which is affected by rescaling,
    // the other is outside, (e.g. borders and margins), which is not affected

    // if the fixed_point is above the first page, use the first page as the reference
    if (fixed_point_page_idx < 0)
      fixed_point_page_idx = 0;

    var fp_p = pl[fixed_point_page_idx].page;
    var fp_p_width = fp_p.clientWidth;
    var fp_p_height = fp_p.clientHeight;

    var fp_x_ref = fp_p.offsetLeft + fp_p.clientLeft;
    var fp_x_inside = fixed_point[0] - fp_x_ref;
    if (fp_x_inside < 0)
      fp_x_inside = 0;
    else if (fp_x_inside > fp_p_width)
      fp_x_inside = fp_p_width;

    var fp_y_ref = fp_p.offsetTop + fp_p.clientTop;
    var fp_y_inside = fixed_point[1] - fp_y_ref;
    if (fp_y_inside < 0)
      fp_y_inside = 0;
    else if (fp_y_inside > fp_p_height)
      fp_y_inside = fp_p_height;

    var old_container_scrollLeft = container.scrollLeft, old_container_scrollTop = container.scrollTop;

    // Rescale pages
    for (var i = 0; i < pl_len; ++i)
        pl[i].rescale(new_scale);

    // Correct container scroll to keep view aligned while zooming
    container.scrollLeft = old_container_scrollLeft + (fp_x_inside / old_scale * new_scale + fp_p.offsetLeft + fp_p.clientLeft - fp_x_inside - fp_x_ref);
    container.scrollTop = old_container_scrollTop + (fp_y_inside / old_scale * new_scale + fp_p.offsetTop + fp_p.clientTop - fp_y_inside - fp_y_ref);

    // some pages' visibility may be toggled, wait for next render()
    // renew old schedules since rescale() may be called frequently
    this.schedule_render(true);
    document.getElementById('scaleRatio').textContent = (this.scale * 100).toFixed() + '%';
    document.getElementById('customScaleOption').hidden = true;
    if (this.needToAdjustScaleSelect) {
      this.adjust_scale_select();
      this.needToAdjustScaleSelect = false;
    }
    document.getElementById('zoomOut').disabled = this.scale <= min_scale;
    document.getElementById('zoomIn').disabled = this.scale >= max_scale;
  },

  adjust_scale_select: function(){
    var scaleSelect = document.getElementById('scaleSelect');
    scaleSelect.selectedIndex = -1;
    var customScaleOption = document.getElementById('customScaleOption')
    var scaleText = (this.scale * 100).toFixed() + '%'
    var customScale = Math.round(this.scale * 10000) / 100;
    var predefinedValueFound = false;
    for (var i = 0, l = scaleSelect.options.length; i < l; ++i) {
      var option = scaleSelect.options[i];
      var value = Number(option.value);
      if (isNaN(value) || (value * 100).toFixed() !== customScale.toFixed()) {
        option.selected = false;
        continue;
      }
      option.selected = true;
      predefinedValueFound = true;
    }
    if (!predefinedValueFound) {
      customScaleOption.textContent = scaleText;
      customScaleOption.selected = true;
      customScaleOption.hidden = false;
    }
  },

  fit_width : function (is_allowed_larger_than_original, inset) {
    var page_idx = this.cur_page_idx;
    var ratio = (this.container.clientWidth -  (inset ? this.container.clientWidth * 0.2 : 0)) / this.pages[page_idx].width();
    if (!is_allowed_larger_than_original && ratio > 1) {
      ratio = 1;
    }
    this.rescale(ratio, true);
    this.scroll_to(page_idx);
  },

  fit_height : function (is_allowed_larger_than_original) {
    var page_idx = this.cur_page_idx;
    var ratio = this.container.clientHeight / this.pages[page_idx].height();
    if (!is_allowed_larger_than_original && ratio > 1) {
      ratio = 1;
    }
    this.rescale(ratio, true);
    this.scroll_to(page_idx);
  },
  /**
   * @param{Node} ele
   */
  get_containing_page : function(ele) {
    /* get the page obj containing obj */
    while(ele) {
      if ((ele.nodeType === Node.ELEMENT_NODE)
          && ele.classList.contains(CSS_CLASS_NAMES.page_frame)) {
        /*
         * Get original page number and map it to index of pages
         * TODO: store the index on the dom element
         */
        var pn = get_page_number(/** @type{Element} */(ele));
        var pm = this.page_map;
        return (pn in pm) ? this.pages[pm[pn]] : null;
      }
      ele = ele.parentNode;
    }
    return null;
  },

  /**
   * @param{Event} e
   */
  link_handler : function (e) {
    var target = /** @type{Node} */(e.target);
    var detail_str = /** @type{string} */ (target.getAttribute('data-dest-detail'));
    if (!detail_str) return;

    if (this.config['view_history_handler']) {
      try {
        var cur_hash = this.get_current_view_hash();
        window.history.replaceState(cur_hash, '', '#' + cur_hash);
        window.history.pushState(detail_str, '', '#' + detail_str);
      } catch(ex) { }
    }
    this.navigate_to_dest(detail_str, this.get_containing_page(target));
    e.preventDefault();
  },

  /**
   * @param{string} detail_str may come from user provided hashtag, need sanitzing
   * @param{Page=} src_page page containing the source event (e.g. link)
   */
  navigate_to_dest : function(detail_str, src_page) {
    try {
      var detail = JSON.parse(decodeURIComponent(detail_str));
    } catch(e) {
      if (detail_str.substr(0, 2) === 'pf') {
        var target_page_no = parseInt(detail_str.substr(2), 16);
        var page_map = this.page_map;
        if (!(target_page_no in page_map)) return;
        var target_page_idx = page_map[target_page_no];
        var target_page = this.pages[target_page_idx];

        var self = this;
        /**
         * page should of type Page
         * @param{Page} page
         */
        var transform_and_scroll_2 = function(page) {
          var pos = page.view_position();
          pos = page.loaded ? transform(page.ctm, pos) : pos;
          if (upside_down) {
            pos[1] = page.height() - pos[1];
          }
          self.scroll_to(target_page_idx, pos);
        };

        if (target_page.loaded) {
          transform_and_scroll_2(target_page);
        } else {
          // TODO: scroll_to may finish before load_page

          // Scroll to the exact position once loaded.
          this.load_page(target_page_idx, undefined, transform_and_scroll_2);

          // In the meantime page gets loaded, scroll approximately position for maximum responsiveness.
          this.scroll_to(target_page_idx);
        }
      }
      return;
    }

    if(!(detail instanceof Array)) return;

    var target_page_no = detail[0];
    var page_map = this.page_map;
    if (!(target_page_no in page_map)) return;
    var target_page_idx = page_map[target_page_no];
    var target_page = this.pages[target_page_idx];

    for (var i = 2, l = detail.length; i < l; ++i) {
      var d = detail[i];
      if(!((d === null) || (typeof d === 'number')))
        return;
    }

    while(detail.length < 6)
      detail.push(null);

    // cur_page might be undefined, e.g. from Outline
    var cur_page = src_page || this.pages[this.cur_page_idx];

    var cur_pos = cur_page.view_position();
    cur_pos = cur_page.loaded ? transform(cur_page.ictm, [cur_pos[0], cur_page.height()-cur_pos[1]]) : cur_pos;

    var zoom = this.scale;
    var pos = [0,0];
    var upside_down = true;
    var ok = false;

    // position specified in `detail` are in the raw coordinate system of the page (unscaled)
    var scale = this.scale;
    // TODO: fitb*
    // TODO: BBox
    switch(detail[1]) {
      case 'XYZ':
        zoom = detail[4];
        if ((zoom === null) || (zoom === 0))
          zoom = this.scale;
        pos = [ (detail[2] === null) ? cur_pos[0] : detail[2] * zoom
          , (detail[3] === null) ? cur_pos[1] : detail[3] * zoom ];
        ok = true;
        break;
      case 'Fit':
      case 'FitB':
        pos = [0,0];
        ok = true;
        break;
      case 'FitH':
      case 'FitBH':
        pos = [0, (detail[2] === null) ? cur_pos[1] : detail[2] * scale];
        ok = true;
        break;
      case 'FitV':
      case 'FitBV':
        pos = [(detail[2] === null) ? cur_pos[0] : detail[2] * scale, 0];
        ok = true;
        break;
      case 'FitR':
        /* locate the top-left corner of the rectangle */
        // TODO
        pos = [detail[2] * scale, detail[5] * scale];
        upside_down = false;
        ok = true;
        break;
      default:
        break;
    }

    if (!ok) return;

    this.needToAdjustScaleSelect = true;
    this.rescale(zoom, false);

    var self = this;
    /**
     * page should of type Page
     * @param{Page} page
     */
    var transform_and_scroll = function(page) {
      pos = transform(page.ctm, pos);
      if (upside_down) {
        pos[1] = page.height() - pos[1];
      }
      self.scroll_to(target_page_idx, pos);
    };

    if (target_page.loaded) {
      transform_and_scroll(target_page);
    } else {
      // TODO: scroll_to may finish before load_page

      // Scroll to the exact position once loaded.
      this.load_page(target_page_idx, undefined, transform_and_scroll);

      // In the meantime page gets loaded, scroll approximately position for maximum responsiveness.
      this.scroll_to(target_page_idx);
    }
  },

  /**
   * @param{number} page_idx
   * @param{Array.<number>=} pos [x,y] where (0,0) is the top-left corner
   */
  scroll_to : function(page_idx, pos) {
    var pl = this.pages;
    if ((page_idx < 0) || (page_idx >= pl.length)) return;
    var target_page = pl[page_idx];
    var cur_target_pos = target_page.view_position();

    if (pos === undefined)
      pos = [0,0];

    var container = this.container;
    container.scrollLeft += pos[0] - cur_target_pos[0];
    container.scrollTop += pos[1] - cur_target_pos[1];
  },

  /**
   * generate the hash for the current view
   */
  get_current_view_hash : function() {
    var detail = [];
    var cur_page = this.pages[this.cur_page_idx];

    if (!cur_page.loaded) return;

    detail.push(cur_page.num);
    detail.push('XYZ');

    var cur_pos = cur_page.view_position();
    cur_pos = transform(cur_page.ictm, [cur_pos[0], cur_page.height()-cur_pos[1]]);
    detail.push(cur_pos[0] / this.scale);
    detail.push(cur_pos[1] / this.scale);

    detail.push(this.scale);

    return encodeURIComponent(JSON.stringify(detail));
  },

  /**
   * handle the pinch-zoom event on the page-container
   */
  pinchStart: function(e) {
    var dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY);
    this.pinch_start_distance = dist;
  },
  pinchMove: function(e) {
    var dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY);
    var scale = dist / this.pinch_start_distance;
    var max_scale = this.config['maximum_scale'];
    var min_scale = this.config['minimum_scale'];
    if ((this.scale >= max_scale && scale >= 1)  || (this.scale <= min_scale && scale <= 1)) {
      return;
    }
    this.pinch_start_distance = dist;
    this.needToAdjustScaleSelect = true;
    this.rescale(scale, true, [(e.touches[0].pageX + e.touches[1].pageX) / 2.0, (e.touches[0].pageY + e.touches[1].pageY) / 2.0 + 32]);
  },
  pinchEnd: function(e) {
    this.pinch_start_distance = undefined;
  },
};

// export pdf2htmlEX.Viewer
pdf2htmlEX['Viewer'] = Viewer;

// disable gesture pinch to zoom in/out of the webpage
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
