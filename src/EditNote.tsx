import { NoteForm } from './NoteForm';
import { NoteData, Tag } from './App';
import { useNote } from './NoteLayout';

type EditNoteProps = {
    onSubmit: (data: NoteData, id: string) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[]
}

export function EditNote({onSubmit, onAddTag, availableTags}: EditNoteProps){
    const note = useNote();
    return (
        <>
            <h1 className="mb-4">
                Edit Note
            </h1>
            <NoteForm 
            title={note.title}
            markDown={note.markDown}
            tags={note.tags}
            onSubmit={data => onSubmit(data, note.id)} onAddTag={onAddTag} availableTags={availableTags}/>
        </>
    )
}