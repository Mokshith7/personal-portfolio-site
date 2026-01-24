import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Calendar not connected');
  }
  return accessToken;
}

export async function getUncachableGoogleCalendarClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function createCalendarEvent(
  summary: string,
  description: string,
  startTime: Date,
  endTime: Date,
  attendeeEmail: string
) {
  const calendar = await getUncachableGoogleCalendarClient();
  
  const event = {
    summary,
    description,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC',
    },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: `meeting-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  });

  return response.data;
}

export async function getAvailableSlots(date: Date) {
  const calendar = await getUncachableGoogleCalendarClient();
  
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(9, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(17, 0, 0, 0);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = response.data.calendars?.primary?.busy || [];
  const availableSlots: { start: Date; end: Date }[] = [];

  let currentTime = new Date(startOfDay);
  const slotDuration = 30 * 60 * 1000;

  while (currentTime.getTime() + slotDuration <= endOfDay.getTime()) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration);
    
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start!);
      const busyEnd = new Date(busy.end!);
      return currentTime < busyEnd && slotEnd > busyStart;
    });

    if (isAvailable) {
      availableSlots.push({
        start: new Date(currentTime),
        end: slotEnd,
      });
    }

    currentTime = new Date(currentTime.getTime() + slotDuration);
  }

  return availableSlots;
}
