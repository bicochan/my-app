export default function InputText({ $target, initialState, onChange }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = { ...this.state, text: newState };
        this.render();
    };

    this.$element = document.createElement("input");
    this.$element.type = "text";
    this.$element.placeholder = this.state.placeholder;
    $target.appendChild(this.$element);

    this.render = () => {
        this.$element.value = this.state.text;
    };

    this.$element.addEventListener("input", (e) => {
        onChange(e.target.value);
    });
}