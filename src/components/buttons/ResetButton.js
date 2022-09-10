export default function ResetButton({ $target, initialState, onReset }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "resetBtnWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        const { type } = this.state;
        let value = null;
        if (type === "TODO") {
            value = "투두리스트 초기화";
        } else if (type === "MEDIA") {
            value = "유튜브리스트 초기화";
        }
        this.$element.innerHTML = `데이터 초기화<button type="button" class="btnReset">${value}</button>`;
        document.querySelector(".btnReset").addEventListener("click", () => onReset(type));
    };

    this.render();
}
