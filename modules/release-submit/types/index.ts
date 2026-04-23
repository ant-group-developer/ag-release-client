import { RELEASE_EXECUTION_STATUS } from '@/modules/release-executions/enums';
import { ReleasesData } from '@/modules/releases/types';
import { CommonAttribute } from '@/types/api';
import { RELEASE_SUBMIT_STATUS, RELEASE_SUBMIT_STEP_TYPE } from '../enums';

export interface ReleaseSubmitData extends CommonAttribute {
    releaseId: ReleasesData['id'];
    status: RELEASE_EXECUTION_STATUS;
    metadata: {
        input: {
            dspCodes: string[];
        };
        releaseSnapshot: ReleasesData;
    };
    summary: string | null;
    steps: {};
}

export interface ReleaseSubmitStepData extends CommonAttribute {
    releaseSubmitId: ReleaseSubmitData['id'];
    status: RELEASE_SUBMIT_STATUS;
    type: RELEASE_SUBMIT_STEP_TYPE;
}
