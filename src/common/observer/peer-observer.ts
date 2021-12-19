/* eslint-disable no-unused-vars */
import type { Observer, SubscribeFunction } from '~/common/observer/observer'

export class PeerObserver implements Observer<MediaStream> {
  subscribeFuntions: SubscribeFunction<MediaStream>[] = []

  subscribe(fn: SubscribeFunction<MediaStream>): void {
    this.subscribeFuntions.push(fn)
  }
}
