'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import AppContainer from '@/components/cms/app-container';
import { PAGE_SIZE } from '@/constants/page-size';
import { removeEmptyChildren } from '@/helpers/array';
import { useFilter } from '@/hooks/use-filter';
import { useLoading } from '@/hooks/use-loading';
import { GroupData } from '@/modules/group/types/data';
import GrantPermissionHeader from '@/modules/permission/components/grantPermissionHeader';
import GrantPermissionSidebar from '@/modules/permission/components/grantPermissionSidebar';
import GrantPermissionTable from '@/modules/permission/components/grantPermissionTable';
import { PERMISSION_BASE_ON } from '@/modules/permission/constants';
import {
    useGetGroupPermission,
    useGetUserPermission,
} from '@/modules/permission/hooks/useGetPermission';
import { useUpdateGroupPermission } from '@/modules/permission/hooks/useUpdateGroupPermission';
import { useUpdateUserPermission } from '@/modules/permission/hooks/useUpdateUserPermission';
import {
    DataFilterPermission,
    PermissionData,
} from '@/modules/permission/types/data';
import { UpdatePermissionPayload } from '@/modules/permission/types/update';
import { useTopicListAll } from '@/modules/topic/hooks/use-get-topic';
import { TopicData } from '@/modules/topic/types';
import { UserData } from '@/modules/user/types/data';

import _ from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

type Props = {};

function Permission({}: Props) {
    const messages = useTranslations();

    const { updateUserPermission } = useUpdateUserPermission();
    const { updateGroupPermission } = useUpdateGroupPermission();

    const [topicSelectedRowKeys, setTopicSelectedRowKeys] = useState<any[]>([]);
    const { data: dataTopic } = useTopicListAll();
    const loading = useLoading();

    const onChangeSelectedKeysTopic = (
        record: TopicData,
        selected: boolean,
        selectedRows: TopicData[]
    ) => {
        const parentKeys = selectedRows
            .filter((item) => item.parent)
            .map((item) => item.parent?.id);
        let selectedRowKeys = selectedRows.map((item) => item.id);

        // Xu ly khi tich cha
        if (record.children) {
            const childKeys = record.children.map((item) => item.id);
            if (selected) {
                selectedRowKeys = _.union(selectedRowKeys, childKeys);
            } else {
                selectedRowKeys = _.difference(selectedRowKeys, childKeys);
            }
        }

        // Xu ly khi tich con
        if (record.parent) {
            if (selected) {
                selectedRowKeys = _.union(selectedRowKeys, [record.parent?.id]);
            } else {
                if (!parentKeys.includes(record.parent?.id)) {
                    selectedRowKeys = _.difference(selectedRowKeys, [
                        record.parent?.id,
                    ]);
                }
            }
        }

        setTopicSelectedRowKeys(selectedRowKeys);
    };

    const defaultFilter: DataFilterPermission = {
        page: 1,
        pageSize: PAGE_SIZE,
        groupId: undefined,
        userId: undefined,
        type: PERMISSION_BASE_ON.USER,
    };

    const { dataFilter, isReady, onChangeFilter } =
        useFilter<DataFilterPermission>(defaultFilter);

    const { groupId, userId, type } = dataFilter;

    const { dataUserPermission } = useGetUserPermission(
        userId as UserData['id'],
        Boolean(isReady && type === PERMISSION_BASE_ON.USER && userId)
    );

    const { dataGroupPermission } = useGetGroupPermission(
        groupId as GroupData['id'],
        Boolean(isReady && type === PERMISSION_BASE_ON.GROUP && groupId)
    );

    const onSubmit = () => {
        const payload: UpdatePermissionPayload = {
            listTopicId: topicSelectedRowKeys,
        };

        if (type === PERMISSION_BASE_ON.USER) {
            updateUserPermission({
                userId: userId as UserData['id'],
                payload,
            });

            return;
        }

        updateGroupPermission({
            groupId: groupId as GroupData['id'],
            payload,
        });
    };

    useEffect(() => {
        const getSelectedKeys = () => {
            let dataPermission: PermissionData;

            if (type === PERMISSION_BASE_ON.USER) {
                dataPermission = dataUserPermission;
            } else {
                dataPermission = dataGroupPermission;
            }

            const { topic } = dataPermission;

            setTopicSelectedRowKeys(topic);
        };

        getSelectedKeys();
    }, [
        JSON.stringify(dataUserPermission),
        JSON.stringify(dataGroupPermission),
        JSON.stringify(dataFilter),
    ]);

    return (
        <AppContainer
            appTitle={messages('user.permission')}
            sidebarContent={
                <GrantPermissionSidebar
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />
            }
        >
            <GrantPermissionHeader
                disabled={!groupId && !userId}
                onSubmit={onSubmit}
            />
            <GrantPermissionTable
                topicDataSource={removeEmptyChildren(dataTopic)}
                loading={loading}
                topicRowSelection={{
                    selectedRowKeys: topicSelectedRowKeys,
                    getCheckboxProps: () => ({ indeterminate: true }),
                    onSelect: onChangeSelectedKeysTopic,
                    onSelectAll: (selected, selectedRows) =>
                        setTopicSelectedRowKeys(
                            selectedRows.map((item) => item.id)
                        ),
                    renderCell: (
                        checked,
                        record: TopicData,
                        index,
                        originNode
                    ) => {
                        if (React.isValidElement(originNode)) {
                            let indeterminate = false;
                            if (record.children) {
                                const childKeys = record.children.map(
                                    (item) => item.id
                                );
                                if (
                                    checked &&
                                    _.difference(
                                        topicSelectedRowKeys,
                                        childKeys
                                    ).length !==
                                        topicSelectedRowKeys.length -
                                            childKeys.length
                                ) {
                                    indeterminate = true;
                                }
                            }
                            // Safely cast originNode to ReactElement so we can clone it.
                            return React.cloneElement(
                                originNode as React.ReactElement,
                                {
                                    indeterminate,
                                }
                            );
                        }
                        // If originNode is not a valid element, return it unchanged.
                        return originNode;
                    },
                }}
            />
        </AppContainer>
    );
}

export default Permission;
