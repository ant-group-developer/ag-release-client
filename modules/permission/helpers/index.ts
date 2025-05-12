import { TopicData } from '@/modules/topic/types';

export function buildRelationMaps(listTopic: TopicData[]) {
    const parentMap = new Map<TopicData['id'], TopicData['id'] | null>();
    const childrenMap = new Map<TopicData['id'], TopicData['id'][]>();

    // Khởi tạo childrenMap cho mọi node
    for (const item of listTopic) {
        parentMap.set(item.id, item.parent?.id || '');
        childrenMap.set(item.id, []); // khởi tạo mảng rỗng
    }

    // Xây dựng childrenMap dựa trên parentId
    for (const item of listTopic) {
        if (item.parent?.id) {
            const arr = childrenMap.get(item.parent?.id) || [];
            arr.push(item.id);
            childrenMap.set(item.parent?.id, arr);
        }
    }

    return { parentMap, childrenMap };
}

/**
 * Hàm đệ quy (hoặc dùng BFS/DFS) để lấy tất cả con (mọi cấp) của nodeId
 */
export function getAllChildren(
    childrenMap: Map<number, number[]>,
    nodeId: number,
    result: Set<number>
) {
    const childIds = childrenMap.get(nodeId) || [];
    for (const cid of childIds) {
        if (!result.has(cid)) {
            result.add(cid);
            getAllChildren(childrenMap, cid, result);
        }
    }
}

/**
 * Hàm đệ quy lấy tất cả cha (mọi cấp)
 */
export function getAllParents(
    parentMap: Map<number, number | null>,
    nodeId: number,
    result: Set<number>
) {
    const pid = parentMap.get(nodeId);
    if (pid) {
        result.add(pid);
        getAllParents(parentMap, pid, result);
    }
}
