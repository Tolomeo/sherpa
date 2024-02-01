export class Deferred<T = unknown> {
  private _promise: Promise<T>
  private _resolve!: (value: T | PromiseLike<T>) => void
  private _reject!: (reason?: unknown) => void
  public status: 'pending' | 'resolved' | 'rejected' = 'pending'
  public promise: Promise<T>

  public constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    this.promise = this._promise
  }

  public reject(reason?: unknown): void {
    this.status = 'rejected'
    this._reject(reason)
  }

  public resolve(value: T): void {
    this.status = 'resolved'
    this._resolve(value)
  }

  public then(onfulfilled: (value: T) => T | PromiseLike<T>) {
    this.promise = this.promise.then(onfulfilled)
    return this
  }

  public catch(onrejected: (reason: unknown) => T | PromiseLike<T> | never) {
    this.promise = this.promise.catch(onrejected)
    return this
  }

  public finally(onfinally: (() => void) | undefined | null) {
    this.promise = this.promise.finally(onfinally)
    return this
  }
}
