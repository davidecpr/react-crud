import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import MyTable from './../components/MyTable'
import { getAllCategories } from './../services/Category'
import { getAllManagers } from './../services/Manager'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from '@material-ui/core/Snackbar';
import { getAllEvents, getEvent, editEvent, addEvent, deleteEvent } from './../services/Event'
import MuiAlert from '@material-ui/lab/Alert';
import moment from 'moment'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Event extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            events: [],
            categories: [],
            managers: [],
            addDialogOpen: false,
            event: {
                name: '',
                description: '',
                category: '',
                manager: '',
                state: '',
                maxInvited: '',
                dateTime: '',
                startDateTime: '',
                endDateTime: '',
                type: '',
                tags: [],
                street: '',
                city: '',
                link: '',
                isPublic: true
            },
            isEditDialog: false,
            editEventId: '',
            alert: {
                show: false,
                message: '',
                type: 'success'
            }
        }
    }

    async componentDidMount() {
        const categories = await getAllCategories()
        this.setState({
            categories: categories
        })
        const managers = await getAllManagers()
        this.setState({
            managers: managers
        })
        this.getAllEvents()
    }

    validateEvent() {

        const {
            name,
            description,
            category,
            manager,
            state,
            maxInvited,
            dateTime,
            startDateTime,
            endDateTime,
            type,
            tags,
            street,
            streetName,
            city,
            link,
            isPublic
        } = this.state.event

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

        if (category === undefined || category === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La categoria è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (manager === undefined || manager === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'L\'organizzatore è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (state === undefined || state === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Lo stato è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (maxInvited === undefined || maxInvited === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il numero di invitati non può essere uguale a 0',
                    type: 'error'
                }
            })
            return false;
        }

        if (dateTime === undefined || dateTime === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La data è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (startDateTime === undefined || startDateTime === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La data di inizio è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (endDateTime === undefined || endDateTime === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La data di fine è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (type === undefined || type === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il tipo di evento è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (tags === undefined || tags === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'È necessario almeno un tag',
                    type: 'error'
                }
            })
            return false;
        }

        if (street === undefined || street === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La denominazione dell\'indirizzo è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (city === undefined || city === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'La città è obbligatoria',
                    type: 'error'
                }
            })
            return false;
        }

        if (link === undefined || link === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il link è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        if (isPublic === undefined || isPublic === '') {
            this.setState({
                alert: {
                    show: true,
                    message: 'Il tipo di evento è obbligatorio',
                    type: 'error'
                }
            })
            return false;
        }

        return true
    }

    async getAllEvents() {
        const events = await getAllEvents()
        events.map(event => {
            const start = event.startDateTime
            const end = event.endDateTime
            const diff = moment(end).diff(moment(start))
            const duration = moment.duration(diff)

            let durationString = ""

            if (duration.days() > 0) {
                if (duration.days() > 1) {
                    durationString = durationString + `${duration.days()} giorni`
                } else {
                    durationString = durationString + `${duration.days()} giorno`
                }
            } 

            if (duration.hours() > 0) {
                if (duration.hours() > 1) {
                    durationString = durationString + `${duration.hours()} ore`
                } else {
                    durationString = durationString + `${duration.hours()} ora`
                }
            }

            if (duration.minutes() > 0) {
                if (duration.minutes() > 1) {
                    durationString = durationString + `${duration.minutes()} minuti`
                } else {
                    durationString = durationString + `${duration.minutes()} minuto`
                }
            }

            
            const address = event.street + ' ' + event.city
            Object.assign(event, {
                duration: durationString,
                address: address
            })
        })
        
        this.setState({
            events: events
        })
    }

    async addEvent() {

        const {
            name,
            description,
            category,
            manager,
            state,
            maxInvited,
            dateTime,
            startDateTime,
            endDateTime,
            type,
            tags,
            street,
            streetName,
            number,
            country,
            city,
            zipcode,
            link,
            isPublic
        } = this.state.event

        if (!this.validateEvent()) {
            return
        }

        const event = Object.assign({}, {
            id: Date.now(),
            name: name,
            description: description,
            category: category,
            manager: manager,
            state: state,
            maxInvited: maxInvited,
            dateTime: moment(dateTime).format('YYYY-MM-DD HH:mm'),
            startDateTime: moment(startDateTime).format('YYYY-MM-DD HH:mm'),
            endDateTime: moment(endDateTime).format('YYYY-MM-DD HH:mm'),
            type: type,
            tags: tags,
            street: street,
            streetName: streetName,
            number: number,
            country: country,
            city: city,
            zipcode: zipcode,
            link: link,
            isPublic: isPublic
        })

        Object.assign(event, {
            key: new Date().valueOf()
        })

        await addEvent(event)

        this.closeDialog()
        this.getAllEvents()
        this.setState({
            alert: {
                show: true,
                message: 'Nuovo evento aggiunto con successo',
                type: 'success'
            }
        })

    }

    editEvent = async () => {
        const {
            name,
            description,
            category,
            manager,
            state,
            maxInvited,
            dateTime,
            startDateTime,
            endDateTime,
            type,
            tags,
            street,
            city,
            link,
            isPublic
        } = this.state.event

        if (!this.validateEvent()) {
            return
        }

        const event = Object.assign({}, {
            id: Date.now(),
            name: name,
            description: description,
            category: category,
            manager: manager,
            state: state,
            maxInvited: maxInvited,
            dateTime: dateTime,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            type: type,
            tags: tags,
            street: street,
            city: city,
            link: link,
            isPublic: isPublic
        })

        await editEvent(this.state.editEventId, event)
        this.closeDialog()
        this.getAllEvents()
        this.setState({
            alert: {
                show: true,
                message: 'Evento modificato con successo',
                type: 'success'
            }
        })
    }

    deleteEvent = async (id) => {
        await deleteEvent(id)
        this.getAllEvents()
        this.setState({
            alert: {
                show: true,
                message: 'Categoria eliminata con successo',
                type: 'success'
            }
        })
    }

    getAllCategories = async () => {
        const categories = await getAllCategories()
        this.setState({
            categories: categories
        })
    }

    handleEditEvent = async (id) => {
        const event = await getEvent(id)
        this.setState({
            event: {
                name: event.name,
                description: event.description,
                category: event.category,
                manager: event.manager,
                state: event.state,
                maxInvited: event.maxInvited,
                dateTime: event.dateTime,
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime,
                type: event.type,
                tags: event.tags,
                street: event.street,
                city: event.city,
                link: event.link,
                isPublic: event.isPublic

            },
            editEventId: id
        })
        this.openDialog(true)
    }

    closeDialog = () => {
        this.setState({
            addDialogOpen: false,
            description: '',
            event: {
                name: '',
                description: '',
                category: '',
                manager: '',
                state: '',
                maxInvited: '',
                dateTime: '',
                startDateTime: '',
                endDateTime: '',
                type: '',
                tags: [],
                street: '',
                city: '',
                link: '',
                isPublic: true
            },
        })
    }

    openDialog = (isEditDialog) => {
        this.setState({
            addDialogOpen: true,
            isEditDialog: isEditDialog
        })
    }

    handleEvent = (e) => {
        const { event } = this.state

        const eventObject = Object.assign({}, event, { [e.target.id]: e.target.value })
        this.setState({
            event: eventObject
        })

    }

    render() {

        const columns = [
            { field: "name", headerName: "Nome" },
            { field: "description", headerName: "Descrizione" },
            { field: "category", headerName: "Categoria" },
            { field: "manager", headerName: "Organizzatore" },
            { field: "state", headerName: "Stato" },
            { field: "maxInvited", headerName: "Invitati" },
            { field: "dateTime", headerName: "Data" },
            { field: "duration", headerName: "Durata"},
            { field: "type", headerName: "Tipo" },
            { field: "tags", headerName: "Tags" },
            { field: "address", headerName: "Indirizzo"},
            { field: "link", headerName: "Link" },
            { field: "isPublic", headerName: "Accessibilità" },
            { field: "actions", headerName: "Azioni" }
        ]

        const {
            events,
            categories,
            managers,
            addDialogOpen,
            isEditDialog
        } = this.state;

        const {
            name,
            description,
            category,
            manager,
            state,
            maxInvited,
            dateTime,
            startDateTime,
            endDateTime,
            type,
            tags,
            street,
            city,
            link,
            isPublic
        } = this.state.event

        const {
            show,
            message,
        } = this.state.alert

        const availableTags = [
            { title: 'Tag 1' },
            { title: 'Tag 2' },
            { title: 'Tag 3' },
            { title: 'Tag 4' },
            { title: 'Tag 5' },
            { title: 'Tag 6' },
            { title: 'Tag 7' },
        ];

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
                    Aggiungi evento
                    </Button>
                <MyTable columns={columns} data={events} editHandle={this.handleEditEvent} deleteHandle={this.deleteEvent}/>
                <Dialog open={addDialogOpen} onClose={this.closeDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{isEditDialog ? "Modifica Evento" : "Nuovo Evento"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isEditDialog ? "Modifica quest'evento'" : "Inserisci tutti i campi richiesti per aggiungere una nuovo evento."}
                        </DialogContentText>
                        <form style={{ marginTop: "50px"}} onSubmit={isEditDialog ? (this.editEvent) : (() => this.addEvent())}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="name"
                                        label="Nome evento"
                                        type="text"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => this.handleEvent(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="category-label">Categoria</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            value={category}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { category: e.target.value }) })}>
                                            {categories.map((category, index) => (
                                                <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="manager-label">Organizzatore</InputLabel>
                                        <Select
                                            labelId="manager-label"
                                            value={manager}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { manager: e.target.value }) })}>
                                            {managers.map((manager, index) => (
                                                <MenuItem key={index} value={manager.id}>{manager.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="state-label">Stato</InputLabel>
                                        <Select
                                            labelId="state-label"
                                            value={state}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { state: e.target.value }) })}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Bozza">Bozza</MenuItem>
                                            <MenuItem value="Pubblico">Pubblico</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="maxInvited"
                                        label="Numero invitati"
                                        type="number"
                                        fullWidth
                                        value={maxInvited}
                                        onChange={(e) => this.handleEvent(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="dateTime"
                                        label="Data evento"
                                        type="datetime-local"
                                        value={dateTime}
                                        onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { dateTime: e.target.value }) })}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="startDateTime"
                                        label="Data inizio evento"
                                        type="datetime-local"
                                        value={startDateTime}
                                        onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { startDateTime: e.target.value }) })}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        id="endDateTime"
                                        label="Data fine evento"
                                        type="datetime-local"
                                        value={endDateTime}
                                        onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { endDateTime: e.target.value }) })}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="type-label">Tipo</InputLabel>
                                        <Select
                                            labelId="type-label"
                                            value={type}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { type: e.target.value }) })}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Offline">Offline</MenuItem>
                                            <MenuItem value="Online">Online</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="tags-label">Tags</InputLabel>
                                        <Select
                                            labelId="tags-label"
                                            displayEmpty
                                            multiple={true}
                                            value={tags}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { tags: e.target.value }) })}>
                                        
                                            {availableTags.map((tag, index) => (
                                                <MenuItem key={index} value={tag.title}>{tag.title}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={6}>
                                    <TextField
                                        id="street"
                                        label="Indirizzo"
                                        type="text"
                                        fullWidth
                                        value={street}
                                        onChange={(e) => this.handleEvent(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="city"
                                        label="Città"
                                        type="text"
                                        fullWidth
                                        value={city}
                                        onChange={(e) => this.handleEvent(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="link"
                                        label="Link"
                                        type="text"
                                        fullWidth
                                        value={link}
                                        onChange={(e) => this.handleEvent(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="isPublic-label">Accessibilità</InputLabel>
                                        <Select
                                            labelId="isPublic-label"
                                            value={isPublic}
                                            onChange={(e) => this.setState({ event: Object.assign({}, this.state.event, { isPublic: e.target.value }) })}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="false">Riservato</MenuItem>
                                            <MenuItem value="true">Pubblico</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        id="description"
                                        type="text"
                                        label="Descrizione"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={description}
                                        onChange={(e) => this.handleEvent(e)}
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
                    <Alert severity={this.state.alert.type}>
                        {message}
                    </Alert>
                </Snackbar>
            </React.Fragment>
        )
    }

}

export default Event