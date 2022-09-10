import ResetButton from "../buttons/ResetButton.js";

export default function Title({ $target, initialState, eventBus }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "titWrap";
    $target.appendChild(this.$element);

    this.render = () => (this.$element.innerHTML = `<h2 class="tit">${this.state.title}</h2>`);

    this.render();

    const resetButton = new ResetButton({
        $target: this.$element,
        initialState: {
            type: this.state.type,
        },
        onReset: (type) => {
            if (type === "TODO") {
                if (confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
                    eventBus([]);
                }
            } else if (type === "MEDIA") {
                if (confirm("정말 유튜브 리스트를 초기화 하시겠어요?")) {
                    eventBus([]);
                }
            }
        },
    });
}
