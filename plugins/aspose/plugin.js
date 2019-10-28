(function () {
	var removePgbrReg = /<pgbr[^>][^>]*>(.*?)<\/pgbr>/g;
	var STYLES_THAT_NEED_SET_AS_DEFAULT = ['font-size', 'font-weight', 'font-family', 'font-style', 'color'];
	var throttle = false;
	var debounced = null;

	function defaultStyle(editor, defaultStyles) {
		var self = this;

		this.defaultStyles = defaultStyles || {};
		this.editor = editor;

		this.styleNamesThatNeedSet = STYLES_THAT_NEED_SET_AS_DEFAULT.reduce(
			function(acc, styleName) {
				if (defaultStyles[styleName]) {
					acc.push(styleName)
				}

				return acc
			},
			[]
		);

		this.styleNamesThatNeedSet.length && editor.on('key', function (event) {
			if (event.data.domEvent.$.key.length === 1) {
				self.setDefaultStyles();
			}
		})
	}


	function validateParagraph($editor) {
		var POSSIBLE_ERRORS = [
			'more than one element first level',
			'have table inside',
			'have more than one list',
			'have more than one inserted paragraph'
			// 'have list inside'
		];
		var errors = [];
		var children = $editor.children();

		if ($editor.children().length > 1) {
			errors.push(POSSIBLE_ERRORS[0])
		}

		if ($editor.find('p p').length > 0) {
			errors.push(POSSIBLE_ERRORS[4])
		}

		if ($editor.find('* table').length && $editor.text().length > $editor.find('table').text().length) {
			errors.push(POSSIBLE_ERRORS[1])
		}

		if (['OL', 'UL'].indexOf(children[0] && children[0].tagName) !== -1 && children[0] && children[0].children.length > 1) {
			errors.push(POSSIBLE_ERRORS[3])
		}

		// if ($editor.find('p ol, p ul').length) {
		// 	errors.push(POSSIBLE_ERRORS[4])
		// }

		return errors;
	}

	defaultStyle.prototype = {
		/**
		 * make style name from dash to camelCase
		 * example: "font-size" => "fontSize"
		 * @param name
		 */
		normalizeStyleName: function (name) {
			return name.replace(/-([a-z])/, function (match, letter) {
				return letter.toUpperCase();
			});
		},

		hasStyle: function (element, style) {
			return element.style[this.normalizeStyleName(style)];
		},

		makeStyleObject: function (styleNames) {
			var styleObj = {};

			for (var i = 0; i < styleNames.length; i++) {
				styleObj[styleNames[i]] = this.defaultStyles[styleNames[i]];
			}

			return styleObj;
		},

		setDefaultStyles: function () {
			var editorDOMContainer = this.editor.editable().$;
			var styles = this.styleNamesThatNeedSet;

			if (editorDOMContainer.innerText.length > 1) {
				return
			}

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
		afterInit: function (editor) {
			setTimeout(function () {
				var editorDOMContainer = editor.editable().$;

				editorDOMContainer.addEventListener('click', function(e) {
					var target = e.target;

					if (target.tagName !== 'INPUT') {
						return;
					}

					if (target.hasAttribute('checked')) {
						target.removeAttribute('checked');
						target.checked = false;
					} else {
						target.setAttribute( 'checked', 'checked' );
						target.checked = true;
					}
				})
			}, 2e2)
		},
		init: function (editor) {
			var config = editor.config;

			new defaultStyle(editor, config.defaultStyles);

			editor.on('key', function (event) {
				var kc = event.data.keyCode,
					csa = ~(CKEDITOR.CTRL | CKEDITOR.SHIFT | CKEDITOR.ALT);
				if (kc == 13 && (kc & csa) == 13) { //enter
					setTimeout(function () {
						var element = editor.getSelection().getStartElement();
						if (element.hasAscendant('p'))
							element = element.getAscendant('p');
						if (element.getName() == 'p') {
							if (element.hasAttribute("data-id")) {
								element.removeAttribute("data-id");
							}
						}
					}, 40);
				}
			});

			// Disable adding pagebreak into table
			editor.on('selectionChange', function (event) {
				var path = event.data.path;

				if (path.elements && path.elements.some(function (element) { return element.getName() === 'table'; })) {
					editor.getCommand('pagebreak').disable();
				} else {
					editor.getCommand('pagebreak').enable();
				}

				if (config.singleParagraphEdit) {
					var $editor = $(editor.editable().$);

					if ($editor.children().length === 1 && $editor.text().length === $editor.find('ol, ul').text().length) {
						editor.getCommand('numberedlist').enable();
						editor.getCommand('bulletedlist').enable();
					}

					if ($editor.find('ol').length) {
						editor.getCommand('bulletedlist').disable();
					} else {
						editor.getCommand('bulletedlist').enable();
					}

					if ($editor.find('ul').length) {
						editor.getCommand('numberedlist').disable();
					} else {
						editor.getCommand('numberedlist').enable();
					}
				}
			});

			editor.on('paste', function (event) {
				event.data.dataValue = event.data.dataValue.replace(removePgbrReg, '');

				if (config.singleParagraphEdit) {
					setTimeout(function() {
						useOnlyOneParagraph(editor, $(editor.editable().$).clone());
					}, 20);
				}
			});

			editor.on('change', function() {
				if (debounced) {
					clearTimeout(debounced);
					debounced = null;
				}

				debounced = setTimeout(function () {
					var $editor = $(editor.editable().$);
					var errors = validateParagraph($editor);

					if(config.singleParagraphEdit) {
						if (errors.length && !throttle) {
							removeTableInList($editor);
							clearEmptyNodes($editor);
							wrapMultipleNodesIntoOne($editor);
						}
					}

					setTdWidth($editor);
				}, 100);
				});

			editor.element.$.parentNode.addEventListener('keydown', function (e) {
				if (e.keyCode !== 46 && e.keyCode !== 8) {
					return;
				}

				var selection = editor.getSelection();
				var range = selection.getRanges();
				var elem;
				var backwards = false;

				for (var i = 0, len = range.length; i < len; ++i) {
					if (!range[i].collapsed) {
						backwards = true;
						break;
					}
				}

				if (!backwards && range[0]) {
					if (range[0].startContainer.$.nodeType === 1) {
						elem = range[0].startContainer.$;
					} else {
						elem = range[0].startContainer.$.parentNode;
					}

					if (elem && !elem.getAttribute('content-editable') && elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					if (e.keyCode === 8 && elem && !elem.getAttribute('content-editable')) {
						elem = elem.previousElementSibling;
					} else if (e.keyCode === 46 && elem && !elem.getAttribute('content-editable')) {
						elem = elem.nextElementSibling;
					}
				}

				if (!backwards && elem && elem.getAttribute('content-editable') === 'false') {
					var parent = elem.parentNode;
					e.preventDefault();
					e.stopImmediatePropagation();
					parent.removeChild(elem);
					editor.fire('change');
					parent.style['margin-left'] = '';
					parent.style['text-indent'] = '';
				}
			}, true);
		}
	});
})();

function useOnlyOneParagraph(editor, $html) {
	var children = $html.children();
	var TAGS_FOR_SKIP_CONVERTING = ['OL', 'UL', 'LI', 'TABLE', 'TR', 'TD'];
	var TAGS_REPLACER_REG = /(<\/?)(p|div)/g;
	var skipAppend = false;

	if (children.length < 1 && $(children[0]).find('p, div').size === 0) {
		return;
	}

	for(var i = 0; i < children.length; i++) {
		var child = children[i];

		if (['ING', 'PGBR'].indexOf(child.tagName) === -1 && !child.innerText) {
			child.parentNode.removeChild(child);
		}
	}

	children = $html.children();

	for(var i = 0; i < children.length; i++) {
		if (TAGS_FOR_SKIP_CONVERTING.indexOf(children[i].tagName) !== -1) {
			skipAppend = true;
		}
	}

	if (!skipAppend) {
		children[0].innerHTML = children[0].innerHTML.replace(TAGS_REPLACER_REG, '$1span');

		for(var i = 1; i < children.length; i++) {
			var child = children[i];
			var newChild = document.createElement('span', child.attributes);

			newChild.innerHTML = child.innerHTML.replace(TAGS_REPLACER_REG, '$1span');
			children[0].appendChild(newChild);
			child.parentNode.removeChild(child);
		}
	}

	editor.setData($html.html());
}

function clearEmptyNodes($editor) {
	$editor.children().each(function(index, item) {
		if (!item.innerText) {
			item.parentNode.removeChild(item);
		}
	});
}

function removeTableInList($editor) {
	var $tableInList = $editor.find("ul > li table");
	var $ul = $tableInList.parent("ul");
	$tableInList.each(function(index, value) {
		var $table = $(value);
		$ul.after($table);
		$table.parent("li").remove();
	});

	$("ul:empty").remove();
}

function wrapMultipleNodesIntoOne($editor) {
	if ($editor.children.length > 1) {
		$editor.wrapInner($("<div/>"));
	}
}

function setTdWidth($editor) {
	var ptPxCoef = 0.75;

	$editor.find('td,th').each(function() {
		if (!this.style.width) {
			this.style.width = parseInt(window.getComputedStyle(this).width, 10) * ptPxCoef + 'pt';
		}
	})
}
