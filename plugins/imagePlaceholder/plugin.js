/*
 * ImagePlaceholder Plugin for CKEditor (http://github.com/nmmf/imagePlaceholder)
 */
CKEDITOR.plugins.add("imagePlaceholder", {
	lang: ["en"],
	requires: "dialog",
	icons: "imagePlaceholder",
  hidpi: true,
	init: function(editor) {
		var pluginName = "imagePlaceholderDialog";

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
				evt.data.element.getName() === "img"
			) {
				evt.data.dialog = pluginName;
				editor.getSelection().selectElement(evt.data.element);
			}
    });

		if (editor.addMenuItem) {
      // todo
			editor.addMenuGroup("imagePlaceholderGroup");
			editor.addMenuItem("imagePlaceholderItem", {
				label: editor.lang.common.image,
				icon: this.path + "icons/imagePlaceholder.png",
				command: pluginName,
				group: "imagePlaceholderGroup"
			});
		}
  },
  onLoad: function () {
    // Register styles for placeholder widget frame.
    CKEDITOR.addCss('input[name="cke_image-placeholder_radio_radio"] {' +
    '  position: relative;' +
    '  top: 105px;' +
    '  left: 47%;' +
    '}' +
    '.cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label,' +
    '.cke_dialog_ui_hbox_first > input[name="cke_image-placeholder_radio_radio"] + label {' +
    '  background: url(' + this.path + 'icons/size-original.png) center top no-repeat;' +
    '  display: block;' +
    '  width: 80%;' +
    '  margin: 0 auto 16px auto;' +
    '  padding: 70px 0 0 0;' +
    '  text-align: center;' +
    '  cursor: pointer;' +
    '  user-select: none;' +
    '}' +
    '.cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label {' +
    '  background: url(' + this.path + 'icons/size-contain.png) center top no-repeat;' +
    '}' +
    '.cke_dialog_ui_hbox_first > input[name="cke_image-placeholder_radio_radio"] + label:hover {' +
    '  background: url(' + this.path + 'icons/size-original-hover.png) center top no-repeat;' +
    '}' +
    '.cke_dialog_ui_hbox_last > input[name="cke_image-placeholder_radio_radio"] + label:hover {' +
    '  background: url(' + this.path + 'icons/size-contain-hover.png) center top no-repeat;' +
    '}' +
    '.image-placeholder {' +
    '  text-indent: -9000px;' +
    '  display: block;' +
    '  width: 120px;' +
    '  height: 120px;' +
    '}' +
    '.image-placeholder.mode_original {' +
    '  background: #f0f1f2 url(' + this.path + 'icons/preview-original.png) center no-repeat;' +
    '}' +
    '.image-placeholder.mode_contain {' +
    '  width: 100%;' +
    '  min-height: 240px;' +
    '  background: #f0f1f2 url(' + this.path + 'icons/preview-contain.png) center no-repeat;' +
    '}');
	},
	afterInit: function(editor) {
		var placeholderReplaceRegex = /\[\[(\{.+?\})]]/g;

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
					console.log("parsed = ", parsed);
					var classes = "";
					if (parsed.required) {
						classes += " cke_placeholder_required";
					}

					classes += " mode_" + parsed.param.mode;
					var element = new CKEDITOR.htmlParser.element(
						"img",
						{
							'class': "image-placeholder" + classes,
							'data-params': "[[" + parsed.label + "]]"
						}
					);

					// Return outerhtml of widget wrapper so it will be placed
					// as replacement.
					return element.getOuterHtml() + '<span class="remove-me">&nbsp;</span>';
				});
			}
		});
	}
});
