import InputText from "../forms/InputText.js";
import InputTextarea from "../forms/InputTextarea.js";

export default function TodoForm({ $target, initialState, onSubmit }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    inputText.setState(this.state.todo);
    inputTextarea.setState(this.state.memo);
  };

  // components
  this.$element = document.createElement("form");
  this.$element.className = "todoForm";
  $target.appendChild(this.$element);

  const inputText = new InputText({
    $target: this.$element,
    initialState: {
      text: "",
      placeholder: "할 일 입력 후 Enter",
    },
    onChange: (text) => {
      this.setState({ ...this.state, todo: text });
    },
  });

  const inputTextarea = new InputTextarea({
    $target: this.$element,
    initialState: {
      text: "",
      placeholder: "메모 입력",
    },
    onChange: (text) => {
      this.setState({ ...this.state, memo: text });
    },
  });

  this.$submit = document.createElement("input");
  this.$submit.type = "submit";
  this.$element.appendChild(this.$submit);

  this.$element.addEventListener("submit", (e) => {
    const data = [
      {
        id: Date.now(),
        todo: this.state.todo,
        memo: this.state.memo,
        success: false,
      },
    ];
    e.preventDefault();

    const [{ todo }] = data;
    if (!todo) {
      alert("할 일을 입력해주세요.");
      inputText.$element.focus();
      return;
    }

    this.setState({ todo: "", memo: "" });
    inputText.$element.focus();
    onSubmit(data);
  });
}
