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

        const updateTodo = (() => {
            let todos = [];

            return {
                add: (data) => {
                    todos.push(data);
                    return todos;
                },
                remove: (target) => {
                    todos = todos.filter((item) => item.id !== target.id * 1);
                    return todos;
                },
                done: (target, el) => {
                    const t = todos.find((list) => list.id === target.id * 1);
                    t.state = !t.state;
                    t.state ? (el.className = "success") : (el.className = "");
                    return todos;
                },
            };
        })();

        // todo 입력
        function handlerTodoForm(e) {
            const todoData = {
                id: Date.now(),
                text: todoInput.value,
                memo: memoInput.value,
                state: false,
            };

            e.preventDefault();
            if (!todoData.text) {
                alert("할 일을 입력해주세요.");
                todoInput.focus();
                return;
            }

            createTodo(todoData);
            saveTodo(updateTodo.add(todoData));
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
            saveTodo(updateTodo.done(target, li));
        }

        // Document todo 제거
        function removeTodo(e) {
            const target = e.target.closest("li");
            target.remove();
            saveTodo(updateTodo.remove(target));
        }

        // Local Storage todo 저장
        function saveTodo(data) {
            localStorage.setItem("todos", JSON.stringify(data));
        }

        // 초기 셋팅
        if (storageTodos !== null) {
            const s = JSON.parse(storageTodos);
            s.forEach((item) => {
                updateTodo.add(item);
                createTodo(item);
            });
        }

        // 데이터 초기화
        resetBtn.addEventListener("click", () => {
            if (confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
                todos = [];
                saveTodo(todos);
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

        let notes = [];
        if (storageNotes !== null) {
            notes = JSON.parse(storageNotes);
            notes.forEach((item) => createtNote(item));
        }

        addBtn.addEventListener("click", createtNote);
        function createtNote(data) {
            const div = document.createElement("div");
            const textarea = document.createElement("textarea");
            const button = document.createElement("button");

            div.id = data.id ? `${data.id}` : `${Date.now()}`;
            div.className = "stickyNote";
            textarea.value = data.text ? `${data.text}` : "";
            button.innerHTML = "삭제";
            div.appendChild(textarea);
            div.appendChild(button);
            stickyWrap.appendChild(div);

            textarea.addEventListener("focusout", () => {
                const noteData = {
                    id: div.id,
                    text: textarea.value,
                };
                setNoteData(noteData);
            });
            button.addEventListener("click", removeNote);
        }

        function setNoteData(data) {
            const curNotes = notes.map((item) => {
                return item.id;
            });
            if (curNotes.includes(data.id)) {
                const target = notes.find((item) => item.id === data.id);
                target.text = data.text;
                saveNote(notes);
                return;
            }
            notes.push(data);
            saveNote(notes);
        }

        function removeNote(e) {
            const target = e.target.closest("div");
            target.remove();
            notes = notes.filter((item) => item.id !== target.id);
            saveNote(notes);
        }

        function saveNote(data) {
            localStorage.setItem("sticky-notes", JSON.stringify(data));
        }
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
