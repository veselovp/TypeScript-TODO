import { Project, ProjectStatus } from '../models/todo.js'

// State managment in singltone way
type Listner<T> = (items: T[]) => void

class State<T> {
  protected listner: Listner<T>[] = []

  addListener(listenerFn: Listner<T>) {
    this.listner.push(listenerFn)
  }
}

export class Statemanager extends State<Project> {
  private projects: Project[] = []
  private static instance: Statemanager

  private constructor() {
    super()
  }

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
}

// global statment
export const globalState = Statemanager.getInstance()
