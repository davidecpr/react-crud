import React from "react";
import './../Category.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios'
import MyTable from './../components/MyTable'
import { getAllCategories, getCategory, editCategory, addCategory, deleteCategory } from './../services/Category'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Category extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            addDialogOpen: false,
            name: '',
            description: '',
            slug: '',
            isEditDialog: false,
            editCategoryId: '',
            alert: {
                show: false,
                message: '',
                type: 'success'
            }
        }
    }

    componentDidMount() {
        this.getAllCategories()
    }

    validateCategory() {
        const { name, description, slug } = this.state

        if (name === undefined || name === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il nome è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (description === undefined || description === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La descrizione è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (slug === undefined || slug === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Lo slug è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        return true
    }

    async getAllCategories() {
        const categories = await getAllCategories()
        this.setState({
            categories: categories
        })
    }

    async getCategory(id) {
        const category = await getCategory(id)
        return category
    }

    addCategory = async () => {

        const { name, description, slug } = this.state

        if (!this.validateCategory()) {
            return
        }

        const category = Object.assign({}, {
            id: Date.now(),
            name: name,
            description: description,
            slug: slug
        })

        Object.assign(category, {
            key: new Date().valueOf()
        })

        await addCategory(category)

        this.closeDialog()
        this.getAllCategories()
        this.setState({
            alert: {
                show: true,
                message: 'Nuova categoria aggiunta con successo',
                type: 'success'
            }
        })

    }

    deleteCategory = async (id) => {
        await deleteCategory(id)
        this.getAllCategories()
        this.setState({
            alert: {
                show: true,
                message: 'Categoria eliminata con successo',
                type: 'success'
            }
        })
    }

    editCategory = async () => {
        const { name, description, slug, editCategoryId } = this.state

        if (!this.validateCategory()) {
            return
        }

        const category = Object.assign({}, {
            name: name,
            description: description,
            slug: slug
        })
        await editCategory(editCategoryId, category)
        this.closeDialog()
        this.getAllCategories()
        this.setState({
            alert: {
                show: true,
                message: 'Categoria modificata con successo',
                type: 'success'
            }
        })
    }

    handleEditCategory = async (id) => {
        const category = await this.getCategory(id)
        this.setState({
            name: category.name,
            slug: category.slug,
            description: category.description,
            editCategoryId: id
        })
        this.openDialog(true)
    }

    closeDialog = () => {
        this.setState({
            addDialogOpen: false,
            name: '',
            description: '',
            slug: ''
        })
    }

    openDialog = (isEditDialog) => {
        this.setState({
            addDialogOpen: true,
            isEditDialog: isEditDialog
        })
    }

    render() {

        const columns = [
            { field: "name", headerName: "Nome" },
            { field: "description", headerName: "Descrizione" },
            { field: "slug", headerName: "Slug" },
            { field: "actions", headerName: "Azioni" }
        ]

        const {
            categories,
            addDialogOpen,
            name,
            description,
            slug,
            isEditDialog
        } = this.state;

        const {
            show,
            message,
            type
        } = this.state.alert

        const closeAlert = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            this.setState({
                alert: {
                    show: false
                }
            })
        }

        return (
            <React.Fragment>
                <Button className="addButton" variant="contained" color="primary" onClick={() => this.openDialog(false)}>
                    Aggiungi categoria
                </Button>
                <MyTable key={Date.now()} columns={columns} data={categories} editHandle={this.handleEditCategory} deleteHandle={this.deleteCategory} />
                <Dialog open={addDialogOpen} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{isEditDialog ? "Modifica Categoria" : "Nuova Categoria"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isEditDialog ? "Modifica questa categoria" : "Inserisci tutti i campi richiesti per aggiungere una nuova categoria."}
                        </DialogContentText>
                        <form style={{ marginTop: "50px"}} onSubmit={isEditDialog ? (this.editCategory) : (() => this.addCategory())}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="name"
                                        label="Nome categoria"
                                        type="text"
                                        fullWidth
                                        value={name}
                                        onChange={(e => this.setState({ [e.target.id]: e.target.value }))}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="slug"
                                        label="Slug categoria"
                                        type="text"
                                        fullWidth
                                        value={slug}
                                        onChange={(e => this.setState({ [e.target.id]: e.target.value }))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        id="description"
                                        label="Descrizione categoria"
                                        type="text"
                                        multiline
                                        rowsMax={4}
                                        fullWidth
                                        value={description}
                                        onChange={(e => this.setState({ [e.target.id]: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions style={{marginTop: "20px"}}>
                                <Button type="button" onClick={this.closeDialog} color="primary">
                                    Annulla
                                </Button>
                                <Button type="submit" color="primary">
                                    {isEditDialog ? 'Modifica' : 'Aggiungi'}
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
                <Snackbar
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={show}
                    onClose={closeAlert}>
                    <Alert severity={type}>
                        {message}
                    </Alert>
                </Snackbar>

            </React.Fragment>
        );
    }

}

export default Category;