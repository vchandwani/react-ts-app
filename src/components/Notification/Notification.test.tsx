import React from 'react';
import { fireEvent, render, cleanup } from '@testing-library/react';
import Notification from './Notification';
import { NotificationType } from '../../types/post/data';

afterEach(cleanup);

describe('Notification component loaded ', () => {
  test('alert box is hidden', () => {
    const { getByTestId } = render(<Notification notificationMsg="" />);
    expect(getByTestId('notificaitonCollapseDiv')).toBeTruthy();
    const alertContent = getByTestId('notificaitonCollapseDiv');
    expect(alertContent.className).toContain('MuiCollapse-hidden');
    expect(alertContent.innerHTML).toContain('');
  });

  test('displays info alert box with notification messaage Alert notitfication text', () => {
    const { getByTestId } = render(
      <Notification open={true} notificationMsg="Alert notitfication" />
    );
    expect(getByTestId('notificationDiv')).toBeTruthy();
    expect(getByTestId('notificaitonCollapseDiv')).toBeTruthy();
    const alertContent = getByTestId('alertContent');
    expect(alertContent.innerHTML).toContain('Alert notitfication');
    expect(alertContent.className).toContain('MuiAlert-standardInfo');
  });

  test('displays success alert box with notification messaage Success notitfication text', () => {
    const { getByTestId } = render(
      <Notification
        open={true}
        notificationMsg="Success notitfication"
        notificationType={NotificationType.SUCCESS}
      />
    );
    expect(getByTestId('notificationDiv')).toBeTruthy();
    expect(getByTestId('notificaitonCollapseDiv')).toBeTruthy();
    const alertContent = getByTestId('alertContent');
    expect(alertContent.innerHTML).toContain('Success notitfication');
    expect(alertContent.className).toContain('MuiAlert-standardSuccess');
  });

  test('displays error alert box with notification messaage Error notitfication text', () => {
    const { getByTestId } = render(
      <Notification
        open={true}
        notificationMsg="Error notitfication"
        notificationType={NotificationType.ERROR}
      />
    );
    expect(getByTestId('notificationDiv')).toBeTruthy();
    expect(getByTestId('notificaitonCollapseDiv')).toBeTruthy();
    const alertContent = getByTestId('alertContent');
    expect(alertContent.innerHTML).toContain('Error notitfication');
    expect(alertContent.className).toContain('MuiAlert-standardError');
  });

  test('alert box hides on click of close icon', () => {
    const { getByTestId } = render(
      <Notification
        open={true}
        notificationMsg="Error notitfication"
        notificationType={NotificationType.ERROR}
      />
    );
    expect(getByTestId('closeIcon')).toBeTruthy();
    const closeIcon = getByTestId('closeIcon');
    fireEvent.click(closeIcon);
    const alertContent = getByTestId('notificaitonCollapseDiv');
    expect(alertContent.className).not.toContain('MuiCollapse-entered');
  });

  test('displays warning alert box with notification messaage Warning notitfication text', () => {
    const { getByTestId } = render(
      <Notification
        open={true}
        notificationMsg="Warning notitfication"
        notificationType={NotificationType.WARNING}
      />
    );
    expect(getByTestId('notificationDiv')).toBeTruthy();
    expect(getByTestId('notificaitonCollapseDiv')).toBeTruthy();
    expect(getByTestId('notificaitonCol')).toBeTruthy();
    const alertContent = getByTestId('alertContent');
    expect(alertContent.innerHTML).toContain('Warning notitfication');
    expect(alertContent.className).toContain('MuiAlert-standardWarning');
    expect(getByTestId('buttonIcon')).toBeTruthy();
    const buttonIcon = getByTestId('buttonIcon');
    fireEvent.click(buttonIcon);
    expect(alertContent.className).not.toContain('MuiCollapse-entered');
  });
});
