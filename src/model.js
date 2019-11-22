import { isPlainObject, isString, isFunction } from './utils';

export class State {
  constructor({ options = {}, callback }) {
    if (!isPlainObject(options) || !(isFunction(callback) || isString(callback))) {
      throw new Error('Invalid type for State Initialization');
    }
    this.options = options;
    this.callback = callback;
  }
}

export class StateMachine {
  constructor(flows = {}, initStateName = '') {
    if (!isPlainObject(flows) || !isString(initStateName)) {
      throw new Error('Invalid type for StateMachine Initialization');
    }

    const stateNames = Object.keys(flows);

    this.flows = [];
    this.curState = stateNames.includes(initStateName) ? initStateName : '';

    for (const stateName of stateNames) {
      const flow = flows[stateName];
      if (!isPlainObject(flow)) {
        throw new Error('Invalid type for State Initialization');
      }
      const state = new State(flow);
      const that = this;
      this[stateName] = async (...args) => {
        if (isFunction(state.callback)) {
          const result = await state.callback(that.curState, state.options, ...args);
          that.curState = typeof result === 'string' && stateNames.includes(result) ? result : stateName;
        }
        return that;
      }
    }
  }

  getCurrentState() {
    return this.curState;
  }

  next(...args) {
    if (!this.curState) {
      return this;
    }
    return this[this.curState](...args);
  }
}

export default {
  StateMachine,
  State,
}
