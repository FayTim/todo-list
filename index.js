function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      if (key === "checked") {
        element.checked = attributes[key];
      } else if (key === "value") {
        element.value = attributes[key];
      } else if (key === "style" && typeof attributes[key] === "object") {
        Object.assign(element.style, attributes[key]);
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
      } else if (child instanceof Component) {
        element.appendChild(child.getDomNode());
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  } else if (children instanceof Component) {
    element.appendChild(children.getDomNode());
  }

  if (callbacks) {
    Object.keys(callbacks).forEach((eventName) => {
      element.addEventListener(eventName, callbacks[eventName]);
    });
  }

  return element;
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = {};
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

class AddTask extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
  }

  onInputChange(event) {
    this.state.text = event.target.value;
  }

  onAddTask() {
    const text = this.state.text.trim();

    if (!text) {
      return;
    }

    this.props.onAddTask(text);
    this.state.text = "";
    this.update();
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
          "input",
          {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
            value: this.state.text,
          },
          [],
          {
            input: this.onInputChange,
          }
      ),
      createElement(
          "button",
          { id: "add-btn" },
          "+",
          {
            click: this.onAddTask,
          }
      ),
    ]);
  }
}

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteClicked: false,
    };

    this.onToggle = this.onToggle.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onToggle() {
    this.props.onToggle(this.props.index);
  }

  onDelete() {
    if (!this.state.deleteClicked) {
      this.state.deleteClicked = true;
      this.update();
      return;
    }

    this.props.onDelete(this.props.index);
  }

  render() {
    const todo = this.props.todo;

    return createElement("li", {}, [
      createElement(
          "input",
          {
            type: "checkbox",
            checked: todo.done,
          },
          [],
          {
            change: this.onToggle,
          }
      ),
      createElement(
          "label",
          {
            style: {
              color: todo.done ? "gray" : "black",
            },
          },
          todo.text
      ),
      createElement(
          "button",
          {
            style: {
              backgroundColor: this.state.deleteClicked ? "red" : "",
            },
          },
          this.state.deleteClicked ? "Точно удалить?" : "🗑️",
          {
            click: this.onDelete,
          }
      ),
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();

    this.state = {
      todos: this.loadTodos(),
    };

    this.onAddTask = this.onAddTask.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
    this.onToggleTask = this.onToggleTask.bind(this);

    this.addTaskComponent = new AddTask({
      onAddTask: this.onAddTask,
    });
  }

  onAddTask(text) {
    this.state.todos.push({
      text,
      done: false,
    });

    this.saveTodos();
    this.update();
  }

  onToggleTask(index) {
    this.state.todos[index].done = !this.state.todos[index].done;

    this.saveTodos();
    this.update();
  }

  onDeleteTask(index) {
    this.state.todos.splice(index, 1);

    this.saveTodos();
    this.update();
  }

  renderTodo(todo, index) {
    return new Task({
      todo,
      index,
      onToggle: this.onToggleTask,
      onDelete: this.onDeleteTask,
    });
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      this.addTaskComponent,
      createElement(
          "ul",
          { id: "todos" },
          this.state.todos.map((todo, index) => this.renderTodo(todo, index))
      ),
    ]);
  }
  loadTodos() {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      return JSON.parse(savedTodos);
    }

    return [
      { text: "Сделать домашку", done: false },
      { text: "Сделать практику", done: false },
      { text: "Пойти домой", done: false },
    ];
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.state.todos));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});