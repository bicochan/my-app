import Clock from "./Clock.js";
// import { todo } from "./module/todo.js";
// import { media } from "./module/media.js";
// import { sticky } from "./module/sticky.js";

// const APP = {
//     init: function () {
//         clock();
//         todo();
//         media();
//         sticky();
//         this.reset();
//     },
//     /* TODO
//     // 1. reset 모듈 제작
//     */
//     reset: function () {
//         document.querySelector("#allReset").addEventListener("click", function () {
//             if (confirm("정말 모든 데이터를 초기화 하시겠어요?")) {
//                 localStorage.removeItem("todos");
//                 localStorage.removeItem("play-list");
//                 localStorage.removeItem("sticky-notes");
//                 location.reload();
//             }
//         });
//     },
// };

// APP.init();

export default function App({ $target }) {
    this.state = {
        time: new Date(),
    };

    this.setState = (nextState) => {
        this.state = nextState;
        clock.setState(this.state.time);
    };

    this.$element = document.createElement("div");
    this.$element.className = "wrap";
    $target.appendChild(this.$element);

    const clock = new Clock({
        $target: this.$element,
        initialState: this.state.time,
        onChange: (newTime) => {
            this.setState({ time: newTime });
        },
    });
}
