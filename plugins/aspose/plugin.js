(function() {
	var removePgbrReg = /<pgbr[^>][^>]*>(.*?)<\/pgbr>/g;
	var STYLES_THAT_NEED_SET_AS_DEFAULT = ['font-size', 'font-weight', 'font-family', 'font-style'];

	function defaultStyle(editor, defaultStyles) {
		var self = this;

		this.defaultStyles = defaultStyles || {};
		this.styleNamesThatNeedSet = [];
		this.editor = editor;

		for(var i = 0; i < STYLES_THAT_NEED_SET_AS_DEFAULT.length; i++) {
			if (this.defaultStyles[STYLES_THAT_NEED_SET_AS_DEFAULT[i]]) {
				this.styleNamesThatNeedSet.push(STYLES_THAT_NEED_SET_AS_DEFAULT[i]);
			}
		}

		this.styleNamesThatNeedSet.length && editor.on('key', function(event) {
			if (event.data.domEvent.$.key.length === 1) {
				self.setDefaultStyles();
			}
		})
	}

	defaultStyle.prototype = {
		getTagStyleName: function (name) {
			return name.replace(/-([a-z])/, function(match, letter) {
				return letter.toUpperCase();
			});
		},

		getStylesThatNeedApply: function () {
			var range = this.editor.getSelection().getRanges()[0];
			var document = range.document;
			var editorDOMContainer = this.editor.editable().$;
			var container = range.startContainer.$;
			var stylesThatNeedApply = this.styleNamesThatNeedSet.slice(0);

			if (container === range.endContainer.$ && container !== editorDOMContainer) {
				while(container !== editorDOMContainer && container !== document && stylesThatNeedApply.length) {
					container = container.parentNode;

					if (container.nodeType === 1) {
						for(var i = 0; i < stylesThatNeedApply.length; i++) {
							if (this.hasStyle(container, stylesThatNeedApply[i])) {
								stylesThatNeedApply.splice(i--, 1);
							}
						}
					}
				}
			}

			return stylesThatNeedApply;
		},

		hasStyle: function(element, style) {
			return element.style[this.getTagStyleName(style)];
		},

		makeStyleObject: function(styleNames) {
			var styleObj = {};

			for(var i = 0; i < styleNames.length; i++) {
				styleObj[styleNames[i]] = this.defaultStyles[styleNames[i]];
			}

			return styleObj;
		},

		setDefaultStyles: function() {
			var styles = this.getStylesThatNeedApply();

			if (styles.length) {
				var style = new CKEDITOR.style({
					element: 'span',
					styles: this.makeStyleObject(styles)
				});

				this.editor.applyStyle(style);
			}
		}
	};

	CKEDITOR.plugins.add('aspose', {
		init: function (editor) {
			var config = editor.config;

			new defaultStyle(editor, config.defaultStyles);

			// Disable adding pagebreak into table
			editor.on('selectionChange', function (event) {
				var path = event.data.path;

				if (path.elements && path.elements.some(function(element) { return element.getName() === 'table'; })) {
					editor.getCommand('pagebreak').disable();
				} else {
					editor.getCommand('pagebreak').enable();
				}
			});

			// Remove page break on paste
			editor.on('paste', function(event) {
				event.data.dataValue = event.data.dataValue.replace(removePgbrReg, '');
			});
		}
	});
})();

