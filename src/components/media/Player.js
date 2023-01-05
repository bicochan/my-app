export default function Player({ $target, initialState, onStateChange }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  // components
  this.$element = document.createElement("div");
  this.$element.id = "player";
  $target.appendChild(this.$element);

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";

  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  this.render = () => {
    window.onYouTubeIframeAPIReady = () => {
      this.media = new YT.Player("player", {
        videoId: this.state.videoId,
        events: { onStateChange },
      });
      console.log("Success initMedia!", this.media);
    };
  };

  this.render();
}
