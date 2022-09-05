import Clock from "./components/clock/Clock.js";
import Sticky from "./components/sticky/Sticky.js";
import Todo from "./components/todo/Todo.js";
// import { media } from "./module/media.js";

import { getLocalStorage, setLocalStorage } from "./utilities/localStorage.js";

export default function App({ $target }) {
    this.state = {
        time: new Date(),
        todo: getLocalStorage("todos") || [],
    };

    this.setState = (newState) => {
        this.state = newState;
        clock.setState(this.state.time);
    };

    this.$wrap = document.createElement("div");
    this.$wrap.className = "wrap";
    $target.appendChild(this.$wrap);

    const clock = new Clock({
        $target: this.$wrap,
        initialState: this.state.time,
        onChange: (newTime) => {
            this.setState({ time: newTime });
        },
    });

    this.$inner = document.createElement("div");
    this.$inner.className = "inner";
    this.$wrap.appendChild(this.$inner);

    const todo = new Todo({
        $target: this.$inner,
        initialState: this.state.todo,
        updateStorage: (data) => {
            setLocalStorage("todos", data);
        },
    });

    const sticky = new Sticky({ $target: this.$wrap });
}

// const APP = {
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
