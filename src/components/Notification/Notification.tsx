import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { NotificationType } from '../../types/article/data';

interface NotificationProps {
  open: boolean;
  notificationType: NotificationType;
  notificationMsg: string;
}

const Notification = ({
  open = false,
  notificationType = NotificationType.INFO,
  notificationMsg,
}: NotificationProps): JSX.Element => {
  const [notificationOpen, setNotificationOpen] = useState<boolean>(open);
  return (
    <Row>
      <Col xs={12}>
        <Collapse in={notificationOpen}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setNotificationOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity={notificationType}
          >
            {notificationMsg}
          </Alert>
        </Collapse>
      </Col>
    </Row>
  );
};

export default Notification;
