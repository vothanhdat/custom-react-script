import React from 'react'
import CircularProgress from 'material-ui/Progress/CircularProgress'
import { withStyles } from 'material-ui/styles';




const styles = {
    loadingshadingmui: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "auto",
    },
    loadingshadingmuiEnable:{
        background: "rgba(255, 255, 255, .5)",
    },

    loadingiconmui: {
        position: "absolute",
        fontSize: "20px",
        top: "calc(45% - 10px)",
        left: "calc(50% - 10px)",
    },
    circle:{}
}


const Loading = ({ classes : {loadingshadingmui,loadingshadingmuiEnable,loadingiconmui,...classes} = {}, shading = true , color='primary'}) => (
    <div className={`${loadingshadingmui} ${shading?loadingshadingmuiEnable:""}`}>
        <CircularProgress className={loadingiconmui} color={color} classes={classes}/>
    </div>
);


export default withStyles(styles)(Loading)