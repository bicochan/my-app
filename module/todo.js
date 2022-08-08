/* TODO
// 1. 투두리스트 & 메모 내용 수정 기능
// 2. 완료 항목 분류 기능
*/
let todo = () => {
    const todoInput = document.querySelector("#todo");
    const memoInput = document.querySelector("#memo");
    const resetBtn = document.querySelector("#todoReset");
    const todoForm = document.querySelector(".todoForm");
    const todoList = document.querySelector(".todoList");
    const storageTodos = localStorage.getItem("todos");

    const todos = (() => {
        let todos = [];

        return {
            add: (data) => {
                todos.push(data);
                saveTodo(todos);
            },
            remove: (target) => {
                todos = todos.filter((item) => item.id !== target.id * 1);
                saveTodo(todos);
            },
            done: (target, el) => {
                const t = todos.find((list) => list.id === target.id * 1);
                t.state = !t.state;
                t.state ? (el.className = "success") : (el.className = "");
                saveTodo(todos);
            },
            reset: () => {
                todos = [];
                saveTodo(todos);
            },
        };
    })();

    // todo 입력
    let handlerTodoForm = (e) => {
        const data = {
            id: Date.now(),
            text: todoInput.value,
            memo: memoInput.value,
            state: false,
        };

        e.preventDefault();
        if (!data.text) {
            alert("할 일을 입력해주세요.");
            todoInput.focus();
            return;
        }

        createTodo(data);
        todos.add(data);
        todoInput.value = "";
        memoInput.value = "";
        todoInput.focus();
    };

    // Document todo 생성
    let createTodo = (data) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        const input = document.createElement("input");

        li.id = data.id;
        li.innerHTML = `
                ${data.text}
                ${data.memo ? `<span>${data.memo}</span>` : ""}
            `;
        todoList.appendChild(li);

        input.id = data.id;
        input.setAttribute("type", "checkbox");
        if (data.state) {
            li.className = "success";
            input.setAttribute("checked", true);
        }
        li.appendChild(input);

        button.innerHTML = "삭제";
        li.appendChild(button);

        input.addEventListener("input", handlerCheckbox);
        button.addEventListener("click", removeTodo);
    };

    // todo 완료
    let handlerCheckbox = (e) => {
        const target = e.target;
        const li = document.getElementById(target.id);
        todos.done(target, li);
    };

    // Document todo 제거
    let removeTodo = (e) => {
        const target = e.target.closest("li");
        target.remove();
        todos.remove(target);
    };

    // Local Storage todo 저장
    let saveTodo = (data) => {
        localStorage.setItem("todos", JSON.stringify(data));
    };

    // 초기 셋팅
    if (storageTodos !== null) {
        const s = JSON.parse(storageTodos);
        s.forEach((item) => {
            todos.add(item);
            createTodo(item);
        });
    }

    // 데이터 초기화
    resetBtn.addEventListener("click", () => {
        if (confirm("정말 투두 리스트를 초기화 하시겠어요?")) {
            todos.reset();
            todoList.innerHTML = "";
        }
    });

    todoForm.addEventListener("submit", handlerTodoForm);
};

export { todo };
