function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }
  if (callbacks) {
    Object.keys(callbacks).forEach((eventName) => {
      element.addEventListener(eventName, callbacks[eventName]);
    });
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [
        {text: "Сделать домашку", done: false},
        {text : "Сделать практику", done: false},
        {text: "Пойти домой", done: false},
      ],
    }
  }
  renderTodo(todo) {
    return createElement("li", {}, [
      createElement("input", { type: "checkbox"}),
      createElement("label", {}, todo.text),
      createElement("button", {}, "🗑️"),
    ]);
  }
  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }),
        createElement("button", { id: "add-btn" }, "+"),
      ]),
      createElement("ul", { id: "todos" }, this.state.todos.map((todo) => this.renderTodo(todo))),
    ]);
  }
  onAddTask() {
    const text = this.state.addInputValue.trim();

    if (!text) {
      return;
    }

    this.state.todos.push({
      text,
      done: false,
    });

    this.state.addInputValue = "";

    this.update();
  }

  onAddInputChange(event) {
    this.state.addInputValue = event.target.value;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
