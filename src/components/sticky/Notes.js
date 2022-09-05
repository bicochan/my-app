import { draggable } from "../../utilities/draggable.js";

export default function Notes({ $target }) {
    this.state = {};

    this.setState = () => {};

    this.render = () => {
        const id = Date.now();

        this.$element = document.createElement("div");
        this.$element.className = "stickyNote";
        this.$element.id = `sticky_${id}`;
        this.$element.innerHTML = `
            <header class="stickyHeader"><button id="btn_${id}">삭제</button></header>
            <textarea></textarea>
        `;
        $target.appendChild(this.$element);

        const dragTarget = document.querySelector(`#sticky_${id}`);
        const dragHandler = dragTarget.children[0];
        dragHandler.addEventListener("mouseover", () => {
            draggable(dragHandler, dragTarget);
        });

        document.querySelector(`#btn_${id}`).addEventListener("click", (e) => {
            console.log(`Delete :: sticky_${e.target.id.substring(4) * 1}`);
        });
    };
}
