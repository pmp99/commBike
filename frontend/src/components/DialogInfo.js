import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";

export default class DialogInfo extends Component {
    handleClose(){
        this.props.handleClose()
    }

    render() {
        return(
            <Dialog
                open={this.props.open}
                onClose={this.handleClose.bind(this)}
                maxWidth="xs"
            >
                <DialogTitle>
                    <div style={{display: "flex"}}>
                        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
                            Tarifas
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        El uso del servicio de alquiler de bicicletas commBike está sujeto a una tarifa
                        fija de 1€ por viaje y un coste por minuto de 0,25€. Podrás ver el precio final
                        al concluir tu viaje.<br/><br/>
                        Coste final: 1€ + 0,25€/min
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        );
    }
}