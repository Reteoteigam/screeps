/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('Horst');
 * mod.thing == 'a thing'; // true
 */

const funcs = {
    foo() { console.log('foo') }, 
    bar() { console.log('bar') },
    baz() { foo(); bar() }
}

export default funcs