/* TODO
// 1. 텍스트 전체 복사 기능
*/
let sticky = () => {
    const addBtn = document.querySelector("#addSticky");
    const stickyWrap = document.querySelector(".stickyWrap");
    const storageNotes = localStorage.getItem("sticky-notes");
    let zIndex = 1;

    const notes = (() => {
        let notes = [];

        return {
            add: (data) => {
                const curNotes = notes.map((item) => item.id);
                if (curNotes.includes(data.id)) {
                    const target = notes.find((item) => item.id === data.id);
                    target.text = data.text;
                    saveNote(notes);
                    return;
                }
                notes.push(data);
                saveNote(notes);
            },
            remove: (target) => {
                notes = notes.filter((item) => item.id !== target.id);
                console.log("remove", notes);
                saveNote(notes);
            },
            reset: () => {
                notes = [];
                saveNote(notes);
            },
        };
    })();

    let createtNote = (data) => {
        const div = document.createElement("div");
        const header = document.createElement("header");
        const textarea = document.createElement("textarea");
        const button = document.createElement("button");

        zIndex += 1;
        div.id = data.id ? `${data.id}` : `${Date.now()}`;
        div.className = "stickyNote";
        div.style.top = data.top ? data.top : "";
        div.style.left = data.left ? data.left : "";
        div.style.zIndex = zIndex;
        stickyWrap.appendChild(div);

        header.className = "stickyHeader";
        div.appendChild(header);

        textarea.value = data.text ? `${data.text}` : "";
        textarea.style.width = data.width ? data.width : "";
        textarea.style.height = data.height ? data.height : "";
        div.appendChild(textarea);

        button.innerHTML = "삭제";
        header.appendChild(button);

        header.addEventListener("mousedown", () => {
            dragElement(header, div);
            zIndex += 1;
            div.style.zIndex = zIndex;
        });
        textarea.addEventListener("mousedown", () => {
            zIndex += 1;
            div.style.zIndex = zIndex;
        });
        button.addEventListener("click", removeNote);
    };

    let removeNote = (e) => {
        const target = e.target.closest("div");
        target.remove();
        notes.remove(target);
    };

    let saveNote = (data) => {
        localStorage.setItem("sticky-notes", JSON.stringify(data));
    };

    let dragElement = (elmt, tail) => {
        let ePos1 = 0,
            ePos2 = 0,
            ePos3 = 0,
            ePos4 = 0;

        let tPos1 = 0,
            tPos2 = 0,
            tPos3 = 0,
            tPos4 = 0;

        let elementDrag = (e) => {
            ePos1 = ePos3 - e.clientX;
            ePos2 = ePos4 - e.clientY;
            ePos3 = e.clientX;
            ePos4 = e.clientY;

            elmt.style.top = elmt.offsetTop - ePos2 / tPos3 + "px";
            elmt.style.left = elmt.offsetLeft - ePos1 / tPos4 + "px";

            tPos1 = tPos3 - e.clientX;
            tPos2 = tPos4 - e.clientY;
            tPos3 = e.clientX;
            tPos4 = e.clientY;

            tail.style.top = tail.offsetTop - tPos2 + "px";
            tail.style.left = tail.offsetLeft - tPos1 + "px";
            tail.style.zIndex = zIndex;
        };

        let closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        let dragMouseDown = (e) => {
            ePos3 = e.clientX;
            ePos4 = e.clientY;

            tPos3 = e.clientX;
            tPos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        elmt.onmousedown = dragMouseDown;
    };

    if (storageNotes !== null) {
        const s = JSON.parse(storageNotes);
        s.forEach((item) => {
            createtNote(item);
            notes.add(item);
        });
    }

    window.onbeforeunload = () => {
        const el = document.querySelectorAll(".stickyNote");
        if (!el.length) return;
        notes.reset();
        el.forEach((item) => {
            const noteData = {
                id: item.id,
                text: item.childNodes[1].value,
                width: item.childNodes[1].style.width,
                height: item.childNodes[1].style.height,
                top: item.style.top,
                left: item.style.left,
            };
            notes.add(noteData);
        });
    };

    addBtn.addEventListener("click", createtNote);
};

export { sticky };
