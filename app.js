// حاسبة نقاط المفاضلة - برنامج فرص (حساب تقديري)
// كل الاحتسابات تُقيد بالحد الأعلى حسب الجدول.

const els = {
  category: document.getElementById('category'),
  experienceField: document.getElementById('experienceField'),
  experienceYears: document.getElementById('experienceYears'),

  specScore: document.getElementById('specScore'),
  pedScore: document.getElementById('pedScore'),
  pdPoints: document.getElementById('pdPoints'),
  perfAvg: document.getElementById('perfAvg'),
  absenceDays: document.getElementById('absenceDays'),
  rank: document.getElementById('rank'),
  volHours: document.getElementById('volHours'),
  applyYearPoints: document.getElementById('applyYearPoints'),
  serviceYears: document.getElementById('serviceYears'),
  serviceHint: document.getElementById('serviceHint'),

  totalScore: document.getElementById('totalScore'),
  breakdownBody: document.getElementById('breakdownBody'),
  resetBtn: document.getElementById('resetBtn'),
};

function clampNumber(value, min, max){
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
function toNumber(el){
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : 0;
}
function round2(x){
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function compute(){
  const category = els.category.value; // teacher | formations

  const spec = clampNumber(toNumber(els.specScore), 0, 100);
  const ped  = clampNumber(toNumber(els.pedScore), 0, 100);
  const perf = clampNumber(toNumber(els.perfAvg), 0, 5);

  const pd   = Math.max(0, toNumber(els.pdPoints));
  const vol  = Math.max(0, toNumber(els.volHours));
  const abs  = Math.max(0, Math.floor(toNumber(els.absenceDays)));
  const rank = clampNumber(parseInt(els.rank.value, 10), 0, 8);

  const applyPts = Math.max(0, Math.floor(toNumber(els.applyYearPoints)));
  const serviceY = Math.max(0, Math.floor(toNumber(els.serviceYears)));

  const expY = Math.max(0, Math.floor(toNumber(els.experienceYears)));

  // Limits
  const LIMITS = {
    spec: 35,
    ped: 25,
    pd: 25,
    perf: 30,
    discipline: 14,
    rank: 8,
    vol: 20,
    apply: 13,
    service: category === 'formations' ? 30 : 25,
    experience: 13
  };

  // Scores
  const specPts = (spec / 100) * LIMITS.spec;
  const pedPts  = (ped  / 100) * LIMITS.ped;
  const pdPts   = Math.min(pd, LIMITS.pd);
  const perfPts = (perf / 5) * LIMITS.perf;

  // الانضباط: 14 - أيام الغياب (بحد أدنى صفر)
  const disciplinePts = Math.max(0, LIMITS.discipline - abs);

  const rankPts  = clampNumber(rank, 0, LIMITS.rank);
  const volPts   = Math.min(vol, LIMITS.vol);
  const applyYearPts = Math.min(applyPts, LIMITS.apply);
  const servicePts   = Math.min(serviceY, LIMITS.service);

  let experiencePts = 0;
  if (category === 'formations'){
    experiencePts = Math.min(expY, LIMITS.experience);
  }

  const breakdown = [
    { name: 'اختبار التخصص للرخصة المهنية', points: specPts, max: LIMITS.spec },
    { name: 'الاختبار التربوي العام للرخصة المهنية', points: pedPts, max: LIMITS.ped },
    { name: 'نقاط التطوير المهني', points: pdPts, max: LIMITS.pd },
    { name: 'متوسط تقييم الأداء الوظيفي', points: perfPts, max: LIMITS.perf },
    { name: 'أيام الغياب بدون عذر (الانضباط)', points: disciplinePts, max: LIMITS.discipline },
    { name: 'رتبة الوظيفة التعليمية', points: rankPts, max: LIMITS.rank },
    { name: 'ساعات التطوع', points: volPts, max: LIMITS.vol },
    { name: 'سنة التقديم', points: applyYearPts, max: LIMITS.apply },
    { name: 'الخدمة الوظيفية', points: servicePts, max: LIMITS.service },
  ];

  if (category === 'formations'){
    breakdown.push({ name: 'الخبرة في نفس مجال الفرصة', points: experiencePts, max: LIMITS.experience });
  }

  const total = breakdown.reduce((sum, row) => sum + row.points, 0);

  render(total, breakdown, LIMITS);
}

function render(total, breakdown, LIMITS){
  els.totalScore.textContent = round2(total).toFixed(2);

  // service hint text update
  els.serviceHint.textContent = `نقطة لكل سنة — بحد أعلى ${LIMITS.service} نقطة.`;

  // breakdown table
  els.breakdownBody.innerHTML = '';
  for (const row of breakdown){
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = row.name;

    const tdPts = document.createElement('td');
    tdPts.textContent = round2(row.points).toFixed(2);

    const tdMax = document.createElement('td');
    tdMax.textContent = row.max.toString();

    tr.appendChild(tdName);
    tr.appendChild(tdPts);
    tr.appendChild(tdMax);
    els.breakdownBody.appendChild(tr);
  }
}

function onCategoryChange(){
  const category = els.category.value;
  const showExp = category === 'formations';
  els.experienceField.style.display = showExp ? '' : 'none';
  if (!showExp){
    els.experienceYears.value = '0';
  }
  compute();
}

function resetAll(){
  const defaults = {
    category: 'teacher',
    experienceYears: '0',
    specScore: '0',
    pedScore: '0',
    perfAvg: '0',
    absenceDays: '0',
    pdPoints: '0',
    volHours: '0',
    rank: '4',
    serviceYears: '0',
    applyYearPoints: '0',
  };
  els.category.value = defaults.category;
  els.experienceYears.value = defaults.experienceYears;
  els.specScore.value = defaults.specScore;
  els.pedScore.value = defaults.pedScore;
  els.perfAvg.value = defaults.perfAvg;
  els.absenceDays.value = defaults.absenceDays;
  els.pdPoints.value = defaults.pdPoints;
  els.volHours.value = defaults.volHours;
  els.rank.value = defaults.rank;
  els.serviceYears.value = defaults.serviceYears;
  els.applyYearPoints.value = defaults.applyYearPoints;

  onCategoryChange();
}

// Bind
document.addEventListener('input', (e) => {
  const ids = new Set([
    'specScore','pedScore','perfAvg','absenceDays','pdPoints','volHours',
    'serviceYears','applyYearPoints','experienceYears','rank'
  ]);
  if (e.target && ids.has(e.target.id)) compute();
});

els.category.addEventListener('change', onCategoryChange);
els.resetBtn.addEventListener('click', resetAll);

// init
onCategoryChange();
compute();
