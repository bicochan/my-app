export default function ResetButton({ $target, initialState, onReset }) {
    this.state = initialState;

    this.$element = document.createElement("div");
    this.$element.className = "resetBtnWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        const { type } = this.state;
        this.$element.innerHTML = `데이터 초기화<button type="button" id=${type} class="btnReset"></button>`;

        const resetButton = document.querySelector(`#${type}`);
        resetButton.addEventListener("click", () => {
            onReset();
        });
    };

    this.render();
}
