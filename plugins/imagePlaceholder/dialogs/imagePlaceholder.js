CKEDITOR.dialog.add('imagePlaceholder', function(editor) {
	var field = editor.plugins.imagePlaceholder.getData() || {};
	field.param = field.param || {};

	var sourceElements = [
		{
			type: 'hbox',
			widths: ['70px'],
			children: [{
				type: 'radio',
				id: 'cke_image-placeholder_radio',
				'default': field.param.mode,
				items: [
					[ 'Best for Illustration', 'original' ],
					[ 'Best for Logotype', 'contain' ]
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
					className: 'control-image-width',
					'default': '',
					width: '75px',
					id: 'width',
					validate: function() {
						field.param.width = this.getValue().replace(/\D+/, '');
					}
				},
				{
					type: 'text',
					label: 'Height',
					width: '75px',
					className: 'control-image-height',
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
			var width = field.param && field.param.width ? ' width=' + field.param.width : ''
			var height = field.param && field.param.height ? ' height=' + field.param.height : ''
			var fragment = editor.getSelection().getRanges()[0].extractContents();
			var container = CKEDITOR.dom.element.createFromHtml('<img' + width + height + ' class="image-placeholder_cke mode_' + field.param.mode + '" ' +
				' data-params="' + JSON.stringify(field).replace(/"/g, '&quot;') +'"/>', editor.document);

			fragment.appendTo(container);
			editor.insertElement(container);
		},
		onHide: function() {
			editor.plugins.imagePlaceholder.setAllData({});
		},
		onShow: function() {
			field = editor.plugins.imagePlaceholder.getData();
			field.param = field.param || {};

			this.setValueOf('tab-source', 'width', field.param.width);
			this.setValueOf('tab-source', 'height', field.param.height);
			this.setValueOf('tab-source', 'cke_image-placeholder_radio', field.param.mode);
			this.setValueOf('tab-source', 'required', field.required);
		},
		onLoad: function() {
			var width = this.getContentElement('tab-source', 'width').getInputElement();
			var height = this.getContentElement('tab-source', 'height').getInputElement();

			this.getContentElement('tab-source', 'cke_image-placeholder_radio')
				.getInputElement()
				.on('change', function() {
					if (field.param.mode === 'original') {
						width.setAttribute('disabled', true)
						height.setAttribute('disabled', true)
						width.$.value = 'full';
						height.$.value = 'full';
						field.param.width = ''
						field.param.height = ''
					} else {
						width.removeAttribute('disabled')
						height.removeAttribute('disabled')

						var dimension = '150';
						width.$.value = dimension;
						height.$.value = dimension;
						field.param.width = dimension
						field.param.height = dimension
					}

				})

			this.getContentElement('tab-source', 'width')
				.getInputElement()
				.on('keyup', function() {
					editor.plugins.imagePlaceholder.setData('width', this.getValue())
				});
			this.getContentElement('tab-source', 'height')
				.getInputElement()
				.on('keyup', function() {
					editor.plugins.imagePlaceholder.setData('height', this.getValue())
				});
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
