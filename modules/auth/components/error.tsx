import Forbidden from './forbidden';
import NotFound from './not-found';

type Props = {
    error: any;
};

function AppError({ error }: Props) {
    if (!error) return null;

    if (error?.status === 403) {
        return <Forbidden className="min-h-fit py-24" />;
    }

    return <NotFound className="min-h-fit py-24" />;
}

export default AppError;
