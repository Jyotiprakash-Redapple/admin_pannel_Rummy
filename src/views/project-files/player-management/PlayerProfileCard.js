import React from 'react';
import styles from './UserInfoCard.module.css';
import { CCard, CCardBody, CButton } from '@coreui/react';

const UserInfoCard = ({ user }) => {
  return (
    <CCard className={styles.card}>
      <CCardBody>
        <div className={styles.row}>
          <span>PAN Number</span>
          <span className={styles.value}>XXX</span>
        </div>
        <div className={styles.row}>
          <span>AADHAR Number</span>
          <span className={styles.value}>XXX</span>
        </div>
        <div className={styles.row}>
          <span>Last Login</span>
          <span className={styles.link}>29/05/2025 10:48:08 AM</span>
        </div>
        <div className={styles.row}>
          <span>Reg. Date</span>
          <span className={styles.link}>29/05/2025 10:48:05 AM</span>
        </div>
        <div className={styles.row}>
          <span>App Version</span>
          <span className={styles.value}>5.4.8</span>
        </div>
        <div className={styles.row}>
          <span>State</span>
          <span className={styles.link}>Chhattisgarh</span>
        </div>
        <div className={styles.row}>
          <span>Remark</span>
        </div>

        <div className={styles.buttons}>
          <CButton color="danger" className={styles.button}>
            Deactivate
          </CButton>
          <CButton color="info" className={styles.button}>
            Add Money
          </CButton>
          <CButton color="danger" className={styles.button}>
            Deduct Money
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default UserInfoCard;
