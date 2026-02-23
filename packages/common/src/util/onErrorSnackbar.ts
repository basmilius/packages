import { isRequestError } from '@basmilius/http-client';
import { showSnackbar } from '@flux-ui/components';
import onError from './onError';

export default <T extends Function>() => onError<T>(err => {
    if (!isRequestError(err)) {
        throw err;
    }

    showSnackbar({
        color: 'danger',
        icon: 'circle-exclamation',
        message: err.errorDescription
    });
});
