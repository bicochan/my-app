export default function TodoList({ $target, initialState, onDelete }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    };

    this.$element = document.createElement("ul");
    this.$element.className = "todoList";
    $target.appendChild(this.$element);

    this.render = () => {
        if (this.state.length > 0) {
            this.$element.innerHTML = `
                ${this.state
                    .map((item) => {
                        const { id, todo, memo } = item;
                        return (this.$element.innerHTML = `
                        <li id="${id}">
                            <input type="checkbox" id="chk_${id}" >
                            <label for="chk_${id}">${memo ? `<div>${todo}<p>${memo}</p></div>` : `${todo}`}</label>
                            <button class="btnDelete">삭제</button>
                        </li>
                    `);
                    })
                    .join("")}
            `;
        }
    };

    this.render();
}
