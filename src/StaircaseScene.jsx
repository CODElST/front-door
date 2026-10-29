const projectFrames = [
  { x: 262, y: 210, w: 290, h: 170, title: 'Developer Toolkit', meta: 'React · Node · DX', threshold: .16, kind: 'code' },
  { x: 622, y: 282, w: 285, h: 170, title: 'Data Dashboard', meta: 'TypeScript · Charts · APIs', threshold: .46, kind: 'data' },
  { x: 965, y: 355, w: 270, h: 170, title: 'Smart Assistant', meta: 'LLMs · Python · Product', threshold: .75, kind: 'bot' },
];

function pointOnPath(progress) {
  const points = [
    [84, 329], [220, 405], [370, 489], [528, 578], [665, 623], [875, 623], [1040, 713], [1170, 780],
  ];
  const position = progress * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(position));
  const amount = position - index;
  const [x1, y1] = points[index];
  const [x2, y2] = points[index + 1];
  return { x: x1 + (x2 - x1) * amount, y: y1 + (y2 - y1) * amount, angle: Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI };
}

function Picture({ kind, x, y, w, h }) {
  if (kind === 'data') return <g>
    <rect x={x + 24} y={y + 30} width={w - 48} height={h - 56} rx="16" fill="#f8edcf" />
    <rect x={x + 52} y={y + 90} width="18" height="37" rx="3" fill="#ed9666" /><rect x={x + 85} y={y + 69} width="18" height="58" rx="3" fill="#83b0dd" /><rect x={x + 118} y={y + 48} width="18" height="79" rx="3" fill="#f0bd50" />
    <circle cx={x + 190} cy={y + 86} r="39" fill="#2e3e58" /><path d={`M ${x + 190} ${y + 47} A 39 39 0 0 1 ${x + 229} ${y + 86} H ${x + 190} Z`} fill="#f0a066" />
  </g>;
  if (kind === 'bot') return <g>
    <rect x={x + 40} y={y + 33} width={w - 80} height={h - 61} rx="42" fill="#f9efd9" /><circle cx={x + 105} cy={y + 91} r="10" fill="#26364c" /><circle cx={x + 167} cy={y + 91} r="10" fill="#26364c" /><path d={`M ${x + 118} ${y + 119} Q ${x + 136} ${y + 137} ${x + 155} ${y + 119}`} fill="none" stroke="#26364c" strokeWidth="7" strokeLinecap="round" />
    <path d={`M ${x + 136} ${y + 33} v -18`} stroke="#26364c" strokeWidth="6" strokeLinecap="round" /><circle cx={x + 136} cy={y + 9} r="7" fill="#f3bd4e" />
  </g>;
  return <g>
    <rect x={x + 34} y={y + 32} width={w - 68} height={h - 62} rx="17" fill="#243956" /><path d={`M ${x + 95} ${y + 75} l -20 19 20 19 M ${x + 191} ${y + 75} l 20 19 -20 19 M ${x + 160} ${y + 61} l -24 67`} fill="none" stroke="#fff4d7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" /><path d={`M ${x + 122} ${y + 55} h 34`} stroke="#f0c54d" strokeWidth="7" strokeLinecap="round" />
  </g>;
}

function Frame({ frame, index, progress, night }) {
  const lit = progress >= frame.threshold;
  const wall = night ? '#18366e' : '#fff1d2';
  const frameFill = index === 0 ? '#f0c757' : index === 1 ? '#90bcdf' : '#e98e69';
  return <g className={lit ? 'frame is-lit' : 'frame'}>
    <ellipse className="lamp-glow" cx={frame.x + frame.w / 2} cy={frame.y - 10} rx={frame.w * .46} ry="54" fill="#ffe382" opacity={lit ? .30 : 0} />
    <rect x={frame.x + frame.w * .39} y={frame.y - 28} width={frame.w * .22} height="13" rx="6" fill="#101f3b" /><rect x={frame.x + frame.w * .41} y={frame.y - 23} width={frame.w * .18} height="12" rx="5" fill={lit ? '#ffe382' : '#56657d'} />
    <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} fill="#75472f" stroke="#0d213f" strokeWidth="4" /><rect x={frame.x + 10} y={frame.y + 10} width={frame.w - 20} height={frame.h - 20} fill={frameFill} stroke="#b77c4d" strokeWidth="5" />
    <Picture kind={frame.kind} x={frame.x + 10} y={frame.y + 10} w={frame.w - 20} h={frame.h - 20} />
    <text x={frame.x} y={frame.y + frame.h + 28} className="scene-label">{String(index + 1).padStart(2, '0')} — {frame.title}</text>
    <text x={frame.x} y={frame.y + frame.h + 47} className="scene-meta">{frame.meta}</text>
  </g>;
}

export default function StaircaseScene({ progress, night, onExperience, fit = 'xMidYMid meet' }) {
  const cat = pointOnPath(progress);
  const dark = night ? '#10275b' : '#234d89';
  const wall = night ? '#18366e' : '#fff1d2';
  const floor = night ? '#352b40' : '#704029';
  return <svg className={night ? 'scene-svg night' : 'scene-svg'} viewBox="0 0 1680 943" preserveAspectRatio={fit} role="img" aria-label="A playful staircase portfolio with projects hung on the wall">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={night ? '#06163c' : '#9bd5ec'} /><stop offset="1" stopColor={night ? '#183874' : '#d4eff6'} /></linearGradient>
      <filter id="frameGlow"><feGaussianBlur stdDeviation="12" /></filter>
    </defs>
    <rect width="1680" height="943" fill={wall} />
    <g className="window-layer" transform={`translate(${-18 * progress}, 0)`}>
      <rect x="74" y="90" width="238" height="302" rx="116" fill="url(#sky)" stroke="#9b6239" strokeWidth="9" />
      <circle cx="255" cy="147" r="22" fill={night ? '#ffe382' : '#f6bd3f'} /><path d="M82 330 Q150 282 219 310 T305 292 V385 H82Z" fill={night ? '#13254d' : '#619a59'} /><path d="M75 352 L312 271" stroke={night ? '#243c74' : '#bee9f4'} strokeWidth="10" opacity=".9" />
      {night && <g fill="#fff2b2"><circle cx="138" cy="150" r="3" /><circle cx="190" cy="123" r="4" /><circle cx="218" cy="178" r="3" /></g>}
    </g>
    <g className="scene-heading"><text x="380" y="118" className="kicker">FIRST FLIGHT</text><text x="380" y="173" className="scene-heading-title">Selected work</text><text x="382" y="205" className="scene-subtitle">Scroll to follow the cat downstairs.</text></g>
    <g className="frame-layer" transform={`translate(0, ${-8 * progress})`}>{projectFrames.map((frame, index) => <Frame key={frame.title} frame={frame} index={index} progress={progress} night={night} />)}</g>
    <g className="stairs-layer">
      <path d="M0 314 H70 V350 H130 V386 H190 V422 H250 V458 H310 V494 H370 V530 H430 V566 H490 V602 H550 V638 H825 V674 H900 V710 H975 V746 H1050 V782 H1180 V850 H0Z" fill={dark} />
      <polyline points="0,314 70,314 70,350 130,350 130,386 190,386 190,422 250,422 250,458 310,458 310,494 370,494 370,530 430,530 430,566 490,566 490,602 550,602 550,638 825,638 825,674 900,674 900,710 975,710 975,746 1050,746 1050,782 1180,782" fill="none" stroke="#86b8df" strokeWidth="35" strokeLinejoin="miter" strokeLinecap="butt" />
      <polyline points="0,296 70,332 130,368 190,404 250,440 310,476 370,512 430,548 490,584 550,620 825,620 900,656 975,692 1050,728 1180,764" fill="none" stroke="#0c2340" strokeWidth="4" strokeLinejoin="miter" />
    </g>
    <g className="room-props">
      <rect y="850" width="1680" height="93" fill={floor} /><ellipse cx="310" cy="895" rx="230" ry="45" fill="none" stroke="#c99358" strokeWidth="6" opacity=".8" /><ellipse cx="310" cy="895" rx="150" ry="26" fill="none" stroke="#a56b39" strokeWidth="7" opacity=".8" />
      <g transform="translate(45 578)"><rect width="176" height="272" fill="#4e3540" stroke="#111f3c" strokeWidth="5" /><path d="M0 112 H176 M0 202 H176" stroke="#111f3c" strokeWidth="5" /><rect x="26" y="128" width="24" height="65" fill="#88b8de" stroke="#111f3c" strokeWidth="3" /><rect x="57" y="142" width="24" height="51" fill="#f3c34d" stroke="#111f3c" strokeWidth="3" /><rect x="88" y="118" width="24" height="75" fill="#ed7a4a" stroke="#111f3c" strokeWidth="3" /></g>
      <g transform="translate(234 636)"><path d="M24 200 V38" stroke="#211f35" strokeWidth="9" /><path d="M-8 38 Q24 -21 56 38Z" fill="#f5c849" stroke="#111f3c" strokeWidth="5" /><ellipse cx="24" cy="202" rx="42" ry="5" fill="#111f3c" /></g>
      <g className="door" onClick={onExperience} role="button" tabIndex="0"><path d="M1280 850 V570 Q1280 500 1350 500 H1430 Q1500 500 1500 570 V850Z" fill="#73452e" stroke="#111f3c" strokeWidth="5" /><text x="1390" y="666" textAnchor="middle" className="door-label">EXPERIENCE</text><circle cx="1460" cy="726" r="8" fill="#f5c849" /></g>
      <g transform="translate(1535 650)"><path d="M28 175 L48 40 M28 175 L-12 58 M28 175 L93 52" stroke="#2c6e55" strokeWidth="9" /><path d="M48 68 Q92 18 102 64 Q73 93 48 68 M12 88 Q-30 29 -39 76 Q-7 107 12 88 M75 96 Q127 53 124 101 Q97 122 75 96" fill="#5fa66b" stroke="#111f3c" strokeWidth="4" /><path d="M0 174 H65 L54 222 H12Z" fill="#ef8050" stroke="#111f3c" strokeWidth="4" /></g>
    </g>
    <g className="rail-layer" transform={`translate(${10 * progress}, ${-5 * progress})`}>
      <path d="M0 274 L554 602 H825 L1180 768" fill="none" stroke="#9f6037" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      {[ [112,340,112,396],[230,410,230,469],[350,480,350,539],[470,551,470,610],[612,607,612,660],[740,607,740,660],[868,632,868,697],[1010,702,1010,760],[1125,748,1125,822] ].map((post, index) => <line key={index} x1={post[0]} y1={post[1]} x2={post[2]} y2={post[3]} stroke="#9f6037" strokeWidth="8" strokeLinecap="round" />)}
    </g>
    <g className="cat-layer" transform={`translate(${cat.x} ${cat.y}) rotate(${cat.angle})`}>
      <ellipse cx="0" cy="0" rx="34" ry="20" fill="#f17b43" stroke="#111f3c" strokeWidth="4" /><circle cx="34" cy="-15" r="17" fill="#f17b43" stroke="#111f3c" strokeWidth="4" /><circle cx="39" cy="-19" r="2.8" fill="#111f3c" /><path d="M-31 -4 Q-62 -29 -53 -58" fill="none" stroke="#f17b43" strokeWidth="9" strokeLinecap="round" /><path d="M-7 17 v 10 M13 17 v 10" stroke="#111f3c" strokeWidth="4" strokeLinecap="round" />
    </g>
    <text x="1470" y="820" className="scroll-copy">KEEP SCROLLING ↓</text>
  </svg>;
}
