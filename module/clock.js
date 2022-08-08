let clock = () => {
    const clockEl = document.querySelector(".clock");

    let getTime = () => {
        // 두 자릿수로 치환
        let transformStr = (str) => {
            return String(str).padStart(2, "0");
        };

        const today = new Date();
        clockEl.innerHTML = `${transformStr(today.getHours())}:${transformStr(today.getMinutes())}:${transformStr(today.getSeconds())}`;
    };

    setInterval(getTime, 1000);
};

export { clock };
