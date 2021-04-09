import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Input from "@material-ui/core/Input";
import InputLabel from '@material-ui/core/InputLabel';

export default class DialogCode extends Component {
    handleClose(value){
        this.props.handleClose(value)
    }

    handleChangeCode(event){
        this.props.handleChangeCode(event)
    }

    render() {
        return(
            <Dialog
                open={this.props.open}
                onClose={this.handleClose.bind(this, false)}
                maxWidth="xs"
            >
                <DialogTitle>
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Introducir código bicicleta
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <InputLabel>Código</InputLabel>
                    <Input
                        value={this.props.code}
                        onChange={this.handleChangeCode.bind(this)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this, true)} color="primary" disabled={this.props.code.length === 0}>
                        Comenzar viaje
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}