import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { NotificationType } from '../../types/post/data';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

interface NotificationProps {
  open: boolean;
  notificationMsg: string;
  notificationType?: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({
  open = false,
  notificationMsg,
  notificationType = NotificationType.INFO,
}) => {
  const [notificationOpen, setNotificationOpen] = useState<boolean>(open);
  useEffect(() => {
    setNotificationOpen(open);
  }, [open]);
  const styles = useStyles();
  return (
    <Row data-testid="notificationDiv" className={styles.root}>
      <Col xs={12} data-testid="notificaitonCol">
        <Collapse in={notificationOpen} data-testid="notificaitonCollapseDiv">
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setNotificationOpen(false);
                }}
                data-testid="buttonIcon"
              >
                <CloseIcon fontSize="inherit" data-testid="closeIcon" />
              </IconButton>
            }
            severity={notificationType}
            data-testid="alertContent"
          >
            {notificationMsg}
          </Alert>
        </Collapse>
      </Col>
    </Row>
  );
};

export default Notification;
