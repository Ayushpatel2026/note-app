import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from 'react-select';
import { Tag } from "./App";
import { useMemo, useState } from "react";
import styles from './NoteList.module.css';

type NoteListProps = {
    availableTags: Tag[];
    notes: SimplifiedNote[];
}

type SimplifiedNote = {
    id: string;
    title: string;
    tags: Tag[];
}

export function NoteList({availableTags, notes} : NoteListProps){
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');

    /* calculate the filtered Notes each time the notes, selectedTags or title change
       filter by title and selected tags, note needs to have all the tags we have selected
    */
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLowerCase()))
             && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
            ;
        })
    }, [notes, selectedTags, title])

    return (
        <>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col es="auto">
                    <Stack direction="horizontal" gap={2}>
                        <Link to="/new">
                            <Button variant="primary">
                                Create
                            </Button>
                        </Link>
                        <Button variant="outline-secondary">
                            Edit Tags
                        </Button>
                    </Stack>
                </Col>
            </Row>

            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} 
                            onChange={e => setTitle(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect 
                                options={availableTags.map(tag => {
                                    return {value: tag.id, label: tag.label}
                                })}
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
            </Form>

            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => {
                    return (
                        <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    )
                })}
            </Row>
        </>
    );
}

function NoteCard ({id, title, tags}: SimplifiedNote){
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justtify-content-center h-100">
                    <span className="fs-5">
                        {title}
                    </span>
                    {tags.length > 0 && (
                        <Stack direction="horizontal" gap={1}
                        className="flex-wrap justify-content-center"
                        >
                            {tags.map(tag => {
                                return (
                                    <Badge key={tag.id}
                                        className="text-truncate"
                                    >
                                        {tag.label}
                                    </Badge>
                                )
                            })}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    );
}