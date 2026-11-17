import { isAxiosError } from 'axios';
import { moneyUpApi } from '../api';
import { secureStorageService } from '../storage/secure-store.storage';

//TODO: Mover logica al store




export const getUserBudgets = async () => {

    try {
        const token = await secureStorageService.getItem('token');

        const request = await moneyUpApi.get('/budgets', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return request.data;

    } catch (error: any) {
        if (error.response && isAxiosError(error)) {
            console.log(error.response.data)
        }

    }
}


export const createBudgetAction = async (name: string, amount: number | string) => {
    try {
        const token = await secureStorageService.getItem('token');

        const request = await moneyUpApi.post('/budgets',
            { name, amount }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return request.data;
        

    } catch (error: any) {
        if (error.response && isAxiosError(error)) {
            console.log(error.response.data);
        }
    }
} 