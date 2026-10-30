import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const asset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;
const sceneAssets = [
  'walking-person-cartoon.png',
  'projects-room-day.jpg',
  'projects-room.jpg',
  'experience-room-day.jpg',
  'experience-room.jpg',
].map(asset);

const projects = [
  { title: 'Developer Toolkit', stack: 'React · Node · DX', x: 16, y: 43, light: [24, 19] },
  { title: 'Data Dashboard', stack: 'TypeScript · Charts · APIs', x: 38, y: 52, light: [45, 26] },
  { title: 'Smart Assistant', stack: 'LLMs · Python · Product', x: 58, y: 59, light: [65, 33] },
];

const experience = [
  { title: 'Software Engineer', meta: '2024 — now', x: 16, y: 43, light: [24, 19] },
  { title: 'Full-stack Developer', meta: '2022 — 2024', x: 38, y: 52, light: [45, 26] },
  { title: 'Computer Science', meta: '2020 — 2022', x: 58, y: 59, light: [65, 33] },
];

function buildWalkBeats(items) {
  const stairStart = 5;
  const door = 77;
  const frameBeats = items.map((item, index) => {
    const evenlySpaced = (index + 1) / (items.length + 1);
    const positioned = Number.isFinite(item.x) ? (item.x - stairStart) / (door - stairStart) : evenlySpaced;
    return Math.max(.1, Math.min(.88, positioned));
  });
  return [0, ...frameBeats, 1];
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reducedMotion;
}

function usePreloadedSceneAssets(reducedMotion) {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadImage = (source) => new Promise((resolve) => {
      const image = new Image();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (!cancelled) setLoaded((count) => Math.min(count + 1, sceneAssets.length));
        resolve();
      };
      image.onload = finish;
      image.onerror = finish;
      image.src = source;
      if (image.complete) finish();
    });
    const minimumIntro = new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 100 : 850));
    Promise.all([Promise.all(sceneAssets.map(loadImage)), minimumIntro]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, [reducedMotion]);

  return { loaded, total: sceneAssets.length, ready };
}

function HouseLoader({ loaded, total }) {
  const progress = total ? Math.round((loaded / total) * 100) : 0;
  return <main className="preloader" aria-busy="true" aria-live="polite">
    <div className="loader-house" aria-hidden="true">
      <i className="loader-roof" /><i className="loader-window"><b /></i><i className="loader-door"><b /></i>
      <i className="loader-stairs"><b /><b /><b /><b /></i>
      <i className="loader-walker" />
    </div>
    <p className="loader-kicker">AARUSH / SOFTWARE ENGINEER</p>
    <h1>Waking up<br />the house.</h1>
    <div className="loader-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
    <p className="loader-status">Hanging the pictures <b>{loaded} / {total}</b></p>
    <span className="sr-only">Loading the illustrated portfolio: {progress}% complete.</span>
  </main>;
}

function pathPoint(progress, isExperience = false) {
  const projectPath = [[5, 43], [13, 48], [21, 54], [29, 60], [37, 66], [45, 72], [53, 78], [62, 79], [70, 84], [77, 89]];
  const experiencePath = [[5, 43], [13, 48], [21, 54], [29, 60], [37, 66], [45, 72], [53, 78], [62, 79], [70, 84], [77, 86]];
  const points = isExperience ? experiencePath : projectPath;
  const position = progress * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(position));
  const fraction = position - index;
  const [x1, y1] = points[index];
  const [x2, y2] = points[index + 1];
  return {
    x: x1 + (x2 - x1) * fraction,
    y: y1 + (y2 - y1) * fraction,
    rotation: Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI,
  };
}

function JourneyControls({ active, beat, beats, isExperience, onMove }) {
  const last = beat === beats.length - 1;
  const nextLabel = last ? (isExperience ? 'Finish journey' : 'Open door') : 'Walk down';
  return <div className="journey-controls" aria-label="Journey controls">
    <button type="button" tabIndex={active ? 0 : -1} onClick={() => onMove(-1)} aria-label="Go back one step">←</button>
    <span aria-live="off">{String(beat + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}</span>
    <button type="button" tabIndex={active ? 0 : -1} onClick={() => onMove(1)}>{nextLabel} <span>↓</span></button>
  </div>;
}

function RoomJourney({ id, label, title, items, dayImage, nightImage, beat, active, isExperience, isNight, lampOn, catPetted, onMove, onToggleTime, onToggleLamp, onPetCat }) {
  const walkBeats = buildWalkBeats(items);
  const finalBeat = walkBeats.length - 1;
  const progress = walkBeats[beat];
  const walker = pathPoint(progress, isExperience);
  const unlocked = !isExperience && beat === finalBeat;
  return <section className={`guided-scene room-scene ${active ? 'is-active' : ''} ${isNight ? 'is-night' : 'is-day'}`} id={id} aria-hidden={!active}>
    <div className="journey-stage">
      <div className="room-canvas" style={{ '--camera-shift': `-${progress * 20}vw` }}>
        <div className="room-art room-art-day" style={{ backgroundImage: `url(${dayImage})` }} />
        <div className="room-art room-art-night" style={{ backgroundImage: `url(${nightImage})` }} />
        <div className={lampOn ? 'lamp-glow is-on' : 'lamp-glow'} />
        <div className="room-veil" style={{ opacity: beat === 0 ? .17 : 0 }} />
        <div className="art-labels" aria-label={title}>
          {items.map((item, index) => <div className={beat >= index + 1 ? 'art-label is-active' : 'art-label'} key={item.title} style={{ left: `${item.x}%`, top: `${item.y}%` }}>
            <b>{String(index + 1).padStart(2, '0')} — {item.title}</b>
            <small>{item.stack || item.meta}</small>
            <i className="lamp-flare" style={{ left: `${item.light[0] - item.x}%`, top: `${item.light[1] - item.y}%` }} />
          </div>)}
        </div>
        <div className="walker-position" style={{ left: `${walker.x}%`, top: `${walker.y}%`, transform: `translate(-50%, -92%) rotate(${walker.rotation * .23}deg)` }}>
          <img className="walker" src={asset('walking-person-cartoon.png')} alt="A cartoon person walking downstairs" />
        </div>
        {!isExperience && <button type="button" className={unlocked ? 'door-plate is-unlocked' : 'door-plate'} disabled={!unlocked || !active} tabIndex={unlocked && active ? 0 : -1} onClick={() => onMove(1)} aria-label={unlocked ? 'Enter the Experience room' : 'Experience room unlocks after the final stair'}>Experience</button>}
        <button type="button" className="room-hotspot lamp-hotspot" disabled={!active} tabIndex={active ? 0 : -1} onClick={onToggleLamp} aria-pressed={lampOn} aria-label={lampOn ? 'Turn the reading lamp off' : 'Turn the reading lamp on'} title={lampOn ? 'Turn lamp off' : 'Turn lamp on'} />
        <button type="button" className="room-hotspot window-hotspot" disabled={!active} tabIndex={active ? 0 : -1} onClick={onToggleTime} aria-pressed={isNight} aria-label={isNight ? 'Switch the room to daytime' : 'Switch the room to nighttime'} title={isNight ? 'Switch to day' : 'Switch to night'}><span aria-hidden="true">{isNight ? '☀' : '☾'}</span></button>
        <button type="button" className="room-hotspot cat-hotspot" disabled={!active} tabIndex={active ? 0 : -1} onClick={onPetCat} aria-label="Pet the sleepy cat" title="Pet the sleepy cat" />
        <span className={catPetted ? 'cat-reaction is-active' : 'cat-reaction'} aria-hidden="true">z z z</span>
      </div>
      <div className="chapter-copy"><p>{label}</p><h2>{title}</h2><span>{isExperience ? 'The places and chapters that shaped how I build.' : 'Scroll, swipe, or use the controls to walk downstairs.'}</span></div>
      <p className="journey-hint">{beat === finalBeat && !isExperience ? 'The Experience door is ready.' : 'One gesture = one step.'}</p>
      <p className="interaction-hint">Tap the window, lamp, or sleepy cat.</p>
      <JourneyControls active={active} beat={beat} beats={walkBeats} isExperience={isExperience} onMove={onMove} />
    </div>
  </section>;
}

function App() {
  const reducedMotion = useReducedMotion();
  const { loaded, total, ready } = usePreloadedSceneAssets(reducedMotion);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const journeyIndexRef = useRef(0);
  const touchStart = useRef(null);
  const wheelDelta = useRef(0);
  const unlockTimer = useRef(null);
  const catTimer = useRef(null);
  const isAnimating = useRef(false);
  const [isNight, setIsNight] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [catPetted, setCatPetted] = useState(false);
  const projectStepCount = projects.length + 2;
  const experienceStepCount = experience.length + 2;
  const projectEnd = projectStepCount;
  const experienceStart = projectEnd + 1;
  const experienceEnd = experienceStart + experienceStepCount - 1;
  const contactIndex = experienceEnd + 1;

  const move = useCallback((direction) => {
    if (!direction || isAnimating.current) return;
    const current = journeyIndexRef.current;
    const next = Math.min(contactIndex, Math.max(0, current + Math.sign(direction)));
    if (next === current) return;
    journeyIndexRef.current = next;
    setJourneyIndex(next);
    isAnimating.current = true;
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => { isAnimating.current = false; }, reducedMotion ? 0 : 880);
  }, [contactIndex, reducedMotion]);

  useEffect(() => () => { window.clearTimeout(unlockTimer.current); window.clearTimeout(catTimer.current); }, []);

  useEffect(() => {
    if (journeyIndex === 0 || isNight) return undefined;
    const duskTimer = window.setTimeout(() => setIsNight(true), 15000);
    return () => window.clearTimeout(duskTimer);
  }, [journeyIndex, isNight]);

  useEffect(() => {
    if (isNight) setLampOn(true);
  }, [isNight]);

  const toggleTime = useCallback(() => setIsNight((night) => !night), []);
  const toggleLamp = useCallback(() => setLampOn((on) => !on), []);
  const petCat = useCallback(() => {
    setCatPetted(true);
    window.clearTimeout(catTimer.current);
    catTimer.current = window.setTimeout(() => setCatPetted(false), 1600);
  }, []);

  useEffect(() => {
    const handleWheel = (event) => {
      const index = journeyIndexRef.current;
      if (index < 1 || index > experienceEnd || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      event.preventDefault();
      const direction = Math.sign(event.deltaY);
      if (wheelDelta.current && Math.sign(wheelDelta.current) !== direction) wheelDelta.current = 0;
      wheelDelta.current += event.deltaY;
      if (Math.abs(wheelDelta.current) >= 45) {
        wheelDelta.current = 0;
        move(direction);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [experienceEnd, move]);

  useEffect(() => {
    const handleKey = (event) => {
      const tag = event.target instanceof HTMLElement ? event.target.tagName : '';
      if (['INPUT', 'TEXTAREA', 'SELECT', 'A', 'BUTTON'].includes(tag)) return;
      if (['ArrowDown', 'PageDown'].includes(event.key) || event.code === 'Space') {
        event.preventDefault();
        move(1);
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        move(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const onTouchStart = (event) => { touchStart.current = event.touches[0]?.clientY ?? null; };
  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const end = event.changedTouches[0]?.clientY ?? touchStart.current;
    const distance = touchStart.current - end;
    touchStart.current = null;
    if (Math.abs(distance) > 42) move(Math.sign(distance));
  };

  const isIntro = journeyIndex === 0;
  const isProjects = journeyIndex >= 1 && journeyIndex <= projectEnd;
  const isExperience = journeyIndex >= experienceStart && journeyIndex <= experienceEnd;
  const isContact = journeyIndex === contactIndex;
  const projectBeat = Math.max(0, Math.min(projectStepCount - 1, journeyIndex - 1));
  const experienceBeat = Math.max(0, Math.min(experienceStepCount - 1, journeyIndex - experienceStart));
  const liveMessage = isIntro ? 'Introduction' : isProjects ? `Selected work, step ${projectBeat + 1} of ${projectStepCount}` : isExperience ? `Experience, step ${experienceBeat + 1} of ${experienceStepCount}` : 'Contact';

  if (!ready) return <HouseLoader loaded={loaded} total={total} />;

  return <main className="portfolio-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
    <p className="sr-only" aria-live="polite">{liveMessage}</p>
    <section className={`guided-scene welcome-screen ${isIntro ? 'is-active' : ''}`} aria-hidden={!isIntro}>
      <div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" />
      <div className="welcome-copy"><p className="intro-kicker">AARUSH / SOFTWARE ENGINEER</p><h1>Building calm,<br />useful software.</h1><p>I’m a full-stack engineer who turns ambiguous problems into thoughtful, dependable web products.</p><button type="button" tabIndex={isIntro ? 0 : -1} onClick={() => move(1)}>Start the journey <span>↓</span></button></div>
      <p className="welcome-foot">A guided stroll through my work.</p>
    </section>
    <RoomJourney id="projects" label="FIRST FLIGHT" title="Selected work" items={projects} dayImage={asset('projects-room-day.jpg')} nightImage={asset('projects-room.jpg')} beat={projectBeat} active={isProjects} isNight={isNight} lampOn={lampOn} catPetted={catPetted} onMove={move} onToggleTime={toggleTime} onToggleLamp={toggleLamp} onPetCat={petCat} />
    <RoomJourney id="experience" label="SECOND FLIGHT" title="Experience" items={experience} dayImage={asset('experience-room-day.jpg')} nightImage={asset('experience-room.jpg')} beat={experienceBeat} active={isExperience} isNight={isNight} lampOn={lampOn} catPetted={catPetted} onMove={move} onToggleTime={toggleTime} onToggleLamp={toggleLamp} onPetCat={petCat} isExperience />
    <section className={`guided-scene closing-screen ${isContact ? 'is-active' : ''}`} aria-hidden={!isContact}>
      <p>THE FRONT DOOR</p><h2>Let’s build something<br />worth walking toward.</h2><a tabIndex={isContact ? 0 : -1} href="mailto:hello@example.com">Say hello <span>↗</span></a>
      <button type="button" className="contact-back" tabIndex={isContact ? 0 : -1} onClick={() => move(-1)}>← Back to the stairs</button>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
