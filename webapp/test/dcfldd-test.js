import test from 'ava';
const fixtures = require('./fixtures');
const Dcfldd = require('../lib/dcfldd');
const dd = new Dcfldd();

test('starts with empty arguments', t=> t.deepEqual(dd.getArgs(), []))

test('can set and change arguments', t=>{
  dd.set('if', '/dev/zero');
  t.deepEqual(dd.getArgs(), ['if=/dev/zero']);
  dd.set('if', 'changed');
  t.deepEqual(dd.getArgs(), ['if=changed']);
})

// this fake output was created with the following command
// dcfldd if=/dev/zero of=/tmp/zero bs=1M statusinterval=1 count=50 > test/fixtures/dcfldd-stderr.txt 2>&1
// which creates a file of size 52428800
test.cb('stderr stream is parsed to inform of blocks written', t=> {
  let expectation = Array(50).fill().map((_,i)=>i+1) //[1,2,3,4,5,...]
  let events = [];
  fixtures
    .createReadStream('dcfldd-stderr.txt')
    .pipe(dd.progressStreamParser())
    .on('data', ev => events.push(ev))
    .on('end', () => {
      t.deepEqual(events, expectation)
      t.end();
    })
})

test('can parse blocksize decently', t=>{
  dd.set('bs', '1M');
  t.is(dd.getBlockSize(), 1048576);
  dd.set('bs', '1K');
  t.is(dd.getBlockSize(), 1024);
  dd.set('bs', '1G');
  t.is(dd.getBlockSize(), 1024*1024*1024);
  dd.set('bs', '2G');
  t.is(dd.getBlockSize(), 2*1024*1024*1024);
  dd.set('bs', '650M');
  t.is(dd.getBlockSize(), 650*1024*1024);
})

test('can calculate progress as a percent', t=>{
  dd.set('bs', '1M');
  const totalSize = 52428800;
  const pp = dd.progressPercentParser(totalSize);
  t.is(pp(0), 0);
  t.is(pp(25), 0.5);
  t.is(pp(50), 1);
})
