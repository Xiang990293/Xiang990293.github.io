var MQ = MathQuill.getInterface(2);

class MathInput extends HTMLElement {
    static get observedAttributes() {
        return ['howtodelete', 'isreadonly'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            @import url('/lib/mathquill-0.10.1/mathquill.css');

            :host {
                display: inline-block;
                position: relative; /* 群組定位基準 */
                width: max-content;

                --tool-tab-height: 50px;
            }

            div.tool-sections {
                display: flex;
                flex-direction: column;
                position: relative
                top: var(--math-input-height);
                height: 0px
            }
            
            button.math-operator {
                border: none;
                background: #eee;
                padding: 4px 8px;
                cursor: pointer;
                border-radius: 3px;
                font-size: 14px;
            }

            button.math-operator:hover {
                background: #ddd;
            }

            .tabs {
                z-index: 20;
                display: flex;
                position: relative;
                gap: 4px;
                left:4px;
            }

            .tab-button.active {
                background: #fff;
                box-shadow: 0 -3px 6px rgba(0,0,0,0.2);
            }
            
            .tab-button {
                cursor: pointer;
                border: none;
                font-weight: bold;
                background: #ccc;
                left:4px;
                padding: 4px 10px;
            }

            div.tool-section {
                display: none; /* 默認隱藏 */
            }

            div.tool-section.active {
                flex-direction: row;
                position: absolute;
                top: var(--tool-tab-height);  /* 根據按鈕欄高度調整 */
                left: 0;
                background: white;
                border: 1px solid #ccc;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                padding: 6px;
                border-radius: 4px;
                width: 100%;
                z-index: 10;
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }

            span.mq-editable-field{
                width: 90%;
                max-width: 90%;
                box-sizing: border-box;
                overflow-x: auto;
                white-space: none;
                font-size: 30px;
            }

            div.input-and-delete>button {
                height: 36px;
            }

            div.input-and-delete {
                display: flex;
                align-items: center;
                width: 100%;
            }
        `;
        this.shadowRoot.appendChild(style);

        this.input_and_delete = document.createElement('div');
        this.input_and_delete.className = 'input-and-delete';
        this.shadowRoot.appendChild(this.input_and_delete);
        this.inputSpan = document.createElement('span');
        // this.deletebutton = document.createElement('button');
        // this.deletebutton.textContent = 'X';
        this.input_and_delete.appendChild(this.inputSpan);
        // this.input_and_delete.appendChild(this.deletebutton);

        this.buttonDiv = document.createElement('div');
        this.buttonDiv.className = 'tool-sections';
        this.shadowRoot.appendChild(this.buttonDiv);

        this.mathquillscript = document.createElement('script');
        this.mathquillscript.src = "/lib/mathquill-0.10.1/mathquill.js"
        this.shadowRoot.appendChild(this.mathquillscript);

        this.jqueryscript = document.createElement('script');
        this.jqueryscript.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
        this.shadowRoot.appendChild(this.jqueryscript);
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.mathField) return
        if (name === 'howtodelete') {
            this._howToDelete = newValue;
        }

        if (name === 'isreadonly') {
            this._isReadOnly = this.mathField.isReadOnly === 'true';
            this.mathField.el().setAttribute('contenteditable', !this._isReadOnly + "");
            // 禁止輸入，隱藏按鈕等等
            this.buttonDiv.style.display = this._isReadOnly ? 'none' : 'flex';
        }
    }

    connectedCallback() {
        this.mathField = MQ.MathField(this.inputSpan, {
            handlers: {
                edit: () => {
                    this.latex = this.mathField.latex();
                    console.log("Edited:", this.latex);
                    // this.dispatchEvent(new CustomEvent('change', { detail: latex }));
                },

                deleteOutOf: (dir, mathField) => {
                    if (this._howToDelete === 'context') this._deleteSelf();
                    else if (this._howToDelete === 'button') {
                        this.mathField.write('\\cancel');
                        this.mathField.focus();
                    }

                }
            }
        });

        this.buttonDiv.innerHTML = `
            <div class="tabs">
                <button class="tab-button active" data-tab="equation">方程式</button>
                <button class="tab-button" data-tab="basic_operations">基礎運算</button>
                <button class="tab-button" data-tab="trigonometric-and-hyperbolic">三角函數</button>
                <button class="tab-button" data-tab="special_operator">特殊符號</button>
                <button class="tab-button" data-tab="calculus">微積分</button>
            </div>
            <div class="tool-section equation active">
            <button class="math-operator" id="=">＝</button>
                <button class="math-operator" id=">">></button>
                <button class="math-operator" id="<"><</button>
                <button class="math-operator" id="\\ge">≧</button>
                <button class="math-operator" id="\\le">≦</button>
            </div>
            <div class="tool-section basic_operations">
                <button class="math-operator" id="+">+</button>
                <button class="math-operator" id="-">-</button>
                <button class="math-operator" id="*">x</button>
                <button class="math-operator" id="\\div">÷</button>
                <button class="math-operator" id="\\frac{}{}">a/b</button>
                <button class="math-operator" id="^{}">^</button>
                <button class="math-operator" id="\\sqrt{}">√</button>
                <button class="math-operator" id="\\left(\\right)">()</button>
                <button class="math-operator" id="\\pm">±</button>
            </div>
            <div class="tool-section trigonometric-and-hyperbolic">
                <button class="math-operator" id="\\sin">sin</button>
                <button class="math-operator" id="\\cos">cos</button>
                <button class="math-operator" id="\tan">tan</button>
                <button class="math-operator" id="\\arcsin">arcsin</button>
                <button class="math-operator" id="\\arccos">arccos</button>
                <button class="math-operator" id="\\arctan">arctan</button>
                <button class="math-operator" id="\\sinh">sinh</button>
                <button class="math-operator" id="\\cosh">cosh</button>
                <button class="math-operator" id="\\tanh">tanh</button>
                <button class="math-operator" id="\\arcsinh">arcsinh</button>
                <button class="math-operator" id="\\arccosh">arccosh</button>
                <button class="math-operator" id="\\arctanh">arctanh</button>
            </div>
            <div class="tool-section special_operator">
                <button class="math-operator" id="|{}|">|x|</button>
                <button class="math-operator" id="!">!</button>
                <button class="math-operator" id="\\text{mod}">mod</button>
                <button class="math-operator" id="\\lfloor{}\\rfloor">⌊x⌋</button>
                <button class="math-operator" id="\\lceil{}\\rceil">⌈x⌉</button>
                <button class="math-operator" id="\\log">log</button>
                <button class="math-operator" id="\\ln">ln</button>
                <button class="math-operator" id="matrix">matrix</button>
                <button class="math-operator" id="vector">vector</button>
                <button class="math-operator" id="set">set</button>
                <button class="math-operator" id="f(x)">f(x)</button>
                </div>
            <div class="tool-section calculus">
            <button class="math-operator" id="\\int{d}">∫</button>
                <button class="math-operator" id="\\int_{}^{}{d}">∫<sub>a</sub><sup>b</sup></button>
                <button class="math-operator" id="\\frac{d}{dx}">d/dx</button>
                <button class="math-operator" id="\\prod_{=}^{}">Π</button>
                <button class="math-operator" id="\\lim">lim</button>
                <button class="math-operator" id="\\sum_{=}^{}">Σ</button>
            </div>
            `;

        // 預設隱藏工具欄
        this.buttonDiv.style.display = 'none';

        this.mathquillscript.src = "/lib/mathquill-0.10.1/mathquill.js"

        // 給所有符號按鈕添加點擊事件
        this.shadowRoot.querySelectorAll("button.math-operator").forEach(button => {
            button.onclick = () => {
                this.mathField.write(button.id);
                this.mathField.focus();

                this.buttonDiv.style.display = 'flex';

                // equationList[Number(focusedEquation.parentElement.id.split("input")[1])].write(button.id);
            }
        });

        const tabButtons = this.buttonDiv.querySelectorAll('.tab-button');
        const toolSections = this.buttonDiv.querySelectorAll('.tool-section');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // 更新 tab按鈕 active 狀態
                tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));

                // 更新內容區顯示
                toolSections.forEach(section => {
                    section.classList.toggle('active', section.classList.contains(targetTab));
                });
            });
        });

        this.addEventListener('focusin', () => {
            this.buttonDiv.style.display = 'flex';
        });
        this.addEventListener('focusout', () => {
            this.buttonDiv.style.display = 'none';
        });

        this._howToDelete = this.getAttribute('howtodelete');
        if (!this._howToDelete) this._howToDelete = 'button';
        this._setupDeleteMode(this._howToDelete);
    }

    _setupDeleteMode(mode) {
        if (mode === 'button') {
            if (!this.deleteButton) {
                this.deleteButton = document.createElement('button');
                this.deleteButton.textContent = '刪除';
                this.deleteButton.addEventListener('click', () => this._deleteSelf());
                this.input_and_delete.appendChild(this.deleteButton);
            }
        } else if (mode === 'context') {
            if (this.deleteButton) {
                this.deleteButton.remove();
                this.deleteButton = null;
            }
            // 鍵盤刪除透過 deleteOutOf 事件上面已有設定
        }
    }

    get isReadOnly() {
        return this._isReadOnly;
    }

    set isReadOnly(val) {
        this._isReadOnly = val;
        this.setAttribute('isreadonly', !val + "");
    }

    get howToDelete() {
        return this._howToDelete;
    }

    set howToDelete(val) {
        this._howToDelete = val;
        this.setAttribute('howtodelete', val);
    }

    _deleteSelf() {
        this.remove();
    }

    // 讀取 latex
    get value() {
        return this.mathField ? this.mathField.latex() : '';
    }

    // 設定 latex
    set value(val) {
        if (this.mathField) {
            this.mathField.latex(val);
        }
    }
}

customElements.define('math-input', MathInput);