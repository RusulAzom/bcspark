// Sanity check: verify district label anchors land in geographically
// plausible positions relative to each other (north up, east right).
// viewBox is 1000 x 1414, so x grows east, y grows south.
const d = require('../src/data/bdDistricts.json');

const at = (name) => {
  const x = d.districts.find((v) => v.name === name);
  if (!x) return { err: `${name} MISSING` };
  return x;
};

// viewBox is 1000 x 1414: x grows east, y grows SOUTH.
let failures = 0;
function check(label, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`);
  if (!cond) failures++;
}

console.log('--- anchor positions (x east, y south) ---');
for (const name of ['Panchagarh', 'Rangpur', 'Rajshahi', 'Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Barishahr', "Cox's Bazar", 'Bandarban']) {
  const x = at(name);
  if (x.err) console.log(x.err);
  else console.log(`${x.name.padEnd(16)} x=${String(x.labelX).padStart(6)} y=${String(x.labelY).padStart(6)}`);
}

console.log('\n--- assertions ---');
const p = at('Panchagarh');
const s = at('Sylhet');
const c = at("Cox's Bazar");
const dhaka = at('Dhaka');

// Northernmost anchor must have a SMALL y; southernmost a LARGE y.
const minY = Math.min(...d.districts.map((v) => v.labelY));
const maxY = Math.max(...d.districts.map((v) => v.labelY));
const north = d.districts.filter((v) => v.labelY === minY).map((v) => v.name);
const south = d.districts.filter((v) => v.labelY === maxY).map((v) => v.name);
console.log('northernmost anchor:', north.join(', '));
console.log('southernmost anchor:', south.join(', '));

check('northernmost anchor is a northern district (Panchagarh/Rangpur/Thakurgaon/Nilphamari/Lalmonirhat)',
  north.some((n) => ['Panchagarh', 'Rangpur', 'Thakurgaon', 'Nilphamari', 'Lalmonirhat', 'Kurigram', 'Dinajpur', 'Gaibandha', 'Joypurhat'].includes(n)));
check('southernmost anchor is a southern coastal district',
  south.some((n) => ["Cox's Bazar", 'Barishahr', 'Patuakhali', 'Bhola', 'Bagerhat', 'Jhalokati', 'Pirojpur', 'Satkhira', 'Khulna', 'Narail'].includes(n)));
check('Sylhet is north of Dhaka', s.labelY < dhaka.labelY);
check('Sylhet is east of Dhaka', s.labelX > dhaka.labelX);
check("Cox's Bazar is east of Dhaka", c.labelX > dhaka.labelX);
check("Cox's Bazar is south of Dhaka", c.labelY > dhaka.labelY);
check('Panchagarh is north of Dhaka', p.labelY < dhaka.labelY);
check('all anchors inside viewBox', d.districts.every((v) => v.labelX >= 0 && v.labelX <= 1000 && v.labelY >= 0 && v.labelY <= 1414));
check('64 districts', d.districts.length === 64);
check('no NaN in any path', d.districts.every((v) => !/NaN|undefined|Infinity/.test(v.d)));

console.log(failures ? `\n${failures} CHECK(S) FAILED` : '\nALL CHECKS PASSED');
process.exitCode = failures ? 1 : 0;