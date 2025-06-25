import { createSlice, current } from "@reduxjs/toolkit";
import { useNavigate } from 'react-router-dom'

const initialState = {
    user: {},
    limit: 2,
    menu_permission: [],
    active_menu_id: 0,
    isLoggedIn: false,
    type: 'set',
    sidebarShow: true,
    theme: 'light',
    sidebarUnfoldable: false,
    currency: [],
    select_currency: '',
    currency_amount: '',
    client_Details: {},
    client_Account_Details: {},
    provider_Details: {},
    clientAccountTransferBalance: {},
    client_account_details: {},
    wallet_details: {},
    login_details: {},
    player_details: {},
    currency_account_details:{}
};

const SuperAdminDetailStateSlice = createSlice({
    name: "super_admin_details",
    initialState,
    reducers: {
        signIn: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            state.isLoggedIn = true;
        },
        setActiveMenuId: (state, action) => {
            state.active_menu_id = action.payload
        },
        setLimit: (state, action) => {
            console.log(action.payload, "ACTION STARR")
            state.limit = state.limit +  action.payload;  
        },
        clearLimit: (state, action) => {
            console.log(action.payload, "ACTION STARR CLEAR")
            state.limit = initialState.limit
        },
        setMenuPerMission: (state, action) => {
           
          state.menu_permission = action.payload
        },
        signOut: (state, action) => {
            // state.user = {};
            // state.currency = [];
            // state.select_currency = "";
            // state.currency_amount = '';
            // state.isLoggedIn = false;
            // state.sidebarShow = true;
           state = initialState
        },
        sideBarOpen: (state, action) => {
            state.type = 'set';
            state.sidebarShow = action.payload.sidebarShow;
        },
        sideBarClose: (state, action) => {
            state.type = 'set';
            state.sidebarUnfoldable = action.payload.sidebarUnfoldable;
        },
        Currency: (state, action) => {
            state.currency = action.payload;
        },
        SelectCurrency: (state, action) => {
            state.select_currency = action.payload;
        },
        currencyWiseAmount: (state, action) => {
            state.currency_amount = action.payload;
        },
        client: (state, action) => {
            state.client_Details = action.payload;
        },
        client_data_clear: (state, action) => {
            state.client_Details = {}
        },
        account: (state, action) => {
            state.client_Account_Details = action.payload;
        },
        account_data_clear: (state, action) => {
            state.client_Account_Details = {}
        },
        providerStore: (state, action) => {
            state.provider_Details = action.payload;
        },
        clientAccountTransferBalanceDetails: (state, action) => {
            state.clientAccountTransferBalance = action.payload;
        },
        clientAccountDetails: (state, action) => {
            state.client_account_details = action.payload;
        },
        walletDetails: (state, action) => {
            state.wallet_details = action.payload;
        },
        PlayerDetails: (state, action) => {
            state.player_details = action.payload;
        },
        LoginDetails: (state, action) => {
            state.login_details = action.payload;
        },
        

        technicalDetails: (state, action) => {
            state.technical_details = action.payload;
        },

        selectedCurrencyAccountDetails: (state, action) => {
            state.currency_account_details = action.payload;
        },
        
    },
});

export const { signIn, signOut, sideBarOpen, sideBarClose, Currency, SelectCurrency, currencyWiseAmount, client, client_data_clear, account, providerStore, clientAccountTransferBalanceDetails, clientAccountDetails, walletDetails, PlayerDetails, LoginDetails,technicalDetails 
    ,selectedCurrencyAccountDetails,setMenuPerMission, setActiveMenuId, setLimit,  clearLimit
} =
    SuperAdminDetailStateSlice.actions;

export default SuperAdminDetailStateSlice.reducer;
