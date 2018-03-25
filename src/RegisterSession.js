// @flow
import axios from 'axios';
import moment from 'moment';

export type RegisterEvent = {
  event_type: string,
  payload: Object,
  timestamp: string
};

class RegisterSession {
  apiUrl: string;
  secretKey: string;
  cache: RegisterEvent[];
  cacheSize: number;
  
  constructor(apiUrl: string, secretKey: string, cacheSize: number = 10) {
    this.apiUrl = apiUrl;
    this.secretKey = secretKey;
    this.cache = [];
    this.cacheSize = cacheSize;
  }

  createEvent(
    event_type: string,
    payload: Object,
    timestamp: string = moment.utc().format('YYYY-MM-DD HH:mm:ss.ms')
  ): RegisterEvent {
    return ({event_type, payload, timestamp});
  } 

  sendEvents() {
    axios.post(
        this.apiUrl + '/api/events/create/', 
        { events: this.cache }, 
        { headers: { 'Authorization': `Bearer ${this.secretKey}` } })
      .then(response => {
        console.log(JSON.stringify(response.data.data));
      });
    this.cache = [];
  }

  logEvent(event_type: string, payload: Object) {
    this.cache.push(this.createEvent(event_type, payload));

    if (this.cache.length >= this.cacheSize)
      this.sendEvents();
  }
}

export default RegisterSession;