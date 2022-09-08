import InputTextarea from "../forms/InputTextarea.js";

import { draggable } from "../../utilities/draggable.js";
import { uponLayer } from "../../utilities/uponLayer.js";

export default function Notes({ $target, initialState, onbeforeunload }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        this.render(this.state.pop());
    };

    this.render = (item) => {
        const { id, text, width, height, top, left } = item;

        this.$element = document.createElement("div");
        this.$element.id = `sticky_${id}`;
        this.$element.className = "stickyNote";
        this.$element.style.top = top || "";
        this.$element.style.left = left || "";
        this.$element.innerHTML = `<header class="stickyHeader"><button id="btn_${id}">삭제</button></header>`;

        const inputTextarea = new InputTextarea({
            $target: this.$element,
            initialState: { text: text || "", placeholder: "메모 입력" },
            onChange: (text) => inputTextarea.setState(text),
        });
        inputTextarea.$element.style.width = width || "";
        inputTextarea.$element.style.height = height || "";
        inputTextarea.$element.addEventListener("mousedown", () => uponLayer(document.querySelector(`#sticky_${id}`)));

        $target.appendChild(this.$element);

        const dragTarget = document.querySelector(`#sticky_${id}`);
        const dragHandler = dragTarget.children[0];
        dragHandler.addEventListener("mouseover", () => draggable(dragHandler, dragTarget));

        const removeButton = document.querySelector(`#btn_${id}`);
        removeButton.addEventListener("click", (e) => document.querySelector(`#sticky_${e.target.id.substring(4) * 1}`).remove());
    };

    this.state.map((item) => this.render(item));

    window.onbeforeunload = () => onbeforeunload(document.querySelectorAll(".stickyNote"));
}
