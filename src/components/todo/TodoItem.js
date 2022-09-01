export default function TodoItem({ $target, initialState, onRemove }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        this.render();
    };

    this.render = () => {
        const { id, todo, memo } = this.state;

        if (!todo) {
            alert("할 일을 입력해주세요.");
            return;
        }

        this.$element = document.createElement("li");
        this.$element.id = id;

        this.$button = document.createElement("button");
        this.$button.id = id;
        this.$button.innerHTML = "삭제";

        this.$element.innerHTML = `
            <input type="checkbox" id="chk_${id}" >
            <label for="chk_${id}">${memo ? `<div>${todo}<p>${memo}</p></div>` : `${todo}`}</label>
        `;
        this.$element.appendChild(this.$button);
        $target.appendChild(this.$element);

        this.$button.addEventListener("click", (e) => {
            onRemove(e.target.id);
        });
    };
}
