import { uponLayer } from "./uponLayer.js";

export const draggable = (handler, target) => {
    let hPos1 = 0,
        hPos2 = 0,
        hPos3 = 0,
        hPos4 = 0;

    let tPos1 = 0,
        tPos2 = 0,
        tPos3 = 0,
        tPos4 = 0;

    let elementDrag = (e) => {
        hPos1 = hPos3 - e.clientX;
        hPos2 = hPos4 - e.clientY;
        hPos3 = e.clientX;
        hPos4 = e.clientY;

        handler.style.top = handler.offsetTop - hPos2 / tPos3 + "px";
        handler.style.left = handler.offsetLeft - hPos1 / tPos4 + "px";

        tPos1 = tPos3 - e.clientX;
        tPos2 = tPos4 - e.clientY;
        tPos3 = e.clientX;
        tPos4 = e.clientY;

        target.style.top = target.offsetTop - tPos2 + "px";
        target.style.left = target.offsetLeft - tPos1 + "px";
    };

    let closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    };

    let dragMouseDown = (e) => {
        hPos3 = e.clientX;
        hPos4 = e.clientY;

        tPos3 = e.clientX;
        tPos4 = e.clientY;

        uponLayer(target);

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    handler.onmousedown = dragMouseDown;
};
