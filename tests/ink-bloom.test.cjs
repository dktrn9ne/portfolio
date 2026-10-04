const {test}=require('node:test');
const assert=require('node:assert/strict');
const {density,noise}=require('../assets/ink-bloom.js');
test('ink fades away from its top edge and remains bounded',()=>{
  for(const x of [0,.25,.5,1])for(const field of [0,.5,1]){
    let previous=1;
    for(let y=0;y<=1;y+=.05){const value=density(x,y,field);assert.ok(value>=0&&value<=1);assert.ok(value<=previous);previous=value;}
    assert.equal(density(x,1,field),0);
  }
});
test('local cursor pull deepens the cloud without losing the edge anchor',()=>{
  assert.ok(density(.5,.4,.5,.2)>density(.5,.4,.5,0));
  assert.equal(density(.5,1,.5,.2),0);
});
test('noise is deterministic, continuous at cell boundaries and bounded',()=>{
  assert.equal(noise(2.3,4.2),noise(2.3,4.2));
  assert.ok(Math.abs(noise(3-.00001,2)-noise(3+.00001,2))<.001);
  for(let x=-3;x<3;x+=.13)assert.ok(noise(x,2.1)>=0&&noise(x,2.1)<=1);
});
