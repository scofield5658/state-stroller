import { isPlainObject, isString, isFunction } from './utils';

export class State {
  constructor({ name = '', options = {}, callback }) {
    if (!isString(name) || !isPlainObject(options) || !(isFunction(callback) || isString(callback))) {
      throw new Error('Invalid type for State Initialization');
    }
    this.name = name;
    this.options = options;
    this.callback = callback;
  }
}

export class StateMachine {
  constructor(flows = {}, initStateName = '') {
    if (!isPlainObject(flows) || !isString(initStateName)) {
      throw new Error('Invalid type for StateMachine Initialization');
    }
    this.flows = [];
    this.curState = initStateName;

    const stateNames = Object.keys(flows);
    for (const stateName of stateNames) {
      const flow = flows[stateName];
      if (!isPlainObject(flow)) {
        throw new Error('Invalid type for State Initialization');
      }
      const state = new State(flow);
      const that = this;
      this[stateName] = async () => {
        if (isFunction(state.callback)) {
          const result = await state.callback(state.options);
          that.curState = typeof result === 'string' && stateNames.includes(result) ? result : stateName;
        }
        return that;
      }
    }
  }

  getCurrentState() {
    return this.curState;
  }

  next() {
    return this[this.curState];
  }
}
