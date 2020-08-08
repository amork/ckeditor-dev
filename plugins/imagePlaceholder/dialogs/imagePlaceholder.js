CKEDITOR.dialog.add('imagePlaceholder', function(editor) {
	var field = editor.plugins.imagePlaceholder.getData();

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
						field.param.width = parseInt(this.getValue(), 10) + (field.param.align === 'float' ? 'px' : '%');
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
						field.param.height = parseInt(this.getValue(), 10) + (field.param.align === 'float' ? 'px' : '%');
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
	];

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
			editor.plugins.imagePlaceholder.setAllData(editor.plugins.imagePlaceholder.defaultImageData);
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
					var value = parseInt(this.getValue(), 10);
					editor.plugins.imagePlaceholder.setData('width', value + 'px');
				});
			this.getContentElement('tab-source', 'height')
				.getInputElement()
				.on('keyup', function() {
					var value = parseInt(this.getValue(), 10);
					editor.plugins.imagePlaceholder.setData('height', value + 'px');
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
	};
});

function disableControls(field, widthControl, heightControl) {
	if (field.param.align === 'justify') {
		widthControl.setAttribute('disabled', true);
		widthControl.$.value = '100%';
		field.param.width = '100%';
		heightControl.setAttribute('disabled', true);
		heightControl.$.value = '100%';
		field.param.height = '100%';
	} else {
		var defaultDimension = '120px';
		widthControl.removeAttribute('disabled');
		heightControl.removeAttribute('disabled');


		widthControl.$.value = field.param.width !== '100%' ? field.param.width : defaultDimension;
		field.param.width = field.param.width !== '100%' ? field.param.width : defaultDimension;

		heightControl.$.value = field.param.height !== '100%' ? field.param.height : defaultDimension;
		field.param.height = field.param.height !== '100%' ? field.param.height : defaultDimension;
	}
}

