/* TODO
// 1. 텍스트 전체 복사 기능
// 2. z-index
*/
import Notes from "./Notes.js";

export default function Sticky({ $target, initialState, updateStorage }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "stickyWrap";
    $target.appendChild(this.$element);

    this.render = () => {
        this.$element.innerHTML = '<button class="addSticky">스티커노트 추가</button>';
        document.querySelector(".addSticky").addEventListener("click", () => {
            notes.render({ id: Date.now() });
        });
    };

    this.render();

    const notes = new Notes({
        $target: this.$element,
        initialState: this.state,
        onbeforeunload: (data) => {
            let noteData = [];
            data.forEach((item) => {
                const itemData = {
                    id: item.id.substring(7) * 1,
                    text: item.children[1].value,
                    width: item.children[1].style.width,
                    height: item.children[1].style.height,
                    top: item.style.top,
                    left: item.style.left,
                };
                noteData.push(itemData);
            });
            updateStorage(noteData);
        },
    });
}
