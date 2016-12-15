import test from 'ava';

const Dcfldd = require('../lib/dcfldd');
const dd = new Dcfldd();

test('starts with empty arguments', t=> t.deepEqual(dd.getArgs(), []))

test('can set and change arguments', t=>{
  dd.set('if', '/dev/zero');
  t.deepEqual(dd.getArgs(), ['if=/dev/zero']);
  dd.set('if', 'changed');
  t.deepEqual(dd.getArgs(), ['if=changed']);
})

const fixtures = require('./fixtures');
const parser = require('../lib/dcfldd-progress-stream');

// this fake output was created with the following command
// dcfldd if=/dev/zero of=/tmp/zero bs=1M statusinterval=1 count=50 > test/fixtures/dcfldd-stderr.txt 2>&1
// which creates a file of size 52428800
test.cb('stderr stream is parsed to inform of blocks written', t=> {
  let expectation = Array(50).fill().map((_,i)=>i+1) //[1,2,3,4,5,...]
  let events = [];
  fixtures
    .createReadStream('dcfldd-stderr.txt')
    .pipe(parser())
    .on('data', ev => events.push(ev))
    .on('end', () => {
      t.deepEqual(events, expectation)
      t.end();
    })
})
