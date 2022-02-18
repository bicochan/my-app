const APP = {
    init: function () {
        this.clock();
        this.todo();
        this.media();
    },
    clock: function () {
        const clock = document.querySelector(".clock");

        setInterval(getClock, 1000);

        function getClock() {
            const today = new Date();
            clock.innerHTML = `${transformStr(today.getHours())}:${transformStr(today.getMinutes())}:${transformStr(today.getSeconds())}`;

            // 두 자릿수로 치환
            function transformStr(str) {
                return String(str).padStart(2, "0");
            }
        }
    },
    todo: function () {
        // TODO
        // 1. 완료 처리
        const todoInput = document.querySelector("#todo");
        const memoInput = document.querySelector("#memo");
        const todoForm = document.querySelector(".todoForm");
        const storageTodos = localStorage.getItem("todos");

        // 초기 셋팅
        let todos = [];
        if (storageTodos !== null) {
            todos = JSON.parse(storageTodos);
            todos.forEach((item) => insertTodo(item));
        }

        // todo 입력
        todoForm.addEventListener("submit", handlerFormTodo);
        function handlerFormTodo(e) {
            e.preventDefault();
            setTodo(Date.now(), todoInput.value, memoInput.value);
            todoInput.value = "";
            memoInput.value = "";
            todoInput.focus();
        }

        // todo 정보 셋팅
        function setTodo(id, todo, memo) {
            const todoData = { id, todo, memo };

            if (!todo) {
                alert("할 일을 입력해주세요.");
                todoInput.focus();
                return;
            }

            todos.push(todoData);
            insertTodo(todoData);
            saveTodo(todos);
        }

        // Document todo 추가
        function insertTodo(data) {
            const li = document.createElement("li");
            const button = document.createElement("button");
            const todoList = document.querySelector(".todoList");

            li.id = data.id;
            li.innerHTML = `
                ${data.todo}
                ${data.memo ? `<span>${data.memo}</span>` : ""}
            `;
            button.innerHTML = "삭제";

            li.appendChild(button);
            todoList.appendChild(li);
            button.addEventListener("click", deleteTodo);
        }

        // Document todo 제거
        function deleteTodo(e) {
            const li = e.target.closest("li");
            li.remove();
            saveTodo(todos.filter((list) => list.id !== li.id * 1));
        }

        // Local Storage todo 정보 저장
        function saveTodo(data) {
            localStorage.setItem("todos", JSON.stringify(data));
        }
    },
    media: function () {
        // TODO
        // 1. 다음/이전 기능
        // 2. 자동 재생 기능(재생 완료 시 다음으로)
        const prevBtn = document.querySelector("#prev");
        const playBtn = document.querySelector("#play");
        const nextBtn = document.querySelector("#next");
        const mediaForm = document.querySelector(".mediaForm");
        const storagePlaylist = localStorage.getItem("play-list");

        // 초기 셋팅(플레이리스트)
        let lists = [];
        if (storagePlaylist !== null) {
            lists = JSON.parse(storagePlaylist);
            lists.forEach((item) => insertPlaylist(item));
        }

        // 초기 셋팅(api)
        let media;
        const initMedia = setInterval(function () {
            if (YT.loaded === 1) {
                media = new YT.Player("player", {
                    videoId: lists.length > 0 ? lists[0].video_id : "",
                    events: {
                        onStateChange: onPlayerStateChange,
                    },
                });
                clearInterval(initMedia);
            }
            console.log("Success initMedia!", media);
        }, 100);

        // 상태 변경 시
        function onPlayerStateChange(e) {
            if (e.data === 1) {
                playBtn.innerHTML = "일시정지";
                playBtn.id = "pause";
            } else if (e.data === 2) {
                playBtn.innerHTML = "재생";
                playBtn.id = "play";
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
        mediaForm.addEventListener("submit", handlerFormMedia);
        function handlerFormMedia(e) {
            const input = mediaForm.querySelector("input");
            e.preventDefault();
            setPlaylist(input.value);
            input.value = "";
        }

        // 플레이리스트 정보 셋팅
        // BUG: 재생 중에 리스트 추가할 경우 media 바뀌지 않고 리스트만 추가되게
        function setPlaylist(val) {
            media.cueVideoById(val);
            const getVideoData = setInterval(function () {
                const videoData = media.getVideoData();
                const listData = {
                    video_id: val,
                    title: videoData.title,
                };

                if (videoData.video_id === val) {
                    lists.push(listData);
                    insertPlaylist(videoData);
                    savePlaylist(lists);
                    clearInterval(getVideoData);
                }
            }, 1000);
        }

        // Document 플레이리스트 추가
        function insertPlaylist(data) {
            const li = document.createElement("li");
            const button = document.createElement("button");
            const playList = document.querySelector(".playList");

            li.id = data.video_id;
            li.innerHTML = `${data.title}`;
            button.innerHTML = "삭제";

            li.appendChild(button);
            playList.appendChild(li);
            li.addEventListener("click", (e) => {
                playVideo(e.target.id);
            });
            button.addEventListener("click", deletePlaylist);
        }

        // Document 플레이리스트 삭제
        // BUG: 삭제 시 빈 화면(또는 다음 리스트 화면)으로 나오게
        function deletePlaylist(e) {
            const li = e.target.closest("li");
            li.remove();
            savePlaylist(lists.filter((list) => list.id !== li.id * 1));
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
};

APP.init();
