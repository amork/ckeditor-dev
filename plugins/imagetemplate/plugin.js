CKEDITOR.plugins.add("imagetemplate", {
	requires: "dialog",
	icons: "imagetemplate",
	init: function(editor) {
		var pluginName = "imagetemplateDialog";

		editor.ui.addButton("imagetemplate", {
			label: "Insert image",
			command: pluginName,
			toolbar: "insert"
		});
		CKEDITOR.dialog.add(pluginName, this.path + "dialogs/imagetemplate.js");

		var allowed =
				"imagetemplate{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}",
			required = "imagetemplate";

		editor.addCommand(
			pluginName,
			new CKEDITOR.dialogCommand(pluginName, {
				allowedContent: allowed,
				requiredContent: required
			})
		);

		editor.on('doubleclick', function(evt) {
			if (
				evt.data.element &&
				!evt.data.element.isReadOnly() &&
				evt.data.element.getName() === "imagetemplate"
			) {
				evt.data.dialog = pluginName;
				editor.getSelection().selectElement(evt.data.element);
			}
		});
	}
});
