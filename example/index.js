const { StateMachine } = require('../dist/bundle');

(function () {
  const door = new StateMachine({
    'open': {
      options: {
        shouldCheck: true
      },
      callback: (prevState, options, peopleName) => {
        console.log(prevState);
        console.log(options);
        if (peopleName === 'master') {
          console.log('master');
          return 'opened';
        } else if (options.shouldCheck && prevState !== 'closed') {
          console.log('query permission');
          return 'closed';
        }
        return 'opened';
      }
    },
    'opened': {
      callback: 'opened',
    },
    'close': {
      callback: (prevState, options, peopleName) => {
        console.log(peopleName);
        return 'closed';
      }
    },
    'closed': {
      callback: 'closed',
    },
  }, 'closed');

  console.log(door.getCurrentState());

  door.close('visitor')
    .then(() => door.open('visitor'))
    .then(() => door.open('master'))
    .then(() => door.open('master'))
    .then(() => console.log(door.getCurrentState()))
    .then(() => door.close('visitor'))
    .then(() => console.log(door.getCurrentState()));

})();
