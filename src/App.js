import Clock from "./components/clock/Clock.js";
import Media from "./components/media/Media.js";
import Sticky from "./components/sticky/Sticky.js";
import Todo from "./components/todo/Todo.js";

import { getLocalStorage, setLocalStorage } from "./utilities/localStorage.js";

export default function App({ $target }) {
  // state
  this.state = {
    time: new Date(),
    todo: getLocalStorage("todos") || [],
    sticky: getLocalStorage("sticky") || [],
    media: getLocalStorage("media") || [],
  };

  this.setState = (newState) => {
    this.state = newState;
    clock.setState(this.state.time);
  };

  // components
  this.$wrap = document.createElement("div");
  this.$wrap.className = "wrap";
  $target.appendChild(this.$wrap);

  const clock = new Clock({
    $target: this.$wrap,
    initialState: this.state.time,
    onChange: (newTime) => {
      this.setState({ time: newTime });
    },
  });

  const sticky = new Sticky({
    $target: this.$wrap,
    initialState: this.state.sticky,
    updateStorage: (data) => {
      setLocalStorage("sticky", data);
    },
  });

  this.$inner = document.createElement("div");
  this.$inner.className = "inner";
  this.$wrap.appendChild(this.$inner);

  const todo = new Todo({
    $target: this.$inner,
    initialState: this.state.todo,
    updateStorage: (data) => {
      setLocalStorage("todos", data);
    },
  });

  const media = new Media({
    $target: this.$inner,
    initialState: this.state.media,
    updateStorage: (data) => {
      setLocalStorage("media", data);
    },
  });
}
