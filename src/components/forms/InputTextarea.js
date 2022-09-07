export default function InputTextarea({ $target, initialState, onChange }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = { ...this.state, text: newState };
        this.render();
    };

    this.$element = document.createElement("textarea");
    this.$element.placeholder = this.state.placeholder;
    $target.appendChild(this.$element);

    this.render = () => (this.$element.value = this.state.text);

    if (this.state) this.render();

    this.$element.addEventListener("input", (e) => {
        onChange(e.target.value);
    });
}
