import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Collapse, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { NotificationType } from '../../types/article/data';

interface NotificationProps {
  notificationMsg: string;
  open?: boolean;
  notificationType?: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({
  notificationMsg,
  open = false,
  notificationType = NotificationType.INFO,
}) => {
  const [notificationOpen, setNotificationOpen] = useState<boolean>(open);

  return (
    <Row data-testid="notificaitonDiv">
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
