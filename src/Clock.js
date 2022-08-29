export default function Clock({ $target, initialState, onChange }) {
    this.state = initialState;

    this.setState = (nextState) => {
        this.state = nextState;
        this.render();
    };

    this.$element = document.createElement("div");
    this.$element.className = "clock";
    $target.appendChild(this.$element);

    this.render = () => {
        const today = this.state;
        const transformStr = (str) => String(str).padStart(2, "0");
        this.$element.innerHTML = `
            ${transformStr(today.getHours())}:${transformStr(today.getMinutes())}:${transformStr(today.getSeconds())}
            `;
        setTimeout(() => setInterval(onChange(new Date()), 1000));
    };

    this.render();
}
