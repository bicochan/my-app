import InputText from "../forms/InputText.js";

export default function MediaForm({ $target, initialState, onSubmit }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        inputText.setState(this.state);
    };

    this.$element = document.createElement("form");
    this.$element.className = "mediaForm";
    $target.appendChild(this.$element);

    const inputText = new InputText({
        $target: this.$element,
        initialState: {
            text: "",
            placeholder: this.state.placeholder,
        },
        onChange: (text) => {
            this.setState(text);
        },
    });

    this.$element.addEventListener("submit", (e) => {
        e.preventDefault();
        onSubmit(inputText.state.text);
        inputText.setState("");
    });

    this.render = () => {};

    this.render();
}
