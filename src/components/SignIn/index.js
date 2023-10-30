export default function Signin({ $target, initialState, onSignIn }) {
  // state
  this.state = initialState;

  // component
  this.$element = document.createElement("button");
  this.$element.className = "signInBtn";
  $target.appendChild(this.$element);

  this.render = () => {
    this.$element.innerHTML = `유튜브 로그인`;
    this.$element.addEventListener("click", () => {});
  };

  this.render();

  function authenticate() {
    return gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyDEofmqOL3deN_SVX8bNGKidVAA5fZikKQ");
    return gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }
}
