export default function Clock({ $target, initialState, onChange }) {
  // state
  this.state = initialState;

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  // components
  this.$element = document.createElement("div");
  this.$element.className = "clock";
  $target.appendChild(this.$element);

  this.render = () => {
    const today = this.state;
    const transformStr = (str) => String(str).padStart(2, "0");

    this.$element.innerHTML = `${transformStr(today.getHours())}:${transformStr(
      today.getMinutes()
    )}:${transformStr(today.getSeconds())}`;

    setTimeout(() => {
      onChange(new Date());
    }, 1000);
  };

  this.render();
}
