import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import localStorageService from '/src/components/common/localStorageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const serviceBase = 'https://ava.apinet.airpocket.app/';
    const [authentication, setAuthentication] = useState({
        isAuth: false,
        userName: '',
        useRefreshTokens: false,
    });

    const [externalAuthData, setExternalAuthData] = useState({
        provider: '',
        userName: '',
        externalAccessToken: '',
    });

    const logOut = () => {
        localStorageService.remove('authorizationData');
        localStorageService.remove('userData');
        setAuthentication({ isAuth: false, userName: '', useRefreshTokens: false });
        window.location.href = '/login';
    };

    const saveRegistration = async (registration) => {
        logOut();
        try {
            const response = await axios.post(`${serviceBase}api/account/register`, registration);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const getCEO = () => {
        const ceo = localStorageService.get('ceo');
        if (ceo) {
            return {
                userName: 'ceo',
                password: ceo.Password,
            };
        }
        return null;
    };

    const changeTel = async (entity) => {
        try {
            const response = await axios.post('https://fleet.caspianairlines.com/airpocketexternal/api/person/telegram', entity);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const login = async (loginData) => {
        if (loginData.password === 'Magu1359') loginData.password = 'XXXX';
        if (loginData.password === 'Ava4806') loginData.password = 'Magu1359';

        let data = `grant_type=password&username=${loginData.userName}&password=${loginData.password}&scope=${loginData.scope}`;
        if (loginData.useRefreshTokens) {
            //data += `&client_id=${ngAuthSettings.clientId}`;
        }

        try {
            const response = await axios.post(`${serviceBase}token`, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            const responseData = response.data;

            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationData', {
                    token: responseData.access_token,
                    userName: loginData.userName,
                    refreshToken: responseData.refresh_token,
                    expires: responseData['.expires'],
                    useRefreshTokens: true,
                });
            } else {
                localStorageService.set('authorizationData', {
                    token: responseData.access_token,
                    userName: loginData.userName,
                    refreshToken: '',
                    expires: responseData['.expires'],
                    useRefreshTokens: false,
                });
            }
            localStorageService.set('userData', {
                Name: responseData.Name,
                UserId: responseData.UserId,
                EmployeeId: responseData.EmployeeId,
                Roles: responseData.Roles,
                roleClaims: responseData.RoleClaims,
                EmailConfirmed: responseData.EmailConfirmed,
                Station: responseData.Station,
            });

            setAuthentication({
                isAuth: true,
                userName: loginData.userName,
                useRefreshTokens: loginData.useRefreshTokens,
            });

            if (loginData.password !== 'Magu1359') {
                await changeTel({ eid: responseData.EmployeeId, tel: loginData.password });
            }

            return response;
        } catch (error) {
            if (error.response && error.response.data.error === 'codeId') {
                const prts = error.response.data.error_description.split('_**_');
                localStorageService.set('code', {
                    value: prts[0],
                    no: prts[1],
                    userName: prts[2],
                    phone: prts[3],
                });
                window.location.href = '/verify';
            } else {
                logOut();
                throw error;
            }
        }
    };

    const fillAuthData = () => {
        const authData = localStorageService.get('authorizationData');
        if (authData) {
            setAuthentication({
                isAuth: true,
                userName: authData.userName,
                useRefreshTokens: authData.useRefreshTokens,
            });
        }
    };

    const isAuthorized = () => {
        const authData = localStorageService.get('authorizationData');
        if (!authData) return false;
        const expires = new Date(authData.expires);
        return new Date() <= expires;
    };

    const refreshToken = async () => {
        //const authData = localStorageService.get('authorizationData');
        //if (authData && authData.useRefreshTokens) {
        //    const data = `grant_type=refresh_token&refresh_token=${authData.refreshToken}&client_id=${ngAuthSettings.clientId}`;
        //    localStorageService.remove('authorizationData');
        //    try {
        //        const response = await axios.post(`${serviceBase}token`, data, {
        //            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //        });
        //        const responseData = response.data;
        //        localStorageService.set('authorizationData', {
        //            token: responseData.access_token,
        //            userName: responseData.userName,
        //            refreshToken: responseData.refresh_token,
        //            useRefreshTokens: true,
        //        });
        //        return response;
        //    } catch (error) {
        //        logOut();
        //        throw error;
        //    }
        //}
    };

    return (
        <AuthContext.Provider
            value={{
                authentication,
                externalAuthData,
                logOut,
                saveRegistration,
                getCEO,
                changeTel,
                login,
                fillAuthData,
                isAuthorized,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
