import InputText from "@components/InputText";

export default function MediaForm({ $target, initialState, onSubmit }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    inputText.setState(this.state);
  };

  // components
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

  // handler
  const handleForm = () => {
    onSubmit(inputText.state.text);
    inputText.setState("");
  };

  this.$element.addEventListener("submit", (e) => {
    e.preventDefault();
    handleForm();
  });
}
