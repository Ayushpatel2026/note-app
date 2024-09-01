import { useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import CreatableReactSelect from 'react-select/creatable';
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from 'uuid';
import { useNavigate } from "react-router-dom";


type NoteFormProps = {
    onSubmit: (note: NoteData) => void;
    onAddTag: (tag: Tag) => void;
    availableTags: Tag[];
} & Partial<NoteData>;
// make note data optional, so we can use this in both new note and edit note

export function NoteForm({onSubmit, onAddTag, availableTags, title ="", markDown="", tags=[]}: NoteFormProps){
    const titleRef = useRef<HTMLInputElement>(null);
    const markDownRef = useRef<HTMLTextAreaElement>(null);  
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // the exclamations marks are used to tell TypeScript that the value is not null
        onSubmit({
            title: titleRef.current!.value,
            markDown: markDownRef.current!.value,
            tags: selectedTags
        });

        navigate('..');
    }

    const handleBold = () => formatText('**', '**');
    const handleItalic = () => formatText('*', '*');

    const formatText = (prefix: string, suffix: string) => {
        const textarea = markDownRef.current!;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const newText = prefix + selectedText + suffix;

        textarea.setRangeText(newText);
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required defaultValue={title}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect 
                                options={availableTags.map(tag => {
                                    return {value: tag.id, label: tag.label}
                                })}
                                onCreateOption={(label) => {
                                    const newTag = {id: uuidV4(), label};
                                    onAddTag(newTag);
                                    setSelectedTags(prev => [...prev, newTag]);
                                }}
                                value={selectedTags.map(tag => {
                                    return {value: tag.id, label: tag.label}
                                })} 
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return {id: tag.value, label: tag.label}
                                    }))
                                }}
                                isMulti/>
                        </Form.Group>
                    </Col>
                </Row>
                <Stack direction="horizontal" gap={2} className="justify-content-end" style={{ marginBottom: '-50px' }}>
                    <Button 
                        onClick={handleBold} 
                        style={{ 
                        padding: '5px', 
                        color: 'black', 
                        backgroundColor: 'transparent', 
                        border: 'none' 
                        }}>
                        <strong>B</strong>
                    </Button>
                    <Button 
                        onClick={handleItalic} 
                        style={{ 
                        padding: '5px', 
                        color: 'black', 
                        backgroundColor: 'transparent', 
                        border: 'none', 
                        fontStyle: 'italic' 
                        }}>
                        <em>I</em>
                    </Button>
                </Stack>
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control required as="textarea" ref={markDownRef} rows={15} defaultValue={markDown}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="outline-primary">
                        Save
                    </Button>
                    <Link to="..">
                        <Button type="button" variant="outline-danger">
                            Cancel
                        </Button>
                    </Link>
                </Stack>  
            </Stack>
        </Form>
    )
}