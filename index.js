function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      if (key === "checked") {
        element.checked = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
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
    this._domNode = null;
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const oldDomNode = this._domNode;
    const newDomNode = this.render();
    oldDomNode.replaceWith(newDomNode);
    this._domNode = newDomNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [
        {text: "Сделать домашку", done: false},
        {text: "Сделать практику", done: false},
        {text: "Пойти домой", done: false},
      ],
      addInputValue: "",
    }
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
    this.onToggleTask = this.onToggleTask.bind(this);
  }

  renderTodo(todo, index) {
    return createElement("li", {}, [
      createElement("input", {
        type: "checkbox",
        checked: todo.done
      }, [], { change: () => this.onToggleTask(index) }),
      createElement("label", todo.done ? { style: "color: gray;" } : {}, todo.text),
      createElement("button", {}, "🗑️", { click: () => this.onDeleteTask(index) }),
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
          value: this.state.addInputValue
        }, [], { input: this.onAddInputChange }),
        createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask }),
      ]),
      createElement("ul", { id: "todos" }, this.state.todos.map((todo, index) => this.renderTodo(todo, index))),
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

  onToggleTask(index) {
    this.state.todos[index].done = !this.state.todos[index].done;
    this.update();
  }

  onDeleteTask(index) {
    this.state.todos.splice(index, 1);
    this.update();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});