
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import {Navigate, Route, Routes} from 'react-router-dom'
import {NewNote} from './NewNote'
import { useLocalStorage } from './useLocalStorage'
import { useMemo } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { NoteList } from './NoteList'

export type Tag = {
  id: string;
  label: string;
}

export type Note = {
  id: string;
} & NoteData

export type NoteData = {
  title: string;
  markDown: string;
  tags: Tag[];
}

// TODO: what is the purpose of RawNote vs Note? 
export type RawNote = {
  id: string;
} & RawNoteData

export type RawNoteData = {
  title: string;
  markDown: string;
  tagIds: string[];
}

function App() {

  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  /* 
  A memo hook is used to memoize the value of a variable
  Memoization involves caching the results of complex logic 
  so that they can be reused instead of being reimplemented on every render.
  here, notesWithTags will be cached and only recalculated when the notes or tags change
  this hook is only called when the notes or tags change
  */
  const notesWithTags = useMemo(() =>{
    /* map over the notes (RawNotes) which have tagIds
    and return a new object with the actual tags added to the note
    To find the actual tags, filter through the tags array and return the tags that have an id that matches the tagIds of the note
    */
    return notes.map(note => {
      return {
        ...note,
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  // this function is used to create a new raw note from note data
  // the new raw note will have same data as the note data, but will have a random id, and tagIds instead of tags
  function onCreateNote({tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    })
  }


  function onAddTag(tag: Tag){
    setTags(prevTags => {
      return [...prevTags, tag]
    })
  }

  /* we can use the Routes component to define the routes of our application
    the Route component is used to define a route and the element prop is used to define the content of the route
    the path prop is used to define the path of the route
    the built in Navigate component is used to redirect the user to a different route
    in this case, if the user enters a route that does not exist (* means all paths), the user will be redirected to the home route
    */
  return (
    <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags}/>} />
          <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag}
          availableTags={tags}/>}/>
          <Route path="/:id">
            <Route index element={<h1>Show</h1>} />
            <Route path="edit" element={<h1>Edit</h1>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Container>
  )
}

export default App
