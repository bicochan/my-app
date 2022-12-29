/* TODO
// 1. 한 곡/전곡 반복 기능
// 2. 리스트 자동 추가 기능(클립보드 활용)
*/
import Title from "../layout/Title.js";
import Player from "./Player.js";
import MediaForm from "./MediaForm.js";
import PlayList from "./PlayList.js";

export default function Media({ $target, initialState, updateStorage }) {
    this.state = initialState;

    this.setState = (newState) => {
        this.state = newState;
        playList.setState(this.state);
        updateStorage(this.state);
    };

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
            resetMessage: "정말 유튜브 리스트를 초기화 하시겠어요?",
        },
        eventBus: (data) => {
            this.setState(data);
        },
    });

    const player = new Player({
        $target: this.$element,
        initialState: {
            videoId: this.state[0].video_id,
        },
        onStateChange: (e) => {
            onPlayerStateChange(e);
        },
    });

    const mediaForm = new MediaForm({
        $target: this.$element,
        initialState: {
            placeholder: "유튜브 공유하기 링크 입력",
        },
        onSubmit: (data) => {
            const shareId = data.substring(data.indexOf(".be/") + 4);
            fetchMediaData(shareId);
        },
    });

    const playList = new PlayList({
        $target: this.$element,
        initialState: this.state,
        onPlaying: (id) => {
            player.media.loadVideoById(id);
        },
        onChange: (list) => {
            this.setState(list);
        },
    });

    const fetchMediaData = async (id) => {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyDEofmqOL3deN_SVX8bNGKidVAA5fZikKQ&fields=items(id,snippet(title))&part=snippet`;
        const mediaData = {
            video_id: id,
            title: "",
        };

        const data = await fetch(url)
            .then((res) => res.json())
            .catch((err) => console.log(err));
        mediaData.title = data.items[0].snippet.title;

        const duplication = (item) => item.video_id === mediaData.video_id;
        if (this.state.some(duplication)) return;

        this.setState([...this.state, mediaData]);
    };

    // Change Player State
    const onPlayerStateChange = (e) => {
        if (e.data === -1) {
            // before start
        } else if (e.data === 0) {
            // end
            const mediaId = player.media.playerInfo.videoData.video_id;
            const mediaIndex = this.state.findIndex((list) => list.video_id === mediaId);

            if (this.state.length - 1 === mediaIndex) return;
            player.media.loadVideoById(this.state[mediaIndex + 1].video_id);
        } else if (e.data === 1) {
            // playing
        } else if (e.data === 2) {
            // pause
        } else if (e.data === 3) {
            // buffering
        }
    };
}
