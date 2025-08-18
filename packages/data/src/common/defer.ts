type OnFulfilled<T> = Parameters<Promise<T>['then']>

type OnRejected<T> = Parameters<Promise<T>['catch']>

type OnFinally<T> = Parameters<Promise<T>['finally']>

export class Deferred<T> {
  private _promise: Promise<T>
  private _resolve!: (value: T | PromiseLike<T>) => void
  private _reject!: (reason?: unknown) => void
  public status: 'pending' | 'resolved' | 'rejected' = 'pending'

  public constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  public reject(reason?: unknown): void {
    this.status = 'rejected'
    this._reject(reason)
  }

  public resolve(value: T): void {
    this.status = 'resolved'
    this._resolve(value)
  }

  public then(...args: OnFulfilled<T>) {
    return this._promise.then(...args)
  }

  public catch(...args: OnRejected<T>) {
    return this._promise.catch(...args)
  }

  public finally(...args: OnFinally<T>) {
    return this._promise.finally(...args)
  }
}

export const wait = async (ms: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
