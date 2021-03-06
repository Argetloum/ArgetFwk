var RTOOLBAR = {};
(function (b) {
  jQuery.fn.redactor = function (c) {
    return this.each(function () {
      var e = b(this);
      var d = e.data("redactor");
      if (!d) {
        e.data("redactor", (d = new a(this, c)))
      }
    })
  };
  var a = function (d, c) {
    this.$el = b(d);
    this.opts = b.extend({lang: "en", toolbar: "default", load: true, path: false, css: "style.css", focus: true, resize: true, autoresize: false, fixed: false, autoformat: true, cleanUp: true, convertDivs: true, removeClasses: true, removeStyles: false, convertLinks: true, handler: false, autosave: false, interval: 60, imageGetJson: false, imageUpload: false, linkFileUpload: false, fileUpload: false, visual: true, fullscreen: false, overlay: true, colors: Array("#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#ffff00", "#f2f2f2", "#7f7f7f", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada", "#fff2ca", "#d8d8d8", "#595959", "#c4bd97", "#8db3e2", "#b8cce4", "#e5b9b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5", "#ffe694", "#bfbfbf", "#3f3f3f", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#b7dde8", "#fac08f", "#f2c314", "#a5a5a5", "#262626", "#494429", "#17365d", "#366092", "#953734", "#76923c", "#5f497a", "#92cddc", "#e36c09", "#c09100", "#7f7f7f", "#0c0c0c", "#1d1b10", "#0f243e", "#244061", "#632423", "#4f6128", "#3f3151", "#31859b", "#974806", "#7f6000"), allEmptyHtml: "<p><br /></p>", mozillaEmptyHtml: "<p>&nbsp;</p>"}, c, this.$el.data());
    this.dropdowns = [];
    this.init()
  };
  a.prototype = {_loadFile: function (c, f) {
    var d = f[0];
    f.splice(0, 1);
    var e;
    if (typeof(d) == "function") {
      e = d
    } else {
      e = b.proxy(function () {
        this._loadFile(d, f)
      }, this)
    }
    this.dynamicallyLoad(c, e)
  }, loadFiles: function (d) {
    var c = d[0];
    d.splice(0, 1);
    this._loadFile(c, d)
  }, dynamicallyLoad: function (e, g) {
    var f = document.getElementsByTagName("head")[0];
    var d = document.createElement("script");
    d.src = e;
    var c = false;
    d.onload = d.onreadystatechange = function () {
      if (!c && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        c = true;
        if (g) {
          g()
        }
        d.onload = d.onreadystatechange = null
      }
    };
    f.appendChild(d)
  }, init: function () {
    this.getPath();
    if (this.opts.load) {
      var c = [];
      c.push(this.opts.path + "/langs/" + this.opts.lang + ".js");
      if (this.opts.toolbar !== false) {
        c.push(this.opts.path + "/toolbars/" + this.opts.toolbar + ".js")
      }
      c.push(b.proxy(this.start, this));
      this.loadFiles(c)
    } else {
      this.start()
    }
  }, start: function () {
    this.height = this.$el.css("height");
    this.width = this.$el.css("width");
    this.build();
    var c = this.$el.val();
    c = this.preformater(c);
    if (this.opts.autoformat) {
      c = this.paragraphy(c)
    }
    this.$editor = this.enable(c);
    b(this.doc).click(b.proxy(function (d) {
      this.$editor.focus()
    }, this));
    b(this.doc).bind("paste", b.proxy(function (d) {
      setTimeout(b.proxy(function () {
        var e = b('<span id="pastemarkerend">&nbsp;</span>');
        this.insertNodeAtCaret(e.get(0));
        this.pasteCleanUp()
      }, this), 200)
    }, this));
    b(this.doc).keypress(b.proxy(function (f) {
      var d = f.keyCode || f.which;
      if (navigator.userAgent.indexOf("AppleWebKit") != -1) {
        return this.safariShiftKeyEnter(f, d)
      }
    }, this)).keyup(b.proxy(function (f) {
      var d = f.keyCode || f.which;
      if (this.opts.autoformat) {
        if (d == 8 || d == 46) {
          return this.formatEmpty(f)
        }
        if (d == 13 && !f.shiftKey && !f.ctrlKey && !f.metaKey) {
          return this.formatNewLine(f)
        }
      }
      this.syncCode()
    }, this));
    this.buildToolbar();
    if (this.opts.autoresize === false) {
      this.buildResizer()
    } else {
      this.observeAutoResize()
    }
    this.shortcuts();
    this.autoSave();
    this.observeImages();
    if (this.opts.fullscreen) {
      this.opts.fullscreen = false;
      this.fullscreen()
    }
    if (this.opts.focus) {
      this.focus()
    }
    if (this.opts.fixed) {
      this.observeScroll();
      b(document).scroll(b.proxy(this.observeScroll, this))
    }
  }, shortcuts: function () {
    b(this.doc).keydown(b.proxy(function (d) {
      var c = d.keyCode || d.which;
      if (d.ctrlKey) {
        if (c == 90) {
          this._shortcuts(d, "undo")
        } else {
          if (c == 90 && d.shiftKey) {
            this._shortcuts(d, "redo")
          } else {
            if (c == 77) {
              this._shortcuts(d, "removeFormat")
            } else {
              if (c == 66) {
                this._shortcuts(d, "bold")
              } else {
                if (c == 73) {
                  this._shortcuts(d, "italic")
                } else {
                  if (c == 74) {
                    this._shortcuts(d, "insertunorderedlist")
                  } else {
                    if (c == 75) {
                      this._shortcuts(d, "insertorderedlist")
                    } else {
                      if (c == 76) {
                        this._shortcuts(d, "superscript")
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (!d.shiftKey && c == 9) {
        this._shortcuts(d, "indent")
      } else {
        if (d.shiftKey && c == 9) {
          this._shortcuts(d, "outdent")
        }
      }
    }, this))
  }, _shortcuts: function (d, c) {
    if (d.preventDefault) {
      d.preventDefault()
    }
    this.execCommand(c, null)
  }, getPath: function () {
    if (this.opts.path !== false) {
      return this.opts.path
    }
    b("script").each(b.proxy(function (c, d) {
      if (d.src) {
        var e = new RegExp(/\/redactor(\.min)?\.js(\?.*)?/);
        if (d.src.match(e)) {
          this.opts.path = d.src.replace(e, "")
        }
      }
    }, this))
  }, build: function () {
    this.$box = b('<div class="redactor_box"></div>');
    this.$frame = b('<iframe frameborder="0" scrolling="auto" style="height: ' + this.height + ';" class="redactor_frame"></iframe>');
    this.$el.css("width", "100%").hide();
    this.$box.insertAfter(this.$el).append(this.$frame).append(this.$el)
  }, write: function (c) {
    this.doc.open();
    this.doc.write(c);
    this.doc.close()
  }, enable: function (c) {
    this.doc = this.getDoc(this.$frame.get(0));
    if (this.doc !== null) {
      this.write(this.setDoc(c));
      if (b.browser.mozilla) {
        this.doc.execCommand("useCSS", false, true)
      }
      return b(this.doc).find("#page")
    } else {
      return false
    }
  }, setDoc: function (d) {
    var c = "<!DOCTYPE html>\n";
    c += '<html><head><link media="all" type="text/css" href="' + this.opts.path + "/css/" + this.opts.css + '" rel="stylesheet"></head>';
    c += '<body><div id="page" contenteditable="true">';
    c += d;
    c += "</div></body></html>";
    return c
  }, getDoc: function (c) {
    if (c.contentDocument) {
      return c.contentDocument
    } else {
      if (c.contentWindow && c.contentWindow.document) {
        return c.contentWindow.document
      } else {
        if (c.document) {
          return c.document
        } else {
          return null
        }
      }
    }
  }, focus: function () {
    this.$editor.focus()
  }, syncCode: function () {
    var c = this.formating(this.$editor.html());
    this.$el.val(c)
  }, setCode: function (c) {
    c = this.preformater(c);
    this.$editor.html(c).focus();
    this.syncCode()
  }, getCode: function () {
    var c = this.$editor ? this.$editor.html() : this.$el.val();
    c = this.reformater(c);
    return c
  }, insertHtml: function (c) {
    this.execCommand("inserthtml", c)
  }, destroy: function () {
    var c = this.getCode();
    this.$box.after(this.$el);
    this.$box.remove();
    this.$el.val(c).show();
    this.dropdowns.forEach(function (e, d) {
      e.remove();
      delete (this.dropdowns[d])
    }, this)
  }, handler: function () {
    b.ajax({url: this.opts.handler, type: "post", data: "redactor=" + escape(encodeURIComponent(this.getCode())), success: b.proxy(function (c) {
      this.setCode(c);
      this.syncCode()
    }, this)})
  }, observeImages: function () {
    if (b.browser.mozilla) {
      this.doc.execCommand("enableObjectResizing", false, "false")
    }
    b(this.doc).find("img").attr("unselectable", "on").each(b.proxy(function (c, d) {
      this.resizeImage(d)
    }, this))
  }, observeScroll: function () {
    var c = b(document).scrollTop();
    var d = this.$box.offset().top;
    if (c > d) {
      this.fixed = true;
      this.$toolbar.css({position: "fixed", width: "100%"})
    } else {
      this.fixed = false;
      this.$toolbar.css({position: "relative", width: "auto"})
    }
  }, observeAutoResize: function () {
    this.$editor.css({"min-height": this.$el.height() + "px"});
    this.$frame.css({"overflow-x": "auto", "overflow-y": "hidden"});
    this.$frame.load(b.proxy(this.setAutoSize, this));
    b(this.doc).keyup(b.proxy(this.setAutoSize, this))
  }, setAutoSize: function () {
    this.$frame.height(this.$editor.outerHeight(true) + 30)
  }, execCommand: function (c, f) {
    if (this.opts.visual && this.doc) {
      try {
        if (b.browser.msie) {
          this.focus()
        }
        if (c == "inserthtml" && b.browser.msie) {
          this.doc.selection.createRange().pasteHTML(f)
        } else {
          if (c == "formatblock" && b.browser.msie) {
            this.doc.execCommand(c, false, "<" + f + ">")
          } else {
            this.doc.execCommand(c, false, f)
          }
        }
        this.syncCode();
        this.focus()
      } catch (d) {
      }
    }
  }, formatNewLine: function (d) {
    var c = this.getParentNode();
    if (c.nodeName == "DIV" && c.id == "page") {
      if (d.preventDefault) {
        d.preventDefault()
      }
      element = b(this.getCurrentNode());
      if (element.get(0).tagName == "DIV" && (element.html() == "" || element.html() == "<br>")) {
        newElement = b("<p>").append(element.clone().get(0).childNodes);
        element.replaceWith(newElement);
        newElement.html("<br />");
        this.setFocusNode(newElement.get(0));
        this.syncCode();
        return false
      } else {
        this.syncCode()
      }
      if (this.opts.convertLinks) {
        this.$editor.linkify()
      }
    } else {
      this.syncCode();
      return true
    }
  }, safariShiftKeyEnter: function (f, d) {
    if (f.shiftKey && d == 13) {
      if (f.preventDefault) {
        f.preventDefault()
      }
      var c = b("<span><br /></span>");
      this.insertNodeAtCaret(c.get(0));
      this.setFocusNode(c.get(0));
      this.syncCode();
      return false
    }
  }, formatEmpty: function (g) {
    var d = b.trim(this.$editor.html());
    if (b.browser.mozilla) {
      d = d.replace(/<br>/gi, "")
    }
    if (d === "") {
      if (g.preventDefault) {
        g.preventDefault()
      }
      var c = this.opts.allEmptyHtml;
      if (b.browser.mozilla) {
        c = this.opts.mozillaEmptyHtml
      }
      var f = b(c).get(0);
      this.$editor.html(f);
      this.setFocusNode(f);
      this.syncCode();
      return false
    } else {
      this.syncCode()
    }
  }, paragraphy: function (e) {
    e = b.trim(e);
    if (e === "") {
      if (!b.browser.mozilla) {
        return this.opts.allEmptyHtml
      } else {
        return this.opts.mozillaEmptyHtml
      }
    }
    if (this.opts.convertDivs) {
      e = e.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "<p>$2</p>")
    }
    var f = function (h, i, g) {
      return h.replace(new RegExp(i, "g"), g)
    };
    var c = function (h, g) {
      return f(e, h, g)
    };
    var d = "(table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|style|script|object|input|param|p|h[1-6])";
    e += "\n";
    c("<br />\\s*<br />", "\n\n");
    c("(<" + d + "[^>]*>)", "\n$1");
    c("(</" + d + ">)", "$1\n\n");
    c("\r\n|\r", "\n");
    c("\n\n+", "\n\n");
    c("\n?((.|\n)+?)$", "<p>$1</p>\n");
    c("<p>\\s*?</p>", "");
    c("<p>(<div[^>]*>\\s*)", "$1<p>");
    c("<p>([^<]+)\\s*?(</(div|address|form)[^>]*>)", "<p>$1</p>$2");
    c("<p>\\s*(</?" + d + "[^>]*>)\\s*</p>", "$1");
    c("<p>(<li.+?)</p>", "$1");
    c("<p>\\s*(</?" + d + "[^>]*>)", "$1");
    c("(</?" + d + "[^>]*>)\\s*</p>", "$1");
    c("(</?" + d + "[^>]*>)\\s*<br />", "$1");
    c("<br />(\\s*</?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)", "$1");
    if (e.indexOf("<pre") != -1) {
      c("(<pre(.|\n)*?>)((.|\n)*?)</pre>", function (j, i, h, g) {
        return f(i, "\\\\(['\"\\\\])", "$1") + f(f(f(g, "<p>", "\n"), "</p>|<br />", ""), "\\\\(['\"\\\\])", "$1") + "</pre>"
      })
    }
    return c("\n</p>$", "</p>")
  }, preformater: function (c) {
    c = c.replace(/<br>/gi, "<br />");
    c = c.replace(/<blockquote\b[^>]*>([\w\W]*?)<p>([\w\W]*?)<\/p>([\w\W]*?)<\/blockquote[^>]*>/gi, "<blockquote>$1$2<br />$3</blockquote>");
    c = c.replace(/<strong\b[^>]*>([\w\W]*?)<\/strong[^>]*>/gi, "<b>$1</b>");
    c = c.replace(/<em\b[^>]*>([\w\W]*?)<\/em[^>]*>/gi, "<i>$1</i>");
    c = c.replace(/<del\b[^>]*>([\w\W]*?)<\/del[^>]*>/gi, "<strike>$1</strike>");
    return c
  }, reformater: function (c) {
    c = c.replace(/<br>/gi, "<br />");
    c = c.replace(/<b\b[^>]*>([\w\W]*?)<\/b[^>]*>/gi, "<strong>$1</strong>");
    c = c.replace(/<i\b[^>]*>([\w\W]*?)<\/i[^>]*>/gi, "<em>$1</em>");
    c = c.replace(/<strike\b[^>]*>([\w\W]*?)<\/strike[^>]*>/gi, "<del>$1</del>");
    c = c.replace(/<span(.*?)style="font-weight: bold;">([\w\W]*?)<\/span>/gi, "<strong>$2</strong>");
    c = c.replace(/<span(.*?)style="font-style: italic;">([\w\W]*?)<\/span>/gi, "<em>$2</em>");
    c = c.replace(/<span(.*?)style="font-weight: bold; font-style: italic;">([\w\W]*?)<\/span>/gi, "<em><strong>$2</strong></em>");
    c = c.replace(/<span(.*?)style="font-style: italic; font-weight: bold;">([\w\W]*?)<\/span>/gi, "<strong><em>$2</em></strong>");
    return c
  }, cleanUpClasses: function (c) {
    c = c.replace(/\s*class="TOC(.*?)"/gi, "");
    c = c.replace(/\s*class="Heading(.*?)"/gi, "");
    c = c.replace(/\s*class="Body(.*?)"/gi, "");
    return c
  }, cleanUpStyles: function (c) {
    c = c.replace(/\s*mso-[^:]+:[^;"]+;?/gi, "");
    c = c.replace(/\s*margin(.*?)pt\s*;/gi, "");
    c = c.replace(/\s*margin(.*?)cm\s*;/gi, "");
    c = c.replace(/\s*text-indent:(.*?)\s*;/gi, "");
    c = c.replace(/\s*line-height:(.*?)\s*;/gi, "");
    c = c.replace(/\s*page-break-before: [^\s;]+;?"/gi, '"');
    c = c.replace(/\s*font-variant: [^\s;]+;?"/gi, '"');
    c = c.replace(/\s*tab-stops:[^;"]*;?/gi, "");
    c = c.replace(/\s*tab-stops:[^"]*/gi, "");
    c = c.replace(/\s*face="[^"]*"/gi, "");
    c = c.replace(/\s*face=[^ >]*/gi, "");
    c = c.replace(/\s*font:(.*?);/gi, "");
    c = c.replace(/\s*font-size:(.*?);/gi, "");
    c = c.replace(/\s*font-weight:(.*?);/gi, "");
    c = c.replace(/\s*font-family:[^;"]*;?/gi, "");
    c = c.replace(/<span style="Times New Roman&quot;">\s\n<\/span>/gi, "");
    return c
  }, cleanUp: function (c) {
    c = c.replace(/(<\!\-\-([\w\W]*?)\-\->)/ig, "");
    if (this.opts.convertDivs) {
      c = c.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "<p$1>$2</p>")
    }
    c = c.replace(/ lang="([\w\W]*?)"/gi, "");
    c = c.replace(/<a name="(.*?)">([\w\W]*?)<\/a>/gi, "");
    c = c.replace(/\&nbsp;\&nbsp;\&nbsp;/gi, " ");
    c = c.replace(/\&nbsp;\&nbsp;/gi, " ");
    c = c.replace(/<o:p>(.*?)<\/o:p>/gi, "");
    c = c.replace(/\s*style="\s*"/gi, "");
    c = c.replace(/<span>&nbsp;<\/span>/gi, "");
    c = c.replace(/<span>([\w\W]*?)<\/span>/gi, "$1");
    return c
  }, removeTags: function (c) {
    return c.replace(/<(?!\s*\/?(code|span|div|label|a|br|p|b|i|del|strike|img|video|audio|iframe|object|embed|param|blockquote|mark|cite|small|ul|ol|li|hr|dl|dt|dd|sup|sub|big|pre|code|figure|figcaption|strong|em|table|tr|td|th|tbody|thead|tfoot|h1|h2|h3|h4|h5|h6)\b)[^>]+>/gi, "")
  }, pasteCleanUp: function () {
    var c = this.$editor.html();
    c = c.replace(/<span id="pastemarkerend">&nbsp;<\/span>/, "#marker#");
    c = this.formating(c);
    c = this.cleanUp(c);
    if (this.opts.removeClasses) {
      c = c.replace(/ class="([\w\W]*?)"/gi, "")
    } else {
      c = this.cleanUpClasses(c)
    }
    if (this.opts.removeStyles) {
      c = c.replace(/ style="([\w\W]*?)"/gi, "")
    } else {
      c = this.cleanUpStyles(c)
    }
    c = this.cleanUp(c);
    c = this.formating(c);
    c = c.replace(/<b(.*?)id="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$3");
    c = c.replace(/#marker#/, '<span id="pastemarkerend">&nbsp;</span>');
    this.$editor.html(c);
    var d = b(this.doc.body).find("#pastemarkerend").get(0);
    this.setFocusNode(d);
    this.syncCode();
    this.observeImages()
  }, formating: function (j) {
    if (b.browser.msie) {
      j = j.replace(/<*(\/ *)?(\w+)/g, function (i) {
        return i.toLowerCase()
      });
      j = j.replace(/style="(.*?)"/g, function (i) {
        return i.toLowerCase()
      });
      j = j.replace(/ jQuery(.*?)=\"(.*?)\"/gi, "")
    }
    j = j.replace(/<font([\w\W]*?)color="(.*?)">([\w\W]*?)<\/font\>/gi, '<span style="color: $2;">$3</span>');
    j = j.replace(/<font([\w\W]*?)>([\w\W]*?)<\/font\>/gi, "<span$1>$2</span>");
    j = j.replace(/<span>([\w\W]*?)<\/span>/gi, "$1");
    j = j.replace(/ class="Apple-style-span"/gi, "");
    j = j.replace(/ class="Apple-tab-span"/gi, "");
    j = j.replace(/<p><p>/g, "<p>");
    j = j.replace(/<\/p><\/p>/g, "</p>");
    j = j.replace(/<hr(.*?)>/g, "<hr />");
    j = j.replace(/<p>&nbsp;/g, "<p>");
    j = j.replace(/<p><ul>/g, "<ul>");
    j = j.replace(/<p><ol>/g, "<ol>");
    j = j.replace(/<\/ul><\/p>/g, "</ul>");
    j = j.replace(/<\/ol><\/p>/g, "</ol>");
    j = j.replace(/<p(.*?)>&nbsp;<\/p>/gi, "");
    j = j.replace(/[\t]*/g, "");
    j = j.replace(/\n\s*\n/g, "\n");
    j = j.replace(/^[\s\n]*/, "");
    j = j.replace(/[\s\n]*$/, "");
    var e = ["<pre></pre>", "<blockquote>\\s*</blockquote>", "<em>\\s*</em>", "<b>\\s*</b>", "<ul></ul>", "<ol></ol>", "<li></li>", "<table></table>", "<tr></tr>", "<span>\\s*<span>", "<span>&nbsp;<span>", "<p>\\s*</p>", "<p>&nbsp;</p>", "<p>\\s*<br>\\s*</p>", "<div>\\s*</div>", "<div>\\s*<br>\\s*</div>"];
    for (var f = 0; f < e.length; ++f) {
      var l = e[f];
      j = j.replace(new RegExp(l, "gi"), "")
    }
    var d = "\r\n";
    var h = ["<form", "<fieldset", "<legend", "<object", "<embed", "<select", "<option", "<input", "<textarea", "<pre", "<blockquote", "<ul", "<ol", "<li", "<dl", "<dt", "<dd", "<table", "<thead", "<tbody", "<caption", "</caption>", "<th", "<tr", "<td", "<figure"];
    for (var f = 0; f < h.length; ++f) {
      var g = h[f];
      j = j.replace(new RegExp(g, "gi"), d + g)
    }
    var k = ["</p>", "</div>", "</ul>", "</ol>", "</h1>", "</h2>", "</h3>", "</h4>", "</h5>", "</h6>", "<br>", "<br />", "</dl>", "</dt>", "</dd>", "</form>", "</blockquote>", "</pre>", "</legend>", "</fieldset>", "</object>", "</embed>", "</textarea>", "</select>", "</option>", "</table>", "</thead>", "</tbody>", "</tr>", "</td>", "</th>", "</figure>"];
    for (var f = 0; f < k.length; ++f) {
      var c = k[f];
      j = j.replace(new RegExp(c, "gi"), c + d)
    }
    j = j.replace(/<li/g, "\t<li");
    j = j.replace(/<tr/g, "\t<tr");
    j = j.replace(/<td/g, "\t\t<td");
    j = j.replace(/<\/tr>/g, "\t</tr>");
    return j
  }, toggle: function () {
    var c;
    if (this.opts.visual) {
      this.$frame.hide();
      c = this.$editor.html();
      c = b.trim(this.formating(c));
      this.$el.val(c).show().focus();
      this.setBtnActive("html");
      this.opts.visual = false
    } else {
      this.$el.hide();
      this.$editor.html(this.$el.val());
      this.$frame.show();
      if (this.$editor.html() === "") {
        if (!b.browser.mozilla) {
          c = this.opts.allEmptyHtml
        } else {
          c = this.opts.mozillaEmptyHtml
        }
        this.setCode(c)
      }
      this.focus();
      this.setBtnInactive("html");
      this.opts.visual = true;
      this.observeImages()
    }
  }, autoSave: function () {
    if (this.opts.autosave === false) {
      return false
    }
    setInterval(b.proxy(function () {
      b.post(this.opts.autosave, {data: this.getCode()})
    }, this), this.opts.interval * 1000)
  }, buildToolbar: function () {
    if (this.opts.toolbar === false) {
      return false
    }
    this.$toolbar = b("<ul>").addClass("redactor_toolbar");
    this.$box.prepend(this.$toolbar);
    b.each(RTOOLBAR[this.opts.toolbar], b.proxy(function (e, f) {
      if (this.opts.fileUpload === false && e == "file") {
        return true
      }
      var c = b("<li>");
      if (e == "fullscreen") {
        b(c).addClass("redactor_toolbar_right")
      }
      var d = this.buildButton(e, f);
      if (e == "backcolor" || e == "fontcolor" || typeof(f.dropdown) != "undefined") {
        var g = b('<div class="redactor_dropdown" style="display: none;">');
        if (e == "backcolor" || e == "fontcolor") {
          g = this.buildColorPicker(g, e)
        } else {
          g = this.buildDropdown(g, f.dropdown)
        }
        this.dropdowns.push(g.appendTo(b(document.body)));
        this.hdlHideDropDown = b.proxy(function (h) {
          this.hideDropDown(h, g, e)
        }, this);
        this.hdlShowDropDown = b.proxy(function (h) {
          this.showDropDown(h, g, e)
        }, this);
        d.click(this.hdlShowDropDown)
      }
      this.$toolbar.append(b(c).append(d));
      if (typeof(f.separator) != "undefined") {
        this.$toolbar.append(b('<li class="redactor_separator"></li>'))
      }
    }, this));
    b(document).click(this.hdlHideDropDown);
    b(this.doc).click(this.hdlHideDropDown)
  }, buildButton: function (d, e) {
    var c = b('<a href="javascript:void(null);" title="' + e.title + '" class="redactor_btn_' + d + '"><span>&nbsp;</span></a>');
    if (typeof(e.func) == "undefined") {
      c.click(b.proxy(function () {
        this.execCommand(e.exec, d)
      }, this))
    } else {
      if (e.func != "show") {
        c.click(b.proxy(function (f) {
          this[e.func](f)
        }, this))
      }
    }
    return c
  }, buildDropdown: function (d, c) {
    b.each(c, b.proxy(function (e, g) {
      if (typeof(g.style) == "undefined") {
        g.style = ""
      }
      var f;
      if (g.name == "separator") {
        f = b('<a class="redactor_separator_drop">')
      } else {
        f = b('<a href="javascript:void(null);" style="' + g.style + '">' + g.title + "</a>");
        if (typeof(g.func) == "undefined") {
          b(f).click(b.proxy(function () {
            this.execCommand(g.exec, e)
          }, this))
        } else {
          b(f).click(b.proxy(function (h) {
            this[g.func](h)
          }, this))
        }
      }
      b(d).append(f)
    }, this));
    return d
  }, buildColorPicker: function (l, k) {
    var f;
    if (k == "backcolor") {
      if (b.browser.msie) {
        f = "BackColor"
      } else {
        f = "hilitecolor"
      }
    } else {
      f = "forecolor"
    }
    b(l).width(210);
    var g = this.opts.colors.length;
    for (var e = 0; e < g; ++e) {
      var c = this.opts.colors[e];
      var j = b('<a rel="' + c + '" href="javascript:void(null);" class="redactor_color_link"></a>').css({backgroundColor: c});
      b(l).append(j);
      var h = this;
      b(j).click(function () {
        h.execCommand(f, b(this).attr("rel"))
      })
    }
    var d = b('<a href="javascript:void(null);" class="redactor_color_none"></a>').html(RLANG.none);
    if (k == "backcolor") {
      d.click(b.proxy(this.setBackgroundNone, this))
    } else {
      d.click(b.proxy(this.setColorNone, this))
    }
    b(l).append(d);
    return l
  }, setBackgroundNone: function () {
    b(this.getParentNode()).css("background-color", "transparent");
    this.syncCode()
  }, setColorNone: function () {
    b(this.getParentNode()).attr("color", "").css("color", "");
    this.syncCode()
  }, showDropDown: function (g, h, c) {
    this.hideAllDropDown();
    this.setBtnActive(c);
    this.getBtn(c).addClass("dropact");
    var f = this.getBtn(c).offset().left;
    if (this.opts.fixed && this.fixed) {
      b(h).css({position: "fixed", left: f + "px", top: "30px"}).show()
    } else {
      var d = this.$toolbar.offset().top + 30;
      b(h).css({position: "absolute", left: f + "px", top: d + "px"}).show()
    }
  }, hideAllDropDown: function () {
    this.$toolbar.find("a.dropact").removeClass("act").removeClass("dropact");
    b(".redactor_dropdown").hide()
  }, hideDropDown: function (d, f, c) {
    if (!b(d.target).parent().hasClass("dropact")) {
      b(f).removeClass("act");
      this.showedDropDown = false;
      this.hideAllDropDown()
    }
  }, getSelection: function () {
    if (this.$frame.get(0).contentWindow.getSelection) {
      return this.$frame.get(0).contentWindow.getSelection()
    } else {
      if (this.$frame.get(0).contentWindow.document.selection) {
        return this.$frame.get(0).contentWindow.document.selection.createRange()
      }
    }
  }, getParentNode: function () {
    if (window.getSelection) {
      return this.getSelection().getRangeAt(0).startContainer.parentNode
    } else {
      if (document.selection) {
        return this.getSelection().parentElement()
      }
    }
  }, getCurrentNode: function () {
    if (window.getSelection) {
      return this.getSelection().getRangeAt(0).startContainer
    } else {
      if (document.selection) {
        return this.getSelection()
      }
    }
  }, setFocusNode: function (f, d) {
    var c = this.doc.createRange();
    var e = this.getSelection();
    d = d ? 0 : 1;
    if (e !== null) {
      c.selectNodeContents(f);
      e.addRange(c);
      e.collapse(f, d)
    }
    this.focus()
  }, insertNodeAtCaret: function (g) {
    if (typeof window.getSelection != "undefined") {
      var h = this.getSelection();
      if (h.rangeCount) {
        var d = h.getRangeAt(0);
        d.collapse(false);
        d.insertNode(g);
        d = d.cloneRange();
        d.selectNodeContents(g);
        d.collapse(false);
        h.removeAllRanges();
        h.addRange(d)
      }
    } else {
      if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var e = (g.nodeType == 1) ? g.outerHTML : g.data;
        var i = "marker_" + ("" + Math.random()).slice(2);
        e += '<span id="' + i + '"></span>';
        var f = this.getSelection();
        f.collapse(false);
        f.pasteHTML(e);
        var c = document.getElementById(i);
        f.moveToElementText(c);
        f.select();
        c.parentNode.removeChild(c)
      }
    }
  }, getBtn: function (c) {
    return b(this.$toolbar.find("a.redactor_btn_" + c))
  }, setBtnActive: function (c) {
    this.getBtn(c).addClass("act")
  }, setBtnInactive: function (c) {
    this.getBtn(c).removeClass("act")
  }, changeBtnIcon: function (c, d) {
    this.getBtn(c).addClass("redactor_btn_" + d)
  }, removeBtnIcon: function (c, d) {
    this.getBtn(c).removeClass("redactor_btn_" + d)
  }, removeBtn: function (c) {
    this.getBtn(c).remove()
  }, addBtn: function (c, d) {
    this.$toolbar.append(b("<li>").append(this.buildButton(c, d)))
  }, fullscreen: function () {
    var c;
    if (this.opts.fullscreen === false) {
      this.changeBtnIcon("fullscreen", "normalscreen");
      this.setBtnActive("fullscreen");
      this.opts.fullscreen = true;
      this.height = this.$frame.css("height");
      this.width = (this.$box.width() - 2) + "px";
      c = this.getCode();
      this.tmpspan = b("<span></span>");
      this.$box.addClass("redactor_box_fullscreen").after(this.tmpspan);
      b(document.body).prepend(this.$box).css("overflow", "hidden");
      this.$editor = this.enable(c);
      b(this.doc).click(b.proxy(this.hideAllDropDown, this));
      b(this.doc).click(b.proxy(function (d) {
        this.$editor.focus()
      }, this));
      this.observeImages();
      this.$box.find(".redactor_resizer").hide();
      this.fullScreenResize();
      b(window).resize(b.proxy(this.fullScreenResize, this));
      b(document).scrollTop(0, 0);
      this.focus()
    } else {
      this.removeBtnIcon("fullscreen", "normalscreen");
      this.setBtnInactive("fullscreen");
      this.opts.fullscreen = false;
      b(window).unbind("resize", b.proxy(this.fullScreenResize, this));
      b(document.body).css("overflow", "");
      c = this.getCode();
      this.$box.removeClass("redactor_box_fullscreen").css("width", "auto");
      this.tmpspan.after(this.$box).remove();
      this.$editor = this.enable(c);
      this.observeImages();
      this.observeAutoResize();
      this.$box.find(".redactor_resizer").show();
      b(this.doc).click(b.proxy(this.hideAllDropDown, this));
      b(this.doc).click(b.proxy(function (d) {
        this.$editor.focus()
      }, this));
      this.syncCode();
      this.$frame.css("height", this.height);
      this.$el.css("height", this.height);
      this.focus()
    }
  }, fullScreenResize: function () {
    if (this.opts.fullscreen === false) {
      return
    }
    var d = 42;
    if (this.opts.air) {
      d = 2
    }
    var c = b(window).height() - d;
    this.$box.width(b(window).width() - 2);
    this.$frame.height(c);
    this.$el.height(c)
  }, buildResizer: function () {
    if (this.opts.resize === false) {
      return false
    }
    this.$resizer = b('<div class="redactor_resizer">&mdash;</div>');
    this.$box.append(this.$resizer);
    this.$resizer.mousedown(b.proxy(this.initResize, this))
  }, initResize: function (c) {
    if (c.preventDefault) {
      c.preventDefault()
    }
    this.splitter = c.target;
    if (this.opts.visual) {
      this.element_resize = this.$frame;
      this.element_resize.get(0).style.visibility = "hidden";
      this.element_resize_parent = this.$el
    } else {
      this.element_resize = this.$el;
      this.element_resize_parent = this.$frame
    }
    this.stopResizeHdl = b.proxy(this.stopResize, this);
    this.startResizeHdl = b.proxy(this.startResize, this);
    this.resizeHdl = b.proxy(this.resize, this);
    b(document).mousedown(this.startResizeHdl);
    b(document).mouseup(this.stopResizeHdl);
    b(this.splitter).mouseup(this.stopResizeHdl);
    this.null_point = false;
    this.h_new = false;
    this.h = this.element_resize.height()
  }, startResize: function () {
    b(document).mousemove(this.resizeHdl)
  }, resize: function (d) {
    if (d.preventDefault) {
      d.preventDefault()
    }
    var f = d.pageY;
    if (this.null_point === false) {
      this.null_point = f
    }
    if (this.h_new === false) {
      this.h_new = this.element_resize.height()
    }
    var c = (this.h_new + f - this.null_point) - 10;
    if (c <= 30) {
      return true
    }
    if (c >= 0) {
      this.element_resize.get(0).style.height = c + "px";
      this.element_resize_parent.get(0).style.height = c + "px"
    }
  }, stopResize: function (c) {
    b(document).unbind("mousemove", this.resizeHdl);
    b(document).unbind("mousedown", this.startResizeHdl);
    b(document).unbind("mouseup", this.stopResizeHdl);
    b(this.splitter).unbind("mouseup", this.stopResizeHdl);
    this.element_resize.get(0).style.visibility = "visible"
  }, resizeImage: function (d) {
    var g = false;
    var c = false;
    var l;
    var k;
    var f = b(d).width() / b(d).height();
    var h = 1;
    var i = 1;
    var j = 1;
    var e = 1;
    b(d).hover(function () {
      b(d).css("cursor", "nw-resize")
    }, function () {
      b(d).css("cursor", "default");
      g = false
    });
    b(d).mousedown(function (m) {
      if (m.preventDefault) {
        m.preventDefault()
      }
      g = true;
      c = true;
      l = Math.round(m.pageX - b(d).eq(0).offset().left);
      k = Math.round(m.pageY - b(d).eq(0).offset().top)
    });
    b(d).mouseup(b.proxy(function (m) {
      g = false;
      this.syncCode()
    }, this));
    b(d).click(b.proxy(function (m) {
      if (c) {
        this.imageEdit(m)
      }
    }, this));
    b(d).mousemove(function (q) {
      if (g) {
        c = false;
        var n = Math.round(q.pageX - b(this).eq(0).offset().left) - l;
        var m = Math.round(q.pageY - b(this).eq(0).offset().top) - k;
        var p = b(d).height();
        var r = parseInt(p) + m;
        var o = r * f;
        if (i == 1 || (typeof(i) == "number" && o < i && o > j)) {
          b(d).width(o)
        }
        if (h == 1 || (typeof(h) == "number" && r < h && r > e)) {
          b(d).height(r)
        }
        l = Math.round(q.pageX - b(this).eq(0).offset().left);
        k = Math.round(q.pageY - b(this).eq(0).offset().top)
      }
    })
  }, showTable: function () {
    this.modalInit(RLANG.table, this.opts.path + "/plugins/table.html", 300, b.proxy(function () {
      b("#redactor_table_rows").focus();
      b("#redactor_insert_table_btn").click(b.proxy(this.insertTable, this))
    }, this))
  }, insertTable: function () {
    var m = b("#redactor_table_rows").val();
    var f = b("#redactor_table_columns").val();
    var c = b("<div></div>");
    var d = Math.floor(Math.random() * 99999);
    var k = b('<table id="table' + d + '"><tbody></tbody></table>');
    for (var g = 0; g < m; g++) {
      var l = b("<tr></tr>");
      for (var j = 0; j < f; j++) {
        var e = b("<td>&nbsp;</td>");
        b(l).append(e)
      }
      b(k).append(l)
    }
    b(c).append(k);
    var h = b(c).html();
    if (b.browser.msie) {
      h += "<p></p>"
    } else {
      h += "<p>&nbsp;</p>"
    }
    this.execCommand("inserthtml", h);
    this.modalClose();
    this.$table = b(this.doc).find("body").find("#table" + d);
    this.$table.click(b.proxy(this.tableObserver, this))
  }, tableObserver: function (c) {
    this.$table = b(c.target).parents("table");
    this.$table_tr = this.$table.find("tr");
    this.$table_td = this.$table.find("td");
    this.$table_td.removeClass("current");
    this.$tbody = b(c.target).parents("tbody");
    this.$thead = b(this.$table).find("thead");
    this.$current_td = b(c.target);
    this.$current_td.addClass("current");
    this.$current_tr = b(c.target).parents("tr")
  }, deleteTable: function () {
    b(this.$table).remove();
    this.$table = false;
    this.syncCode()
  }, deleteRow: function () {
    b(this.$current_tr).remove();
    this.syncCode()
  }, deleteColumn: function () {
    var c = b(this.$current_td).get(0).cellIndex;
    b(this.$table).find("tr").each(function () {
      b(this).find("td").eq(c).remove()
    });
    this.syncCode()
  }, addHead: function () {
    if (b(this.$table).find("thead").size() !== 0) {
      this.deleteHead()
    } else {
      var c = b(this.$table).find("tr").first().clone();
      c.find("td").html("&nbsp;");
      this.$thead = b("<thead></thead>");
      this.$thead.append(c);
      b(this.$table).prepend(this.$thead);
      this.syncCode()
    }
  }, deleteHead: function () {
    b(this.$thead).remove();
    this.$thead = false;
    this.syncCode()
  }, insertRowAbove: function () {
    this.insertRow("before")
  }, insertRowBelow: function () {
    this.insertRow("after")
  }, insertColumnLeft: function () {
    this.insertColumn("before")
  }, insertColumnRight: function () {
    this.insertColumn("after")
  }, insertRow: function (c) {
    var d = b(this.$current_tr).clone();
    d.find("td").html("&nbsp;");
    if (c == "after") {
      b(this.$current_tr).after(d)
    } else {
      b(this.$current_tr).before(d)
    }
    this.syncCode()
  }, insertColumn: function (d) {
    var c = 0;
    this.$current_td.addClass("current");
    this.$current_tr.find("td").each(function (e, f) {
      if (b(f).hasClass("current")) {
        c = e
      }
    });
    this.$table_tr.each(function (e, f) {
      var g = b(f).find("td").eq(c);
      var h = g.clone();
      h.html("&nbsp;");
      if (d == "after") {
        b(g).after(h)
      } else {
        b(g).before(h)
      }
    });
    this.syncCode()
  }, showVideo: function () {
    if (b.browser.msie) {
      this.markerIE()
    }
    this.modalInit(RLANG.video, this.opts.path + "/plugins/video.html", 600, b.proxy(function () {
      b("#redactor_insert_video_area").focus();
      b("#redactor_insert_video_btn").click(b.proxy(this.insertVideo, this))
    }, this))
  }, insertVideo: function () {
    var c = b("#redactor_insert_video_area").val();
    if (b.browser.msie) {
      b(this.doc.getElementById("span" + this.spanid)).after(c).remove();
      this.syncCode()
    } else {
      this.execCommand("inserthtml", c)
    }
    this.modalClose()
  }, imageEdit: function (g) {
    var c = b(g.target);
    var f = c.parent();
    var d = b.proxy(function () {
      b("#redactor_file_alt").val(c.attr("alt"));
      b("#redactor_image_edit_src").attr("href", c.attr("src"));
      b("#redactor_form_image_align").val(c.css("float"));
      if (b(f).get(0).tagName == "A") {
        b("#redactor_file_link").val(b(f).attr("href"))
      }
      b("#redactor_image_delete_btn").click(b.proxy(function () {
        this.imageDelete(c)
      }, this));
      b("#redactorSaveBtn").click(b.proxy(function () {
        this.imageSave(c)
      }, this))
    }, this);
    this.modalInit(RLANG.image, this.opts.path + "/plugins/image_edit.html", 380, d)
  }, imageDelete: function (c) {
    b(c).remove();
    this.modalClose();
    this.syncCode()
  }, imageSave: function (d) {
    var c = b(d).parent();
    b(d).attr("alt", b("#redactor_file_alt").val());
    var f = b("#redactor_form_image_align").val();
    if (f == "left") {
      b(d).css({"float": "left", margin: "0 10px 10px 0"})
    } else {
      if (f == "right") {
        b(d).css({"float": "right", margin: "0 0 10px 10px"})
      } else {
        b(d).css({"float": "none", margin: "0"})
      }
    }
    var e = b.trim(b("#redactor_file_link").val());
    if (e !== "") {
      if (b(c).get(0).tagName != "A") {
        b(d).replaceWith('<a href="' + e + '">' + this.outerHTML(d) + "</a>")
      } else {
        b(c).attr("href", e)
      }
    }
    this.modalClose();
    this.observeImages();
    this.syncCode()
  }, showImage: function () {
    if (b.browser.msie) {
      this.markerIE()
    }
    var c = b.proxy(function () {
      if (this.opts.imageGetJson !== false) {
        b.getJSON(this.opts.imageGetJson, b.proxy(function (e) {
          b.each(e, b.proxy(function (g, h) {
            var f = b('<img src="' + h.thumb + '" rel="' + h.image + '" />');
            b("#redactor_image_box").append(f);
            b(f).click(b.proxy(this.imageSetThumb, this))
          }, this))
        }, this))
      } else {
        b("#redactor_tabs a").eq(1).remove()
      }
      if (this.opts.imageUpload !== false) {
        if (b("#redactor_file").size() !== 0) {
          b("#redactor_file").dragupload({url: this.opts.imageUpload, success: b.proxy(this.imageUploadCallback, this)})
        }
        this.uploadInit("redactor_file", {auto: true, url: this.opts.imageUpload, success: b.proxy(this.imageUploadCallback, this)})
      } else {
        b(".redactor_tab").hide();
        if (this.opts.imageGetJson === false) {
          b("#redactor_tabs").remove();
          b("#redactor_tab3").show()
        } else {
          var d = b("#redactor_tabs a");
          d.eq(0).remove();
          d.eq(1).addClass("redactor_tabs_act");
          b("#redactor_tab2").show()
        }
      }
      b("#redactor_upload_btn").click(b.proxy(this.imageUploadCallbackLink, this))
    }, this);
    this.modalInit(RLANG.image, this.opts.path + "/plugins/image.html", 570, c, true)
  }, imageSetThumb: function (c) {
    this._imageSet('<img alt="" src="' + b(c.target).attr("rel") + '" />')
  }, imageUploadCallbackLink: function () {
    if (b("#redactor_file_link").val() !== "") {
      var c = '<img src="' + b("#redactor_file_link").val() + '" />';
      this._imageSet(c)
    } else {
      this.modalClose()
    }
  }, imageUploadCallback: function (c) {
    this._imageSet(c)
  }, _imageSet: function (c) {
    c = "<p>" + c + "</p>";
    this.focus();
    if (b.browser.msie) {
      b(this.doc.getElementById("span" + this.spanid)).after(c).remove();
      this.syncCode()
    } else {
      this.execCommand("inserthtml", c)
    }
    this.modalClose();
    this.observeImages()
  }, showLink: function () {
    var c = b.proxy(function () {
      var g = this.getSelection();
      if (b.browser.msie) {
        var f = this.getParentNode();
        if (f.nodeName == "A") {
          this.insert_link_node = b(f);
          var h = this.insert_link_node.text();
          var d = this.insert_link_node.attr("href")
        } else {
          if (this.oldIE()) {
            var h = g.text
          } else {
            var h = g.toString()
          }
          var d = "";
          this.spanid = Math.floor(Math.random() * 99999);
          var e = '<span id="span' + this.spanid + '">' + h + "</span>";
          if (h != "") {
            e = '<span id="span' + this.spanid + '">' + h + "</span>"
          }
          this.execCommand("inserthtml", e)
        }
      } else {
        if (g && g.anchorNode.parentNode.tagName == "A") {
          var d = g.anchorNode.parentNode.href;
          var h = g.anchorNode.parentNode.text;
          if (g.toString() === "") {
            this.insert_link_node = g.anchorNode.parentNode
          }
        } else {
          var h = g.toString();
          var d = ""
        }
      }
      b(".redactor_link_text").val(h);
      b("#redactor_link_url").val(d).focus();
      b("#redactor_insert_link_btn").click(b.proxy(this.insertLink, this));
      if (this.opts.linkFileUpload === false) {
        b("#redactor_tabs a").eq(3).remove()
      } else {
        if (b("#redactor_file").size() != 0) {
          b("#redactor_file").dragupload({url: this.opts.linkFileUpload, success: b.proxy(this.insertLinkFile, this)})
        }
        this.uploadInit("redactor_file", {auto: true, url: this.opts.linkFileUpload, success: b.proxy(this.insertLinkFile, this)})
      }
    }, this);
    this.modalInit(RLANG.link, this.opts.path + "/plugins/link.html", 460, c)
  }, insertLink: function () {
    var d = b("#redactor_tab_selected").val();
    var c = "", e = "";
    if (d == 1) {
      c = b("#redactor_link_url").val();
      e = b("#redactor_link_url_text").val()
    } else {
      if (d == 2) {
        c = "mailto:" + b("#redactor_link_mailto").val();
        e = b("#redactor_link_mailto_text").val()
      } else {
        if (d == 3) {
          c = "#" + b("#redactor_link_anchor").val();
          e = b("#redactor_link_anchor_text").val()
        }
      }
    }
    this._insertLink('<a href="' + c + '">' + e + "</a> ", b.trim(e), c)
  }, insertLinkFile: function (c) {
    text = b("#redactor_link_file_text").val();
    this._insertLink('<a href="' + c + '">' + text + "</a> ", b.trim(text), c)
  }, _insertLink: function (c, e, d) {
    if (e != "") {
      if (this.insert_link_node) {
        b(this.insert_link_node).text(e);
        b(this.insert_link_node).attr("href", d);
        this.syncCode()
      } else {
        if (b.browser.msie) {
          b(this.doc.getElementById("span" + this.spanid)).replaceWith(c);
          this.syncCode()
        } else {
          this.execCommand("inserthtml", c)
        }
      }
    }
    this.modalClose()
  }, showFile: function () {
    if (b.browser.msie) {
      this.markerIE()
    }
    var c = b.proxy(function () {
      b("#redactor_file").dragupload({url: this.opts.fileUpload, success: b.proxy(function (d) {
        this.fileUploadCallback(d)
      }, this)});
      this.uploadInit("redactor_file", {auto: true, url: this.opts.fileUpload, success: b.proxy(function (d) {
        this.fileUploadCallback(d)
      }, this)})
    }, this);
    this.modalInit(RLANG.file, this.opts.path + "/plugins/file.html", 500, c)
  }, fileUploadCallback: function (c) {
    if (b.browser.webkit && !!window.chrome) {
      c = c + "&nbsp;"
    }
    if (b.browser.msie) {
      b(this.doc.getElementById("span" + this.spanid)).after(c).remove();
      this.syncCode()
    } else {
      this.execCommand("inserthtml", c)
    }
    this.modalClose()
  }, modalInit: function (g, d, f, e, c) {
    if (b("#redactor_modal_overlay").size() == 0) {
      this.overlay = b('<div id="redactor_modal_overlay" style="display: none;"></div>');
      b("body").prepend(this.overlay)
    }
    if (this.opts.overlay) {
      b("#redactor_modal_overlay").show();
      b("#redactor_modal_overlay").click(b.proxy(this.modalClose, this))
    }
    if (b("#redactor_modal").size() == 0) {
      this.modal = b('<div id="redactor_modal" style="display: none;"><div id="redactor_modal_close">&times;</div><div id="redactor_modal_header"></div><div id="redactor_modal_inner"></div></div>');
      b("body").append(this.modal)
    }
    b("#redactor_modal_close").click(b.proxy(this.modalClose, this));
    this.hdlModalClose = b.proxy(function (h) {
      if (h.keyCode == 27) {
        this.modalClose()
      }
    }, this);
    b(document).keyup(this.hdlModalClose);
    b(this.doc).keyup(this.hdlModalClose);
    b.ajax({dataType: "html", type: "get", url: d, success: b.proxy(function (i) {
      b.each(RLANG, function (j, l) {
        var k = new RegExp("%RLANG." + j + "%", "gi");
        i = i.replace(k, l)
      });
      b("#redactor_modal_inner").html(i);
      b("#redactor_modal_header").html(g);
      if (b("#redactor_tabs").size() != 0) {
        b("#redactor_tabs a").each(function (j, k) {
          j++;
          b(k).click(function () {
            b("#redactor_tabs a").removeClass("redactor_tabs_act");
            b(this).addClass("redactor_tabs_act");
            b(".redactor_tab").hide();
            b("#redactor_tab" + j).show();
            b("#redactor_tab_selected").val(j);
            var l = b("#redactor_modal").outerHeight();
            b("#redactor_modal").css("margin-top", "-" + (l + 10) / 2 + "px")
          })
        })
      }
      b("#redactor_btn_modal_close").click(b.proxy(this.modalClose, this));
      if (typeof(e) == "function") {
        e()
      }
      var h = b("#redactor_modal").outerHeight();
      b("#redactor_modal").css({width: f + "px", height: "auto", marginTop: "-" + (h + 10) / 2 + "px", marginLeft: "-" + (f + 60) / 2 + "px"}).fadeIn("fast");
      if (c === true) {
        b("#redactor_image_box").height(300).css("overflow", "auto")
      }
    }, this)})
  }, modalClose: function () {
    b("#redactor_modal_close").unbind("click", this.modalClose);
    b("#redactor_modal").fadeOut("fast", b.proxy(function () {
      b("#redactor_modal_inner").html("");
      if (this.opts.overlay) {
        b("#redactor_modal_overlay").hide();
        b("#redactor_modal_overlay").unbind("click", this.modalClose)
      }
      b(document).unbind("keyup", this.hdlModalClose);
      b(this.doc).unbind("keyup", this.hdlModalClose)
    }, this))
  }, uploadInit: function (d, c) {
    this.uploadOptions = {url: false, success: false, start: false, trigger: false, auto: false, input: false};
    b.extend(this.uploadOptions, c);
    if (b("#" + d).size() != 0 && b("#" + d).get(0).tagName == "INPUT") {
      this.uploadOptions.input = b("#" + d);
      this.element = b(b("#" + d).get(0).form)
    } else {
      this.element = b("#" + d)
    }
    this.element_action = this.element.attr("action");
    if (this.uploadOptions.auto) {
      b(this.uploadOptions.input).change(b.proxy(function () {
        this.element.submit(function (f) {
          return false
        });
        this.uploadSubmit()
      }, this))
    } else {
      if (this.uploadOptions.trigger) {
        b("#" + this.uploadOptions.trigger).click(b.proxy(this.uploadSubmit, this))
      }
    }
  }, uploadSubmit: function () {
    this.uploadForm(this.element, this.uploadFrame())
  }, uploadFrame: function () {
    this.id = "f" + Math.floor(Math.random() * 99999);
    var e = document.createElement("div");
    var c = '<iframe style="display:none" src="about:blank" id="' + this.id + '" name="' + this.id + '"></iframe>';
    e.innerHTML = c;
    document.body.appendChild(e);
    if (this.uploadOptions.start) {
      this.uploadOptions.start()
    }
    b("#" + this.id).load(b.proxy(this.uploadLoaded, this));
    return this.id
  }, uploadForm: function (g, e) {
    if (this.uploadOptions.input) {
      var h = "redactorUploadForm" + this.id;
      var c = "redactorUploadFile" + this.id;
      this.form = b('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + e + '" name="' + h + '" id="' + h + '" enctype="multipart/form-data"></form>');
      var d = this.uploadOptions.input;
      var i = b(d).clone();
      b(d).attr("id", c);
      b(d).before(i);
      b(d).appendTo(this.form);
      b(this.form).css("position", "absolute");
      b(this.form).css("top", "-2000px");
      b(this.form).css("left", "-2000px");
      b(this.form).appendTo("body");
      this.form.submit()
    } else {
      g.attr("target", e);
      g.attr("method", "POST");
      g.attr("enctype", "multipart/form-data");
      g.attr("action", this.uploadOptions.url);
      this.element.submit()
    }
  }, uploadLoaded: function () {
    var c = b("#" + this.id);
    if (c.contentDocument) {
      var e = c.contentDocument
    } else {
      if (c.contentWindow) {
        var e = c.contentWindow.document
      } else {
        var e = window.frames[this.id].document
      }
    }
    if (e.location.href == "about:blank") {
      return true
    }
    if (this.uploadOptions.success) {
      this.uploadOptions.success(e.body.innerHTML)
    }
    this.element.attr("action", this.element_action);
    this.element.attr("target", "")
  }, markerIE: function () {
    this.spanid = Math.floor(Math.random() * 99999);
    this.execCommand("inserthtml", '<span id="span' + this.spanid + '"></span>')
  }, oldIE: function () {
    if (b.browser.msie && parseInt(b.browser.version, 10) < 9) {
      return true
    }
    return false
  }, outerHTML: function (c) {
    return b("<p>").append(b(c).eq(0).clone()).html()
  }, normalize: function (c) {
    return parseInt(c.replace("px", ""))
  }};
  b.fn.getDoc = function () {
    return b(this.data("redactor").doc)
  };
  b.fn.getFrame = function () {
    return this.data("redactor").$frame
  };
  b.fn.getEditor = function () {
    return this.data("redactor").$editor
  };
  b.fn.getCode = function () {
    return this.data("redactor").getCode()
  };
  b.fn.setCode = function (c) {
    this.data("redactor").setCode(c)
  };
  b.fn.insertHtml = function (c) {
    this.data("redactor").insertHtml(c)
  };
  b.fn.destroyEditor = function () {
    this.data("redactor").destroy();
    this.removeData("redactor")
  };
  b.fn.setFocus = function () {
    this.data("redactor").focus()
  };
  b.fn.execCommand = function (c, d) {
    this.data("redactor").execCommand(c, d)
  }
})(jQuery);
(function (b) {
  b.fn.dragupload = function (c) {
    return this.each(function () {
      var d = new a(this, c);
      d.init()
    })
  };
  function a(d, c) {
    this.opts = b.extend({url: false, success: false, preview: false, text: RLANG.drop_file_here, atext: RLANG.or_choose}, c);
    this.$el = b(d)
  }

  a.prototype = {init: function () {
    if (!b.browser.opera && !b.browser.msie) {
      this.droparea = b('<div class="redactor_droparea"></div>');
      this.dropareabox = b('<div class="redactor_dropareabox">' + this.opts.text + "</div>");
      this.dropalternative = b('<div class="redactor_dropalternative">' + this.opts.atext + "</div>");
      this.droparea.append(this.dropareabox);
      this.$el.before(this.droparea);
      this.$el.before(this.dropalternative);
      this.dropareabox.bind("dragover", b.proxy(function () {
        return this.ondrag()
      }, this));
      this.dropareabox.bind("dragleave", b.proxy(function () {
        return this.ondragleave()
      }, this));
      this.dropareabox.get(0).ondrop = b.proxy(function (e) {
        e.preventDefault();
        this.dropareabox.removeClass("hover").addClass("drop");
        var d = e.dataTransfer.files[0];
        var c = new FormData();
        c.append("file", d);
        b.ajax({dataType: "html", url: this.opts.url, data: c, cache: false, contentType: false, processData: false, type: "POST", success: b.proxy(function (f) {
          if (this.opts.success !== false) {
            this.opts.success(f)
          }
          if (this.opts.preview === true) {
            this.dropareabox.html(f)
          }
        }, this)})
      }, this)
    }
  }, ondrag: function () {
    this.dropareabox.addClass("hover");
    return false
  }, ondragleave: function () {
    this.dropareabox.removeClass("hover");
    return false
  }}
})(jQuery);
(function (b) {
  var d = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g, a = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g, c = function () {
    var g = this.childNodes, f = g.length;
    while (f--) {
      var h = g[f];
      if (h.nodeType == 3) {
        var e = h.nodeValue;
        if (e) {
          e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(d, '$1<a href="http://$2">$2</a>$3').replace(a, '$1<a href="$2">$2</a>$5');
          b(h).after(e).remove()
        }
      } else {
        if (h.nodeType == 1 && !/^(a|button|textarea)$/i.test(h.tagName)) {
          c.call(h)
        }
      }
    }
  };
  b.fn.linkify = function () {
    this.each(c)
  }
})(jQuery);