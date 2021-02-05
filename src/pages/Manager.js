import React from 'react'
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
import { getAllManagers, getManager, editManager, addManager, deleteManager } from './../services/Manager'

class Manager extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            managers: [],
            addDialogOpen: false,
            manager: {
                name: '',
                description: '',
                website: '',
                email: ''
            },
            isEditDialog: false,
            editManagerId: '',
            alert: {
                show: false,
                message: '',
                type: 'success'
            }
        }
    }

    componentDidMount() {
        this.getAllManagers()
    }

    validateManager() {
        const { name, description, website, email } = this.state.manager

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

        if (website === undefined || website === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il sito web è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (email === undefined || email === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'L\'email è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        return true
    }

    async getAllManagers() {
        const managers = await getAllManagers()
        this.setState({
            managers: managers
        })
    }

    async addManager() {

        const { name, description, website, email } = this.state.manager

        if (!this.validateManager()) {
            return
        }

        const manager = Object.assign({}, {
            id: Date.now(),
            name: name,
            description: description,
            website: website,
            email: email
        })

        Object.assign(manager, {
            key: new Date().valueOf()
        })
        await axios.post('http://localhost:8001/managers/', manager)

        this.closeDialog()
        this.getAllManagers()
        this.setState({
            alert: {
                show: true,
                message: 'Nuovo organizzatore aggiunta con successo',
                type: 'success'
            }
        })

    }

    deleteManager = async (id) => {
        await deleteManager(id)
        this.getAllManagers()
        this.setState({
            alert: {
                show: true,
                message: 'Organizzatore eliminata con successo',
                type: 'success'
            }
        })
    }

    editManager = async () => {
        const { name, description, website, email } = this.state.manager
        const { editManagerId } = this.state

        if (!this.validateManager()) {
            return
        }

        const manager = Object.assign({}, {
            name: name,
            description: description,
            website: website,
            email: email
        })
        await editManager(editManagerId, manager)
        this.closeDialog()
        this.getAllManagers()
        this.setState({
            alert: {
                show: true,
                message: 'Categoria modificata con successo',
                type: 'success'
            }
        })
    }

    handleEditManager = async (id) => {
        const manager = await getManager(id)
        this.setState({
            manager: {
                name: manager.name,
                description: manager.description,
                website: manager.website,
                email: manager.email
            },
            editManagerId: id
        })
        this.openDialog(true)
    }

    closeDialog = () => {
        this.setState({
            addDialogOpen: false,
            manager: {
                name: '',
                description: '',
                website: '',
                email: ''
            }
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
            { field: "website", headerName: "Website" },
            { field: "email", headerName: "Email" },
            { field: "actions", headerName: "Azioni" }
        ]

        const {
            managers,
            addDialogOpen,
            isEditDialog
        } = this.state;

        const {
            name,
            description,
            website,
            email
        } = this.state.manager

        return (
            <React.Fragment>
                <Button className="addButton" variant="contained" color="primary" onClick={() => this.openDialog(false)}>
                    Aggiungi organizzatore
                </Button>
                <MyTable columns={columns} data={managers} editHandle={this} editHandle={this.handleEditManager} deleteHandle={this.deleteManager} />
                <Dialog open={addDialogOpen} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{isEditDialog ? "Modifica Organizzatore" : "Nuovo Organizzatore"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isEditDialog ? "Modifica questa categoria" : "Inserisci tutti i campi richiesti per aggiungere una nuova categoria."}
                        </DialogContentText>
                        <form style={{ marginTop: "50px" }} onSubmit={isEditDialog ? (this.editManager) : (() => this.addManager())}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="name"
                                        label="Nome organizzatore"
                                        type="text"
                                        fullWidth
                                        value={name}
                                        onChange={(e => this.setState({
                                            manager: {
                                                [e.target.id]: e.target.value,
                                                description: description,
                                                website: website,
                                                email: email
                                            }
                                        })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="website"
                                        label="website organizzatore"
                                        type="text"
                                        fullWidth
                                        value={website}
                                        onChange={(e => this.setState({
                                            manager: {
                                                [e.target.id]: e.target.value,
                                                name: name,
                                                description: description,
                                                email: email
                                            }
                                        })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="email"
                                        label="email organizzatore"
                                        type="email"
                                        fullWidth
                                        value={email}
                                        onChange={(e => this.setState({
                                            manager: {
                                                [e.target.id]: e.target.value,
                                                name: name,
                                                description: description,
                                                website: website,

                                            }
                                        })
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        id="description"
                                        label="Descrizione organizzatore"
                                        type="text"
                                        multiline
                                        rowsMax={4}
                                        fullWidth
                                        value={description}
                                        onChange={(e => this.setState({
                                            manager: {
                                                [e.target.id]: e.target.value,
                                                name: name,
                                                website: website,
                                                email: email
                                            }
                                        })
                                        )}
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
            </React.Fragment>
        )
    }

}

export default Manager;