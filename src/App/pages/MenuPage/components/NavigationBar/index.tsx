import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Menu, MenuProps } from '@ui';

import { ROUTES } from '../../../../constants/routes';

import { MenuItem } from '../../types';

export const NavigationBar: React.FC = () => {
  const { testId, menuId } = useParams();

  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      label: 'Профиль',
      key: MenuItem.Profile,
    },
    {
      label: 'Задания',
      key: MenuItem.Quests,
    },
    {
      label: 'Радио',
      key: MenuItem.Radio,
    },
  ];

  const onClick: MenuProps['onClick'] = (info) => {
    const currentTestId = testId ? { testId } : {};

    navigate(generatePath(ROUTES.MAIN, { ...currentTestId, menuId: info.key }));
  };

  return (
    <Menu
      items={items}
      mode="horizontal"
      selectedKeys={[menuId || MenuItem.Profile]}
      onClick={onClick}
    />
  );
};
