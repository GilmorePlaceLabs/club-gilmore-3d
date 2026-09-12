const origin = 'https://clubgilmore.perfectmind.com';
const facilityIds = new Set([
  'e19d55a9-ba84-4359-82d4-9bca2c23ee1c',
  '3807e29f-a39b-4a63-9ece-192a29076d3e',
  '2ab1b95c-49b4-4399-9444-db49f5deade3',
  'c9efdb01-612b-46b3-b371-a161fc97bf6b',
]);
const cache = new Map(), pending = new Map();
const zone = 'America/Vancouver';
const localTime = now => new Intl.DateTimeFormat('sv-SE', {
  timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
}).format(now).replace(' ', 'T');

// The provider returns calendar dates at UTC midnight, with separate local
// hours. Keep these as Vancouver wall times; browser timezone must not shift them.
export function parseSlots(data, now = new Date()) {
  if (!Array.isArray(data.availabilities)) throw new Error('Unexpected availability response');
  const found = new Map(), cutoff = localTime(now);
  for (const day of data.availabilities) {
    const match = /^\/Date\((\d+)\)\/$/.exec(day.Date);
    if (!match || !Array.isArray(day.BookingGroups)) throw new Error('Unexpected availability day');
    const date = new Date(Number(match[1])).toISOString().slice(0, 10);
    for (const group of day.BookingGroups) for (const slot of group.AvailableSpots || []) {
      if (slot.IsDisabled !== false) continue;
      const {Hours: hours, Minutes: minutes} = slot.Time || {};
      const duration = slot.Duration?.TotalMinutes;
      if (!Number.isInteger(hours) || hours < 0 || hours > 23 || !Number.isInteger(minutes) || minutes < 0 || minutes > 59 || !(duration > 0)) throw new Error('Unexpected slot time');
      const start = `${date}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`;
      if (start <= cutoff) continue;
      const end = new Date(Date.parse(`${start}Z`) + duration * 60000).toISOString().slice(0,19);
      found.set(start, {start, end});
    }
  }
  return [...found.values()].sort((a,b)=>a.start.localeCompare(b.start));
}

async function fetchSlots(facilityId) {
  const signal = AbortSignal.timeout(20000);
  const pageUrl = `${origin}/Contacts/BookMe4LandingPages/Facility?facilityId=${facilityId}&widgetId=15f6af07-39c5-473e-b053-96653f77a406&calendarId=c82e88a4-5059-4c6e-bc5e-66f1a02d2d6a`;
  const page = await fetch(pageUrl, {signal});
  if (!page.ok) throw new Error('Facility page unavailable');
  const cookie = page.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
  const html = await page.text();
  const token = html.match(/name="__RequestVerificationToken"[^>]*value="([^"]+)"/)?.[1];
  const serviceText = html.match(/services: (\[[^\r\n]+\]),/)?.[1];
  if (!token || !serviceText) throw new Error('Facility page format changed');
  const service = JSON.parse(serviceText)[0], duration = service?.Durations?.[0];
  if (!service?.ID || !duration?.DurationIDs?.length) throw new Error('Facility service unavailable');
  const now = new Date(), today = localTime(now).slice(0,10);
  const slots = [];
  let through = today;
  // Fetch one week at a time, stopping once three future slots are found.
  // A bounded 28-day horizon avoids unbounded requests for a closed facility.
  for (let offset = 0; offset < 28 && slots.length < 3; offset += 7) {
    const date = new Date(Date.parse(`${today}T00:00:00Z`) + offset*86400000).toISOString().slice(0,10);
    through = new Date(Date.parse(`${date}T00:00:00Z`) + 6*86400000).toISOString().slice(0,10);
    const body = new URLSearchParams({facilityId, date, daysCount:'7', duration:String(duration.Duration), serviceId:service.ID, __RequestVerificationToken:token});
    duration.DurationIDs.forEach(id=>body.append('durationIds[]',id));
    const response = await fetch(`${origin}/Contacts/BookMe4LandingPages/FacilityAvailability`, {
      method:'POST', headers:{cookie,'Content-Type':'application/x-www-form-urlencoded'}, body, signal,
    });
    if (!response.ok) throw new Error('Availability provider unavailable');
    slots.push(...parseSlots(await response.json(), now));
  }
  // ponytail: first listed price only; every Club Gilmore facility lists one "Outdoor Seating" price.
  const price = duration.Prices?.[0];
  const fee = !price ? null : price.Amount > 0 ? price.DisplayAmount || `$${price.Amount.toFixed(2)}` : 'Free';
  return {slots:slots.slice(0,3), fee, timeZone:zone, checkedAt:now.toISOString(), through};
}

export async function availabilityMiddleware(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/api/availability') return next();
  res.setHeader('Content-Type','application/json');
  // Shared cache: Vercel's CDN serves one upstream fetch per minute to every
  // instance, and revalidates in the background for two minutes after that.
  res.setHeader('Cache-Control','public, max-age=60, stale-while-revalidate=120');
  if (req.method !== 'GET') {res.statusCode=405;res.end(JSON.stringify({error:'Method not allowed'}));return;}
  const id = url.searchParams.get('facilityId');
  if (!facilityIds.has(id)) {res.statusCode=400;res.end(JSON.stringify({error:'Unknown facility'}));return;}
  try {
    let result = cache.get(id);
    if (!result || Date.now()-Date.parse(result.checkedAt)>60000) {
      if (!pending.has(id)) pending.set(id,fetchSlots(id).then(data=>{cache.set(id,data);return data;}).finally(()=>pending.delete(id)));
      result = await pending.get(id);
    }
    res.end(JSON.stringify({...result,slots:result.slots.filter(s=>s.start>localTime(new Date()))}));
  } catch {
    res.statusCode=502;
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({error:'Availability is temporarily unavailable. Please check the booking page.'}));
  }
}

export function availabilityPlugin() {
  return {name:'facility-availability',
    configureServer(server) {server.middlewares.use(availabilityMiddleware);},
    configurePreviewServer(server) {server.middlewares.use(availabilityMiddleware);},
  };
}
