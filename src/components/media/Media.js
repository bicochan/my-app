/* TODO
// 1. 한 곡/전곡 반복 기능
// 2. 리스트 자동 추가 기능(클립보드 활용)
// 3. 코드 리팩토링
*/
// let media = () => {
//     const playBtn = document.querySelector("#play");
//     const resetBtn = document.querySelector("#mediaReset");
//     const mediaForm = document.querySelector(".mediaForm");
//     const playList = document.querySelector(".playList");
//     const storagePlaylist = localStorage.getItem("play-list");

//     const lists = (() => {
//         let lists = [];

//         return {
//             add: (data) => {
//                 lists.push(data);
//                 savePlaylist(lists);
//             },
//             remove: (target) => {
//                 lists = lists.filter((item) => item.video_id !== target.id);
//                 savePlaylist(lists);
//                 console.log(lists);
//             },
//             reset: () => {
//                 lists = [];
//                 savePlaylist(lists);
//             },
//         };
//     })();

//     // 상태 변경 시
//     let onPlayerStateChange = (e) => {
//         if (e.data === -1) {
//             // 시작 전
//         } else if (e.data === 0) {
//             // 종료
//             // 다음 리스트 자동재생
//             const mediaId = media.playerInfo.videoData.video_id;
//             const mediaIndex = lists.findIndex((list) => list.video_id === mediaId);
//             if (lists.length - 1 === mediaIndex) return;
//             media.loadVideoById(lists[mediaIndex + 1].video_id);
//         } else if (e.data === 1) {
//             // 재생 중
//             playBtn.innerHTML = "일시정지";
//             playBtn.id = "pause";
//         } else if (e.data === 2) {
//             // 일시정지
//             playBtn.innerHTML = "재생";
//             playBtn.id = "play";
//         } else if (e.data === 3) {
//             // 버퍼링 중
//         } else if (e.data === 5) {
//             // 동영상 신호
//         }
//     };

//     // 플레이리스트 입력
//     let handlerMediaForm = (e) => {
//         const input = mediaForm.querySelector("input");
//         const val = input.value;
//         const subStr = val.substring(val.indexOf(".be/") + 4);
//         e.preventDefault();
//         setPlaylistData(subStr);
//         input.value = "";
//     };

//     // 플레이리스트 정보 셋팅
//     let setPlaylistData = (id) => {
//         const API_KEY = "AIzaSyDEofmqOL3deN_SVX8bNGKidVAA5fZikKQ";
//         const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${API_KEY}&fields=items(id,snippet(title))&part=snippet`;
//         const mediaData = {
//             video_id: id,
//             title: "",
//         };

//         let getApi = async () => {
//             const response = await fetch(url);
//             const data = await response.json();

//             mediaData.title = data.items[0].snippet.title;
//             lists.add(mediaData);
//             createPlaylist(mediaData);
//         };
//         getApi();
//     };

//     // Document 플레이리스트 추가
//     let createPlaylist = (data) => {
//         const li = document.createElement("li");
//         const span = document.createElement("span");
//         const button = document.createElement("button");

//         li.id = data.video_id;
//         playList.appendChild(li);

//         span.innerHTML = `${data.title}`;
//         li.appendChild(span);

//         button.innerHTML = "삭제";
//         li.appendChild(button);

//         span.addEventListener("click", (e) => {
//             playVideo(e.target.parentNode.id);
//         });
//         button.addEventListener("click", removePlaylist);
//     };

//     // Document 플레이리스트 삭제
//     let removePlaylist = (e) => {
//         const target = e.target.closest("li");
//         target.remove();
//         lists.remove(target);
//     };

//     // Document 플레이리스트 클릭 시
//     let playVideo = (id) => {
//         media.loadVideoById(id);
//     };

//     // Local Storage 플레이리스트 정보 저장
//     let savePlaylist = (data) => {
//         localStorage.setItem("play-list", JSON.stringify(data));
//     };

//     // 초기 셋팅
//     const s = JSON.parse(storagePlaylist) || [];
//     const video_id = s.length > 0 ? s[0].video_id : "";

//     if (storagePlaylist !== null) {
//         s.forEach((item) => {
//             lists.add(item);
//             createPlaylist(item);
//         });
//     }

//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";

//     const firstScriptTag = document.getElementsByTagName("script")[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//     let media = null;
//     window.onYouTubeIframeAPIReady = () => {
//         media = new YT.Player("player", {
//             videoId: video_id,
//             playerVars: { controls: 0 },
//             events: {
//                 onStateChange: onPlayerStateChange,
//             },
//         });
//         console.log("Success initMedia!", media);
//     };

//     // 재생&일시정지 버튼 클릭 시
//     playBtn.addEventListener("click", (e) => {
//         if (e.target.id === "pause") {
//             media.pauseVideo();
//         } else {
//             media.playVideo();
//         }
//     });

//     // 데이터 초기화
//     resetBtn.addEventListener("click", () => {
//         if (confirm("정말 유튜브 리스트를 초기화 하시겠어요?")) {
//             lists.reset();
//             playList.innerHTML = "";
//         }
//     });

//     mediaForm.addEventListener("submit", handlerMediaForm);
// };

// export { media };

import Title from "../layout/Title.js";

export default function Media({ $target, initialState }) {
    this.state = initialState;

    this.setState = () => {};

    this.$element = document.createElement("div");
    this.$element.className = "mediaWrap";
    $target.appendChild(this.$element);

    this.render = () => {};

    this.render();

    const title = new Title({
        $target: this.$element,
        initialState: {
            type: "MEDIA",
            title: "YOUTUBE PLAYER",
        },
        eventBus: (data) => {
            this.setState(data);
        },
    });
}
