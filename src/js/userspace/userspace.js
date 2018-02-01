document.body.onload = () => {
	userSpace.setIframeSrc('dynamic');
	userSpace.setIframeEvent();
};
const userSpace = {
	iframe: document.body.querySelector('.tab-container iframe'),
	setIframeSrc(tabName) {
		this.iframe.setAttribute('src', `./${tabName}/index.html`);
	},
	setIframeEvent() {
		this.iframe.onload = () => {
			this.setIframeHeight();
		};
	},
	setIframeHeight() {

		this.iframe.style.height = `${this.iframeHeight}px`;
	},
};