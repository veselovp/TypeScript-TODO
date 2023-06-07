// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    },
  }
  return adjDescriptor
}

// ------------
// object
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public description: string,
    public quantity: number,
    public status: ProjectStatus
  ) {}
}
// State managment in singltone way
type Listner = (items: Project[]) => void

class Statemanager {
  private listner: Listner[] = []
  private projects: Project[] = []
  private static instance: Statemanager

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Statemanager()
    return this.instance
  }

  // creating object
  addProject(description: string, quantity: number) {
    const newProject = new Project(
      Math.random().toString(),
      description,
      quantity,
      ProjectStatus.Active
    )

    this.projects.push(newProject)
    for (const listenerFn of this.listner) {
      listenerFn(this.projects.slice())
    }
  }

  addListener(listenerFn: Listner) {
    this.listner.push(listenerFn)
  }
}

// global statment
const globalState = Statemanager.getInstance()

// validation for numbers in user input

interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

function validate(validatableInput: Validatable) {
  let isValid = true
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }
  return isValid
}

// Rendering todo list at bottom
class ListTodo {
  template: HTMLTemplateElement
  hostElem: HTMLDivElement
  form: HTMLElement
  assignedProjects: Project[]

  // @@@@@@@RENDERING PROJECTS LIST
  constructor(private type: 'active' | 'finish') {
    this.hostElem = document.getElementById('app') as HTMLDivElement
    this.template = document.getElementById(
      'project-list'
    ) as HTMLTemplateElement
    this.assignedProjects = []
    const elelemnt = document.importNode(this.template.content, true)
    this.form = elelemnt.firstElementChild as HTMLElement
    this.form.id = `${this.type}-project`

    globalState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active
        }
        return prj.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
    this.render()
    this.renderContent()
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement
    listEl.innerHTML = ''
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li')
      listItem.textContent = prjItem.description
      listEl.appendChild(listItem)
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`

    this.form.querySelector(
      'h2'
    )!.textContent = `${this.type}-projects`
    this.form.querySelector('ul')!.id = listId
  }

  private render() {
    this.hostElem.insertAdjacentElement('beforeend', this.form)
  }
}

// Rendering todo input
class AddTodoList {
  template: HTMLTemplateElement
  hostElem: HTMLDivElement
  form: HTMLFormElement

  todoInput: HTMLInputElement
  quantity: HTMLInputElement

  constructor() {
    this.template = document.getElementById(
      'project-input'
    ) as HTMLTemplateElement
    this.hostElem = document.getElementById('app') as HTMLDivElement
    const elelemnt = document.importNode(this.template.content, true)
    this.form = elelemnt.firstElementChild as HTMLFormElement

    this.todoInput = this.form.querySelector('#title') as HTMLInputElement
    this.quantity = this.form.querySelector('#quantity') as HTMLInputElement

    this.form.id = 'user-input'

    this.add()
    this.render()
  }

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
      console.log(td, q)
    }
  }

  private add() {
    this.form.addEventListener('submit', this.action.bind(this))
  }

  private render() {
    this.hostElem.insertAdjacentElement('afterbegin', this.form)
  }
}

const render = new AddTodoList()
const renderList = new ListTodo('active')
const renderList2 = new ListTodo('finish')
