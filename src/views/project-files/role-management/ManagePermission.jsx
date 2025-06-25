
import React, { useState, useEffect } from 'react';
import styles from './ManagePermission.module.css';
import { useSelector } from "react-redux";
import RouteURL from "../../../apis/ApiURL";
import Service from "../../../apis/Service";
import { ToastContainer, toast } from "react-toastify";
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,

} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronRight, cilChevronBottom } from '@coreui/icons';
import { createFeatureFlags } from '../../../Utility/helper';
import { PageLoader } from '../../../components/Loder';
const ManagePermission = () => {
  const navigate = useNavigate()
  const loaction = useLocation()
  const [menu, setMenu] = useState([])
  const token = useSelector((state) => state.user.token);
  const activeMenuId = useSelector((state) => state.active_menu_id)
  const menuPermission = useSelector((state) => state.menu_permission)
  const [accessMenu, setAccessMenu] = useState(null)
  const handleFeatureCheckbox = (fId, fName) => {
    const updated = menu.map((item) => {

      let newItem = { ...item };


      if (Array.isArray(newItem.permissions)) {
        newItem.permissions = newItem.permissions.map((p) =>
          p.feature_id === fId ? { ...p, is_check: !p.is_check } : p
        );
      }


      if (Array.isArray(newItem.children)) {
        newItem.children = newItem.children.map((child) => {
          let newChild = { ...child };

          if (Array.isArray(newChild.permissions)) {
            newChild.permissions = newChild.permissions.map((cp) =>
              cp.feature_id === fId ? { ...cp, is_check: !cp.is_check } : cp
            );
          }

          return newChild;
        });
      }

      return newItem;
    });

    setMenu(updated);
  };


  const toggleExpand = (index) => {
    const updated = [...menu];
    updated[index].isExpanded = !updated[index].isExpanded;

    setMenu(updated);
  };



  function FormatServerMenuToClientView(rawMenus) {
    const transformFeatureList = (features) => {
      if (!features) return null;
       
      const perms = [];

      features.forEach(f => {
       console.log(f, "F")
        let ft = {
          feature_id: f.feature_id,
          feature_name: f.feature_name,
          is_check: f.ischecked === true || f.ischecked === 'true'
        }
        perms.push(ft)
        // perms[f.feature_name] = true;
      });
      return perms;
    };

    const transformed = rawMenus.map(menu => {
      const parentNav = menu.parent_menu_name.toLowerCase().replace(/\s+/g, '_');
      const parent_menu = menu.parent_menu_name;
      const parent_menu_id = menu.menu_parent_id;
      const children = (menu.child_menus || []).map(child => ({
        child_menu_id: child.menu_id,
        //nav: child.menu_name.toLowerCase().replace(/\s+/g, '_'),
        child_menu_name: child.menu_name,
        permissions: transformFeatureList(child.features),
      }));

      // If there's only 1 child and it has the same name as the parent, lift permissions to parent
      const isSelfChild = children.length === 1 && children[0].child_menu_id === parent_menu_id;

      return {
        parent_menu_id,
        //nav: parentNav,
        parent_manu_name: parent_menu,
        isExpanded: children.length > 0,
        children: isSelfChild ? undefined : children,
        permissions: isSelfChild ? children[0].permissions : transformFeatureList(menu.features),
      };
    });


    return transformed
  }




  const convertClientMenuToServerData = (menuData) => {
    const result = [];

    menuData.forEach((item) => {

      if (Array.isArray(item.permissions)) {
        const formattedPermissions = item.permissions.map((p) => ({
          feature_id: p.feature_id,
          prop: p.is_check
        }));

        result.push({
          menu_id: item.parent_menu_id,
          permission: formattedPermissions
        });
      }


      if (Array.isArray(item.children)) {
        item.children.forEach((child) => {
          if (Array.isArray(child.permissions)) {
            const formattedChildPermissions = child.permissions.map((cp) => ({
              feature_id: cp.feature_id,
              prop: cp.is_check
            }));

            result.push({
              menu_id: child.child_menu_id,
              permission: formattedChildPermissions
            });
          }
        });
      }
    });

    return result;
  };
  function getAllMenuFromServer() {

    let params = {
      role_id: loaction.state.role_id,

    }
    Service.apiPostCallRequest(RouteURL.get_all_menu, params, token)
      .then((res) => {
      //  console.log(res, "res:: getAllMenuFromServer");

        if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          let menu = FormatServerMenuToClientView(res.data.menulist)
          console.log(menu, 'hub ----------------------menu====>')
          setMenu(menu)
        } else {
          toast.error(res.message, {
            position: "bottom-right",

          });
        }

      })
      .catch((error) => {
        console.log(error, "ERROR____________________________")
        toast.error(error?.response?.data?.message || "unable to fetch permisssion", {
          position: "bottom-right",

        });
      });
  }



  function handelMenuUpdateServer() {
    let serverMenu = convertClientMenuToServerData(menu)
    console.log(serverMenu, "======>", loaction.state)

    let params = {
      role_id: loaction.state.role_id,
      role_permission: serverMenu
    }

    Service.apiPostCallRequest(RouteURL.save_permission_update_menu, params, token)
      .then((res) => {
        console.log(res, "res");
        getAllMenuFromServer();

        toast.success(res.message, {
          position: "bottom-right",

        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "unable to update role", {
          position: "bottom-right",

        });
      });
  }

  function handleCancel() {
    navigate(-1)
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-coreui-theme", "light");

    getAllMenuFromServer();
  }, []);

  useEffect(() => {
    if (menuPermission.length && activeMenuId) {
      let menu = menuPermission.filter((mId) => mId.menu_id === activeMenuId);
      console.log("MENU PERMISSION::", menu)
      if (menu.length > 0) {
        setAccessMenu(menu[0])
      }
    }
  }, [activeMenuId])

  if (accessMenu === null) {
    return <PageLoader />
  }

  const FEATURE = createFeatureFlags(accessMenu.menu_features)

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className='table-responsive'>
        <CTable hover bordered responsive align="middle" className="text-center">
          <CTableHead className="table-primary">
            <CTableRow>
              <CTableHeaderCell>Navigation</CTableHeaderCell>
              <CTableHeaderCell colSpan={4}>Feature Permissions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {menu.map((m, index) => (
              <React.Fragment key={index}>
                <CTableRow>
                  <CTableDataCell className="text-start">
                    {m.children ? (
                      <button
                        onClick={() => toggleExpand(index)}
                        className={styles.toggleBtn}
                      >
                        <CIcon icon={m.isExpanded ? cilChevronBottom : cilChevronRight} />
                      </button>
                    ) : (
                      <span style={{ width: 20, display: 'inline-block' }}></span> // placeholder for alignment
                    )}
                    <span className="ms-2">{m.parent_manu_name}</span>
                  </CTableDataCell>

                  {m.permissions ? (
                    m.permissions.map((p) => (
                      <CTableDataCell key={p.feature_id}>
                        <input
                          readOnly={FEATURE.isEdit == false}
                          type="checkbox"
                          className={styles.checkbox}
                          checked={p.is_check} 
                          onChange={() =>
                            handleFeatureCheckbox(p.feature_id, p.feature_name)
                          }
                        />{' '}
                        {p.feature_name}
                      </CTableDataCell>
                    ))
                  ) : (
                    <CTableDataCell colSpan={4}>No data found</CTableDataCell>
                  )}
                </CTableRow>

                {/* Render child rows if expanded */}
                {m.children && m.isExpanded &&
                  m.children.map((child, childIndex) => (
                    <CTableRow key={`${index}-${childIndex}`} className={styles.childRow}>
                      <CTableDataCell className="text-start ps-5">
                        <span>{child.child_menu_name}</span>
                      </CTableDataCell>
                      {child.permissions ? (
                        child.permissions.map((cP) => (
                          <CTableDataCell key={cP.feature_id}>
                            <input
                              readOnly={FEATURE.isEdit == false}
                              type="checkbox"
                              className={styles.checkbox}
                              checked={cP.is_check}
                              onChange={() =>
                                handleFeatureCheckbox(cP.feature_id, cP.feature_name)
                              }
                            />{' '}
                            {cP.feature_name}
                          </CTableDataCell>
                        ))
                      ) : (
                        <CTableDataCell colSpan={4}>No data found</CTableDataCell>
                      )}
                    </CTableRow>
                  ))}
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button className={`btn btn-primary ${FEATURE.isEdit === false ? 'prevent_default' : 'auto'}`} onClick={handelMenuUpdateServer}>
          Submit
        </button>
      </div>

    </div>
  );
};

export default ManagePermission;