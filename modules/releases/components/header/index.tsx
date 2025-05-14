import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import ReleasesSuperFilter from './releases-super-filter';

type Props = {};

export default function ReleasesHeader({}: Props) {
    return (
        <AppHeader>
            <AppHeaderGroup>
                <ReleasesSuperFilter />
            </AppHeaderGroup>
        </AppHeader>
    );
}
