export class BookingAvailability {
  constructor(element) {this.element=element;this.request=null;}
  async show(room) {
    this.request?.abort();
    const controller = new AbortController();this.request=controller;
    this.element.replaceChildren();this.element.hidden=!room?.bookingUrl;
    if (!room?.bookingUrl) return;
    const heading=document.createElement('h3');heading.textContent='Next available times';
    const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Checking availability…';
    this.element.append(heading,status);
    const timer=setTimeout(()=>controller.abort(),25000);
    try {
      const id=new URL(room.bookingUrl).searchParams.get('facilityId');
      const response=await fetch(`${import.meta.env.BASE_URL}api/availability?facilityId=${encodeURIComponent(id)}`,{signal:controller.signal});
      if(!response.ok)throw new Error('Unavailable');
      const data=await response.json();
      if(!Array.isArray(data.slots))throw new Error('Invalid response');
      if(this.request!==controller)return;
      const list=document.createElement('ol');
      const dateFormat=new Intl.DateTimeFormat('en-CA',{weekday:'short',month:'short',day:'numeric',timeZone:'UTC'});
      const timeFormat=new Intl.DateTimeFormat('en-CA',{hour:'numeric',minute:'2-digit',timeZone:'UTC'});
      for(const slot of data.slots.slice(0,3)) {
        // Values represent venue wall time, not the viewer's browser timezone.
        const start=new Date(`${slot.start}Z`),end=new Date(`${slot.end}Z`);
        const item=document.createElement('li'),date=document.createElement('strong'),time=document.createElement('span');
        date.textContent=dateFormat.format(start);time.textContent=`${timeFormat.format(start)} – ${timeFormat.format(end)}`;
        item.append(date,time);list.append(item);
      }
      status.textContent=data.slots.length?'Vancouver time · availability can change':`No available times found through ${data.through}.`;
      this.element.insertBefore(list,status);
    } catch {
      if(this.request===controller)status.textContent='Couldn’t load times. Use the link below to check availability.';
    } finally {clearTimeout(timer);}
  }
}
