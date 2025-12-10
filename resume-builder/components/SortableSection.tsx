
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PopOutSectionWrapper } from "./PopOutSectionWrapper";

interface SortableSectionProps {
    id: string;
    title: string;
    sectionKey: string;
    isVisible: boolean;
    isFirst: boolean;
    isLast: boolean;
    onToggle: () => void;
    onDelete?: () => void;
    children: React.ReactNode;
}

export function SortableSection({
    id,
    title,
    sectionKey,
    isVisible,
    isFirst,
    isLast,
    onToggle,
    onDelete,
    children,
}: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: isDragging ? "relative" as const : undefined,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <PopOutSectionWrapper
            title={title}
            sectionKey={sectionKey}
            isVisible={isVisible}
            isFirst={isFirst}
            isLast={isLast}
            isMoving={isDragging}
            onToggle={onToggle}
            onDelete={onDelete}
            dragListeners={listeners}
            dragAttributes={attributes}
            setNodeRef={setNodeRef}
            dragStyle={style}
        >
            {children}
        </PopOutSectionWrapper>
    );
}
