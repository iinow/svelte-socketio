/* eslint-disable no-unused-vars */
import type { Observer, Subject } from '~/common/observer/observer'

export class PeerSubject implements Subject<MediaStream> {
  private observers: Observer<MediaStream>[] = []

  private data: MediaStream

  attach(observer: Observer<MediaStream>): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return
    }

    this.observers.push(observer)
  }

  detach(observer: Observer<MediaStream>): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return
    }

    this.observers.splice(observerIndex, 1)
  }

  notify(): void {
    this.observers.forEach((observer) =>
      observer.subscribeFuntions.forEach((fn) => fn(this.data))
    )
  }

  setData(data: MediaStream) {
    if (this.data) {
      return
    }
    this.data = data
    this.notify()
  }
}
