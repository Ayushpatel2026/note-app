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
}

export function NoteForm({onSubmit, onAddTag, availableTags}: NoteFormProps){
    const titleRef = useRef<HTMLInputElement>(null);
    const markDownRef = useRef<HTMLTextAreaElement>(null);  
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required/>
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
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control required as="textarea" ref={markDownRef} rows={15}/>
                </Form.Group>
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                    <Button type="submit" variant="outline-primary">
                        Save
                    </Button>
                    <Link to="..">
                        <Button type="button" variant="outline-secondary">
                            Cancel
                        </Button>
                    </Link>
                </Stack>  
            </Stack>
        </Form>
    )
}