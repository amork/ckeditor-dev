CKEDITOR.dialog.add('imagePlaceholderDialog', function(editor) {
	var field = {
		label: "image",
		required: true,
		param: {
			mode: 'original',
			width: '',
			height: ''
		}
	};

	var sourceElements = [
		{
			type: 'hbox',
			widths: ['70px'],
			children: [{
				type: 'radio',
				id: 'cke_image-placeholder_radio',
				'default': 'original',
				items: [
					[ 'Original', 'original' ],
					[ 'Contain', 'contain' ]
				],
				onClick: function() {
					field.param.mode = this.getValue();
				}
			}]
		},
		{
			type: 'hbox',
			widths: ['16%', '51%', '31%', '14%'],
			children: [
				{
					type: 'html',
					html: ''
				},
				{
					type: 'text',
					label: 'Width',
					'default': '',
					width: '75px',
					id: 'width',
					setup: function() {

					},
					validate: function() {
						field.param.width = this.getValue().replace(/\D+/, '');
					}
				},
				{
					type: 'text',
					label: 'Height',
					width: '75px',
					id: 'height',
					'default': '',
					validate: function() {
						field.param.height = this.getValue().replace(/\D+/, '');
					}
				},
				{
					type: 'html',
					html: ''
				}
			]
		},
		{
			type: 'html',
			id: 'preview',
			html: new CKEDITOR.template('<div style="text-align:center;"></div>').output()
		},
		{
			type: 'checkbox',
			id: 'required',
			label: 'Required field',
			'default': field.required,
			setup: function() {
				this.setValue( field.required );
			},
			onClick: function() {
				field.required = this.getValue();
			},
			commit: function() {
				field.required = this.getValue();
			}
		}
	]

	/* Dialog */
	return {
		title: editor.lang.imagePlaceholder.title,
		minWidth: 450,
		minHeight: 180,
		onOk: function() {
			if (field.param.mode === 'contain' && !field.param.width && !field.param.height) {
				alert('Please, specify width or height on contain mode');
				return false;
			}

			editor.focus();
			editor.fire('saveSnapshot');
			var fragment = editor.getSelection().getRanges()[0].extractContents();
			var container = CKEDITOR.dom.element.createFromHtml('<img class="image-placeholder mode_' + field.param.mode + '" ' +
				' data-params="[[' + JSON.stringify(field).replace(/"/g, '&quot;') +']]"/>', editor.document);

			fragment.appendTo(container);
			editor.insertElement(container);
		},
		/* Dialog form */
		contents: [
			{
				id: 'tab-source',
				label: editor.lang.common.generalTab,
				elements: sourceElements
			}
		]
	}
});
