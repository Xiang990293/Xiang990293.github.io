class AutoFillInButton extends HTMLElement {
    static get observedAttributes() {
        return ['fillInElementId', 'fillInValue', 'title'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            button {
                cursor: pointer;
                border: none;
                background: none;
            }

            button:hover {
                color: #3ca7d8;
            }
        `;
        this.shadowRoot.appendChild(style);

        this.button = document.createElement('button');
        this.button.className = 'auto-fill-in-button';
        this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-airplay-icon lucide-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 15 5 6H7Z"/></svg>';
        this.shadowRoot.appendChild(this.button);
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'fillInElementId') {
            this._targetElementId = newValue;
        }

        if (name === 'fillInValue') {
            this._targetElementValue = newValue;
        }

        if (name === 'title') {
            this._title = newValue;
        }
    }

    connectedCallback() {
        this.button.addEventListener('click', () => {
            const targetElement = document.getElementById(this._targetElementId);
            if (targetElement) {
                targetElement.value = this._targetElementValue;
                targetElement.dispatchEvent(new Event('input')); // 觸發 input 事件以確保任何綁定的事件處理程序都會被調用
            } else {
                console.warn(`Element with ID "${this._targetElementId}" not found.`);
            }
        });

        this.button.title = this._title;

        this._targetElementId = this.getAttribute('fillInElementId') || '';
        this._targetElementValue = this.getAttribute('fillInValue') || '';
        this._title = this.getAttribute('title') || '';
    }

    get fillInElementId() {
        return this._targetElementId;
    }

    set fillInElementId(val) {
        this._targetElement = val;
        this.setAttribute('fillInElementId', val);
    }

    get fillInValue() {
        return this._targetElementValue;
    }

    set fillInValue(val) {
        this._targetElementValue = val;
        this.setAttribute('fillInValue', val);
    }

    get title() {
        return this._title;
    }

    set title(val) {
        this._title = val;
        this.setAttribute('title', val);
    }
}

customElements.define('auto-fill-in-button', AutoFillInButton);