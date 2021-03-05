import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

interface BackDropProps {
  open?: boolean;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

const BackDrop: React.FC<BackDropProps> = ({ open = false }) => {
  const classes = useStyles();

  return (
    <>
      <Backdrop
        className={classes.backdrop}
        open={open}
        data-testid="backdropDiv"
      >
        <CircularProgress color="inherit" data-testid="circularDiv" />
      </Backdrop>
    </>
  );
};

export default BackDrop;
