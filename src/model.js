import { isPlainObject, isString, isFunction } from './utils';

export class State {
  constructor({ name = '', options = {}, callback = function(){} }) {
    if (!isString(name) || !isPlainObject(options) || !isFunction(callback)) {
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
      this[stateName] = async function() {
        await state.callback(state.options);
        return this;
      }
    }
  }

  getCurrentState() {
    return this.curState;
  }
}
