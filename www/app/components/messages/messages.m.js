var MessagesM = angular.module('chat.messages', []);

// require('./dotdotdot.s.js')(MessagesM);
require('../chatBubble/chatBubble.d.js')(MessagesM);
require('./messages.d.js')(MessagesM);

module.exports = MessagesM;
