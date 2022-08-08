import { clock } from "./module/clock.js";
import { todo } from "./module/todo.js";
import { media } from "./module/media.js";
import { sticky } from "./module/sticky.js";

const APP = {
    init: function () {
        clock();
        todo();
        media();
        sticky();
        this.reset();
    },
    /* TODO
    // 1. reset 모듈 제작
    */
    reset: function () {
        document.querySelector("#allReset").addEventListener("click", function () {
            if (confirm("정말 모든 데이터를 초기화 하시겠어요?")) {
                localStorage.removeItem("todos");
                localStorage.removeItem("play-list");
                localStorage.removeItem("sticky-notes");
                location.reload();
            }
        });
    },
};

APP.init();
