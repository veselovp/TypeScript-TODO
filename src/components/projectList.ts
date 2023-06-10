import { Project, ProjectStatus } from '../models/todo.js'
import { globalState } from '../state/projectState.js'
import { Component } from './projectBaseComponent.js'
import { ItemTodo } from './projectItem.js'

// Rendering todo list component
export class ListTodo extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[]

  // @@@@@@@RENDERING PROJECTS LIST
  constructor(private type: 'active' | 'finish') {
    super('project-list', 'app', false, `${type}-project`)
    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }
  configure() {
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
  }

  renderContent() {
    const listId = `${this.type}-projects-list`

    this.form.querySelector('h2')!.textContent = `${this.type}-projects`
    this.form.querySelector('ul')!.id = listId
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement
    listEl.innerHTML = ''
    for (const prjItem of this.assignedProjects) {
      new ItemTodo(
        this.form.querySelector('#active-projects-list')!.id,
        prjItem
      )
    }
  }
}
