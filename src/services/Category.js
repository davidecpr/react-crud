import axios from 'axios'

axios.create({
    baseURL: 'http://localhost:8001/'
})

async function getAllCategories() {
    const res = await axios.get('http://localhost:8001/categories')
    const categories = await res.data
    return categories
}

async function getCategory(id) {
    const res = await axios.get(`http://localhost:8001/categories/${id}`)
    const category = await res.data
    return category
}

async function editCategory(id, category) {
    await axios.put(`http://localhost:8001/categories/${id}`, category)
}

async function addCategory(category) {
    await axios.post('http://localhost:8001/categories/', category)
}

async function deleteCategory(id) {
    await axios.delete(`http://localhost:8001/categories/${id}`)
}

export {
    getAllCategories,
    getCategory,
    editCategory,
    addCategory,
    deleteCategory
};