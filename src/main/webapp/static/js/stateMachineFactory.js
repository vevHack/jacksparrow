/* XXX DELETE ME */
var stateMachineFactory = function(actions, initialAction) {
    var action = actions[initialAction];
    return function(event) {
        action(event);
        event.preventDefault();
    };
};