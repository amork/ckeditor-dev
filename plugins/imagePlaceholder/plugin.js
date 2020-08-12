/*
 * Awesome ImagePlaceholder Plugin for CKEditor (http://github.com/seyar)
 */
CKEDITOR.plugins.add("imagePlaceholder", {
	lang: ["en"],
	requires: "dialog",
	icons: "",
	defaultImageData: {
		label: 'image',
		required: true,
		param: {
			align: 'float',
			width: '120px',
			height: '120px'
		}
	},
	imageData: {
		label: 'image',
		required: true,
		param: {
			align: 'float',
			width: '120px',
			height: '120px'
		}
	},
  hidpi: false,
	init: function(editor) {
		var pluginName = "imagePlaceholder";
		editor.ui.addButton("imagePlaceholder", {
			label: editor.lang.common.image,
			command: pluginName,
			toolbar: "insert"
		});
		CKEDITOR.dialog.add(
			pluginName,
			this.path + "dialogs/imagePlaceholder.js"
		);

		var allowed =
				"img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}",
			required = "img[alt,src]";

		editor.addCommand(
			pluginName,
			new CKEDITOR.dialogCommand(pluginName, {
				allowedContent: allowed,
				requiredContent: required,
				contentTransformations: [
					["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
					[
						"img{float}: alignmentToStyle",
						"img[align]: alignmentToAttribute"
					]
				]
			})
		);
		editor.on("doubleclick", function(evt) {
			if (
				evt.data.element &&
				!evt.data.element.isReadOnly() &&
				evt.data.element.getName() === "img" &&
				evt.data.element.getAttribute('class').indexOf('image-placeholder_cke') !== -1
			) {
				evt.data.dialog = pluginName;

				try {
					var data = JSON.parse(evt.data.element.getAttribute('data-params'));
					editor.plugins[pluginName].setAllData(data);
				} catch (e) {
					window.console ? window.console.error(e) : '';
				}
				editor.getSelection().selectElement(evt.data.element);
			}
    });

		if (editor.addMenuItem) {
			editor.addMenuGroup("imagePlaceholderGroup");
			editor.addMenuItem("imagePlaceholderItem", {
				label: editor.lang.common.image,
				command: pluginName,
				group: "imagePlaceholderGroup"
			});
		}
	},
	setAllData: function (data) {
		this.imageData = data;
	},
	setData: function (key, value) {
		this.imageData[key] = value;
	},
	setDataParam: function (key, value) {
		var par = {
			width: this.imageData.param.width,
			height: this.imageData.param.height,
			align: this.imageData.param.align
		};
		par[key] = value;
		this.imageData.param = par;
	},
	getData: function (key) {
		// clone object if need
		return key ? this.imageData[key] : JSON.parse(JSON.stringify(this.imageData));
	},
  onLoad: function () {
    var css = 'input[name="cke_image-placeholder_radio_radio"] { \
      position: relative; \
      top: 105px; \
      left: 47%; \
		} \
		.cke_dialog_ui_text.control-image-width input[disabled], \
		.cke_dialog_ui_text.control-image-height input[disabled] { \
			background-color: #e0e0e0; \
		} \
    .cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label, \
    .cke_dialog_ui_hbox_first > input[name="cke_image-placeholder_radio_radio"] + label { \
      background: url(' + this.path + 'icons/size-justify.png) center top no-repeat; \
      display: block; \
      width: 80%; \
      margin: 0 auto 16px auto; \
      padding: 70px 0 0 0; \
      text-align: center; \
      cursor: pointer; \
      user-select: none; \
    } \
    .cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label { \
      background: url(' + this.path + 'icons/size-float.png) center top no-repeat; \
    } \
    .cke_dialog_ui_hbox_first > input[name="cke_image-placeholder_radio_radio"]:checked + label, \
    .cke_dialog_ui_hbox_first > input[name="cke_image-placeholder_radio_radio"] + label:hover { \
      background: url(' + this.path + 'icons/size-justify.png) center -242px no-repeat; \
    } \
    .cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"]:checked + label, \
    .cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label:hover { \
      background: url(' + this.path + 'icons/size-float.png) center -242px no-repeat; \
    }';

    CKEDITOR.addCss(css);
	},
	afterInit: function(editor) {
		var placeholderReplaceRegex = /\[\[(\{.+?\})]]/g;
		var path = this.path;

		editor.dataProcessor.dataFilter.addRules({
			text: function(text, node) {
				var dtd = node.parent && CKEDITOR.dtd[node.parent.name];

				// Skip the case when placeholder is in elements like <title> or <textarea>
				// but upcast placeholder in custom elements (no DTD).
				if (dtd && !dtd.span) return;

				return text.replace(placeholderReplaceRegex, function(
					match,
					$1
				) {
					// Creating widget code.
					var parsed = JSON.parse($1);

					parsed.param = parsed.param || {};
					var classes = "";
					if (parsed.required) {
						classes += " cke_placeholder_required";
					}
					classes += " align_" + (parsed.param.align || '');

					var element = new CKEDITOR.htmlParser.element(
						"img",
						{
							'class': "image-placeholder_cke" + classes,
							'data-params': $1,
							width: parsed.param.width || '120px',
							height: parsed.param.height !== '100%' ? parsed.param.height : '',
							src: parsed.value || path + 'icons/preview-' + (parsed.param.align === 'justify' ? 'justify' : 'float') + '.png'
						}
					);

					return element.getOuterHtml();
				});
			}
		});
	}
});

