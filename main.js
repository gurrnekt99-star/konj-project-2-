
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const number = this.getAttribute('number');
        const color = this.getColor(number);
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --ball-color: ${color};
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fff;
                    background-color: var(--ball-color);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: transform 0.2s;
                }
                :host(:hover) {
                    transform: scale(1.1);
                }
                @media (max-width: 600px) {
                    :host {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }
                }
            </style>
            <div>${number}</div>
        `;
    }

    getColor(number) {
        const num = parseInt(number, 10);
        if (num <= 10) return '#fbc400'; // 노란색
        if (num <= 20) return '#69c8f2'; // 파란색
        if (num <= 30) return '#ff7272'; // 빨간색
        if (num <= 40) return '#aaa'; // 회색
        return '#b0d840'; // 녹색
    }
}

customElements.define('lotto-ball', LottoBall);

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    const historyList = document.getElementById('history-list');

    generateBtn.addEventListener('click', () => {
        const numbers = generateLottoNumbers();
        displayLottoNumbers(numbers);
        addHistory(numbers);
    });

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayLottoNumbers(numbers) {
        lottoNumbersContainer.innerHTML = '';
        numbers.forEach(number => {
            const lottoBall = document.createElement('lotto-ball');
            lottoBall.setAttribute('number', number);
            lottoNumbersContainer.appendChild(lottoBall);
        });
    }

    function addHistory(numbers) {
        const listItem = document.createElement('li');
        listItem.textContent = numbers.join(', ');
        historyList.prepend(listItem);
    }
});
