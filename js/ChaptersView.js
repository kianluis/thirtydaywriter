export default class ChaptersView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="chapters__sidebar">
                <button class="chapters__add" type="button">Add Note</button>
                <div class="chapters__list"></div>
            </div>
            <div class="chapters__preview">
                <input class="chapters__title" type="text" placeholder="New Note...">
                <textarea class="chapters__body">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".chapters__add");
        const inpTitle = this.root.querySelector(".chapters__title");
        const inpBody = this.root.querySelector(".chapters__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="chapters__list-item" data-note-id="${id}">
                <div class="chapters__small-title">${title}</div>
                <div class="chapters__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="chapters__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(chapters) {
        const chaptersListContainer = this.root.querySelector(".chapters__list");

        // Empty list
        chaptersListContainer.innerHTML = "";

        for (const note of chapters) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            chaptersListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        chaptersListContainer.querySelectorAll(".chapters__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".chapters__title").value = note.title;
        this.root.querySelector(".chapters__body").value = note.body;

        this.root.querySelectorAll(".chapters__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("chapters__list-item--selected");
        });

        this.root.querySelector(`.chapters__list-item[data-note-id="${note.id}"]`).classList.add("chapters__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".chapters__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
