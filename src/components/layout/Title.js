import ResetButton from "../buttons/ResetButton.js";

export default function Title({ $target, initialState, eventBus }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "titWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        this.$element.innerHTML = `<h2 class="tit">${this.state}</h2>`;
    };

    this.render();

    const resetButton = new ResetButton({
        $target: this.$element,
        initialState: {
            type: "TODO",
            value: "투두리스트 초기화",
        },
        onReset: (type) => {
            if (type === "TODO" && confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
                eventBus([]);
            }
        },
    });
}
