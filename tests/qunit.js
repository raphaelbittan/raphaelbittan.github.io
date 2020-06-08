/*
 * Jquery Qunit Test Suite
 * Please refer to https://qunitjs.com/cookbook/ for any further information.
 * 
 * ADD     "grunt-contrib-qunit": "^3.1.0", to devDependencies in package.json
 */

// MODULE 1
QUnit.module('Events');
QUnit.test('Test D.O.M', function(assert) {
  assert.expect(1); // Declare Assertion Number Expected
  
  var fixture = document.getElementById('qunit-fixture');
  assert.equal(fixture.innerText, 'this had better work.', 'Should be able to access the DOM.'); // Verify Expected Value
});
QUnit.test('Test KeyLogger A.P.I', function( assert ) {
  assert.expect(1); // Declare Assertion Number Expected

  // Define KeyLogger Function
  function KeyLogger(target) {
    if ( !(this instanceof KeyLogger) ) {
      return new KeyLogger( target );
    }
    this.target = target;
    this.log = [];
    var self = this;
    this.target.off( "keydown" ).on( "keydown", function( event ) {
      self.log.push( event.keyCode );
    });
  }
  
  var doc = $(document),
      keys = new KeyLogger(doc);
  
  doc.trigger($.Event('keydown', {keyCode: 9})); // Trigger Key Event
  assert.deepEqual(keys.log, [9], 'Correct key was logged'); // Verify Expected Behavior
});
QUnit.test('Test Click', function(assert) {
  assert.expect(1); // Declare Assertion Number Expected
 
  var $body = $('body');

  $body.on('click', function() {
    assert.ok(true, 'body was clicked!'); // Verify Expected Behavior
  });

  $body.trigger('click'); // Tigger Click Event
});

// // Custom Assertions
// QUnit.assert.contains = function(needle, haystack, message) {
//   var actual = haystack.indexOf(needle) > -1;
//   QUnit.push(actual, actual, needle, message);
// };
// // MODULE 2
// QUnit.module('Actions');
// QUnit.test('Test Retrieve Object/Array Keys', function(assert) {
//   assert.expect(4); // Declare Assertion Number Expected

//   var objectKeys = { a: 1, b: 2 };
//   assert.contains( 'a', objectKeys, 'Object keys' );
//   assert.contains( 'b', objectKeys, 'Object keys' );
//   var arrayKeys = [1, 2];
//   assert.contains( '1', arrayKeys, 'Array keys' );
//   assert.contains( '2', arrayKeys, 'Array keys' );
// });