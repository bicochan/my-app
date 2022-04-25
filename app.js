const APP = {
    init: function () {
        this.clock();
        this.todo();
        this.media();
        this.stickyNote();
        this.reset();
    },
    clock: function () {
        const clock = document.querySelector(".clock");

        function getClock() {
            const today = new Date();
            clock.innerHTML = `${transformStr(today.getHours())}:${transformStr(today.getMinutes())}:${transformStr(today.getSeconds())}`;

            // 두 자릿수로 치환
            function transformStr(str) {
                return String(str).padStart(2, "0");
            }
        }

        setInterval(getClock, 1000);
    },
    todo: function () {
        const todoInput = document.querySelector("#todo");
        const memoInput = document.querySelector("#memo");
        const resetBtn = document.querySelector("#todoReset");
        const todoForm = document.querySelector(".todoForm");
        const todoList = document.querySelector(".todoList");
        const storageTodos = localStorage.getItem("todos");

        const todos = (() => {
            let todos = [];

            return {
                add: (data) => {
                    todos.push(data);
                    saveTodo(todos);
                },
                remove: (target) => {
                    todos = todos.filter((item) => item.id !== target.id * 1);
                    saveTodo(todos);
                },
                done: (target, el) => {
                    const t = todos.find((list) => list.id === target.id * 1);
                    t.state = !t.state;
                    t.state ? (el.className = "success") : (el.className = "");
                    saveTodo(todos);
                },
                reset: () => {
                    todos = [];
                    return todos;
                },
            };
        })();

        // todo 입력
        function handlerTodoForm(e) {
            const data = {
                id: Date.now(),
                text: todoInput.value,
                memo: memoInput.value,
                state: false,
            };

            e.preventDefault();
            if (!data.text) {
                alert("할 일을 입력해주세요.");
                todoInput.focus();
                return;
            }

            createTodo(data);
            todos.add(data);
            todoInput.value = "";
            memoInput.value = "";
            todoInput.focus();
        }

        // Document todo 생성
        function createTodo(data) {
            const li = document.createElement("li");
            const button = document.createElement("button");
            const input = document.createElement("input");

            li.id = data.id;
            li.innerHTML = `
                ${data.text}
                ${data.memo ? `<span>${data.memo}</span>` : ""}
            `;

            input.id = data.id;
            input.setAttribute("type", "checkbox");
            if (data.state) {
                li.className = "success";
                input.setAttribute("checked", true);
            }
            li.appendChild(input);

            button.innerHTML = "삭제";
            li.appendChild(button);

            todoList.appendChild(li);

            input.addEventListener("input", handlerCheckbox);
            button.addEventListener("click", removeTodo);
        }

        function handlerCheckbox(e) {
            const target = e.target;
            const li = document.getElementById(target.id);
            todos.done(target, li);
        }

        // Document todo 제거
        function removeTodo(e) {
            const target = e.target.closest("li");
            target.remove();
            todos.remove(target);
        }

        // Local Storage todo 저장
        function saveTodo(data) {
            localStorage.setItem("todos", JSON.stringify(data));
        }

        // 초기 셋팅
        if (storageTodos !== null) {
            const s = JSON.parse(storageTodos);
            s.forEach((item) => {
                todos.add(item);
                createTodo(item);
            });
        }

        // 데이터 초기화
        resetBtn.addEventListener("click", () => {
            if (confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
                saveTodo(todos.reset());
                todoList.innerHTML = "";
            }
        });

        todoForm.addEventListener("submit", handlerTodoForm);
    },
    media: function () {
        const playBtn = document.querySelector("#play");
        const mediaForm = document.querySelector(".mediaForm");
        const storagePlaylist = localStorage.getItem("play-list");
        const playList = document.querySelector(".playList");
        const resetBtn = document.querySelector("#mediaReset");

        // 데이터 초기화
        resetBtn.addEventListener("click", () => {
            if (confirm("정말 유튜브 리스트를 초기화 하시겠어요?")) {
                lists = [];
                savePlaylist(lists);
                playList.innerHTML = "";
            }
        });

        // 초기 셋팅(플레이리스트)
        let lists = [];
        if (storagePlaylist !== null) {
            lists = JSON.parse(storagePlaylist);
            lists.forEach((item) => createPlaylist(item));
        }

        // 초기 셋팅(iframe)
        let media;
        initMedia = setInterval(function () {
            if (YT.loaded === 1) {
                media = new YT.Player("player", {
                    videoId: lists.length > 0 ? lists[0].video_id : "",
                    events: {
                        onStateChange: onPlayerStateChange,
                    },
                });
                clearInterval(initMedia);
                console.log("Success initMedia!", media);
            }
        }, 100);

        // 상태 변경 시
        function onPlayerStateChange(e) {
            if (e.data === -1) {
                // 시작 전
            } else if (e.data === 0) {
                // 종료
                // 다음 리스트 자동재생
                const mediaId = media.playerInfo.videoData.video_id;
                const mediaIndex = lists.findIndex((list) => list.video_id === mediaId);
                if (lists.length - 1 === mediaIndex) return;
                media.loadVideoById(lists[mediaIndex + 1].video_id);
            } else if (e.data === 1) {
                // 재생 중
                playBtn.innerHTML = "일시정지";
                playBtn.id = "pause";
            } else if (e.data === 2) {
                // 일시정지
                playBtn.innerHTML = "재생";
                playBtn.id = "play";
            } else if (e.data === 3) {
                // 버퍼링 중
            } else if (e.data === 5) {
                // 동영상 신호
            }
        }

        // 재생&일시정지 버튼 클릭 시
        playBtn.addEventListener("click", (e) => {
            if (e.target.id === "pause") {
                media.pauseVideo();
            } else {
                media.playVideo();
            }
        });

        // 플레이리스트 입력
        mediaForm.addEventListener("submit", handlerMediaForm);
        function handlerMediaForm(e) {
            const input = mediaForm.querySelector("input");
            const val = input.value;
            const subStr = val.substring(val.indexOf(".be/") + 4);
            e.preventDefault();
            setPlaylistData(subStr);
            input.value = "";
        }

        // 플레이리스트 정보 셋팅
        function setPlaylistData(val) {
            // Doc 리스트 생성을 위한 임시 Dom 생성
            const div = document.createElement("div");
            div.id = "player2";
            document.querySelector("body").appendChild(div);

            const media2 = new YT.Player("player2", { videoId: val });
            const getVideoData = setInterval(function () {
                if (media2.u) {
                    const videoData = media2.getVideoData();
                    const listData = {
                        video_id: val,
                        title: videoData.title,
                    };

                    if (videoData.video_id === val && videoData.title !== "") {
                        lists.push(listData);
                        createPlaylist(videoData);
                        savePlaylist(lists);
                    } else {
                        alert("링크가 올바르지 않거나 저작권으로 인해 재생이 불가능한 동영상입니다.");
                    }
                    clearInterval(getVideoData);
                    document.querySelector("#player2").remove();
                }
            }, 100);
        }

        // Document 플레이리스트 추가
        function createPlaylist(data) {
            const li = document.createElement("li");
            const span = document.createElement("span");
            const button = document.createElement("button");

            li.id = data.video_id;
            span.innerHTML = `${data.title}`;
            button.innerHTML = "삭제";

            li.appendChild(span);
            li.appendChild(button);
            playList.appendChild(li);
            span.addEventListener("click", (e) => {
                playVideo(e.target.parentNode.id);
            });
            button.addEventListener("click", removePlaylist);
        }

        // Document 플레이리스트 삭제
        function removePlaylist(e) {
            const target = e.target.closest("li");
            target.remove();
            lists = lists.filter((list) => list.video_id !== target.id);
            savePlaylist(lists);
        }

        // Document 플레이리스트 클릭 시
        function playVideo(id) {
            media.loadVideoById(id);
        }

        // Local Storage 플레이리스트 정보 저장
        function savePlaylist(data) {
            localStorage.setItem("play-list", JSON.stringify(data));
        }
    },
    stickyNote: function () {
        const stickyWrap = document.querySelector(".stickyWrap");
        const addBtn = document.querySelector("#addSticky");
        const storageNotes = localStorage.getItem("sticky-notes");

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

        function createtNote(data) {
            const div = document.createElement("div");
            const header = document.createElement("header");
            const textarea = document.createElement("textarea");
            const button = document.createElement("button");

            div.id = data.id ? `${data.id}` : `${Date.now()}`;
            div.className = "stickyNote";
            div.style.top = data.top ? data.top : "";
            div.style.left = data.left ? data.left : "";
            stickyWrap.appendChild(div);

            header.className = "stickyHeader";
            div.appendChild(header);

            textarea.value = data.text ? `${data.text}` : "";
            textarea.style.width = data.width ? data.width : "";
            textarea.style.height = data.height ? data.height : "";
            div.appendChild(textarea);

            button.innerHTML = "삭제";
            div.appendChild(button);

            header.addEventListener("mousedown", () => {
                dragElement(header, div);
            });
            textarea.addEventListener("mousedown", () => {
                div.style.zIndex = 100;
            });
            button.addEventListener("click", removeNote);
        }

        function removeNote(e) {
            const target = e.target.closest("div");
            target.remove();
            notes.remove(target);
        }

        function saveNote(data) {
            localStorage.setItem("sticky-notes", JSON.stringify(data));
        }

        function dragElement(elmt, tail) {
            let ePos1 = 0,
                ePos2 = 0,
                ePos3 = 0,
                ePos4 = 0;

            let tPos1 = 0,
                tPos2 = 0,
                tPos3 = 0,
                tPos4 = 0;

            function dragMouseDown(e) {
                ePos3 = e.clientX;
                ePos4 = e.clientY;

                tPos3 = e.clientX;
                tPos4 = e.clientY;

                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                const allElmt = document.querySelectorAll(".stickyNote");
                allElmt.forEach((item) => {
                    item.style.zIndex = 10;
                });
                tail.style.zIndex = 20;

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
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }

            elmt.onmousedown = dragMouseDown;
        }

        if (storageNotes !== null) {
            const s = JSON.parse(storageNotes);
            s.forEach((item) => {
                createtNote(item);
                notes.add(item);
            });
        }

        window.onbeforeunload = function () {
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
    },
    reset: function () {
        document.querySelector("#allReset").addEventListener("click", function () {
            if (confirm("정말 전체 데이터를 초기화 하시겠어요?")) {
                localStorage.removeItem("todos");
                localStorage.removeItem("play-list");
                location.reload();
            }
        });
    },
};

APP.init();
