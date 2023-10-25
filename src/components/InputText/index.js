export default function InputText({ $target, initialState, onChange }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = { ...this.state, text: newState };
    this.render();
  };

  // components
  this.$element = document.createElement("input");
  this.$element.type = "text";
  this.$element.placeholder = this.state.placeholder;
  $target.appendChild(this.$element);

  this.render = () => {
    this.$element.value = this.state.text;
  };

  // handler
  const handleInput = (value) => {
    onChange(value);
  };

  this.$element.addEventListener("input", (e) => {
    handleInput(e.target.value);
  });
}
