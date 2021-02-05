import axios from 'axios'

async function getAllManagers() {
    const res = await axios.get('http://localhost:8001/managers')
    const managers = await res.data
    return managers
}

async function getManager(id) {
    const res = await axios.get(`http://localhost:8001/managers/${id}`)
    const manager = await res.data
    return manager
}

async function editManager(id, manager) {
    await axios.put(`http://localhost:8001/managers/${id}`, manager)
}

async function addManager(manager) {
    await axios.post('http://localhost:8001/managers/', manager)
}

async function deleteManager(id) {
    await axios.delete(`http://localhost:8001/managers/${id}`)
}

export {
    getAllManagers,
    getManager,
    editManager,
    addManager,
    deleteManager
};