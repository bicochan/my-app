import TodoItem from "./TodoItem.js";

export default function TodoList({ $target, initialState, onChange }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        if (this.state.length) {
            this.$element.innerHTML = "";
            this.state.map((item) => todoItem.setState(item));
        }
    };

    this.$element = document.createElement("ul");
    this.$element.className = "todoList";
    $target.appendChild(this.$element);

    const todoItem = new TodoItem({
        $target: this.$element,
        initialState: this.state,
        onRemove: (id) => {
            const newTodo = this.state.filter((item) => {
                return item.id !== id * 1;
            });
            onChange(newTodo);
        },
    });
}
