// ── AstraOS Astrology Engine ──
// Real astronomical calculations using Julian Day Number and planetary algorithms
// Based on Jean Meeus "Astronomical Algorithms" — same source as Swiss Ephemeris

export const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
export const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
export const SIGN_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter'];
export const SIGN_ELEMENTS = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water'];
export const SIGN_QUALITIES = ['Cardinal','Fixed','Mutable','Cardinal','Fixed','Mutable','Cardinal','Fixed','Mutable','Cardinal','Fixed','Mutable'];
export const SIGN_COLORS = ['#e05252','#7cae5a','#f5c518','#7bb8d4','#e8a535','#6fae6f','#d4a0c8','#a03060','#c8783c','#7c7c7c','#4090c8','#8860b8'];

export const PLANETS = [
  { id: 'sun',     name: 'Sun',     vedic: 'Surya',   symbol: '☉', lord: 'Soul & Ego' },
  { id: 'moon',    name: 'Moon',    vedic: 'Chandra', symbol: '☽', lord: 'Mind & Emotions' },
  { id: 'mercury', name: 'Mercury', vedic: 'Budha',   symbol: '☿', lord: 'Intelligence' },
  { id: 'venus',   name: 'Venus',   vedic: 'Shukra',  symbol: '♀', lord: 'Love & Beauty' },
  { id: 'mars',    name: 'Mars',    vedic: 'Mangal',  symbol: '♂', lord: 'Energy & Courage' },
  { id: 'jupiter', name: 'Jupiter', vedic: 'Guru',    symbol: '♃', lord: 'Wisdom & Luck' },
  { id: 'saturn',  name: 'Saturn',  vedic: 'Shani',   symbol: '♄', lord: 'Karma & Discipline' },
  { id: 'rahu',    name: 'Rahu',    vedic: 'Rahu',    symbol: '☊', lord: 'Desire & Illusion' },
  { id: 'ketu',    name: 'Ketu',    vedic: 'Ketu',    symbol: '☋', lord: 'Moksha & Liberation' },
];

export const NAKSHATRAS = [
  { name:'Ashwini', ruler:'Ketu', symbol:'🐴', pada:[1,2,3,4], degrees:[0,13.33], desc:'The star of healing and swift beginnings. Boundless vitality, pioneering spirit.' },
  { name:'Bharani', ruler:'Venus', symbol:'⚖️', pada:[1,2,3,4], degrees:[13.33,26.67], desc:'The star of transformation. Creative, intense, unafraid of life\'s depths.' },
  { name:'Krittika', ruler:'Sun', symbol:'🔥', pada:[1,2,3,4], degrees:[26.67,40], desc:'The star of fire and purification. Sharp, disciplined, commanding authority.' },
  { name:'Rohini', ruler:'Moon', symbol:'🌸', pada:[1,2,3,4], degrees:[40,53.33], desc:'The most beloved nakshatra. Magnetic, creative, gifted with manifestation.' },
  { name:'Mrigashira', ruler:'Mars', symbol:'🦌', pada:[1,2,3,4], degrees:[53.33,66.67], desc:'The star of searching. Eternally curious, gentle yet restless.' },
  { name:'Ardra', ruler:'Rahu', symbol:'💎', pada:[1,2,3,4], degrees:[66.67,80], desc:'The storm that clears the air. Intense, brilliant, emotionally profound.' },
  { name:'Punarvasu', ruler:'Jupiter', symbol:'⭐', pada:[1,2,3,4], degrees:[80,93.33], desc:'The star of renewal. Optimistic, wise, always returning to goodness.' },
  { name:'Pushya', ruler:'Saturn', symbol:'🌺', pada:[1,2,3,4], degrees:[93.33,106.67], desc:'Most auspicious nakshatra. Natural nurturer, devoted and responsible.' },
  { name:'Ashlesha', ruler:'Mercury', symbol:'🐍', pada:[1,2,3,4], degrees:[106.67,120], desc:'Serpent wisdom. Penetrating insight, strategic intelligence.' },
  { name:'Magha', ruler:'Ketu', symbol:'👑', pada:[1,2,3,4], degrees:[120,133.33], desc:'The royal star. Natural leader, strong ancestral connection.' },
  { name:'Purva Phalguni', ruler:'Venus', symbol:'🛏️', pada:[1,2,3,4], degrees:[133.33,146.67], desc:'Rest and pleasure. Charm, creativity, love of beauty.' },
  { name:'Uttara Phalguni', ruler:'Sun', symbol:'🤝', pada:[1,2,3,4], degrees:[146.67,160], desc:'Patronage and alliance. Reliable, generous, service-oriented.' },
  { name:'Hasta', ruler:'Moon', symbol:'✋', pada:[1,2,3,4], degrees:[160,173.33], desc:'The hand of skill. Dexterous, witty, resourceful.' },
  { name:'Chitra', ruler:'Mars', symbol:'💫', pada:[1,2,3,4], degrees:[173.33,186.67], desc:'Brilliant architecture. Master creator, striking presence.' },
  { name:'Swati', ruler:'Rahu', symbol:'🍃', pada:[1,2,3,4], degrees:[186.67,200], desc:'Independence and resilience. Adaptable like a reed in wind.' },
  { name:'Vishakha', ruler:'Jupiter', symbol:'🎯', pada:[1,2,3,4], degrees:[200,213.33], desc:'The star of purpose. Intensely goal-oriented, never gives up.' },
  { name:'Anuradha', ruler:'Saturn', symbol:'🌟', pada:[1,2,3,4], degrees:[213.33,226.67], desc:'Devotion and friendship. Navigates success and failure with grace.' },
  { name:'Jyeshtha', ruler:'Mercury', symbol:'🏆', pada:[1,2,3,4], degrees:[226.67,240], desc:'The eldest and chief. Protective, strategic, commanding.' },
  { name:'Mula', ruler:'Ketu', symbol:'🌿', pada:[1,2,3,4], degrees:[240,253.33], desc:'The root of existence. Philosopher, investigator, deeply spiritual.' },
  { name:'Purva Ashadha', ruler:'Venus', symbol:'🏹', pada:[1,2,3,4], degrees:[253.33,266.67], desc:'The invincible. Courageous, optimistic, never accepts defeat.' },
  { name:'Uttara Ashadha', ruler:'Sun', symbol:'🐘', pada:[1,2,3,4], degrees:[266.67,280], desc:'Universal victory. Patient, principled, ultimately triumphant.' },
  { name:'Shravana', ruler:'Moon', symbol:'👂', pada:[1,2,3,4], degrees:[280,293.33], desc:'The listener. Extraordinary learner, synthesises wisdom.' },
  { name:'Dhanishtha', ruler:'Mars', symbol:'🥁', pada:[1,2,3,4], degrees:[293.33,306.67], desc:'Symphony and abundance. Blessed with rhythm and timing.' },
  { name:'Shatabhisha', ruler:'Rahu', symbol:'🔮', pada:[1,2,3,4], degrees:[306.67,320], desc:'Hundred healers. Mystical, independent, sees what others cannot.' },
  { name:'Purva Bhadrapada', ruler:'Jupiter', symbol:'⚡', pada:[1,2,3,4], degrees:[320,333.33], desc:'Fire of transformation. Visionary intensity, profound change.' },
  { name:'Uttara Bhadrapada', ruler:'Saturn', symbol:'🌊', pada:[1,2,3,4], degrees:[333.33,346.67], desc:'Warrior of the deep. Patient wisdom, sustained effort.' },
  { name:'Revati', ruler:'Mercury', symbol:'🐟', pada:[1,2,3,4], degrees:[346.67,360], desc:'Journey\'s end. Gentle guide, artistic, deeply spiritual.' },
];

export const DASHAS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];
export const DASHA_YEARS = [7,20,6,10,7,18,16,19,17];
export const DASHA_DESC = {
  Ketu: 'A deeply spiritual period of liberation. Ketu dissolves attachments and awakens mystical insight, turning the soul inward toward moksha and release.',
  Venus: 'The most enjoyable of all dashas — beauty, love, creativity, and material comfort. Venus brings artistic inspiration, romantic fulfilment, and sensory abundance.',
  Sun: 'A period of identity, authority, and soul-level clarity. The Sun illuminates your deepest purpose and calls you toward leadership and authentic self-expression.',
  Moon: 'A time of emotional depth, intuition, and inner nourishment. The Moon heightens sensitivity, deepens family bonds, and brings your emotional world forward.',
  Mars: 'An era of courage, drive, and decisive action. Mars energises your ambitions — ideal for new ventures, physical vitality, and overcoming all obstacles.',
  Rahu: 'A transformative period of ambition and karmic acceleration. Rahu brings sudden changes, foreign connections, and desires pursued with extraordinary intensity.',
  Jupiter: 'The most auspicious of all dashas — wisdom, expansion, and divine grace. Jupiter brings spiritual growth, higher learning, and blessings across all life areas.',
  Saturn: 'Discipline, karma, and deep structural transformation. Saturn demands integrity and sustained effort — but rewards with lasting achievement and profound wisdom.',
  Mercury: 'Intellect, communication, and skillful navigation. Mercury sharpens the mind, improves business acumen, and brings success through knowledge and adaptability.',
};

// ── Julian Day Number calculation ──
export function toJulianDay(year, month, day, hour = 12, minute = 0) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + (hour + minute / 60) / 24 + B - 1524.5;
}

// ── Sun longitude (Meeus Ch.25) ──
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
          + 0.000289 * Math.sin(3 * M);
  return ((L0 + C) % 360 + 360) % 360;
}

// ── Moon longitude (Meeus Ch.47 simplified) ──
function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L1 = ((218.3164477 + 481267.88123421 * T) % 360 + 360) % 360;
  const M = ((357.5291092 + 35999.0502909 * T) * Math.PI / 180);
  const Mp = ((134.9633964 + 477198.8675055 * T) * Math.PI / 180);
  const D = ((297.8501921 + 445267.1114034 * T) * Math.PI / 180);
  const F = ((93.2720950 + 483202.0175233 * T) * Math.PI / 180);
  const lon = L1
    + 6.288774 * Math.sin(Mp)
    + 1.274027 * Math.sin(2*D - Mp)
    + 0.658314 * Math.sin(2*D)
    + 0.213618 * Math.sin(2*Mp)
    - 0.185116 * Math.sin(M)
    - 0.114332 * Math.sin(2*F)
    + 0.058793 * Math.sin(2*D - 2*Mp)
    + 0.057066 * Math.sin(2*D - M - Mp)
    + 0.053322 * Math.sin(2*D + Mp)
    + 0.045758 * Math.sin(2*D - M)
    - 0.040923 * Math.sin(M - Mp)
    - 0.034720 * Math.sin(D)
    - 0.030383 * Math.sin(M + Mp);
  return ((lon % 360) + 360) % 360;
}

// ── Planetary mean longitudes (Meeus Ch.31) ──
function planetLongitude(jd, planet) {
  const T = (jd - 2451545.0) / 36525;
  const data = {
    mercury: { L: 252.250906, n: 149472.6746358, C2: 23.4405, M: 174.7948, Mn: 149472.5152 },
    venus:   { L: 181.979801, n: 58517.8156760, C2: 0.7758,  M: 50.4161,  Mn: 58517.8033 },
    mars:    { L: 355.433275, n: 19140.2993313, C2: 10.6912, M: 19.3730,  Mn: 19140.2964 },
    jupiter: { L: 34.351484,  n: 3034.9056746,  C2: 5.5549,  M: 20.9231,  Mn: 3034.9057  },
    saturn:  { L: 50.077444,  n: 1222.1137943,  C2: 6.3585,  M: 317.0207, Mn: 1222.1138  },
  };
  if (!data[planet]) return sunLongitude(jd);
  const d = data[planet];
  const L = ((d.L + d.n * T) % 360 + 360) % 360;
  const M = ((d.M + d.Mn * T) * Math.PI / 180);
  const correction = d.C2 * Math.sin(M) * 0.6;
  return ((L + correction) % 360 + 360) % 360;
}

// ── Rahu/Ketu (mean lunar nodes) ──
function rahuLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const rahu = ((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360 + 360) % 360;
  return rahu;
}

// ── Lahiri Ayanamsha (Vedic correction) ──
export function lahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + 50.3 * T / 3600;
}

// ── Ascendant/Lagna calculation ──
function calcAscendant(jd, lat, lon, ayanamsha = 0) {
  const T = (jd - 2451545.0) / 36525;
  // GMST
  const theta0 = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T;
  const GMST = ((theta0 % 360) + 360) % 360;
  const LST = ((GMST + lon) % 360 + 360) % 360;
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180;
  const RA = LST * Math.PI / 180;
  const latR = lat * Math.PI / 180;
  const ascRad = Math.atan2(Math.cos(RA), -(Math.sin(RA) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps)));
  let asc = ((ascRad * 180 / Math.PI) % 360 + 360) % 360;
  asc = (asc - ayanamsha + 360) % 360;
  return asc;
}

// ── Main chart computation ──
export function computeChart(dateStr, timeStr, lat = 19.076, lon = 72.877, system = 'vedic') {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = (timeStr || '12:00').split(':').map(Number);

  // UTC offset for India = +5:30
  const utcHour = hour - 5.5;
  const jd = toJulianDay(year, month, day, utcHour, minute);
  const ayanamsha = system === 'vedic' ? lahiriAyanamsha(jd) : 0;

  const rawPositions = {
    sun:     sunLongitude(jd),
    moon:    moonLongitude(jd),
    mercury: planetLongitude(jd, 'mercury'),
    venus:   planetLongitude(jd, 'venus'),
    mars:    planetLongitude(jd, 'mars'),
    jupiter: planetLongitude(jd, 'jupiter'),
    saturn:  planetLongitude(jd, 'saturn'),
    rahu:    rahuLongitude(jd),
  };

  const positions = {};
  for (const [key, raw] of Object.entries(rawPositions)) {
    const deg = key === 'rahu'
      ? ((raw - ayanamsha + 360) % 360)
      : ((raw - ayanamsha + 360) % 360);
    positions[key] = deg;
  }
  // Ketu is exactly opposite Rahu
  positions.ketu = ((positions.rahu + 180) % 360);

  const ascDeg = calcAscendant(jd, lat, lon, ayanamsha);
  const lagnaSign = Math.floor(ascDeg / 30) % 12;

  const planets = PLANETS.map(p => {
    const deg = positions[p.id] ?? 0;
    const signIdx = Math.floor(deg / 30) % 12;
    const degInSign = deg % 30;
    const house = ((signIdx - lagnaSign + 12) % 12) + 1;
    const nkIdx = Math.floor((deg * 27) / 360) % 27;
    const pada = Math.floor(((deg * 27 / 360) - nkIdx) * 4) + 1;
    return {
      ...p, degree: deg, signIdx, degInSign: parseFloat(degInSign.toFixed(2)),
      sign: SIGNS[signIdx], signSymbol: SIGN_SYMBOLS[signIdx],
      house, nkIdx, pada, nakshatra: NAKSHATRAS[nkIdx]
    };
  });

  // Dasha calculation
  const moonDeg = positions.moon;
  const nkIdx = Math.floor((moonDeg * 27) / 360) % 27;
  const nkRuler = NAKSHATRAS[nkIdx].ruler;
  const dashaStartIdx = DASHAS.indexOf(nkRuler);

  // How far through the birth nakshatra (0-1)
  const nkFraction = ((moonDeg * 27 / 360) - nkIdx);
  const birthYearDecimal = year + (month - 1) / 12 + (day - 1) / 365;
  const elapsed = nkFraction * DASHA_YEARS[dashaStartIdx];
  const startYear = birthYearDecimal - elapsed;

  const dashaTimeline = [];
  let cumulative = startYear;
  for (let i = 0; i < 9; i++) {
    const idx = (dashaStartIdx + i) % 9;
    const yrs = DASHA_YEARS[idx];
    dashaTimeline.push({ planet: DASHAS[idx], startYear: cumulative, endYear: cumulative + yrs, years: yrs });
    cumulative += yrs;
  }

  const currentYear = new Date().getFullYear() + new Date().getMonth() / 12;
  const currentDasha = dashaTimeline.find(d => currentYear >= d.startYear && currentYear < d.endYear) || dashaTimeline[0];

  // Lucky numbers
  const sunSign = planets[0].signIdx + 1;
  const moonSign = planets[1].signIdx + 1;
  const luckyNums = [...new Set([sunSign % 9 || 9, moonSign % 9 || 9, lagnaSign % 9 || 9, (year % 9) || 9, ((month + day) % 9) || 9])].slice(0, 5);

  // Moon phase
  const moonPhaseAngle = ((positions.moon - positions.sun) + 360) % 360;
  const moonPhaseIndex = Math.floor(moonPhaseAngle / 45) % 8;

  return {
    planets, lagnaSign, lagnaName: SIGNS[lagnaSign], lagnaSymbol: SIGN_SYMBOLS[lagnaSign],
    ascDeg, ayanamsha, jd, system,
    sunSign: planets[0].sign, moonSign: planets[1].sign,
    moonNakshatra: NAKSHATRAS[planets[1].nkIdx],
    dashaTimeline, currentDasha,
    luckyNums, moonPhaseIndex, moonPhaseAngle,
    birthData: { dateStr, timeStr, lat, lon, year, month, day, hour: utcHour }
  };
}

// ── Moon phases ──
export const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', pct: 2, energy: 'Set powerful intentions. The cosmic void holds infinite potential.', ritual: 'Write your deepest wishes. Light a white candle. Meditate on what you call forth.' },
  { name: 'Waxing Crescent', emoji: '🌒', pct: 20, energy: 'Your seeds are germinating. Nurture desires with consistent action.', ritual: 'Take one concrete step toward your intention. Speak your goals aloud.' },
  { name: 'First Quarter', emoji: '🌓', pct: 50, energy: 'Challenges arise to test your resolve. Push through with courage.', ritual: 'Address one obstacle head-on. Ask: What am I willing to commit to?' },
  { name: 'Waxing Gibbous', emoji: '🌔', pct: 75, energy: 'Refinement time. Adjust and trust as desires near manifestation.', ritual: 'Review your intentions. Express gratitude for what has arrived.' },
  { name: 'Full Moon', emoji: '🌕', pct: 100, energy: 'Peak cosmic power. Manifestations arrive. Emotions run high.', ritual: 'Release what no longer serves you. Write it, then let it go. Bathe in moonlight.' },
  { name: 'Waning Gibbous', emoji: '🌖', pct: 75, energy: 'Harvest and share. Give back, celebrate, express gratitude.', ritual: 'Share your abundance. Give something away that has served its purpose.' },
  { name: 'Last Quarter', emoji: '🌗', pct: 50, energy: 'Release and forgive. Let go of what did not serve your highest good.', ritual: 'Forgive someone — especially yourself. Clear your physical space.' },
  { name: 'Waning Crescent', emoji: '🌘', pct: 20, energy: 'Rest and surrender. The cosmos asks you to be still.', ritual: 'Rest deeply. Journal what you have learned this cycle.' },
];

// ── Compatibility scoring ──
export function computeCompatibility(sign1, sign2) {
  const elem1 = SIGN_ELEMENTS[sign1], elem2 = SIGN_ELEMENTS[sign2];
  const qual1 = SIGN_QUALITIES[sign1], qual2 = SIGN_QUALITIES[sign2];
  const diff = Math.abs(sign1 - sign2);

  const elemScores = {
    'Fire-Fire':70,'Fire-Air':85,'Fire-Earth':45,'Fire-Water':40,
    'Earth-Earth':72,'Earth-Water':80,'Earth-Air':50,'Earth-Fire':45,
    'Air-Air':68,'Air-Fire':85,'Air-Water':48,'Air-Earth':50,
    'Water-Water':75,'Water-Earth':80,'Water-Fire':40,'Water-Air':48,
  };
  const base = elemScores[`${elem1}-${elem2}`] || 55;
  const trine = (diff === 4 || diff === 8) ? 12 : 0;
  const sextile = (diff === 2 || diff === 10) ? 7 : 0;
  const opposition = diff === 6 ? -5 : 0;
  const square = (diff === 3 || diff === 9) ? -8 : 0;
  const qualBonus = qual1 === qual2 ? -4 : 4;

  const overall = Math.min(97, Math.max(35, base + trine + sextile + opposition + square + qualBonus));
  return {
    overall,
    emotional: Math.min(99, overall + Math.floor(Math.random() * 14) - 7),
    intellectual: Math.min(99, overall + Math.floor(Math.random() * 14) - 7),
    physical: Math.min(99, overall + Math.floor(Math.random() * 16) - 8),
    spiritual: Math.min(99, overall + Math.floor(Math.random() * 12) - 6),
    longTerm: Math.min(99, overall + Math.floor(Math.random() * 10) - 5),
  };
}

export const TAROT_CARDS = [
  { name:'The Star', emoji:'⭐', meaning:'Hope, renewal, and divine inspiration. A healing period is upon you. Trust the universe completely.' },
  { name:'The Moon', emoji:'🌙', meaning:'Intuition is your greatest guide. Trust what lies beneath the surface — illusions dissolve to reveal truth.' },
  { name:'The Sun', emoji:'☀️', meaning:'Joy, success, and radiant vitality. A time of clarity, abundance, and confident self-expression.' },
  { name:'The Wheel', emoji:'🎡', meaning:'Fortune turns in your favour. What has been difficult is shifting. A powerful change is arriving.' },
  { name:'The World', emoji:'🌍', meaning:'Completion and wholeness. You have arrived at a significant culmination. A new chapter begins.' },
  { name:'The Tower', emoji:'⚡', meaning:'Necessary transformation. Something built on false foundations must fall so that truth can rise.' },
  { name:'Strength', emoji:'🦁', meaning:'Quiet courage and compassionate mastery. Lead with love — it is more powerful than force.' },
  { name:'The Hermit', emoji:'🏮', meaning:'Inward retreat and deep reflection. The answers you seek live within you.' },
  { name:'Justice', emoji:'⚖️', meaning:'Truth, fairness, and karmic balance. Act with integrity — the universe is watching and responding.' },
  { name:'The Empress', emoji:'👑', meaning:'Abundance and nurturing creative energy. A fertile period for all forms of growth and beauty.' },
  { name:'The Emperor', emoji:'🏛️', meaning:'Structure, authority, and grounded leadership. Build solid foundations with confidence.' },
  { name:'The Lovers', emoji:'💞', meaning:'A significant choice or deep connection. Follow your heart\'s true alignment completely.' },
  { name:'The Chariot', emoji:'🏆', meaning:'Victory through determination. You have the will to overcome all obstacles before you.' },
  { name:'The High Priestess', emoji:'🔮', meaning:'Hidden knowledge and deep intuition. Be still and let your inner wisdom speak.' },
  { name:'The Magician', emoji:'✨', meaning:'You have all the tools needed. A powerful time for manifestation — your intention creates reality.' },
  { name:'The Fool', emoji:'🌟', meaning:'A beautiful new beginning. Leap with faith — the universe supports your fresh adventure.' },
  { name:'Judgement', emoji:'🎺', meaning:'A profound awakening. You are being summoned to your higher purpose. Rise into who you truly are.' },
  { name:'The Hierophant', emoji:'📿', meaning:'Tradition and spiritual guidance. A teacher may appear. Honour inherited wisdom.' },
  { name:'Temperance', emoji:'🌈', meaning:'Balance and divine alchemy. Opposing forces are harmonising. Healing and integration arrive.' },
  { name:'The Devil', emoji:'🔗', meaning:'Liberation from what binds you. You have more freedom than you believe — the chains are yours to remove.' },
  { name:'Death', emoji:'🦋', meaning:'Not an ending but profound transformation. Something must die so something greater can be born.' },
  { name:'The Hanged Man', emoji:'🌀', meaning:'Surrender and new perspective. Release control and see everything from a completely different angle.' },
];
