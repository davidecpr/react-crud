import axios from 'axios'

async function getAllEvents() {
    const res = await axios.get('http://localhost:8001/events')
    const categories = await res.data
    return categories
}

async function getEvent(id) {
    const res = await axios.get(`http://localhost:8001/events/${id}`)
    const event = await res.data
    return event
}

async function editEvent(id, event) {
    await axios.put(`http://localhost:8001/events/${id}`, event)
}

async function addEvent(event) {
    await axios.post('http://localhost:8001/events/', event)
}

async function deleteEvent(id) {
    await axios.delete(`http://localhost:8001/events/${id}`)
}

export {
    getAllEvents,
    getEvent,
    editEvent,
    addEvent,
    deleteEvent
};