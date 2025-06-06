import React, {JSXElementConstructor, useContext} from 'react';
import {GroupAddIcon} from '@ui/icons/material/GroupAdd';
import {PeopleIcon} from '@ui/icons/material/People';
import {FileDownloadDoneIcon} from '@ui/icons/material/FileDownloadDone';
import {
  DatabaseNotification,
  DatabaseNotificationAction,
} from './database-notification';
import {MixedImage} from '@ui/images/mixed-image';
import {Button} from '@ui/buttons/button';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Line} from '@common/notifications/notification-line';
import clsx from 'clsx';
import {useMarkNotificationsAsRead} from '@common/notifications/requests/use-mark-notifications-as-read';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {isAbsoluteUrl} from '@ui/utils/urls/is-absolute-url';
import {Link} from 'react-router-dom';
import {useSettings} from '@ui/settings/use-settings';
import {SvgIconProps} from '@ui/icons/svg-icon';

const iconMap = {
  'group-add': GroupAddIcon,
  people: PeopleIcon,
  'export-csv': FileDownloadDoneIcon,
} as Record<string, JSXElementConstructor<SvgIconProps>>;

interface NotificationListProps {
  notifications: DatabaseNotification[];
  className?: string;
}
export function NotificationList({
  notifications,
  className,
}: NotificationListProps) {
  const {notifications: config} = useContext(SiteConfigContext);

  return (
    <div className={className}>
      {notifications.map((notification, index) => {
        const isLast = notifications.length - 1 === index;
        const Renderer =
          config?.renderMap?.[notification.type] || NotificationListItem;
        return (
          <Renderer
            key={notification.id}
            notification={notification}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
}

export interface NotificationListItemProps {
  notification: DatabaseNotification;
  onActionButtonClick?: ButtonActionsProps['onActionClick'];
  lineIconRenderer?: JSXElementConstructor<{icon: string}>;
  isLast: boolean;
}
export function NotificationListItem({
  notification,
  onActionButtonClick,
  lineIconRenderer,
  isLast,
}: NotificationListItemProps) {
  const markAsRead = useMarkNotificationsAsRead();
  const navigate = useNavigate();
  const mainAction = notification.data.mainAction;

  const showUnreadIndicator = !notification.data.image && !notification.read_at;

  return (
    <div
      onClick={() => {
        if (!markAsRead.isPending && !notification.read_at) {
          markAsRead.mutate({ids: [notification.id]});
        }
        if (mainAction?.action) {
          if (isAbsoluteUrl(mainAction.action)) {
            window.open(mainAction.action, '_blank')?.focus();
          } else {
            navigate(mainAction.action);
          }
        }
      }}
      className={clsx(
        'relative flex items-start gap-14 bg-alt px-32 py-20',
        !isLast && 'border-b',
        mainAction?.action && 'cursor-pointer',
        !notification.read_at
          ? 'bg-paper hover:bg-primary/10'
          : 'hover:bg-hover',
      )}
      title={mainAction?.label ? mainAction.label : undefined}
    >
      {showUnreadIndicator && (
        <div className="absolute left-16 top-26 h-8 w-8 flex-shrink-0 rounded-full bg-primary shadow" />
      )}
      {notification.data.image && (
        <MixedImage
          className="h-24 w-24 flex-shrink-0 text-muted"
          src={iconMap[notification.data.image] || notification.data.image}
        />
      )}
      <div className="min-w-0">
        {notification.data.lines.map((line, index) => (
          <Line
            iconRenderer={lineIconRenderer}
            notification={notification}
            line={line}
            index={index}
            key={index}
          />
        ))}
        <ButtonActions
          onActionClick={onActionButtonClick}
          notification={notification}
        />
      </div>
    </div>
  );
}

interface ButtonActionsProps {
  notification: DatabaseNotification;
  onActionClick?: (
    e: React.MouseEvent,
    action: DatabaseNotificationAction,
  ) => void;
}
function ButtonActions({notification, onActionClick}: ButtonActionsProps) {
  const {base_url} = useSettings();
  if (!notification.data.buttonActions) return null;

  // if there's no action handler provided, assume action is internal url and render a link
  return (
    <div className="mt-12 flex items-center gap-12">
      {notification.data.buttonActions.map((action, index) => (
        <Button
          key={index}
          size="xs"
          variant={index === 0 ? 'flat' : 'outline'}
          color={index === 0 ? 'primary' : null}
          elementType={!onActionClick ? Link : undefined}
          to={!onActionClick ? action.action.replace(base_url, '') : undefined}
          onClick={e => {
            onActionClick?.(e, action);
          }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
