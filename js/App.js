import ChaptersView from "./ChaptersView.js";
import ChaptersAPI from "./ChaptersAPI.js";

export default class App {
    constructor(root) {
        this.chapters = [];
        this.activeNote = null;
        this.view = new ChaptersView(root, this._handlers());

        this._refreshChapters();
    }

    _refreshChapters() {
        const chapters = ChaptersAPI.getAllChapters();

        this._setChapters(chapters);

        if (chapters.length > 0) {
            this._setActiveNote(chapters[0]);
        }
    }

    _setChapters(chapters) {
        this.chapters = chapters;
        this.view.updateNoteList(chapters);
        this.view.updateNotePreviewVisibility(chapters.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.chapters.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };

                ChaptersAPI.saveNote(newNote);
                this._refreshChapters();
            },
            onNoteEdit: (title, body) => {
                ChaptersAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._refreshChapters();
            },
            onNoteDelete: noteId => {
                ChaptersAPI.deleteNote(noteId);
                this._refreshChapters();
            },
        };
    }
}
