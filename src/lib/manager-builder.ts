'use strict';

interface Ctor {
  new (): any;
}

export class ManagerBuilder {
  protected _ctor: Ctor;

  constructor() {
    this._ctor = null;
  }

  useImpl(ctor: Ctor): ManagerBuilder {
    this._ctor = ctor;
    return this;
  }

  build<T>(): T {
    if (!this._ctor) {
      console.warn(`[ManagerBuilder] ctor is null`);
      return null;
    }
    return new this._ctor();
  }
}
