/* eslint-disable no-unused-vars */
export type SubscribeFunction<T> = (data: T) => void

export interface Observer<T> {
  subscribeFuntions: SubscribeFunction<T>[]
  subscribe(fn: SubscribeFunction<T>): void
}

export interface Subject<T> {
  attach(observer: Observer<T>): void

  detach(observer: Observer<T>): void

  notify(): void
}
