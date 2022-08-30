import InputText from "../common/InputText.js";

export default function TodoForm({ $target, initialState, onSubmit }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        inputText.setState(this.state.todo);
        this.render();
    };

    this.$element = document.createElement("form");
    this.$element.className = "todoForm";
    $target.appendChild(this.$element);

    const inputText = new InputText({
        $target: this.$element,
        initialState: { text: "", placeholder: "할 일 입력 후 엔터" },
        onChange: (text) => {
            this.setState({ ...this.state, todo: text });
        },
    });

    this.$textarea = document.createElement("textarea");
    this.$textarea.placeholder = "메모 입력";
    this.$element.appendChild(this.$textarea);

    this.$submit = document.createElement("input");
    this.$submit.type = "submit";
    this.$element.appendChild(this.$submit);

    this.render = () => {
        this.$textarea.value = this.state.memo;
    };

    this.render();

    this.$textarea.addEventListener("input", (e) => {
        this.setState({ ...this.state, memo: e.target.value });
    });

    this.$element.addEventListener("submit", (e) => {
        const data = {
            id: Date.now(),
            todo: this.state.todo,
            memo: this.$textarea.value,
        };
        e.preventDefault();
        this.setState({ todo: "", memo: "" });
        inputText.$element.focus();
        onSubmit(data);
    });
}
