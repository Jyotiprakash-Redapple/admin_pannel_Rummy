import React, { useState, useEffect} from "react";
import styles from "./UserRoleManagement.module.css";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput
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
  //console.log(roleList, "roleList")
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
           <label>Status</label>
        <select className={styles.select}  value={statusFilter}
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

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ACTION</th>
            {/* <th>ADMIN NAME</th>
            <th>USERNAME</th> */}
            <th>ROLE</th>
            {/* <th>CONTACT</th>
            <th>EMAIL</th> */}
            <th>STATUS</th>
            <th></th>
                   <th>MANAGE PERMISSION</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.role_id}>
              <td>
                {/* <button className={styles.iconBtn}>🔑</button> */}
                <button className={styles.deleteBtn} onClick={()=>DeleteRoleToServer(u.role_id)}><i className="fa fa-trash-o"></i></button>
                <button className={styles.editBtn} onClick={() => {
                  setUpdateRole({ ...u })
                  setUpdateVisible(true)
                  setVisible(false)
                }}><i className="fa fa-edit"></i></button>
              </td>
              {/* <td>{u.admin_name}</td>
              <td>{u.username}</td> */}
              <td>{u.role_name}</td>
              {/* <td>{u.contact}</td>
              <td>{u.email}</td> */}
              <td>
                <span className={u.role_status === 'active'? styles.statusLabelSuccess : styles.statusLabelDanger }>{u.role_status }</span>
              
              </td>
              <td>  <label className={styles.switch}>
                  <input type="checkbox" defaultChecked={u.role_status == 'active' ? true : false} onChange={(e) => {
                   // |=|=|=|=|=| console.log(e.target.checked, "value")
                    UpdateRoleToServer(u.role_id, u.role_name,e.target.checked ? 'active': 'inactive' )
                  }}/>
                  <span className={styles.slider}></span>
                </label></td>
              <td><button className={styles.select} onClick={()=>navigate('/manage-permission')}>Manage Permission</button></td>
            </tr>
          ))}
        </tbody>
      </table>


      
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


