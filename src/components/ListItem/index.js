export default function ListItem({ $target, initialState, onClick, onRemove }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    this.render(this.state);
  };

  // components
  this.render = (item) => {
    const { title, video_id } = item;

    this.$element = document.createElement("li");
    this.$element.id = video_id;

    this.$element.innerHTML = `${title} <button id="btn_${video_id}">삭제</button>`;
    $target.appendChild(this.$element);

    this.$element.addEventListener("click", (e) => {
      onClick(e.target.id);
    });

    const button = document.querySelector(`#btn_${video_id}`);
    button.addEventListener("click", (e) => {
      const targetId = e.target.id.substring(4);
      onRemove(targetId);
    });
  };
}
