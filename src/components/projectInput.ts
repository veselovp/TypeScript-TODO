import { globalState } from '../state/projectState.js'
import { Validatable, validate } from '../utils/validation.js'
import { Component } from './projectBaseComponent.js'

export class AddTodoList extends Component<HTMLDivElement, HTMLFormElement> {
  todoInput: HTMLInputElement
  quantity: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.configure()
    this.todoInput = this.form.querySelector('#title') as HTMLInputElement
    this.quantity = this.form.querySelector('#quantity') as HTMLInputElement
  }

  configure() {
    this.form.addEventListener('submit', this.action.bind(this))
  }

  renderContent() {}
  private clearInputs() {
    this.todoInput.value = ''
    this.quantity.value = ''
  }

  // function taking data from input
  private dataTodo(): [string, number] | void {
    const todo = this.todoInput.value
    const qua = this.quantity.value
    const td: Validatable = {
      value: todo,
      required: true,
      minLength: 5,
    }
    const quant: Validatable = {
      value: qua,
      required: true,
    }
    if (!validate(td) || !validate(quant)) {
      alert('please add todo')
      console.log(validate(td), validate(quant))
      return
    } else {
      return [todo, +qua]
    }
  }

  // Button
  private action(event: Event) {
    event.preventDefault()
    const todo = this.dataTodo()
    if (Array.isArray(todo)) {
      const [td, q] = todo
      this.clearInputs()
      globalState.addProject(td, q)
    }
  }
}
