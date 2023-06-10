import { Project } from '../models/todo.js'
import { Component } from './projectBaseComponent.js'

// Rendering todo item component
export class ItemTodo extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project

  get person() {
    if (this.project.quantity === 1) {
      return '1 left'
    } else {
      return `${this.project.quantity}`
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)
    this.project = project
    this.configure()
    this.renderContent()
  }
  configure() {}
  renderContent() {
    this.form.querySelector('p')!.textContent = this.project.description
    this.form.querySelector('h2')!.textContent = this.person + 'left'
    this.form.querySelector('h3')!.textContent = this.project.status.toString()
  }
}
