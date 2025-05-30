import { createSlice, current } from "@reduxjs/toolkit";
import { useNavigate } from 'react-router-dom'

const initialState = {
    user: {},
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
        signOut: (state, action) => {
            // state.user = {};
            // state.currency = [];
            // state.select_currency = "";
            // state.currency_amount = '';
            // state.isLoggedIn = false;
            // state.sidebarShow = true;
            const savedUsername = localStorage.getItem("rememberedUsername");
            const savedPassword = localStorage.getItem("rememberedPassword");

            localStorage.clear();
            localStorage.setItem("rememberedUsername", savedUsername);
            localStorage.setItem("rememberedPassword", savedPassword);
            localStorage.setItem("rememberMe", "true");
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
    ,selectedCurrencyAccountDetails
} =
    SuperAdminDetailStateSlice.actions;

export default SuperAdminDetailStateSlice.reducer;
