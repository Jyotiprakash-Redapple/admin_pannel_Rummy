import React, { useState, useEffect} from "react";
import styles from "./UserRoleManagement.module.css";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge ,
  CFormInput
} from "@coreui/react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,

} from "@coreui/react";
import { useSelector } from "react-redux";
import RouteURL from "../../../apis/ApiURL";
import Service from "../../../apis/Service";
import { ToastContainer, toast } from 'react-toastify';
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { useNavigate } from "react-router-dom";
const users = [
  {
    id: 1,
    adminName: "Superadmin",
    username: "superadmin",
    role: "--",
    contact: "",
    email: "superadmin@plexmed.com",
    status: true
  },
  {
    id: 2,
    adminName: "Finance",
    username: "khusir_finance",
    role: "finance",
    contact: "7896541236",
    email: "xx@redapple.com",
    status: true
  },
  {
    id: 3,
    adminName: "Ankush",
    username: "ankush",
    role: "Manager",
    contact: "94854854858",
    email: "ankush.shome@redappletech.com",
    status: true
  }
];

const UserRoleManagement = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false);
  const [newRole, setNewRole] = useState("");
  const token = useSelector((state) => state.user.token);
  const [roleList, setRoleList] = useState([])
  const [statusFilter, setStatusFilter] = useState("All");
  const [updateVisible, setUpdateVisible] = useState(false);
  const [updateRole, setUpdateRole]=useState({})
  const [getAllMenu, setGetAllMenu]=useState([])

  
  const filteredUsers = roleList.filter((u) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return u.status === 'active';
    if (statusFilter === "Inactive") return u.status === 'inactive';
    return true;
  });

  const FetchRoleListDetails = () => {
         
  
          Service.apiGetCallRequest(RouteURL.get_all_role,token)
              .then((res) => {
  
  
                console.log(res.data.roles)
                  if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
  
                      setRoleList(res.data.roles)
                     
  
                  } else {
                      toast.error(res.message, {
                          position: 'bottom-right',
                          autoClose: false,
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.message || 'unable to fetch role list', {
                      position: 'bottom-right',
                      autoClose: false,
                  });
  
              });
  }
  const addRoleToServer = () => {
     let params = JSON.stringify({
            "role_name": newRole
        })

    if (!newRole.trim()) {
      toast.error('add new role ', {
                    position: 'bottom-right',
                    autoClose: false,
      });
      return;
    }
        Service.apiPostCallRequest(RouteURL.add_role, params, token)
          .then((res) => {
              setNewRole("");
            setVisible(false);
            
              toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
              });
            FetchRoleListDetails()
            })
            .catch((error) => {
                toast.error(error?.response?.message || 'unable to add role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }
 

  const UpdateRoleToServer = (id, name, status) => {
     let params = JSON.stringify({
           "role_id": id, role_name: name, status
        })

        Service.apiPostCallRequest(RouteURL.edit_role, params, token)
          .then((res) => {
            console.log(res, 'res')
            FetchRoleListDetails()
            setUpdateVisible(false)
            toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            })
            .catch((error) => {
              toast.error(error?.response?.message || 'unable to update role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }

   const DeleteRoleToServer = (id, name, status) => {
     let params = JSON.stringify({
           "role_id": id, role_name: name, status
        })

        Service.apiPostCallRequest(RouteURL.delete_role, params, token)
          .then((res) => {
             
            FetchRoleListDetails()
              toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            })
            .catch((error) => {
                toast.error(error?.response?.message || 'unable to delete role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }

  const getAllMenuFromServer =()=>{
      Service.apiGetCallRequest(RouteURL.get_all_menu,token)
              .then((res) => {
  
  
                console.log(res.data)
                  if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
  
                    setGetAllMenu(res.data.roles)
                     
  
                  } else {
                      toast.error(res.message, {
                          position: 'bottom-right',
                          autoClose: false,
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.message || 'unable to fetch menu list', {
                      position: 'bottom-right',
                      autoClose: false,
                  });
  
              });
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-coreui-theme', 'light');
    FetchRoleListDetails()
    getAllMenuFromServer()
  },[])
  return (
    <div className={styles.container}>
       <ToastContainer />
      <div className={styles.filter}>
        <div>
           <label htmlFor="status_id" className="form-label">Status</label>
        <select  className="form-select"
        id="status_id" value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        </div>
        <CButton color="primary"  onClick={() => setVisible(true)}>
          Add Role
          </CButton>

       
      </div>

     <div className='table-responsive'>
  <CTable hover bordered responsive>
    <CTableHead className='table-primary text-center align-middle'>
      <CTableRow>
        <CTableHeaderCell scope='col'>Actions</CTableHeaderCell>
        <CTableHeaderCell scope='col'>Role Name</CTableHeaderCell>
        <CTableHeaderCell scope='col'>Status</CTableHeaderCell>
        {/* <CTableHeaderCell scope='col'>Toggle Status</CTableHeaderCell> */}
        <CTableHeaderCell scope='col'>Permissions</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((u, index) => (
          <CTableRow key={u.role_id || index}>
            {/* Actions: Delete / Edit */}
            <CTableDataCell className='text-center'>
              <button className={styles.deleteBtn}
                onClick={() => DeleteRoleToServer(u?.role_id)}
              >
                <i className="fa fa-trash-o"></i>
              </button>
              <button
                className={styles.editBtn}
                onClick={() => {
                  
                  setUpdateRole({ ...u });
                  setUpdateVisible(true);
                  setVisible(false);
                }}>
                <i className="fa fa-edit"></i>
              </button>
            </CTableDataCell>

            {/* Role Name */}
            <CTableDataCell className='text-center'>{u.role_name}</CTableDataCell>

            {/* Status Label */}
            <CTableDataCell className='text-center'>
              

              <CBadge color={u.role_status === 'active' ? 'success' : 'danger'} onClick={() => {

                 UpdateRoleToServer(u.role_id, u.role_name, u.role_status === 'active' ? 'inactive' : 'active');
                }} style={{cursor: 'pointer'}}>
                {u.role_status === 'active' ? 'Active' : 'InActive'}
             
                        </CBadge>
            </CTableDataCell>

            {/* Toggle */}
            {/* <CTableDataCell className='text-center'>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  defaultChecked={u.role_status === 'active'}
                  onChange={(e) => {
                    UpdateRoleToServer(u.role_id, u.role_name, e.target.checked ? 'active' : 'inactive');
                  }}
                />
                <span className={styles.slider}></span>
              </label>
            </CTableDataCell> */}

            {/* Permissions Button */}
            <CTableDataCell className='text-center'>
              <button className={styles.select} onClick={() => navigate('/manage-permission')}>
                Manage Permission
              </button>
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan={5} className='text-center'>
            No roles found
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>


      
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add New Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Role Name"
            placeholder="Enter role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={addRoleToServer}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>


      <CModal visible={updateVisible} onClose={() => setUpdateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Update Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            label="Role Name"
            placeholder="Enter role"
            value={updateRole?.role_name}
            onChange={(e) => {
              setUpdateRole((prev) => {
                return {
                  ...prev,
                  role_name: e.target.value
                }
              })
            
            }
            }
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setUpdateVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={()=>UpdateRoleToServer(updateRole.role_id, updateRole.role_name, updateRole.role_status)}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default UserRoleManagement;


