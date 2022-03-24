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
            const todoData = { id, todo, memo, state: false };

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
            const input = document.createElement("input");
            const todoList = document.querySelector(".todoList");

            if (data.state) {
                li.className = "success";
                input.setAttribute("checked", true);
            }
            li.id = data.id;
            input.id = data.id;
            input.setAttribute("type", "checkbox");

            li.innerHTML = `
                ${data.todo}
                ${data.memo ? `<span>${data.memo}</span>` : ""}
            `;
            button.innerHTML = "삭제";

            li.appendChild(input);
            li.appendChild(button);
            todoList.appendChild(li);
            input.addEventListener("input", handlerInput);
            button.addEventListener("click", deleteTodo);
        }

        function handlerInput(e) {
            const id = e.target.id;
            const li = document.getElementById(id);
            const todo = todos.find((list) => list.id === id * 1);

            if (todo.state) {
                li.className = "";
                todo.state = false;
            } else {
                li.className = "success";
                todo.state = true;
            }
            saveTodo(todos);
        }

        // Document todo 제거
        function deleteTodo(e) {
            const li = e.target.closest("li");
            li.remove();
            todos = todos.filter((list) => list.id !== li.id * 1);
            saveTodo(todos);
        }

        // Local Storage todo 정보 저장
        function saveTodo(data) {
            localStorage.setItem("todos", JSON.stringify(data));
        }
    },
    media: function () {
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

        // 초기 셋팅(iframe)
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
        mediaForm.addEventListener("submit", handlerFormMedia);
        function handlerFormMedia(e) {
            const input = mediaForm.querySelector("input");
            const val = input.value;
            const subStr = val.substring(val.indexOf("v=") + 2);
            e.preventDefault();
            setPlaylist(subStr);
            input.value = "";
        }

        // 플레이리스트 정보 셋팅
        function setPlaylist(val) {
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
                        insertPlaylist(videoData);
                        savePlaylist(lists);
                    } else {
                        alert("유튜브 ID 형식이 올바르지 않거나 재생이 불가능한 동영상 입니다.");
                    }
                    clearInterval(getVideoData);
                    document.querySelector("#player2").remove();
                }
            }, 100);
        }

        // Document 플레이리스트 추가
        function insertPlaylist(data) {
            const li = document.createElement("li");
            const span = document.createElement("span");
            const button = document.createElement("button");
            const playList = document.querySelector(".playList");

            li.id = data.video_id;
            span.innerHTML = `${data.title}`;
            button.innerHTML = "삭제";

            li.appendChild(span);
            li.appendChild(button);
            playList.appendChild(li);
            span.addEventListener("click", (e) => {
                playVideo(e.target.parentNode.id);
            });
            button.addEventListener("click", deletePlaylist);
        }

        // Document 플레이리스트 삭제
        function deletePlaylist(e) {
            const li = e.target.closest("li");
            li.remove();
            lists = lists.filter((list) => list.video_id !== li.id);
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
};

APP.init();
