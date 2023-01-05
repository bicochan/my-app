export default function TodoItem({
  $target,
  initialState,
  onSuccess,
  onRemove,
}) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    this.state.map((item) => {
      this.render(item);
    });
  };

  // components
  this.render = (item) => {
    const { id, todo, memo, success } = item;

    this.$element = document.createElement("li");
    this.$element.id = id;

    this.$element.innerHTML = `
            <input type="checkbox" id="chk_${id}" ${success ? "checked" : ""} >
            <label for="chk_${id}">${
      memo ? `<div>${todo}<p>${memo}</p></div>` : `${todo}`
    }</label>
            <button id="btn_${id}">삭제</button>
        `;
    $target.appendChild(this.$element);

    const checkbox = document.querySelector(`#chk_${id}`);
    checkbox.addEventListener("change", (e) => {
      const targetId = e.target.id.substring(4) * 1;
      onSuccess(targetId);
    });

    const button = document.querySelector(`#btn_${id}`);
    button.addEventListener("click", (e) => {
      const targetId = e.target.id.substring(4) * 1;
      onRemove(targetId);
    });
  };

  this.state.map((item) => {
    this.render(item);
  });
}
