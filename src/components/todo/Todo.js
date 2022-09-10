/* TODO
// 1. 투두리스트 수정 기능
// 2. 완료 항목 분류 기능
*/
import Title from "../layout/Title.js";
import TodoForm from "./TodoForm.js";
import TodoList from "./TodoList.js";

export default function Todo({ $target, initialState, updateStorage }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        todoList.setState(this.state);
        updateStorage(this.state);
    };

    this.$element = document.createElement("div");
    this.$element.className = "todoWrap";
    $target.appendChild(this.$element);

    const title = new Title({
        $target: this.$element,
        initialState: {
            type: "TODO",
            title: "TODO LIST",
        },
        eventBus: (data) => this.setState(data),
    });

    const todoForm = new TodoForm({
        $target: this.$element,
        initialState: {
            todo: "",
            memo: "",
        },
        onSubmit: (todo) => this.setState([...this.state, ...todo]),
    });

    const todoList = new TodoList({
        $target: this.$element,
        initialState: this.state,
        onChange: (todo) => this.setState(todo),
    });
}
