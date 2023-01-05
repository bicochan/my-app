import ListItem from "./ListItem.js";

export default function PlayList({
  $target,
  initialState,
  onPlaying,
  onChange,
}) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    this.$element.innerHTML = "";
    this.state.map((li) => {
      listItem.setState(li);
    });
  };

  // components
  this.$element = document.createElement("ul");
  this.$element.className = "playList";
  $target.appendChild(this.$element);

  this.render = () => {};

  const listItem = new ListItem({
    $target: this.$element,
    initialState: {},
    onClick: (id) => {
      onPlaying(id);
    },
    onRemove: (id) => {
      let newState = [...this.state];
      newState = newState.filter((item) => item.video_id !== id);
      onChange(newState);
    },
  });

  this.state.map((li) => {
    listItem.setState(li);
  });
}
