import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit'

class MyTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            classes: {
                table: {
                    minWidth: 650,
                }
            }
        }
    }

    render() {

        const { columns, data, editHandle, deleteHandle } = this.props

        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell align="left">{column.headerName}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column, i) => (

                                    i === (columns.length - 1) ? (
                                        <TableCell key={`tableRow${index}${i}`} align="left">
                                            <IconButton aria-label="edit" key={`editButton${index}${i}`} onClick={() => editHandle(row['id'])}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" key={`deleteButton${index}${i}`} onClick={() => deleteHandle(row['id'])}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    ) : (
                                            Array.isArray(row[column.field]) ? (
                                                <TableCell key={`tableRow${index}${i}`} align="left">
                                                    {row[column.field].map((item) => (
                                                        <Chip style={{ margin: "5px" }} label={item} />
                                                    ))}
                                                </TableCell>
                                            ) : (
                                                    <TableCell key={`tableRow${index}${i}`} align="left">{row[column.field]}</TableCell>
                                                )
                                        )


                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

}

export default MyTable;