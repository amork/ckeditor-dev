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
				items: [
					[ 'Best for Illustration', 'justify' ],
					[ 'Best for Logotype', 'float' ]
				],
				onClick: function() {
					field.param.align = this.getValue();
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
						field.param.width = this.getValue().trim()/* .replace(/\D+/, '') */;
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
						field.param.height = this.getValue().trim()/* .replace(/\D+/, '') */;
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
			if (field.param.align === 'float' && !field.param.width && !field.param.height) {
				window.alert('Please, specify width or height on logotype');
				return false;
			}
			editor.focus();
			editor.fire('saveSnapshot');
			var width = field.param.width ? 'width=' + field.param.width : '';
			var height = field.param.height !== '100%' ? 'height=' + field.param.height : '';
			var path = field.value || editor.plugins.imagePlaceholder.path;
			var src = ['src="', path, 'icons/preview-', (field.param.width === '100%' ? 'justify' : 'float'), '.png', '"'].join('');
			var className = 'image-placeholder_cke align_' + (field.param.align || '') + (field.required ? ' cke_placeholder_required' : '');
			var fragment = editor.getSelection().getRanges()[0].extractContents();
			var floater = CKEDITOR.dom.element.createFromHtml([
				'<img',
				src,
				width,
				height,
				'class="'+ className + '"',
				'data-params="' + JSON.stringify(field).replace(/"/g, '&quot;') + '"/>'
			].join(' '), editor.document);

			fragment.appendTo(floater);
			editor.insertElement(floater);
		},
		onHide: function() {
			editor.plugins.imagePlaceholder.setAllData({});
		},
		onShow: function() {
			field = editor.plugins.imagePlaceholder.getData();
			field.param = field.param || {};

			this.setValueOf('tab-source', 'width', field.param.width);
			this.setValueOf('tab-source', 'height', field.param.height);
			this.setValueOf('tab-source', 'cke_image-placeholder_radio', field.param.width === '100%' ? 'justify' : 'float');
			this.setValueOf('tab-source', 'required', field.required);

			var width = this.getContentElement('tab-source', 'width').getInputElement();
			var height = this.getContentElement('tab-source', 'height').getInputElement();
			disableControls(field, width, height);
		},
		onLoad: function() {
			var width = this.getContentElement('tab-source', 'width').getInputElement();
			var height = this.getContentElement('tab-source', 'height').getInputElement();

			this.getContentElement('tab-source', 'cke_image-placeholder_radio')
				.getInputElement()
				.on('change', function() {
					disableControls(field, width, height);
				});

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

function disableControls(field, width, height) {
	if (field.param.align === 'justify') {
		width.setAttribute('disabled', true);
		width.$.value = '100%';
		field.param.width = '100%';
		height.setAttribute('disabled', true);
		height.$.value = '100%';
		field.param.height = '100%';
	}
	else {
		var dimension = '120px';

		width.removeAttribute('disabled');
		width.$.value = dimension;
		field.param.width = dimension;
		height.removeAttribute('disabled');
		height.$.value = dimension;
		field.param.height = dimension;
	}
}

