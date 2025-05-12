import { TopicData } from '../types';

export function updateChildrenKey(data: TopicData[], newKey: string): any[] {
    return data.map((category) => {
        const updatedCategory: any = {
            ...category,
            [newKey]: category.children
                ? updateChildrenKey(category.children, newKey)
                : undefined, // đổi children thành key truyền vào
        };
        delete updatedCategory.children; // xóa children khỏi object
        return updatedCategory;
    });
}

export function removeEmptyChildren(topics: TopicData[]): TopicData[] {
    return topics.reduce<TopicData[]>((filteredTopics, topic) => {
        // Nếu topic có thuộc tính children là mảng và có độ dài bằng 0, loại bỏ luôn topic này
        if (Array.isArray(topic.children) && topic.children.length === 0) {
            return filteredTopics;
        }

        // Nếu topic có children, áp dụng đệ quy để lọc các phần tử con
        const newTopic = { ...topic };
        if (Array.isArray(newTopic.children)) {
            newTopic.children = removeEmptyChildren(newTopic.children);
            // Sau khi lọc, nếu children trở nên rỗng thì loại bỏ luôn topic này
            if (newTopic.children.length === 0) {
                return filteredTopics;
            }
        }

        filteredTopics.push(newTopic);
        return filteredTopics;
    }, []);
}
