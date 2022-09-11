import ResetButton from "../buttons/ResetButton.js";

export default function Title({ $target, initialState, eventBus }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "titWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        this.$element.innerHTML = `<h2 class="tit">${this.state.title}</h2>`;
    };

    this.render();

    const resetButtonValue = (type) => {
        if (type === "TODO") {
            return "투두리스트 초기화";
        } else if (type === "MEDIA") {
            return "유튜브리스트 초기화";
        }
    };
    const resetButtonAlert = (type) => {
        if (type === "TODO") {
            return "정말 투두리스트를 초기화 하시겠어요?";
        } else if (type === "MEDIA") {
            return "정말 유튜브리스트를 초기화 하시겠어요?";
        }
    };
    const resetButton = new ResetButton({
        $target: this.$element,
        initialState: {
            type: this.state.type,
            value: resetButtonValue(this.state.type),
        },
        onReset: (type) => {
            if (confirm(resetButtonAlert(type))) eventBus([]);
        },
    });
}
