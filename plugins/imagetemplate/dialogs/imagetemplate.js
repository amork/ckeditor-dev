/*
 * Created by ALL-INKL.COM - Neue Medien Muennich - 04. Feb 2014
 * Licensed under the terms of GPL, LGPL and MPL licenses.
 */
CKEDITOR.dialog.add("imagetemplateDialog", function(editor) {
	var t = null;
	var imgScal = 1;
	var selectedImg = null;
	/* Set integer Value */
	function integerValue(elem) {
		var v = elem.getValue(),
			u = "";
		if (v.indexOf("%") >= 0) u = "%";
		v = parseInt(v, 10);
		if (isNaN(v)) v = 0;
		elem.setValue(v + u);
	}

	function imageDimensions(src) {
		var o = getImageDimensions();

		if (src == "width") {
			t.getContentElement("tab-source", "width").setValue(o.w);
		} else {
			t.getContentElement("tab-source", "height").setValue(o.h);
		}
	}

	function getImageDimensions() {
		var o = {
			w: t.getContentElement("tab-source", "width").getValue(),
			h: t.getContentElement("tab-source", "height").getValue(),
			uw: "px",
			uh: "px"
		};
		if (o.w.indexOf("%") >= 0) o.uw = "%";
		if (o.h.indexOf("%") >= 0) o.uh = "%";
		o.w = parseInt(o.w, 10);
		o.h = parseInt(o.h, 10);
		if (isNaN(o.w)) o.w = 0;
		if (isNaN(o.h)) o.h = 0;
		return o;
	}

	var sourceElements = [
		{
			type: "radio",
			id: "type",
			label: "",
			className: "imagetemplate__radio",
			items: [
				["Best For Logotype", "logotype"],
				["Best For Illustration", "illustration"]
			],
			// style: "color: #4E89F5",
			default: "logotype",
			onClick: function() {
				// this = CKEDITOR.ui.dialog.radio
				alert("Current value: " + this.getValue());
			}
		},
		{
			type: "hbox",
			widths: ["25%", "25%", "50%"],
			className: "imagetemplate__options",
			children: [
				{
					type: "text",
					id: "width",
					label: "Width",
					default: "120"
				},
				{
					type: "text",
					id: "height",
					label: "Height",
					default: "120"
				},
				{
					type: "checkbox",
					id: "as_cp",
					label: "Should be uploaded by counterparty",
					onClick: function() {
						// this = CKEDITOR.ui.dialog.checkbox
						alert("Checked: " + this.getValue());
					}
				}
			]
		}
	];
	/* Dialog */
	return {
		title: "Image Placeholder",
		minWidth: 450,
		minHeight: 180,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		buttons: [
			CKEDITOR.dialog.cancelButton,
			{
				id: "unique name",
				type: "button",
				label: "Add",
				class: "cke_dialog_ui_button_ok",
				title: "Add image template",
				disabled: false,
				onClick: function() {
					var newImg = selectedImg || editor.document.createElement("imagetemplate");

					newImg.$.className = "imagetemplate__image";
					newImg.$.style.width = "120px";
					newImg.$.style.height = "120px";

					/* Insert new image */
					if (!selectedImg) {
						editor.insertElement(newImg);
					}

					t.hide();
				}
			}
		],
		onLoad: function() {
			t = this;

			this.getContentElement("tab-source", "width")
				.getInputElement()
				.on("keyup", function() {
					imageDimensions("width");
				});
			this.getContentElement("tab-source", "height")
				.getInputElement()
				.on("keyup", function() {
					imageDimensions("height");
				});
		},
		onShow: function() {
			/* selected image or null */
			selectedImg = editor.getSelection();

			if (selectedImg) selectedImg = selectedImg.getSelectedElement();
			if (!selectedImg || selectedImg.getName() !== "imagetemplate")
				selectedImg = null;
		},

		/* Dialog form */
		contents: [
			{
				id: "tab-source",
				label: "",
				elements: sourceElements
			}
		]
	};
});
