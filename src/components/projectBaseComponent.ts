export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  template: HTMLTemplateElement
  hostElem: T
  form: U
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.template = document.getElementById(templateId) as HTMLTemplateElement
    this.hostElem = document.getElementById(hostElementId) as T
    const elelemnt = document.importNode(this.template.content, true)
    this.form = elelemnt.firstElementChild as U
    if (newElementId) {
      this.form.id = newElementId
    }
    this.render(insertAtStart)
  }
  private render(insertAtBegining: boolean) {
    this.hostElem.insertAdjacentElement(
      insertAtBegining ? 'afterbegin' : 'beforebegin',
      this.form
    )
  }
  abstract configure?(): void
  abstract renderContent(): void
}
