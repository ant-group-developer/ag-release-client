import Forbidden from './forbidden';
import InternalServerError from './internal-server-error';
import NotFound from './not-found';

type Props = {
    error?: any;
    status?: number;
};

function AppError({ error, status }: Props) {
    if (!error && !status) return null;

    const statusCode = error?.status || error?.response?.status || status;

    if (statusCode === 403) {
        return <Forbidden className="min-h-fit py-24" />;
    }

    if (statusCode === 404) {
        return <NotFound className="min-h-fit py-24" />;
    }

    return <InternalServerError className="min-h-fit py-24" />;
}

export default AppError;
