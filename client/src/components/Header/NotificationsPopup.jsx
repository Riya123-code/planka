import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { withPopup } from '../../lib/popup';
import { Popup } from '../../lib/custom-ui';

import Paths from '../../constants/Paths';
import { ActivityTypes } from '../../constants/Enums';
import User from '../User';

import styles from './NotificationsPopup.module.scss';

const NotificationsStep = React.memo(({ items, onDelete, onClose }) => {
  const [t] = useTranslation();

  const handleDelete = useCallback(
    (id) => {
      onDelete(id);
    },
    [onDelete],
  );

  const renderItemContent = useCallback(
    ({ activity, card }) => {
      switch (activity.type) {
        case ActivityTypes.MOVE_CARD:
          return (
            <Trans
              i18nKey="common.userMovedCardFromListToList"
              values={{
                user: activity.user.name,
                card: card.name,
                fromList: activity.data.fromList.name,
                toList: activity.data.toList.name,
              }}
            >
              {activity.user.name}
              {' moved '}
              <Link to={Paths.CARDS.replace(':id', card.id)} onClick={onClose}>
                {card.name}
              </Link>
              {' from '}
              {activity.data.fromList.name}
              {' to '}
              {activity.data.toList.name}
            </Trans>
          );
        case ActivityTypes.COMMENT_CARD:
          return (
            <Trans
              i18nKey="common.userLeftNewCommentToCard"
              values={{
                user: activity.user.name,
                comment: activity.data.text,
                card: card.name,
              }}
            >
              {activity.user.name}
              {` left a new comment «${activity.data.text}» to `}
              <Link to={Paths.CARDS.replace(':id', card.id)} onClick={onClose}>
                {card.name}
              </Link>
            </Trans>
          );
        default:
      }

      return null;
    },
    [onClose],
  );

  return (
    <>
      <Popup.Header>
        {t('common.notifications', {
          context: 'title',
        })}
      </Popup.Header>
      <Popup.Content>
        {items.length > 0
          ? items.map((item) => (
              <div key={item.id} className={styles.wrapper}>
                {item.card && item.activity ? (
                  <>
                    <User
                      name={item.activity.user.name}
                      avatarUrl={item.activity.user.avatarUrl}
                      size="large"
                    />
                    <span className={styles.content}>{renderItemContent(item)}</span>
                  </>
                ) : (
                  <div className={styles.deletedContent}>{t('common.cardOrActionAreDeleted')}</div>
                )}
                <Button
                  type="button"
                  icon="close"
                  className={styles.button}
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            ))
          : t('common.noUnreadNotifications')}
      </Popup.Content>
    </>
  );
});

NotificationsStep.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withPopup(NotificationsStep, {
  position: 'bottom right',
});
