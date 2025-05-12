import { showNotification } from '@/helpers/messages-helper';
import { Button, Form, FormProps, Rate } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { PRODUCT_INFO_TAB } from '../../enums';
import { useCreateRatingComment } from '../../hooks/use-create-rating-comment';
import { OrderProduct } from '../../types';

interface Props extends FormProps {
    className?: string;
    activeTab?: string;
    imageData: OrderProduct | undefined;
    videoData: OrderProduct | undefined;
    sourceData: OrderProduct | undefined;
    showRating?: boolean;
}

export default function CommentForm({
    videoData,
    imageData,
    sourceData,
    activeTab,
    className,
    showRating = true,
    ...props
}: Props) {
    const messages = useTranslations();
    const [form] = useForm();
    const { createRatingComment, isPending } = useCreateRatingComment();
    const tooltipsRating = [
        <span key={1}>&nbsp;1&nbsp;</span>,
        <span key={2}>&nbsp;2&nbsp;</span>,
        <span key={3}>&nbsp;3&nbsp;</span>,
        <span key={4}>&nbsp;4&nbsp;</span>,
        <span key={5}>&nbsp;5&nbsp;</span>,
        <span key={6}>&nbsp;6&nbsp;</span>,
        <span key={7}>&nbsp;7&nbsp;</span>,
        <span key={8}>&nbsp;8&nbsp;</span>,
        <span key={9}>&nbsp;9&nbsp;</span>,
        '10',
    ] as unknown as string[];
    const onFinish = (values: any) => {
        let typeRatingComment;

        switch (activeTab) {
            case PRODUCT_INFO_TAB.VIDEO:
                typeRatingComment = videoData;
                break;
            case PRODUCT_INFO_TAB.IMAGE:
                typeRatingComment = imageData;
                break;
            case PRODUCT_INFO_TAB.SOURCE:
                typeRatingComment = sourceData;
                break;
            default:
                break;
        }
        if (!typeRatingComment)
            return showNotification(
                'info',
                messages('order.message.selectCommentImageOrVideo')
            );

        const payload = {
            ...values,
            orderProductId: typeRatingComment.id,
        };
        if (payload.rate === 0) {
            delete payload.rate;
        }
        const variables = {
            payload: {
                ...payload,
            },
            onSuccess: () => form.resetFields(),
        };
        createRatingComment(variables);
    };

    const CustomValidateComment = (value: string) => {
        const trimmedValue = value?.trim() || '';

        if (!trimmedValue) {
            return Promise.reject(new Error(messages('validation.input')));
        }

        // Kiểm tra ít nhất 2 ký tự chữ cái
        const letterCount = (trimmedValue.match(/[a-zA-Z]/g) || []).length;
        if (letterCount < 2) {
            return Promise.reject(
                new Error(messages('validation.minWithValid', { number: 2 }))
            );
        }

        // Kiểm tra tối thiểu 5 ký tự
        if (trimmedValue.length < 5) {
            return Promise.reject(
                new Error(
                    messages('validation.min', {
                        number: 5,
                    })
                )
            );
        }

        return Promise.resolve();
    };

    return (
        <div className={className}>
            <div className="relative">
                <Form form={form} {...props} onFinish={onFinish}>
                    {showRating && (
                        <Form.Item
                            name="rate"
                            className="!mb-2 flex items-center justify-center"
                            // rules={
                            //     [
                            //         // {
                            //         //     required: true,
                            //         //     message: messages('validation.input'),
                            //         // },
                            //         // {
                            //         //     validator: (_, value) => {
                            //         //         if (value && value > 0) {
                            //         //             return Promise.resolve();
                            //         //         }
                            //         //         return Promise.reject(
                            //         //             new Error(
                            //         //                 messages('validation.min', {
                            //         //                     number: 1,
                            //         //                 })
                            //         //             )
                            //         //         );
                            //         //     },
                            //         // },
                            //     ]
                            // }
                        >
                            <Rate count={10} tooltips={tooltipsRating} />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="comment"
                        className="!mb-2"
                        required
                        rules={[
                            {
                                max: 150,
                                message: messages('validation.max', {
                                    number: 150,
                                }),
                            },
                            {
                                validator: (_, value) =>
                                    CustomValidateComment(value),
                            },
                        ]}
                    >
                        <TextArea
                            placeholder={messages('rating.rating&comment')}
                            autoSize={{ minRows: 3, maxRows: 7 }}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPending}
                            >
                                {messages('common.comment')}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <span className="absolute bottom-5 left-0 text-xs italic">
                    {messages('order.message.ratingBelow5Star')}
                </span>
            </div>
        </div>
    );
}
