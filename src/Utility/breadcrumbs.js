
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import { memo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// const Route_URL = {
//     arrRoutesDetails: [{
//         id: [
//             "/client-list",
//         ],
//         details: [
//             { pathname: "/client-list", name: "Client List", page:0},
//             { pathname: "/client-account", name: "Client Account", page: 1},

//         ],
//     },{
//         id: [
//             "/client-list1",
//         ],
//         details: [
//             { pathname: "/client-list1", name: "Client List", page: 0 },
//             { pathname: "/client-account1", name: "Client Account", page: 1 },

//         ],  
//     }
//     ]
// }
// export default Route_URL;
const Route_URL = {
    arrRoutesDetails: [
        { pathname: "/client-list", name: "Client List", page: 0, exact: true, },
        { pathname: "/client-account", name: "Client Account", page: 1 },
        { pathname: '/client-manage-account', name: 'Manage Account', page: 2 },
        { pathname: "/client-list1", name: "Client List1", page: 0, exact: true, },
        { pathname: "/client-account1", name: "Client Account1", page: 1 },


    ]
}
export default Route_URL;

const Bread_crumbs = () => {
    const location = useLocation();
    return (

        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/dashboard' : '/cl/dashboard'}>Home</a></li>
                {Route_URL?.arrRoutesDetails.splice(obj => (0, obj.page)).map((breadcrumb, index) => {
                    return (
                        <li class="breadcrumb-item active" aria-current="page" key={breadcrumb?.page === index}>
                            <a href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? breadcrumb.pathname : '/cl' + breadcrumb.pathname}>{breadcrumb.name}</a>
                        </li>
                    )
                })}

            </ol>
        </nav>
        // <CBreadcrumb className="my-0">
        //     <CBreadcrumbItem href={import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? '/dashboard' : '/aggregator-superadmin/dashboard'}>Home</CBreadcrumbItem>

        //     {Route_URL.arrRoutesDetails.map((breadcrumb, index) => {
        //         return (
        //             <CBreadcrumbItem
        //                 {...(breadcrumb.active ? { active: true } : { href: import.meta.env.VITE_APP_PLATFORM_ENVIROMENT == 'development' ? breadcrumb.pathname : '/aggregator-superadmin' + breadcrumb.pathname })}
        //                 key={breadcrumb?.page === index}
        //             >
        //                 {breadcrumb.name}
        //             </CBreadcrumbItem>
        //         )
        //     })}
        // </CBreadcrumb>
    )
}
export const Breadcrumbs = memo(Bread_crumbs);