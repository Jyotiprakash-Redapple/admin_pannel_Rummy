// ManagePermission.jsx
import React, { useState } from 'react';
import styles from './ManagePermission.module.css';

const demoPermissions = [
  {
    nav: 'user_management',
    expanded: true,
    children: [
      {
        nav: 'user_role_management',
        permissions: null,
      },
      {
        nav: 'permission_management',
        permissions: null,
      },
    ],
    permissions: {
      add: true,
      edit: true,
      delete: true,
      reset: true,
    },
  },
  { nav: 'role_management', permissions: null },
  { nav: 'wallet', permissions: null },
  { nav: 'client_management', permissions: null },
  { nav: 'provider_management', permissions: null },
  { nav: 'report_management', permissions: null },
  { nav: 'player_management', permissions: null },
  { nav: 'game_management', permissions: null },
  { nav: 'assign_inactive_providers', permissions: null },
  { nav: 'assign_inactive_games', permissions: null },
  { nav: 'search_user', permissions: null },
];

const ManagePermission = () => {
  const [data, setData] = useState(demoPermissions);

  const handleCheckbox = (nav, type) => {
    const updated = data.map(item => {
      if (item.nav === nav && item.permissions) {
        return {
          ...item,
          permissions: {
            ...item.permissions,
            [type]: !item.permissions[type],
          },
        };
      }
      return item;
    });
    setData(updated);
  };

  const toggleExpand = (index) => {
    const updated = [...data];
    updated[index].expanded = !updated[index].expanded;
    setData(updated);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Navigation</th>
            <th colSpan={4}>Feature Permission</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className={styles.navCell}>
                  {item.children && (
                    <button onClick={() => toggleExpand(index)} className={styles.toggleBtn}>
                      {item.expanded ? '-' : '+'}
                    </button>
                  )}
                  <input type="checkbox" checked readOnly />
                  <span>{item.nav}</span>
                </td>
                {item.permissions ? (
                  <>
                    <td><input type="checkbox" className={styles.checkbox} checked={item.permissions.add} onChange={() => handleCheckbox(item.nav, 'add')} /> add user</td>
                    <td><input type="checkbox" className={styles.checkbox} checked={item.permissions.edit} onChange={() => handleCheckbox(item.nav, 'edit')} /> edit user</td>
                    <td><input type="checkbox" className={styles.checkbox} checked={item.permissions.delete} onChange={() => handleCheckbox(item.nav, 'delete')} /> delete user</td>
                    <td><input type="checkbox" className={styles.checkbox} checked={item.permissions.reset} onChange={() => handleCheckbox(item.nav, 'reset')} /> reset password</td>
                  </>
                ) : (
                  <td colSpan={4}></td>
                )}
              </tr>
              {item.children && item.expanded && item.children.map((child, childIndex) => (
                <tr key={`${index}-${childIndex}`} className={styles.childRow}>
                  <td className={styles.childCell}>
                    <input type="checkbox" checked readOnly />
                    <span>{child.nav}</span>
                  </td>
                  <td colSpan={4}></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePermission;