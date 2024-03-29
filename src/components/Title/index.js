import ResetButton from "@components/ResetButton";

export default function Title({ $target, initialState, eventBus }) {
  // state
  this.state = initialState;

  // components
  this.$element = document.createElement("div");
  this.$element.className = "titWrap";
  $target.appendChild(this.$element);

  this.render = () => {
    this.$element.innerHTML = `<h2 class="tit">${this.state.title}</h2>`;
  };

  this.render();

  const resetButton = new ResetButton({
    $target: this.$element,
    initialState: {
      type: this.state.type,
    },
    onReset: () => {
      if (confirm(this.state.resetMessage)) eventBus([]);
    },
  });
}
