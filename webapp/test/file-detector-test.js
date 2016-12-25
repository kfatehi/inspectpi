import test from 'ava';

const FileDetector = require('../lib/file-detector');
const parse = FileDetector.parseOutput;
const fixtures = require('./fixtures')

test('groks zip file containing a bootable image with 2 partitions', async t=> {
  const line = await fixtures.getLine(1).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, '2016-11-25-raspbian-jessie-lite.zip');
  t.is(type, 'zip');
  t.deepEqual(contents, [
    {
      boot: "mbr"
    },
    {
      type: 'partition',
      startsector: 8192,
      sectors: 129024
    },
    {
      type: 'partition',
      startsector: 137216,
      sectors: 2578432
    }
  ]);
})

test('groks txt file as being just a text file', async t=> {
  const line = await fixtures.getLine(2).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, 'foo.txt');
  t.is(type, 'text');
})

test('groks gzip file containing a bootable image with 2 partitions', async t=> {
  const line = await fixtures.getLine(3).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, 'motioneyeos-raspberrypi3-20161212.img.gz');
  t.is(type, 'gzip');
  t.deepEqual(contents, [
    {
      boot: "mbr"
    },
    {
      type: 'partition',
      startsector: 2048,
      sectors: 40960
    },
    {
      type: 'partition',
      startsector: 43008,
      sectors: 368640
    }
  ]);
})

test('groks another gzip file containing a bootable image with 2 partitions', async t=> {
  const line = await fixtures.getLine(4).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, 'retropie-4.1-rpi2_rpi3.img.gz');
  t.is(type, 'gzip');
  t.deepEqual(contents, [
    {
      boot: "mbr"
    },
    {
      type: 'partition',
      startsector: 8192,
      sectors: 116736
    },
    {
      type: 'partition',
      startsector: 124928,
      sectors: 3930112
    }
  ]);
})

test('groks an img file as being a vfat boot partition', async t=> {
  const line = await fixtures.getLine(5).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, 'sda1-1481798591066.img');
  t.is(type, 'fat16');
  t.deepEqual(contents, [
    {
      boot: 'mbr'
    }
  ])
})

test('groks an img file as being an ext4 partition', async t=> {
  const line = await fixtures.getLine(8).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, 'sda2-1481809040370.img');
  t.is(type, 'ext4');
  t.deepEqual(contents, []);
})

test('groks an img file containing a bootable image with 2 partitions', async t=> {
  const line = await fixtures.getLine(9).of('file-stdout.txt');
  const out = parse(line);
  const { name, contents, type } = out;
  t.is(name, '2016-11-25-raspbian-jessie-lite.img');
  t.is(type, 'bootable disk image');
  t.deepEqual(contents, [
    {
      boot: "mbr"
    },
    {
      type: 'partition',
      startsector: 8192,
      sectors: 129024
    },
    {
      type: 'partition',
      startsector: 137216,
      sectors: 2578432
    }
  ]);
})
