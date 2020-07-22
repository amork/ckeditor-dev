CKEDITOR.plugins.add('cancelChanges', {
    showDelay: 200,
    hideDelay: 700,
    topCorrection: 42,
    leftCorrection: 20,
    currentElement: null,

    init: function(editor) {
        var _this = this;

        this.$body = $('body');
        editor.on('instanceReady', function() {
            var editorInstance = $(editor.editable().$);
            var clientX = 0;
            var clientY = 0;

            editorInstance.on('mouseover', 'ins:not([data-username]), del:not([data-username])', function(e) {
                editorInstance.on('mousemove', function(e) {
                    clientX = e.clientX;
                    clientY = e.clientY;
                });

                if (_this.currentElement === e.target) return;

	            _this.hideTooltip()
                clearTimeout(_this.timerShow);
                clearTimeout(_this.timerHide);
                _this.timerShow = setTimeout(function() {_this.showTooltip(e, clientX, clientY, editor)}, _this.showDelay);
            })

            editorInstance.on('mouseout click', 'ins, del', function(e) {
                editorInstance.off('mousemove');
                clearTimeout(_this.timerShow);
                clearTimeout(_this.timerHide);
                _this.timerHide = setTimeout(function() {_this.hideTooltip()}, _this.hideDelay);
            })
        });

        editor.on('destroy', function() {
            _this.hideTooltip();
        });
    },

    showTooltip: function(e, clientX, clientY, editor) {
        var target = e.target;
        var _this = this;
        var $tgt = $(target);
        var top = clientY - this.topCorrection + window.pageYOffset - (document.clientTop || 0);
        var left = Math.min(clientX, $tgt.offset().left + $tgt.width()) - this.leftCorrection + window.pageXOffset - (document.clientLeft || 0);

        this.currentElement = e.target;

        $('<div class="ckeditor-tooltip" style="z-index: 100500; position: absolute; left:' + left + 'px; top:' + top + 'px;">' +
            '<span class="ckeditor-tooltip__remove">Reject</span>' +
            '</div>')
            .on('mouseover', function() {
                clearTimeout(_this.timerHide);
            })
            .on('mouseout', function() {
                clearTimeout(_this.timerShow);
                _this.timerHide = setTimeout(function() {_this.hideTooltip()}, _this.hideDelay);
            })
            .on('mousedown', function() {
                var selObj = window.getSelection();
                var selectedText = selObj.toString().trim();
                if($tgt.prop('tagName') === 'DEL') {
                    var innerText = $tgt.text();

                    if (selectedText && selectedText.length < innerText.length) {
                      var startIndex = innerText.indexOf(selectedText)

                      $tgt.replaceWith(function() {
                        var parts = []
                        if (startIndex === 0) { // at start
                          parts = [
                              selectedText,
                              innerText[selectedText.length] === ' ' ? ' ' : '',
                              '<del>', innerText.slice(selectedText.length).trim(), '</del>'
                            ];

                        } else if (startIndex + selectedText.length < innerText.length - 1) { // middle
                            console.log("innerText[startIndex] = ", innerText[startIndex]);
                          parts = [
                                '<del>', innerText.slice(0, startIndex).trim(), '</del>',
                                innerText[startIndex - 1] === ' ' ? ' ' : '',
                                selectedText,
                                innerText[startIndex + selectedText.length] === ' ' ? ' ' : '',
                                '<del>', innerText.slice(startIndex + selectedText.length).trim(), '</del>'
                            ];

                        } else { // at end
                          parts = [
                              '<del>', innerText.slice(0, startIndex).trim(), '</del>',
                              innerText[startIndex - 1] === ' ' ? ' ' : '',
                              selectedText
                            ];
                        }

                        return parts.join('');
                      });

                      $tgt.replaceWith(function() {
                        return $(this).html();
                      });
                    } else {
                      $tgt.replaceWith(function() {
                        return $(this).html();
                      });
                    }
                } else {
                    $tgt.remove();
                }

                _this.hideTooltip();
                editor.focus();
                editor.fire('change');
            })
            .appendTo(this.$body);
    },

    hideTooltip: function() {
        this.currentElement = null;
        $('body').find('.ckeditor-tooltip').remove();
    }
});
