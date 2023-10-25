export default function InputTextarea({ $target, initialState, onChange }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = { ...this.state, text: newState };
    this.render();
  };

  // components
  this.$element = document.createElement("textarea");
  this.$element.placeholder = this.state.placeholder;
  $target.appendChild(this.$element);

  this.render = () => {
    this.$element.value = this.state.text;
  };

  if (this.state) this.render();

  // handler
  const handleInput = (value) => {
    onChange(value);
  };

  this.$element.addEventListener("input", (e) => {
    handleInput(e.target.value);
  });
}
