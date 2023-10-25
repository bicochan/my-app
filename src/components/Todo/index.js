/* TODO
// 1. 투두리스트 수정 기능
// 2. 완료 항목 분류 기능
*/
import Title from "@components/Title";
import TodoForm from "@components/TodoForm";
import TodoList from "@components/TodoList";

export default function Todo({ $target, initialState, updateStorage }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    todoList.setState(this.state);
    updateStorage(this.state);
  };

  // components
  this.$element = document.createElement("div");
  this.$element.className = "todoWrap";
  $target.appendChild(this.$element);

  const title = new Title({
    $target: this.$element,
    initialState: {
      type: "TODO",
      title: "TODO LIST",
      resetMessage: "정말 투두리스트를 초기화 하시겠어요?",
    },
    eventBus: (data) => {
      this.setState(data);
    },
  });

  const todoForm = new TodoForm({
    $target: this.$element,
    initialState: {
      todo: "",
      memo: "",
    },
    onSubmit: (todo) => {
      this.setState([...this.state, ...todo]);
    },
  });

  const todoList = new TodoList({
    $target: this.$element,
    initialState: this.state,
    onChange: (todo) => {
      this.setState(todo);
    },
  });
}
