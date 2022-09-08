export default function ResetButton({ $target, initialState, onReset }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "resetBtnWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        const { type, value } = this.state;
        this.$element.innerHTML = `데이터 초기화<button type="button" class="btnReset">${value}</button>`;
        document.querySelector(".btnReset").addEventListener("click", () => onReset(type));
    };

    this.render();
}
