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

export default class DialogAddBikes extends Component {
    handleClose(value){
        this.props.handleClose(value)
    }

    handleChangeNumber(event){
        this.props.handleChangeNumber(event)
    }

    render() {
        let n = this.props.number
        let disabled = !(n !== Infinity && n > 0 && Math.floor(n) === parseFloat(n))
        return(
            <Dialog
                open={this.props.open}
                onClose={this.handleClose.bind(this, false)}
                maxWidth="xs"
            >
                <DialogTitle>
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Añadir bicicletas
                        </Typography>
                        <Button onClick={this.handleClose.bind(this, false)} color="secondary">
                            <CloseIcon />
                        </Button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <InputLabel>Cantidad</InputLabel>
                    <Input
                        type="number"
                        value={this.props.number}
                        onChange={this.handleChangeNumber.bind(this)}
                        inputProps={{min: 1, step: 1}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this, true)} color="primary" disabled={disabled}>
                        Añadir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}