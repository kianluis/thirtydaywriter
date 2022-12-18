export default class ChaptersAPI {
    static getAllChapters() {
        const chapters = JSON.parse(localStorage.getItem("chaptersapp-chapters") || "[]");

        return chapters.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        const chapters = ChaptersAPI.getAllChapters();
        const existing = chapters.find(note => note.id == noteToSave.id);

        // Edit/Update
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            chapters.push(noteToSave);
        }

        localStorage.setItem("chaptersapp-chapters", JSON.stringify(chapters));
    }

    static deleteNote(id) {
        const chapters = ChaptersAPI.getAllChapters();
        const newChapters = chapters.filter(note => note.id != id);

        localStorage.setItem("chaptersapp-chapters", JSON.stringify(newChapters));
    }
}
