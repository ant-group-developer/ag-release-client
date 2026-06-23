'use client';

import Forbidden from '@/modules/auth/components/forbidden';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import SystemReviewTab from '@/modules/releases/components/release-detail/system-review';

export default function SystemReviewPage() {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Forbidden className="min-h-[60vh]" />;
    }

    return <SystemReviewTab />;
}
