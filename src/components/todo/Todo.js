/* TODO
// 1. 투두리스트 & 메모 내용 수정 기능
// 2. 완료 항목 분류 기능
// 3. 데이터 리셋 기능
*/
import TodoForm from "./TodoForm.js";
import TodoList from "./TodoList.js";

export default function Todo({ $target, initialState, updateTodo }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        todoList.setState(this.state);
        updateTodo(this.state);
    };

    this.$element = document.createElement("div");
    this.$element.className = "todoWrap";
    $target.appendChild(this.$element);

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

//     // 데이터 초기화
//     resetBtn.addEventListener("click", () => {
//         if (confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
//             todos.reset();
//             todoList.innerHTML = "";
//         }
//     });
