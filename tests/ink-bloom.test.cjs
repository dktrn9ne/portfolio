const {test}=require('node:test');
const assert=require('node:assert/strict');
const {density,noise,spring,cursorField,retraction}=require('../assets/ink-bloom.js');
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
test('edge follows promptly while the plume end trails behind',()=>{
  const near={x:.2,y:0,strength:0},trail={...near},target={x:.8,y:.3,strength:1};
  for(let i=0;i<10;i++){spring(near,target,.01,19,.9);spring(trail,near,.01,8,.65)}
  assert.ok(near.x>trail.x+.1);assert.ok(near.y>trail.y);assert.ok(near.strength>trail.strength);
});
test('damped plume settles with a small swing and no perpetual drift',()=>{
  const state={x:.2,y:0,strength:0},target={x:.8,y:.2,strength:1};let peak=0;
  for(let i=0;i<400;i++){spring(state,target,.01,8,.65);peak=Math.max(peak,state.x)}
  assert.ok(peak>.8&&peak<.88);assert.ok(Math.abs(state.x-.8)<.001);assert.ok(Math.abs(state.vx)<.001);
});
test('local influence tilts from current edge position to trailing lower plume',()=>{
  const near={x:.8,y:.3,strength:1},trail={x:.3,y:.2,strength:1};
  assert.ok(cursorField(.8,0,near,trail).local>.99);assert.ok(cursorField(.3,0,near,trail).local<.001);
  assert.ok(cursorField(.3,.42,near,trail).local>.99);assert.ok(cursorField(.8,.42,near,trail).local<.001);
});
test('scroll retraction is monotonic, bounded and completes at 260px',()=>{
  assert.equal(retraction(0),0);assert.equal(retraction(260),1);assert.equal(retraction(500),1);let previous=0;
  for(let y=0;y<=260;y+=10){assert.ok(retraction(y)>=previous&&retraction(y)<=1);previous=retraction(y)}
});
