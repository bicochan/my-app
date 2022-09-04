import TodoItem from "./TodoItem.js";

export default function TodoList({ $target, initialState, onChange }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        this.$element.innerHTML = "";
        todoItem.setState(this.state);
    };

    this.$element = document.createElement("ul");
    this.$element.className = "todoList";
    $target.appendChild(this.$element);

    const todoItem = new TodoItem({
        $target: this.$element,
        initialState: this.state,
        onSuccess: (id) => {
            const newState = [...this.state];
            const targetIndex = newState.findIndex((item) => item.id === id);
            newState[targetIndex].success = newState[targetIndex].success ? false : true;
            onChange(newState);
        },
        onRemove: (id) => {
            let newState = [...this.state];
            newState = newState.filter((item) => item.id !== id * 1);
            onChange(newState);
        },
    });
}
