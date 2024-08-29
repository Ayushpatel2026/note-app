import { Note } from "./App";
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";


type NoteLayoutProps = {
    notes: Note[];
}

export function NoteLayout({notes}: NoteLayoutProps){
    // this takes the id from the URL
    const { id } = useParams();
    const note = notes.find(note => note.id === id);

    if (note === null){
        // replace makes sure we cannot get back to this page where note is null)
        return <Navigate to="/" replace/>
    }

    // this is a react router compoenent that renders the child components of the parent route
    // you can also pass props to the child components
    return <Outlet context={note}/>;
}

export function useNote(){
    // this function can be used inside the child components of NoteLayout
    // it returns the context of the parent NoteLayout
    return useOutletContext<Note>()
}